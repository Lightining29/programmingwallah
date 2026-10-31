import sessionService from '../services/sessionService.js';
import userDesktopService from '../services/userDesktopService.js';

// Parse raw cookie header safely
export const parseCookies = (req) => {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return {};
  const cookies = {};
  cookieHeader.split(';').forEach(pair => {
    const parts = pair.split('=');
    const key = parts[0]?.trim();
    const value = parts.slice(1).join('=').trim();
    if (key) {
      try {
        cookies[key] = decodeURIComponent(value);
      } catch {
        cookies[key] = value;
      }
    }
  });
  return cookies;
};

// Require authenticated macOS user
export const requireMacAuth = async (req, res, next) => {
  try {
    const cookies = parseCookies(req);
    const authHeader = req.headers.authorization;
    
    let token = null;
    if (cookies.macos_session) {
      token = cookies.macos_session;
    } else if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'No valid macOS session found. Please log in.'
      });
    }

    const session = await sessionService.validateSession(token);
    if (!session || !session.user) {
      return res.status(401).json({
        success: false,
        error: 'SessionExpired',
        message: 'Your macOS session has expired or is invalid.'
      });
    }

    req.macSession = session;
    req.macUser = session.user;
    req.rawSessionToken = token;
    next();
  } catch (error) {
    console.error('[macAuthMiddleware] Authentication error:', error);
    return res.status(500).json({
      success: false,
      error: 'AuthError',
      message: 'Failed to verify session authentication.'
    });
  }
};

// Optional auth - populates user if present, proceeds otherwise
export const optionalMacAuth = async (req, res, next) => {
  try {
    const cookies = parseCookies(req);
    const authHeader = req.headers.authorization;
    
    let token = null;
    if (cookies.macos_session) {
      token = cookies.macos_session;
    } else if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }

    if (token) {
      const session = await sessionService.validateSession(token);
      if (session && session.user) {
        req.macSession = session;
        req.macUser = session.user;
        req.rawSessionToken = token;
      }
    }
  } catch (err) {
    // Non-fatal for optional auth
  }
  next();
};

export default {
  requireMacAuth,
  optionalMacAuth,
  parseCookies
};
