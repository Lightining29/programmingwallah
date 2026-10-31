import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { getMySQLPool } from '../config/mysql.js';
import { hashPassword } from './passwordService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base directory for user personal file storage
const BASE_STORAGE_DIR = path.join(__dirname, '../../storage/users');

// In-memory fallback stores for high resilience
const inMemoryUsers = new Map();
const inMemoryDesktops = new Map();
const inMemoryWidgets = new Map();

/**
 * Standard macOS Home Directory Folders
 */
const HOME_DIRECTORIES = [
  'Desktop',
  'Documents',
  'Downloads',
  'Pictures',
  'Music',
  'Movies',
  'Applications'
];

/**
 * Initialize personal home directories for user on disk and database
 */
export async function initializeUserStorage(userId, username) {
  const userHomeDir = path.join(BASE_STORAGE_DIR, String(userId));

  try {
    fs.mkdirSync(userHomeDir, { recursive: true });

    for (const dirName of HOME_DIRECTORIES) {
      const fullDir = path.join(userHomeDir, dirName);
      fs.mkdirSync(fullDir, { recursive: true });
    }

    // Create a welcome file on Desktop
    const welcomeFilePath = path.join(userHomeDir, 'Desktop', 'Welcome.txt');
    if (!fs.existsSync(welcomeFilePath)) {
      const welcomeContent = `Welcome to macOS Sequoia Web Pro, ${username}!
==================================================
Your private, persistent operating environment is ready.

Included Enterprise Features:
- Complete MySQL Studio (MySQL 8.4 LTS)
- Isolated Database Workspace: macos_user_${userId}_*
- Personal Virtual File System (/home/${userId})
- Monaco Code Editor & Terminal
- Multi-Tab Safari Browser Engine
- Sonoma Desktop Widgets

Your files and databases are securely isolated and preserved.
`;
      fs.writeFileSync(welcomeFilePath, welcomeContent, 'utf-8');
    }

    // Persist default desktop in MySQL / memory
    await initializeUserDesktop(userId);

  } catch (err) {
    console.warn(`User storage initialization notice for ${userId}:`, err.message);
  }
}

/**
 * Initialize or get user desktop preferences
 */
export async function initializeUserDesktop(userId) {
  const defaultDesktop = {
    id: `desk_${userId}`,
    user_id: userId,
    wallpaper: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2560&q=80',
    wallpaper_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2560&q=80',
    theme: 'dark',
    dark_mode: true,
    dock_position: 'bottom',
    dock_size: 56,
    dock_magnification: true,
    accent_color: '#007aff',
    screen_brightness: 100,
    sound_volume: 85
  };

  inMemoryDesktops.set(String(userId), defaultDesktop);

  try {
    const pool = getMySQLPool();
    await pool.query(
      `INSERT IGNORE INTO user_desktops 
       (id, user_id, wallpaper_url, dark_mode, dock_position, dock_size, dock_magnification, accent_color)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        defaultDesktop.id,
        userId,
        defaultDesktop.wallpaper_url,
        defaultDesktop.dark_mode,
        defaultDesktop.dock_position,
        defaultDesktop.dock_size,
        defaultDesktop.dock_magnification,
        defaultDesktop.accent_color
      ]
    );
  } catch {}

  return defaultDesktop;
}

export async function getUserDesktop(userId) {
  const uid = String(userId);
  let desk = inMemoryDesktops.get(uid);

  try {
    const pool = getMySQLPool();
    const [rows] = await pool.query('SELECT * FROM user_desktops WHERE user_id = ?', [userId]);
    if (rows && rows.length > 0) {
      const r = rows[0];
      desk = {
        wallpaper: r.wallpaper_url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2560&q=80',
        wallpaper_url: r.wallpaper_url,
        theme: r.dark_mode ? 'dark' : 'light',
        dark_mode: Boolean(r.dark_mode),
        dock_position: r.dock_position || 'bottom',
        dock_size: r.dock_size || 56,
        dock_magnification: Boolean(r.dock_magnification),
        accent_color: r.accent_color || '#007aff',
        screen_brightness: r.screen_brightness || 100,
        sound_volume: r.sound_volume || 85
      };
      inMemoryDesktops.set(uid, desk);
    }
  } catch {}

  if (!desk) {
    desk = await initializeUserDesktop(userId);
  }
  return desk;
}

export async function updateUserDesktop(userId, updates = {}) {
  const uid = String(userId);
  const current = await getUserDesktop(userId);
  const merged = { ...current, ...updates };
  inMemoryDesktops.set(uid, merged);

  try {
    const pool = getMySQLPool();
    await pool.query(
      `UPDATE user_desktops SET 
         wallpaper_url = COALESCE(?, wallpaper_url),
         dark_mode = COALESCE(?, dark_mode),
         dock_position = COALESCE(?, dock_position),
         dock_size = COALESCE(?, dock_size),
         accent_color = COALESCE(?, accent_color),
         updated_at = NOW()
       WHERE user_id = ?`,
      [
        updates.wallpaper || updates.wallpaper_url,
        updates.theme ? updates.theme === 'dark' : undefined,
        updates.dockPosition || updates.dock_position,
        updates.dockSize || updates.dock_size,
        updates.accentColor || updates.accent_color,
        userId
      ]
    );
  } catch {}

  return merged;
}

export async function listPublicUsers() {
  await seedDefaultUsers();
  const result = [];

  try {
    const pool = getMySQLPool();
    const [rows] = await pool.query('SELECT id, username, display_name, avatar_url, role, last_login_at FROM users WHERE is_active = 1');
    if (rows && rows.length > 0) {
      return rows.map(r => ({
        id: r.id,
        username: r.username,
        displayName: r.display_name,
        avatarUrl: r.avatar_url,
        role: r.role,
        lastLoginAt: r.last_login_at
      }));
    }
  } catch {}

  for (const user of inMemoryUsers.values()) {
    result.push({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      role: user.role,
      lastLoginAt: user.lastLoginAt
    });
  }

  return result;
}

export async function getUserByUsername(username) {
  const clean = String(username).toLowerCase().trim();
  let user = inMemoryUsers.get(clean);

  try {
    const pool = getMySQLPool();
    const [rows] = await pool.query('SELECT * FROM users WHERE LOWER(username) = ? LIMIT 1', [clean]);
    if (rows && rows.length > 0) {
      return rows[0];
    }
  } catch {}

  return user ? {
    id: user.id,
    username: user.username,
    display_name: user.displayName,
    email: user.email,
    password_hash: user.passwordHash,
    avatar_url: user.avatarUrl,
    role: user.role,
    home_directory: `/home/${user.id}`,
    is_active: true
  } : null;
}

export async function createUser({ username, displayName, password, avatarUrl, role = 'user' }) {
  const cleanUser = String(username).toLowerCase().trim();
  const userId = `usr_${crypto.randomBytes(6).toString('hex')}`;
  const passwordHash = await hashPassword(password);

  const newUserObj = {
    id: userId,
    username: cleanUser,
    displayName: displayName || cleanUser,
    email: `${cleanUser}@macos.local`,
    avatarUrl: avatarUrl || 'default',
    role,
    passwordHash
  };

  inMemoryUsers.set(cleanUser, newUserObj);

  try {
    const pool = getMySQLPool();
    await pool.query(
      `INSERT INTO users (id, username, email, password_hash, display_name, avatar_url, role)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, cleanUser, newUserObj.email, passwordHash, newUserObj.displayName, newUserObj.avatarUrl, role]
    );
  } catch {}

  await initializeUserStorage(userId, cleanUser);
  return {
    id: userId,
    username: cleanUser,
    display_name: newUserObj.displayName,
    avatar_url: newUserObj.avatarUrl,
    role
  };
}

