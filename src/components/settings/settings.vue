<template name="settings" src="./settings.html">
</template>
<style scoped src="./settings.css">
</style>
<script>
export default {
    name: "settings",
    data() {
        return {
            id: null,
            isEnabled: true,
            reload: false
        }
    },
    async created() {
       await this.$store.dispatch("loadSetting"); 
    },
    mounted(){
        this.setProps();
    },
    methods: {
        setProps() {
            console.log("preferences: ", this.preferences)
            // console.log("setProps: ",this.settings);
            if (this.preferences && this.preferences.id) {
                this.id = this.preferences.id
                this.isEnabled = this.preferences.isEnabled
                this.reload = this.preferences.reload
            }
        },
        async toggleSetting() {
            const payload = { isEnabled: this.isEnabled, reload: this.reload }
            if (this.id) {
                payload["id"]=payload
            }
            await this.$store.dispatch("updateSettings", payload);
            await this.$store.dispatch("loadSetting");
            browser.runtime.sendMessage({ "action": "sc" })
        }
    },
    computed: {
        preferences() {
          return  this.$store.getters.settings
        }
    }
}
</script>
