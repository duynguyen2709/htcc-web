<template>
  <section id="features-section" class="features-section js-affix">
    <div class="row">
      <div class="col-4">
        <img style="max-height: 580px;" src="http://vue.pixelstrap.com/tovo/static/img/222.5eea2b2.png" />
      </div>
      <div class="col-8">
        <div class="row">
          <h2 style="float:left; color: #444444;">FEATURES OF HTCC</h2>
          <div class="col">
            <div class="feature">
              <!-- <div class="row">
                  <div class="col-1 icon-hover">
                    <fa
                  class="plan__icon plan__icon--check fa-lg"
                  icon="users"
                />
                  </div>
                  <div class="col icon-title">
                    <h5 style="font-size:16px;">Easy customize</h5>
                  </div>
              </div> -->

              <ul class="plan__list" style="">
              <li class="plan__item" style="">
                
                <div class="header__item" >
                <fa
                  class="plan__icon"
                  icon="users"
                />
                User Friendly
                </div>
                <!-- <div>
                <p style="text-align: justify;">Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry.</p>
                </div> -->
                <p class="describe-feature">Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry.</p>
                
              </li>
              <li class="plan__item" style="">
                
                <div class="header__item">
                <fa
                  class="plan__icon"
                  icon="chart-line"
                />High Performance
                </div>
                <p  class="describe-feature">Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry.</p>
                
              </li>
              <li class="plan__item" style="">
                
                <div class="header__item">
                <fa
                  class="plan__icon"
                  icon="cogs"
                />Unlimited Features
                </div>
                <p  class="describe-feature">Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry.</p>
                
              </li>
              </ul>
            </div>
          </div>
          <div class="col">
             <ul class="plan__list" style="">
              <li class="plan__item" style="">
                
                <div class="header__item">
                <fa
                  class="plan__icon"
                  icon="sync"
                />Quick Update
                </div>
                <!-- <div>
                <p style="text-align: justify;">Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry.</p>
                </div> -->
                <p  class="describe-feature">Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry.</p>
                
              </li>
              <li class="plan__item" style="">
                
                <div class="header__item">
                <fa
                  class="plan__icon"
                  icon="lock"
                />100% Secure
                </div>
                <p  class="describe-feature">Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry.</p>
                
              </li>
              <li class="plan__item" style="">
                
                <div class="header__item">
                <fa
                  class="plan__icon"
                  icon="headset"
                />24 X 7 Support
                </div>
                <p  class="describe-feature">Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry.</p>
                
              </li>
              </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'Features',
  };

</script>

<style lang="scss" scoped>
  .describe-feature{
    text-align: justify; 
    font-size: 15px;
    color: #777777;
  }

  .plan__list {
    list-style-type: none;
  }

  .plan__item {
    float:left;
    margin-bottom: 50px;
  }

  .plan__icon {
    margin-right: 10px;
    color:  #1bee90;
  }

  .header__item{
    // display: inline-block;
    margin-bottom: 10px;
     text-align: left;
     color:#444444;
     font-weight: bold;
  }

  .features-section {
    padding-top: 5.5625rem;
    //padding-bottom: 22.375rem;
    color: map-get($root, "foreground-color--secondary");
    //background: url("/features/background.svg") 0 0 no-repeat;
    background: url("/features/background.png");
    background-position: center;
    min-height: 730px;
    .l-row {
      align-items: flex-start;
    }
  }

  .features-section__description {
    margin-bottom: 6.1875rem;
  }

  .features__list {
    @extend %list;
    text-align: left;
  }

  .features__item {
    line-height: 1.875;

    &:not(:last-of-type) {
      margin-bottom: 4.5rem;
    }
  }

  .features__circle-layer {
    position: relative;
    width: 4.875rem;
    height: 4.875rem;
    margin-right: 2.375rem;
    background: map-get($features, "circle-layer__background-color");
    border-radius: 50%;
  }

  .features__icon {
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: $font-size--36;
    color: map-get($root, "icon__foreground-color--secondary");
    transform: translate(-50%, -50%);
  }

  .features__heading {
    margin-bottom: 1.25rem;
    font-size: $font-size--20;
    color: map-get($root, "heading__foreground-color--secondary");
    text-transform: uppercase;
  }

  .features__description {
    width: 34.625rem;
    font-size: $font-size--16;
  }

</style>
