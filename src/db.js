const DB_NAME = 'CipherVaultDB';
const DB_VERSION = 2;

let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('meta')) {
        db.createObjectStore('meta', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('vaultConfig')) {
        db.createObjectStore('vaultConfig', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('vaultRecords')) {
        const store = db.createObjectStore('vaultRecords', { keyPath: 'id' });
        store.createIndex('folderId', 'folderId');
        store.createIndex('createdAt', 'createdAt');
      }
    };
  });
  return dbPromise;
}

async function getDB() {
  return openDB();
}

export async function getMeta(key) {
  const db = await getDB();
  return new Promise((res, rej) => {
    const tx = db.transaction('meta', 'readonly');
    const store = tx.objectStore('meta');
    const req = store.get(key);
    req.onsuccess = () => res(req.result ? req.result.value : null);
    req.onerror = rej;
  });
}

export async function setMeta(key, value) {
  const db = await getDB();
  return new Promise((res, rej) => {
    const tx = db.transaction('meta', 'readwrite');
    const store = tx.objectStore('meta');
    const req = store.put({ id: key, value });
    req.onsuccess = () => res();
    req.onerror = rej;
  });
}

export async function getVaultConfig() {
  const db = await getDB();
  return new Promise((res, rej) => {
    const tx = db.transaction('vaultConfig', 'readonly');
    const store = tx.objectStore('vaultConfig');
    const req = store.get('config');
    req.onsuccess = () => res(req.result ? req.result.data : null);
    req.onerror = rej;
  });
}

export async function setVaultConfig(data) {
  const db = await getDB();
  return new Promise((res, rej) => {
    const tx = db.transaction('vaultConfig', 'readwrite');
    const store = tx.objectStore('vaultConfig');
    const req = store.put({ id: 'config', data });
    req.onsuccess = () => res();
    req.onerror = rej;
  });
}

export async function getAllVaultRecords() {
  const db = await getDB();
  return new Promise((res, rej) => {
    const tx = db.transaction('vaultRecords', 'readonly');
    const store = tx.objectStore('vaultRecords');
    const req = store.getAll();
    req.onsuccess = () => res(req.result);
    req.onerror = rej;
  });
}

export async function putVaultRecord(record) {
  const db = await getDB();
  return new Promise((res, rej) => {
    const tx = db.transaction('vaultRecords', 'readwrite');
    const store = tx.objectStore('vaultRecords');
    const req = store.put(record);
    req.onsuccess = () => res(req.result);
    req.onerror = rej;
  });
}

export async function deleteVaultRecord(id) {
  const db = await getDB();
  return new Promise((res, rej) => {
    const tx = db.transaction('vaultRecords', 'readwrite');
    const store = tx.objectStore('vaultRecords');
    const req = store.delete(id);
    req.onsuccess = () => res();
    req.onerror = rej;
  });
}

export async function replaceAllVaultRecords(records) {
  const db = await getDB();
  return new Promise((res, rej) => {
    const tx = db.transaction('vaultRecords', 'readwrite');
    const store = tx.objectStore('vaultRecords');
    const clearReq = store.clear();
    clearReq.onsuccess = () => {
      let completed = 0;
      if (records.length === 0) { res(); return; }
      records.forEach(r => {
        const req = store.put(r);
        req.onsuccess = () => { completed++; if (completed === records.length) res(); };
        req.onerror = rej;
      });
    };
    clearReq.onerror = rej;
  });
}
