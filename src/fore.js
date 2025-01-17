export class Fore {
  static READONLY_DEFAULT = false;

  static REQUIRED_DEFAULT = false;

  static RELEVANT_DEFAULT = true;

  static CONSTRAINT_DEFAULT = true;

  static TYPE_DEFAULT = 'xs:string';

  static get ACTION_ELEMENTS() {
    return [
      'FX-ACTION',
      'FX-DELETE',
      'FX-DISPATCH',
      'FX-HIDE',
      'FX-INSERT',
      'FX-LOAD',
      'FX-MESSAGE',
      'FX-REBUILD',
      'FX-RECALCULATE',
      'FX-REFRESH',
      'FX-RENEW',
      'FX-RELOAD',
      'FX-REPLACE',
      'FX-RESET',
      'FX-RETAIN',
      'FX-RETURN',
      'FX-REVALIDATE',
      'FX-SEND',
      'FX-SETFOCUS',
      'FX-SETINDEX',
      'FX-SETVALUE',
      'FX-SHOW',
      'FX-TOGGLE',
      'FX-UPDATE',
    ];
  }

  static createUUID() {
    // http://www.ietf.org/rfc/rfc4122.txt
    const s = [];
    const hexDigits = '0123456789abcdef';
    for (let i = 0; i < 36; i += 1) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-';

    const uuid = s.join('');
    return uuid;
  }

  static get XFORMS_NAMESPACE_URI() {
    // todo: should be centralized somewhere as constant. Exists in several? places
    return 'http://www.w3.org/2002/xforms';
  }

  static isActionElement(elementName) {
    return Fore.ACTION_ELEMENTS.includes(elementName);
  }

  static get UI_ELEMENTS() {
    return [
      'FX-ALERT',
      'FX-CONTROL',
      'FX-DIALOG',
      'FX-FILENAME',
      'FX-MEDIATYPE',
      'FX-GROUP',
      'FX-HINT',
      'FX-ITEMS',
      'FX-OUTPUT',
      'FX-RANGE',
      'FX-REPEAT',
      'FX-REPEATITEM',
      'FX-SWITCH',
      'FX-SECRET',
      'FX-SELECT',
      'FX-SUBMIT',
      'FX-TEXTAREA',
      'FX-TRIGGER',
      'FX-UPLOAD',
      'FX-VAR',
    ];
  }

  static get MODEL_ELEMENTS(){
    return [
      'FX-BIND',
      'FX-FUNCTION',
      'FX-MODEL',
      'FX-INSTANCE',
      'FX-SUBMISSION',
    ];
  }

  static isUiElement(elementName) {
    const found = Fore.UI_ELEMENTS.includes(elementName);
    if (found) {
      // console.log('_isUiElement ', found);
    }
    return Fore.UI_ELEMENTS.includes(elementName);
  }

  /**
   * recursively refreshes all UI Elements.
   *
   * todo: this could probably made more efficient with significant impact on rendering perf
   *
   * @param startElement
   * @param force
   * @returns {Promise<unknown>}
   */
  static async refreshChildren(startElement, force) {
    const refreshed = new Promise(resolve => {
      /*
      if there's an 'refresh-on-view' attribute the element wants to be handled by
      handleIntersect function that calls the refresh of the respective element and
      not the global one.
       */
      // if(!force && startElement.hasAttribute('refresh-on-view')) return;

      /*  ### attempt with querySelectorAll is even slower than iterating recursively

      const children = startElement.querySelectorAll('[ref]');
      Array.from(children).forEach(uiElement => {
        if (Fore.isUiElement(uiElement.nodeName) && typeof uiElement.refresh === 'function') {
          uiElement.refresh();
        }
      });
*/
      const { children } = startElement;
      if (children) {
        Array.from(children).forEach(element => {
          if (element.nodeName.toUpperCase() === 'FX-FORE') {
            resolve('done');
          }
          if (Fore.isUiElement(element.nodeName) && typeof element.refresh === 'function') {
            // console.log('refreshing', element, element?.ref);
            // console.log('refreshing ',element);
            element.refresh(force);
          } else if (element.nodeName.toUpperCase() !== 'FX-MODEL') {
            Fore.refreshChildren(element, force);
          }
        });
      }
      resolve('done');
    });

    return refreshed;
  }

  static copyDom(inputElement){
    console.time('convert');
    const target = new DOMParser().parseFromString('<fx-fore></fx-fore>', 'text/html');
    console.log('copyDom new doc',target);
    console.log('copyDom new body',target.body);
    console.log('copyDom new body',target.querySelector('fx-fore'));
    const newFore = target.querySelector('fx-fore');
    this.convertFromSimple(inputElement,newFore);
    newFore.removeAttribute('convert');
    console.log('converted', newFore);
    return newFore;
    console.timeEnd('convert');
  }
  static convertFromSimple(startElement,targetElement){
    const children = startElement.childNodes;
    if (children) {
      Array.from(children).forEach(node => {
        const lookFor = `FX-${node.nodeName.toUpperCase()}`;
        if (Fore.MODEL_ELEMENTS.includes(lookFor)
            || Fore.UI_ELEMENTS.includes(lookFor)
            || Fore.ACTION_ELEMENTS.includes(lookFor)
        ) {
          const conv = targetElement.ownerDocument.createElement(lookFor);
          console.log('conv', node, conv);
          targetElement.appendChild(conv);
          Fore.copyAttributes(node,conv);
          Fore.convertFromSimple(node,conv);
        } else{

          if(node.nodeType === Node.TEXT_NODE){
            const copied = targetElement.ownerDocument.createTextNode(node.textContent);
            targetElement.appendChild(copied);
          }

          if(node.nodeType === Node.ELEMENT_NODE){
            const copied = targetElement.ownerDocument.createElement(node.nodeName);
            targetElement.appendChild(copied);
            Fore.copyAttributes(node,targetElement);
            Fore.convertFromSimple(node,copied);
          }
        }
      });
    }
  }

  static copyAttributes(source, target) {
    return Array.from(source.attributes).forEach(attribute => {
      target.setAttribute(
          attribute.nodeName,
          attribute.nodeValue,
      );
    });
  }


  /**
   * Alternative to `closest` that respects subcontrol boundaries
   */
  static getClosest(querySelector, start) {
    while (!start.matches(querySelector)) {
      if (start.matches('fx-fore')) {
        // Subform reached. Bail out
        return null;
      }
      start = start.parentNode;
      if (!start) {
        return null;
      }
    }
    return start;
  }

  /**
   * returns the proper content-type for instance.
   *
   * @param instance an fx-instance element
   * @returns {string|null}
   */
  static getContentType(instance, contentType) {
    if (contentType === 'application/x-www-form-urlencoded') {
      return 'application/x-www-form-urlencoded; charset=UTF-8';
    }
    if (instance.type === 'xml') {
      return 'application/xml; charset=UTF-8';
    }
    if (instance.type === 'json') {
      return 'application/json';
    }
    console.warn('content-type unknown ', instance.type);
    return null;
  }

  static fadeInElement(element) {
    const duration = 600;
    let fadeIn = () => {
      // Stop all current animations
      if (element.getAnimations) {
        element.getAnimations().map(anim => anim.finish());
      }

      // Play the animation with the newly specified duration
      fadeIn = element.animate(
        {
          opacity: [0, 1],
        },
        duration,
      );
      return fadeIn.finished;
    };
    return fadeIn();
  }

  static fadeOutElement(element, duration) {
    // const duration = duration;
    let fadeOut = () => {
      // Stop all current animations
      if (element.getAnimations) {
        element.getAnimations().map(anim => anim.finish());
      }

      // Play the animation with the newly specified duration
      fadeOut = element.animate(
        {
          opacity: [1, 0],
        },
        duration,
      );
      return fadeOut.finished;
    };
    return fadeOut();
  }

  static dispatch(target, eventName, detail) {
    const event = new CustomEvent(eventName, {
      composed: false,
      bubbles: true,
      detail,
    });
    console.info('dispatching', event.type, target);
    target.dispatchEvent(event);
  }

  static prettifyXml(source) {
    const xmlDoc = new DOMParser().parseFromString(source, 'application/xml');
    const xsltDoc = new DOMParser().parseFromString(
      [
        // describes how we want to modify the XML - indent everything
        '<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
        '  <xsl:output method="xml" indent="yes" omit-xml-declaration="yes"/>',
        '  <xsl:strip-space elements="*"/>',
        '  <xsl:template match="text()">', // change to just text() to strip space in text nodes
        '    <xsl:value-of select="normalize-space(.)"/>',
        '  </xsl:template>',
        '  <xsl:template match="node()|@*">',
        '    <xsl:copy>',
        '        <xsl:apply-templates select="node()|@*"/>',
        '    </xsl:copy>',
        '  </xsl:template>',
        '</xsl:stylesheet>',
      ].join('\n'),
      'application/xml',
    );


    const xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xsltDoc);
    const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
    const resultXml = new XMLSerializer().serializeToString(resultDoc);
    return resultXml;
  }

  static formatXml (xml) {
    var reg = /(>)(<)(\/*)/g;
    var wsexp = / *(.*) +\n/g;
    var contexp = /(<.+>)(.+\n)/g;
    xml = xml.replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2');
    var pad = 0;
    var formatted = '';
    var lines = xml.split('\n');
    var indent = 0;
    var lastType = 'other';
    // 4 types of tags - single, closing, opening, other (text, doctype, comment) - 4*4 = 16 transitions
    var transitions = {
      'single->single': 0,
      'single->closing': -1,
      'single->opening': 0,
      'single->other': 0,
      'closing->single': 0,
      'closing->closing': -1,
      'closing->opening': 0,
      'closing->other': 0,
      'opening->single': 1,
      'opening->closing': 0,
      'opening->opening': 1,
      'opening->other': 1,
      'other->single': 0,
      'other->closing': -1,
      'other->opening': 0,
      'other->other': 0
    };

    for (var i = 0; i < lines.length; i++) {
      var ln = lines[i];
      var single = Boolean(ln.match(/<.+\/>/)); // is this line a single tag? ex. <br />
      var closing = Boolean(ln.match(/<\/.+>/)); // is this a closing tag? ex. </a>
      var opening = Boolean(ln.match(/<[^!].*>/)); // is this even a tag (that's not <!something>)
      var type = single ? 'single' : closing ? 'closing' : opening ? 'opening' : 'other';
      var fromTo = lastType + '->' + type;
      lastType = type;
      var padding = '';

      indent += transitions[fromTo];
      for (var j = 0; j < indent; j++) {
        padding += '    ';
      }

      formatted += padding + ln + '\n';
    }
  }

  static async loadForeFromUrl(hostElement, url) {
    console.log('########## loading Fore from ', this.src, '##########');
    await fetch(url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'text/html',
      },
    })
      .then(response => {
        const responseContentType = response.headers.get('content-type').toLowerCase();
        console.log('********** responseContentType *********', responseContentType);
        if (responseContentType.startsWith('text/html')) {
          return response.text().then(result =>
            // console.log('xml ********', result);
            new DOMParser().parseFromString(result, 'text/html'),
          );
        }
        return 'done';
      })
      .then(data => {
        // const theFore = fxEvaluateXPathToFirstNode('//fx-fore', data.firstElementChild);
        const theFore = data.querySelector('fx-fore');
        // console.log('thefore', theFore)
        if (!theFore) {
          hostElement.dispatchEvent(
            new CustomEvent('error', {
              composed: false,
              bubbles: true,
              detail: {
                message: 'cyclic graph',
              },
            }),
          );
        }
        hostElement.appendChild(theFore);
        theFore.classList.add('widget');
        // return theFore;
        // theFore.setAttribute('from-src', this.src);
        // this.replaceWith(theFore);
      })
      .catch(error => {
        hostElement.dispatchEvent(
          new CustomEvent('error', {
            composed: false,
            bubbles: true,
            detail: {
              error: error,
              message: `'${url}' not found or does not contain Fore element.`,
            },
          }),
        );
      });
  }

  /**
   * clear all text nodes and attribute values to get a 'clean' template.
   * @param n
   * @private
   */
  /*
    static clear(n) {
      n.textContent = '';
      if (n.hasAttributes()) {
        const attrs = n.attributes;
        for (let i = 0; i < attrs.length; i+= 1) {
          attrs[i].value = '';
        }
      }
      const { children } = n;
      for (let i = 0; i < children.length; i+= 1) {
        Fore.clear(children[i]);
      }
    }
  */
}
