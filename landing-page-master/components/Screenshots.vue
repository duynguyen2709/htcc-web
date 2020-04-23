<template>
  <section
    id="screenshots-section"
    class="screenshots-section js-affix"
  >
    <h2 class="screenshots-section__heading heading heading--primary">
      App Screenshots
    </h2>
    <p class="screenshots-section__description">
      Most such devices are sold with several apps bundled as pre-installed software,<br>
      such as a web browser, email client, calendar, mapping program.
    </p>
    <no-ssr placeholder="Loading...">
      <carousel
        ref="screenshotsSectionCarousel"
        class="carousel"
        :per-page-custom="[[1920, 5]]"
        :autoplay="true"
        :autoplay-timeout="5000"
        :loop="true"
        :pagination-enabled="false"
      >
        <slide
          v-for="(screenshot, index) in screenshots"
          :key="index"
        >
          <figure>
            <picture>
              <source
                :srcset="`${screenshot.imageUrl}.webp`"
                type="image/webp"
              >
              <source
                :srcset="`${screenshot.imageUrl}.png`"
                type="image/png"
              >
              <img
                :src="`${screenshot.imageUrl}.png`"
                :alt="screenshot.name"
              >
            </picture>
          </figure>
        </slide>
      </carousel>
      <nav class="navigation">
        <button
          class="navigation__button button button--circle"
          aria-label="Previous slide"
          @click="navigate('prev')"
        >
          <fa
            class="navigation__icon"
            icon="long-arrow-alt-left"
          />
        </button>
        <button
          class="navigation__button button button--circle"
          aria-label="Next slide"
          @click="navigate('next')"
        >
          <fa
            class="navigation__icon"
            icon="long-arrow-alt-right"
          />
        </button>
      </nav>
    </no-ssr>
  </section>
</template>

<script>
  export default {
    name: 'Screenshots',
    props: {
      screenshots: {
        type: Array,
        required: true,
        validator(value) {
          for (let i = 0; i < value.length; i += 1) {
            if (typeof value[i].imageUrl !== 'string') {
              return false;
            }
            if (typeof value[i].name !== 'string') {
              return false;
            }
          }

          return true;
        },
        default() {
          return [];
        },
      },
    },
    methods: {
      navigate(value) {
        const carousel = this.$refs.screenshotsSectionCarousel;
        const { currentPage } = carousel;
        const { pageCount } = carousel;

        if (value === 'prev') {
          currentPage !== 0 ? carousel.goToPage(currentPage - 1) : carousel.goToPage(pageCount - 1);
        } else {
          currentPage < pageCount - 1 ? carousel.goToPage(currentPage + 1) : carousel.goToPage(0);
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .screenshots-section {
    padding-top: 4.75rem;
    padding-bottom: 5.625rem;
  }

  .screenshots-section__description {
    margin-bottom: 5.625rem;
  }

  .screenshots-section__carousel {
    margin-bottom: 3.0625rem;
  }

  .navigation__button {
    margin-right: 3.3125rem;
    font-size: $font-size--28;
    color: map-get($root, "foreground-color--secondary");
    background: map-get($navigation, "button__background-color");

    &:last-of-type {
      margin-right: 0;
    }
  }
</style>
