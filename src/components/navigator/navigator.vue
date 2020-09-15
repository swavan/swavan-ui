<template src="./navigator.html" >
</template>
<style src="./navigator.css"></style>

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
