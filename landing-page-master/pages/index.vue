<template>
  <div class="l-container">
    <home />
    <about />
    <features />
    <pricing />
    <screenshots :screenshots="screenshots" />
    <reviews :reviews="reviews" />
    <contact />
    <!-- <section class="map-section">
      <div
        class="map-section__map"
      >
        <no-ssr placeholder="Loading...">
          <l-map
            :zoom="12"
            :center="[23.7083983, 90.4048237]"
          >
            <l-tile-layer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png" />
            <l-marker :lat-lng="[23.7083983, 90.4048237]" />
          </l-map>
        </no-ssr>
      </div>
    </section> -->
    <main-footer />
  </div>
</template>

<script>
  import Home from '~/components/Home';
  import About from '~/components/About';
  import Features from '~/components/Features';
  import Pricing from '~/components/Pricing';
  import Screenshots from '~/components/Screenshots';
  import Reviews from '~/components/Reviews';
  import Contact from '../components/Contact';
  import MainFooter from '~/components/MainFooter';

  export default {
    components: {
      Home,
      About,
      Features,
      Pricing,
      Screenshots,
      Reviews,
      Contact,
      MainFooter,
    },
    data() {
      return {
        screenshots: [
          { name: 'workout', imageUrl: '/screenshots/workout' },
          { name: 'story', imageUrl: '/screenshots/story' },
          { name: 'map', imageUrl: '/screenshots/map' },
          { name: 'music player', imageUrl: '/screenshots/music_player' },
          { name: 'login', imageUrl: '/screenshots/login' },
          { name: 'story 2', imageUrl: '/screenshots/story_2' },
          { name: 'map 2', imageUrl: '/screenshots/map_2' },
        ],
        reviews: [
          {
            imageUrl: '/reviews/james_santana',
            author: 'James Santana',
            position: 'Web Developer',
            reviewText:
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, good.',
          },
          {
            imageUrl: '/reviews/julia_green',
            author: 'Julia Green',
            position: 'Web Designer',
            reviewText:
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, good.',
          },
          {
            imageUrl: '/reviews/oliver_gomez',
            author: 'Oliver Gomez',
            position: 'CEO of google',
            reviewText:
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, good.',
          },
          {
            imageUrl: '/reviews/rita_watson',
            author: 'Rita Watson',
            position: 'Web Designer',
            reviewText:
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, good.',
          },
          {
            imageUrl: '/reviews/monica_flower',
            author: 'Monica Flower',
            position: 'Marketer',
            reviewText:
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, good.',
          },
          {
            imageUrl: '/reviews/sarah_april',
            author: 'Sarah April',
            position: 'IT manager',
            reviewText:
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, good.',
          },
        ],
      };
    },
  };
</script>

<style lang="scss">
  .map-section {
    height: 25rem;
  }

  .map-section__map {
    height: 100%;
  }
</style>
