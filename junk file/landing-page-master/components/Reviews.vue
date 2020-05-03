<template>
  <section class="reviews-section">
    <div class="l-content">
      <h2 class="reviews-section__heading">
        Some Talk of Our Clients
      </h2>
      <no-ssr placeholder="Loading...">
        <carousel
          class="carousel"
          :per-page-custom="[[1920, 2]]"
          :loop="true"
          :pagination-enabled="true"
          :space-padding="0"
          :pagination-active-color="'#cbd9f1'"
          :pagination-color="'#90b4ee'"
          :pagination-padding="6"
          :pagination-size="15"
        >
          <slide
            v-for="(review, index) in reviews"
            :key="index"
            class="slide"
          >
            <div class="slide__content">
              <figure class="slide__figure">
                <picture>
                  <source
                    :srcset="`${review.imageUrl}.webp`"
                    type="image/webp"
                  >
                  <source
                    :srcset="`${review.imageUrl}.jpg`"
                    type="image/jpeg"
                  >
                  <img
                    class="slide__image"
                    :src="`${review.imageUrl}.jpg`"
                    :alt="review.author"
                  >
                </picture>
              </figure>
              <div class="slide__author">
                {{ review.author }}
              </div>
              <div class="slide__position">
                {{ review.position }}
              </div>
              <div class="l-row">
                <fa
                  class="slide__icon slide__icon--quote-left"
                  icon="quote-left"
                />
                <span class="slide__review-text">
                  {{ review.reviewText }}
                  <fa
                    class="slide__icon slide__icon--quote-right"
                    icon="quote-right"
                  />
                </span>
              </div>
            </div>
          </slide>
        </carousel>
      </no-ssr>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'Reviews',
    props: {
      reviews: {
        type: Array,
        required: true,
        validator(value) {
          for (let i = 0; i < value.length; i += 1) {
            if (typeof value[i].imageUrl !== 'string') {
              return false;
            }
            if (typeof value[i].author !== 'string') {
              return false;
            }
            if (typeof value[i].position !== 'string') {
              return false;
            }
            if (typeof value[i].reviewText !== 'string') {
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
  };
</script>

<style lang="scss" scoped>
  .reviews-section {
    padding: 5.625rem 0 5.375rem;
    margin-bottom: 5.625rem;
    color: map-get($root, "foreground-color--secondary");
    background-image: linear-gradient(-110deg, $color-name--dodger-green, $color-name--denim-green);
  }

  .carousel {
    display: flex;
    align-items: center;
    justify-content: center;

    .VueCarousel-wrapper {
      margin-bottom: 1.25rem;
    }
  }

  .slide {
    @include flex--column;
    justify-content: flex-end;
    height: 21.9375rem;

    &:nth-of-type(even) {
      margin-left: 1.25rem;
    }

    &:nth-of-type(2n+3) {
      margin-left: -1.25rem;
    }
  }

  .slide__content {
    @include flex--column;
    position: relative;
    align-items: center;
    width: 35rem;
    height: 17.3125rem;
    padding: 3rem 4.6875rem 2.3125rem;
    border: 1px solid map-get($root, "border__background-color--primary");

    .l-row {
      align-items: flex-start;
    }
  }

  .slide__figure {
    position: absolute;
    top: -4.625rem;
  }

  .slide__image {
    width: 7.625rem;
    height: 7.625rem;
    border: 2px solid map-get($root, "border__background-color--primary");
    border-radius: 50%;
  }

  .slide__author {
    font-size: $font-size--18;
    font-weight: 600;
    line-height: 2;
  }

  .slide__position {
    margin-bottom: 1.625rem;
    font-size: $font-size--14;
  }

  .slide__icon {
    font-size: $font-size--27;

    &--quote-left {
      margin-right: 1.0625rem;
    }
  }

  .slide__review-text {
    font-size: $font-size--15;
    text-align: justify;
  }
</style>
