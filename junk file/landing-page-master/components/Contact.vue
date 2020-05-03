<template>
  <section
    id="contact-section"
    class="contact-section js-affix"
  >
    <div class="l-content">
      <h2 class="contact-section__heading">
        Say Hello To Us!
      </h2>
      <p class="contact-section__description">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod<br>
        tempor incididunt ut labore. et
        dolore magna aliqua.
      </p>
      <div class="l-row">
        <address class="contact-information">
          <div class="contact-information__section">
            <div class="l-row">
              <fa
                class="contact-information__icon"
                icon="map"
              />
              <div>
                <h3 class="contact-information__type">
                  Location:
                </h3>
                <span class="contact-information__value">
                  Jurain, Dhaka Bangladesh
                </span>
              </div>
            </div>
          </div>
          <div class="contact-information__section">
            <div class="l-row">
              <fa
                class="contact-information__icon"
                icon="phone"
              />
              <div>
                <h3 class="contact-information__type">
                  Phone number:
                </h3>
                <span class="contact-information__value">
                  +1234321321
                </span>
              </div>
            </div>
          </div>
          <div class="contact-information__section">
            <div class="l-row">
              <fa
                class="contact-information__icon"
                icon="envelope"
              />
              <div>
                <h3 class="contact-information__type">
                  Email:
                </h3>
                <span class="contact-information__value">
                  websitename@mail.com
                </span>
              </div>
            </div>
          </div>
        </address>
        <form
          action=""
          name="feedback"
          class="feedback"
        >
          <label>
            <input
              type="text"
              class="feedback__name"
              placeholder="Name"
            >
          </label>
          <label>
            <input
              type="text"
              class="feedback__email"
              placeholder="Email"
            >
          </label>
          <textarea
            class="feedback__message"
            placeholder="Your Message"
            :style="{ height: feedbackMessageHeight + 'px' }"
          >
          </textarea>
          <button
            type="submit"
            class="feedback__button"
            value="Send message"
          >
            Send message
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'Contact',
    data() {
      return {
        feedbackMessageHeight: 0,
      };
    },
    mounted() {
      const contactInformationHeight = document.querySelector('.contact-information').offsetHeight;
      const feedbackInputs = document.querySelectorAll('input[type="text"]');
      const feedbackInputHeight = feedbackInputs[0].offsetHeight;
      const feedbackInputMarginBottom = window.getComputedStyle(feedbackInputs[0], null).getPropertyValue('margin-bottom').match(/^\d+/);

      this.feedbackMessageHeight = contactInformationHeight - (feedbackInputHeight * feedbackInputs.length
        + feedbackInputMarginBottom * feedbackInputs.length);
    },
  };
</script>

<style lang="scss" scoped>
  .contact-section {
    padding: 4.625rem 0;
    font-size: $font-size--15;
    color: map-get($contact-section, foreground-color);
    background: map-get($contact-section, background-color);
  }

  .contact-section__heading {
    position: relative;
    margin-bottom: 1.6875rem;
    font-family: $font-family--raleway;
    color: map-get($contact-section, heading__foreground-color);

    &::after {
      position: absolute;
      bottom: -0.625rem;
      left: 50%;
      width: 4.4375rem;
      height: 5px;
      content: "";
      background: map-get($contact-section, underline__background-color);
      transform: translateX(-50%);
    }
  }

  .contact-section__description {
    margin-bottom: 4.1875rem;
  }

  .contact-information {
    align-self: flex-start;
    width: 23.6875rem;
    padding: 2.875rem 1.4375rem;
    margin-right: 0.875rem;
    font-style: normal;
    text-align: left;
    background: map-get($root, "background-color--primary");

    .l-row {
      align-items: flex-start;
      justify-content: flex-start;
    }
  }

  .contact-information__section:not(:last-of-type) {
    margin-bottom: 1.875rem;
  }

  .contact-information__icon {
    margin-right: 1rem;
    font-size: $font-size--20;
    color: map-get($root, "icon__foreground-color--quaternary");
  }

  .contact-information__type {
    margin-bottom: 0.625rem;
    font-size: $font-size--18;
    color: map-get($contact-section, heading__foreground-color);
  }

  .contact-information__value {
    font-weight: 300;
  }

  .feedback {
    width: 48.5625rem;
    text-align: left;

    ::placeholder {
      font-size: $font-size--16;
      font-weight: 300;
      color: map-get($feedback, "placeholder__foreground-color");
    }
  }

  .feedback__name,
  .feedback__email,
  .feedback__message {
    width: 100%;
    margin-bottom: 1.625rem;
    border: none;
  }

  .feedback__name,
  .feedback__email {
    height: 3rem;
    padding: 0 0.8125rem;
  }

  .feedback__message {
    padding: 1.4375rem 0.8125rem;
    resize: none;
  }

  .feedback__button {
    width: 9.875rem;
    height: 2.8125rem;
    padding: 0;
    font-size: $font-size--16;
    color: map-get($root, "foreground-color--secondary");
    text-transform: capitalize;
    cursor: pointer;
    background: map-get($feedback, "button__background-color");
    border: none;
  }
</style>
