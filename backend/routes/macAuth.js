import express from 'express';
import sessionService from '../services/sessionService.js';
import userDesktopService from '../services/userDesktopService.js';
import passwordService from '../services/passwordService.js';
import { requireMacAuth } from '../middleware/macAuthMiddleware.js';

const router = express.Router();

// Rate limiting & Login Attempt Tracking
const loginAttempts = new Map(); // username -> { count, lockedUntil }

function checkRateLimit(username) {
  const clean = String(username).toLowerCase().trim();
  const record = loginAttempts.get(clean);
  if (!record) return { allowed: true };

  const now = Date.now();
  if (record.lockedUntil && now < record.lockedUntil) {
    const secondsLeft = Math.ceil((record.lockedUntil - now) / 1000);
    return { 
      allowed: false, 
      message: `Too many failed password attempts. Account locked for ${secondsLeft} seconds.`,
      secondsLeft 
    };
  }

  if (record.lockedUntil && now >= record.lockedUntil) {
    loginAttempts.delete(clean);
    return { allowed: true };
  }

  return { allowed: true };
}

function recordFailedAttempt(username) {
  const clean = String(username).toLowerCase().trim();
  const record = loginAttempts.get(clean) || { count: 0, lockedUntil: null };
  record.count += 1;
  if (record.count >= 5) {
    record.lockedUntil = Date.now() + 30 * 1000; // 30 second lock out
  }
  loginAttempts.set(clean, record);
}

function clearFailedAttempts(username) {
  const clean = String(username).toLowerCase().trim();
  loginAttempts.delete(clean);
}

// GET /api/macos/auth/users - Public list of accounts to display on the macOS lock screen
router.get('/users', async (req, res) => {
  try {
    const users = await userDesktopService.listPublicUsers();
    res.json({ success: true, users });
  } catch (error) {
    console.error('[macAuth] list users error:', error);
    res.status(500).json({ success: false, error: 'Failed to list macOS users' });
  }
});

// POST /api/macos/auth/login - Log into macOS desktop with username and password
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    return res.status(400).json({ success: false, message: 'Username is required' });
  }

  // 1. Check Rate Limit Protection
  const rateLimit = checkRateLimit(username);
  if (!rateLimit.allowed) {
    return res.status(429).json({ 
      success: false, 
      message: rateLimit.message,
      secondsLeft: rateLimit.secondsLeft,
      rateLimited: true
    });
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ success: false, message: 'Please enter your password.' });
  }

  try {
    const user = await userDesktopService.getUserByUsername(username);
    if (!user) {
      recordFailedAttempt(username);
      return res.status(401).json({ success: false, message: 'Account not found on this Mac.' });
    }

    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'This macOS account is deactivated' });
    }

    // 2. Verify password with secure scrypt/Argon2id derivation
    const isMatch = await passwordService.verifyPassword(password, user.password_hash);
    if (!isMatch) {
      recordFailedAttempt(username);
      const curRecord = loginAttempts.get(String(username).toLowerCase().trim());
      const remainingAttempts = Math.max(0, 5 - (curRecord?.count || 0));
      return res.status(401).json({ 
        success: false, 
        message: remainingAttempts > 0 
          ? `Incorrect password. ${remainingAttempts} attempts remaining.` 
          : 'Incorrect password. Account locked for 30 seconds.'
      });
    }

    // Clear failed attempts on success
    clearFailedAttempts(username);

    // 3. Create persistent session
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'macOS Web Client';
    const { token, expiresAt } = await sessionService.createSession(user.id, { ipAddress, userAgent });

    // 4. Set HttpOnly secure session cookie
    sessionService.setSessionCookie(res, token, expiresAt);

    // 5. Load user personal desktop preferences
    const desktopState = await userDesktopService.getUserDesktop(user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.display_name,
        role: user.role,
        avatarUrl: user.avatar_url,
        homeDir: user.home_directory
      },
      desktop: desktopState
    });
  } catch (error) {
    console.error('[macAuth] login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during authentication' });
  }
});

// POST /api/macos/auth/register - Create a new user account on the macOS system
router.post('/register', async (req, res) => {
  const { username, displayName, password, avatarUrl } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  try {
    const existing = await userDesktopService.getUserByUsername(username);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Username is already taken on this Mac' });
    }

    const newUser = await userDesktopService.createUser({
      username,
      displayName: displayName || username,
      password,
      avatarUrl
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        displayName: newUser.display_name,
        avatarUrl: newUser.avatar_url
      }
    });
  } catch (error) {
    console.error('[macAuth] register error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create user account' });
  }
});

// POST /api/macos/auth/logout - Terminate macOS session
router.post('/logout', async (req, res) => {
  const cookies = req.headers.cookie ? Object.fromEntries(
    req.headers.cookie.split(';').map(c => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    })
  ) : {};

  const token = cookies.macos_session || req.headers.authorization?.replace(/^Bearer\s+/, '');
  if (token) {
    await sessionService.destroySession(token);
  }

  sessionService.clearSessionCookie(res);
  res.json({ success: true, message: 'Successfully logged out from macOS' });
});

// GET /api/macos/auth/me - Get currently logged in macOS user details & preferences
router.get('/me', requireMacAuth, async (req, res) => {
  try {
    const desktop = await userDesktopService.getUserDesktop(req.macUser.id);
    res.json({
      success: true,
      user: {
        id: req.macUser.id,
        username: req.macUser.username,
        displayName: req.macUser.display_name,
        role: req.macUser.role,
        avatarUrl: req.macUser.avatar_url,
        homeDir: req.macUser.home_directory
      },
      desktop
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
