import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory for portable JDK installations
const PORTABLE_JDK_DIR = path.join(__dirname, '../../storage/jdks');

class JavaRuntimeService {
  constructor() {
    this.activeJdk = null;
    this.installedJdks = [];
    this.osType = process.platform; // 'darwin', 'linux', 'win32'
    this.osArch = process.arch;     // 'arm64', 'x64'
    this.ensureStorageDir();
    this.refreshInstalledJdks();
  }

  ensureStorageDir() {
    try {
      fs.mkdirSync(PORTABLE_JDK_DIR, { recursive: true });
    } catch {}
  }

  getArchName() {
    if (this.osArch === 'arm64') return 'aarch64';
    if (this.osArch === 'x64') return 'x64';
    return this.osArch;
  }

  getPlatformName() {
    if (this.osType === 'darwin') return 'mac';
    if (this.osType === 'linux') return 'linux';
    if (this.osType === 'win32') return 'windows';
    return this.osType;
  }

  /**
   * Comprehensive search for all installed JDKs across macOS, Linux, and Windows
   */
  refreshInstalledJdks() {
    const isWin = this.osType === 'win32';
    const isMac = this.osType === 'darwin';
    const isLinux = this.osType === 'linux';
    const exeSuffix = isWin ? '.exe' : '';

    const discovered = [];
    const seenPaths = new Set();

    const addJdkIfValid = (homePath, sourceTag) => {
      if (!homePath || seenPaths.has(homePath)) return;
      try {
        if (!fs.existsSync(homePath)) return;

        let javacPath = path.join(homePath, 'bin', `javac${exeSuffix}`);
        let javaPath = path.join(homePath, 'bin', `java${exeSuffix}`);

        // Handle macOS bundle structure /Contents/Home
        if (isMac && !fs.existsSync(javacPath)) {
          const contentsHome = path.join(homePath, 'Contents', 'Home');
          if (fs.existsSync(contentsHome)) {
            homePath = contentsHome;
            javacPath = path.join(homePath, 'bin', 'javac');
            javaPath = path.join(homePath, 'bin', 'java');
          }
        }

        if (fs.existsSync(javacPath) && fs.existsSync(javaPath)) {
          let javacVer = '';
          let javaVer = '';
          try {
            javacVer = execSync(`"${javacPath}" -version`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
          } catch (e) {
            javacVer = (e.stdout || e.stderr || '').toString().trim();
          }

          try {
            javaVer = execSync(`"${javaPath}" -version`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
          } catch (e) {
            javaVer = (e.stdout || e.stderr || '').toString().trim();
          }

          const versionMatch = javacVer.match(/\d+(\.\d+)*/);
          const majorVer = versionMatch ? versionMatch[0].split('.')[0] : '21';

          seenPaths.add(homePath);
          discovered.push({
            id: `jdk-${majorVer}-${discovered.length + 1}`,
            name: `OpenJDK ${majorVer}`,
            majorVersion: parseInt(majorVer, 10),
            fullVersion: javacVer.replace(/^javac\s*/i, '') || javaVer.split('\n')[0],
            home: homePath,
            javacPath,
            javaPath,
            source: sourceTag,
            isDefault: false
          });
        }
      } catch {}
    };

    // 1. Check process.env.JAVA_HOME
    if (process.env.JAVA_HOME) {
      addJdkIfValid(process.env.JAVA_HOME, 'Environment (JAVA_HOME)');
    }

    // 2. Portable JDKs folder
    try {
      if (fs.existsSync(PORTABLE_JDK_DIR)) {
        const subdirs = fs.readdirSync(PORTABLE_JDK_DIR, { withFileTypes: true });
        for (const dir of subdirs) {
          if (dir.isDirectory()) {
            addJdkIfValid(path.join(PORTABLE_JDK_DIR, dir.name), 'Portable JDK Workspace');
          }
        }
      }
    } catch {}

    // 3. Operating System Specific Locations
    if (isMac) {
      // macOS standard paths
      const macVmDir = '/Library/Java/JavaVirtualMachines';
      try {
        if (fs.existsSync(macVmDir)) {
          const vms = fs.readdirSync(macVmDir);
          for (const vm of vms) {
            addJdkIfValid(path.join(macVmDir, vm, 'Contents', 'Home'), 'macOS System JVM');
          }
        }
      } catch {}

      // Homebrew paths on macOS (Apple Silicon /opt/homebrew and Intel /usr/local)
      const brewDirs = [
        '/opt/homebrew/opt/openjdk',
        '/opt/homebrew/opt/openjdk@21',
        '/opt/homebrew/opt/openjdk@17',
        '/opt/homebrew/opt/openjdk@25',
        '/usr/local/opt/openjdk',
        '/usr/local/opt/openjdk@21',
        '/usr/local/opt/openjdk@17'
      ];
      for (const bd of brewDirs) {
        addJdkIfValid(bd, 'Homebrew OpenJDK');
      }

      // Native /usr/libexec/java_home check
      try {
        const jhOut = execSync('/usr/libexec/java_home', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
        if (jhOut) addJdkIfValid(jhOut, 'macOS java_home');
      } catch {}

    } else if (isLinux) {
      // Linux / Ubuntu / Debian / Alpine paths
      const linuxDirs = [
        '/usr/lib/jvm/java-21-openjdk',
        '/usr/lib/jvm/java-17-openjdk',
        '/usr/lib/jvm/java-27-openjdk',
        '/usr/lib/jvm/java-25-openjdk',
        '/usr/lib/jvm/default-jvm',
        '/usr/lib/jvm/java-11-openjdk',
        '/opt/java/openjdk'
      ];
      for (const ld of linuxDirs) {
        addJdkIfValid(ld, 'Linux System OpenJDK');
      }

      try {
        if (fs.existsSync('/usr/lib/jvm')) {
          const jvms = fs.readdirSync('/usr/lib/jvm');
          for (const jvm of jvms) {
            addJdkIfValid(path.join('/usr/lib/jvm', jvm), 'Linux /usr/lib/jvm');
          }
        }
      } catch {}

    } else if (isWin) {
      // Windows standard paths
      const winDirs = [
        'C:\\Program Files\\Java\\jdk-27',
        'C:\\Program Files\\Java\\jdk-21',
        'C:\\Program Files\\Java\\jdk-17',
        'C:\\Program Files\\Java\\jdk-25',
        'C:\\Program Files\\Eclipse Adoptium\\jdk-21.0.2.13-hotspot',
        'C:\\Program Files\\Microsoft\\jdk-21.0.2.13-hotspot',
        'C:\\Program Files\\Common Files\\Oracle\\Java\\javapath'
      ];
      for (const wd of winDirs) {
        addJdkIfValid(wd, 'Windows System JDK');
      }

      try {
        if (fs.existsSync('C:\\Program Files\\Java')) {
          const javs = fs.readdirSync('C:\\Program Files\\Java');
          for (const j of javs) {
            addJdkIfValid(path.join('C:\\Program Files\\Java', j), 'Windows Program Files');
          }
        }
      } catch {}
    }

    // 4. PATH fallback check
    try {
      const checkCmd = isWin ? 'where javac' : 'which javac';
      const javacFound = execSync(checkCmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim().split(/\r?\n/)[0];
      if (javacFound && fs.existsSync(javacFound)) {
        const binDir = path.dirname(javacFound);
        const homeCandidate = path.dirname(binDir);
        addJdkIfValid(homeCandidate, 'System PATH');
      }
    } catch {}

    // Sort JDKs by major version descending (e.g. 27, 25, 21, 17)
    discovered.sort((a, b) => b.majorVersion - a.majorVersion);

    this.installedJdks = discovered;

    // Set default active JDK if not currently set
    if (!this.activeJdk && this.installedJdks.length > 0) {
      this.setActiveJdk(this.installedJdks[0].id);
    } else if (this.activeJdk) {
      const stillExists = this.installedJdks.find(j => j.id === this.activeJdk.id);
      if (stillExists) {
        this.activeJdk = stillExists;
        stillExists.isDefault = true;
      } else if (this.installedJdks.length > 0) {
        this.setActiveJdk(this.installedJdks[0].id);
      }
    }

    return this.installedJdks;
  }

  setActiveJdk(jdkId) {
    const target = this.installedJdks.find(j => j.id === jdkId || String(j.majorVersion) === String(jdkId));
    if (!target) {
      throw new Error(`JDK version "${jdkId}" not found in installed environments.`);
    }

    this.installedJdks.forEach(j => { j.isDefault = false; });
    target.isDefault = true;
    this.activeJdk = target;

    // Apply to process environment
    process.env.JAVA_HOME = target.home;
    const binDir = path.join(target.home, 'bin');
    if (!process.env.PATH.includes(binDir)) {
      process.env.PATH = `${binDir}${path.delimiter}${process.env.PATH}`;
    }

    return target;
  }

  getActiveJdk() {
    if (!this.activeJdk) {
      this.refreshInstalledJdks();
    }
    return this.activeJdk;
  }

  getStatus() {
    this.refreshInstalledJdks();
    const active = this.getActiveJdk();
    const isReady = Boolean(active && fs.existsSync(active.javacPath) && fs.existsSync(active.javaPath));

    return {
      isReady,
      activeJdk: active ? {
        id: active.id,
        name: active.name,
        majorVersion: active.majorVersion,
        fullVersion: active.fullVersion,
        home: active.home,
        javacPath: active.javacPath,
        javaPath: active.javaPath,
        source: active.source
      } : null,
      installedCount: this.installedJdks.length,
      installedJdks: this.installedJdks,
      javaHome: process.env.JAVA_HOME || active?.home || null,
      os: {
        platform: this.osType,
        arch: this.osArch,
        friendlyName: this.osType === 'darwin' ? 'macOS (Sequoia/Sonoma)' : this.osType === 'win32' ? 'Windows' : 'Linux'
      },
      statusMessage: isReady 
        ? `Java Runtime: ${active.name} (${active.fullVersion || 'Ready'}) | Compiler: Available | JAVA_HOME: Configured` 
        : 'Java Development Kit is not installed. Please click "Install JDK" to provision OpenJDK.'
    };
  }

  /**
   * Diagnostic verification helper
   */
  async verifyInstallation() {
    const active = this.getActiveJdk();
    if (!active) {
      return {
        success: false,
        javacOutput: '',
        javaOutput: '',
        javaHome: process.env.JAVA_HOME || '',
        message: 'No active JDK is configured.'
      };
    }

    try {
      const javacOutput = execSync(`"${active.javacPath}" -version`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
      let javaOutput = '';
      try {
        javaOutput = execSync(`"${active.javaPath}" -version`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
      } catch (e) {
        javaOutput = (e.stdout || e.stderr || '').toString().trim();
      }

      return {
        success: true,
        javacOutput: javacOutput || 'javac active',
        javaOutput: javaOutput || 'java active',
        javaHome: active.home,
        activeJdk: active
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
        javaHome: active.home
      };
    }
  }

  /**
   * Safe execution of javac and java with standard output formatting
   */
  async executeJavaSource({ code = '', fileName = 'App.java', files = [], workspaceDir, timeoutMs = 15000 }) {
    const active = this.getActiveJdk();
    if (!active) {
      throw new Error('JDK_NOT_FOUND: Java Development Kit is not configured in the execution environment.');
    }

    fs.mkdirSync(workspaceDir, { recursive: true });

    // Sync all open project files to the workspace
    if (Array.isArray(files) && files.length > 0) {
      for (const f of files) {
        if (!f.name || f.name.includes('..')) continue;
        const targetPath = path.join(workspaceDir, f.name);
        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        fs.writeFileSync(targetPath, f.content || '', 'utf-8');
      }
    }

    // Extract package and main class
    let packageName = null;
    const pkgMatch = code.match(/package\s+([a-zA-Z0-9_.]+)\s*;/);
    if (pkgMatch) packageName = pkgMatch[1].trim();

    let className = 'App';
    const pubClassMatch = code.match(/public\s+(?:final\s+|abstract\s+)?class\s+([A-Za-z0-9_$]+)/);
    if (pubClassMatch) {
      className = pubClassMatch[1].trim();
    } else {
      const classMatch = code.match(/class\s+([A-Za-z0-9_$]+)/);
      if (classMatch) className = classMatch[1].trim();
      else if (fileName) className = fileName.replace(/\.java$/i, '');
    }

    const actualSourceFile = `${className}.java`;
    let targetSourcePath = path.join(workspaceDir, actualSourceFile);
    if (packageName) {
      const pkgDir = path.join(workspaceDir, ...packageName.split('.'));
      fs.mkdirSync(pkgDir, { recursive: true });
      targetSourcePath = path.join(pkgDir, actualSourceFile);
    }
    fs.writeFileSync(targetSourcePath, code, 'utf-8');

    // Find all .java files for compilation
    const javaFilesToCompile = [];
    const collectFiles = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) collectFiles(full);
        else if (e.isFile() && e.name.endsWith('.java')) {
          javaFilesToCompile.push(path.relative(workspaceDir, full));
        }
      }
    };
    collectFiles(workspaceDir);

    // Step 1: Compile with javac
    const compileStartTime = Date.now();
    const compileArgs = ['-encoding', 'UTF-8', '-cp', '.', ...(javaFilesToCompile.length > 0 ? javaFilesToCompile : [actualSourceFile])];
    
    const compileResult = await this.runProcess(active.javacPath, compileArgs, workspaceDir, timeoutMs);
    
    // Filter benign JVM notices (e.g. Picked up JAVA_TOOL_OPTIONS)
    const cleanCompileStderr = this.filterJvmNotices(compileResult.stderr);

    if (compileResult.exitCode !== 0) {
      return {
        success: false,
        isCompilerError: true,
        stdout: compileResult.stdout,
        stderr: cleanCompileStderr || compileResult.stderr,
        exitCode: compileResult.exitCode,
        durationMs: Date.now() - compileStartTime
      };
    }

    // Step 2: Execute with java
    const runStartTime = Date.now();
    const targetClassToRun = packageName ? `${packageName}.${className}` : className;
    const runArgs = ['-Dfile.encoding=UTF-8', '-Xmx256m', '-cp', '.', targetClassToRun];

    const runResult = await this.runProcess(active.javaPath, runArgs, workspaceDir, timeoutMs);
    const cleanRunStderr = this.filterJvmNotices(runResult.stderr);

    return {
      success: runResult.exitCode === 0,
      isCompilerError: false,
      stdout: runResult.stdout,
      stderr: cleanRunStderr,
      exitCode: runResult.exitCode,
      durationMs: Date.now() - compileStartTime
    };
  }

  filterJvmNotices(stderrText = '') {
    if (!stderrText) return '';
    return stderrText
      .split(/\r?\n/)
      .filter(line => !line.startsWith('Picked up JAVA_TOOL_OPTIONS:') && !line.startsWith('Picked up _JAVA_OPTIONS:'))
      .join('\n')
      .trim();
  }

  runProcess(cmdPath, args, cwd, timeoutMs) {
    return new Promise((resolve) => {
      let stdout = '';
      let stderr = '';
      let isTimedOut = false;

      const proc = spawn(cmdPath, args, {
        cwd,
        env: {
          ...process.env,
          JAVA_HOME: this.activeJdk?.home || process.env.JAVA_HOME,
          PATH: `${path.join(this.activeJdk?.home || '', 'bin')}${path.delimiter}${process.env.PATH}`
        }
      });

      const timer = setTimeout(() => {
        isTimedOut = true;
        try { proc.kill('SIGKILL'); } catch {}
      }, timeoutMs);

      proc.stdout?.on('data', d => { stdout += d.toString(); });
      proc.stderr?.on('data', d => { stderr += d.toString(); });

      proc.on('close', code => {
        clearTimeout(timer);
        if (isTimedOut) {
          resolve({ stdout, stderr: `${stderr}\nJAVA_EXECUTION_TIMEOUT: Execution exceeded ${timeoutMs / 1000}s limit.`, exitCode: 124 });
        } else {
          resolve({ stdout, stderr, exitCode: code === null ? 1 : code });
        }
      });

      proc.on('error', err => {
        clearTimeout(timer);
        resolve({ stdout, stderr: err.message, exitCode: 127 });
      });
    });
  }

  /**
   * Clean compiled class files from workspace
   */
  cleanClassFiles(dir) {
    let deletedCount = 0;
    try {
      const cleanDir = (d) => {
        const items = fs.readdirSync(d, { withFileTypes: true });
        for (const item of items) {
          const full = path.join(d, item.name);
          if (item.isDirectory()) {
            cleanDir(full);
          } else if (item.isFile() && item.name.endsWith('.class')) {
            fs.unlinkSync(full);
            deletedCount++;
          }
        }
      };
      if (fs.existsSync(dir)) cleanDir(dir);
    } catch {}
    return deletedCount;
  }
}

const javaRuntimeService = new JavaRuntimeService();
export default javaRuntimeService;
