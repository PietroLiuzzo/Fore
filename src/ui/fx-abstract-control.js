import { LitElement, html, css } from 'lit-element';

import '../fx-model.js';
import { foreElementMixin } from '../ForeElementMixin.js';
import { ModelItem } from '../modelitem.js';

/**
 * `fx-abstract-control` -
 * is a general class for control elements.
 *
 *
 * todo: remove LitElement dependency
 */
export default class FxAbstractControl extends foreElementMixin(LitElement) {
  static get properties() {
    return {
      ...super.properties,
      value: {
        type: String,
      },
      control: {
        type: Object,
      },
    };
  }

  constructor() {
    super();
    this.value = '';
    this.display = this.style.display;
  }

  /**
   * (re)apply all state properties to this control.
   */
  async refresh() {
    console.log('### FxAbstractControl.refresh on : ', this);

    const currentVal = this.value;

    // if(this.repeated) return ;
    if (this.isNotBound()) return;

    await this.updateComplete;
    this.evalInContext();

    if (this.isBound()) {
      // this.control = this.querySelector('#control');

      if (this.nodeset === null) {
        this.style.display = 'none';
        return;
      }

      this.modelItem = this.getModelItem();

      if (this.modelItem instanceof ModelItem) {
        // console.log('### XfAbstractControl.refresh modelItem : ', this.modelItem);

        this.value = this.modelItem.value;
        // console.log('>>>>>>>> abstract refresh ', this.control);
        // this.control[this.valueProp] = this.value;
        await this.updateControlValue();

        // if(!this.closest('fx-form').ready) return; // state change event do not fire during init phase (initial refresh)
        // if(!this._getForm().ready) return; // state change event do not fire during init phase (initial refresh)
        if (currentVal !== this.value) {
          this.dispatchEvent(new CustomEvent('value-changed', {}));
        }
        // this.requestUpdate();
        this.handleModelItemProperties();
      }
    }
    // await this.updateComplete;
  }

  async updateControlValue() {
    // this.control[this.valueProp] = this.value;
    if (this.valueProp === 'checked') {
      if (this.value === 'true') {
        this.control.checked = true;
      } else {
        this.control.checked = false;
      }
    } else {
      let control = this.control;
      if (!control) {
        control = this;
      }
      control['value'] = this.value;
      // control.value = this.value;
    }
  }

  get control() {
    return this.getControl();
  }

  getControl() {
    return this;
  }

  set control(control) {
    this.control = control;
  }

  handleModelItemProperties() {
    this.handleRequired();
    this.handleReadonly();
    this.handleValid();
    this.handleRelevant();
  }

  _getForm() {
    return this.getModel().parentNode;
  }

  handleRequired() {
    // console.log('mip required', this.modelItem.required);
    // const control = this.querySelector('#control');
    if (this.isRequired() !== this.modelItem.required) {
      if (this.modelItem.required) {
        this.control.setAttribute('required', 'required');
        // this.shadowRoot.getElementById('control').setAttribute('required','required');
        // this.control.setAttribute('required','required');
        // this.required = true;
        // this.setAttribute('required','required');

        this.classList.toggle('required');
        this.dispatchEvent(new CustomEvent('required', {}));
      } else {
        this.control.removeAttribute('required');
        this.required = false;
        // this.removeAttribute('required');
        this.classList.toggle('required');

        this.dispatchEvent(new CustomEvent('optional', {}));
      }
    }
  }

  handleReadonly() {
    // console.log('mip readonly', this.modelItem.isReadonly);
    if (this.isReadonly() !== this.modelItem.readonly) {
      if (this.modelItem.readonly) {
        this.control.setAttribute('readonly', 'readonly');
        // this.setAttribute('readonly','readonly');
        this.classList.toggle('readonly');
        this.dispatchEvent(new CustomEvent('readonly', {}));
      }
      if (!this.modelItem.readonly) {
        this.control.removeAttribute('readonly');
        // this.removeAttribute('readonly');
        this.classList.toggle('readonly');

        this.dispatchEvent(new CustomEvent('readwrite', {}));
      }
    }
  }

  handleValid() {
    // console.log('mip valid', this.modelItem.required);

    const alert = this.querySelector('fx-alert');
    if (alert) {
      alert.style.display = 'none';
    }

    if (this.isValid() !== this.modelItem.valid) {
      if (this.modelItem.valid) {
        this.dispatchEvent(new CustomEvent('valid', {}));
      } else {
        if (this.modelItem.alerts.length !== 0) {
          const alert = this.querySelector('fx-alert');
          if (alert) {
            alert.style.display = 'block';
          } else {
            const alerts = this.modelItem.alerts;
            console.log('alerts from bind: ', alerts);
            alerts.forEach(alert => {
              const newAlert = document.createElement('fx-alert');
              newAlert.innerHTML = alert;
              this.appendChild(newAlert);
              newAlert.style.display = 'block';
            });
          }
        }

        this.dispatchEvent(new CustomEvent('invalid', {}));
      }
    }
  }

  handleRelevant() {
    // console.log('mip valid', this.modelItem.enabled);
    if (this.isEnabled() !== this.modelItem.relevant) {
      if (this.modelItem.relevant) {
        this.dispatchEvent(new CustomEvent('relevant', {}));
        this._fadeIn(this, this.display);
      } else {
        this.dispatchEvent(new CustomEvent('nonrelevant', {}));
        this._fadeOut(this);
      }
    }
  }

  /*
    setValue(node, newVal) {

        const m = this.getModelItem();
        m.value =
        // m.setNodeValue(newVal);

        if (node.nodeType === node.ATTRIBUTE_NODE) {
            node.nodeValue = newVal;
        } else {
            node.textContent = newVal;
        }

    }
*/

  /*
    getValue() {
        // console.log('getValue nodeset ', this.nodeset);
        if (this.nodeset.nodeType === Node.ELEMENT_NODE) {
            return this.nodeset.textContent;
        }
        return this.nodeset;
        // return this.getModelItem().modelItem.value;
    }
*/

  getControlValue() {}

  isRequired() {
    // if(this.control.required){
    // console.log('isRequired',this);
    // this.control = this.shadowRoot.querySelector('#control');
    if (!this.control) {
      this.control = this.shadowRoot.getElementById('control');
    }
    if (!this.control) return false;
    if (this.control.hasAttribute('required')) {
      return true;
    }
    return false;
  }

  isValid() {
    const control = this.getControl();
    if (control.valid) {
      return true;
    }
    return false;
  }

  isReadonly() {
    // const control = this.querySelector('#control');
    if (this.control.hasAttribute('readonly')) {
      return true;
    }
    return false;
  }

  isEnabled() {
    // if(this.style.display === 'none' || this.classList.contains('non-relevant')){
    if (this.style.display === 'none') {
      return false;
    }
    return true;
  }

  _fadeOut(el) {
    el.style.opacity = 1;

    (function fade() {
      if ((el.style.opacity -= 0.1) < 0) {
        el.style.display = 'none';
      } else {
        requestAnimationFrame(fade);
      }
    })();
  }

  _fadeIn(el, display) {
    el.style.opacity = 0;
    el.style.display = display || 'block';

    (function fade() {
      var val = parseFloat(el.style.opacity);
      if (!((val += 0.1) > 1)) {
        el.style.opacity = val;
        requestAnimationFrame(fade);
      }
    })();
  }
}

window.customElements.define('fx-abstract-control', FxAbstractControl);
