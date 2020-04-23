<template>
  <section id="about-section" class="about-section js-affix">
    <div class="l-content wider-container">
      <div class="container">
        <div class="row">
          <!-- Hidden on small screens -->
          <div class="col-5">
            <h2 class="about-section__heading heading heading--primary">About The App</h2>
            <p class="about-section__description">
              Writers and stars of Veep have responded incredulously to the news an Australian politician
              required preinstalled stitches way email client, calendar, mapping program.
            </p>
            <div class="row">
              <div class="col">
                <div class="row icon-tab">
                  <div class="col-1 icon-hover">
                    <span class="mdi mdi-credit-card-plus"></span>
                    <!-- abc -->
                  </div>
                  <div class="col icon-title">
                    <h5 style="font-size:16px;">Easy customize</h5>
                  </div>
                </div>
                <div class="row icon-tab">
                  <div class="col-1 icon-hover">
                    <span class="mdi mdi-credit-card-plus"></span>
                    <!-- abc -->
                  </div>
                  <div class="col icon-title">
                    <h5 style="font-size:16px;">Easy customize</h5>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="row icon-tab">
                  <div class="col-1 icon-hover">
                    <span class="mdi mdi-credit-card-plus"></span>
                    <!-- abc -->
                  </div>
                  <div class="col icon-title">
                    <h5 style="font-size:16px;">Easy customize</h5>
                  </div>
                </div>
                <div class="row icon-tab">
                  <div class="col-1 icon-hover">
                    <span class="mdi mdi-credit-card-plus"></span>
                    <!-- abc -->
                  </div>
                  <div class="col icon-title">
                    <h5 style="font-size:16px;">Easy customize</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-7">
            <div class="circle" style="margin-left: 200px;">
              <div class="about-phone">
                <img src="/about/phone.png" alt="aboutus"
                  class="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    name: "About"
  };

</script>

<style lang="scss" scoped>
  .circle {
    height: 480px;
    width: 480px;
    background: linear-gradient(to bottom, #1bee90 0, #14e296 99%);
    //background-color: #bbb;
    border-radius: 50%;
    display: flex;
    // centering along main axis - X axis - Horizontal
    justify-content: center;
    // centering along cross axis - Y axis - Vertical
    align-items: center;
  }

  .wider-container {
    padding-left: 60px !important;
    padding-right: 60px !important;
  }

  .icon-hover {
    // display: inline-block;
    height: 45px;
    width: 45px;
    border-radius: 50%;
    border-style: solid;
    border-width: 1px;
    display: flex;
    // centering along main axis - X axis - Horizontal
    justify-content: center;
    // centering along cross axis - Y axis - Vertical
    align-items: center;
  }

  .icon-tab {
    //display: inline-block;
    padding: 0px;
    margin-bottom: 30px;
  }

  .icon-hover:hover {
    background: linear-gradient(to bottom, #1bee90 0, #14e296 99%);
  }

  .icon-title{
    //font-size:16px;
    display: flex;
    // centering along main axis - X axis - Horizontal
    justify-content: center;
    // centering along cross axis - Y axis - Vertical
    align-items: center;
  }

  .about-phone {
    // width: 80%;
    // margin: 0 auto;

    //   position: relative;
    // top: 50%;
    // left: 50%;
  }

  .img-fluid {
    max-width: 100%;
    height: auto;
  }

  .about-section {
    padding: 5.625rem 0;
  }

  .about-section__description {
    margin-bottom: 5.625rem;
    text-align: justify;
  }

  .card {
    width: 22.375rem;
    padding: 3.4375rem 2rem 3.625rem;
    font-size: $font-size--16;
    line-height: 1.875;
    box-shadow: 1px 2px 1.25rem 1px rgba($color-name--mine-shaft_base, 0.2);
  }

  .card__figure {
    position: relative;
    align-items: center;
    justify-content: center;
    width: 4.25rem;
    height: 4.25rem;
    margin-bottom: 2.625rem;
  }

  .card__rhombus-layer {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    background: map-get($card, "rhombus-layer__background-color--primary");
    transform: translate(-50%, -50%) rotate(45deg);

    .card:nth-of-type(2) & {
      background: map-get($card, "rhombus-layer__background-color--secondary");
    }
  }

  .card__icon {
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: $font-size--32;
    color: map-get($root, "icon__foreground-color--secondary");
    transform: translate(-50%, -50%);

    .card:nth-of-type(2) & {
      color: map-get($root, "icon__foreground-color--primary");
    }
  }

  .card__heading {
    margin-bottom: 2.5rem;

    .card:nth-of-type(2) & {
      color: map-get($root, "foreground-color--tertiary");
    }
  }

</style>
