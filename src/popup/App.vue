<template>
  <div id="App">
          <div id="nav">
              <strong>
                <img height="20px" width="30px" src="icons/SwaVan.png" alt="logo">
               Swavan
              </strong>
               <b-dropdown
                  id="modal-add-rule-opener"
                  variant="secondary"
                  right
                  no-caret
                  text="Dropdown Button"
                  class="m-md-2">
                  <template v-slot:button-content>
                    <b-icon scale="1" variant="light"  icon="menu-down"></b-icon>
                  </template>
                  <b-dropdown-item-button variant="dark">
                    <router-link to="/rules">Rules</router-link>
                  </b-dropdown-item-button>
                  <b-dropdown-item-button variant="dark">
                    <router-link to="/host">Host Url</router-link>
                  </b-dropdown-item-button>
                  <b-dropdown-item-button variant="dark">
                    <router-link to="/settings">Preferences</router-link>
                  </b-dropdown-item-button>

               </b-dropdown>
          </div>
          <router-view></router-view>
  </div>
</template>
<script>


export default {
  name: 'App'
}
</script>

<style>
#App {
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
