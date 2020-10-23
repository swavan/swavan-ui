<template name="swavan-type">
    <div class="swavan-app">
        <div class="swavan-app-types">
            <div class="swavan-app-types-head">
                Filtered request type
                <b-badge v-b-tooltip.hover title="Click here to know more about request types" variant="link" target="_blank" href="https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/ResourceType">
                    <b-icon scale="1.5" variant="primary" icon="question-circle-fill" aria-label="Help"></b-icon>
                </b-badge>
            </div>
            <b-form-group>
                <b-form-checkbox-group
                    v-model="types"
                    :options="options"
                    size="lg"
                    stacked
                    @change="saveRequestType">
                </b-form-checkbox-group>
            </b-form-group>
        </div>
    </div>
</template>
<script>
export default {
    name: "type",
    data() {
        return {
            id: null,
            types: [],
            options: [
                'font',
                'image',
                'main_frame',
                'media',
                'object',
                'script',
                'stylesheet',
                'sub_frame',
                'xmlhttprequest',
                'other'
            ]
        }
    },
    async created() {
       await this.updateForm()
    },
    methods: {
        async updateForm() {
            await this.$store.dispatch('loadRequestFilterTypes'); 
            if(this.requestTypeObject) {
                this.id = this.requestTypeObject.id;
                this.types = this.requestTypeObject.types;
            }
        },
        async saveRequestType(_selectedItems) {
           const _types = [ ..._selectedItems ];  
           const submit = {types: _types};
           if (this.id)
               submit['id'] = this.id;
           await this.$store.dispatch('saveRequestFilterTypes', submit);
           browser.runtime.sendMessage({"action": 'types_update'})

        }
    },
    computed: {
        requestTypeObject: function () { return this.$store.getters.requestTypes }
    }
    
}
</script>
<style scoped>
.swavan-app {
    padding: 10px;
    color: white;
}

.swavan-app-types {
    background: rgba(0, 0, 0, 0.8);
    overflow-y: scroll;
    padding: 10px 15px;
    border-radius: 5px;
}

.swavan-app-types-head {
    padding: 10px 0px;
    font-size: large;
    font-weight: 600;
}

@media only screen and (max-width: 600px) {
    .swavan-app-types {
        max-height: 300px;
    }
}
</style>
