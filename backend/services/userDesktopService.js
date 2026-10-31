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
export async function initTables() {
  try {
    const pool = getMySQLPool();
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        username VARCHAR(64) UNIQUE NOT NULL,
        email VARCHAR(128) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        display_name VARCHAR(128) NOT NULL,
        avatar_url VARCHAR(255) DEFAULT 'default',
        role VARCHAR(32) DEFAULT 'user',
        home_directory VARCHAR(255),
        is_active TINYINT(1) DEFAULT 1,
        last_login_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_desktops (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) NOT NULL,
        wallpaper_url TEXT,
        wallpaper_fit VARCHAR(32) DEFAULT 'cover',
        theme VARCHAR(32) DEFAULT 'dark',
        dark_mode TINYINT(1) DEFAULT 1,
        accent_color VARCHAR(32) DEFAULT '#007aff',
        highlight_color VARCHAR(32) DEFAULT '#007aff',
        dock_position VARCHAR(32) DEFAULT 'bottom',
        dock_size INT DEFAULT 56,
        dock_magnification TINYINT(1) DEFAULT 1,
        dock_autohide TINYINT(1) DEFAULT 0,
        screen_brightness INT DEFAULT 100,
        sound_volume INT DEFAULT 85,
        is_muted TINYINT(1) DEFAULT 0,
        installed_dock_apps JSON,
        settings_json JSON,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_game_profiles (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) NOT NULL,
        game_id VARCHAR(64) NOT NULL,
        high_score INT DEFAULT 0,
        play_count INT DEFAULT 0,
        total_playtime_seconds INT DEFAULT 0,
        is_favorite TINYINT(1) DEFAULT 0,
        installed_to_dock TINYINT(1) DEFAULT 0,
        installed_to_apps TINYINT(1) DEFAULT 0,
        last_played_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_user_game (user_id, game_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  } catch (err) {
    console.warn('[userDesktopService initTables warn]', err.message);
  }
}

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
    wallpaper_fit: 'cover',
    theme: 'dark',
    dark_mode: true,
    dock_position: 'bottom',
    dock_size: 56,
    dock_magnification: true,
    dock_autohide: false,
    accent_color: '#007aff',
    highlight_color: '#007aff',
    screen_brightness: 100,
    sound_volume: 85,
    is_muted: false,
    installed_dock_apps: [],
    settings: {
      appearance: {
        mode: 'dark',
        accentColor: '#007aff',
        highlightColor: '#007aff',
        allowTinting: true,
        scrollbarMode: 'auto',
        scrollbarClick: 'page'
      },
      dock: {
        size: 56,
        magnification: true,
        position: 'bottom',
        autoHide: false,
        minimizeEffect: 'genie',
        recentApps: true
      },
      displays: {
        brightness: 100,
        resolutionScale: 'default',
        nightShift: false,
        trueTone: true
      },
      sound: {
        masterVolume: 85,
        isMuted: false,
        alertSound: 'Pop',
        soundEffects: true
      },
      network: {
        wifiEnabled: true,
        activeNetwork: 'AppleTree-5G Ultra-Fast'
      },
      bluetooth: {
        enabled: true
      },
      gameCenter: {
        nickname: 'AppleTree Pro Gamer',
        avatar: 'arcade',
        soundEffects: true
      }
    }
  };

  inMemoryDesktops.set(String(userId), defaultDesktop);

  try {
    const pool = getMySQLPool();
    await pool.query(
      `INSERT IGNORE INTO user_desktops 
       (id, user_id, wallpaper_url, wallpaper_fit, theme, dark_mode, dock_position, dock_size, dock_magnification, dock_autohide, accent_color, highlight_color, screen_brightness, sound_volume, is_muted, installed_dock_apps, settings_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        defaultDesktop.id,
        userId,
        defaultDesktop.wallpaper_url,
        defaultDesktop.wallpaper_fit,
        defaultDesktop.theme,
        defaultDesktop.dark_mode ? 1 : 0,
        defaultDesktop.dock_position,
        defaultDesktop.dock_size,
        defaultDesktop.dock_magnification ? 1 : 0,
        defaultDesktop.dock_autohide ? 1 : 0,
        defaultDesktop.accent_color,
        defaultDesktop.highlight_color,
        defaultDesktop.screen_brightness,
        defaultDesktop.sound_volume,
        defaultDesktop.is_muted ? 1 : 0,
        JSON.stringify(defaultDesktop.installed_dock_apps),
        JSON.stringify(defaultDesktop.settings)
      ]
    );
  } catch (err) {
    console.warn('[initializeUserDesktop insert warn]', err.message);
  }

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
      let installedDockApps = [];
      let settingsJson = {};
      try {
        installedDockApps = typeof r.installed_dock_apps === 'string' ? JSON.parse(r.installed_dock_apps) : (r.installed_dock_apps || []);
      } catch {}
      try {
        settingsJson = typeof r.settings_json === 'string' ? JSON.parse(r.settings_json) : (r.settings_json || {});
      } catch {}

      desk = {
        wallpaper: r.wallpaper_url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2560&q=80',
        wallpaper_url: r.wallpaper_url,
        wallpaper_fit: r.wallpaper_fit || 'cover',
        theme: r.dark_mode ? 'dark' : 'light',
        dark_mode: Boolean(r.dark_mode),
        dock_position: r.dock_position || 'bottom',
        dock_size: r.dock_size || 56,
        dock_magnification: Boolean(r.dock_magnification),
        dock_autohide: Boolean(r.dock_autohide),
        accent_color: r.accent_color || '#007aff',
        highlight_color: r.highlight_color || '#007aff',
        screen_brightness: r.screen_brightness !== undefined && r.screen_brightness !== null ? r.screen_brightness : 100,
        sound_volume: r.sound_volume !== undefined && r.sound_volume !== null ? r.sound_volume : 85,
        is_muted: Boolean(r.is_muted),
        installed_dock_apps: installedDockApps,
        settings: settingsJson
      };
      inMemoryDesktops.set(uid, desk);
    }
  } catch (err) {
    console.warn('[getUserDesktop warn]', err.message);
  }

  if (!desk) {
    desk = await initializeUserDesktop(userId);
  }
  return desk;
}

export async function updateUserDesktop(userId, updates = {}) {
  const uid = String(userId);
  const current = await getUserDesktop(userId);
  const merged = {
    ...current,
    ...updates,
    settings: {
      ...(current.settings || {}),
      ...(updates.settings || {})
    }
  };
  inMemoryDesktops.set(uid, merged);

  try {
    const pool = getMySQLPool();
    const wp = updates.wallpaper !== undefined ? updates.wallpaper : updates.wallpaper_url;
    const dm = updates.dark_mode !== undefined ? (updates.dark_mode ? 1 : 0) : (updates.theme !== undefined ? (updates.theme === 'dark' ? 1 : 0) : undefined);
    const dPos = updates.dock_position || updates.dockPosition;
    const dSize = updates.dock_size || updates.dockSize;
    const dMag = updates.dock_magnification !== undefined ? (updates.dock_magnification ? 1 : 0) : (updates.dockMagnification !== undefined ? (updates.dockMagnification ? 1 : 0) : undefined);
    const dHide = updates.dock_autohide !== undefined ? (updates.dock_autohide ? 1 : 0) : (updates.dockAutoHide !== undefined ? (updates.dockAutoHide ? 1 : 0) : undefined);
    const accCol = updates.accent_color || updates.accentColor;
    const highCol = updates.highlight_color || updates.highlightColor;
    const wpFit = updates.wallpaper_fit || updates.wallpaperFit;
    const br = updates.screen_brightness !== undefined ? updates.screen_brightness : updates.screenBrightness;
    const vol = updates.sound_volume !== undefined ? updates.sound_volume : updates.soundVolume;
    const muted = updates.is_muted !== undefined ? (updates.is_muted ? 1 : 0) : undefined;
    const dockApps = updates.installed_dock_apps !== undefined ? JSON.stringify(updates.installed_dock_apps) : undefined;
    const setJson = updates.settings !== undefined ? JSON.stringify(merged.settings) : undefined;

    await pool.query(
      `UPDATE user_desktops SET 
         wallpaper_url = COALESCE(?, wallpaper_url),
         wallpaper_fit = COALESCE(?, wallpaper_fit),
         dark_mode = COALESCE(?, dark_mode),
         dock_position = COALESCE(?, dock_position),
         dock_size = COALESCE(?, dock_size),
         dock_magnification = COALESCE(?, dock_magnification),
         dock_autohide = COALESCE(?, dock_autohide),
         accent_color = COALESCE(?, accent_color),
         highlight_color = COALESCE(?, highlight_color),
         screen_brightness = COALESCE(?, screen_brightness),
         sound_volume = COALESCE(?, sound_volume),
         is_muted = COALESCE(?, is_muted),
         installed_dock_apps = COALESCE(?, installed_dock_apps),
         settings_json = COALESCE(?, settings_json),
         updated_at = NOW()
       WHERE user_id = ?`,
      [
        wp,
        wpFit,
        dm,
        dPos,
        dSize,
        dMag,
        dHide,
        accCol,
        highCol,
        br,
        vol,
        muted,
        dockApps,
        setJson,
        userId
      ]
    );
  } catch (err) {
    console.warn('[updateUserDesktop warn]', err.message);
  }

  return merged;
}

export async function getUserGameProfiles(userId) {
  try {
    const pool = getMySQLPool();
    const [rows] = await pool.query('SELECT * FROM user_game_profiles WHERE user_id = ?', [userId]);
    return rows.map(r => ({
      gameId: r.game_id,
      highScore: r.high_score,
      playCount: r.play_count,
      totalPlaytimeSeconds: r.total_playtime_seconds,
      isFavorite: Boolean(r.is_favorite),
      installedToDock: Boolean(r.installed_to_dock),
      installedToApps: Boolean(r.installed_to_apps),
      lastPlayedAt: r.last_played_at
    }));
  } catch (err) {
    console.warn('[getUserGameProfiles warn]', err.message);
    return [];
  }
}

export async function recordGamePlay(userId, gameId, { score = 0, playtimeSeconds = 0 } = {}) {
  const profileId = `gp_${userId}_${gameId}`;
  try {
    const pool = getMySQLPool();
    await pool.query(
      `INSERT INTO user_game_profiles (id, user_id, game_id, high_score, play_count, total_playtime_seconds, last_played_at)
       VALUES (?, ?, ?, ?, 1, ?, NOW())
       ON DUPLICATE KEY UPDATE
         high_score = GREATEST(high_score, VALUES(high_score)),
         play_count = play_count + 1,
         total_playtime_seconds = total_playtime_seconds + VALUES(total_playtime_seconds),
         last_played_at = NOW(),
         updated_at = NOW()`,
      [profileId, userId, gameId, score, playtimeSeconds]
    );
    const [rows] = await pool.query('SELECT * FROM user_game_profiles WHERE user_id = ? AND game_id = ?', [userId, gameId]);
    return rows[0] || null;
  } catch (err) {
    console.warn('[recordGamePlay warn]', err.message);
    return null;
  }
}

export async function toggleGameFavorite(userId, gameId) {
  const profileId = `gp_${userId}_${gameId}`;
  try {
    const pool = getMySQLPool();
    await pool.query(
      `INSERT INTO user_game_profiles (id, user_id, game_id, is_favorite, last_played_at)
       VALUES (?, ?, ?, 1, NOW())
       ON DUPLICATE KEY UPDATE
         is_favorite = IF(is_favorite = 1, 0, 1),
         updated_at = NOW()`,
      [profileId, userId, gameId]
    );
    const [rows] = await pool.query('SELECT * FROM user_game_profiles WHERE user_id = ? AND game_id = ?', [userId, gameId]);
    return rows[0] || null;
  } catch (err) {
    console.warn('[toggleGameFavorite warn]', err.message);
    return null;
  }
}

export async function setGameDockStatus(userId, gameId, installed = true) {
  const profileId = `gp_${userId}_${gameId}`;
  try {
    const pool = getMySQLPool();
    await pool.query(
      `INSERT INTO user_game_profiles (id, user_id, game_id, installed_to_dock, last_played_at)
       VALUES (?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE
         installed_to_dock = ?,
         updated_at = NOW()`,
      [profileId, userId, gameId, installed ? 1 : 0, installed ? 1 : 0]
    );

    // Also update installed_dock_apps in user_desktops
    const current = await getUserDesktop(userId);
    let apps = Array.isArray(current.installed_dock_apps) ? [...current.installed_dock_apps] : [];
    if (installed) {
      if (!apps.includes(gameId)) apps.push(gameId);
    } else {
      apps = apps.filter(x => x !== gameId);
    }
    await updateUserDesktop(userId, { installed_dock_apps: apps });

    return { gameId, installedToDock: installed, dockApps: apps };
  } catch (err) {
    console.warn('[setGameDockStatus warn]', err.message);
    return null;
  }
}

export async function getUserStorageInfo(userId) {
  const userHomeDir = path.join(BASE_STORAGE_DIR, String(userId));
  let totalUserBytes = 0;
  let fileCount = 0;

  function calculateDir(dirPath) {
    try {
      if (!fs.existsSync(dirPath)) return;
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
          calculateDir(full);
        } else if (entry.isFile()) {
          fileCount++;
          totalUserBytes += fs.statSync(full).size;
        }
      }
    } catch {}
  }

  calculateDir(userHomeDir);

  return {
    totalDiskSpaceGB: 512,
    availableSpaceGB: 384,
    systemUsageGB: 46.2,
    developerToolsGB: 38.6,
    userStorageMB: (totalUserBytes / (1024 * 1024)).toFixed(2),
    userFileCount: fileCount,
    cloudSyncStatus: 'iCloud & Local Storage Active'
  };
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

  await initTables();

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
  initTables,
  initializeUserStorage,
  initializeUserDesktop,
  getUserDesktop,
  updateUserDesktop,
  getUserGameProfiles,
  recordGamePlay,
  toggleGameFavorite,
  setGameDockStatus,
  getUserStorageInfo,
  listPublicUsers,
  getUserByUsername,
  createUser,
  listUserFiles,
  saveUserFile,
  seedDefaultUsers,
  inMemoryUsers
};

export default userDesktopService;
