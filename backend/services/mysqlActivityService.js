import { EventEmitter } from 'events';

class MySQLActivityService extends EventEmitter {
  constructor() {
    super();
    this.maxLogs = 200;
    this.logs = [];
    this.subscribers = new Set();
    this.seq = 1;

    // Initial system boot event
    this.log({
      type: 'INFO',
      message: 'MySQL Studio execution engine initialized (MySQL 9.3 LTS Protocol)',
      context: {
        host: 'localhost',
        port: 3306,
        engine: 'InnoDB',
        protocol: 'Native MySQL2 Pool'
      }
    });
  }

  /**
   * Log a real event originating from MySQL operations
   */
  log({ type = 'INFO', message, context = null, userId = null, dbName = null }) {
    const now = new Date();
    const formattedTime = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ', ' + now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    const entry = {
      id: `act-${Date.now()}-${this.seq++}`,
      type: type.toUpperCase(), // 'INFO', 'WARNING', 'ERROR'
      time: formattedTime,
      timestamp: now.toISOString(),
      message,
      context,
      userId,
      database: dbName
    };

    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    // Broadcast to active SSE / WebSocket listeners
    this.emit('activity', entry);
    this.notifySubscribers(entry);

    return entry;
  }

  getLogs(limit = 100, filterType = null, search = '', userId = null) {
    let result = [...this.logs];
    if (userId) {
      result = result.filter(l => !l.userId || l.userId === userId || l.userId === 'all');
    }
    if (filterType && filterType !== 'ALL') {
      result = result.filter(l => l.type === filterType.toUpperCase());
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(l => 
        l.message.toLowerCase().includes(q) || 
        (l.context && JSON.stringify(l.context).toLowerCase().includes(q))
      );
    }
    return result.slice(0, limit);
  }

  clearLogs(userId = null) {
    if (userId) {
      this.logs = this.logs.filter(l => l.userId && l.userId !== userId);
    } else {
      this.logs = [];
    }
    return { success: true };
  }

  // SSE subscription management
  addSubscriber(res) {
    this.subscribers.add(res);
    res.on('close', () => {
      this.subscribers.delete(res);
    });
  }

  notifySubscribers(entry) {
    const payload = `data: ${JSON.stringify(entry)}\n\n`;
    for (const sub of this.subscribers) {
      try {
        sub.write(payload);
      } catch {
        this.subscribers.delete(sub);
      }
    }
  }
}

const mysqlActivityService = new MySQLActivityService();
export default mysqlActivityService;
