<template>
  <div id="App">
          <div id="nav">
              <strong>
                <img height="20px" width="30px" src="icons/SwaVan.png" alt="logo">
               Swavan
              </strong>

              <b-modal
                  id="modal-add-rule"
                  scrollable
                  header-text-variant="light"
                  header-bg-variant="dark"
                  header-close-variant="danger"
                  hide-footer
                  v-model="modalShow"
                  title="Add Rule">
                  <NewRule v-on:saved=refreshRule />
              </b-modal>
               <b-dropdown
                  id="modal-add-rule-opener"
                  variant="secondary"
                  no-caret
                  right
                  text="Dropdown Button"
                  class="m-md-2">
                  <template v-slot:button-content>
                    <b-icon scale="1"  v-b-tooltip.hover title="Add New" variant="light"  icon="plus-circle-fill"></b-icon>
                  </template>
                  <b-dropdown-item-button variant="dark" v-b-modal.modal-add-rule >Add Redirect Rule</b-dropdown-item-button>
               </b-dropdown>
          </div>
          <Rules />
  </div>
</template>
<script>

import Rules from '@/components/rules'
import NewRule from '@/components/rule'

export default {
  name: 'App',
  components: { Rules,  NewRule},
  data() {
    return {
      modalShow: false
    }
  },
  methods: {
    async refreshRule() {
      await this.$store.dispatch("loadRedirectRule");
      this.modalShow = !this.modalShow;
    }
  }
}
</script>

<style>
html {
  min-width: 500px;
  height: 400px;
}
  #nav{
    background: rgba(29, 28, 28, 0.919);
    padding: 20px 15px;
    color: white;
    display: block;
  }
  #modal-add-rule-opener {
    position: absolute;
    right: 15px;
    top: 10px;
    vertical-align: -webkit-baseline-middle;
  } 
</style>
