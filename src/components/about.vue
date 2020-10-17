<style>
.app-info {
    text-align: center;
    padding-top: 25px;
}

.app-info > * {
   width: 100%;
}

.app-desc {
    font-weight: 400;
    padding: 25px;
    text-align: center;
}

.me {
    padding: 15px;
    font-size: large;
    font-weight: 400;
    text-align: center;
}

.thanks {
    position: fixed;
    bottom: 0;
    font-size: small;
    padding: 15px;
    text-align: center;
    left: 0;
    right: 0;
}
</style>
<template name="about">
<div>
    <div class="app-info">
        <div>
            <strong>
               <a href="https://swava.io" target="_blank"> SwaVan.io </a>
            </strong>
            <div></div>
            <strong>
               {{info.version}} 
            </strong>
        </div>
    </div>
    <div class="app-desc">
        SwaVan allow you to mock data and forward XHR request to another endpoint.
    </div>
    <div class="me">
        You can find me <a target="blank" href="https://www.linkedin.com/in/biplabpokhrel007/">biplabpokhrel007</a> and
        <a target="blank" href="https://twitter.com/BiplabPokhrel2">BiplabPokhrel2</a>
    </div>

    <div class="thanks">
        Special Thanks to <a href="https://twitter.com/julien_lafont" target="blank">julien_lafont</a>
        for allowing us to use <a href="https://designer.mocky.io" target="blank">https://designer.mocky.io</a> to mock the data.
    </div>
</div>
</template>
<script>
export default {
    name: "about",
    created() {
        try {
            this.$store.dispatch('loadAppInfo');
        } catch {
            // eslint-disable-next-line
            console.info('Unable to access extension info')
        }
    },
    computed: {
        info() {
            return this.$store.getters.info
        }
    }
    
}
</script>
