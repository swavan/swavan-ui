import Dexie from 'dexie';

const db = new Dexie('swaVanDb');
db.version(3).stores({
    settings: `++id, isEnabled, reload, mockApiUrl`,
    hostURLs: `++id, url`,
    rules: `++id, name, description, source_type, source, operator, is_enabled, is_favorite, responses`,
    requestFilterTypes: `++id, types`,
});



export default db;
