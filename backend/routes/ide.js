import express from 'express';
import { 
  executeCode, 
  executeTerminalCommand, 
  aiAssist,
  getDiagnostics,
  stopExecution,
  sendProcessInput
} from '../controllers/ideExecutionController.js';

const router = express.Router();

router.get('/diagnostics', getDiagnostics);
router.get('/runtimes', getDiagnostics);
router.post('/execute', executeCode);
router.post('/command', executeTerminalCommand);
router.post('/stop', stopExecution);
router.post('/input', sendProcessInput);
router.post('/ai', aiAssist);

export default router;
