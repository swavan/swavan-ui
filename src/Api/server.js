import axios from 'axios'
import db from '../database';

export default class Mock {
    base = "http://api-hunter.com"
    default_endpoint = `${this.base}/mock/v1`
    override = false
    update_default_endpoint(override_endpoint) {
        this.default_endpoint = override_endpoint;
        this.override = true;
    }



    async customMockUrl () {
        if ( this.override ) {
            return
        }
        let url
        await db.settings.toCollection().first(({ mockApiUrl }) => {
            url = mockApiUrl;
        })
        return url
    }
    async post(payload) {
        const custom_endpoint = await this.customMockUrl()
        const response = await axios.post(`${custom_endpoint || this.default_endpoint}`, payload);
        return response
    }
    async put(payload) {
        const custom_endpoint = await this.customMockUrl()
        await axios.put(`${custom_endpoint || this.default_endpoint}`, payload);
    }
    async delete(payload) {
        const custom_endpoint = await this.customMockUrl()
        await axios.delete(`${custom_endpoint || this.default_endpoint}`, {data: payload});
    }

    async get(id) {
        const custom_endpoint = await this.customMockUrl()
        const response = await axios.get(`${custom_endpoint || this.default_endpoint}/${id}`)
        return response
    }

    async getByIds(ids) {
        const _apis = ids.map((id) => this.get(id))
       return await axios.all(_apis)
    }

    async info() {
        const _info = await axios.get(`${this.base}/info`)
        return _info
    }

    async callAll(contents) {
        const postedContents = await this.post(contents);
        contents[0]["id"] = postedContents.data[0]["id"] 
        await this.get(postedContents.data[0].id);
        await this.put(contents);
        await this.delete(postedContents.data);
    }
}

