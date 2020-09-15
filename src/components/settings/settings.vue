<template name="settings" src="./settings.html">
</template>
<style scoped src="./settings.css">
</style>
<script>
export default {
    name: "settings",
    async created() {
        await this.$store.dispatch("loadSetting");
    },
    methods: {
        async toggleSetting() {
            this.preferences.reload = !this.preferences.reload;
            await this.$store.dispatch("saveSettings", this.preferences);

            const action = () => {
                if ( this.preferences.reload === true ) { return "enable_refresh" }
                else if ( this.preferences.reload === false ) { return "disable_refresh" }
            }

           await browser.runtime.sendMessage({ "action": action() })
        }
    },
    computed: {
        preferences() {
          return  this.$store.getters.settings()
        }
    }
}
</script>
