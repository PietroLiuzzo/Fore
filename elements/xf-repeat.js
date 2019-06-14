import {html, PolymerElement} from '../assets/@polymer/polymer/polymer-element.js';
import {BoundElementMixin} from './BoundElementMixin.js';
import {XfRepeatItem} from './xf-repeat-item.js';
import {XfForm} from './xf-form.js';


/**
 * `xf-repeat`
 * an xformish form for eXist-db
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
export class XfRepeat extends BoundElementMixin(PolymerElement) {
    /*
        static get template() {
            return html`
          <style>
            :host {
              display: block;
            }
            #repeatTmpl{

            }
          </style>
          <template id="repeatTmpl">
            <slot></slot>
          </template>
        `;
        }
    */

    static get properties() {
        return {
            bind: {
                type: String
            },
            template: {
                type: Object
            },
            index: {
                type: Number,
                value: 1
            },
            dataTemplate: {
                type: Array,
                value:[]
            }
        };
    }


    connectedCallback() {
        super.connectedCallback();
        console.log('### xf-repeat connected ', this);
        this._initTemplate();
    }

    init() {
        super.init();
        this._initTemplate();
        this._initializeRepeatItems();
    }

    _initTemplate(){
        // ### there must be a single 'template' child
        this.template = this.firstElementChild;
        console.log('##### template ', this.template);
        if (this.template === null) {
            // console.error('### no template found for this repeat:', this.id);
            //todo: catch this on form element
            this.dispatchEvent(new CustomEvent('no-template-error', {
                composed: true,
                bubbles: true,
                detail: {"message": "no template found for repeat:" + this.id}
            }));
        }
    }

    _initializeRepeatItems(){
        // ### first unroll repeat-items to instanciate the controls
        // ### iterate the 'bind' array as we do not have proxies yet
        const items = Array.from(this.modelItem.bind);
        this.modelItem.bind.forEach(item => {
            // console.log('_unroll binding ', item);
            const index = this.modelItem.bind.indexOf(item);

            // ### create a repeat-item and initialize it
            const repeatItem = new XfRepeatItem();
            const clone = document.importNode(this.template.content, true);
            repeatItem.appendChild(clone);
            this.appendChild(repeatItem);
            repeatItem.index = index;
            repeatItem.modelItem = this.modelItem.bind[index];
            repeatItem.init();
        });

    }

    refresh(){
        const repeatItems = this.querySelectorAll('xf-repeat-item');
        for(let i = 0; i < repeatItems.length; i++){
            const item = repeatItems[i];
            item.refresh();
        }
    }

    appendRepeatItem(){

        const dTmpl = this._getDataTemplate();
        console.log('dataTemplate from repeat ', dTmpl);

        // const modelItem = this.closest('xf-form').resolve(this.bind,this);
        this.modelItem.bind.push(dTmpl);

        // ### create a repeat-item
        const repeatItem = new XfRepeatItem();
        const clone = document.importNode(this.template.content, true);
        repeatItem.appendChild(clone);
        this.appendChild(repeatItem);

        repeatItem.index = this.modelItem.bind.length - 1;
        repeatItem.modelItem = this.modelItem.bind[repeatItem.index];
        repeatItem.init();
    }

/*
    refresh(modelItem) {
        // super.refresh(modelItem);
        console.log('### refresh repeat from ', this.modelItem);

        // this.modelItem.dataTemplate = this.dataTemplate;
        this.modelItem.dataTemplate = this._getDataTemplate();

        // ### remove all repeat-items that might have been there already
        this.querySelectorAll('xf-repeat-item').forEach(item => {
            this.removeChild(item);
        });


        // ### first unroll repeat-items to instanciate the controls
        // ### iterate the 'bind' array as we do not have proxies yet
        this.modelItem.bind.forEach(item => {
            // console.log('_unroll binding ', item);
            const index = this.modelItem.bind.indexOf(item);

            // ### create a repeat-item
            const repeatItem = new XfRepeatItem();
            const clone = document.importNode(this.template.content, true);
            repeatItem.appendChild(clone);
            this.appendChild(repeatItem);

            repeatItem.index = index;
            repeatItem.refresh(this.modelItem);
        });

        document.dispatchEvent(new CustomEvent('repeat-initialized'));

    }
*/

    delete(repeatItem) {
        console.log('repeat delete item ', repeatItem);

        this.removeChild(repeatItem);

        this.dispatchEvent(new CustomEvent('xf-delete', {
            composed: true,
            bubbles: true,
            detail: {'deleteLocation': repeatItem.index, 'deleteItems': repeatItem.modelItem}
        }));

    }

    _getDataTemplate(){
        console.log('##### template found children ', this.template.content.children);

        let tmp = [];
        Array.from(this.template.content.children).forEach(child => {
            console.log('####### child ', child);

            // ### check if boundElement
            // console.log('window.... ',window.BOUND_ELEMENTS);

            // if(this.isBoundComponent(child)){
            if(XfForm.isBoundComponent(child)){
                console.log('######### bound child ', child);
                const bindId = child.getAttribute('bind');
                if(bindId){
                    const newObj = {"id":bindId, "value":""}; // create default object for insertion into repeat
                    tmp.push(newObj);
                }
            }
        });
        return tmp;
    }


    /*
        _unroll() {
            // const bindings = this.proxy.bind;
            const bindings = this.proxy.proxies;

            bindings.forEach(item => {

                console.log('_unroll binding ', item);
                console.log('_unroll binding ', this.proxy.proxies.indexOf(item));

                //todo: add entry to data-modelData
                const index = this.proxy.proxies.indexOf(item);

                // const tmpl = this.firstElementChild;
                // console.log('template for repeat ', tmpl);

                // ### create a repeat-item
                const repeatItem = new XfRepeatItem();
                const clone = document.importNode(this.template.content, true);

                // console.log('clone ', clone);
                // console.log('clone first', clone.firstElementChild);
                // clone.firstElementChild.classList.add('repeat-item');

                // this.appendChild(clone);

                repeatItem.appendChild(clone);
                this.appendChild(repeatItem);
                repeatItem.index = index;
                repeatItem.refresh(item);
            });


        }
    */

    _attachDom(dom) {
        this.appendChild(dom);
    }

}

window.customElements.define('xf-repeat', XfRepeat);
