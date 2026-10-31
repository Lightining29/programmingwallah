import express from 'express';
import mysqlProvisioningService from '../services/mysqlProvisioningService.js';
import { requireMacAuth, optionalMacAuth } from '../middleware/macAuthMiddleware.js';

const router = express.Router();

// GET /api/macos/mysql/status - MySQL Server status, uptime, performance metrics
router.get('/status', optionalMacAuth, async (req, res) => {
  try {
    const metrics = await mysqlProvisioningService.getServerMetrics();
    res.json({ success: true, metrics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/macos/mysql/connections - MySQL Client process list
router.get('/connections', optionalMacAuth, async (req, res) => {
  try {
    const connections = await mysqlProvisioningService.getClientConnections();
    res.json({ success: true, connections });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/macos/mysql/databases - List databases accessible to user
router.get('/databases', optionalMacAuth, async (req, res) => {
  try {
    const userId = req.macUser?.id || 1;
    const isAdmin = req.macUser?.role === 'admin';
    const databases = await mysqlProvisioningService.getUserDatabases(userId, isAdmin);
    res.json({ success: true, databases });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/macos/mysql/databases - Create new database
router.post('/databases', optionalMacAuth, async (req, res) => {
  try {
    const userId = req.macUser?.id || 1;
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Database name required' });
    
    const result = await mysqlProvisioningService.createDatabase(userId, name);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/macos/mysql/databases/:dbName/schema - Schema tree (tables, columns, indexes)
router.get('/databases/:dbName/schema', optionalMacAuth, async (req, res) => {
  try {
    const userId = req.macUser?.id || 1;
    const { dbName } = req.params;
    const schema = await mysqlProvisioningService.getSchemaTree(userId, dbName);
    res.json({ success: true, schema });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/macos/mysql/query - Execute real SQL query
router.post('/query', optionalMacAuth, async (req, res) => {
  try {
    const userId = req.macUser?.id || 1;
    const { database, sql, limit } = req.body;
    
    if (!sql || !sql.trim()) {
      return res.status(400).json({ success: false, message: 'SQL query cannot be empty.' });
    }

    const result = await mysqlProvisioningService.executeQuery(userId, database, sql, limit || 1000);
    res.json(result);
  } catch (error) {
    console.error('[macMySQL] query error:', error.message);
    res.status(400).json({
      success: false,
      error: error.message,
      errorCode: error.code || 'ER_PARSE_ERROR',
      errno: error.errno || 1064,
      sqlState: error.sqlState || '42000'
    });
  }
});

export default router;
