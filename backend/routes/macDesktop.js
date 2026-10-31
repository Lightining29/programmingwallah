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

// PUT /api/macos/desktop/state - Update user's wallpaper, dock, theme, widgets
router.put('/state', optionalMacAuth, async (req, res) => {
  try {
    const userId = req.macUser?.id || 1;
    const { wallpaper, theme, dockSize, dockPosition, widgets, settings } = req.body;
    const updated = await userDesktopService.updateUserDesktop(userId, {
      wallpaper,
      theme,
      dockSize,
      dockPosition,
      widgets,
      settings
    });
    res.json({ success: true, desktop: updated });
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
