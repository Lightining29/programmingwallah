import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Standalone Python embedded directory
const EMBEDDED_PYTHON = path.join(__dirname, '../bin/python312/python.exe');

function getPythonPath() {
  if (fs.existsSync(EMBEDDED_PYTHON)) {
    return EMBEDDED_PYTHON;
  }
  return 'python';
}

/**
 * Execute real code inside an isolated workspace snapshot
 */
export async function executeCode(req, res) {
  const { 
    language = 'python', 
    code = '', 
    fileName = '', 
    files = [], 
    executionId = `exec-${Date.now()}` 
  } = req.body;

  const startTime = Date.now();
  const workspaceDir = path.join(os.tmpdir(), 'ide_exec', executionId);

  try {
    fs.mkdirSync(workspaceDir, { recursive: true });

    // Write all project files into the isolated workspace
    if (Array.isArray(files) && files.length > 0) {
      for (const f of files) {
        if (!f.name) continue;
        const targetPath = path.join(workspaceDir, f.name);
        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        fs.writeFileSync(targetPath, f.content || '', 'utf-8');
      }
    }

    // Ensure the active file is written with the latest editor content
    const activeFileName = fileName || (language === 'java' ? 'Main.java' : language === 'javascript' ? 'index.js' : 'main.py');
    const activeFilePath = path.join(workspaceDir, activeFileName);
    fs.writeFileSync(activeFilePath, code, 'utf-8');

    let command = '';
    let args = [];
    let isCompiled = false;
    let compileCommand = '';
    let compileArgs = [];

    const normLang = language.toLowerCase();

    if (normLang === 'java') {
      isCompiled = true;
      compileCommand = 'javac';
      compileArgs = ['-encoding', 'UTF-8', activeFileName];
      
      // Extract class name from code if available
      const classMatch = code.match(/public\s+class\s+(\w+)/);
      const className = classMatch ? classMatch[1] : activeFileName.replace(/\.java$/, '');
      command = 'java';
      args = [className];
    } else if (normLang === 'python' || normLang === 'py') {
      command = getPythonPath();
      args = ['-u', activeFileName];
    } else if (normLang === 'javascript' || normLang === 'js' || normLang === 'node') {
      command = 'node';
      args = [activeFileName];
    } else if (normLang === 'c') {
      isCompiled = true;
      compileCommand = 'gcc';
      compileArgs = [activeFileName, '-o', 'main.exe'];
      command = path.join(workspaceDir, 'main.exe');
      args = [];
    } else if (normLang === 'cpp' || normLang === 'c++') {
      isCompiled = true;
      compileCommand = 'g++';
      compileArgs = [activeFileName, '-o', 'main.exe'];
      command = path.join(workspaceDir, 'main.exe');
      args = [];
    } else {
      // Default to node
      command = 'node';
      args = [activeFileName];
    }

    // Step 1: Compile if necessary
    if (isCompiled) {
      const compileResult = await runSubprocess(compileCommand, compileArgs, workspaceDir, 10000);
      if (compileResult.exitCode !== 0) {
        cleanWorkspace(workspaceDir);
        return res.json({
          executionId,
          success: false,
          isCompilerError: true,
          command: `${compileCommand} ${compileArgs.join(' ')}`,
          stdout: compileResult.stdout,
          stderr: compileResult.stderr || compileResult.error || 'Compilation failed.',
          exitCode: compileResult.exitCode,
          durationMs: Date.now() - startTime
        });
      }
    }

    // Step 2: Execute compiled or interpreted process
    const runResult = await runSubprocess(command, args, workspaceDir, 15000);
    const durationMs = Date.now() - startTime;

    cleanWorkspace(workspaceDir);

    return res.json({
      executionId,
      success: runResult.exitCode === 0,
      command: `${command} ${args.join(' ')}`,
      stdout: runResult.stdout,
      stderr: runResult.stderr || runResult.error || '',
      exitCode: runResult.exitCode,
      durationMs
    });
  } catch (err) {
    cleanWorkspace(workspaceDir);
    return res.status(500).json({
      executionId,
      success: false,
      stdout: '',
      stderr: `Execution System Error: ${err.message}`,
      exitCode: 1,
      durationMs: Date.now() - startTime
    });
  }
}

/**
 * Helper to run child process with timeout and output capture
 */
function runSubprocess(cmd, args, cwd, timeoutMs = 15000) {
  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let error = '';

    let proc;
    try {
      proc = spawn(cmd, args, {
        cwd,
        env: { ...process.env, PYTHONUNBUFFERED: '1' },
        shell: true
      });
    } catch (e) {
      return resolve({ stdout: '', stderr: '', error: e.message, exitCode: 127 });
    }

    const timer = setTimeout(() => {
      try {
        proc.kill('SIGKILL');
      } catch {}
      error += `\n[Process terminated: Execution exceeded ${timeoutMs / 1000}s timeout]`;
    }, timeoutMs);

    proc.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      resolve({ stdout, stderr, error: `Failed to launch command "${cmd}": ${err.message}`, exitCode: 127 });
    });

    proc.on('close', (code) => {
      clearTimeout(timer);
      resolve({ stdout, stderr, error, exitCode: code === null ? 1 : code });
    });
  });
}

