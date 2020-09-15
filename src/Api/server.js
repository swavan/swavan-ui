import axios from 'axios'

class Mock {
    base = "https://swavan.io"
    endpoint = `${this.base}/mock/v1`

    update_default_endpoint(override_endpoint) {
        this.endpoint = override_endpoint
    }
    async post(payload) {
       const response = await axios.post(`${this.endpoint}`, payload);
       return response
    }
    async put(payload) {
        await axios.put(`${this.endpoint}`, payload);
    }
    async delete(payload) {
        await axios.delete(`${this.endpoint}`, {data: payload});
    }
    async get(id) {
        const response = await axios.get(`${this.endpoint}/${id}`)
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
}

const mock = new Mock()
export default mock;