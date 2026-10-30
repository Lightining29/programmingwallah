// Persistent Virtual Filesystem (VFS) with IndexedDB & Reactive Event Bus
const DB_NAME = 'macOS_VFS_DB';
const DB_VERSION = 1;
const STORE_NAME = 'vfs_nodes';

class VirtualFileSystem {
  constructor() {
    this.db = null;
    this.listeners = new Set();
    this.readyPromise = this.init();
  }

  async init() {
    if (typeof window === 'undefined' || !window.indexedDB) {
      this.db = null;
      return;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'path' });
          store.createIndex('parentPath', 'parentPath', { unique: false });
          store.createIndex('type', 'type', { unique: false });
        }
      };

      request.onsuccess = async (e) => {
        this.db = e.target.result;
        await this.seedDefaultsIfNeeded();
        resolve(this.db);
      };

      request.onerror = (e) => {
        console.error('Failed to open VFS IndexedDB:', e);
        resolve(null);
      };
    });
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(event) {
    this.listeners.forEach(cb => {
      try { cb(event); } catch (err) { console.error('VFS listener error:', err); }
    });
  }

  async seedDefaultsIfNeeded() {
    const rootCheck = await this.getNode('/');
    if (rootCheck) return; // already seeded

    const defaultNodes = [
      { path: '/', name: 'Macintosh HD', type: 'folder', parentPath: '', updatedAt: Date.now() },
      { path: '/Applications', name: 'Applications', type: 'folder', parentPath: '/', updatedAt: Date.now() },
      { path: '/System', name: 'System', type: 'folder', parentPath: '/', updatedAt: Date.now() },
      { path: '/Users', name: 'Users', type: 'folder', parentPath: '/', updatedAt: Date.now() },
      { path: '/Users/admin', name: 'admin', type: 'folder', parentPath: '/Users', updatedAt: Date.now() },
      { path: '/Users/admin/Desktop', name: 'Desktop', type: 'folder', parentPath: '/Users/admin', updatedAt: Date.now() },
      { path: '/Users/admin/Documents', name: 'Documents', type: 'folder', parentPath: '/Users/admin', updatedAt: Date.now() },
      { path: '/Users/admin/Downloads', name: 'Downloads', type: 'folder', parentPath: '/Users/admin', updatedAt: Date.now() },
      { path: '/Users/admin/Pictures', name: 'Pictures', type: 'folder', parentPath: '/Users/admin', updatedAt: Date.now() },
      { path: '/Users/admin/Music', name: 'Music', type: 'folder', parentPath: '/Users/admin', updatedAt: Date.now() },
      { path: '/Users/admin/Videos', name: 'Videos', type: 'folder', parentPath: '/Users/admin', updatedAt: Date.now() },
      { path: '/Users/admin/.Trash', name: 'Trash', type: 'folder', parentPath: '/Users/admin', updatedAt: Date.now() },

      // Desktop items
      {
        path: '/Users/admin/Desktop/main.py',
        name: 'main.py',
        type: 'file',
        mimeType: 'text/x-python',
        parentPath: '/Users/admin/Desktop',
        size: 512,
        updatedAt: Date.now(),
        content: `# macOS Sequoia - Python 3.12 Sandbox
import sys
import os

def welcome_to_macos():
    print(" Welcome to AppleTree macOS Sequoia!")
    print(f"System: macOS 15.2 Pro | Python {sys.version.split()[0]}")
    print("Filesystem: Persistent IndexedDB POSIX VFS")
    print("Development environment fully operational.")

if __name__ == "__main__":
    welcome_to_macos()
`
      },
      {
        path: '/Users/admin/Desktop/App.java',
        name: 'App.java',
        type: 'file',
        mimeType: 'text/x-java',
        parentPath: '/Users/admin/Desktop',
        size: 640,
        updatedAt: Date.now(),
        content: `public class App {
    public static void main(String[] args) {
        System.out.println(" Java 21 LTS running on macOS Sequoia");
        System.out.println("Status: 100% Industry Ready & Placement Certified");
    }
}
`
      },
      {
        path: '/Users/admin/Desktop/welcome.txt',
        name: 'welcome.txt',
        type: 'file',
        mimeType: 'text/plain',
        parentPath: '/Users/admin/Desktop',
        size: 320,
        updatedAt: Date.now(),
        content: `Welcome to macOS Sequoia Web Edition!

This is a true browser-based operating system powered by:
- Persistent IndexedDB Virtual Filesystem
- Dynamic .webapp App Store with package installation
- Resizable and draggable window manager with window snapping
- Monaco Editor VS Code development suite
- Terminal with POSIX shell commands (ls, cd, mkdir, cat, touch, rm, os install)
- Safari Browser with live web search
`
      },

      // Documents
      {
        path: '/Users/admin/Documents/project_roadmap.md',
        name: 'project_roadmap.md',
        type: 'file',
        mimeType: 'text/markdown',
        parentPath: '/Users/admin/Documents',
        size: 450,
        updatedAt: Date.now(),
        content: `# 2026 Engineering Career Roadmap
1. Java Full Stack Developer (Spring Boot, Microservices)
2. Python AI & Deep Learning Systems
3. AWS & Cloud DevOps Architecture
4. React & Modern Web Systems
`
      },
      {
        path: '/Users/admin/Documents/schema.json',
        name: 'schema.json',
        type: 'file',
        mimeType: 'application/json',
        parentPath: '/Users/admin/Documents',
        size: 180,
        updatedAt: Date.now(),
        content: JSON.stringify({ name: "AppleTree WebOS", version: "15.2.0", kernel: "React-VFS-Microkernel" }, null, 2)
      }
    ];

    for (const node of defaultNodes) {
      await this.putNode(node);
    }
  }

  // ── Database Access Primitives ──
  async getNode(path) {
    await this.readyPromise;
    if (!this.db) return this._getFromLocalStorage(path);

    return new Promise((resolve) => {
      const tx = this.db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(path);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  }

  async putNode(node) {
    await this.readyPromise;
    node.updatedAt = Date.now();
    if (!this.db) return this._putToLocalStorage(node);

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(node);
      req.onsuccess = () => {
        this.notify({ type: 'change', path: node.path });
        resolve(node);
      };
      req.onerror = () => reject(req.error);
    });
  }

  async removeNode(path) {
    await this.readyPromise;
    if (!this.db) return this._removeFromLocalStorage(path);

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(path);
      req.onsuccess = () => {
        this.notify({ type: 'delete', path });
        resolve(true);
      };
      req.onerror = () => reject(req.error);
    });
  }

  // ── High-Level File & Directory Operations ──
  async list(dirPath = '/Users/admin/Desktop') {
    await this.readyPromise;
    const cleanDir = dirPath === '/' ? '/' : dirPath.replace(/\/$/, '');

    if (!this.db) return this._listFromLocalStorage(cleanDir);

    return new Promise((resolve) => {
      const tx = this.db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const index = store.index('parentPath');
      const req = index.getAll(cleanDir);

      req.onsuccess = () => {
        const items = req.result || [];
        resolve(items.sort((a, b) => {
          if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
          return a.name.localeCompare(b.name);
        }));
      };
      req.onerror = () => resolve([]);
    });
  }

  async writeFile(path, content, mimeType = 'text/plain') {
    const parts = path.split('/').filter(Boolean);
    const name = parts[parts.length - 1];
    const parentPath = '/' + parts.slice(0, -1).join('/');

    // Ensure parent folder exists
    if (parentPath && parentPath !== '/') {
      await this.mkdir(parentPath);
    }

    const node = {
      path,
      name,
      parentPath: parentPath || '/',
      type: 'file',
      mimeType,
      size: typeof content === 'string' ? content.length : (content?.byteLength || 1024),
      content,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    return await this.putNode(node);
  }

  async readFile(path) {
    const node = await this.getNode(path);
    if (!node) throw new Error(`File not found: ${path}`);
    if (node.type !== 'file') throw new Error(`Path is a directory: ${path}`);
    return node.content;
  }

  async mkdir(path) {
    const cleanPath = path.replace(/\/$/, '');
    const existing = await this.getNode(cleanPath);
    if (existing) return existing;

    const parts = cleanPath.split('/').filter(Boolean);
    let currentPath = '';

    for (let i = 0; i < parts.length; i++) {
      const parent = currentPath || '/';
      currentPath = currentPath + '/' + parts[i];
      const check = await this.getNode(currentPath);
      if (!check) {
        await this.putNode({
          path: currentPath,
          name: parts[i],
          parentPath: parent,
          type: 'folder',
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
      }
    }

    return await this.getNode(cleanPath);
  }

  async delete(path, moveToTrash = true) {
    const node = await this.getNode(path);
    if (!node) return false;

    if (moveToTrash && !path.startsWith('/Users/admin/.Trash')) {
      const trashPath = `/Users/admin/.Trash/${node.name}-${Date.now()}`;
      return await this.move(path, trashPath);
    }

    // Recursively delete children if directory
    if (node.type === 'folder') {
      const children = await this.list(path);
      for (const child of children) {
        await this.delete(child.path, false);
      }
    }

    return await this.removeNode(path);
  }

  async emptyTrash() {
    const trashItems = await this.list('/Users/admin/.Trash');
    for (const item of trashItems) {
      await this.delete(item.path, false);
    }
    this.notify({ type: 'empty-trash' });
    return true;
  }

  async rename(oldPath, newName) {
    const node = await this.getNode(oldPath);
    if (!node) throw new Error(`Item not found: ${oldPath}`);

    const newPath = (node.parentPath === '/' ? '' : node.parentPath) + '/' + newName;
    const existing = await this.getNode(newPath);
    if (existing) throw new Error(`An item named "${newName}" already exists here.`);

    await this.removeNode(oldPath);
    node.path = newPath;
    node.name = newName;
    await this.putNode(node);

    // If folder, update descendants
    if (node.type === 'folder') {
      const allDescendants = await this.getAllDescendants(oldPath);
      for (const desc of allDescendants) {
        await this.removeNode(desc.path);
        desc.path = desc.path.replace(oldPath, newPath);
        desc.parentPath = desc.parentPath.replace(oldPath, newPath);
        await this.putNode(desc);
      }
    }

    return node;
  }

  async move(srcPath, destPath) {
    const node = await this.getNode(srcPath);
    if (!node) throw new Error(`Source not found: ${srcPath}`);

    const parts = destPath.split('/').filter(Boolean);
    const newName = parts[parts.length - 1];
    const parentPath = '/' + parts.slice(0, -1).join('/');

    await this.removeNode(srcPath);
    node.path = destPath;
    node.name = newName;
    node.parentPath = parentPath || '/';
    await this.putNode(node);

    if (node.type === 'folder') {
      const allDescendants = await this.getAllDescendants(srcPath);
      for (const desc of allDescendants) {
        await this.removeNode(desc.path);
        desc.path = desc.path.replace(srcPath, destPath);
        desc.parentPath = desc.parentPath.replace(srcPath, destPath);
        await this.putNode(desc);
      }
    }

    return node;
  }

  async copy(srcPath, destDir) {
    const node = await this.getNode(srcPath);
    if (!node) throw new Error(`Source not found: ${srcPath}`);

    let copyName = node.name;
    let targetPath = `${destDir.replace(/\/$/, '')}/${copyName}`;

    // Auto rename if duplicate
    let counter = 1;
    while (await this.getNode(targetPath)) {
      const extMatch = node.name.match(/\.[^.]+$/);
      if (extMatch) {
        const base = node.name.slice(0, extMatch.index);
        copyName = `${base} copy ${counter}${extMatch[0]}`;
      } else {
        copyName = `${node.name} copy ${counter}`;
      }
      targetPath = `${destDir.replace(/\/$/, '')}/${copyName}`;
      counter++;
    }

    const newNode = {
      ...node,
      path: targetPath,
      name: copyName,
      parentPath: destDir.replace(/\/$/, '') || '/',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    await this.putNode(newNode);
    return newNode;
  }

  async search(query) {
    await this.readyPromise;
    if (!query) return [];
    const q = query.toLowerCase();

    return new Promise((resolve) => {
      const tx = this.db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        const all = req.result || [];
        const matches = all.filter(item => 
          item.name.toLowerCase().includes(q) || 
          (typeof item.content === 'string' && item.content.toLowerCase().includes(q))
        );
        resolve(matches.slice(0, 20));
      };
      req.onerror = () => resolve([]);
    });
  }

  async getAllDescendants(prefix) {
    return new Promise((resolve) => {
      const tx = this.db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const all = req.result || [];
        resolve(all.filter(n => n.path.startsWith(prefix + '/')));
      };
      req.onerror = () => resolve([]);
    });
  }

  async getStorageStats() {
    await this.readyPromise;
    return new Promise((resolve) => {
      const tx = this.db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const all = req.result || [];
        let totalBytes = 0;
        let fileCount = 0;
        let folderCount = 0;
        all.forEach(n => {
          if (n.type === 'file') {
            totalBytes += (n.size || 0);
            fileCount++;
          } else {
            folderCount++;
          }
        });
        resolve({
          totalBytes,
          formattedSize: (totalBytes / 1024).toFixed(1) + ' KB',
          fileCount,
          folderCount
        });
      };
      req.onerror = () => resolve({ totalBytes: 0, formattedSize: '0 KB', fileCount: 0, folderCount: 0 });
    });
  }

  // ── LocalStorage Fallback ──
  _getLS() {
    try {
      return JSON.parse(localStorage.getItem('macos_vfs_backup') || '{}');
    } catch { return {}; }
  }
  _saveLS(data) {
    try {
      localStorage.setItem('macos_vfs_backup', JSON.stringify(data));
    } catch {}
  }
  _getFromLocalStorage(path) {
    return this._getLS()[path] || null;
  }
  _putToLocalStorage(node) {
    const data = this._getLS();
    data[node.path] = node;
    this._saveLS(data);
    this.notify({ type: 'change', path: node.path });
    return node;
  }
  _removeFromLocalStorage(path) {
    const data = this._getLS();
    delete data[path];
    this._saveLS(data);
    this.notify({ type: 'delete', path });
    return true;
  }
  _listFromLocalStorage(parentPath) {
    const data = this._getLS();
    return Object.values(data).filter(n => n.parentPath === parentPath);
  }
}

export const vfs = new VirtualFileSystem();
export default vfs;