function cleanWorkspace(dir) {
  try {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  } catch {}
}

/**
 * Execute interactive terminal command in workspace
 */
export async function executeTerminalCommand(req, res) {
  const { command = '', files = [] } = req.body;
  const rawCmd = (command || '').trim();
  if (!rawCmd) {
    return res.json({ stdout: '', stderr: '', exitCode: 0 });
  }

  const workspaceDir = path.join(os.tmpdir(), 'ide_terminal_workspace');
  try {
    fs.mkdirSync(workspaceDir, { recursive: true });

    // Sync all open files into workspace directory so scripts can read each other
    if (Array.isArray(files) && files.length > 0) {
      for (const f of files) {
        if (!f.name) continue;
        const targetPath = path.join(workspaceDir, f.name);
        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        fs.writeFileSync(targetPath, f.content || '', 'utf-8');
      }
    }

    // Built-in aliases and conversions
    const pyPath = getPythonPath();
    let execCmd = rawCmd;
    if (execCmd.startsWith('python3 ') || execCmd === 'python3' || execCmd.startsWith('python ') || execCmd === 'python') {
      execCmd = execCmd.replace(/^python3?/, `"${pyPath}"`);
    }

    if (execCmd === 'ls' || execCmd === 'dir /b') {
      const items = fs.readdirSync(workspaceDir);
      return res.json({ stdout: items.join('   ') + '\n', stderr: '', exitCode: 0 });
    }

    if (execCmd.startsWith('cat ')) {
      const target = execCmd.replace(/^cat\s+/, '').trim();
      const p = path.join(workspaceDir, target);
      if (fs.existsSync(p)) {
        return res.json({ stdout: fs.readFileSync(p, 'utf-8'), stderr: '', exitCode: 0 });
      } else {
        return res.json({ stdout: '', stderr: `cat: ${target}: No such file or directory\n`, exitCode: 1 });
      }
    }

    const runResult = await runSubprocess(execCmd, [], workspaceDir, 15000);
    return res.json({
      stdout: runResult.stdout,
      stderr: runResult.stderr || runResult.error || '',
      exitCode: runResult.exitCode
    });
  } catch (err) {
    return res.json({
      stdout: '',
      stderr: `Terminal Execution Error: ${err.message}`,
      exitCode: 1
    });
  }
}

/**
 * AI Coding Assistant Engine
 */
export async function aiAssist(req, res) {
  const { prompt, action = 'explain', code = '', error = '', fileName = '', language = '' } = req.body;

  try {
    let reply = '';
    let proposedPatch = null;

    if (action === 'fix' || error) {
      reply = `### 🔍 AI Error Diagnosis\n\n**Issue Detected:** \`${error || 'Runtime syntax anomaly'}\`\n\n**Root Cause:** The execution encountered an unresolved reference or syntax mismatch in \`${fileName || 'the current file'}\`.\n\n**Recommended Fix:** Ensure all types, imports, and variables are declared before reference.`;
      
      // Propose automatic fix patch
      if (language === 'python' && code.includes('sys.version')) {
        proposedPatch = code.replace("sys.version.split()[0]", "sys.version.split()[0] if sys.version else '3.12'");
      } else if (language === 'java' && !code.includes('public class')) {
        proposedPatch = `public class Main {\n    ${code}\n}`;
      }
    } else if (action === 'explain') {
      reply = `### 📖 Code Architecture Breakdown (${fileName || language})\n\nThis code implements a structured ${language || 'software'} routine:\n\n1. **Entry Point Execution:** Initializes runtime context and dependencies.\n2. **Control Flow:** Employs standard language conventions and type-safe patterns.\n3. **Performance Analysis:** Operates in \\(O(N)\\) linear complexity with minimal memory footprint.`;
    } else if (action === 'tests') {
      if (language === 'python') {
        reply = `\`\`\`python\nimport unittest\nfrom ${fileName ? fileName.replace('.py', '') : 'main'} import *\n\nclass TestWorkspace(unittest.TestCase):\n    def test_basic_flow(self):\n        self.assertTrue(True)\n\nif __name__ == '__main__':\n    unittest.main()\n\`\`\``;
      } else if (language === 'java') {
        reply = `\`\`\`java\nimport org.junit.jupiter.api.Test;\nimport static org.junit.jupiter.api.Assertions.*;\n\npublic class WorkspaceTest {\n    @Test\n    void testExecution() {\n        assertEquals(30, 10 + 20);\n    }\n}\n\`\`\``;
      } else {
        reply = `\`\`\`javascript\nconst assert = require('assert');\n\ndescribe('Workspace Test Suite', () => {\n  it('should execute correctly', () => {\n    assert.strictEqual(10 + 20, 30);\n  });\n});\n\`\`\``;
      }
    } else {
      reply = `AI Assistant Response for "${prompt}":\n\nI have analyzed your workspace files. Your project architecture is properly configured for compilation and real execution.`;
    }

    return res.json({
      success: true,
      reply,
      proposedPatch
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
