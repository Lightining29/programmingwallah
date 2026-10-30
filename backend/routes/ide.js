import express from 'express';
import { executeCode, executeTerminalCommand, aiAssist } from '../controllers/ideExecutionController.js';

const router = express.Router();

router.post('/execute', executeCode);
router.post('/command', executeTerminalCommand);
router.post('/ai', aiAssist);

export default router;
