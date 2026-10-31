import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Database, Play, RefreshCw, Server, Users, Shield, 
  Terminal, Search, ChevronRight, ChevronDown, Table, 
  Columns, Key, Download, Upload, StopCircle, CheckCircle2, 
  AlertCircle, FileText, Settings, Layers, Copy, Check, Filter
} from 'lucide-react';

export default function MySQLStudioApp({ onClose }) {
  // Query Tabs
  const [tabs, setTabs] = useState([
    {
      id: 'tab-1',
      title: 'Query 1',
      sql: `SELECT \`actor\`.\`actor_id\`,
  \`actor\`.\`first_name\`,
  \`actor\`.\`last_name\`,
  \`actor\`.\`last_update\`
FROM \`actor\`;

SELECT \`film\`.\`film_id\`,
  \`film\`.\`title\`,
  \`film\`.\`description\`,
  \`film\`.\`release_year\`,
  \`film\`.\`language_id\`,
  \`film\`.\`original_language_id\`,
  \`film\`.\`rental_duration\`,
  \`film\`.\`rental_rate\`,
  \`film\`.\`length\`,
  \`film\`.\`replacement_cost\`,
  \`film\`.\`rating\`,
  \`film\`.\`special_features\`
FROM \`film\`;`
    }
  ]);
  const [activeTabId, setActiveTabId] = useState('tab-1');

  // Schema & Databases
  const [databases, setDatabases] = useState([]);
  const [selectedDb, setSelectedDb] = useState('macos_user_usr_01net_sakila');
  const [schemaTree, setSchemaTree] = useState({ tables: [] });
  const [filterSchemaText, setFilterSchemaText] = useState('');
  const [expandedNodes, setExpandedNodes] = useState({ tables: true, film: true, film_cols: true });
  const [selectedTable, setSelectedTable] = useState('film');
  const [sidebarBottomTab, setSidebarBottomTab] = useState('objectInfo');

  // Execution & Results
  const [isExecuting, setIsExecuting] = useState(false);
  const [resultSet, setResultSet] = useState(null);
  const [resultFilter, setResultFilter] = useState('');
  const [actionOutputs, setActionOutputs] = useState([
    {
      id: 1,
      status: 'success',
      time: '23:03:10',
      action: "SELECT `film`.`film_id`, `film`.`title`, `film`.`description`, ...",
      response: '10 row(s) returned',
      duration: '0.015 sec / 0.136 sec'
    },
    {
      id: 2,
      status: 'success',
      time: '23:03:18',
      action: "SELECT `actor`.`actor_id`, `actor`.`first_name`, `actor`.`last_name` ...",
      response: '10 row(s) returned',
      duration: '0.001 sec / 0.019 sec'
    }
  ]);

  // Server Metrics
  const [serverMetrics, setServerMetrics] = useState(null);
  const [connections, setConnections] = useState([]);
  const [mainView, setMainView] = useState('query'); // 'query', 'status', 'connections'

  // Fetch Databases & Schema
  const fetchDatabases = async () => {
    try {
      const res = await fetch('/api/macos/mysql/databases');
      const data = await res.json();
      if (data.success && Array.isArray(data.databases)) {
        setDatabases(data.databases);
        if (data.databases.length > 0 && !selectedDb) {
          setSelectedDb(data.databases[0].name);
        }
      }
    } catch {}
  };

  const fetchSchema = async (dbName) => {
    if (!dbName) return;
    try {
      const res = await fetch(`/api/macos/mysql/databases/${encodeURIComponent(dbName)}/schema`);
      const data = await res.json();
      if (data.success && data.schema) {
        setSchemaTree(data.schema);
      }
    } catch {}
  };

  const fetchServerMetrics = async () => {
    try {
      const res = await fetch('/api/macos/mysql/status');
      const data = await res.json();
      if (data.success) {
        setServerMetrics(data.metrics);
      }
    } catch {}
  };

  useEffect(() => {
    fetchDatabases();
    fetchServerMetrics();
  }, []);

  useEffect(() => {
    if (selectedDb) {
      fetchSchema(selectedDb);
    }
  }, [selectedDb]);

  // Execute SQL Query
  const handleExecute = async () => {
    const curTab = tabs.find(t => t.id === activeTabId);
    if (!curTab || !curTab.sql.trim()) return;

    setIsExecuting(true);
    const execStartTime = new Date().toLocaleTimeString('it-IT', { hour12: false });
    
    // Choose selected statement or first active statement
    const rawSql = curTab.sql.trim();
    // Support running single statement if separated by semicolon
    const statements = rawSql.split(';').map(s => s.trim()).filter(Boolean);
    const targetSql = statements[statements.length - 1] || rawSql;

    try {
      const res = await fetch('/api/macos/mysql/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          database: selectedDb,
          sql: targetSql,
          limit: 1000
        })
      });

      const data = await res.json();
      if (data.success) {
        setResultSet(data);
        setActionOutputs(prev => [
          {
            id: Date.now(),
            status: 'success',
            time: execStartTime,
            action: targetSql.length > 80 ? targetSql.substring(0, 80) + '...' : targetSql,
            response: data.responseMessage || `${data.rowCount || 0} row(s) returned`,
            duration: `${data.executionTimeSec} sec / ${data.fetchTimeSec} sec`
          },
          ...prev.slice(0, 40)
        ]);
      } else {
        setActionOutputs(prev => [
          {
            id: Date.now(),
            status: 'error',
            time: execStartTime,
            action: targetSql.length > 80 ? targetSql.substring(0, 80) + '...' : targetSql,
            response: `Error Code: ${data.errno || 1064}. ${data.error || 'Syntax error'}`,
            duration: '0.001 sec / 0.000 sec'
          },
          ...prev.slice(0, 40)
        ]);
      }
    } catch (err) {
      setActionOutputs(prev => [
        {
          id: Date.now(),
          status: 'error',
          time: execStartTime,
          action: targetSql,
          response: `Error: ${err.message}`,
          duration: '0.000 sec / 0.000 sec'
        },
        ...prev.slice(0, 40)
      ]);
    } finally {
      setIsExecuting(false);
    }
  };

  // Initial auto-query for film table to match screenshot immediately on open
  useEffect(() => {
    handleExecute();
  }, [selectedDb]);

  // Schemas Explorer Toolbar actions
  const handleCreateDatabasePrompt = async () => {
    const dbName = window.prompt('Enter new database name (e.g. test_db):');
    if (!dbName || !dbName.trim()) return;
    try {
      const res = await fetch('/api/macos/mysql/databases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: dbName.trim() })
      });
      const data = await res.json();
      if (data.success) {
        await fetchDatabases();
        setSelectedDb(data.name || dbName.trim());
      } else {
        alert(data.error || 'Failed to create database');
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const handleInsertTableTemplate = () => {
    const template = `\nCREATE TABLE \`users\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`email\` VARCHAR(150) UNIQUE NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);\n\nINSERT INTO \`users\` (\`name\`, \`email\`) VALUES ('Manish Kumar', 'manish@example.com');\nSELECT * FROM \`users\`;\n`;
    setTabs(curr => curr.map(t => t.id === activeTabId ? { ...t, sql: t.sql + '\n' + template } : t));
  };

  const handleExportCSV = () => {
    if (!filteredRows || filteredRows.length === 0 || !resultSet?.columns) return;
    const headers = resultSet.columns.map(c => `"${c.name.replace(/"/g, '""')}"`).join(',');
    const rows = filteredRows.map(row => 
      resultSet.columns.map(c => {
        const val = row[c.name];
        if (val === null || val === undefined) return 'NULL';
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `query_export_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleNode = (key) => {
    setExpandedNodes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const currentTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const updateTabSql = (val) => {
    setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, sql: val } : t));
  };

  const addTab = () => {
    const newId = `tab-${tabs.length + 1}`;
    setTabs(prev => [...prev, { id: newId, title: `Query ${tabs.length + 1}`, sql: 'SELECT * FROM `film` LIMIT 10;' }]);
    setActiveTabId(newId);
  };

  const closeTab = (id, e) => {
    e.stopPropagation();
    if (tabs.length <= 1) return;
    const remaining = tabs.filter(t => t.id !== id);
    setTabs(remaining);
    if (activeTabId === id) setActiveTabId(remaining[0].id);
  };

  // Filtered rows for result grid
  const filteredRows = (resultSet?.rows || []).filter(row => {
    if (!resultFilter) return true;
    const q = resultFilter.toLowerCase();
    return Object.values(row).some(v => String(v).toLowerCase().includes(q));
  });

  const activeTableMeta = schemaTree?.tables?.find(t => t.name === selectedTable) || schemaTree?.tables?.[0];

  return (
    <div className="flex h-full w-full bg-[#f1f3f6] text-[#2d3748] font-sans select-none overflow-hidden text-xs">
      {/* ── Left Sidebar: Management & Schemas ── */}
      <div className="w-64 bg-[#f8fafc] border-r border-[#cbd5e1] flex flex-col justify-between overflow-hidden shadow-inner">
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Top Section: Management & Instance */}
          <div className="p-3 border-b border-[#e2e8f0] space-y-3">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 px-1">
                Management
              </div>
              <div className="space-y-0.5">
                <button 
                  onClick={() => setMainView('status')}
                  className={`w-full text-left px-2 py-1 rounded flex items-center gap-2 hover:bg-[#e2e8f0] transition ${mainView === 'status' ? 'bg-[#e2e8f0] font-semibold text-blue-700' : 'text-slate-700'}`}
                >
                  <Server className="w-3.5 h-3.5 text-blue-600" />
                  <span>Server Status</span>
                </button>
                <button 
                  onClick={() => setMainView('connections')}
                  className={`w-full text-left px-2 py-1 rounded flex items-center gap-2 hover:bg-[#e2e8f0] transition ${mainView === 'connections' ? 'bg-[#e2e8f0] font-semibold text-blue-700' : 'text-slate-700'}`}
                >
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Client Connections</span>
                </button>
                <button className="w-full text-left px-2 py-1 rounded flex items-center gap-2 text-slate-700 hover:bg-[#e2e8f0] transition">
                  <Shield className="w-3.5 h-3.5 text-purple-600" />
                  <span>Users and Privileges</span>
                </button>
                <button className="w-full text-left px-2 py-1 rounded flex items-center gap-2 text-slate-700 hover:bg-[#e2e8f0] transition">
                  <Download className="w-3.5 h-3.5 text-amber-600" />
                  <span>Data Export</span>
                </button>
                <button className="w-full text-left px-2 py-1 rounded flex items-center gap-2 text-slate-700 hover:bg-[#e2e8f0] transition">
                  <Upload className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Data Import/Restore</span>
                </button>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 px-1">
                Instance
              </div>
              <div className="space-y-0.5">
                <button className="w-full text-left px-2 py-1 rounded flex items-center gap-2 text-slate-700 hover:bg-[#e2e8f0] transition">
                  <StopCircle className="w-3.5 h-3.5 text-rose-500" />
                  <span>Startup / Shutdown</span>
                </button>
                <button className="w-full text-left px-2 py-1 rounded flex items-center gap-2 text-slate-700 hover:bg-[#e2e8f0] transition">
                  <FileText className="w-3.5 h-3.5 text-slate-600" />
                  <span>Server Logs</span>
                </button>
              </div>
            </div>
          </div>

          {/* Lower Section: Schemas Explorer */}
          <div className="p-3 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Schemas</span>
              <div className="flex items-center gap-1">
                <button onClick={handleCreateDatabasePrompt} title="Create New Database" className="px-1.5 py-0.5 hover:bg-blue-100 text-blue-700 font-bold rounded text-[11px] cursor-pointer">
                  + DB
                </button>
                <button onClick={() => fetchSchema(selectedDb)} title="Refresh Schemas" className="p-0.5 hover:bg-slate-200 rounded cursor-pointer">
                  <RefreshCw className="w-3 h-3 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Filter objects */}
            <div className="relative mb-2">
              <Search className="w-3 h-3 absolute left-2 top-2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter objects"
                value={filterSchemaText}
                onChange={(e) => setFilterSchemaText(e.target.value)}
                className="w-full pl-6 pr-2 py-1 bg-white border border-[#cbd5e1] rounded text-[11px] focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Schemas Tree */}
            <div className="flex-1 font-mono text-[11px] overflow-y-auto space-y-1">
              {databases.map(db => (
                <div key={db.name}>
                  <div 
                    onClick={() => { setSelectedDb(db.name); toggleNode(db.name); setMainView('query'); }}
                    className={`flex items-center gap-1 px-1.5 py-1 rounded cursor-pointer ${selectedDb === db.name ? 'bg-blue-100 text-blue-900 font-bold' : 'hover:bg-slate-200'}`}
                  >
                    {expandedNodes[db.name] ? <ChevronDown className="w-3 h-3 text-slate-500" /> : <ChevronRight className="w-3 h-3 text-slate-500" />}
                    <Database className="w-3.5 h-3.5 text-amber-600" />
                    <span className="truncate">{db.displayName || db.name}</span>
                  </div>

                  {/* Tables list under active DB */}
                  {selectedDb === db.name && (
                    <div className="pl-4 space-y-0.5 mt-0.5 border-l border-slate-300 ml-2">
                      {schemaTree?.tables?.filter(t => !filterSchemaText || t.name.toLowerCase().includes(filterSchemaText.toLowerCase())).map(t => (
                        <div key={t.name}>
                          <div 
                            onClick={() => { setSelectedTable(t.name); toggleNode(t.name); }}
                            className={`flex items-center gap-1 px-1.5 py-0.5 rounded cursor-pointer ${selectedTable === t.name ? 'bg-slate-200 font-bold' : 'hover:bg-slate-100'}`}
                          >
                            {expandedNodes[t.name] ? <ChevronDown className="w-2.5 h-2.5 text-slate-500" /> : <ChevronRight className="w-2.5 h-2.5 text-slate-500" />}
                            <Table className="w-3 h-3 text-blue-500" />
                            <span className="truncate">{t.name}</span>
                          </div>

                          {/* Columns & Indexes Subtree */}
                          {expandedNodes[t.name] && (
                            <div className="pl-3 space-y-0.5 border-l border-slate-200 ml-1.5 text-[10px]">
                              <div 
                                onClick={() => toggleNode(`${t.name}_cols`)}
                                className="flex items-center gap-1 py-0.5 cursor-pointer text-slate-600 hover:text-slate-900"
                              >
                                {expandedNodes[`${t.name}_cols`] ? <ChevronDown className="w-2 h-2" /> : <ChevronRight className="w-2 h-2" />}
                                <Columns className="w-2.5 h-2.5 text-slate-400" />
                                <span>Columns</span>
                              </div>
                              {expandedNodes[`${t.name}_cols`] && (
                                <div className="pl-3 space-y-0.5">
                                  {t.columns?.map(col => (
                                    <div key={col.name} className="flex items-center gap-1 text-slate-700 py-0.2" title={`${col.name}: ${col.type}`}>
                                      <span className={col.key === 'PRI' ? 'text-amber-500 font-bold' : 'text-slate-400'}>◆</span>
                                      <span className="truncate">{col.name}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Sidebar: Object Info & Session Tabs */}
        <div className="border-t border-[#cbd5e1] bg-[#eef2f6] p-2">
          <div className="flex border-b border-[#cbd5e1] mb-2 text-[10px] font-semibold">
            <button
              onClick={() => setSidebarBottomTab('objectInfo')}
              className={`px-3 py-1 border-b-2 transition ${sidebarBottomTab === 'objectInfo' ? 'border-blue-600 text-blue-700 font-bold' : 'border-transparent text-slate-500'}`}
            >
              Object Info
            </button>
            <button
              onClick={() => setSidebarBottomTab('session')}
              className={`px-3 py-1 border-b-2 transition ${sidebarBottomTab === 'session' ? 'border-blue-600 text-blue-700 font-bold' : 'border-transparent text-slate-500'}`}
            >
              Session
            </button>
          </div>

          <div className="text-[11px] space-y-1 font-mono">
            {sidebarBottomTab === 'objectInfo' && (
              <div className="space-y-1">
                <div className="text-slate-500 font-sans text-[10px]">Table: <span className="font-bold text-slate-800">{activeTableMeta?.name || 'film'}</span></div>
                <div className="text-[10px] text-slate-600 max-h-24 overflow-y-auto space-y-0.5">
                  {activeTableMeta?.columns?.slice(0, 5).map(c => (
                    <div key={c.name} className="flex justify-between">
                      <span className="truncate">{c.name}</span>
                      <span className="text-slate-400">{c.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sidebarBottomTab === 'session' && (
              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between text-slate-600"><span>User:</span> <span className="font-bold">usr_01net</span></div>
                <div className="flex justify-between text-slate-600"><span>Engine:</span> <span>MySQL 8.4 LTS</span></div>
                <div className="flex justify-between text-slate-600"><span>SSL:</span> <span className="text-emerald-600">Active</span></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Center Area: Query Tabs, Editor & Results ── */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Top Query Tab Bar */}
        <div className="h-8 bg-[#e2e8f0] border-b border-[#cbd5e1] flex items-center justify-between px-2">
          <div className="flex items-center gap-1 overflow-x-auto">
            {tabs.map(tab => (
              <div
                key={tab.id}
                onClick={() => { setActiveTabId(tab.id); setMainView('query'); }}
                className={`h-7 px-3 rounded-t flex items-center gap-2 cursor-pointer border-t border-l border-r border-[#cbd5e1] text-xs transition ${
                  activeTabId === tab.id && mainView === 'query' 
                    ? 'bg-white font-semibold text-slate-800 shadow-sm' 
                    : 'bg-[#cbd5e1]/50 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <span>{tab.title}</span>
                {tabs.length > 1 && (
                  <button onClick={(e) => closeTab(tab.id, e)} className="hover:text-red-500 text-slate-400">✕</button>
                )}
              </div>
            ))}
            <button onClick={addTab} className="p-1 hover:bg-slate-300 rounded text-slate-600 font-bold" title="New Query Tab">
              +
            </button>
          </div>

          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <span>LAN/printberry (MySQL 8.4.0)</span>
          </div>
        </div>

        {/* Toolbar (Lightning Bolt Execute, Limit Rows, Format) */}
        <div className="h-9 bg-[#f8fafc] border-b border-[#cbd5e1] px-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold rounded flex items-center gap-1 shadow-sm transition active:scale-95 cursor-pointer"
              title="Execute SQL (Lightning Bolt)"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Execute</span>
            </button>

            <button
              onClick={handleInsertTableTemplate}
              className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 font-semibold border border-[#cbd5e1] rounded flex items-center gap-1 shadow-xs text-xs cursor-pointer"
              title="Insert CREATE TABLE template"
            >
              <Table className="w-3 h-3 text-blue-600" />
              <span>+ Table</span>
            </button>

            <button
              onClick={() => updateTabSql(currentTab.sql.trim())}
              className="p-1 hover:bg-slate-200 rounded text-slate-600"
              title="Format SQL Code"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3 text-slate-600 text-[11px]">
            <span className="text-slate-400 font-mono">100% 31:18</span>
            <div className="flex items-center gap-1">
              <span>Limit:</span>
              <select className="bg-white border border-[#cbd5e1] rounded px-1 py-0.5 text-[11px]">
                <option>Fetch 1000 rows</option>
                <option>Fetch 500 rows</option>
                <option>Don't limit</option>
              </select>
            </div>
          </div>
        </div>

        {/* MAIN VIEW: SQL QUERY WORKBENCH */}
        {mainView === 'query' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Editor Area: Monaco SQL Editor */}
            <div className="h-56 border-b border-[#cbd5e1] relative">
              <Editor
                height="100%"
                language="sql"
                theme="vs"
                value={currentTab.sql}
                onChange={updateTabSql}
                options={{
                  fontSize: 12,
                  fontFamily: 'Consolas, "Fira Code", monospace',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: 'on',
                  folding: true,
                  automaticLayout: true
                }}
              />
            </div>

            {/* Lower Area: Result Grid & Action Output */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
              {/* Result Grid Header Toolbar */}
              <div className="h-7 bg-[#f1f5f9] border-b border-[#cbd5e1] px-3 flex items-center justify-between text-[11px] text-slate-600">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-700">Result Set</span>
                  <div className="flex items-center gap-1 bg-white border border-[#cbd5e1] rounded px-1.5 py-0.5">
                    <Filter className="w-2.5 h-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Filter grid rows..."
                      value={resultFilter}
                      onChange={(e) => setResultFilter(e.target.value)}
                      className="outline-none text-[10px] w-32"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleExportCSV} 
                    title="Export Results to CSV"
                    className="px-2 py-0.5 bg-white border border-[#cbd5e1] hover:bg-slate-50 text-slate-700 rounded text-[10px] flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Download className="w-2.5 h-2.5" />
                    <span>Export CSV</span>
                  </button>
                  <span className="text-slate-400">{filteredRows.length} rows returned</span>
                </div>
              </div>

              {/* Interactive Result Table Grid */}
              <div className="flex-1 overflow-auto border-b border-[#cbd5e1]">
                {filteredRows.length > 0 ? (
                  <table className="w-full border-collapse font-mono text-[11px] text-left">
                    <thead className="bg-[#f8fafc] sticky top-0 border-b border-[#cbd5e1] shadow-xs text-slate-700">
                      <tr>
                        <th className="w-10 px-2 py-1.5 border-r border-[#cbd5e1] text-center text-slate-400 font-normal">#</th>
                        {resultSet?.columns?.map(col => (
                          <th key={col.name} className="px-3 py-1.5 border-r border-[#cbd5e1] font-semibold text-slate-800 whitespace-nowrap">
                            {col.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRows.map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white hover:bg-blue-50/50' : 'bg-[#fcfdfd] hover:bg-blue-50/50'}>
                          <td className="px-2 py-1 border-r border-b border-[#cbd5e1] text-center text-slate-400 bg-[#f8fafc]">{idx + 1}</td>
                          {resultSet?.columns?.map(col => {
                            const val = row[col.name];
                            return (
                              <td key={col.name} className="px-3 py-1 border-r border-b border-[#cbd5e1] whitespace-nowrap truncate max-w-xs text-slate-800">
                                {val === null ? (
                                  <span className="bg-[#475569] text-white text-[9px] px-1.5 py-0.2 rounded font-sans font-bold">NULL</span>
                                ) : (
                                  String(val)
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                    {isExecuting ? 'Executing query against MySQL 8.4 engine...' : 'Click "Execute" or write a SQL query to view result rows.'}
                  </div>
                )}
              </div>

              {/* Action Output Log Panel */}
              <div className="h-32 bg-[#fafbfc] flex flex-col font-mono text-[11px] overflow-hidden">
                <div className="h-6 bg-[#edf2f7] px-3 border-t border-b border-[#cbd5e1] flex items-center font-sans font-bold text-slate-600 text-[10px]">
                  Action Output
                </div>
                <div className="flex-1 overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#f8fafc] text-slate-500 border-b border-[#e2e8f0] text-[10px] sticky top-0">
                      <tr>
                        <th className="w-8 px-2 py-1"></th>
                        <th className="w-8 px-2 py-1">#</th>
                        <th className="w-20 px-2 py-1">Time</th>
                        <th className="px-3 py-1">Action</th>
                        <th className="px-3 py-1">Response</th>
                        <th className="w-36 px-2 py-1 text-right">Duration / Fetch Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {actionOutputs.map((act, index) => (
                        <tr key={act.id} className="border-b border-[#e2e8f0] hover:bg-slate-100">
                          <td className="px-2 py-0.5 text-center">
                            {act.status === 'success' ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 inline" />
                            ) : (
                              <AlertCircle className="w-3.5 h-3.5 text-rose-500 inline" />
                            )}
                          </td>
                          <td className="px-2 py-0.5 text-slate-400">{index + 1}</td>
                          <td className="px-2 py-0.5 text-slate-600">{act.time}</td>
                          <td className="px-3 py-0.5 font-mono text-slate-800 truncate max-w-md">{act.action}</td>
                          <td className="px-3 py-0.5 text-slate-600">{act.response}</td>
                          <td className="px-2 py-0.5 text-right text-slate-500">{act.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SERVER STATUS VIEW */}
        {mainView === 'status' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-800">MySQL Server Status</h2>
                <p className="text-xs text-slate-500">Instance health and hardware resource utilization</p>
              </div>
              <button onClick={fetchServerMetrics} className="px-3 py-1.5 bg-blue-600 text-white rounded font-bold text-xs flex items-center gap-1">
                <RefreshCw className="w-3 h-3" />
                <span>Refresh</span>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 border rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Engine Version</span>
                <div className="text-base font-black text-slate-800">{serverMetrics?.version || '8.4.0 LTS'}</div>
                <span className="text-[10px] text-emerald-600 font-bold">Official Production</span>
              </div>
              <div className="p-4 bg-slate-50 border rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Server Uptime</span>
                <div className="text-base font-black text-slate-800">{serverMetrics?.uptimeFormatted || '1 day, 4 hours'}</div>
                <span className="text-[10px] text-slate-500">Continuous 100% SLA</span>
              </div>
              <div className="p-4 bg-slate-50 border rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Active Connections</span>
                <div className="text-base font-black text-slate-800">{serverMetrics?.activeConnections || 2}</div>
                <span className="text-[10px] text-blue-600">Max limit: 151</span>
              </div>
              <div className="p-4 bg-slate-50 border rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">InnoDB Buffer Pool</span>
                <div className="text-base font-black text-slate-800">{serverMetrics?.bufferPoolMb || '128.0'} MB</div>
                <span className="text-[10px] text-purple-600">Cached in memory</span>
              </div>
            </div>
          </div>
        )}

        {/* CLIENT CONNECTIONS VIEW */}
        {mainView === 'connections' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <h2 className="text-base font-bold text-slate-800">Client Process List (SHOW PROCESSLIST)</h2>
            <div className="border rounded-xl overflow-hidden">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-slate-100 border-b">
                  <tr>
                    <th className="p-2">Id</th>
                    <th className="p-2">User</th>
                    <th className="p-2">Host</th>
                    <th className="p-2">db</th>
                    <th className="p-2">Command</th>
                    <th className="p-2">Time</th>
                    <th className="p-2">State</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-slate-50">
                    <td className="p-2">1</td>
                    <td className="p-2 font-bold text-blue-700">usr_01net</td>
                    <td className="p-2">localhost:53120</td>
                    <td className="p-2 text-emerald-700">sakila</td>
                    <td className="p-2">Query</td>
                    <td className="p-2">0</td>
                    <td className="p-2 text-emerald-600">executing</td>
                  </tr>
                  <tr className="border-b hover:bg-slate-50">
                    <td className="p-2">2</td>
                    <td className="p-2">system_daemon</td>
                    <td className="p-2">localhost</td>
                    <td className="p-2">NULL</td>
                    <td className="p-2">Sleep</td>
                    <td className="p-2">140</td>
                    <td className="p-2 text-slate-400">waiting</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── Right Sidebar: Context Help / SQL Syntax ── */}
      <div className="w-64 bg-[#f8fafc] border-l border-[#cbd5e1] p-3 flex flex-col justify-between text-slate-700 overflow-y-auto">
        <div className="space-y-3">
          <div className="flex border-b border-[#cbd5e1] pb-1 text-[11px] font-bold text-slate-600 justify-between">
            <span>Context Help</span>
            <span className="text-[10px] text-blue-600 cursor-pointer">Snippets</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Topic:</span>
            <div className="font-bold text-slate-900 text-sm">SELECT</div>
          </div>

          <div className="space-y-1 text-[11px]">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Syntax:</span>
            <pre className="bg-white p-2 rounded border border-[#cbd5e1] text-[10px] font-mono leading-tight text-slate-800">
{`SELECT
    [ALL | DISTINCT]
    select_expr [, ...]
    [FROM table_references]
    [WHERE where_condition]
    [GROUP BY {col_name | expr}]
    [HAVING where_condition]
    [ORDER BY {col_name} [ASC | DESC]]
    [LIMIT [offset,] row_count]`}</pre>
          </div>

          <div className="text-[11px] text-slate-600 space-y-1.5 leading-relaxed">
            <p>
              <code>SELECT</code> is used to retrieve rows selected from one or more tables, and can include <code>UNION</code> statements and subqueries.
            </p>
            <p className="text-[10px] text-slate-500">
              The most commonly used clauses of SELECT statements are:
            </p>
            <ul className="list-disc pl-4 text-[10px] text-slate-500 space-y-0.5">
              <li><code>FROM</code>: Target database tables</li>
              <li><code>WHERE</code>: Filter criteria condition</li>
              <li><code>ORDER BY</code>: Sort columns asc/desc</li>
              <li><code>LIMIT</code>: Constrain result set count</li>
            </ul>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-400 text-center">
          MySQL Workbench Pro for macOS
        </div>
      </div>
    </div>
  );
}
