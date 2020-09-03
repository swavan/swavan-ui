import db from '../database';

export class Api {

    async addSettings(settings) {
        await db.settings.add(settings)
    }

    async updateSettings(settings) {
        await db.settings.put(settings)
    }

    async loadSettings() {
        const status =  await db.settings.toArray()
        return status
    }

    async saveHostURL(url) {
        await db.hostURLs.add({url: url})
    }

    async deleteHostURL(id) {
        await db.hostURLs
            .where("id")
            .equals(id)
            .delete();
    }

    async loadHostURL(search) {
       const urls =  await db.hostURLs
        .filter(row => search ? row.url.includes(search): row)
        .toArray();
        
        return urls
    }



    // async saveRule() {}
    // async saveResponses() {}
    // async saveResponse() {}
    // async removeResponse() {}
    // async removeResponses() {}
    // async getResponses() {}
    // async getRules() {}
}

const api = new Api();
export default api
