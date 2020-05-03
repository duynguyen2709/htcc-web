<template>
  <nav
    class="main-menu"
    :style="{ height: navbarHeight + 'px' }"
  >
    <ul class="main-menu__list">
      <li
        class="main-menu__underline"
        :style="{ left: underlineOffsetLeft + 'px', width: underlineWidth + 'px' }"
      ></li>
      <li
        v-for="(item, index) in items"
        :key="index"
        class="main-menu__item"
        :class="{ 'is-active': item.isActive }"
        :data-id="item.name.toLowerCase()"
      >
        <a
          class="main-menu__link"
          @click="setActive(item)"
        >
          {{ item.name }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
  import debounce from 'lodash.debounce';

  export default {
    name: 'MainMenu',
    props: {
      items: {
        type: Array,
        required: true,
        validator(value) {
          for (let i = 0; i < value.length; i += 1) {
            if (typeof value[i].name !== 'string') {
              return false;
            }
            if (typeof value[i].isActive !== 'boolean') {
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
    data() {
      return {
        navbarHeight: 0,
        underlineOffsetLeft: 0,
        underlineWidth: 0,
      };
    },
    mounted() {
      this.navbarHeight = document.querySelector('.navbar').offsetHeight;


      this.getUnderlineProperties();


      window.addEventListener('scroll', this.affix, { passive: true });
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.affix);
    },
    methods: {
      setActive(item) {
        const currentItem = document.getElementById(`${item.name.toLowerCase()}-section`);

        window.scrollTo(0, currentItem.offsetTop - this.navbarHeight);

        this.items.forEach((el) => {
          const mainMenuItems = document.querySelectorAll('.main-menu__item');

          mainMenuItems.forEach(el => el.classList.remove('is-active'));


          el.isActive = el === item;
        });
      },
      affix() {
        const { body } = document;
        const html = document.documentElement;
        const scrollTop = body.scrollTop || html.scrollTop;
        const affix = document.querySelectorAll('.js-affix');
        const mainMenuItems = document.querySelectorAll('.main-menu__item');

        for (let i = 0; i < affix.length; i += 1) {
          if ((scrollTop + this.navbarHeight) >= affix[i].offsetTop) {
            mainMenuItems[i].classList.add('is-active');
            for (let j = 0; j < mainMenuItems.length; j += 1) {
              if (mainMenuItems[j] !== mainMenuItems[i]) {
                mainMenuItems[j].classList.remove('is-active');
              }
            }
          } else {
            mainMenuItems[i].classList.remove(('is-active'));
          }
        }


        this.getUnderlineProperties();
      },
      getUnderlineProperties: debounce(function () {
        const mainMenuItems = document.querySelectorAll('.main-menu__item');

        for (let i = 0; i < mainMenuItems.length; i += 1) {
          if (mainMenuItems[i].classList.contains('is-active')) {
            this.underlineOffsetLeft = mainMenuItems[i].offsetLeft;
            this.underlineWidth = mainMenuItems[i].offsetWidth;
          }
        }
      }, 70),
    },
  };
</script>

<style lang="scss" scoped>
  .main-menu {
    display: inline-block;
  }

  .main-menu__list {
    @extend %list;
    position: relative;
    display: flex;
    justify-content: space-between;
    height: 100%;
    user-select: none;
  }

  .main-menu__item {
    display: flex;
    flex-direction: column;
    justify-content: center;

    &:not(:last-of-type) {
      margin-right: 2.25rem;
    }
  }

  .main-menu__underline {
    position: absolute;
    bottom: 0.625rem;
    left: 0;
    display: block;
    height: 5px;
    content: "";
    background: map-get($root, "background-color--secondary");
    transition: all 0.5s ease;
  }

  .main-menu__link {
    color: map-get($root, "link__foreground-color");
    text-decoration: none;
    cursor: pointer;
  }
</style>
