// import {html, css, LitElement} from "lit-element";
import "./fx-repeatitem.js";
import * as fx from "fontoxpath";

import {FxContainer} from "./fx-container.js";

import {Fore} from "../fore";
import {foreElementMixin} from "../ForeElementMixin";

/**
 * `fx-repeat`
 * an xformish form for eXist-db
 *
 * @customElement
 * @demo demo/index.html
 */
export class FxRepeat extends foreElementMixin(HTMLElement) {

    static get styles() {
        return css`
            :host {
              display: block;
            }
        `;
    }

    static get properties() {
        return {
            ... super.properties,
            index:{
                type: Number
            },
            ref: {
                type: String
            },
            template: {
                type: Object
            },
            focusOnCreate: {
                type: String
            },
            initDone: {
                type: Boolean
            },
            repeatIndex:{
                type: Number
            },
            nodeset:{
                type: Array
            }
        };
    }

    constructor() {
        super();
        this.ref = '';
        this.dataTemplate = [];
        this.focusOnCreate = '';
        this.initDone = false;
        this.repeatIndex = 1;
        this.nodeset = [];
        this.inited = false;
        this.index = 1;
        this.repeatSize = 0;

        this.attachShadow({mode:'open'});

        // this.template = this.firstElementChild;
        // this.addEventListener('repeatitem-created', this._refreshItem)

    }

    get repeatSize(){
        return this.querySelectorAll('fx-repeatitem').length;
    }

    set repeatSize(size){
        this.size = size;
    }

    render() {
        return html`
            <slot></slot>
        `;
    }


    setIndex(index){
        // console.log('new repeat index ', index);
        this.index=index;
        const rItems = this.querySelectorAll('fx-repeatitem');
        this._setIndex(rItems[this.index-1]);
    }

    connectedCallback() {
        this.ref=this.getAttribute('ref');


        console.log('### fx-repeat connected ', this.id);
        // super.connectedCallback();
        this.addEventListener('index-changed', e => {
           this.index = e.detail.index;
           const rItems = this.querySelectorAll('fx-repeatitem');
           this._setIndex(rItems[this.index-1]);
        });

        const style = `
            :host {
                display: none;
            }
            ::slotted(*){
                display:none;
            }
        `;

        const html = `
          <slot></slot>
        `;
        this.shadowRoot.innerHTML = `
            <style>
                ${style}
            </style>
            ${html}
        `;


        /*
                console.log('owerform of repeat ', this.getOwnerForm(this));
                this.addEventListener('model-construct-done', () => {
                    this.init();
                });
        */


    }

    firstUpdated(){
        console.log('firstupdated ', this);
        const slot = this.shadowRoot.querySelector('slot');
        slot.addEventListener('slotchange', (event) => {
            console.log('slotchange on repeat ', this.id);
            // Fore.refreshChildren(this);
        });

    }


    init() {
        // ### there must be a single 'template' child
        console.log('##### repeat init ',this.id);
        // if(!this.inited) this.init();
        // does not use this.evalInContext as it is expecting a nodeset instead of single node
        this._evalNodeset();
        console.log('##### ',this.id, this.nodeset);

        this._initTemplate();
        this._initRepeatItems();

        this.setAttribute('index',this.index);

        this.inited = true;
        // this.requestUpdate();
    }

    /**
     * repeat has no own modelItems
     * @private
     */
    _evalNodeset(){
        const inscope = this._inScopeContext();
        // console.log('##### inscope ', inscope);
        // console.log('##### ref ', this.ref);
        this.nodeset = fx.evaluateXPathToNodes(this.ref, inscope, null, {});
    }

    /**
     * repeat has no own modelItems
     * @private
     */
/*
    _refresh(){
        console.log('repeat refresh ');
        // await this.updateComplete;
        const inscope = this._inScopeContext();
        this.nodeset = fx.evaluateXPathToNodes(this.ref, inscope, null, {});
        console.log('repeat refresh nodeset ', this.nodeset);


        const rItems = this.querySelectorAll('fx-repeatitem');


        // this._initRepeatItems();
        Fore.refreshChildren(this);
        this.requestUpdate();
    }
*/

