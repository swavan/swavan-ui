<template name="new-rules" src="./rule.html">

</template>

<script>
// import { mapGetters } from 'vuex'
import vueJsonEditor from 'vue-json-editor'
import './style.css'
import options from './options'
import { RuleModel, ResponseModel, FilterModel, HeaderModel } from './models';

export default {
    name: "NewRules",
    props: {
        enableDelete: Boolean,
        rule_id: Number
    },
    mounted() {
        if (this.rule_id && this.rule) {
            for (const key of Object.keys(this.rule)) {
                if (key === 'responses') {
                    const _responses = this.rule[key].map((row) => {
                        return {...ResponseModel, ...row}
                    })
                    this.form.responses = _responses
                } else {
                    this.$set(this.form, key, this.rule[key])
                }
                
            }
        }
    },
    data() {
        return {
            form: {...RuleModel},
            source_types: options.SOURCE_TYPES,
            operators : options.OPERATORS,
            data_source_types: options.DATA_SOURCE_TYPES,
            http_methods : options.HTTP_METHODS,
            filter_by_options : options.FILTER_BY_OPTIONS,
            show: true,
            errors: []
        }
    },
    methods: {
        async onSubmit(evt) {
            evt.preventDefault()
            if(!this.form.id) {
                await this.$store.dispatch("saveRedirectRule", this.form)
            } else {
               await this.$store.dispatch("updateRules", this.form)
            }
            this.$emit("saved")
        },
        onReset(evt) {
            evt.preventDefault()
            this.errors = []
            this.form.name = ""
            this.form.description = ""
            this.show = false
            this.$nextTick(() => {
                this.show = true
            })
        },
        async deleteRule() {
            await this.$store.dispatch('deleteRule', this.form.id)
            this.$emit("removed") 
        },
        addResponses() {
            const responses = {...ResponseModel};
            responses.filters = [];
            responses.headers = [];
            this.form.responses.push({...responses, "rule_id": this.rule_id })
        },
        addHeader(responseIndex) {
            const dataSource = this.form.responses[responseIndex].data_source_type;
            this.form.responses[responseIndex].headers.push({...HeaderModel, "type": dataSource === 'r' ? 'q' : 's'})
        },
        removeHeader(responseIndex, headerIndex) {
            this.form.responses[responseIndex].headers.splice(headerIndex, 1)
        },
        addFilters(responseIndex) {
            this.form.responses[responseIndex].filters.push({...FilterModel})
        },
        removeFilters(responseIndex, filterIndex) {
            this.form.responses[responseIndex].filters.splice(filterIndex, 1)
        },
        removeResponses(responseIndex) {
            const responses = this.form.responses.filter((row) => !row.mark_for_deletion).length
            if ( responses > 1 ) {
                this.$set(this.form.responses[responseIndex], "mark_for_deletion", true)
            }
        },
    },
    computed: {
        rule () {
                return this.$store.getters.rule(this.rule_id)
        },
    },
    components: { vueJsonEditor },
    filters: {
        toCamelCase(str) { return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()) },
        accordianIdMaker(prefix, index) { return `${prefix}-${index}` },
    }
}
</script>
