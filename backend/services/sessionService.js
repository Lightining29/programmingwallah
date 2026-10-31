import crypto from 'crypto';
import { getMySQLPool } from '../config/mysql.js';

// In-memory session store cache for ultra-fast validation and local resilience
const memorySessions = new Map();

const SESSION_TTL_HOURS = 24 * 7; // 7 days session lifespan
export const SESSION_COOKIE_NAME = 'macos_session_token';

/**
 * Hash raw token for secure database storage (prevents DB leak token impersonation)
 */
function hashToken(rawToken) {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

/**
 * Create a new stateful server session
 */
export async function createSession(userId, req = {}) {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(rawToken);
  const sessionId = `sess_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
  const expiresAt = new Date(Date.now() + SESSION_TTL_HOURS * 60 * 60 * 1000);

  const ipAddress = req.ip || req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress || '';
  const userAgent = (req.headers?.['user-agent'] || '').substring(0, 500);

  const sessionRecord = {
    id: sessionId,
    user_id: userId,
    token_hash: tokenHash,
    ip_address: ipAddress,
    user_agent: userAgent,
    expires_at: expiresAt,
    created_at: new Date()
  };

  // Cache in memory for instant lookups
  memorySessions.set(tokenHash, {
    sessionId,
    userId,
    expiresAt,
    createdAt: sessionRecord.created_at
  });

  // Persist to MySQL if available
  try {
    const pool = getMySQLPool();
    await pool.query(
      `INSERT INTO sessions (id, user_id, token_hash, ip_address, user_agent, expires_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [sessionId, userId, tokenHash, ipAddress, userAgent, expiresAt]
    );
  } catch (err) {
    // Falls back to in-memory store smoothly if MySQL is still provisioning
  }

  return {
    rawToken,
    sessionId,
    expiresAt
  };
}

/**
 * Validate session token against database and memory cache
 */
export async function validateSession(rawToken) {
  if (!rawToken || typeof rawToken !== 'string') return null;

  const tokenHash = hashToken(rawToken);
  const now = new Date();

  // 1. Fast path: Memory cache lookup
  if (memorySessions.has(tokenHash)) {
    const cached = memorySessions.get(tokenHash);
    if (new Date(cached.expiresAt) > now) {
      return {
        sessionId: cached.sessionId,
        userId: cached.userId,
        expiresAt: cached.expiresAt
      };
    } else {
      memorySessions.delete(tokenHash);
    }
  }

  // 2. Database verification
  try {
    const pool = getMySQLPool();
    const [rows] = await pool.query(
      `SELECT s.id, s.user_id, s.expires_at, u.username, u.display_name, u.role, u.is_suspended, u.avatar_url
       FROM sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.token_hash = ? AND s.expires_at > ?`,
      [tokenHash, now]
    );

    if (rows && rows.length > 0) {
      const row = rows[0];
      if (row.is_suspended) return null;

      // Update memory cache
      memorySessions.set(tokenHash, {
        sessionId: row.id,
        userId: row.user_id,
        expiresAt: row.expires_at
      });

      return {
        sessionId: row.id,
        userId: row.user_id,
        username: row.username,
        displayName: row.display_name,
        role: row.role,
        avatarUrl: row.avatar_url,
        expiresAt: row.expires_at
      };
    }
  } catch (err) {
    // Database query error
  }

  return null;
}

/**
 * Revoke active session token
 */
export async function revokeSession(rawToken) {
  if (!rawToken) return;
  const tokenHash = hashToken(rawToken);
  memorySessions.delete(tokenHash);

  try {
    const pool = getMySQLPool();
    await pool.query('DELETE FROM sessions WHERE token_hash = ?', [tokenHash]);
  } catch {}
}

/**
 * Revoke all sessions for a user (e.g. on password change)
 */
export async function revokeAllUserSessions(userId) {
  for (const [hash, sess] of memorySessions.entries()) {
    if (sess.userId === userId) {
      memorySessions.delete(hash);
    }
  }

  try {
    const pool = getMySQLPool();
    await pool.query('DELETE FROM sessions WHERE user_id = ?', [userId]);
  } catch {}
}

/**
 * Set Secure HttpOnly Session Cookie on Express Response
 */
export function setSessionCookie(res, rawToken, isPersistent = true) {
  const maxAge = isPersistent ? SESSION_TTL_HOURS * 60 * 60 * 1000 : undefined;
  res.cookie(SESSION_COOKIE_NAME, rawToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge
  });
}

/**
 * Clear Session Cookie
 */
export function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE_NAME, {
    path: '/'
  });
}

const sessionService = {
  createSession,
  validateSession,
  revokeSession,
  destroySession: revokeSession,
  revokeAllUserSessions,
  destroyUserSessions: revokeAllUserSessions,
  setSessionCookie,
  clearSessionCookie,
  SESSION_COOKIE_NAME
};

export default sessionService;
