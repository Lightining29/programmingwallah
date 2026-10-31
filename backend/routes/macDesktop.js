import express from 'express';
import userDesktopService from '../services/userDesktopService.js';
import { requireMacAuth, optionalMacAuth } from '../middleware/macAuthMiddleware.js';

const router = express.Router();

// GET /api/macos/desktop/state - Get user's saved desktop preferences
router.get('/state', optionalMacAuth, async (req, res) => {
  try {
    const userId = req.macUser?.id || 1;
    const desktop = await userDesktopService.getUserDesktop(userId);
    res.json({ success: true, desktop });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/macos/desktop/state - Update user's wallpaper, dock, theme, widgets, settings
router.put('/state', optionalMacAuth, async (req, res) => {
  try {
    const userId = req.macUser?.id || 1;
    const { 
      wallpaper, 
      wallpaper_url, 
      wallpaperFit, 
      wallpaper_fit,
      theme, 
      dark_mode,
      dockSize, 
      dock_size, 
      dockPosition, 
      dock_position, 
      dockMagnification,
      dock_magnification,
      dockAutoHide,
      dock_autohide,
      accentColor,
      accent_color,
      highlightColor,
      highlight_color,
      screenBrightness,
      screen_brightness,
      soundVolume,
      sound_volume,
      isMuted,
      is_muted,
      installed_dock_apps,
      widgets, 
      settings 
    } = req.body;

    const updated = await userDesktopService.updateUserDesktop(userId, {
      wallpaper: wallpaper || wallpaper_url,
      wallpaper_url: wallpaper || wallpaper_url,
      wallpaper_fit: wallpaperFit || wallpaper_fit,
      theme,
      dark_mode,
      dock_size: dockSize !== undefined ? dockSize : dock_size,
      dock_position: dockPosition || dock_position,
      dock_magnification: dockMagnification !== undefined ? dockMagnification : dock_magnification,
      dock_autohide: dockAutoHide !== undefined ? dockAutoHide : dock_autohide,
      accent_color: accentColor || accent_color,
      highlight_color: highlightColor || highlight_color,
      screen_brightness: screenBrightness !== undefined ? screenBrightness : screen_brightness,
      sound_volume: soundVolume !== undefined ? soundVolume : sound_volume,
      is_muted: isMuted !== undefined ? isMuted : is_muted,
      installed_dock_apps,
      widgets,
      settings
    });
    res.json({ success: true, desktop: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/macos/desktop/games - Get user game history, high scores, installed games
router.get('/games', optionalMacAuth, async (req, res) => {
  try {
    const userId = req.macUser?.id || 1;
    const profiles = await userDesktopService.getUserGameProfiles(userId);
    res.json({ success: true, games: profiles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/macos/desktop/games/:gameId/record - Record score and playtime
router.post('/games/:gameId/record', optionalMacAuth, async (req, res) => {
  try {
    const userId = req.macUser?.id || 1;
    const { gameId } = req.params;
    const { score, playtimeSeconds } = req.body;
    const profile = await userDesktopService.recordGamePlay(userId, gameId, { score, playtimeSeconds });
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/macos/desktop/games/:gameId/favorite - Toggle favorite game
router.post('/games/:gameId/favorite', optionalMacAuth, async (req, res) => {
  try {
    const userId = req.macUser?.id || 1;
    const { gameId } = req.params;
    const profile = await userDesktopService.toggleGameFavorite(userId, gameId);
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/macos/desktop/games/:gameId/dock - Install/Uninstall to Dock
router.post('/games/:gameId/dock', optionalMacAuth, async (req, res) => {
  try {
    const userId = req.macUser?.id || 1;
    const { gameId } = req.params;
    const { installed } = req.body;
    const result = await userDesktopService.setGameDockStatus(userId, gameId, installed !== false);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/macos/desktop/storage - Get real user storage breakdown
router.get('/storage', optionalMacAuth, async (req, res) => {
  try {
    const userId = req.macUser?.id || 1;
    const storageInfo = await userDesktopService.getUserStorageInfo(userId);
    res.json({ success: true, storage: storageInfo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/macos/desktop/files - Get files in user's isolated directory
router.get('/files', optionalMacAuth, async (req, res) => {
  try {
    const userId = req.macUser?.id || 1;
    const subpath = req.query.path || 'Desktop';
    const files = await userDesktopService.listUserFiles(userId, subpath);
    res.json({ success: true, files });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/macos/desktop/files - Write or update a file in user's directory
router.post('/files', optionalMacAuth, async (req, res) => {
  try {
    const userId = req.macUser?.id || 1;
    const { filename, content, directory } = req.body;
    if (!filename) return res.status(400).json({ success: false, message: 'Filename required' });

    const file = await userDesktopService.saveUserFile(userId, directory || 'Desktop', filename, content || '');
    res.json({ success: true, file });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
