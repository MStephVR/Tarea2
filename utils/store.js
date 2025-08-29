'use strict';
const fs = require('fs');
const path = require('path');

const ensureFile = (file) => {
  if (!fs.existsSync(file)) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, '[]', 'utf8');
  }
};

const readJSON = (file) => {
  ensureFile(file);
  const raw = fs.readFileSync(file, 'utf8');
  return JSON.parse(raw || '[]');
};

const writeJSON = (file, data) => {
  ensureFile(file);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
};

class Store {
  constructor(filename) {
    this.file = path.join(__dirname, '..', 'data', filename);
  }
  all() { return readJSON(this.file); }
  saveAll(arr) { writeJSON(this.file, arr); }
  getById(id) { return this.all().find(x => String(x.id) === String(id)); }
  upsert(obj) {
    const list = this.all();
    const idx = list.findIndex(x => String(x.id) === String(obj.id));
    if (idx >= 0) list[idx] = obj;
    else list.push(obj);
    this.saveAll(list);
    return obj;
  }
  delete(id) {
    const list = this.all();
    const idx = list.findIndex(x => String(x.id) === String(id));
    if (idx < 0) return false;
    list.splice(idx, 1);
    this.saveAll(list);
    return true;
  }
}

module.exports = { Store };
