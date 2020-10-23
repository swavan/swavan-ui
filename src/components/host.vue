<template>
<div class="container">
    <b-popover target="host_input_group" triggers="hover" placement="top">
        <template v-slot:title>Why Host URL</template>
        <div class="message">
            Please add your host url i.e. <code>https://www.example.com/*</code>. Adding host URL allow this extension to look only for those host which you have added and ignore all remaining.
            This is recommended configuration. If you want to test the redirect for <code>https://www.example.com/api/v1/map</code> then add <code>*://www.example.com/*</code>.
            So that will match for <b> http </b> and <b>https</b>.
            URL filter patter available <a target="_blank" href="https://developer.chrome.com/extensions/match_patterns">here</a>
        </div>
      </b-popover>

        <b-input-group prepend="Host Url" class="mt-3">
            <template v-slot:prepend>
                <b-input-group-text id="host_input_group" >Host Url</b-input-group-text>
              </template>
            <b-form-input placeholder="*://www.example.com/*" v-model.trim="url"></b-form-input>
            <b-input-group-append>
              <b-button variant="primary" @click="addHost()">Add</b-button>
            </b-input-group-append>
          </b-input-group>

          <div v-if="urls && urls.length > 0" >
            <hr>
            <b-list-group>
              <b-list-group-item v-for="url in urls" :key="url.id">
                  <div class="oneRow">
                    <strong>{{ url.url }} </strong>
                    <b-tooltip target="delete_host" variant="danger">Remove Host URL</b-tooltip>
                    <b-button id="delete_host" variant="light" @click="deleteHost(url.id)">
                        <b-icon  icon="trash-fill" variant="danger" aria-label="Remove host URL"></b-icon>
                    </b-button>
                  </div>
              </b-list-group-item>
            </b-list-group>
          </div>
</div>
</template>
<style scoped >
.container {
    padding: 10px;
}

.message {
    font-size: small;
    font-weight: 600;
}

.oneRow {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    vertical-align: bottom;
    line-height: 40px;
}
</style>

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
