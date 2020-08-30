<template name="new-rules">
    <div class="rule">
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">
            <div class="eachRow">
            <b-form-input
                id="swavan-rules-name"
                v-model.trim="form.name"
                required
                placeholder="Enter Name of the Rules">
            </b-form-input>
            </div>
            <div class="eachRow">
                <b-form-textarea
                    id="swavan-rules-description"
                    v-model.trim="form.description"
                    placeholder="Enter rules descriptions"
                    rows="3"
                    max-rows="6">
                </b-form-textarea>
            </div>
            <div class="eachRow">
            <b-form-select
                id="input-source-type"
                v-model="form.source_type"
                :options="source_types"
                required>
            </b-form-select>
            </div>
            <div class="eachRow">
                <b-form-select
                    id="input-operator"
                    v-model="form.operator"
                    :options="operators"
                    required>
                </b-form-select>
            </div>
            <div class="eachRow">
                <b-form-input
                    id="swavan-rules-name"
                    v-model="form.source"
                    required
                    placeholder="e.g http://www.example/api/">
                </b-form-input>
            </div>
            <div class="eachRow">
                <b-button @click="addResponses()" v-b-tooltip.hover title="Add more response logic" variant="dark">
                    <b-icon icon="plus-circle-fill" scale="1" variant="light"></b-icon>
                    Add Response
                </b-button>
            </div>
            <!-- {{ this.rule }} -->
            <div class="eachRow"
                v-for="(response, responseIndex) in form.responses"
                v-bind:key="responseIndex"
                >
                    <b-card
                        v-if=!response.mark_for_deletion
                        border-variant="light"
                        no-body
                        id="add-response-logic"
                        class="mb-1 custom-card">
                        <b-card-header
                            class="p-1"
                            role="tab"
                            header-border-variant="dark"
                            header-bg-variant="dark"
                            text-variant="white" >
                                <b-button v-b-toggle="responseIndex+'-response'" variant="dark">Response logic</b-button>
                                <b-button v-if="form.responses.length > 1" style="float: right" @click="removeResponses(responseIndex)" v-b-tooltip.hover title="Remove response logic" variant="dark">
                                    <b-icon  icon="trash" scale="1" variant="danger"></b-icon>
                                </b-button>
                                <b-button style="float: right" v-b-toggle="responseIndex+'-response'" variant="dark">
                                    <span class="when-open">
                                        <b-icon icon="arrows-collapse" scale="1" variant="light"></b-icon>
                                    </span>
                                    <span class="when-closed">
                                        <b-icon icon="arrows-expand" scale="1" variant="light"></b-icon>
                                    </span>
                                </b-button>

                        </b-card-header>
                        <b-collapse :id="responseIndex+'-response'" visible accordion="my-accordion" role="tabpanel">
                            <b-card-body>

                                <b-form-group >
                                    <b-form-select
                                    id="input-data-source-type"
                                    v-model="response.data_source_type"
                                    :options="data_source_types"
                                    required
                                    ></b-form-select>
                                </b-form-group>

                                <div v-if="response.data_source_type === 'd'">
                                            <vue-json-editor
                                                v-model="response.data"
                                                :show-btns="false"
                                                :mode="'code'"
                                                :expandedOnStart="true"
                                                v-if="response.data_source_type === 'd'">
                                            </vue-json-editor>
                                </div>
                                
                                <b-form-group >
                                <b-form-input
                                    v-if="response.data_source_type === 'r'"
                                    id="swavan-rules-data"
                                    v-model="response.data"
                                    placeholder="Enter Redirect URL">
                                </b-form-input>
                                </b-form-group>

                                <b-form-group >
                                    <b-form-select
                                    id="input-source-http-method"
                                    v-model="response.http_method"
                                    :options="http_methods"
                                    ></b-form-select>
                                </b-form-group>

                                <div
                                    v-for="(filter, filterIndex) in response.filters"
                                    v-bind:key="filterIndex">

                                    <div class="custom-select-button eachRow">
                                        <b-form-select
                                        class="singleLine"
                                        id="input-source-filter-by-option"
                                        v-model="filter.filter_by"
                                        :options="filter_by_options"
                                        ></b-form-select>
                                        <b-form-input
                                            class="singleLine"
                                            id="swavan-filter-key"
                                            v-model.trim="filter.key"
                                            required
                                            placeholder="Enter Name of the Rules">
                                        </b-form-input>
                                        <b-form-input
                                        class="singleLine"
                                            id="swavan-filter-value"
                                            v-model.trim="filter.value"
                                            required
                                            placeholder="Enter Filter Value">
                                        </b-form-input>
                                        <b-button size="sm" variant="dark" v-b-tooltip.hover title="Remove filter logic" @click="removeFilters(responseIndex, filterIndex)" class="mb-1">
                                            <b-icon icon="trash" variant="danger" aria-label="Remove filter logic"></b-icon>
                                        </b-button>

                                    </div>
                                </div>
                                <b-button size="md" variant="secondary" v-b-tooltip.hover title="Add more filter logic" @click="addFilters(responseIndex)" class="mb-1">
                                    <b-icon icon="file-plus-fill" aria-label="Add more and logic"></b-icon>
                                </b-button>
                                <div>
                                    <b-form-checkbox
                                        switch
                                        v-model="response.is_logic_enabled"
                                        size="lg">
                                        {{ response.is_logic_enabled ? 'Enable' : 'Disable' }}
                                    </b-form-checkbox>
                                </div>

                            </b-card-body>
                        </b-collapse>
                    </b-card>
            </div>
            <div class="eachRow">
                <b-form-checkbox v-model="form.is_enabled">
                 Activate rule on create
                </b-form-checkbox>
            </div>
            <div class="eachRow">
                <div class="isa_error" v-for="(error, errorIndex) of errors" v-bind:key="errorIndex">
                    <b-icon icon="patch-exclamation-fll"></b-icon>
                    {{ error }}
                </div>
            </div>
            <div class="eachRow">
                <b-button
                    size="md"
                    variant="primary"
                    type="submit"
                    :disabled=!form.is_validate()
                    >
                        <b-icon icon="download" aria-hidden="true"></b-icon>
                        Save
                </b-button>
                &nbsp;
                <b-button
                    v-if="enableDelete"
                    size="sl"
                    variant="danger"
                    type="button"
                    @click="deleteRule"
                    >
                        <b-icon icon="trash-fill" aria-hidden="true"></b-icon>
                        Delete
                </b-button>
            </div>
        </b-form>
    </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import vueJsonEditor from 'vue-json-editor'
import './style.css'
import options from './options'
import { RuleModel, ResponseModel, FilterModel } from './models';

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
        // makePretty() {
        //     const responses = this.form.responses.filter((row) => !row.mark_for_deletion).length
        //     if ( responses > 1 ) {
        //         this.$set(this.form.responses[responseIndex], "mark_for_deletion", true)
        //     }
        // },
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
            this.form.responses.push({...ResponseModel, "rule_id": this.rule_id })
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
