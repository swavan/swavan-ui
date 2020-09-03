<template name="component-name" src="./rules.html">
</template>
<style scoped src="./rules.css">
</style>
<script>

import NewRules from '@/components/rule'
import vueJsonEditor from 'vue-json-editor'
export default {
    name: "Rules",
    counter: 0,
    mounted() {},
    components: { NewRules, vueJsonEditor },
    data() {
        return {
            search : '',
            fields : ["name", "is_enabled"],
            modelHeaderText: 'Add new rule',
            enableDelete: false,
            selected_rule_id: Number,
            currentResponses: [],
            modalShow: false,
            showPasteModal: false,
            raw: ''
        }
    },
    methods: {
        searchRules() {
            this.$store.dispatch("loadRedirectRule", this.search)
        },
        async copy(data, toaster, append = false) {
            await this.loadResponses(data.id);
            const rule = this.$store.getters.rule(data.id)
            const stringified_rule = JSON.stringify(rule)
            await navigator.clipboard.writeText(stringified_rule);
            this.notifier(`!!! Copied`, `${data.name} rule copied`, "primary", append)
        },
        notifier(title, body, variant, appendToast, toaster='b-toaster-bottom-center') {
            this.$bvToast.toast(body, {
                title,
                toaster,
                variant,
                appendToast,
                autoHideDelay: "1000"
            });
        },
        sendMessage(message = {}) {
            browser.runtime.sendMessage(message)
        },
        async toggleStatus(rule_id, is_enabled) {
           await this.$store.dispatch("changeRuleStatus", { id: rule_id, is_enabled: is_enabled })
            this.sendMessage({ "action": "reload" })
        },
        async loadResponses(rule_id) {
            await this.$store.dispatch("loadResponses", rule_id)
        },
        async createOnPaste() {
            this.showPasteModal = true;
        },
        async createRule() {
            try {
                if ( this.raw ) {
                const parsed = JSON.parse(JSON.stringify(this.raw));
                await this.$store.dispatch("saveRedirectRule", parsed)
                await this.refreshRule();
                this.showPasteModal = false;
                this.raw = "";
                }
            } catch (err) {
                this.notifier("!!! Error", "Unable to parse the data", 'danger', true)
                console.err(err);
            }
        },
        async updateStatusInModal(actionFor, rule_id) {
            if(actionFor === 'add') {
                this.enableDelete = false
                this.modelHeaderText = 'Add Rule'
                this.selected_rule_id = null
            }  else if(actionFor === 'edit-delete') {
                this.enableDelete = true
                this.modelHeaderText = 'Edit or Delete Rule'
                this.selected_rule_id = rule_id
                await this.$store.dispatch('loadResponses', rule_id)
            }
             this.modalShow = !this.modalShow
        },
        async refreshRule() {
            console.log("I am here to update the data")
            await this.$store.dispatch("loadRedirectRule");
            this.modalShow = false;
            this.sendMessage({ "action": "reload" })
        } 
    },
    created () { return this.$store.dispatch("loadRedirectRule", this.search) },
    computed: {
        rules() { return this.$store.getters.rules },
    },
    filters: {
        toCamelCase : (str) => str.toLowerCase()
                .split(' ')
                .map((word) => word.replace(word[0], word[0].toUpperCase()))
                .join(' '),
    }

}
</script>   