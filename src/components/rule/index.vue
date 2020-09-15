<template name="new-rules" src="./rule.html">

</template>

<script>
import vueJsonEditor from 'vue-json-editor'
import './style.css'
import options from './options'
import { RuleModel, ResponseModel, FilterModel, HeaderModel, isValid, DataModel } from './models';

export default {
    name: "NewRules",
    props: {
        enableDelete: Boolean,
        rule: {}
    },
    created() {
            for (const key of Object.keys(this.rule)) {
                if (key === 'responses') {
                    const _responses = this.rule[key].map((row) => {
                        const rw = row ? row : {};
                        const _result = {...ResponseModel, ...rw}
                        if(!_result.data)
                            _result.data = { ...DataModel }
                        _result.data['action_perform'] = 'e';
                        return _result
                    })
                    this.$set(this.form, 'responses', _responses)
                }
                else {
                    this.$set(this.form, key, this.rule[key])
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
            show: true
        }
    },
    methods: {
        async onSubmit(evt) {
            evt.preventDefault()
            const save_data = {...this.form};
            await this.$store.dispatch("saveRule", {...save_data})
            this.$emit("saved")
        },
        onReset(evt) {
            evt.preventDefault()
            this.form.name = ""
            this.form.description = ""
            this.show = false
            this.$nextTick(() => {
                this.show = true
            })
        },
        async deleteRule() {
            await this.$store.dispatch('removeRule', {...this.form})
            this.$emit("removed") 
        },
        addResponses() {
            const responses = {...ResponseModel};
            responses.data = {...DataModel};
            this.form.responses.push({...responses})
        },
        addHeader(responseIndex) {
            const dataSource = this.form.responses[responseIndex].data_source_type;
            this.form.responses[responseIndex].data.headers.push({...HeaderModel, "type": dataSource === 'r' ? 'q' : 's'})
        },
        removeHeader(responseIndex, headerIndex) {
            this.form.responses[responseIndex].data.headers.splice(headerIndex, 1)
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
        async load_mocked_response(responseIndex, response_data_id) {
            const mock = await this.$store.dispatch('getResponseByID', response_data_id)
            if ( mock.status === 200 ) {
                Object.keys(mock.data).forEach((key) => {
                    if(key === "content") {
                        const content = mock.data[key];
                        try {
                            mock.data[key] = JSON.parse(content)
                        } catch {
                            mock.data[key] = content
                        }
                    }
                    this.$set(this.form.responses[responseIndex].data, key, mock.data[key])
                })
                this.$set(this.form.responses[responseIndex].data, 'action_perform', 'e')
            }
        },
        unload_mocked_response(responseIndex) {
            this.$set(this.form.responses[responseIndex].data, 'action_perform', 'd')
        }

    },
    components: { vueJsonEditor },
    filters: {
        toCamelCase(str) { return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()) },
        accordianIdMaker(prefix, index) { return `${prefix}-${index}` },
    },
    computed: {
      isFormValid() {
          return isValid(this.form)
        }  
    }
}
</script>
