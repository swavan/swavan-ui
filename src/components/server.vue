<template>
  <div>
    <b-form-checkbox switch v-model="useCustom" @change=changeToServerConfig size="lg">
        Change default mock provider
    </b-form-checkbox>
    <b-input-group size="md" v-if="useCustom" prepend="Mock Server" class="mt-3">
        <b-form-input v-model=apiUrl  required placeholder="Enter Mock Server URL"></b-form-input>
        <b-input-group-append>
        <b-button :disabled="!isUrl(apiUrl)" variant="success" >
            <span v-if="!submitted" @click=testServer(apiUrl)> Test </span>
            <b-icon v-if="submitted" icon="arrow-clockwise" animation="spin" font-scale="1"></b-icon>
        </b-button>
        <b-button :disabled="!isUrl(apiUrl)"  variant="primary" @click=save>
            <b-icon icon="download" variant="light"></b-icon>
        </b-button>
        </b-input-group-append>
    </b-input-group>
  </div>
</template>

<script>
import Mock from '../Api/server';

export default {
    name: "server",
    props: {
        mockApiUrl: String,
    },
    data() {
        return {
            apiUrl: "",
            useCustom: false,
            submitted : false
        }
    },
    mounted() {
        if(this.mockApiUrl) {
            this.apiUrl = this.mockApiUrl;
            this.useCustom = true;
        }
    },
    methods: {
        save() {
            if(this.isUrl(this.apiUrl)) {
                this.$emit("saveMockUrl", this.apiUrl)
            }
        },
        isUrl(url) {
            try { return Boolean(new URL(url)); }
            catch(e){ return false; }
        },
        async testServer(url) {
            const mock = new Mock()
            try {
                this.submitted = true;
                const contents = [{
                    "id":null,
                    "status": "200",
                    "content":"test",
                    "content_type":"application/json",
                    "key":"Test001",
                    "headers":[]
                }];
                mock.update_default_endpoint(url);
                await mock.callAll(contents);
                this.$bvToast.toast(`Test successful`, 
                {
                    title: 'Mock server configuration',
                    variant: 'success',
                    autoHideDelay: "3000",
                    toaster: 'b-toaster-bottom-full',
                });
                this.submitted = false;
                mock.override = false;
            } catch (e) {
                this.$bvToast.toast(`Test failed on ${url}, Please check the network call in your browser and consult with administrator`, 
                {
                    title: 'Mock server configuration',
                    variant: 'danger',
                    autoHideDelay: "5000",
                    toaster: 'b-toaster-bottom-full',
                });
                this.submitted = false;
                mock.override = false;
            }
        },
        async changeToServerConfig(status) {
            if(!status) {
                this.$emit("saveMockUrl", '')
            }
        }
    }
}
</script>