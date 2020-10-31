<style scoped >
.about-container{
  word-wrap: break-word;
  width: 500px;
}

@media only screen and (min-width: 601px) {
  .about-container{
    width: auto;
  }
}

.app-info {
  text-align: center;
  padding-top: 25px;
}

.app-desc {
  font-weight: 400;
  padding: 25px;
  text-align: center;
  word-wrap: break-word;
}

.me {
  padding: 15px;
  font-size: large;
  font-weight: 400;
  text-align: center;
  word-wrap: break-word;
}

.thanks {
  position: fixed;
  bottom: 0;
  font-size: small;
  padding: 15px;
  text-align: center;
  left: 0;
  right: 0;
  word-wrap: break-word;
}
</style>
<template name="about">
  <div class="about-container">
    <div class="app-info">
      <div>
        <strong>
          <a href="https://swavan.io" target="_blank"> SwaVan.io </a>
        </strong>
      </div>
    </div>
    <div class="app-desc">
      SwaVan allow you to mock data and forward XHR request to another endpoint.
    </div>
    <div class="me">
      You can find me
      <a target="_blank" href="https://www.linkedin.com/in/biplabpokhrel007/"
        >biplabpokhrel007</a
      >
      and
      <a target="_blank" href="https://twitter.com/BiplabPokhrel2"
        >BiplabPokhrel2</a
      >
    </div>
    <div class="thanks">
      Special Thanks to
      <a href="https://twitter.com/julien_lafont" target="_blank"
        >julien_lafont</a
      >
      for allowing us to use
      <a href="https://designer.mocky.io" target="_blank"
        >https://designer.mocky.io</a
      >
      to mock the data.
    </div>
  </div>
</template>
<script>
export default {
  name: "about",
};
</script>
