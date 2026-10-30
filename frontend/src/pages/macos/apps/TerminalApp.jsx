import React, { useState, useRef, useEffect } from 'react';
import vfs from '../services/vfs.js';
import appRegistry, { APP_STORE_CATALOG } from '../services/appRegistry.js';
import macSound from '../services/sound.js';

export default function TerminalApp({ onOpenApp, onOpenFile }) {
  const [cwd, setCwd] = useState('/Users/admin/Desktop');
  const [history, setHistory] = useState([
    { type: 'system', text: 'Last login: Fri Oct 30 20:30:12 on ttys001' },
    { type: 'system', text: ' AppleTree macOS Sequoia 15.2 (Darwin Kernel 24.2.0)' },
    { type: 'system', text: 'POSIX IndexedDB VFS Active. Type "help" or "os system-info" to explore.' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const resolvePath = (target) => {
    if (!target || target === '.') return cwd;
    if (target === '~') return '/Users/admin';
    if (target.startsWith('~/')) return '/Users/admin' + target.slice(1);
    if (target.startsWith('/')) return target;

    const parts = cwd.split('/').filter(Boolean);
    const targetParts = target.split('/').filter(Boolean);

    for (const part of targetParts) {
      if (part === '..') {
        if (parts.length) parts.pop();
      } else if (part !== '.') {
        parts.push(part);
      }
    }
    return '/' + parts.join('/');
  };

  const handleExecute = async (commandLine) => {
    const raw = commandLine.trim();
    if (!raw) return;

    macSound.playClick();
    setCmdHistory(prev => [...prev, raw]);
    setHistoryIdx(-1);

    const promptText = `admin@MacBook-Pro ${cwd.replace('/Users/admin', '~')} % ${raw}`;
    const newHistory = [...history, { type: 'cmd', text: promptText }];

    const tokens = raw.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    const cmd = tokens[0]?.toLowerCase();
    const args = tokens.slice(1).map(a => a.replace(/^"|"$/g, ''));

    switch (cmd) {
      case 'clear':
        setHistory([]);
        return;

      case 'help':
        newHistory.push({
          type: 'output',
          text: `
POSIX Filesystem Commands:
  ls [path]         List files in current or target directory
  cd <dir>          Change working directory (supports ~, .., absolute)
  pwd               Print current working directory
  cat <file>        View file content
  touch <file>      Create a new empty file
  mkdir <dir>       Create a directory
  rm [-rf] <path>   Delete a file or folder
  cp <src> <dest>   Copy a file
  mv <src> <dest>   Move or rename a file
  find <pattern>    Search files across the VFS

System & Diagnostics:
  whoami            Print current user (admin)
  date              Print system date & timestamp
  uname [-a]        Print operating system Darwin kernel info
  ps                List active running processes
  df                Display virtual disk storage statistics
  free              Display virtual memory & buffer usage
  echo <text>       Print text to standard output
  clear             Clear the terminal screen

OS Package Management:
  os list-apps      Display all store & installed .webapp packages
  os install <id>   Install a .webapp package from the App Store
  os uninstall <id> Uninstall an application package
  os open <id|file> Launch an application or open a file
  os system-info    Print macOS Sequoia system specifications
`
        });
        break;

      case 'pwd':
        newHistory.push({ type: 'output', text: cwd });
        break;

      case 'whoami':
        newHistory.push({ type: 'output', text: 'admin' });
        break;

      case 'date':
        newHistory.push({ type: 'output', text: new Date().toString() });
        break;

      case 'uname':
        newHistory.push({
          type: 'output',
          text: 'Darwin AppleTree-MacBookPro.local 24.2.0 Darwin Kernel Version 24.2.0: x86_64'
        });
        break;

      case 'echo':
        newHistory.push({ type: 'output', text: args.join(' ') });
        break;

      case 'cd': {
        const target = resolvePath(args[0] || '~');
        const node = await vfs.getNode(target);
        if (!node) {
          newHistory.push({ type: 'error', text: `cd: no such file or directory: ${args[0]}` });
        } else if (node.type !== 'folder') {
          newHistory.push({ type: 'error', text: `cd: not a directory: ${args[0]}` });
        } else {
          setCwd(target);
        }
        break;
      }

      case 'ls': {
        const target = resolvePath(args[0] || '.');
        const items = await vfs.list(target);
        if (!items || items.length === 0) {
          newHistory.push({ type: 'output', text: '(empty directory)' });
        } else {
          const formatted = items.map(i => {
            const isDir = i.type === 'folder';
            const sizeStr = isDir ? '   DIR' : `${(i.size || 0).toString().padStart(6)}B`;
            return `${sizeStr}  ${isDir ? '📁 ' + i.name + '/' : '📄 ' + i.name}`;
          }).join('\n');
          newHistory.push({ type: 'output', text: formatted });
        }
        break;
      }

      case 'cat': {
        if (!args[0]) {
          newHistory.push({ type: 'error', text: 'cat: missing filename' });
          break;
        }
        const target = resolvePath(args[0]);
        try {
          const content = await vfs.readFile(target);
          newHistory.push({ type: 'output', text: typeof content === 'string' ? content : JSON.stringify(content, null, 2) });
        } catch (err) {
          newHistory.push({ type: 'error', text: `cat: ${err.message}` });
        }
        break;
      }

      case 'touch': {
        if (!args[0]) {
          newHistory.push({ type: 'error', text: 'touch: missing filename' });
          break;
        }
        const target = resolvePath(args[0]);
        await vfs.writeFile(target, '', 'text/plain');
        newHistory.push({ type: 'output', text: `Created file: ${args[0]}` });
        break;
      }

      case 'mkdir': {
        if (!args[0]) {
          newHistory.push({ type: 'error', text: 'mkdir: missing directory name' });
          break;
        }
        const target = resolvePath(args[0]);
        await vfs.mkdir(target);
        newHistory.push({ type: 'output', text: `Created directory: ${args[0]}` });
        break;
      }

      case 'rm': {
        if (!args[0]) {
          newHistory.push({ type: 'error', text: 'rm: missing operand' });
          break;
        }
        const target = resolvePath(args.filter(a => !a.startsWith('-'))[0]);
        const ok = await vfs.delete(target, false);
        if (!ok) newHistory.push({ type: 'error', text: `rm: cannot remove '${args[0]}': No such file` });
        else newHistory.push({ type: 'output', text: `Removed: ${args[0]}` });
        break;
      }

      case 'find': {
        const query = args[0] || '';
        const results = await vfs.search(query);
        const text = results.map(r => r.path).join('\n') || 'No matches found.';
        newHistory.push({ type: 'output', text });
        break;
      }

      case 'df': {
        const stats = await vfs.getStorageStats();
        newHistory.push({
          type: 'output',
          text: `
Filesystem          512-blocks      Used Available Capacity  Mounted on
/dev/disk1s1s1      1048576000   ${stats.totalBytes} 1048500000     1%    /
devfs                     384       384         0   100%    /dev
map auto_home               0         0         0   100%    /System/Volumes/Data/home
`
        });
        break;
      }

      case 'ps':
        newHistory.push({
          type: 'output',
          text: `
  PID TTY           TIME CMD
  101 ??         0:04.12 /System/Library/CoreServices/Finder.app
  204 ??         0:08.54 /Applications/Visual Studio Code.app
  340 ??         0:02.19 /Applications/Safari.app
  412 ttys001    0:00.08 /bin/zsh -i
`
        });
        break;

      case 'python3':
      case 'python': {
        if (!args[0]) {
          newHistory.push({ type: 'output', text: 'Python 3.12.2 (v3.12.2:6abddd9f0a) [Clang 15.0.0 (clang-1500.3.9.4)] on darwin' });
          break;
        }
        const target = resolvePath(args[0]);
        try {
          const content = await vfs.readFile(target);
          newHistory.push({
            type: 'output',
            text: `[Python 3.12 Execution Output]\n>> Running ${args[0]}...\n Initializing AppleTree Python & AI Sandbox...\nSystem: macOS Sequoia 15.2 | Python 3.12.2\nStatus: 100% Industry Certified & Placement Ready!\n>> Process finished with exit code 0.`
          });
        } catch {
          newHistory.push({ type: 'error', text: `python3: can't open file '${args[0]}': [Errno 2] No such file` });
        }
        break;
      }

      case 'javac':
      case 'java': {
        newHistory.push({
          type: 'output',
          text: `[OpenJDK 21 LTS Engine]\nopenjdk version "21.0.2" 2024-01-16 LTS\nOpenJDK Runtime Environment Temurin-21.0.2+13 (build 21.0.2+13)\nOpenJDK 64-Bit Server VM (build 21.0.2+13, mixed mode, sharing)\n>> Compilation and run successful!`
        });
        break;
      }

      case 'os': {
        const sub = args[0];
        if (sub === 'list-apps') {
          const installed = appRegistry.getInstalledApps();
          const lines = installed.map(a => `• ${a.name.padEnd(28)} [${a.id}] (v${a.version})`);
          newHistory.push({ type: 'output', text: 'Installed .webapp Packages:\n' + lines.join('\n') });
        } else if (sub === 'install') {
          const targetId = args[1];
          const found = APP_STORE_CATALOG.find(a => a.id === targetId || a.name.toLowerCase().includes((targetId || '').toLowerCase()));
          if (!found) {
            newHistory.push({ type: 'error', text: `os install: Package not found in catalog: ${targetId}` });
          } else {
            await appRegistry.installApp(found);
            newHistory.push({ type: 'output', text: `✓ Successfully installed ${found.name} into /Applications/${found.id}.webapp` });
          }
        } else if (sub === 'uninstall') {
          const targetId = args[1];
          const ok = await appRegistry.uninstallApp(targetId);
          if (ok) newHistory.push({ type: 'output', text: `✓ Successfully uninstalled ${targetId}` });
          else newHistory.push({ type: 'error', text: `os uninstall: Application not found: ${targetId}` });
        } else if (sub === 'open') {
          const target = args[1];
          if (onOpenApp) onOpenApp(target);
          newHistory.push({ type: 'output', text: `Launching application / window: ${target}` });
        } else if (sub === 'system-info') {
          newHistory.push({
            type: 'output',
            text: 
              "       .:'             admin@MacBook-Pro.local\n" +
              "    __ :'__            -----------------------\n" +
              " .''   \\  ''.          OS: macOS Sequoia 15.2 x86_64\n" +
              ":          :           Host: AppleTree WebOS Desktop Engine\n" +
              ":          :           Kernel: 24.2.0 Darwin\n" +
              " :.      .:            Uptime: 2 days, 14 hours\n" +
              "   ''--''              Packages: 14 (.webapp)\n" +
              "                       Shell: zsh 5.9\n" +
              "                       Terminal: AppleTree Terminal Pro\n" +
              "                       CPU: Apple M3 Max (16 Core Virtual)\n" +
              "                       Memory: 36 GB Unified LPDDR5\n" +
              "                       Storage: IndexedDB Virtual POSIX VFS\n"
          });
        } else {
          newHistory.push({ type: 'error', text: `os: unknown subcommand. Try: list-apps, install, uninstall, open, system-info` });
        }
        break;
      }

      default:
        newHistory.push({ type: 'error', text: `zsh: command not found: ${cmd}. Type "help" for a list of commands.` });
        break;
    }

    setHistory(newHistory);
    setInputVal('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleExecute(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = historyIdx === -1 ? cmdHistory.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setInputVal(cmdHistory[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx === -1) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= cmdHistory.length) {
        setHistoryIdx(-1);
        setInputVal('');
      } else {
        setHistoryIdx(nextIdx);
        setInputVal(cmdHistory[nextIdx]);
      }
    }
  };

  return (
    <div 
      onClick={() => inputRef.current?.focus()}
      className="flex-1 bg-black/95 text-slate-100 p-4 font-mono text-xs overflow-y-auto flex flex-col cursor-text select-text"
      ref={scrollRef}
    >
      {history.map((h, i) => (
        <div key={i} className="mb-1 leading-relaxed">
          {h.type === 'cmd' ? (
            <span className="text-emerald-400 font-bold">{h.text}</span>
          ) : h.type === 'error' ? (
            <span className="text-rose-400">{h.text}</span>
          ) : (
            <pre className="text-slate-300 font-mono whitespace-pre-wrap">{h.text}</pre>
          )}
        </div>
      ))}

      <div className="flex items-center gap-2 mt-1">
        <span className="text-emerald-400 font-bold shrink-0">
          admin@MacBook-Pro {cwd.replace('/Users/admin', '~')} %
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className="flex-1 bg-transparent text-white outline-none font-mono caret-emerald-400"
        />
      </div>
    </div>
  );
}
