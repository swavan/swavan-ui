import Dexie from 'dexie';

const db = new Dexie('swaVanDb');
db.version(1).stores({
    settings: `++id, isEnabled, reload`,
    hostURLs: `++id, url`,
    rules: `++id, name, description, source_type, source, operator, is_enabled`,
    responses: `++id, rule_id, data_source_type, data, http_method, filters, headers, is_logic_enabled `,
});

export default db;
