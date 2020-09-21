<template>
<div>
    <b-navbar fixed type="dark" variant="dark">
        <b-navbar-brand href="#">
            <b-avatar
              button
              @click=toggle
              :src=swavanIcon
              text="Opps"
              :size="40"
              rounded
              :badge='settings.isEnabled ? "On" : "Off"'
              badge-top
              badge-offset="-0.7em"
              :badge-variant='settings.isEnabled ? "primary" : "danger"'>
            </b-avatar>
        </b-navbar-brand>
        <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown no-caret right>
                <template v-slot:button-content>
                    <b-icon icon="list" scale="1" ></b-icon>
                  </template>
                <b-dropdown-item to="/swavan-rules">Rules</b-dropdown-item>
                <b-dropdown-item to="/swavan-host" >Host URL</b-dropdown-item>
                <b-dropdown-item to="/swavan-settings">Preferences</b-dropdown-item>
                <b-dropdown-item to="/swavan-about">About</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item v-b-tooltip.hover title="Open in Tab" v-if="!hideFullScreenButton" @click="fullscreen">
              <b-icon icon="arrow-up-right-square" variant="link"></b-icon>
            </b-nav-item>
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
    padding: 1px;
    background: rgb(255, 255, 255);
}

.isAppInactive {
    padding: 1px;
    background: rgb(233, 229, 229);
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
    async fullscreen() {
        const searchURL = '/swavan-rules'
        var url = browser.runtime.getURL(searchURL);
        const redirectURL = url.replace(searchURL, "/popup.html#/swavan-rules")
        const _extensionTabs = browser.extension.getViews({type: "tab"})
        for (const _tab of _extensionTabs) {
          if (_tab.location.origin === url.replace(searchURL,"")) {
            _tab.close();
            break
          }
        }
      await browser.tabs.create({url:redirectURL, active:true});
      self.close()
     }
  },
  computed: {
    swavanIcon () {
      return this.settings.isEnabled ? '../../icons/SwaVan128.png': '../icons/SwaVanDisable128.png';
    },
    settings() { return this.$store.getters.settings() },
    statusColor() { return this.settings.isEnabled ? "info" : "dark" },
    page() {
        const searchURL = '/swavan-rules'
        var url = browser.runtime.getURL(searchURL);
        const _extensionPopup = browser.extension.getViews({type: "popup"})
        for (const _tab of _extensionPopup) {
          if (_tab.location.origin === url.replace(searchURL,"")) {
            return 'popup'
          }
        }
        const _extensionTabs = browser.extension.getViews({type: "tab"})
        for (const _tabs of _extensionTabs) {
          if (_tabs.location.origin === url.replace(searchURL,"")) {
            return 'tab'
          }
        }
        return 'unknown'
    },
    hideFullScreenButton() {
      return this.page !== 'popup'
    }
  }
}
</script>
