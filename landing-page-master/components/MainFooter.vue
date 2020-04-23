<template>
  <footer class="main-footer">
    <div class="l-footer">
      <div class="l-row">
        <div class="main-footer__copyright">
          Copyright © 2018 UIXREX, All rights Reserved.
        </div>
        <div class="follow">
          <ul class="follow__list">
            <li class="follow__item">
              <a
                class="link"
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener"
                aria-label="Facebook"
              >
                <fa
                  :icon="['fab', 'facebook-f']"
                  fixed-width
                />
              </a>
            </li>
            <li class="follow__item">
              <a
                class="link"
                href="https://twitter.com/"
                target="_blank"
                rel="noopener"
                aria-label="Twitter"
              >
                <fa
                  :icon="['fab', 'twitter']"
                  fixed-width
                />
              </a>
            </li>
            <li class="follow__item">
              <a
                class="link"
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener"
                aria-label="Instagram"
              >
                <fa
                  :icon="['fab', 'instagram']"
                  fixed-width
                />
              </a>
            </li>
            <li class="follow__item">
              <a
                class="link"
                href="https://plus.google.com/"
                target="_blank"
                rel="noopener"
                aria-label="Google Plus"
              >
                <fa
                  :icon="['fab', 'google-plus-g']"
                  fixed-width
                />
              </a>
            </li>
            <li class="follow__item">
              <a
                class="link"
                href="https://www.behance.net/"
                target="_blank"
                rel="noopener"
                aria-label="Behance"
              >
                <fa
                  :icon="['fab', 'behance']"
                  fixed-width
                />
              </a>
            </li>
            <li class="follow__item">
              <a
                class="link"
                href="https://dribbble.com/"
                target="_blank"
                rel="noopener"
                aria-label="Dribbble"
              >
                <fa
                  :icon="['fab', 'dribbble']"
                  fixed-width
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
  export default {
    name: 'MainFooter',
  };
</script>

<style lang="scss" scoped>
  .main-footer {
    height: 16.875rem;
    color: map-get($root, "foreground-color--secondary");
    background: map-get($main-footer, background-color);

    .l-row {
      height: 100%;
    }
  }

  .main-footer__copyright {
    font-family: $font-family--montserrat;
    font-size: $font-size--16;
    font-weight: 600;
  }

  .follow__list {
    @extend %list;
    display: flex;
    font-size: $font-size--30;
    user-select: none;
  }

  .follow__item:not(:last-of-type) {
    margin-right: 3.4375rem;
  }
</style>
