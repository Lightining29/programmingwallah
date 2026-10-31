import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Database, Play, RefreshCw, Server, Users, Shield, 
  Terminal, Search, ChevronRight, ChevronDown, Table, 
  Columns, Key, Download, Upload, StopCircle, CheckCircle2, 
  AlertCircle, FileText, Settings, Layers, Copy, Check, Filter,
  Plus, Trash2, Clock, Activity, Code2, AlertTriangle, XCircle, Info, Sparkles
} from 'lucide-react';
import { registerSqlLanguageProvider } from '../services/sqlLanguageService.js';

export default function MySQLStudioApp({ onClose }) {
  // Navigation & View Mode
  const [activeMainTab, setActiveMainTab] = useState('sql'); // 'sql', 'logs', 'dashboard', 'history'
  const [viewMode, setViewMode] = useState('database'); // 'database', 'visualization'

  // Query Tabs
  const [tabs, setTabs] = useState([
    {
      id: 'tab-1',
      title: 'SQL Editor',
      sql: `-- MySQL 9.3 Community Server
-- Write SQL queries below. Press Ctrl+Enter or Cmd+Enter to execute.

SELECT TABLE_NAME, TABLE_ROWS, DATA_LENGTH, CREATE_TIME
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE()
ORDER BY TABLE_NAME;`
    }
  ]);
  const [activeTabId, setActiveTabId] = useState('tab-1');

  // Schema & Databases
  const [databases, setDatabases] = useState([]);
  const [selectedDb, setSelectedDb] = useState('');
  const [schemaTree, setSchemaTree] = useState({ tables: [] });
  const [filterSchemaText, setFilterSchemaText] = useState('');
  const [expandedNodes, setExpandedNodes] = useState({ allTables: true });

  // Execution & Results
  const [isExecuting, setIsExecuting] = useState(false);
  const [resultSet, setResultSet] = useState(null);
  const [resultFilter, setResultFilter] = useState('');
  const [queryStatus, setQueryStatus] = useState('Idle'); // 'Idle', 'Running', 'Success', 'Error'
  const [lastQueryDuration, setLastQueryDuration] = useState('0.000');

  // Action Output Log (MySQL Workbench style)
  const [actionOutputs, setActionOutputs] = useState([]);

  // Server Metrics & Health
  const [serverMetrics, setServerMetrics] = useState(null);
  const [connections, setConnections] = useState([]);

  // Live Activity Logs (Image 4 style)
  const [activityLogs, setActivityLogs] = useState([]);
  const [logFilter, setLogFilter] = useState('ALL'); // 'ALL', 'ERROR', 'WARNING', 'INFO'
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [expandedLogContexts, setExpandedLogContexts] = useState({});
  const [copiedLogId, setCopiedLogId] = useState(null);

  // Modals
  const [isCreateDbOpen, setIsCreateDbOpen] = useState(false);
  const [newDbName, setNewDbName] = useState('');
  const [newDbCharset, setNewDbCharset] = useState('utf8mb4');
  const [newDbCollation, setNewDbCollation] = useState('utf8mb4_unicode_ci');
  const [isSubmittingDb, setIsSubmittingDb] = useState(false);
  const [modalError, setModalError] = useState('');

  const [isCreateTableOpen, setIsCreateTableOpen] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableColumns, setNewTableColumns] = useState([
    { name: 'id', type: 'INT', nullable: false, isPrimary: true, autoIncrement: true, defaultValue: '' },
    { name: 'name', type: 'VARCHAR(100)', nullable: false, isPrimary: false, autoIncrement: false, defaultValue: '' },
    { name: 'created_at', type: 'TIMESTAMP', nullable: false, isPrimary: false, autoIncrement: false, defaultValue: 'CURRENT_TIMESTAMP' }
  ]);
  const [isSubmittingTable, setIsSubmittingTable] = useState(false);

  // Monaco Editor Ref
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  // ── Fetch Databases ──
  const fetchDatabases = async () => {
    try {
      const res = await fetch('/api/macos/mysql/databases');
      const data = await res.json();
      if (data.success && Array.isArray(data.databases)) {
        setDatabases(data.databases);
        if (data.databases.length > 0 && !selectedDb) {
          // Choose pranidha_school or first available database
          const preferred = data.databases.find(d => d.name === 'pranidha_school' || d.name === 'students' || d.name === 'exam') || data.databases[0];
          setSelectedDb(preferred.name);
        }
      }
    } catch (e) {
      console.warn('[MySQL Studio] Database fetch failed:', e.message);
    }
  };

  // ── Fetch Schema for Database ──
  const fetchSchema = async (dbName) => {
    if (!dbName) return;
    try {
      const res = await fetch(`/api/macos/mysql/databases/${encodeURIComponent(dbName)}/schema`);
      const data = await res.json();
      if (data.success && data.schema) {
        setSchemaTree(data.schema);
      }
    } catch (e) {
      console.warn('[MySQL Studio] Schema fetch failed:', e.message);
    }
  };

  // ── Fetch Server Metrics ──
  const fetchServerMetrics = async () => {
    try {
      const res = await fetch('/api/macos/mysql/status');
      const data = await res.json();
      if (data.success && data.metrics) {
        setServerMetrics(data.metrics);
      }
    } catch (e) {
      console.warn('[MySQL Studio] Metrics fetch failed:', e.message);
    }
  };

  // ── Fetch Activity Logs ──
  const fetchActivityLogs = async () => {
    try {
      const res = await fetch(`/api/macos/mysql/activity?limit=100&filter=${logFilter}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.logs)) {
        setActivityLogs(data.logs);
      }
    } catch {}
  };

  // Initial load
  useEffect(() => {
    fetchDatabases();
    fetchServerMetrics();
    fetchActivityLogs();

    // SSE Real-time Live Activity Stream (Image 4)
    let eventSource = null;
    try {
      eventSource = new EventSource('/api/macos/mysql/events');
      eventSource.onmessage = (e) => {
        try {
          const entry = JSON.parse(e.data);
          if (entry && entry.id) {
            setActivityLogs(prev => [entry, ...prev.slice(0, 150)]);
          }
        } catch {}
      };
    } catch {}

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  // Sync schema when database changes
  useEffect(() => {
    if (selectedDb) {
      fetchSchema(selectedDb);
    }
  }, [selectedDb]);

  // Setup Monaco Completion Provider
  const handleEditorWillMount = (monaco) => {
    monacoRef.current = monaco;
    registerSqlLanguageProvider(
      monaco,
      () => schemaTree,
      () => selectedDb
    );
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    // Bind Ctrl+Enter and Cmd+Enter to execute query
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleExecuteQuery();
    });
  };

  // ── Execute SQL Query ──
  const handleExecuteQuery = async (customSql = null) => {
    const curTab = tabs.find(t => t.id === activeTabId);
    const sqlToRun = customSql || (curTab ? curTab.sql.trim() : '');
    if (!sqlToRun) return;

    setIsExecuting(true);
    setQueryStatus('Running');
    const execStartTime = new Date().toLocaleTimeString('en-US', { hour12: false });

    try {
      const res = await fetch('/api/macos/mysql/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          database: selectedDb,
          sql: sqlToRun,
          limit: 1000
        })
      });

      const data = await res.json();
      const durSec = data.executionTimeSec || '0.001';
      setLastQueryDuration(durSec);

      if (data.success) {
        setQueryStatus('Success');
        setResultSet(data);

        // If the query changed database context (e.g. USE college), update state
        if (data.activeDatabase && data.activeDatabase !== selectedDb) {
          setSelectedDb(data.activeDatabase);
        }

        // Add to Workbench Action Output Log
        setActionOutputs(prev => [
          {
            id: Date.now(),
            status: 'success',
            time: execStartTime,
            action: sqlToRun.length > 80 ? sqlToRun.substring(0, 80) + '...' : sqlToRun,
            response: data.responseMessage || `${data.rowCount || 0} row(s) returned`,
            duration: `${durSec} sec / ${data.fetchTimeSec || '0.000'} sec`
          },
          ...prev.slice(0, 40)
        ]);

        // Auto-refresh schema if DDL executed
        const upper = sqlToRun.toUpperCase();
        if (upper.includes('CREATE ') || upper.includes('DROP ') || upper.includes('ALTER ') || upper.includes('USE ')) {
          fetchDatabases();
          if (selectedDb) fetchSchema(selectedDb);
        }

        fetchActivityLogs();
      } else {
        setQueryStatus('Error');
        setActionOutputs(prev => [
          {
            id: Date.now(),
            status: 'error',
            time: execStartTime,
            action: sqlToRun.length > 80 ? sqlToRun.substring(0, 80) + '...' : sqlToRun,
            response: `Error Code: ${data.errno || 1064}. ${data.error || 'Syntax error'}`,
            duration: '0.001 sec / 0.000 sec'
          },
          ...prev.slice(0, 40)
        ]);
        fetchActivityLogs();
      }
    } catch (err) {
      setQueryStatus('Error');
      setActionOutputs(prev => [
        {
          id: Date.now(),
          status: 'error',
          time: execStartTime,
          action: sqlToRun,
          response: `Error: ${err.message}`,
          duration: '0.000 sec / 0.000 sec'
        },
        ...prev.slice(0, 40)
      ]);
    } finally {
      setIsExecuting(false);
    }
  };

  // ── Create Database ──
  const handleCreateDatabase = async (e) => {
    e.preventDefault();
    if (!newDbName.trim()) return;

    setIsSubmittingDb(true);
    setModalError('');

    try {
      const res = await fetch('/api/macos/mysql/databases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newDbName.trim(),
          charset: newDbCharset,
          collation: newDbCollation
        })
      });

      const data = await res.json();
      if (data.success) {
        setIsCreateDbOpen(false);
        setNewDbName('');
        await fetchDatabases();
        setSelectedDb(data.dbName);
        fetchActivityLogs();
      } else {
        setModalError(data.error || 'Failed to create database.');
      }
    } catch (err) {
      setModalError(err.message);
    } finally {
      setIsSubmittingDb(false);
    }
  };

  // ── Create Table Visually ──
  const handleCreateTable = async (e) => {
    e.preventDefault();
    if (!newTableName.trim() || !selectedDb) return;

    setIsSubmittingTable(true);
    setModalError('');

    try {
      const res = await fetch('/api/macos/mysql/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          database: selectedDb,
          tableDefinition: {
            tableName: newTableName.trim(),
            columns: newTableColumns
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        setIsCreateTableOpen(false);
        setNewTableName('');
        await fetchSchema(selectedDb);
        fetchActivityLogs();
      } else {
        setModalError(data.error || 'Failed to create table.');
      }
    } catch (err) {
      setModalError(err.message);
    } finally {
      setIsSubmittingTable(false);
    }
  };

  // Copy helper
  const handleCopyText = (text, id) => {
    navigator.clipboard?.writeText(text);
    setCopiedLogId(id);
    setTimeout(() => setCopiedLogId(null), 1800);
  };

  // Toggle log accordion
  const toggleLogContext = (id) => {
    setExpandedLogContexts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filtered Activity Logs (Image 4)
  const filteredActivityLogs = activityLogs.filter(log => {
    if (logFilter !== 'ALL' && log.type !== logFilter) return false;
    if (logSearchQuery.trim()) {
      const q = logSearchQuery.toLowerCase();
      const matchMsg = log.message.toLowerCase().includes(q);
      const matchCtx = log.context && JSON.stringify(log.context).toLowerCase().includes(q);
      return matchMsg || matchCtx;
    }
    return true;
  });

  const logCounts = {
    ALL: activityLogs.length,
    ERROR: activityLogs.filter(l => l.type === 'ERROR').length,
    WARNING: activityLogs.filter(l => l.type === 'WARNING').length,
    INFO: activityLogs.filter(l => l.type === 'INFO').length
  };

  // Filter tables in sidebar
  const visibleTables = (schemaTree.tables || []).filter(t => 
    !filterSchemaText || t.name.toLowerCase().includes(filterSchemaText.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-[#d4d4d4] font-sans select-none overflow-hidden text-xs">
      {/* ════════════ TOP NAVIGATION BAR (Image 4 Header) ════════════ */}
      <div className="h-10 bg-[#252526] border-b border-[#333333] px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {/* Mode Switchers */}
          <div className="flex items-center bg-[#1e1e1e] rounded-lg p-0.5 border border-[#3c3c3c]">
            <button
              onClick={() => setViewMode('database')}
              className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition ${
                viewMode === 'database' ? 'bg-[#37373d] text-white shadow' : 'text-[#858585] hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>Database</span>
            </button>
            <button
              onClick={() => setViewMode('visualization')}
              className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition ${
                viewMode === 'visualization' ? 'bg-[#37373d] text-white shadow' : 'text-[#858585] hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Visualization</span>
            </button>
          </div>

          <div className="h-4 w-px bg-[#3c3c3c]" />

          {/* Sub Navigation Views */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveMainTab('sql')}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition font-medium ${
                activeMainTab === 'sql' ? 'bg-[#094771] text-white' : 'text-[#969696] hover:bg-[#2a2d2e] hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>&gt;_ SQL</span>
            </button>
            <button
              onClick={() => setActiveMainTab('logs')}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition font-medium relative ${
                activeMainTab === 'logs' ? 'bg-[#d97706] text-white' : 'text-[#969696] hover:bg-[#2a2d2e] hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Logs</span>
              {logCounts.ERROR > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-rose-600 text-white rounded-full text-[10px] font-bold">
                  {logCounts.ERROR}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveMainTab('dashboard')}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition font-medium ${
                activeMainTab === 'dashboard' ? 'bg-[#094771] text-white' : 'text-[#969696] hover:bg-[#2a2d2e] hover:text-white'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
          </div>
        </div>

        {/* Server Indicator & Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>MySQL 9.3 Connected (3306)</span>
          </div>

          <button
            onClick={() => { fetchDatabases(); if (selectedDb) fetchSchema(selectedDb); fetchActivityLogs(); }}
            className="p-1.5 rounded hover:bg-[#333333] text-[#858585] hover:text-white transition"
            title="Refresh All"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ════════════ MAIN BODY (Split into Sidebar & Active View) ════════════ */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── LEFT SIDEBAR (Database & Table Explorer - Image 4) ── */}
        <div className="w-64 bg-[#181818] border-r border-[#2b2b2b] flex flex-col shrink-0 overflow-hidden">
          {/* Active Database Dropdown */}
          <div className="p-2 border-b border-[#2b2b2b] bg-[#1f1f1f] space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-[#858585]">
              <span className="font-semibold uppercase tracking-wider flex items-center gap-1">
                <Database className="w-3 h-3 text-amber-400" />
                <span>Active Database</span>
              </span>
              <button
                onClick={() => setIsCreateDbOpen(true)}
                className="p-1 rounded hover:bg-[#333333] text-[#969696] hover:text-white transition"
                title="Create New Database"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>

            <select
              value={selectedDb}
              onChange={(e) => setSelectedDb(e.target.value)}
              className="w-full bg-[#2d2d2d] border border-[#3c3c3c] text-white rounded px-2 py-1.5 text-xs font-mono outline-none focus:border-[#007acc]"
            >
              {databases.map(db => (
                <option key={db.name} value={db.name}>
                  {db.displayName} ({db.tableCount} tables)
                </option>
              ))}
            </select>
          </div>

          {/* Search tables */}
          <div className="p-2 border-b border-[#2b2b2b] bg-[#1a1a1a] flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-[#6e6e6e]" />
            <input
              type="text"
              placeholder="Search tables..."
              value={filterSchemaText}
              onChange={(e) => setFilterSchemaText(e.target.value)}
              className="bg-transparent border-none text-xs text-white placeholder-[#6e6e6e] outline-none flex-1 font-mono"
            />
            {filterSchemaText && (
              <button onClick={() => setFilterSchemaText('')} className="text-[#6e6e6e] hover:text-white">
                ✕
              </button>
            )}
          </div>

          {/* Schema Explorer Tree */}
          <div className="flex-1 overflow-y-auto p-1 font-mono text-[11px] space-y-0.5">
            {/* ALL TABLES Header */}
            <div 
              onClick={() => setExpandedNodes(p => ({ ...p, allTables: !p.allTables }))}
              className="px-2 py-1 flex items-center justify-between font-bold text-[#858585] hover:text-white cursor-pointer select-none"
            >
              <span className="flex items-center gap-1">
                {expandedNodes.allTables ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                <span>ALL TABLES</span>
              </span>
              <span className="text-[10px] bg-[#2d2d2d] px-1.5 py-0.2 rounded text-[#969696]">
                {visibleTables.length}
              </span>
            </div>

            {expandedNodes.allTables && visibleTables.map(tbl => {
              const isTableOpen = expandedNodes[tbl.name];
              const isColsOpen = expandedNodes[`${tbl.name}_cols`];
              const isIdxOpen = expandedNodes[`${tbl.name}_idx`];

              return (
                <div key={tbl.name} className="space-y-0.5">
                  {/* Table Row */}
                  <div 
                    className="group px-2 py-1 rounded flex items-center justify-between hover:bg-[#2a2d2e] cursor-pointer text-white"
                    onClick={() => setExpandedNodes(p => ({ ...p, [tbl.name]: !p[tbl.name] }))}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      {isTableOpen ? <ChevronDown className="w-3 h-3 text-[#6e6e6e]" /> : <ChevronRight className="w-3 h-3 text-[#6e6e6e]" />}
                      <Table className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="font-semibold truncate">{tbl.name}</span>
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExecuteQuery(`SELECT * FROM \`${tbl.name}\` LIMIT 100;`);
                        setActiveMainTab('sql');
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-amber-400 transition"
                      title="SELECT * FROM table"
                    >
                      <Play className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Sub-tree: Columns & Indexes */}
                  {isTableOpen && (
                    <div className="pl-4 space-y-0.5 text-[#969696]">
                      {/* COLUMNS node */}
                      <div 
                        onClick={() => setExpandedNodes(p => ({ ...p, [`${tbl.name}_cols`]: !p[`${tbl.name}_cols`] }))}
                        className="px-1.5 py-0.5 rounded flex items-center justify-between hover:text-white cursor-pointer"
                      >
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-[#6e6e6e]">
                          {isColsOpen ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
                          <span>COLUMNS ({tbl.columns?.length || 0})</span>
                        </span>
                      </div>

                      {isColsOpen && tbl.columns?.map(c => (
                        <div key={c.name} className="pl-3 py-0.5 flex items-center justify-between text-[#cccccc] hover:text-white">
                          <span className="flex items-center gap-1.5 truncate">
                            {c.isPrimary ? (
                              <Key className="w-3 h-3 text-amber-400 shrink-0" />
                            ) : (
                              <span className="text-[#6e6e6e] text-[10px]">#</span>
                            )}
                            <span className="truncate">{c.name}</span>
                          </span>
                          <span className="text-[10px] text-[#6e6e6e] truncate font-mono">{c.type}</span>
                        </div>
                      ))}

                      {/* INDEXES node */}
                      <div 
                        onClick={() => setExpandedNodes(p => ({ ...p, [`${tbl.name}_idx`]: !p[`${tbl.name}_idx`] }))}
                        className="px-1.5 py-0.5 rounded flex items-center justify-between hover:text-white cursor-pointer"
                      >
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-[#6e6e6e]">
                          {isIdxOpen ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
                          <span>INDEXES ({tbl.indexes?.length || 0})</span>
                        </span>
                      </div>

                      {isIdxOpen && tbl.indexes?.map(idx => (
                        <div key={idx.name} className="pl-3 py-0.5 flex items-center justify-between text-[#858585]">
                          <span className="flex items-center gap-1.5 truncate">
                            <Key className="w-2.5 h-2.5 text-[#6e6e6e]" />
                            <span className="truncate">{idx.name}</span>
                          </span>
                          <span className="text-[9px] text-[#6e6e6e]">{idx.unique ? 'UNIQUE' : 'INDEX'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {visibleTables.length === 0 && (
              <div className="p-4 text-center text-[#6e6e6e]">
                No tables found in \`{selectedDb}\`. Click &quot;+ Create Table&quot; to build one.
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT MAIN PANEL ── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#1e1e1e]">
          {/* ════════════ TAB 1: SQL EDITOR VIEW (Image 1 & Image 2) ════════════ */}
          {activeMainTab === 'sql' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Query Tabs Row */}
              <div className="h-9 bg-[#252526] border-b border-[#333333] px-2 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-1 overflow-x-auto">
                  <button
                    onClick={() => setIsCreateTableOpen(true)}
                    className="px-2.5 py-1 rounded bg-[#2d2d2d] hover:bg-[#37373d] text-white text-xs font-medium flex items-center gap-1 transition mr-2 border border-[#3c3c3c]"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>+ Create Table</span>
                  </button>

                  {tabs.map(tab => (
                    <div
                      key={tab.id}
                      onClick={() => setActiveTabId(tab.id)}
                      className={`px-3 py-1.5 rounded-t text-xs font-medium flex items-center gap-2 cursor-pointer border-t-2 transition ${
                        activeTabId === tab.id
                          ? 'bg-[#1e1e1e] text-white border-[#007acc]'
                          : 'bg-[#2d2d2d] text-[#969696] border-transparent hover:text-white'
                      }`}
                    >
                      <FileText className="w-3 h-3 text-amber-400" />
                      <span>{tab.title}</span>
                    </div>
                  ))}
                </div>

                {/* Editor Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleExecuteQuery()}
                    disabled={isExecuting}
                    className="px-3 py-1 rounded bg-[#007acc] hover:bg-[#0062a3] text-white text-xs font-bold flex items-center gap-1.5 shadow transition disabled:opacity-50 cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>{isExecuting ? 'Executing...' : 'Execute'}</span>
                  </button>
                </div>
              </div>

              {/* Monaco SQL Editor */}
              <div className="h-56 border-b border-[#333333] relative">
                <Editor
                  height="100%"
                  defaultLanguage="sql"
                  theme="vs-pitch-black"
                  value={tabs.find(t => t.id === activeTabId)?.sql || ''}
                  onChange={(val) => {
                    setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, sql: val || '' } : t));
                  }}
                  beforeMount={handleEditorWillMount}
                  onMount={handleEditorDidMount}
                  options={{
                    fontSize: 13,
                    fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, monospace",
                    minimap: { enabled: false },
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    suggestOnTriggerCharacters: true,
                    quickSuggestions: { other: true, comments: false, strings: true }
                  }}
                />
              </div>

              {/* Result Grid & Action Output Split */}
              <div className="flex-1 flex flex-col overflow-hidden bg-[#181818]">
                {/* Result Grid Header */}
                <div className="h-8 bg-[#252526] border-b border-[#333333] px-3 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                      <Table className="w-3.5 h-3.5 text-blue-400" />
                      <span>Result Grid</span>
                    </span>
                    {resultSet && (
                      <span className="text-[11px] text-[#858585]">
                        ({resultSet.rowCount || 0} rows returned in {resultSet.executionTimeSec}s)
                      </span>
                    )}
                  </div>

                  {resultSet && resultSet.rows?.length > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-[#1e1e1e] px-2 py-0.5 rounded border border-[#3c3c3c]">
                        <Search className="w-3 h-3 text-[#6e6e6e]" />
                        <input
                          type="text"
                          placeholder="Filter Rows..."
                          value={resultFilter}
                          onChange={(e) => setResultFilter(e.target.value)}
                          className="bg-transparent border-none text-[11px] text-white placeholder-[#6e6e6e] outline-none w-28"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const json = JSON.stringify(resultSet.rows, null, 2);
                          handleCopyText(json, 'results-json');
                        }}
                        className="px-2 py-0.5 rounded bg-[#2d2d2d] hover:bg-[#37373d] text-[#cccccc] text-[11px] flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy JSON</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Result Rows Table Grid */}
                <div className="flex-1 overflow-auto">
                  {resultSet && resultSet.isSelect && resultSet.columns?.length > 0 ? (
                    <table className="w-full border-collapse font-mono text-[11px]">
                      <thead className="sticky top-0 bg-[#252526] border-b border-[#3c3c3c] z-10">
                        <tr>
                          <th className="p-1.5 text-left text-[#6e6e6e] border-r border-[#3c3c3c] w-10">#</th>
                          {resultSet.columns.map(col => (
                            <th key={col.name} className="p-1.5 text-left text-[#cccccc] font-semibold border-r border-[#3c3c3c] whitespace-nowrap">
                              <span>{col.name}</span>
                              <span className="ml-1.5 text-[9px] text-[#6e6e6e] font-normal">{col.type}</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {resultSet.rows
                          .filter(row => {
                            if (!resultFilter.trim()) return true;
                            const q = resultFilter.toLowerCase();
                            return Object.values(row).some(v => String(v).toLowerCase().includes(q));
                          })
                          .map((row, idx) => (
                            <tr key={idx} className="border-b border-[#262626] hover:bg-[#2a2d2e] transition">
                              <td className="p-1.5 text-[#6e6e6e] border-r border-[#262626] select-none text-right pr-2">
                                {idx + 1}
                              </td>
                              {resultSet.columns.map(col => {
                                const val = row[col.name];
                                const isNull = val === null || val === undefined;
                                return (
                                  <td 
                                    key={col.name} 
                                    className={`p-1.5 border-r border-[#262626] whitespace-nowrap ${
                                      isNull ? 'text-[#6e6e6e] italic' : 'text-[#d4d4d4]'
                                    }`}
                                  >
                                    {isNull ? 'NULL' : String(val)}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  ) : resultSet && !resultSet.isSelect ? (
                    <div className="p-6 text-center space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                      <p className="text-white font-medium text-sm">{resultSet.responseMessage}</p>
                      <p className="text-[#858585] text-xs font-mono">
                        Affected Rows: {resultSet.affectedRows} | Insert ID: {resultSet.insertId} | Duration: {resultSet.executionTimeSec}s
                      </p>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-[#6e6e6e] space-y-2">
                      <Terminal className="w-8 h-8 mx-auto text-[#444444]" />
                      <p>Click &quot;Execute&quot; or press Ctrl+Enter to run SQL query against MySQL 9.3 Community Server.</p>
                    </div>
                  )}
                </div>

                {/* Action Output Log (MySQL Workbench Style - Image 1) */}
                <div className="h-28 bg-[#1f1f1f] border-t border-[#333333] flex flex-col shrink-0">
                  <div className="h-6 bg-[#252526] px-3 flex items-center justify-between text-[10px] font-bold text-[#858585] uppercase tracking-wider border-b border-[#2b2b2b]">
                    <span>Action Output</span>
                    <span>{actionOutputs.length} statement(s)</span>
                  </div>
                  <div className="flex-1 overflow-y-auto font-mono text-[11px]">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="text-[#6e6e6e] border-b border-[#2b2b2b] text-[10px]">
                          <th className="p-1 w-8 text-center">#</th>
                          <th className="p-1 w-20 text-left">Time</th>
                          <th className="p-1 text-left">Action</th>
                          <th className="p-1 text-left">Response</th>
                          <th className="p-1 w-36 text-right pr-2">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {actionOutputs.map((act, idx) => (
                          <tr key={act.id} className="border-b border-[#262626] hover:bg-[#252526]">
                            <td className="p-1 text-center">
                              {act.status === 'success' ? (
                                <CheckCircle2 className="w-3 h-3 text-emerald-400 inline" />
                              ) : (
                                <XCircle className="w-3 h-3 text-rose-500 inline" />
                              )}
                            </td>
                            <td className="p-1 text-[#858585]">{act.time}</td>
                            <td className="p-1 text-white truncate max-w-xs">{act.action}</td>
                            <td className={`p-1 truncate max-w-sm ${act.status === 'error' ? 'text-rose-400' : 'text-[#858585]'}`}>
                              {act.response}
                            </td>
                            <td className="p-1 text-right text-[#858585] pr-2 font-mono text-[10px]">{act.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════ TAB 2: LIVE ACTIVITY LOGS VIEW (Image 4) ════════════ */}
          {activeMainTab === 'logs' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-[#181818]">
              {/* Filter Toolbar (Image 4) */}
              <div className="p-3 bg-[#202020] border-b border-[#2f2f2f] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  {/* Search Input */}
                  <div className="flex items-center gap-2 bg-[#141414] px-3 py-1.5 rounded-lg border border-[#383838] w-64">
                    <Search className="w-3.5 h-3.5 text-[#6e6e6e]" />
                    <input
                      type="text"
                      placeholder="Search logs..."
                      value={logSearchQuery}
                      onChange={(e) => setLogSearchQuery(e.target.value)}
                      className="bg-transparent border-none text-xs text-white placeholder-[#6e6e6e] outline-none w-full"
                    />
                  </div>

                  {/* Filter Chips */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setLogFilter('ALL')}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                        logFilter === 'ALL'
                          ? 'bg-[#3b3b3b] text-white ring-1 ring-white/20'
                          : 'bg-[#262626] text-[#8e8e8e] hover:text-white'
                      }`}
                    >
                      All {logCounts.ALL}
                    </button>
                    <button
                      onClick={() => setLogFilter('ERROR')}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                        logFilter === 'ERROR'
                          ? 'bg-rose-950/80 text-rose-300 ring-1 ring-rose-500'
                          : 'bg-[#262626] text-[#8e8e8e] hover:text-rose-400'
                      }`}
                    >
                      Errors {logCounts.ERROR}
                    </button>
                    <button
                      onClick={() => setLogFilter('WARNING')}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                        logFilter === 'WARNING'
                          ? 'bg-amber-950/80 text-amber-300 ring-1 ring-amber-500'
                          : 'bg-[#262626] text-[#8e8e8e] hover:text-amber-400'
                      }`}
                    >
                      Warn {logCounts.WARNING}
                    </button>
                    <button
                      onClick={() => setLogFilter('INFO')}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                        logFilter === 'INFO'
                          ? 'bg-blue-950/80 text-blue-300 ring-1 ring-blue-500'
                          : 'bg-[#262626] text-[#8e8e8e] hover:text-blue-400'
                      }`}
                    >
                      Info {logCounts.INFO}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      fetch('/api/macos/mysql/activity', { method: 'DELETE' });
                      setActivityLogs([]);
                    }}
                    className="px-2.5 py-1 rounded bg-[#2a2a2a] hover:bg-[#333333] text-[#8e8e8e] hover:text-rose-400 text-xs transition"
                  >
                    Clear Logs
                  </button>
                </div>
              </div>

              {/* Live Event Cards List (Image 4 exact styling) */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredActivityLogs.map(log => {
                  const isError = log.type === 'ERROR';
                  const isWarn = log.type === 'WARNING';
                  const isInfo = log.type === 'INFO';
                  const isExpanded = expandedLogContexts[log.id];

                  return (
                    <div 
                      key={log.id}
                      className="bg-[#1f1f1f] border border-[#2e2e2e] rounded-xl p-3.5 space-y-2 hover:border-[#404040] transition shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          {/* Badge */}
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wide ${
                            isError ? 'bg-rose-950 text-rose-400 border border-rose-800/40' :
                            isWarn ? 'bg-amber-950 text-amber-400 border border-amber-800/40' :
                            'bg-blue-950 text-blue-400 border border-blue-800/40'
                          }`}>
                            {log.type}
                          </span>

                          {/* Timestamp & ID */}
                          <div className="flex items-center gap-2 text-[#737373] text-[11px]">
                            <Clock className="w-3 h-3" />
                            <span>{log.time}</span>
                            <span>•</span>
                            <span className="font-mono text-[#525252]">ID: {log.id}</span>
                          </div>
                        </div>

                        {/* Copy Button */}
                        <button
                          onClick={() => handleCopyText(`${log.message}\n${JSON.stringify(log.context, null, 2)}`, log.id)}
                          className="px-2.5 py-1 rounded bg-[#292929] hover:bg-[#333333] text-[#a3a3a3] hover:text-white text-[11px] flex items-center gap-1 transition"
                        >
                          {copiedLogId === log.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Message */}
                      <p className={`font-mono text-xs ${
                        isError ? 'text-rose-300 font-semibold' : 
                        isWarn ? 'text-amber-200' : 
                        'text-[#e5e5e5]'
                      }`}>
                        {log.message}
                      </p>

                      {/* Collapsible Context / Stack Trace */}
                      {log.context && (
                        <div className="pt-1">
                          <button
                            onClick={() => toggleLogContext(log.id)}
                            className="text-[11px] text-[#737373] hover:text-white flex items-center gap-1 font-mono cursor-pointer"
                          >
                            <span>{isExpanded ? '▼' : '▶'}</span>
                            <span>{isError ? 'Stack Trace & Details' : 'Context'}</span>
                          </button>

                          {isExpanded && (
                            <pre className="mt-2 p-2.5 bg-[#141414] rounded-lg border border-[#2a2a2a] text-[10px] font-mono text-[#a3a3a3] overflow-x-auto">
                              {JSON.stringify(log.context, null, 2)}
                            </pre>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredActivityLogs.length === 0 && (
                  <div className="p-12 text-center text-[#737373] space-y-2">
                    <Activity className="w-10 h-10 mx-auto text-[#3a3a3a]" />
                    <p className="text-sm">No activity events match current filter.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ════════════ TAB 3: SERVER DASHBOARD VIEW ════════════ */}
          {activeMainTab === 'dashboard' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#181818]">
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-[#202020] rounded-xl border border-[#2e2e2e] space-y-1">
                  <p className="text-[#8e8e8e] text-xs">MySQL Version</p>
                  <p className="text-xl font-bold text-white">{serverMetrics?.version || '9.3.0 Community'}</p>
                  <p className="text-[10px] text-emerald-400 font-mono">Running (Port 3306)</p>
                </div>
                <div className="p-4 bg-[#202020] rounded-xl border border-[#2e2e2e] space-y-1">
                  <p className="text-[#8e8e8e] text-xs">Uptime</p>
                  <p className="text-xl font-bold text-white">{serverMetrics?.uptimeFormatted || 'Active'}</p>
                  <p className="text-[10px] text-[#8e8e8e] font-mono">Continuous Server Service</p>
                </div>
                <div className="p-4 bg-[#202020] rounded-xl border border-[#2e2e2e] space-y-1">
                  <p className="text-[#8e8e8e] text-xs">Active Connections</p>
                  <p className="text-xl font-bold text-white">{serverMetrics?.activeConnections || 1}</p>
                  <p className="text-[10px] text-[#8e8e8e] font-mono">Client Pools</p>
                </div>
                <div className="p-4 bg-[#202020] rounded-xl border border-[#2e2e2e] space-y-1">
                  <p className="text-[#8e8e8e] text-xs">Total Queries</p>
                  <p className="text-xl font-bold text-white">{serverMetrics?.totalQueries || 0}</p>
                  <p className="text-[10px] text-amber-400 font-mono">Processed by Engine</p>
                </div>
              </div>

              {/* Databases overview list */}
              <div className="p-5 bg-[#202020] rounded-xl border border-[#2e2e2e] space-y-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-400" />
                  <span>Real MySQL Databases on System ({databases.length})</span>
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {databases.map(db => (
                    <div 
                      key={db.name} 
                      onClick={() => { setSelectedDb(db.name); setActiveMainTab('sql'); }}
                      className={`p-3 rounded-lg border cursor-pointer transition ${
                        selectedDb === db.name
                          ? 'bg-[#293548] border-[#007acc] text-white'
                          : 'bg-[#181818] border-[#2e2e2e] text-[#cccccc] hover:border-[#404040]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs truncate">{db.displayName}</span>
                        <span className="text-[10px] bg-[#2a2a2a] px-1.5 py-0.5 rounded text-[#8e8e8e]">
                          {db.tableCount} tables
                        </span>
                      </div>
                      <p className="text-[10px] text-[#6e6e6e] font-mono mt-1 truncate">Schema: {db.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ════════════ LIVE BOTTOM STATUS BAR ════════════ */}
      <div className="h-6 bg-[#007acc] text-white px-3 flex items-center justify-between text-[11px] font-mono shrink-0 select-none">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span>MySQL 9.3</span>
          </span>
          <span>Conn: Local instance 3306</span>
          <span>DB: {selectedDb || 'none'}</span>
          <span>Databases: {databases.length}</span>
          <span>Tables: {schemaTree.tables?.length || 0}</span>
        </div>

        <div className="flex items-center gap-4">
          <span>Last Query: {lastQueryDuration}s</span>
          <span className="font-bold">Status: {queryStatus}</span>
        </div>
      </div>

      {/* ════════════ MODAL 1: CREATE DATABASE ════════════ */}
      {isCreateDbOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#252526] rounded-xl border border-[#3c3c3c] shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#333333] pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400" />
                <span>Create Real MySQL Database</span>
              </h3>
              <button onClick={() => setIsCreateDbOpen(false)} className="text-[#858585] hover:text-white">✕</button>
            </div>

            {modalError && (
              <div className="p-2.5 rounded bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateDatabase} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#cccccc] mb-1">Database Name</label>
                <input
                  type="text"
                  placeholder="e.g. college or university_db"
                  value={newDbName}
                  onChange={(e) => setNewDbName(e.target.value)}
                  autoFocus
                  required
                  className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1.5 text-xs text-white font-mono outline-none focus:border-[#007acc]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#cccccc] mb-1">Character Set</label>
                  <select
                    value={newDbCharset}
                    onChange={(e) => setNewDbCharset(e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-2 py-1.5 text-xs text-white outline-none"
                  >
                    <option value="utf8mb4">utf8mb4 (Recommended)</option>
                    <option value="utf8">utf8</option>
                    <option value="latin1">latin1</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#cccccc] mb-1">Collation</label>
                  <select
                    value={newDbCollation}
                    onChange={(e) => setNewDbCollation(e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-2 py-1.5 text-xs text-white outline-none"
                  >
                    <option value="utf8mb4_unicode_ci">utf8mb4_unicode_ci</option>
                    <option value="utf8mb4_general_ci">utf8mb4_general_ci</option>
                    <option value="utf8mb4_0900_ai_ci">utf8mb4_0900_ai_ci</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateDbOpen(false)}
                  className="px-3 py-1.5 rounded bg-[#333333] hover:bg-[#3c3c3c] text-white text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingDb || !newDbName.trim()}
                  className="px-4 py-1.5 rounded bg-[#007acc] hover:bg-[#0062a3] text-white text-xs font-bold transition disabled:opacity-50"
                >
                  {isSubmittingDb ? 'Creating...' : 'Create & Verify in MySQL'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════ MODAL 2: VISUAL TABLE BUILDER ════════════ */}
      {isCreateTableOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#252526] rounded-xl border border-[#3c3c3c] shadow-2xl p-5 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#333333] pb-3 shrink-0">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Table className="w-4 h-4 text-emerald-400" />
                <span>Visual Table Builder: in &quot;{selectedDb}&quot;</span>
              </h3>
              <button onClick={() => setIsCreateTableOpen(false)} className="text-[#858585] hover:text-white">✕</button>
            </div>

            {modalError && (
              <div className="p-2.5 rounded bg-rose-950/80 border border-rose-800 text-rose-300 text-xs shrink-0">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateTable} className="space-y-4 overflow-y-auto flex-1 pr-1">
              <div>
                <label className="block text-xs font-medium text-[#cccccc] mb-1">Table Name</label>
                <input
                  type="text"
                  placeholder="e.g. students, courses, enrollments"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  autoFocus
                  required
                  className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1.5 text-xs text-white font-mono outline-none focus:border-[#007acc]"
                />
              </div>

              {/* Columns Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Columns Definition</span>
                  <button
                    type="button"
                    onClick={() => {
                      setNewTableColumns(prev => [
                        ...prev,
                        { name: `col_${prev.length + 1}`, type: 'VARCHAR(100)', nullable: true, isPrimary: false, autoIncrement: false, defaultValue: '' }
                      ]);
                    }}
                    className="text-xs text-[#007acc] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Column</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  {newTableColumns.map((col, idx) => (
                    <div key={idx} className="p-2 bg-[#1e1e1e] rounded border border-[#333333] grid grid-cols-12 gap-2 items-center text-xs">
                      <div className="col-span-4">
                        <input
                          type="text"
                          placeholder="Column Name"
                          value={col.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewTableColumns(prev => prev.map((c, i) => i === idx ? { ...c, name: val } : c));
                          }}
                          className="w-full bg-[#2a2a2a] border border-[#3c3c3c] rounded px-2 py-1 text-white font-mono text-xs outline-none"
                        />
                      </div>
                      <div className="col-span-3">
                        <select
                          value={col.type}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewTableColumns(prev => prev.map((c, i) => i === idx ? { ...c, type: val } : c));
                          }}
                          className="w-full bg-[#2a2a2a] border border-[#3c3c3c] rounded px-1.5 py-1 text-white text-xs outline-none font-mono"
                        >
                          <option value="INT">INT</option>
                          <option value="BIGINT">BIGINT</option>
                          <option value="VARCHAR(100)">VARCHAR(100)</option>
                          <option value="VARCHAR(255)">VARCHAR(255)</option>
                          <option value="TEXT">TEXT</option>
                          <option value="TIMESTAMP">TIMESTAMP</option>
                          <option value="DATETIME">DATETIME</option>
                          <option value="DECIMAL(10,2)">DECIMAL(10,2)</option>
                          <option value="BOOLEAN">BOOLEAN</option>
                        </select>
                      </div>
                      <div className="col-span-2 flex items-center gap-1.5">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={col.isPrimary}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setNewTableColumns(prev => prev.map((c, i) => i === idx ? { ...c, isPrimary: checked, nullable: !checked } : c));
                            }}
                          />
                          <span>PK</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={col.autoIncrement}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setNewTableColumns(prev => prev.map((c, i) => i === idx ? { ...c, autoIncrement: checked } : c));
                            }}
                          />
                          <span>AI</span>
                        </label>
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder="Default"
                          value={col.defaultValue}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewTableColumns(prev => prev.map((c, i) => i === idx ? { ...c, defaultValue: val } : c));
                          }}
                          className="w-full bg-[#2a2a2a] border border-[#3c3c3c] rounded px-1.5 py-1 text-white text-xs outline-none font-mono"
                        />
                      </div>
                      <div className="col-span-1 text-right">
                        {newTableColumns.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setNewTableColumns(prev => prev.filter((_, i) => i !== idx))}
                            className="text-[#858585] hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCreateTableOpen(false)}
                  className="px-3 py-1.5 rounded bg-[#333333] hover:bg-[#3c3c3c] text-white text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingTable || !newTableName.trim()}
                  className="px-4 py-1.5 rounded bg-[#007acc] hover:bg-[#0062a3] text-white text-xs font-bold transition disabled:opacity-50"
                >
                  {isSubmittingTable ? 'Creating...' : 'Execute CREATE TABLE in MySQL'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
