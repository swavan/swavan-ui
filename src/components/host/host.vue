<template src="./host.html"> </template>
<style scoped src="./host.css"></style>

<script>
export default {
    name: "Host",
    mounted() {
        this.$store.dispatch('loadHostUrl')
    },
    data() {
        return {
            url: "",
        }
    },
    methods: {
        sendMessage(message = {}) {
            browser.runtime.sendMessage(message)
        },
        async addHost() {
            if(this.url.trim()) {
                await this.$store.dispatch('addHostUrl', this.url);
                await this.$store.dispatch('loadHostUrl');
                this.sendMessage({ "action": "url_reload" })
            }
        },
        async deleteHost(id) {
            await this.$store.dispatch('deleteHostUrl', id)
            await this.$store.dispatch('loadHostUrl');
            this.sendMessage({ "action": "url_reload" })
        }
    },
    computed: {
        urls() { return this.$store.getters.hostUrls }
    }
}
</script>