    async refresh() {
        console.group('fx-repeat.refresh on', this.id);


        this.addEventListener('slotchange',(e) =>{
            console.log('slotChanged in refresh awaited ',e);

            
        });


        if(!this.inited) this.init();

        const inscope = this._inScopeContext();
        this.nodeset = fx.evaluateXPathToNodes(this.ref, inscope, null, {});
        console.log('repeat refresh nodeset ', this.nodeset);

        let repeatItems = this.querySelectorAll(':scope > fx-repeatitem');
        // let repeatItems = this.shadowRoot.children;
        const repeatItemCount = repeatItems.length;

        let nodeCount = 1;
        if(Array.isArray(this.nodeset)){
            nodeCount = this.nodeset.length;
        }

        // const contextSize = this.nodeset.length;
        const contextSize = nodeCount;
        const modified = [];
        if (contextSize < repeatItemCount){

            for(let position = repeatItemCount; position > contextSize; position--){
                //remove repeatitem
                const itemToRemove = repeatItems[position -1];
                itemToRemove.parentNode.removeChild(itemToRemove);
                // modified.push(itemToRemove);
            }

            //todo: update index
        }

        if(contextSize > repeatItemCount){

            for(let position = repeatItemCount +1; position <= contextSize; position++){
                //add new repeatitem

                // const lastRepeatItem = repeatItems[repeatItemCount-1];
                // const newItem = lastRepeatItem.cloneNode(true);


                const newItem = document.createElement('fx-repeatitem');
                const clonedTemplate = this._clone();
                newItem.appendChild(clonedTemplate);

                // const tmpl = this.shadowRoot.querySelector('template');
                // const newItem = tmpl.content.cloneNode(true);

                newItem.nodeset = this.nodeset[position-1];
                newItem.index = position;
                this.appendChild(newItem);
                modified.push(newItem);

            }


        }
        if(modified.length > 0){
            modified.forEach(mod => {
                mod.refresh();
            })
        }

        if(!this.inited){
            Fore.refreshChildren(this);
        }

        if(contextSize === repeatItemCount){
            Fore.refreshChildren(this);
        }
        // Fore.refreshChildren(this);
        console.groupEnd();
    }


    _initTemplate() {
        // ### there must be a single 'template' child
        // if(this.inited) return ;
        // if(this.template) return this.template;


        const shadowTemplate = this.shadowRoot.querySelector('template');
        console.log('shadowtempl ', shadowTemplate);

        const defaultSlot = this.shadowRoot.querySelector('slot');
        const template =  defaultSlot.assignedElements({flatten: true})[0];
        this.template = this.firstElementChild;
        console.log('### init template for repeat ', this.id , this.template);

        if (this.template === null) {
            // console.error('### no template found for this repeat:', this.id);
            //todo: catch this on form element
            this.dispatchEvent(new CustomEvent('no-template-error', {
                composed: true,
                bubbles: true,
                detail: {"message": "no template found for repeat:" + this.id}
            }));
        }

        this.shadowRoot.appendChild(this.template)
    }


/* 
    refresh() {
        console.group('fx-repeat.refresh');
        if(!this.inited) this.init();
        // this.nodeset = this.evalBinding();
        // this.nodeset = fx.evaluateXPathToNodes(this.ref, this.model.getDefaultInstance().getDefaultContext(), null, {});
        // this._evalNodeset();


        console.log('REPEAT.refresh nodeset ', this.nodeset);
        // this.requestUpdate();
        //create n repeat-items for nodeset

        //todo: obviously buggy - just works initially but then for each refresh will create new items - to be fixed


        // this._refreshChildren(repeatItems);

        this.requestUpdate();
        console.groupEnd();
    }

 */
/*
    _refreshChildren(repeatItems){
        if(repeatItems){
            repeatItems = this.querySelectorAll('fx-repeatitem');
            repeatItems.forEach(bound => {
                bound.refresh();
            });
        }
    }
*/

    _refreshItem(e){
        if(!this.inited) return;
        e.detail.item.refresh();
    }


    _initRepeatItems() {
        const model = this.getModel();

        // this.nodeset = fx.evaluateXPathToNodes(this.ref, model.getDefaultInstance().getDefaultContext(), null, {});
        // console.log('repeat nodeset ', this.nodeset);

        // const repeatItems = this.querySelectorAll('fx-repeatitem');
        // Array.from(repeatItems).forEach(item => item.init(this.getModel()));
        //setting index to first

        // this.itemTemplates = [];

        this.textContent = '';

        // console.log('repeat ref ', this.ref);
        // console.log('repeat modelItems ', this.model.modelItems);
        // const modelItems = this.model.modelItems.filter(m => m.ref === this.ref);
        // console.log('repeat modelItems ', modelItems);

        this.nodeset.forEach((item, index) => {

            // console.log('initRepeatItem index ', index);
            // const repeatItem = new XfRepeatitem(); //no idea why this is not working

            const repeatItem = document.createElement('fx-repeatitem');

            // console.log('initRepeatItem nodeset ',this.nodeset[index]);
            repeatItem.nodeset = this.nodeset[index];
            repeatItem.index = index +1; //1-based index

            const clone = this._clone();
            // const content = this.template.content.cloneNode(true);
            // const clone = document.importNode(content, true);

            // console.log('clone ', clone);
            repeatItem.appendChild(clone);
            // this.itemTemplates.push(html`repeatItem`);
            this.appendChild(repeatItem);
            if(repeatItem.index === 1){
                this._setIndex(repeatItem);
            }
        });


    }

    _clone() {
        // const content = this.template.content.cloneNode(true);
        this.template = this.shadowRoot.querySelector('template');
        const content = this.template.content.cloneNode(true);
        return document.importNode(content, true);
    }


    _setIndex(repeatItem){
        this._removeIndexMarker();
        if(repeatItem){
            repeatItem.setAttribute('repeat-index','');
        }
    }

    _removeIndexMarker() {
        Array.from(this.children).forEach( item => {
            item.removeAttribute('repeat-index');
        });
    }

/*
    createRenderRoot() {
        return this;
    }
*/
}

window.customElements.define('fx-repeat', FxRepeat);
