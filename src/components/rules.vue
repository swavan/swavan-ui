<template name="component-name">
<div>
    <b-modal :static="true" :lazy="true" size="xl" id="modal-paste-rule" scrollable header-text-variant="light" header-bg-variant="dark"
    header-close-variant="danger" hide-footer v-model="showPasteModal" title="Paste Rule">
    <b-form-textarea
        class="mock-editor"
        id="mock-data"
        :required=true
        v-model="raw"
        :state="raw.length >= 1"
        placeholder="Enter mock data here"
        rows="5">
    </b-form-textarea>
    <div class="custom-action">
        <b-button @click="createRule" :disabled=!raw.length variant="primary">
            <b-icon v-if="!isSaving" variant="light" icon="download"></b-icon>
            <b-spinner v-if="isSaving" small label="Saving..."></b-spinner>
        </b-button>
    </div>
    </b-modal>
    <div style="padding: 0px 10px">
        <!-- Search Box -->
            <b-card border-variant="light">
                <div class="search-container">
                    <b-form-input list="my-list-id" v-model="search" v-on:keyup.enter="searchRules"
                        placeholder="Search Rules">
                    </b-form-input>
                    <b-button-group>
                    <b-button @click="updateStatusInModal('add')" v-b-tooltip.hover title="Add New Rule"
                        variant="light">
                        <b-icon scale="1.5" variant="primary" icon="file-plus-fill"></b-icon>
                    </b-button>
                    <b-button scale="0.5" @click="createOnPaste()" v-b-tooltip.hover title="Paste and Create Rule"
                        variant="light">
                        <b-icon variant="primary" icon="file-earmark"></b-icon>
                    </b-button>
                    </b-button-group>
                </div>
            </b-card>

        <!-- Add new rules  -->
        <div v-if="rules.length > 0" class="add-new">
        </div>

        <b-modal :static="true" :lazy="true" v-b-modal.modal-xl size="xl" id="modal-edit-rule" scrollable header-text-variant="light" header-bg-variant="dark"
            header-close-variant="danger" hide-footer v-model="modalShow" :title=modelHeaderText>
            <NewRules :rule=selected_rule v-on:saved=refreshRule
                v-on:close="()=> modalShow = false"  />
        </b-modal>


        <div v-if="rules.length < 1" class="no-rule-found">
            No rules found
        </div>
        <!-- List of rules -->
        <b-table sticky-header="345px" v-if="rules.length > 0" :items="rules" head-variant="light" headVariant=dark
            tableVariant=dark :fields="fields">
            
            <template v-slot:cell(is_enabled)="data">
                <b-form-checkbox switch v-model="data.item.is_enabled" style="text-align: right"
                    @change="toggleStatus(data.item, $event)" size="lg">
                </b-form-checkbox>
            </template>

            <!-- Title and Descriptions -->
            <!-- Is enabled -->
            <template v-slot:cell(#)="data">
                <div style="width: 20px">
                <b-dropdown size="sm" right no-caret variant="link">
                    <template v-slot:button-content>
                        <b-icon icon="three-dots-vertical"></b-icon>
                    </template>
                    
                    <b-dropdown-item variant="dark" size="sm"   @click="updateStatusInModal('edit', data.item)" >
                        <b-icon class="editor" icon="pencil" variant="primary" aria-hidden="true">
                        </b-icon>
                        <span> Edit </span>
                    </b-dropdown-item>
                    <b-dropdown-divider></b-dropdown-divider>
                    <b-dropdown-item variant="dark"  @click="deleteRule(data.item)" size="sm" >
                        <b-icon class="editor" icon="trash" variant="primary" aria-hidden="true"></b-icon>
                        <span> Delete </span>
                    </b-dropdown-item>
                    <b-dropdown-divider></b-dropdown-divider>
                    <b-dropdown-item variant="dark"  @click="copy(data.item, 'b-toaster-bottom-center', false)" size="sm" >
                        <b-icon class="editor" icon="files" variant="primary" aria-hidden="true"></b-icon>
                        <span> Copy Rule </span>
                    </b-dropdown-item>
                </b-dropdown>
                </div>
            </template>

            <template v-slot:cell(name)="data">
                <div style="text-align: left">
                    <strong v-b-tooltip :title=data.item.description v-on:dblclick="copy(data.item, 'b-toaster-bottom-center', false)">
                        {{ data.item.name }}
                    </strong>
                </div>
            </template>
            <!-- Is enabled -->
            <template v-slot:head(is_enabled)="data">
                <div style="text-align: right">{{ data.label }}</div>
            </template>
        </b-table>
    </div>
</div>
</template>
<style scoped>
@media all and (max-width: 500px) {

}
.custom-action {
    padding: 5px 0px;
}

.custom-action > a {
    padding-right: 10px;
}

.no-rule-found {
    text-align: center;
    font-size: medium;
    font-weight: 600;
    padding: 30px;
}

.add-new {
    padding-bottom: 10px;
    padding-right: 20px; 
    width: 100%;
}

.add-new > :first-child {
    float: right;
}

.search-container {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
}
.search-container > :first-child {
    margin-right: 5px;
}

.text-wrap {
    max-width: 300px;
    white-space: nowrap; 
    overflow: hidden;
    text-overflow: ellipsis;
}

.mock-editor {
    background: rgb(32, 23, 23);
    color: white;
    font-weight: 300;
    font-size: medium;
    margin-bottom: 10px;
    min-height: 330px;
}
</style>
<script>
import { v4 as uuidv4 } from 'uuid';
import NewRules from '@/components/rule'
export default {
    name: "Rules",
    mounted() {},
    components: { NewRules },
    data() {
        return {
            search : '',
            fields : ["#","name", "is_enabled"],
            modelHeaderText: 'Add new rule',
            selected_rule: {},
            currentResponses: [],
            modalShow: false,
            showPasteModal: false,
            isSaving: false,
            raw: ''
        }
    },

    methods: {
        async load () { this.$store.dispatch("getRules", this.search) },
        async searchRules() { await this.load() },
        async copy(data, toaster, append = false) {
            const rule = this.$store.getters.rule(data.id)
            rule.responses.forEach((row) => {
                if (row.data) {
                    row.data['key'] = uuidv4();
                    row.data['action_perform'] = 'c';
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
        async deleteRule(_rule) {
            await this.$store.dispatch('removeRule', {..._rule})
            await this.$store.dispatch("getRules");
            this.sendMessage({ "action": "reload" })
        },
        async createRule() {
            try {
                this.isSaving = true;
                if ( this.raw ) {
                const parsed = JSON.parse(this.raw);
                await this.$store.dispatch("saveRule", parsed)
                await this.refreshRule();
                this.showPasteModal = false;
                this.raw = "";
                this.isSaving = false
                }
            } catch (err) {
                this.isSaving = false
                this.notifier("!!! Error", "Unable to save the data", 'danger', true)
            }
        },
        async updateStatusInModal(actionFor, _rule) {
            if(actionFor === 'add') {
                this.modelHeaderText = 'Add Rule'
                this.selected_rule = {}
            }  else if(actionFor === 'edit') {
                this.modelHeaderText = 'Edit Rule'
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
}
</script>
