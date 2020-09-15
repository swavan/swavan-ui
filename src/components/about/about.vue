<style src="./about.css"></style>
<template src="./about.html" name="about">
</template>
<script>
export default {
    name: "about",
    async created() {
        await this.$store.dispatch('loadAppInfo');
    },
    computed: {
        info() {
            return this.$store.getters.info
        }
    }
    
}
</script>
