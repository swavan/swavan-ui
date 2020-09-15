<template name="component-name" src="./rules.html">
</template>
<style scoped src="./rules.css">
</style>
<script>
import { v4 as uuidv4 } from 'uuid';
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
            fields : ["#","name", "is_enabled"],
            modelHeaderText: 'Add new rule',
            enableDelete: false,
            selected_rule: {},
            currentResponses: [],
            modalShow: false,
            showPasteModal: false,
            raw: ''
        }
    },
    methods: {
        async load () { this.$store.dispatch("getRules", this.search) },
        async searchRules() { await this.load() },
        async copy(data, toaster, append = false) {
            const rule = this.$store.getters.rule(data.id)
            rule.responses.forEach((row) => {
                if (row.data && row.data.key && row.data.id && row.link) {
                    row.data.key = uuidv4();
                    row.data.action_perform = 'c';
                }
            })
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
        async toggleStatus(rule, is_enabled) {
            rule.is_enabled = is_enabled;
            await this.$store.dispatch("changeRuleStatus", rule)
            this.sendMessage({ "action": "reload" })
        },
        async createOnPaste() {
            this.showPasteModal = true;
        },
        async createRule() {
            try {
                if ( this.raw ) {
                const parsed = JSON.parse(JSON.stringify(this.raw));
                await this.$store.dispatch("saveRule", parsed)
                await this.refreshRule();
                this.showPasteModal = false;
                this.raw = "";
                }
            } catch (err) {
                this.notifier("!!! Error", "Unable to parse the data", 'danger', true)
            }
        },
        async updateStatusInModal(actionFor, _rule) {
            if(actionFor === 'add') {
                this.enableDelete = false
                this.modelHeaderText = 'Add Rule'
                this.selected_rule = {}
            }  else if(actionFor === 'edit-delete') {
                this.enableDelete = true
                this.modelHeaderText = 'Edit or Delete Rule'
                this.selected_rule = _rule
            }
             this.modalShow = !this.modalShow
        },
        async refreshRule() {
            await this.$store.dispatch("getRules");
            this.modalShow = false;
            this.sendMessage({ "action": "reload" })
        } 
    },
    async created () { await this.$store.dispatch("getRules", this.search) },
    computed: {
        rules() { return this.$store.getters.rules },
    },
    filters: {
        toCamelCase : (str) => str 
            ? str.toLowerCase()
                .split(' ')
                .map((word) => word.replace(word[0], word[0].toUpperCase()))
                .join(' ')
            : '',
    }

}
</script>   