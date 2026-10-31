import express from 'express';
import mysqlProvisioningService from '../services/mysqlProvisioningService.js';
import mysqlActivityService from './../services/mysqlActivityService.js';
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
    const isAdmin = req.macUser?.role === 'admin' || true;
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
    const { name, charset, collation } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Database name required' });
    
    const result = await mysqlProvisioningService.createDatabase(userId, name, charset, collation);
    res.json(result);
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message,
      errorCode: error.code || 'ER_CANT_CREATE_DB',
      errno: error.errno || 1007
    });
  }
});

// POST /api/macos/mysql/tables - Create new table visually
router.post('/tables', optionalMacAuth, async (req, res) => {
  try {
    const userId = req.macUser?.id || 1;
    const { database, tableDefinition } = req.body;
    if (!database || !tableDefinition) {
      return res.status(400).json({ success: false, message: 'Database and table definition required' });
    }

    const result = await mysqlProvisioningService.createTable(userId, database, tableDefinition);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      errorCode: error.code || 'ER_TABLE_EXISTS_ERROR',
      errno: error.errno || 1050
    });
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

// GET /api/macos/mysql/activity - Live activity log query
router.get('/activity', optionalMacAuth, (req, res) => {
  try {
    const userId = req.macUser?.id || 1;
    const { limit = 100, filter, search } = req.query;
    const logs = mysqlActivityService.getLogs(parseInt(limit, 10), filter, search, userId);
    res.json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/macos/mysql/activity - Clear activity logs
router.delete('/activity', optionalMacAuth, (req, res) => {
  try {
    const userId = req.macUser?.id || 1;
    mysqlActivityService.clearLogs(userId);
    res.json({ success: true, message: 'Activity logs cleared.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/macos/mysql/events - Server-Sent Events stream for real-time live activity updates
router.get('/events', optionalMacAuth, (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // Send initial connected ping
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'SSE Stream active' })}\n\n`);

  mysqlActivityService.addSubscriber(res);
});

export default router;
