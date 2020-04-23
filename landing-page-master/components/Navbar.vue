<template>
  <div
    class="navbar"
    :class="{ 'is-sticky': isSticky }"
  >
    <div class="l-navbar">
      <div class="l-row ">
        <div class="navbar__brand-name">
          UIXREX
        </div>
        <main-menu :items="menuItems" />
        <!-- <button
          class="navbar__button button button--rounded"
          :class="{ 'is-inverted': isSticky }"
        >
          Try for free
        </button> -->
      </div>
    </div>
  </div>
</template>

<script>
  import MainMenu from '~/components/MainMenu.vue';

  export default {
    name: 'Navbar',
    components: {
      MainMenu,
    },
    data() {
      return {
        menuItems: [
          { name: 'Home', isActive: true },
          { name: 'About', isActive: false },
          { name: 'Features', isActive: false },
          { name: 'Pricing', isActive: false },
          { name: 'Screenshots', isActive: false },
          { name: 'Contact', isActive: false },
        ],
        isSticky: false,
      };
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll, { passive: true });
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
      handleScroll() {
        const { body } = document;
        const html = document.documentElement;
        const scrollTop = body.scrollTop || html.scrollTop;
        const homeImage = document.querySelector('.home-section__figure');

        this.isSticky = (scrollTop > homeImage.offsetTop);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .navbar {
    position: fixed;
    top: 0;
    z-index: 2000;
    width: 100%;
    //margin-top: 3.875rem;
    margin-top: 20px;
    transition: all 0.5s ease;

    &.is-sticky {
      margin-top: 0;
      //background: linear-gradient(to right, $color-name--denim 0, $color-name--dodger-blue 50%, $color-name--denim 100%);
      background:  url("/home/background.png");

      // background: linear-gradient(to right, $color-name--dodger-green 0, $color-name--denim-green 50%, $color-name--dodger-green 100%);;
      // border-bottom: 2px solid $color-name--dodger-green;
    }
  }

  .navbar__brand-name {
    font-size: $font-size--34;
    font-weight: 600;
    color: map-get($root, "foreground-color--secondary");
    // padding-left: -100px;
    margin-left: -170px;
  }

  .navbar-top{
    margin-top: -50px;
  }

  .navbar__button {
    font-size: $font-size--25;
    color: map-get($root, "foreground-color--tertiary");
    background: map-get($navbar, "button__background-color");
    transition: background-color 0.5s ease;

    &.is-inverted {
      color: map-get($root, "foreground-color--secondary");
      background: transparent;
    }
  }
</style>
