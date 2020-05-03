<template>
  <section
    id="pricing-section"
    class="pricing-section js-affix"
  >
    <div class="l-content">
      <h2 class="pricing-section__heading heading heading--primary">
        Pricing Plan
      </h2>
      <p class="pricing-section__description">
        Writers and stars of Veep have responded incredulously to the news an Australian politician<br>
        required preinstalled stitches way email client, calendar, mapping program.
      </p>
      <div class="l-row">
        <div class="plan">
          <div class="l-col">
            <h3 class="plan__heading">
              Basic
            </h3>
            <div class="plan__price">
              $00
            </div>
            <div class="plan__details">
              Limited access
            </div>
            <ul class="plan__list">
              <li class="plan__item">
                <fa
                  class="plan__icon plan__icon--check"
                  icon="check"
                />100 MB Disk Space
              </li>
              <li class="plan__item">
                <fa
                  class="plan__icon plan__icon--check"
                  icon="check"
                />2 Subdomains
              </li>
              <li class="plan__item">
                <fa
                  class="plan__icon plan__icon--check"
                  icon="check"
                />5 Email Accounts
              </li>
              <li class="plan__item">
                <fa
                  class="plan__icon plan__icon--times"
                  icon="times"
                />No License
              </li>
              <li class="plan__item">
                <fa
                  class="plan__icon plan__icon--times"
                  icon="times"
                />Phone & Mail Support
              </li>
            </ul>
            <button class="plan__button button button--rounded">
              Purchase
            </button>
          </div>
        </div>
        <div class="plan">
          <div class="l-col">
            <h3 class="plan__heading">
              Professional
            </h3>
            <div class="plan__price">
              $12
            </div>
            <div class="plan__details">
              Limited access
            </div>
            <ul class="plan__list">
              <li class="plan__item">
                <fa
                  class="plan__icon plan__icon--check"
                  icon="check"
                />100 MB Disk Space
              </li>
              <li class="plan__item">
                <fa
                  class="plan__icon plan__icon--check"
                  icon="check"
                />2 Subdomains
              </li>
              <li class="plan__item">
                <fa
                  class="plan__icon plan__icon--check"
                  icon="check"
                />5 Email Accounts
              </li>
              <li class="plan__item">
                <fa
                  class="plan__icon plan__icon--check"
                  icon="check"
                />No License
              </li>
              <li class="plan__item">
                <fa
                  class="plan__icon plan__icon--times"
                  icon="times"
                />Phone & Mail Support
              </li>
            </ul>
            <button class="plan__button button button--rounded">
              Purchase
            </button>
          </div>
        </div>
        <div class="plan">
          <div class="l-col">
            <h3 class="plan__heading">
              Business
            </h3>
            <div class="plan__price">
              $22
            </div>
            <div class="plan__details">
              Limited access
            </div>
            <ul class="plan__list">
              <li class="plan__item">
                <fa
                  class="plan__icon plan__icon--check"
                  icon="users"
                />100 MB Disk Space
              </li>
              <li class="plan__item">
                <fa
                  class="plan__icon plan__icon--check"
                  icon="check"
                />2 Subdomains
              </li>
              <li class="plan__item">
                <fa
                  class="plan__icon plan__icon--check"
                  icon="check"
                />5 Email Accounts
              </li>
              <li class="plan__item">
                <fa
                  class="plan__icon plan__icon--check"
                  icon="check"
                />No License
              </li>
              <li class="plan__item">
                <fa
                  class="plan__icon plan__icon--check"
                  icon="check"
                />Phone & Mail Support
              </li>
            </ul>
            <button class="plan__button button button--rounded">
              Purchase
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'Pricing',
  };
</script>

<style lang="scss" scoped>
  .pricing-section {
    padding: 5.4375rem 0;
    background: map-get($root, "background-color--secondary");
  }

  .pricing-section__description {
    margin-bottom: 7.1875rem;
  }

  .plan {
    width: 22.875rem;
    padding: 2.5625rem 0;
    border: 2px solid map-get($root, "border__background-color--secondary");
    border-radius: 1.25rem;
    box-shadow: 1px 2px 0.375rem 1px rgba($color-name--mine-shaft_base, 0.24);

    &:nth-of-type(2) {
      height: 38.6609375rem;
      padding: 4.35078125rem 0;
      color: map-get($root, "foreground-color--secondary");
      background: linear-gradient(to right, $color-name--denim-green, $color-name--dodger-green);
    }
  }

  .plan__heading {
    margin-bottom: 2.25rem;
    font-size: $font-size--24;

    .plan:nth-of-type(2) & {
      color: map-get($root, "heading__foreground-color--secondary");
    }
  }

  .plan__price {
    margin-bottom: 2.25rem;
    font-size: $font-size--36;
    line-height: 1;
    color: map-get($root, "foreground-color--tertiary");

    .plan:nth-of-type(2) & {
      color: map-get($root, "foreground-color--secondary");
    }
  }

  .plan__details {
    margin-bottom: 2.9375rem;
    font-size: $font-size--18;
    font-weight: 600;
    line-height: 1;
    color: map-get($root, "heading__foreground-color--primary");

    .plan:nth-of-type(2) & {
      color: map-get($root, "foreground-color--secondary");
    }
  }

  .plan__list {
    @extend %list;
    margin-bottom: 2.1875rem;
    font-size: $font-size--14;
    line-height: 2.57142857142;
  }

  .plan__icon {
    margin-right: 0.375rem;

    &--check {
      color: map-get($root, "icon__foreground-color--secondary");

      .plan:nth-of-type(2) & {
        color: map-get($root, "icon__foreground-color--primary");
      }
    }

    &--times {
      color: map-get($root, "icon__foreground-color--tertiary");
    }
  }

  .plan__button {
    width: 12.8125rem;
    height: 3.4375rem;
    font-size: $font-size--18;
    font-weight: 500;
    color: map-get($root, "foreground-color--tertiary");
    text-transform: uppercase;
    background: map-get($plan, "button__background-color--secondary");
    border: 2px solid map-get($root, "border__background-color--secondary");

    .plan:nth-of-type(2) & {
      background: map-get($plan, "button__background-color--primary");
      border-color: map-get($root, "border__background-color--primary");
    }
  }
</style>