export async function listUserFiles(userId, subpath = 'Desktop') {
  const userHomeDir = path.join(BASE_STORAGE_DIR, String(userId), subpath);
  if (!fs.existsSync(userHomeDir)) {
    fs.mkdirSync(userHomeDir, { recursive: true });
  }

  const items = fs.readdirSync(userHomeDir, { withFileTypes: true });
  return items.map(it => ({
    name: it.name,
    isDirectory: it.isDirectory(),
    path: path.join(subpath, it.name).replace(/\\/g, '/'),
    size: it.isFile() ? fs.statSync(path.join(userHomeDir, it.name)).size : 0,
    updatedAt: fs.statSync(path.join(userHomeDir, it.name)).mtime
  }));
}

export async function saveUserFile(userId, directory = 'Desktop', filename, content) {
  const targetDir = path.join(BASE_STORAGE_DIR, String(userId), directory);
  fs.mkdirSync(targetDir, { recursive: true });
  const fullPath = path.join(targetDir, filename);
  fs.writeFileSync(fullPath, content, 'utf-8');
  return {
    name: filename,
    path: path.join(directory, filename).replace(/\\/g, '/'),
    size: Buffer.byteLength(content, 'utf-8'),
    updatedAt: new Date()
  };
}

let seeded = false;
export async function seedDefaultUsers() {
  if (seeded) return;
  seeded = true;

  const defaultAccounts = [
    {
      id: 'usr_01net',
      username: '01net',
      displayName: '01net',
      email: '01net@macos.local',
      avatarUrl: 'bulb',
      role: 'admin',
      password: 'password123'
    },
    {
      id: 'usr_mirko',
      username: 'mirko',
      displayName: 'Mirko Roccia',
      email: 'mirko@macos.local',
      avatarUrl: 'guitar',
      role: 'user',
      password: 'password123'
    },
    {
      id: 'usr_developer',
      username: 'developer',
      displayName: 'AppleTree Developer',
      email: 'developer@macos.local',
      avatarUrl: 'code',
      role: 'admin',
      password: 'password123'
    }
  ];

  for (const acc of defaultAccounts) {
    const pHash = await hashPassword(acc.password);
    inMemoryUsers.set(acc.username, {
      id: acc.id,
      username: acc.username,
      displayName: acc.displayName,
      email: acc.email,
      avatarUrl: acc.avatarUrl,
      role: acc.role,
      passwordHash: pHash
    });

    try {
      const pool = getMySQLPool();
      await pool.query(
        `INSERT IGNORE INTO users (id, username, email, password_hash, display_name, avatar_url, role)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [acc.id, acc.username, acc.email, pHash, acc.displayName, acc.avatarUrl, acc.role]
      );
    } catch {}

    await initializeUserStorage(acc.id, acc.username);
  }
}

const userDesktopService = {
  initializeUserStorage,
  initializeUserDesktop,
  getUserDesktop,
  updateUserDesktop,
  listPublicUsers,
  getUserByUsername,
  createUser,
  listUserFiles,
  saveUserFile,
  seedDefaultUsers,
  inMemoryUsers
};

export default userDesktopService;
