import Dexie from 'dexie';

const db = new Dexie('swaVanDb');
db.version(1).stores({
    settings: `++id, isEnabled, reload`,
    hostURLs: `++id, url`,
    rules: `++id, name, description, source_type, source, operator, is_enabled, responses`,
});



export default db;
