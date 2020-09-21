<template name="settings">
    <div>
        <div class="status custom-card">
            <b-form-checkbox switch v-model="preferences.reload" @change="toggleSetting()" size="lg">
                Reload on action is <b>{{ preferences.reload ? "Active" : "Inactive" }}</b>
            </b-form-checkbox>
        </div>
        <div>
            <type />
        </div>
    </div>
</template>
<style scoped>
.status {
    margin: 10px;
    padding: 10px;
    font-size: 90%;
    color: rgba(0,0,0,.65);
}

.custom-card {
    background: rgb(221, 220, 220, 0.25);
    margin-bottom: 10px;
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
    position: relative;
    z-index: 1;
    border-radius: 0px;
    transition: .3s cubic-bezier(.4,0,.2,1);
    transition-property: color,background-color;
    will-change: color,background-color;
}


.mock-form {
    margin: 10px;
}

.mock-header {
    padding: 10px;
    cursor: pointer;
    display: flex;
}
</style>
<script>
import type from './type';

export default {
    name: "settings",
    async created() {
        await this.$store.dispatch("loadSetting");
    },
    components: { type },
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
