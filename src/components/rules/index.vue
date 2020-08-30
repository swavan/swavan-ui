<template name="component-name">
    <div>
        <div style="padding: 0px 10px">

         <!-- Search Box -->
         <b-card-group deck >
             <b-card border-variant="light">
                <b-form-input
                    list="my-list-id" 
                    v-model="search"
                    v-on:keyup.enter="searchRules"
                    placeholder="Search Rules">
                </b-form-input>
             </b-card>
         </b-card-group>

         <!-- Add new rules  -->
        <div v-if="rules.length > 0"  class="add-new">
        </div>

            <b-modal
                id="modal-edit-rule"
                scrollable
                header-text-variant="light"
                header-bg-variant="dark"
                header-close-variant="danger"
                hide-footer
                v-model="modalShow"
                :title=modelHeaderText>
                <NewRules
                    :enableDelete=enableDelete
                    :rule_id=selected_rule_id
                    v-on:saved=refreshRule
                    v-on:removed=refreshRule
                    />
            </b-modal>

        
        <div v-if="rules.length < 1" class="no-rule-found">
            No rules found
        </div>
        <!-- List of rules -->
        <b-table
            v-if="rules.length > 0"
            sticky-header
            :items="rules"
            head-variant="light"
            headVariant=dark
            tableVariant=dark
            :fields= "fields"
            >
            <template v-slot:cell(is_enabled)="data">
                <b-form-checkbox
                    switch
                    v-model="data.item.is_enabled"
                    style="text-align: right"
                    @change="toggleStatus(data.item.id, $event)"
                    size="lg">
                </b-form-checkbox>
            </template>
        
            <!-- Tilte and Descriptions -->
            <template v-slot:cell(name)="data">
                <div @click="data.toggleDetails" style="text-align: left">
                    <!-- <b-button @click="data.toggleDetails" variant="dark"> -->
                        <b-button variant="dark" @click="updateStatusInModal('edit-delete', data.item.id)">
                            <b-icon icon="pencil"  variant="primary" aria-hidden="true"></b-icon> 
                        </b-button>
                        <strong v-b-tooltip :title=data.item.description>
                            {{ data.item.name | toCamelCase }}
                        </strong>
                </div>
            </template>

            <!-- <template  v-slot:row-details="data" >
                <Responses :rule_id="data.item.id"/>
            </template> -->

            <template v-slot:head(is_enabled)="data">
                <div style="text-align: right">{{ data.label }}</div>
            </template>

        </b-table>
        </div>
    </div>

</template>

<script>

import "./style.css"
import NewRules from '@/components/rule'
// import Responses from '@/components/responses'
// import store from '../../store'

export default {
    name: "Rules",
    mounted() {},
    components: { NewRules },
    data() {
        return {
            search : '',
            fields : ["name", "is_enabled"],
            modelHeaderText: 'Add new rule',
            enableDelete: false,
            selected_rule_id: Number,
            currentResponses: [],
            modalShow: false
        }
    },
    methods: {
        searchRules() {
            this.$store.dispatch("loadRedirectRule", this.search)
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
        async updateStatusInModal(actionFor, rule_id) {
            // this.modalShow = !this.modalShow
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
            this.modalShow = !this.modalShow;
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