/*
  SimpleRange v1.0.7 | Repo: https://github.com/maxshuty/accessible-web-components/src/components/simpleRange.js
  By Max Poshusta | https://github.com/maxshuty | https://www.linkedin.com/in/maxposhusta/
*/

// Object containing common CSS styles so we can change them in once place
const cssHelpers = Object.freeze({
    sliderBackgroundColor: 'tomato',
    sliderBorderColor: '#8b8b8b',
    sliderBorderRadius: '4px',
    sliderCircleSize: 24,
    sliderCircleBackgroundColor: '#ffffff',
    sliderCircleFocusColor: '#0074cc',
    sliderCommonSize: '0.5em',
  });
  
  const constants = Object.freeze({
    MIN: 'min',
    MAX: 'max',
    SLIDER_ID: 'minMaxSlider',
    MIN_LABEL_ID: `minLabel`,
    MAX_LABEL_ID: `maxLabel`,
    RANGE_STOPPED_EVENTS: ['mouseup', 'touchend', 'keyup'],
    CUSTOM_EVENT_TO_EMIT_NAME: 'range-changed',
    RANGE_INPUT_DATA_LABEL_MIN: 'data-range-input-label-min',
    RANGE_INPUT_DATA_LABEL_MAX: 'data-range-input-label-max',
  });
  
  const template = document.createElement('template');
  template.innerHTML = `
      <style>
        .min-max-slider { 
          position: relative;
          width: 100%;
          text-align: center;
        }
           
        .min-max-slider > label {
          position: absolute;
          left: -10000px;
          top: auto;
          width: 1px;
          height: 1px;
          overflow: hidden;
        }
          
        .min-max-slider > .legend {
          display: flex;
          justify-content: space-between;
        }
          
        .min-max-slider > .range-input {
          --sliderCircleSize: ${cssHelpers.sliderCircleSize}px;
          --sliderColor: ${cssHelpers.sliderCircleBackgroundColor};
          --sliderBorderColor: ${cssHelpers.sliderBorderColor};
          --sliderFocusBorderColor: ${cssHelpers.sliderCircleFocusColor};
          --sliderCircleBorder: 1px solid var(--sliderBorderColor);
          --sliderCircleFocusBorder: 2px solid var(--sliderFocusBorderColor);
          cursor: pointer;
          position: absolute;
          -webkit-appearance: none;
          appearance: none;
          outline: none !important;
          background: transparent;
          background-image: linear-gradient(to bottom, transparent 0%, transparent 35%, ${cssHelpers.sliderBackgroundColor} 35%, ${cssHelpers.sliderBackgroundColor} 65%, transparent 65%, transparent 100%);
          margin: 0;
        }
          
        .min-max-slider > .range-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: var(--sliderCircleSize);
          height: var(--sliderCircleSize);
          background-color: var(--sliderColor);
          cursor: pointer;
          border: var(--sliderCircleBorder);
          border-radius: 100%;
        }
        
        .min-max-slider > .range-input::-moz-range-thumb {
          width: var(--sliderCircleSize);
          height: var(--sliderCircleSize);
          background-color: var(--sliderColor);
          cursor: pointer;
          border: var(--sliderCircleBorder);
          border-radius: 100%;
        } 
          
        .min-max-slider > .range-input::-webkit-slider-runnable-track,  
        .min-max-slider > .range-input::-moz-range-track {
          cursor: pointer;
        }
          
        .min-max-slider > .range-input:focus::-webkit-slider-thumb {
          /* Accessible border on focus */
          border: var(--sliderCircleFocusBorder);
        }
  
        .min-max-slider > .range-input:focus::-moz-range-thumb {
            /* Accessible border on focus */
            border: var(--sliderCircleFocusBorder);
        }
          
        span.value {
          --labelBeforeContent: '';
          --labelAfterContent: '';
          --labelFontSize: 16px;
          --labelFontWeight: bold;
          font-size: var(--labelFontSize);
          font-weight: var(--labelFontWeight);
          height: auto;
          display: inline-block;
        }
  
        span.value::before {
          content: var(--labelBeforeContent);
        }
  
        span.value::after {
          content: var(--labelAfterContent);
        }
  
        .range-input-dash-icon {
          padding: 0 ${cssHelpers.sliderCommonSize};
        }
  
        .range-input-label {
            border: 1px solid ${cssHelpers.sliderBorderColor};
            border-radius: ${cssHelpers.sliderBorderRadius};
            padding: ${cssHelpers.sliderCommonSize};
        }
      </style>
      
      <div id="${constants.SLIDER_ID}" class="min-max-slider"></div>
  `;
  
  class SimpleRange extends HTMLElement {
    constructor() {
      super();
  
      // Setting these variables so that we can clean up the event listeners
      // on the disconnectedCallback, you can't just remove an anonymous function
      // otherwise
      this.emitRangeSelection = () => this.emitRange();
      this.onRangeInput = (el) => this.update(el.target);
  
      // Setting up the shadow DOM
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    parseValue = v => {
      if (typeof v === 'string') {
        v = parseFloat(v);
      } else if (isNaN(v) || v === null) {
        v = 0;
      }
      return this.floatValue ? parseFloat(v.toFixed(this.precision)) : parseInt(v);
    }

    get sliderId() {
      return this.getAttribute('id');
    }
  
    get minRange() {
      const val = parseInt(this.getAttribute('min-range') ?? this.getAttribute('min'));
      if (isNaN(val)) {
        return 1;
      }
     return val;
    }
    set minRange(minimumRange) {
      this.setAttribute('min-range', minimumRange);
      this.setAttribute('min', minimumRange);
    }
  
    get maxRange() {
      const val = parseInt(this.getAttribute('max-range') ?? this.getAttribute('max'));
      if (isNaN(val)) {
        return 1;
      }
      return val;
    }
    set maxRange(maximumRange) {
      this.setAttribute('max-range', maximumRange);
      this.setAttribute('max', maximumRange);
    }
  
    get presetMin() {
      return this.parseValue(this.getAttribute('preset-min')) || 0;
    }
    set presetMin(presetMinVal) {
      this.setAttribute('preset-min', this.parseValue(presetMinVal));
    }
  
    get presetMax() {
      return this.parseValue(this.getAttribute('preset-max')) || 0;
    }
    set presetMax(presetMaxVal) {
      this.setAttribute('preset-max', this.parseValue(presetMaxVal));
    }
  
    get numberOfLegendItemsToShow() {
      // If the consumer has specified the number of items to show and the number is at least 2
      // then we return that number, else we return 2 as there always needs to be at least 2
      const numOfLegendItems = parseInt(
        this.getAttribute('number-of-legend-items-to-show')
      );
      return numOfLegendItems && numOfLegendItems > 1 ? numOfLegendItems : 2;
    }
  
    get hideLegend() {
      return this.hasAttribute('hide-legend');
    }
  
    get hideLabel() {
      return this.hasAttribute('hide-label');
    }
  
    get inputsForLabels() {
      return this.hasAttribute('inputs-for-labels');
    }
  
    get sliderColor() {
      return this.getAttribute('slider-color');
    }
  
    get circleColor() {
      return this.getAttribute('circle-color');
    }
  
    get circleBorderColor() {
      // Altering the circle border color only
      return this.getAttribute('circle-border-color');
    }
  
    get circleFocusBorderColor() {
      // Altering the circle focus border color only
      return this.getAttribute('circle-focus-border-color');
    }
  
    get circleBorder() {
      // Altering the whole border
      return this.getAttribute('circle-border');
    }
  
    get circleFocusBorder() {
      // Altering the whole focus border
      return this.getAttribute('circle-focus-border');
    }
  
    get circleSize() {
      return this.getAttribute('circle-size');
    }
  
    get labelAfterContent() {
      // CSS ::after
      return this.getAttribute('label-after');
    }
  
    get labelBeforeContent() {
      // CSS ::before
      return this.getAttribute('label-before');
    }
  
    get labelFontWeight() {
      return this.getAttribute('label-font-weight');
    }
  
    get labelFontSize() {
      return this.getAttribute('label-font-size');
    }
  
    get eventNameToEmitOnChange() {
      return (
        this.getAttribute('event-name-to-emit-on-change') ||
        constants.CUSTOM_EVENT_TO_EMIT_NAME
      );
    }

    get floatValue() {
        return this.getAttribute('float-value') ?? false;
    }
    get precision() {
        return this.getAttribute('float-precision') ?? 1;
    }
  
    static get observedAttributes() {
      return [
        'min-label',
        'max-label',
        'min-range',
        'max-range',
        'min',
        'max',
        'preset-min',
        'preset-max',
      ];
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      switch (name) {
        case 'min-label':
          if (!newValue) {
            return;
          }
  
          const minLabel = this.getEl(constants.MIN_LABEL_ID);
          if (!minLabel) {
            return;
          }
  
          minLabel.innerText = newValue;
          break;
        case 'max-label':
          if (!newValue) {
            return;
          }
  
          const maxLabel = this.getEl(constants.MAX_LABEL_ID);
          if (!maxLabel) {
            return;
          }
  
          maxLabel.innerText = newValue;
          break;
        case 'min-range':
        case 'min':
          if (isNaN(newValue) || oldValue === newValue) {
            return;
          }
  
          this.minRange = newValue;
          break;
        case 'max-range':
        case 'max':
          if (isNaN(newValue) || oldValue === newValue) {
            return;
          }
  
          this.maxRange = newValue;
          break;
        case 'preset-min':
          if (isNaN(newValue) || oldValue === newValue) {
            return;
          }
  
          this.presetMin = newValue;
          break;
        case 'preset-max':
          if (isNaN(newValue) || oldValue === newValue) {
            return;
          }
  
          this.presetMax = newValue;
          break;
      }
  
      this.init();
    }
  
    connectedCallback() {
      this.init();
  
      const resizeObserver = new ResizeObserver(this.onResize(this));
      resizeObserver.observe(this.shadowRoot.querySelector('.min-max-slider'));
    }
  
    disconnectedCallback() {
      // Removing event listeners
      const slider = this.getEl(constants.SLIDER_ID);
  
      const min = slider.querySelector(`#${constants.MIN}`);
      this.removeEventListeners(
        min,
        constants.RANGE_STOPPED_EVENTS,
        this.emitRangeSelection,
        false
      );
      this.removeEventListeners(min, ['input'], this.onRangeInput, false);
  
      const max = slider.querySelector(`#${constants.MAX}`);
      this.removeEventListeners(
        max,
        constants.RANGE_STOPPED_EVENTS,
        this.emitRangeSelection,
        false
      );
      this.removeEventListeners(max, ['input'], this.onRangeInput, false);
  
      if (this.inputsForLabels) {
        const lower = slider.querySelector(
          `[${constants.RANGE_INPUT_DATA_LABEL_MIN}]`
        );
        const upper = slider.querySelector(
          `[${constants.RANGE_INPUT_DATA_LABEL_MAX}]`
        );
  
        this.removeEventListeners(lower, ['input'], this.onRangeInput, false);
  
        this.removeEventListeners(upper, ['input'], this.onRangeInput, false);
  
        this.removeEventListeners(
          lower,
          ['blur'],
          this.emitRangeSelection,
          false
        );
  
        this.removeEventListeners(
          upper,
          ['blur'],
          this.emitRangeSelection,
          false
        );
  
        // TODO Max P: reset-range event
      }
    }
  
    dispatchCustomEvent(el, event) {
      const objToDispatchFrom = el ? el : window;
      objToDispatchFrom.dispatchEvent(event);
    }
  
    // Helper method to add event listeners for multiple events
    addMultipleEventListeners(element, events, handler) {
      events.forEach((e) => element.addEventListener(e, handler));
    }
  
    // Helper method to remove listeners for multiple events
    removeEventListeners(element, events, callBack, useCapture) {
      events.forEach((event) => {
        element.removeEventListener(event, callBack, useCapture);
      });
    }
  
    getAverage(min, max) {
      return this.parseValue((min + max) / 2);
    }
  
    getEl(id) {
      return this.shadowRoot.getElementById(id);
    }
  
    // Setting the initial state of the application
    init() {
      const slider = this.getEl(constants.SLIDER_ID);
  
      this.setInitialSliderState(slider);
      this.setupStyles();
  
      const min = slider.querySelector(`#${constants.MIN}`);
      const max = slider.querySelector(`#${constants.MAX}`);
  
      this.setupPresetValues(min, max);
  
      this.createLabels(slider, min);
      this.createLegend(slider);
  
      this.draw(
        slider,
        this.getAverage(
          this.presetMin ?? this.minRange,
          this.presetMax ?? this.maxRange
        )
      );
  
      // Adding update event that updates the range selector
      min.addEventListener('input', this.onRangeInput);
      max.addEventListener('input', this.onRangeInput);
  
      // Adding events when the user stops selecting a range
      // this is then used to emit the events to whoever is
      // consuming this component. If you did it in the `update`
      // function it would be called hundreds of times, this allows
      // us to only call it when the input has stopped.
      this.addMultipleEventListeners(
        min,
        constants.RANGE_STOPPED_EVENTS,
        this.emitRangeSelection
      );
      this.addMultipleEventListeners(
        max,
        constants.RANGE_STOPPED_EVENTS,
        this.emitRangeSelection
      );
  
      this.setupResetFunctionality();
    }
  
    // We are using currying because the `ResizeObserver` will call whatever
    // function you pass into it passing an `entries` object and if you need
    // to access `this` then you need to pass that into the function as well
    onResize(localThis) {
      return function (entries) {
        const slider = entries[0].target;
        localThis.update(slider.querySelector('.range-input'));
      };
    }
  
    // Sets the initial inner HTML of the slider. This is necessary because the init()
    // function appends other elements downstream and if we don't reset it then things
    // will end up getting duplicated
    setInitialSliderState(slider) {
      const precision = this.floatValue ? (1 / Math.pow(10, this.precision)) : 1;
      slider.innerHTML = `
        <label id="${constants.MIN_LABEL_ID}" for="${constants.MIN}">Minimum</label>
        <input id="${constants.MIN}" class="range-input" name="${constants.MIN}" type="range" step="${precision}" />
        <label id="${constants.MAX_LABEL_ID}" for="${constants.MAX}">Maximum</label>
        <input id="${constants.MAX}" class="range-input" name="${constants.MAX}" type="range" step="${precision}" />
      `;
    }
  
    // If presetMin or presetMax are set then we use those preset values
    // else we use the min & max ranges
    setupPresetValues(min, max) {
      const minValue =
        this.presetMin < this.presetMax
          ? this.presetMin
          : this.minRange;
  
      const maxValue =
        this.presetMax > this.presetMin
          ? this.presetMax
          : this.maxRange;
  
      min.setAttribute('data-value', minValue);
      max.setAttribute('data-value', maxValue);
  
      min.value = minValue;
      max.value = maxValue;
    }
  
    // Adding event listener to reset the slider to it's initial state
    // whenever the `range-reset` event is emitted. If the user provides a
    // sliderId then it will only reset that specific slider, else it will
    // reset *all* sliders
    setupResetFunctionality() {
      window.addEventListener('range-reset', (event) => {
        if (
          !event.detail ||
          !event.detail.sliderId ||
          event.detail.sliderId === this.sliderId
        ) {
          // The user has not provided a sliderId so we reset *every* slider
          // on the page, OR they *have* provided a sliderId so we are only
          // resetting that specific slider
          this.init();
        }
      });
    }
  
    // Emits new custom event for min-range-changed or max-range-changed so
    // that the consumer of this component can do whatever they need when
    // the values are changed
    emitRange() {
      const slider = this.getEl(constants.SLIDER_ID);
      const min = slider.querySelector(`#${constants.MIN}`);
      const max = slider.querySelector(`#${constants.MAX}`);
  
      const event = new Event(this.eventNameToEmitOnChange, {
          bubbles: true,
        composed: true
      });
      event.detail = {
            sliderId: this.sliderId,
            minRangeValue: this.parseValue(min.getAttribute('data-value')),
            maxRangeValue: this.parseValue(max.getAttribute('data-value')),
      };
      this.dispatchCustomEvent(
        slider,
        event
      );
    }
  
    draw(slider, splitValue) {
      const min = slider.querySelector(`#${constants.MIN}`);
      min.setAttribute(constants.MIN, this.minRange);
      min.setAttribute(constants.MAX, splitValue);
  
      const max = slider.querySelector(`#${constants.MAX}`);
      max.setAttribute(constants.MIN, splitValue);
      max.setAttribute(constants.MAX, this.maxRange);
  
      const rangeWidth = slider.offsetWidth;
      const thumbSize = cssHelpers.sliderCircleSize;
  
      min.style.width = `${this.parseValue(
        thumbSize +
          ((splitValue - this.minRange) / (this.maxRange - this.minRange)) *
            (rangeWidth - 2 * thumbSize)
      )}px`;
      max.style.width = `${this.parseValue(
        thumbSize +
          ((this.maxRange - splitValue) / (this.maxRange - this.minRange)) *
            (rangeWidth - 2 * thumbSize)
      )}px`;
      min.style.left = '0px';
      max.style.left = `${this.parseValue(min.style.width)}px`;
  
      const lower = slider.querySelector('.lower');
  
      let sliderHeight = min.offsetHeight;
      if (!this.hideLabel) {
        const offsetHeight = this.inputsForLabels
          ? lower.offsetHeight + 5
          : lower.offsetHeight;
        min.style.top = `${offsetHeight}px`;
        max.style.top = `${offsetHeight}px`;
  
        sliderHeight += offsetHeight;
      }
  
      if (!this.hideLegend) {
        const legend = slider.querySelector('.legend');
        const offsetHeight = this.inputsForLabels
          ? min.offsetHeight + 5
          : min.offsetHeight;
        legend.style.paddingTop = `${offsetHeight}px`;
  
        sliderHeight += +legend.offsetHeight;
      }
  
      slider.style.height = `${sliderHeight}px`;
  
      max.value = max.getAttribute('data-value');
      min.value = min.getAttribute('data-value');
  
      if (!this.hideLabel) {
        const upper = slider.querySelector('.upper');
  
        if (this.inputsForLabels) {
          lower.value = min.getAttribute('data-value');
          upper.value = max.getAttribute('data-value');
        } else {
          lower.innerHTML = min.getAttribute('data-value');
          upper.innerHTML = max.getAttribute('data-value');
        }
      }
    }
  
    update(el) {
      const slider = el.parentElement;
  
      let minQuerySelector;
      let maxQuerySelector;
      if (
        el.hasAttribute(constants.RANGE_INPUT_DATA_LABEL_MIN) ||
        el.hasAttribute(constants.RANGE_INPUT_DATA_LABEL_MAX)
      ) {
        minQuerySelector = `[${constants.RANGE_INPUT_DATA_LABEL_MIN}]`;
        maxQuerySelector = `[${constants.RANGE_INPUT_DATA_LABEL_MAX}]`;
      } else {
        minQuerySelector = `#${constants.MIN}`;
        maxQuerySelector = `#${constants.MAX}`;
      }
  
      let min = slider.querySelector(minQuerySelector);
      let max = slider.querySelector(maxQuerySelector);
  
      let minValue = this.parseValue(min.value);
      let maxValue = this.parseValue(max.value);

      if (!this.isValidRangeSelection(el, minValue, maxValue)) {
        return;
      }
  
      // Setting the inactive values before drawing
      let minSliderInput = slider.querySelector(`#${constants.MIN}`);
      minSliderInput.setAttribute('data-value', minValue);
  
      let maxSliderInput = slider.querySelector(`#${constants.MAX}`);
      maxSliderInput.setAttribute('data-value', maxValue);
  
      this.draw(slider, this.getAverage(minValue, maxValue));
    }
  
    isValidRangeSelection(el, minValue, maxValue) {
      // Checking if the values are within the acceptable range
      // since the min value should never be more than the maxvalue
      // and the maxValue never less than the minValue.
      // This could occur if the user has inputs enabled and manually
      // types a wrong number into the input. In those cases we ignore
      // it and return until the user has adjusted the params to be valid
      if (this.inputsForLabels) {
        const isMinEl =
          el.hasAttribute(constants.RANGE_INPUT_DATA_LABEL_MIN) ||
          el.getAttribute('id') === constants.MIN;
  
        if (isMinEl) {
          return (minValue) =>
            minValue < this.maxRange && minValue < maxValue;
        } else {
          return (
            maxValue > this.minRange &&
            maxValue <= this.maxRange &&
            maxValue > minValue
          );
        }
      }
  
      // They are using the non-input version, the only way to make the values
      // not valid would be if someone is trying doing something naughty in
      // which case oh well if this component breaks
      return minValue !== maxValue;
    }
  
    setupStyles() {
      // TODO: Max P - this logic should be revisited and made more dynamic
      // TODO: without all of the conditioals for each styleable attribute
      const rangeInputEls = this.shadowRoot.querySelectorAll(   
        '.min-max-slider > .range-input'
      );
  
      rangeInputEls.forEach((el) => {
        if (this.sliderColor) {
          el.style.backgroundImage = `linear-gradient(to bottom, transparent 0%, transparent 35%, ${this.sliderColor} 35%, ${this.sliderColor} 65%, transparent 65%, transparent 100%)`;
        }
  
        if (this.circleColor) {
          el.style.setProperty('--sliderColor', this.circleColor);
        }
  
        if (this.circleBorderColor) {
          el.style.setProperty('--sliderBorderColor', this.circleBorderColor);
        }
  
        if (this.circleFocusBorderColor) {
          el.style.setProperty(
            '--sliderFocusBorderColor',
            this.circleFocusBorderColor
          );
        }
  
        if (this.circleBorder) {
          el.style.setProperty('--sliderCircleBorder', this.circleBorder);
        }
  
        if (this.circleFocusBorder) {
          el.style.setProperty(
            '--sliderCircleFocusBorder',
            this.circleFocusBorder
          );
        }
  
        if (this.circleSize) {
          el.style.setProperty('--sliderCircleSize', this.circleSize);
        }
      });
    }
  
    createLegend(slider) {
      if (this.hideLegend) {
        return;
      }
  
      // Sets the legend values (the numbers below the slider bar
      // this is dynamic and can handle any number of items in the
      // legend, that's why there is a loop in the event you have
      // more than 2 values in the legend
      let legend = document.createElement('div');
      legend.classList.add('legend');
      let legendvalues = [];
  
      for (let i = 0; i < this.numberOfLegendItemsToShow; i++) {
        legendvalues[i] = document.createElement('div');
        const val = Math.round(
          this.minRange +
            (i / (this.numberOfLegendItemsToShow - 1)) *
              (this.maxRange - this.minRange)
        );
        legendvalues[i].appendChild(document.createTextNode(val));
        legend.appendChild(legendvalues[i]);
      }
  
      slider.appendChild(legend);
    }
  
    setupLabelStyles(lower, upper) {
      // Setting up custom CSS styles for labels
      const setPropertyForLabels = (property, value) => {
        lower.style.setProperty(property, value);
        upper.style.setProperty(property, value);
      };
  
      if (this.labelAfterContent) {
        setPropertyForLabels(
          '--labelAfterContent',
          `'${this.labelAfterContent}'`
        );
      }
  
      if (this.labelBeforeContent) {
        setPropertyForLabels(
          '--labelBeforeContent',
          `'${this.labelBeforeContent}'`
        );
      }
  
      if (this.labelFontWeight) {
        setPropertyForLabels('--labelFontWeight', this.labelFontWeight);
      }
  
      if (this.labelFontSize) {
        setPropertyForLabels('--labelFontSize', this.labelFontSize);
      }
    }
  
    createLabels(slider, min) {
      if (this.hideLabel) {
        return;
      }
  
      const labelType = this.inputsForLabels ? 'input' : 'span';
      let lower = document.createElement(labelType);
      let upper = document.createElement(labelType);
  
      // range-input-label & range-span-label's are created here:
      lower.classList.add(`range-${labelType}-label`, 'lower', 'value');
      upper.classList.add(`range-${labelType}-label`, 'upper', 'value');
  
      this.setupLabelStyles(lower, upper);
  
      if (this.inputsForLabels) {
        lower.value = this.minRange;
        upper.value = this.maxRange;
  
        lower.setAttribute('type', 'number');
        lower.setAttribute(constants.MAX, this.minRange);
        lower.setAttribute(constants.MAX, this.maxRange);
        lower.setAttribute(constants.RANGE_INPUT_DATA_LABEL_MIN, '');
  
        upper.setAttribute('type', 'number');
        upper.setAttribute(constants.MIN, this.minRange);
        upper.setAttribute(constants.MAX, this.maxRange);
        upper.setAttribute(constants.RANGE_INPUT_DATA_LABEL_MAX, '');
  
        lower.addEventListener('input', this.onRangeInput);
        upper.addEventListener('input', this.onRangeInput);
  
        lower.addEventListener('blur', this.emitRangeSelection);
        upper.addEventListener('blur', this.emitRangeSelection);
      } else {
        lower.appendChild(document.createTextNode(this.minRange));
        upper.appendChild(document.createTextNode(this.maxRange));
      }
  
      slider.insertBefore(lower, min.previousElementSibling);
      slider.insertBefore(upper, min.previousElementSibling);
  
      // Adding a "-" symbol beyween the range inputs and labels since you cannot do
      // this via CSS pseudo (before/after) selectors on an input element and
      // we already use the pseudo selectors as a customization option for the labels
      let dashIcon = document.createElement('i');
      dashIcon.classList.add('range-input-dash-icon');
      dashIcon.setAttribute('aria-hidden', true);
      dashIcon.innerHTML = '&#65123';
      slider.insertBefore(
        dashIcon,
        min.previousElementSibling.previousElementSibling
      );
    }
  }
  
  window.customElements.define('range-selector', SimpleRange);
  
  // TODO ADD STEP AND MAKE THE STEP HAVE THE ABILITY TO GROW DYNAMICALLY! (TAKE IN A SEPARATE FUNCTION)
  