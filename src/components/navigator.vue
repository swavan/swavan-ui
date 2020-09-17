<template>
<div>
    <b-navbar fixed type="dark" variant="dark">
        <b-navbar-brand href="#">
            <img
            @click="toggle"
            v-bind:class="[settings.isEnabled ? 'isAppActive' : 'isAppInactive']"
            height="30px"
            width="30px"
            src="icons/SwaVan64.png"
            alt="logo">
            SwaVan
            <b-badge @click="toggle" pill v-bind:variant=statusColor>
                {{ settings.isEnabled ? "ON" : "OFF" }}
            </b-badge>
        </b-navbar-brand>
  
        <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown no-caret right>
                <template v-slot:button-content>
                    <b-icon icon="list" scale="1"    class="bg-primary"></b-icon>
                  </template>
                <b-dropdown-item to="/swavan-rules">Rules</b-dropdown-item>
                <b-dropdown-item to="/swavan-host">Host URL</b-dropdown-item>
                <b-dropdown-item to="/swavan-settings">Preferences</b-dropdown-item>
                <b-dropdown-item to="/swavan-about">About</b-dropdown-item>
            </b-nav-item-dropdown>
        </b-navbar-nav>
    </b-navbar>
  </div>
</template>
<style scoped>
img {
    border-radius: 50%;
    margin: 0px 5px 0px 0px;
    cursor: pointer;
}
.isAppActive {
    padding: 5px;
    background: green;
}

.isAppInactive {
    padding: 5px;
    background: rgb(233, 229, 229);
}

img:hover {
    background: rgb(255, 255, 255, 0.2);
}

.dot {
    height: 25px;
    width: 25px;
    background-color: #bbb;
    border-radius: 50%;
    display: inline-block;
}
</style>

<script>
export default {
  name: "navigator",
  async created() {
      await this.$store.dispatch("loadSetting");
  },
  methods: {
    async toggle() {
      this.settings.isEnabled = !this.settings.isEnabled;
      await this.$store.dispatch("saveSettings", this.settings);
      await this.$store.dispatch("loadSetting");
      
      const action = () => {
        if ( this.settings.isEnabled ) { return "connect" }
        else if ( !this.settings.isEnabled ) { return "disconnect" }
      }
       await browser.runtime.sendMessage({ "action": action() });
    },
    fullscreen() {
        browser.runtime.sendMessage({"action": "full_screen"})
    }
  },
  computed: {
    settings() { return this.$store.getters.settings() },
    statusColor() { return this.settings.isEnabled ? "info" : "dark" }
  }
}
</script>
