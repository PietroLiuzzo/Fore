import {
    getBucketsForNode as e,
    evaluateXPath as t,
    registerCustomXPathFunction as s,
    registerXQueryModule as n,
    evaluateXPathToNodes as i,
    evaluateXPathToBoolean as o,
    evaluateXPathToFirstNode as r,
    evaluateXPathToString as a,
    evaluateXPathToNumber as l,
    parseScript as d,
    evaluateXPathToStrings as h
} from "fontoxpath";
import "@jinntec/jinn-toast";
import {css as c, html as u} from "lit-element";

class p {
    constructor(e) {
        this._onNodeTouched = e
    }

    getAllAttributes(e) {
        return Array.from(e.attributes)
    }

    getAttribute(e, t) {
        return e.getAttribute(t)
    }

    getChildNodes(t, s) {
        return Array.from(t.childNodes).filter(t => !s || e(t).includes(s))
    }

    getData(e) {
        return e.nodeType === Node.ATTRIBUTE_NODE ? (this._onNodeTouched(e), e.value) : (this._onNodeTouched(e.parentNode), e.data)
    }

    getFirstChild(t, s) {
        const n = Array.from(this.getChildNodes()).filter(t => !s || e(t).includes(s))[0];
        return n || null
    }

    getLastChild(t, s) {
        const n = t.getChildNodes().filter(t => !s || e(t).includes(s)), i = n[n.length - 1];
        return i || null
    }

    getNextSibling(t, s) {
        for (let {nextSibling: n} = t; n; n = n.nextSibling) if (e(n).includes(s)) return n;
        return null
    }

    getParentNode(e) {
        return e.parentNode
    }

    getPreviousSibling(t, s) {
        for (let {previousSibling: n} = t; n; n = n.previousSibling) if (e(n).includes(s)) return n;
        return null
    }
}

class m {
    static isAbsolutePath(e) {
        return null != e && (e.startsWith("/") || e.startsWith("instance("))
    }

    static isRepeated(e) {
        return e.parentElement.closest("fx-repeatitem")
    }

    static isSelfReference(e) {
        return "." === e || "./text()" === e || "text()" === e || "" === e || null === e
    }

    static getInstanceId(e) {
        if (!e) return "default";
        if (e.startsWith("instance(")) {
            const t = e.substring(e.indexOf("(") + 1);
            return t.substring(1, t.indexOf(")") - 1)
        }
        return "default"
    }

    static getPath(e) {
        const s = t("path()", e), n = e.ownerDocument.firstElementChild.getAttribute("id");
        return null !== n && "default" !== n ? `#${n}${m.shortenPath(s)}` : m.shortenPath(s)
    }

    static shortenPath(e) {
        const t = e.split("/");
        let s = "";
        for (let e = 2; e < t.length; e += 1) {
            const n = t[e];
            if (-1 !== n.indexOf("{}")) {
                s += "/" + n.split("{}")[1]
            } else s += "/" + n
        }
        return s
    }
}

function g(e, t, s, n) {
    const i = {};
    return function (o) {
        if (i[o]) return;
        const r = {}, a = [], l = [];
        for (l.push({node: o, processed: !1}); l.length > 0;) {
            const o = l[l.length - 1], {processed: d} = o, {node: h} = o;
            if (d) l.pop(), a.pop(), r[h] = !1, i[h] = !0, t && 0 !== e[h].length || s.push(h); else {
                if (i[h]) {
                    l.pop();
                    continue
                }
                if (r[h]) {
                    if (n) {
                        l.pop();
                        continue
                    }
                    a.push(h), window.dispatchEvent(new CustomEvent("compute-exception", {
                        composed: !0,
                        bubbles: !0,
                        detail: {path: a, message: "cyclic graph"}
                    }))
                }
                r[h] = !0, a.push(h);
                const t = e[h];
                for (let e = t.length - 1; e >= 0; e -= 1) l.push({node: t[e], processed: !1});
                o.processed = !0
            }
        }
    }
}

function f(e) {
    this.nodes = {}, this.outgoingEdges = {}, this.incomingEdges = {}, this.circular = e && !!e.circular
}

f.prototype = {
    size() {
        return Object.keys(this.nodes).length
    }, addNode(e, t) {
        this.hasNode(e) || (this.nodes[e] = 2 === arguments.length ? t : e, this.outgoingEdges[e] = [], this.incomingEdges[e] = [])
    }, removeNode(e) {
        this.hasNode(e) && (delete this.nodes[e], delete this.outgoingEdges[e], delete this.incomingEdges[e], [this.incomingEdges, this.outgoingEdges].forEach(t => {
            Object.keys(t).forEach(s => {
                const n = t[s].indexOf(e);
                n >= 0 && t[s].splice(n, 1)
            }, this)
        }))
    }, hasNode(e) {
        return Object.prototype.hasOwnProperty.call(this.nodes, e)
    }, getNodeData(e) {
        if (this.hasNode(e)) return this.nodes[e];
        throw new Error("Node does not exist: " + e)
    }, setNodeData(e, t) {
        if (!this.hasNode(e)) throw new Error("Node does not exist: " + e);
        this.nodes[e] = t
    }, addDependency(e, t) {
        if (!this.hasNode(e)) throw new Error("Node does not exist: " + e);
        if (!this.hasNode(t)) throw new Error("Node does not exist: " + t);
        return -1 === this.outgoingEdges[e].indexOf(t) && this.outgoingEdges[e].push(t), -1 === this.incomingEdges[t].indexOf(e) && this.incomingEdges[t].push(e), !0
    }, removeDependency(e, t) {
        let s;
        this.hasNode(e) && (s = this.outgoingEdges[e].indexOf(t), s >= 0 && this.outgoingEdges[e].splice(s, 1)), this.hasNode(t) && (s = this.incomingEdges[t].indexOf(e), s >= 0 && this.incomingEdges[t].splice(s, 1))
    }, clone() {
        const e = this, t = new f;
        return Object.keys(e.nodes).forEach(s => {
            t.nodes[s] = e.nodes[s], t.outgoingEdges[s] = e.outgoingEdges[s].slice(0), t.incomingEdges[s] = e.incomingEdges[s].slice(0)
        }), t
    }, directDependenciesOf(e) {
        if (this.hasNode(e)) return this.outgoingEdges[e].slice(0);
        throw new Error("Node does not exist: " + e)
    }, directDependantsOf(e) {
        if (this.hasNode(e)) return this.incomingEdges[e].slice(0);
        throw new Error("Node does not exist: " + e)
    }, dependenciesOf(e, t) {
        if (this.hasNode(e)) {
            const s = [];
            g(this.outgoingEdges, t, s, this.circular)(e);
            const n = s.indexOf(e);
            return n >= 0 && s.splice(n, 1), s
        }
        throw new Error("Node does not exist: " + e)
    }, dependantsOf(e, t) {
        if (this.hasNode(e)) {
            const s = [];
            g(this.incomingEdges, t, s, this.circular)(e);
            const n = s.indexOf(e);
            return n >= 0 && s.splice(n, 1), s
        }
        throw new Error("Node does not exist: " + e)
    }, entryNodes() {
        const e = this;
        return Object.keys(this.nodes).filter(t => 0 === e.incomingEdges[t].length)
    }, overallOrder(e) {
        const t = this, s = [], n = Object.keys(this.nodes);
        if (0 === n.length) return s;
        if (!this.circular) {
            const e = g(this.outgoingEdges, !1, [], this.circular);
            n.forEach(t => {
                e(t)
            })
        }
        const i = g(this.outgoingEdges, e, s, this.circular);
        return n.filter(e => 0 === t.incomingEdges[e].length).forEach(e => {
            i(e)
        }), this.circular && n.filter(e => -1 === s.indexOf(e)).forEach(e => i(e)), s
    }
}, f.prototype.directDependentsOf = f.prototype.directDependantsOf, f.prototype.dependentsOf = f.prototype.dependantsOf;

class y {
    static get ACTION_ELEMENTS() {
        return ["FX-DELETE", "FX-DISPATCH", "FX-INSERT", "FX-LOAD", "FX-MESSAGE", "FX-REBUILD", "FX-RECALCULATE", "FX-REFRESH", "FX-RENEW", "FX-REPLACE", "FX-RESET", "FX-RETAIN", "FX-RETURN", "FX-REVALIDATE", "FX-SEND", "FX-SETFOCUS", "FX-SETINDEX", "FX-SETVALUE", "FX-TOGGLE", "FX-UPDATE"]
    }

    static createUUID() {
        const e = [];
        for (let t = 0; t < 36; t++) e[t] = "0123456789abcdef".substr(Math.floor(16 * Math.random()), 1);
        e[14] = "4", e[19] = "0123456789abcdef".substr(3 & e[19] | 8, 1), e[8] = e[13] = e[18] = e[23] = "-";
        return e.join("")
    }

    static get XFORMS_NAMESPACE_URI() {
        return "http://www.w3.org/2002/xforms"
    }

    static isActionElement(e) {
        return y.ACTION_ELEMENTS.includes(e)
    }

    static get UI_ELEMENTS() {
        return ["FX-ALERT", "FX-CONTROL", "FX-BUTTON", "FX-CONTROL", "FX-DIALOG", "FX-FILENAME", "FX-MEDIATYPE", "FX-GROUP", "FX-HINT", "FX-INPUT", "FX-ITEMS", "FX-LABEL", "FX-OUTPUT", "FX-RANGE", "FX-REPEAT", "FX-REPEATITEM", "FX-SWITCH", "FX-SECRET", "FX-SELECT", "FX-SUBMIT", "FX-TEXTAREA", "FX-TRIGGER", "FX-UPLOAD"]
    }

    static isUiElement(e) {
        y.UI_ELEMENTS.includes(e);
        return y.UI_ELEMENTS.includes(e)
    }

    static async refreshChildren(e, t) {
        return new Promise(s => {
            const {children: n} = e;
            n && Array.from(n).forEach(e => {
                y.isUiElement(e.nodeName) && "function" == typeof e.refresh ? e.refresh() : "FX-MODEL" !== e.nodeName.toUpperCase() && y.refreshChildren(e, t)
            }), s("done")
        })
    }

    static isRepeated(e) {
        return null !== e.closest("fx-repeatitem")
    }

    static getRepeatTarget(e, t) {
        return e.closest("fx-repeatitem").querySelector("#" + t)
    }

    static getContentType(e, t) {
        return "urlencoded-post" === t ? "application/x-www-form-urlencoded; charset=UTF-8" : "xml" === e.type ? "application/xml; charset=UTF-8" : "json" === e.type ? "application/json" : (console.warn("content-type unknown ", e.type), null)
    }

    static fadeInElement(e) {
        let t = () => (e.getAnimations && e.getAnimations().map(e => e.finish()), t = e.animate({opacity: [0, 1]}, 600), t.finished);
        return t()
    }

    static fadeOutElement(e) {
        let t = () => (e.getAnimations && e.getAnimations().map(e => e.finish()), t = e.animate({opacity: [1, 0]}, 2600), t.finished);
        return t()
    }

    static dispatch(e, t, s) {
        const n = new CustomEvent(t, {composed: !0, bubbles: !0, detail: s});
        console.log("firing", n), e.dispatchEvent(n)
    }
}

y.READONLY_DEFAULT = !1, y.REQUIRED_DEFAULT = !1, y.RELEVANT_DEFAULT = !0, y.CONSTRAINT_DEFAULT = !0, y.TYPE_DEFAULT = "xs:string";
const E = "http://www.w3.org/2002/xforms", b = new Map;

function x(e, t, s) {
    return b.has(e) ? b.get(e).set(t, s) : b.set(e, new Map)
}

const v = e => {
    if (!e) return "http://www.w3.org/1999/xhtml"
};

function w(e, t) {
    const s = (n = e, i = t, b.has(n) && b.get(n).get(i) || null);
    var n, i;
    if (s) return s;
    const o = (new DOMParser).parseFromString("<xml />", "text/xml"), l = d(e, {}, o);
    let c = h('descendant::xqx:functionCallExpr\n\t\t\t\t[xqx:functionName = "instance"]\n\t\t\t\t/xqx:arguments\n\t\t\t\t/xqx:stringConstantExpr\n\t\t\t\t/xqx:value', l, null, {}, {namespaceResolver: e => "xqx" === e ? "http://www.w3.org/2005/XQueryX" : void 0});
    if (0 === c.length) {
        const s = r("ancestor::*[@ref][1]", t);
        if (s) {
            const n = w(s.getAttribute("ref"), s);
            return x(e, t), n
        }
        c = ["default"]
    }
    if (1 === c.length) {
        let s;
        if ("default" === c[0]) {
            const e = r("ancestor-or-self::fx-fore", t, null, null, {namespaceResolver: v});
            s = e && e.querySelector("fx-instance")
        } else s = M(c[0], t, "fx-instance");
        if (s && s.hasAttribute("xpath-default-namespace")) {
            const n = s.getAttribute("xpath-default-namespace"), i = e => {
                if (!e) return n
            };
            return x(e, t, i), i
        }
    }
    c.length > 1 && console.warn(`More than one instance is used in the query "${e}". The default namespace resolving will be used`);
    const u = a("ancestor-or-self::*/@xpath-default-namespace[last()]", t) || "", p = function (e) {
        return "" === e ? u : a('ancestor-or-self::*/@*[name() = "xmlns:" || $prefix][last()]', t, null, {prefix: e})
    };
    return x(e, t, p), p
}

function A(e, t, s) {
    return (t && t.ownerDocument || t) === window.document ? v : w(e, s)
}

function T({prefix: e, localName: t}, s) {
    switch (t) {
        case"base64encode":
        case"boolean-from-string":
        case"current":
        case"depends":
        case"event":
        case"index":
        case"instance":
        case"log":
        case"logtree":
            return {namespaceURI: E, localName: t};
        default:
            return "" === e || "fn" === e ? {
                namespaceURI: "http://www.w3.org/2005/xpath-functions",
                localName: t
            } : "local" === e ? {namespaceURI: "http://www.w3.org/2005/xquery-local-functions", localName: t} : null
    }
}

function N(e, s, n, i = {}) {
    const o = A(e, s, n);
    return t(e, s, null, i, "xs:anyType", {
        currentContext: {formElement: n, variables: i},
        moduleImports: {xf: E},
        functionNameResolver: T,
        namespaceResolver: o
    })
}

function I(e, t, s) {
    const n = A(e, t, s);
    return r(e, t, null, {}, {
        defaultFunctionNamespaceURI: E,
        moduleImports: {xf: E},
        currentContext: {formElement: s},
        namespaceResolver: n
    })
}

function C(e, t, s) {
    const n = A(e, t, s);
    return i(e, t, null, {}, {
        currentContext: {formElement: s},
        functionNameResolver: T,
        moduleImports: {xf: E},
        namespaceResolver: n
    })
}

function _(e, t, s) {
    const n = A(e, t, s);
    return o(e, t, null, {}, {
        currentContext: {formElement: s},
        functionNameResolver: T,
        moduleImports: {xf: E},
        namespaceResolver: n
    })
}

function R(e, t, s, n = null, i = s) {
    const o = A(e, t, s);
    return a(e, t, n, {}, {
        currentContext: {formElement: s},
        functionNameResolver: T,
        moduleImports: {xf: E},
        namespaceResolver: o
    })
}

function L(e, t, s, n = null, i = s) {
    const o = A(e, t, s);
    return l(e, t, n, {}, {
        currentContext: {formElement: s},
        functionNameResolver: T,
        moduleImports: {xf: E},
        namespaceResolver: o
    })
}

function M(e, t, s = null) {
    const n = i("outermost(ancestor-or-self::fx-fore[1]/(descendant::xf-fore|descendant::*[@id = $id]))[not(self::fx-fore)]", t, null, {id: e}, {namespaceResolver: v});
    if (0 === n.length) return null;
    if (1 === n.length && o("(ancestor::fx-fore | ancestor::fx-repeat)[last()]/self::fx-fore", n[0], null, null, {namespaceResolver: v})) {
        const e = n[0];
        return s && e.localName !== s ? null : e
    }
    for (const e of i("ancestor::fx-repeatitem => reverse()", t, null, null, {namespaceResolver: v})) {
        const t = n.filter(t => e.contains(t));
        switch (t.length) {
            case 0:
                break;
            case 1: {
                const e = t[0];
                return s && e.localName !== s ? null : e
            }
            default: {
                const e = t.find(e => i("every $ancestor of ancestor::fx-repeatitem satisfies $ancestor is $ancestor/../child::fx-repeatitem[../@repeat-index]", e, null, {}));
                return e ? s && e.localName !== s ? null : e : null
            }
        }
    }
    return null
}

s({namespaceURI: E, localName: "log"}, ["xs:string?"], "xs:string?", (e, t) => {
    const {formElement: s} = e.currentContext, n = M(t, s, "fx-instance");
    if (n) {
        return (new XMLSerializer).serializeToString(n.getDefaultContext())
    }
    return null
}), s({namespaceURI: E, localName: "logtree"}, ["xs:string?"], "element()?", (e, t) => {
    const {formElement: s} = e.currentContext, n = M(t, s, "fx-instance");
    if (n) {
        const t = document.createElement("div");
        t.setAttribute("class", "logtree");
        const s = e.currentContext.formElement, i = s.querySelector(".logtree");
        i && i.parentNode.removeChild(i);
        const o = function e(t, s) {
            if (s && s.nodeType === Node.ELEMENT_NODE && s.children) {
                const n = document.createElement("details");
                n.setAttribute("data-path", s.nodeName);
                const i = document.createElement("summary");
                let o, r = " <" + s.nodeName;
                Array.from(s.attributes).forEach(e => {
                    r += ` ${e.nodeName}="${e.nodeValue}"`
                }), s.firstChild && s.firstChild.nodeType === Node.TEXT_NODE && "" !== s.firstChild.data.trim() ? (o = s.firstChild.nodeValue, r += `>${o}</${s.nodeName}>`) : r += ">", i.textContent = r, n.appendChild(i), 0 !== s.childElementCount ? n.setAttribute("open", "open") : i.setAttribute("style", "list-style:none;"), t.appendChild(n), Array.from(s.children).forEach(t => {
                    e(n, t)
                })
            }
        }(t, n.getDefaultContext());
        o && s.appendChild(o)
    }
    return null
});
const O = (e, t) => {
    const s = r("ancestor-or-self::fx-fore", e.currentContext.formElement, null, null, {namespaceResolver: v}),
        n = t ? M(t, s, "fx-instance") : s.querySelector("fx-instance");
    if (n) {
        return n.getDefaultContext()
    }
    return null
};
s({namespaceURI: E, localName: "index"}, ["xs:string?"], "xs:integer?", (e, t) => {
    const {formElement: s} = e.currentContext;
    if (null === t) return 1;
    const n = M(t, s, "fx-repeat");
    return n ? n.getAttribute("index") : 1
}), s({namespaceURI: E, localName: "instance"}, [], "item()?", e => O(e, null)), s({
    namespaceURI: E,
    localName: "instance"
}, ["xs:string?"], "item()?", O), s({
    namespaceURI: E,
    localName: "depends"
}, ["node()*"], "item()?", (e, t) => t[0]), s({
    namespaceURI: E,
    localName: "event"
}, ["xs:string?"], "item()?", (e, t) => (e.currentContext.variables[t].nodeType && console.log("got some node as js object"), e.currentContext.variables[t])), n(`\n    module namespace xf="${E}";\n\n    declare %public function xf:boolean-from-string($str as xs:string) as xs:boolean {\n        lower-case($str) = "true" or $str = "1"\n    };\n`), s({
    namespaceURI: E,
    localName: "base64encode"
}, ["xs:string?"], "xs:string?", (e, t) => btoa(t));

class F extends HTMLElement {
    constructor() {
        super(), this.model = this.parentNode, this.attachShadow({mode: "open"})
    }

    connectedCallback() {
        this.hasAttribute("src") && (this.src = this.getAttribute("src")), this.hasAttribute("id") ? this.id = this.getAttribute("id") : this.id = "default", this.hasAttribute("type") ? this.type = this.getAttribute("type") : this.type = "xml";
        this.shadowRoot.innerHTML = "\n            <style>\n                \n            :host {\n                display: none;\n            }\n            :host * {\n                display:none;\n            }\n            ::slotted(*){\n                display:none;\n            }\n        \n            </style>\n            \n        \n        "
    }

    async init() {
        await this._initInstance().then(() => (this.dispatchEvent(new CustomEvent("instance-loaded", {
            composed: !0,
            bubbles: !0,
            detail: {instance: this}
        })), this))
    }

    evalXPath(e) {
        const t = this.parentElement.parentElement;
        return I(e, this.getDefaultContext(), t)
    }

    getInstanceData() {
        return this.instanceData || this._createInstanceData(), this.instanceData
    }

    setInstanceData(e) {
        e ? this.instanceData = e : this._createInstanceData()
    }

    getDefaultContext() {
        return "xml" === this.type ? this.instanceData.firstElementChild : this.instanceData
    }

    async _initInstance() {
        if ("#querystring" === this.src) {
            const e = new URLSearchParams(location.search),
                t = (new DOMParser).parseFromString("<data></data>", "application/xml"), s = t.firstElementChild;
            for (const n of e) {
                const e = t.createElement(n[0]);
                e.appendChild(t.createTextNode(n[1])), s.appendChild(e)
            }
            this.instanceData = t
        } else this.src ? await this._loadData() : 0 !== this.childNodes.length && this._useInlineData()
    }

    _createInstanceData() {
        if ("xml" === this.type) {
            const e = (new DOMParser).parseFromString("<data></data>", "application/xml");
            this.instanceData = e
        }
        "json" === this.type && (this.instanceData = {})
    }

    async _loadData() {
        const e = "" + this.src, t = y.getContentType(this, "get");
        await fetch(e, {method: "GET", mode: "cors", credentials: "include", headers: {"Content-Type": t}}).then(e => {
            const t = e.headers.get("content-type").toLowerCase();
            return console.log("********** responseContentType *********", t), t.startsWith("text/plain") ? e.text() : t.startsWith("application/json") ? e.json() : t.startsWith("application/xml") ? e.text().then(e => (new DOMParser).parseFromString(e, "application/xml")) : "done"
        }).then(e => {
            this.instanceData = e, console.log("instanceData loaded: ", this.instanceData)
        }).catch(e => {
            throw new Error("failed loading data " + e)
        })
    }

    _getContentType() {
        return "xml" === this.type ? "application/xml" : "json" === this.type ? "application/json" : (console.warn("content-type unknown ", this.type), null)
    }

    _useInlineData() {
        if ("xml" === this.type) {
            const e = (new DOMParser).parseFromString(this.innerHTML, "application/xml");
            console.log("fx-instance init id:", this.id), this.instanceData = e, console.log("fx-instance data: ", this.instanceData)
        } else "json" === this.type ? this.instanceData = JSON.parse(this.textContent) : console.warn("unknow type for data ", this.type)
    }

    _handleResponse() {
        console.log("_handleResponse ");
        const e = this.shadowRoot.getElementById("loader"),
            t = (new DOMParser).parseFromString(e.lastResponse, "application/xml");
        this.instanceData = t, console.log("data: ", this.instanceData)
    }

    _handleError() {
        const e = this.shadowRoot.getElementById("loader");
        console.log("_handleResponse ", e.lastError)
    }
}

customElements.define("fx-instance", F);

class D {
    constructor(e, t, s, n, i, o, r, a, l) {
        this.path = e, this.ref = t, this.constraint = o, this.readonly = s, this.relevant = n, this.required = i, this.type = r, this.node = a, this.bind = l, this.changed = !1, this.alerts = []
    }

    get value() {
        return this.node.nodeType ? this.node.nodeType === Node.ATTRIBUTE_NODE ? this.node.nodeValue : this.node.textContent : this.node
    }

    set value(e) {
        console.log("modelitem.setvalue oldVal", this.value), console.log("modelitem.setvalue newVal", e), e.nodeType === Node.DOCUMENT_NODE ? this.node.appendChild(e.firstElementChild) : e.nodeType === Node.ELEMENT_NODE ? this.node.appendChild(e) : this.node.nodeType === Node.ATTRIBUTE_NODE ? this.node.nodeValue = e : this.node.textContent = e
    }

    addAlert(e) {
        this.alerts.push(e)
    }

    cleanAlerts() {
        this.alerts = []
    }
}

class S extends HTMLElement {
    constructor() {
        super(), this.instances = [], this.modelItems = [], this.defaultContext = {}, this.inited = !1, this.modelConstructed = !1, this.attachShadow({mode: "open"})
    }

    get formElement() {
        return this.parentElement
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = "\n            <slot></slot>\n        ", this.addEventListener("model-construct-done", e => {
            this.modelConstructed = !0, console.log("model-construct-done fired ", e.detail.model.instances)
        })
    }

    static lazyCreateModelItem(e, t, s) {
        let n, i = {};
        if (null == s) return null;
        i = s.nodeType === s.TEXT_NODE ? s.parentNode : s, s.nodeType ? n = m.getPath(s) : (n = null, i = s);
        const o = new D(n, t, y.READONLY_DEFAULT, y.RELEVANT_DEFAULT, y.REQUIRED_DEFAULT, y.CONSTRAINT_DEFAULT, y.TYPE_DEFAULT, i, this);
        return e.registerModelItem(o), o
    }

    modelConstruct() {
        console.log("### <<<<< dispatching model-construct >>>>>"), this.dispatchEvent(new CustomEvent("model-construct", {detail: this})), console.time("instance-loading");
        const e = this.querySelectorAll("fx-instance");
        if (e.length > 0) {
            console.group("init instances");
            const t = [];
            e.forEach(e => {
                t.push(e.init())
            }), Promise.all(t).then(() => {
                this.instances = Array.from(e), console.log("_modelConstruct this.instances ", this.instances), this.updateModel(), this.inited = !0, console.log("### <<<<< dispatching model-construct-done >>>>>"), this.dispatchEvent(new CustomEvent("model-construct-done", {
                    composed: !0,
                    bubbles: !0,
                    detail: {model: this}
                }))
            }), console.groupEnd()
        } else this.dispatchEvent(new CustomEvent("model-construct-done", {
            composed: !0,
            bubbles: !0,
            detail: {model: this}
        }));
        console.timeEnd("instance-loading"), this.inited = !0
    }

    registerModelItem(e) {
        this.modelItems.push(e)
    }

    updateModel() {
        console.time("updateModel"), this.rebuild(), this.recalculate(), this.revalidate(), console.timeEnd("updateModel")
    }

    rebuild() {
        console.group("### rebuild"), console.time("rebuild"), this.mainGraph = new f(!1), this.modelItems = [];
        this.querySelectorAll("fx-model > fx-bind").forEach(e => {
            e.init(this)
        }), console.timeEnd("rebuild"), console.log("rebuild mainGraph", this.mainGraph), console.log("rebuild mainGraph calc order", this.mainGraph.overallOrder()), console.groupEnd()
    }

    recalculate() {
        console.group("### recalculate"), console.log("recalculate instances ", this.instances), console.time("recalculate");
        this.mainGraph.overallOrder().forEach(e => {
            const t = this.mainGraph.getNodeData(e), s = this.getModelItem(t);
            if (s && e.includes(":")) {
                const t = e.split(":")[1];
                if (t) if ("calculate" === t) {
                    const e = N(s.bind[t], s.node, this);
                    s.value = e
                } else if ("constraint" !== t && "type" !== t) {
                    const n = s.bind[t];
                    if (n) {
                        const i = _(n, s.node, this);
                        s[t] = i, console.log(`recalculating path ${e} - Expr:'${n}' computed`, s[t])
                    }
                }
            }
        }), console.timeEnd("recalculate"), console.log(`recalculate finished with modelItems ${this.modelItems.length} item(s)`, this.modelItems), console.groupEnd()
    }

    revalidate() {
        console.group("### revalidate"), console.time("revalidate");
        let e = !0;
        return this.modelItems.forEach(t => {
            const {bind: s} = t;
            if (s && "function" == typeof s.hasAttribute && s.hasAttribute("constraint")) {
                const n = s.getAttribute("constraint");
                if (n) {
                    const i = _(n, t.node, this);
                    if (console.log("modelItem validity computed: ", i), t.constraint = i, i || (e = !1), !this.modelConstructed) {
                        const e = s.getAlert();
                        e && t.addAlert(e)
                    }
                }
            }
        }), console.timeEnd("revalidate"), console.log("modelItems after revalidate: ", this.modelItems), console.groupEnd(), e
    }

    getModelItem(e) {
        return this.modelItems.find(t => t.node === e)
    }

    getDefaultContext() {
        return this.instances[0].getDefaultContext()
    }

    getDefaultInstance() {
        return this.instances[0]
    }

    getDefaultInstanceData() {
        return console.log("default instance data ", this.instances[0].instanceData), this.instances[0].instanceData
    }

    getInstance(e) {
        return Array.from(this.instances).find(t => t.id === e)
    }

    evalBinding(e) {
        return this.instances[0].evalXPath(e)
    }
}

function k(e) {
    return e.closest("fx-fore")
}

function U(e, t) {
    const s = e.closest("[ref]");
    if (null !== s) return s.nodeset;
    const n = function (e) {
        return k(e).getModel()
    }(e);
    if (m.isAbsolutePath(t)) {
        const e = m.getInstanceId(t);
        return n.getInstance(e).getDefaultContext()
    }
    return null !== n.getDefaultInstance() ? n.getDefaultInstance().getDefaultContext() : []
}

function q(e, t) {
    const s = function (e) {
        return e.nodeType === Node.ATTRIBUTE_NODE ? e.ownerElement : e.parentNode
    }(e), n = s.closest("fx-repeatitem");
    if (n) return n.nodeset;
    if (e.nodeType === Node.ELEMENT_NODE && e.hasAttribute("context")) {
        const n = U(e.parentNode, t);
        return I(e.getAttribute("context"), n, k(s))
    }
    return U(s, t)
}

customElements.define("fx-model", S);
const P = e => class extends e {
    static get properties() {
        return {
            context: {type: Object},
            model: {type: Object},
            modelItem: {type: Object},
            nodeset: {type: Object},
            ref: {type: String}
        }
    }

    constructor() {
        super(), this.context = null, this.model = null, this.modelItem = {}, this.ref = this.hasAttribute("ref") ? this.getAttribute("ref") : ""
    }

    getModel() {
        if (this.model) return this.model;
        return this.getOwnerForm().querySelector("fx-model")
    }

    getOwnerForm() {
        let e = this;
        for (; e && e.parentNode;) {
            if ("FX-FORE" === e.nodeName.toUpperCase()) return e;
            e = e.parentNode instanceof DocumentFragment ? e.parentNode.host : e.parentNode
        }
        return e
    }

    evalInContext() {
        const e = q(this, this.ref);
        if (e) if ("" === this.ref) this.nodeset = e; else if (Array.isArray(e)) e.forEach(t => {
            if (m.isSelfReference(this.ref)) this.nodeset = e; else {
                const e = I(this.ref, t, null);
                this.nodeset.push(e)
            }
        }); else {
            this.getOwnerForm();
            e.nodeType ? this.nodeset = I(this.ref, e, this) : this.nodeset = N(this.ref, e, this)
        } else console.warn("no in scopeContext for ", this)
    }

    isNotBound() {
        return !this.hasAttribute("ref")
    }

    isBound() {
        return this.hasAttribute("ref")
    }

    getBindingExpr() {
        if (this.hasAttribute("ref")) return this.getAttribute("ref");
        const e = this.parentNode.closest("[ref]");
        return e ? e.getAttribute("ref") : "instance()"
    }

    getInstance() {
        if (this.ref.startsWith("instance(")) {
            const e = m.getInstanceId(this.ref);
            return this.getModel().getInstance(e)
        }
        return this.getModel().getInstance("default")
    }

    _getParentBindingElement(e) {
        if (e.parentNode.host) {
            const {host: t} = e.parentNode;
            if (t.hasAttribute("ref")) return t
        } else if (e.parentNode) {
            if (e.parentNode.hasAttribute("ref")) return this.parentNode;
            this._getParentBindingElement(this.parentNode)
        }
        return null
    }

    getModelItem() {
        const e = this.getModel().getModelItem(this.nodeset);
        e && (this.modelItem = e);
        let t;
        if (this.closest("fx-repeatitem")) {
            const {index: e} = this.closest("fx-repeatitem");
            t = Array.isArray(this.nodeset) ? this.getModel().getModelItem(this.nodeset[e - 1]) : this.getModel().getModelItem(this.nodeset)
        } else t = this.getModel().getModelItem(this.nodeset);
        return t || S.lazyCreateModelItem(this.getModel(), this.ref, this.nodeset)
    }

    getValue() {
        if (this.hasAttribute("value")) {
            const e = this.getAttribute("value");
            try {
                return R(e, q(this, e), this.getOwnerForm())
            } catch (e) {
                console.error(e), this.dispatch("error", {message: e})
            }
        }
        return this.textContent ? this.textContent : null
    }

    getInScopeContext() {
        return q(this, this.ref)
    }

    dispatch(e, t) {
        const s = new CustomEvent(e, {composed: !0, bubbles: !0, detail: t});
        this.dispatchEvent(s)
    }
};

class X extends (P(HTMLElement)) {
    constructor() {
        super(), this.nodeset = [], this.model = {}, this.contextNode = {}, this.inited = !1
    }

    connectedCallback() {
        this.ref = this.getAttribute("ref"), this.readonly = this.getAttribute("readonly"), this.required = this.getAttribute("required"), this.relevant = this.getAttribute("relevant"), this.type = this.hasAttribute("type") ? this.getAttribute("type") : X.TYPE_DEFAULT, this.calculate = this.getAttribute("calculate")
    }

    init(e) {
        this.model = e, console.log("init binding ", this), this.instanceId = this._getInstanceId(), this.bindType = this.getModel().getInstance(this.instanceId).type, "xml" === this.bindType && (this._evalInContext(), this._buildBindGraph(), this._createModelItems()), this._processChildren(e)
    }

    _buildBindGraph() {
        "xml" === this.bindType && this.nodeset.forEach(e => {
            const t = m.getPath(e);
            this.calculate && (this.model.mainGraph.addNode(t + ":calculate", e), this.model.mainGraph.addNode(t, e), this.model.mainGraph.addDependency(t, t + ":calculate"));
            const s = this._getReferencesForProperty(this.calculate, e);
            0 !== s.length && this._addDependencies(s, e, t, "calculate");
            const n = this._getReferencesForProperty(this.readonly, e);
            0 !== n.length ? this._addDependencies(n, e, t, "readonly") : this.readonly && this.model.mainGraph.addNode(t + ":readonly", e);
            const i = this._getReferencesForProperty(this.required, e);
            0 !== i.length ? this._addDependencies(i, e, t, "required") : this.required && this.model.mainGraph.addNode(t + ":required", e);
            const o = this._getReferencesForProperty(this.relevant, e);
            0 !== o.length ? this._addDependencies(o, e, t, "relevant") : this.relevant && this.model.mainGraph.addNode(t + ":relevant", e);
            const r = this._getReferencesForProperty(this.constraint, e);
            0 !== r.length ? this._addDependencies(r, e, t, "constraint") : this.constraint && this.model.mainGraph.addNode(t + ":constraint", e)
        })
    }

    _addNode(e, t) {
        this.model.mainGraph.hasNode(e) || this.model.mainGraph.addNode(e, {node: t})
    }

    _addDependencies(e, t, s, n) {
        const i = `${s}:${n}`;
        0 !== e.length ? (this.model.mainGraph.hasNode(i) || this.model.mainGraph.addNode(i, t), e.forEach(e => {
            const t = m.getPath(e);
            this.model.mainGraph.hasNode(t) || this.model.mainGraph.addNode(t, e), this.model.mainGraph.addDependency(i, t)
        })) : this.model.mainGraph.addNode(i, t)
    }

    _processChildren(e) {
        const t = this.querySelectorAll(":scope > fx-bind");
        Array.from(t).forEach(t => {
            t.init(e)
        })
    }

    getAlert() {
        if (this.hasAttribute("alert")) return this.getAttribute("alert");
        const e = this.querySelector("fx-alert");
        return e ? e.innerHTML : null
    }

    _evalInContext() {
        const e = this.getInScopeContext();
        if (this.nodeset = [], "" === this.ref || null === this.ref) this.nodeset = e; else if (Array.isArray(e)) e.forEach(t => {
            if (m.isSelfReference(this.ref)) this.nodeset = e; else if (this.ref) {
                C(this.ref, t, this.getOwnerForm()).forEach(e => {
                    this.nodeset.push(e)
                })
            }
        }); else {
            "xml" === this.getModel().getInstance(this.instanceId).type ? this.nodeset = C(this.ref, e, this.getOwnerForm()) : this.nodeset = this.ref
        }
    }

    _createModelItems() {
        Array.isArray(this.nodeset) ? Array.from(this.nodeset).forEach(e => {
            this._createModelItem(e)
        }) : this._createModelItem(this.nodeset)
    }

    static lazyCreateModelitems(e, t, s) {
        Array.isArray(s) ? Array.from(s).forEach(s => {
            X.lazyCreateModelItem(e, t, s)
        }) : X.lazyCreateModelItem(e, t, s)
    }

    _createModelItem(e) {
        if (m.isSelfReference(this.ref)) {
            const e = this.parentElement.closest("fx-bind[ref]");
            return console.log("parent bound element ", e), void (e ? e.required = this.required : console.error("no parent bound element"))
        }
        const t = e, s = m.getPath(e),
            n = new D(s, this.getBindingExpr(), X.READONLY_DEFAULT, X.RELEVANT_DEFAULT, X.REQUIRED_DEFAULT, X.CONSTRAINT_DEFAULT, this.type, t, this);
        this.getModel().registerModelItem(n)
    }

    _getReferencesForProperty(e) {
        if (e) {
            const t = new Set, s = new p(e => t.add(e));
            return this.nodeset.forEach(t => {
                R(e, t, this.getOwnerForm(), s)
            }), Array.from(t.values())
        }
        return []
    }

    _initBooleanModelItemProperty(e, t) {
        return _(this[e], t, this)
    }

    static shortenPath(e) {
        const t = e.split("/");
        let s = "";
        for (let e = 2; e < t.length; e += 1) {
            const n = t[e];
            if (-1 !== n.indexOf("{}")) {
                s += "/" + n.split("{}")[1]
            } else s += "/" + n
        }
        return s
    }

    _getInstanceId() {
        const e = this.getBindingExpr();
        return e.startsWith("instance(") ? (this.instanceId = m.getInstanceId(e), this.instanceId) : this.instanceId ? this.instanceId : "default"
    }
}

X.READONLY_DEFAULT = !1, X.REQUIRED_DEFAULT = !1, X.RELEVANT_DEFAULT = !0, X.CONSTRAINT_DEFAULT = !0, X.TYPE_DEFAULT = "xs:string", customElements.define("fx-bind", X);

class B extends HTMLElement {
    static get properties() {
        return {lazyRefresh: {type: Boolean}, model: {type: Object}, ready: {type: Boolean}}
    }

    constructor() {
        super(), this.model = {}, this.addEventListener("model-construct-done", this._handleModelConstructDone), this.addEventListener("message", this._displayMessage), this.addEventListener("error", this._displayError), window.addEventListener("compute-exception", e => {
            console.error("circular dependency: ", e)
        }), this.ready = !1, this.storedTemplateExpressionByNode = new Map;
        this.attachShadow({mode: "open"}), this.shadowRoot.innerHTML = '\n            <style>\n                \n            :host {\n                display: none;\n                height:auto;\n                padding:var(--model-element-padding);\n                font-family:Roboto, sans-serif;\n                color:var(--paper-grey-900);\n            }\n            :host ::slotted(fx-model){\n                display:none;\n            }\n            :host(.fx-ready){\n                animation: fadein .4s forwards;\n                display:block;\n            }\n\n            #modalMessage .dialogActions{\n                text-align:center;\n            }\n            .overlay {\n              position: fixed;\n              top: 0;\n              bottom: 0;\n              left: 0;\n              right: 0;\n              background: rgba(0, 0, 0, 0.7);\n              transition: all 500ms;\n              visibility: hidden;\n              opacity: 0;\n              z-index:10;\n            }\n            .overlay.show {\n              visibility: visible;\n              opacity: 1;\n            }\n\n            .popup {\n              margin: 70px auto;\n              background: #fff;\n              border-radius: 5px;\n              width: 30%;\n              position: relative;\n              transition: all 5s ease-in-out;\n                            padding: 20px;\n\n            }\n            .popup h2 {\n              margin-top: 0;\n              width:100%;\n              background:#eee;\n              position:absolute;\n              top:0;\n              right:0;\n              left:0;\n              height:40px;\n             border-radius: 5px;\n\n            }\n            .popup .close {\n                position: absolute;\n                top: 3px;\n                right: 10px;\n                transition: all 200ms;\n                font-size: 30px;\n                font-weight: bold;\n                text-decoration: none;\n                color: #333;\n            }\n            .popup .close:focus{\n                outline:none;\n            }\n\n            .popup .close:hover {\n                color: #06D85F;\n            }\n            #messageContent{\n                margin-top:40px;\n            }\n            @keyframes fadein {\n              0% {\n                  opacity:0;\n              }\n              100% {\n                  opacity:1;\n              }\n            }\n        \n            </style>\n            \n           <jinn-toast id="message" gravity="bottom" position="left"></jinn-toast>\n           <jinn-toast id="error" text="error" duration="-1" data-class="error" close="true" position="left" gravity="bottom"></jinn-toast>\n           <slot></slot>\n           <div id="modalMessage" class="overlay">\n                <div class="popup">\n                   <h2></h2>\n                    <a class="close" href="#"  onclick="event.target.parentNode.parentNode.classList.remove(\'show\')" autofocus>&times;</a>\n                    <div id="messageContent"></div>\n                </div>\n           </div>\n        \n        '
    }

    connectedCallback() {
        if (this.lazyRefresh = this.hasAttribute("refresh-on-view"), this.lazyRefresh) {
            const e = {root: null, rootMargin: "0px", threshold: .3};
            this.intersectionObserver = new IntersectionObserver(this.handleIntersect, e)
        }
        this.shadowRoot.querySelector("slot").addEventListener("slotchange", e => {
            console.log("Fore slotchange");
            let t = e.target.assignedElements().find(e => "FX-MODEL" === e.nodeName.toUpperCase());
            if (!t) {
                const e = document.createElement("FX-model");
                this.appendChild(e), t = e
            }
            t.inited || (console.log("########## FORE: kick off processing... ##########"), t.modelConstruct()), this.model = t
        })
    }

    handleIntersect(e, t) {
        console.time("refreshLazy"), e.forEach(e => {
            const t = e.target;
            e.isIntersecting && (console.log("in view", e), t.classList.add("loaded"), "function" == typeof t.refresh ? (console.log("refreshing target", t), t.refresh(t, !0)) : (console.log("refreshing children", t), y.refreshChildren(t, !0)))
        }), e[0].target.getOwnerForm().dispatchEvent(new CustomEvent("refresh-done")), console.timeEnd("refreshLazy")
    }

    evaluateToNodes(e, t) {
        return C(e, t, this)
    }

    disconnectedCallback() {
    }

    async refresh(e) {
        console.group("### refresh"), console.time("refresh"), console.time("refreshChildren"), y.refreshChildren(this, !0), console.timeEnd("refreshChildren"), this._updateTemplateExpressions(), console.timeEnd("refresh"), console.groupEnd(), console.log("### <<<<< dispatching refresh-done - end of UI update cycle >>>>>"), this.dispatchEvent(new CustomEvent("refresh-done"))
    }

    _updateTemplateExpressions() {
        const e = C("(descendant-or-self::*/(text(), @*))[matches(.,'\\{.*\\}')] except descendant-or-self::fx-model/descendant-or-self::node()/(., @*)", this, this);
        Array.from(e).forEach(e => {
            if (this.storedTemplateExpressionByNode.has(e)) return;
            const t = this._getTemplateExpression(e);
            this.storedTemplateExpressionByNode.set(e, t)
        });
        for (const e of this.storedTemplateExpressionByNode.keys()) this._processTemplateExpression({
            node: e,
            expr: this.storedTemplateExpressionByNode.get(e)
        });
        console.log("stored template expressions ", this.storedTemplateExpressionByNode)
    }

    _processTemplateExpression(e) {
        const {expr: t} = e, {node: s} = e;
        this.evaluateTemplateExpression(t, s, this)
    }

    evaluateTemplateExpression(e, t) {
        if ("{}" === e) return;
        const s = e.match(/{[^}]*}/g);
        t.nodeType === t.TEXT_NODE ? t.parentNode : t.ownerElement;
        s && s.forEach(s => {
            let n = s.substring(1, s.length - 1);
            const i = q(t, n);
            if (!i) {
                const e = t.nodeType === Node.TEXT_NODE || t.nodeType === Node.ATTRIBUTE_NODE ? t.parentNode : t;
                return void console.warn("no inscope context for ", e)
            }
            const o = m.getInstanceId(n), r = this.getModel().getInstance(o);
            try {
                const o = R(n, i, t, null, r), a = e.replaceAll(s, o);
                if (t.nodeType === Node.ATTRIBUTE_NODE) {
                    t.ownerElement.setAttribute(t.nodeName, a)
                } else t.nodeType === Node.TEXT_NODE && (t.textContent = a);
                a.includes("{") && (n = a.substring(1, a.length), this.evaluateTemplateExpression(a, t))
            } catch (e) {
                this.dispatchEvent(new CustomEvent("error", {detail: e}))
            }
        })
    }

    _getTemplateExpression(e) {
        return e.nodeType === Node.ATTRIBUTE_NODE ? e.value : e.nodeType === Node.TEXT_NODE ? e.textContent.trim() : null
    }

    _handleModelConstructDone() {
        this._initUI()
    }

    async _lazyCreateInstance() {
        const e = this.querySelector("fx-model");
        if (0 === e.instances.length) {
            console.log("### lazy creation of instance");
            const t = document.createElement("fx-instance");
            e.appendChild(t);
            const s = document.implementation.createDocument(null, "data", null);
            this._generateInstance(this, s.firstElementChild), t.instanceData = s, e.instances.push(t), console.log("generatedInstance ", this.getModel().getDefaultInstanceData())
        }
    }

    _generateInstance(e, t) {
        if (e.hasAttribute("ref") && !y.isActionElement(e.nodeName)) {
            const s = e.getAttribute("ref");
            if (s.includes("/")) {
                console.log("complex path to create ", s);
                s.split("/").forEach(s => {
                    console.log("step ", s), t = this._generateNode(t, s, e)
                })
            } else t = this._generateNode(t, s, e)
        }
        if (e.hasChildNodes()) {
            const s = e.children;
            for (let e = 0; e < s.length; e += 1) this._generateInstance(s[e], t)
        }
        return t
    }

    _generateNode(e, t, s) {
        const n = e.ownerDocument.createElement(t);
        return 0 === s.children.length && (n.textContent = s.textContent), e.appendChild(n), e = n
    }

    async _initUI() {
        console.log("### _initUI()"), await this._lazyCreateInstance(), await this.refresh(), this.classList.add("fx-ready"), this.ready = !0, console.log("### <<<<< dispatching ready >>>>>"), console.log("########## modelItems: ", this.getModel().modelItems), console.log("########## FORE: form fully initialized... ##########"), this.dispatchEvent(new CustomEvent("ready", {}))
    }

    registerLazyElement(e) {
        this.intersectionObserver && this.intersectionObserver.observe(e)
    }

    unRegisterLazyElement(e) {
        this.intersectionObserver && this.intersectionObserver.unobserve(e)
    }

    getModel() {
        return this.querySelector("fx-model")
    }

    _displayMessage(e) {
        const {level: t} = e.detail, s = e.detail.message;
        this._showMessage(t, s)
    }

    _displayError(e) {
        const t = e.detail.message;
        this.shadowRoot.querySelector("#error").showToast(t)
    }

    _showMessage(e, t) {
        if ("modal" === e) this.shadowRoot.getElementById("messageContent").innerText = t, this.shadowRoot.getElementById("modalMessage").classList.add("show"); else if ("modeless" === e) this.shadowRoot.querySelector("#message").showToast(t); else {
            this.shadowRoot.querySelector("#message").showToast(t)
        }
    }
}

customElements.define("fx-fore", B);

class H extends (P(HTMLElement)) {
    constructor() {
        super(), this.attachShadow({mode: "open"})
    }

    connectedCallback() {
        this.methods = ["get", "put", "post", "delete", "head", "urlencoded-post"], this.model = this.parentNode, this.hasAttribute("id") || console.warn("id is required"), this.id = this.getAttribute("id"), this.instance = this.hasAttribute("instance") ? this.getAttribute("instance") : null, this.method = this.hasAttribute("method") ? this.getAttribute("method") : "get", this.nonrelevant = this.hasAttribute("nonrelevant") ? this.getAttribute("nonrelevant") : "remove", this.replace = this.hasAttribute("replace") ? this.getAttribute("replace") : "all", this.serialization = this.hasAttribute("serialization") ? this.getAttribute("serialization") : "xml", this.hasAttribute("url") || console.warn("url is required for submission: " + this.id), this.url = this.getAttribute("url"), this.targetref = this.hasAttribute("targetref") ? this.getAttribute("targetref") : null, this.mediatype = this.hasAttribute("mediatype") ? this.getAttribute("mediatype") : "application/xml", this.validate = this.getAttribute("validate") ? this.getAttribute("validate") : "true", this.shadowRoot.innerHTML = this.renderHTML()
    }

    renderHTML() {
        return "\n      <slot></slot>\n    "
    }

    async submit() {
        await this.dispatch("submit", {submission: this}), this._submit()
    }

    async _submit() {
        console.log("submitting...."), this.evalInContext();
        const e = this.getModel();
        if (e.recalculate(), this.validate) {
            if (!e.revalidate()) return void console.log("validation failed. Bubmission stopped")
        }
        console.log("model updated...."), await this._serializeAndSend()
    }

    _evaluateAttributeTemplateExpression(e, t) {
        const s = e.match(/{[^}]*}/g);
        return s && s.forEach(s => {
            console.log("match ", s);
            const n = s.substring(1, s.length - 1), i = R(n, q(t, n), this.getOwnerForm()), o = e.replaceAll(s, i);
            console.log("replacing ", e, " with ", o), e = o
        }), e
    }

    async _serializeAndSend() {
        const e = this._evaluateAttributeTemplateExpression(this.url, this), t = this.getInstance();
        if ("xml" !== t.type) return void console.error("JSON serialization is not supported yet");
        let s;
        if ("none" === this.serialization) s = void 0; else {
            const e = this.selectRelevant();
            s = this._serialize(t.type, e)
        }
        if ("get" === this.method.toLowerCase() && (s = void 0), "#echo" === e) {
            let e;
            return e = s ? (new DOMParser).parseFromString(s, "application/xml") : void 0, this._handleResponse(e), void this.dispatch("submit-done", {})
        }
        const n = this._getHeaders();
        if (console.log("headers", n), "urlencoded-post" === this.method && (this.method = "post"), !this.methods.includes(this.method.toLowerCase())) return void this.dispatch("error", {message: "Unknown method " + this.method});
        const i = await fetch(e, {method: this.method, mode: "cors", credentials: "include", headers: n, body: s});
        if (!i.ok || i.status > 400) return void this.dispatch("submit-error", {message: "Error while submitting " + this.id});
        const o = i.headers.get("content-type").toLowerCase();
        if (o.startsWith("text/plain") || o.startsWith("text/html")) {
            const e = await i.text();
            this._handleResponse(e)
        } else if (o.startsWith("application/json")) {
            const e = await i.json();
            this._handleResponse(e)
        } else if (o.startsWith("application/xml")) {
            const e = await i.text(), t = (new DOMParser).parseFromString(e, "application/xml");
            this._handleResponse(t)
        } else {
            const e = await i.blob();
            this._handleResponse(e)
        }
        this.dispatch("submit-done", {})
    }

    _serialize(e, t) {
        if ("urlencoded-post" === this.method) {
            const e = new URLSearchParams;
            return Array.from(t.children).forEach(t => {
                e.append(t.nodeName, t.textContent)
            }), e
        }
        if ("xml" === e) {
            return (new XMLSerializer).serializeToString(t)
        }
        throw new Error("unknown instance type ", e)
    }

    _getHeaders() {
        const e = new Headers, t = this.getInstance(), s = y.getContentType(t, this.method);
        e.append("Content-Type", s), e.has("Accept") && e.delete("Accept");
        const n = this.querySelectorAll("fx-header");
        return Array.from(n).forEach(t => {
            const {name: s} = t, n = t.getValue();
            e.append(s, n)
        }), e
    }

    _getUrlExpr() {
        return this.storedTemplateExpressions.find(e => "url" === e.node.nodeName)
    }

    _getTargetInstance() {
        let e;
        if (e = this.instance ? this.model.getInstance(this.instance) : this.model.getInstance("default"), !e) throw new Error("target instance not found: " + e);
        return e
    }

    _handleResponse(e) {
        if (console.log("_handleResponse ", e), "instance" === this.replace) {
            const t = this._getTargetInstance();
            if (!t) throw new Error("target instance not found: " + t);
            if (this.targetref) {
                const s = N(this.targetref, t.instanceData.firstElementChild, this);
                console.log("theTarget", s);
                const n = e.firstElementChild, i = s.parentNode;
                i.replaceChild(n, s), console.log("finally ", i)
            } else {
                const s = e;
                t.instanceData = s, console.log("### replaced instance ", t.instanceData)
            }
            this.model.updateModel(), this.getOwnerForm().refresh()
        }
        if ("all" === this.replace && (document.getElementsByTagName("html")[0].innerHTML = e), "target" === this.replace) {
            const t = this.getAttribute("target");
            document.querySelector(t).innerHTML = e
        }
        "redirect" === this.replace && (window.location.href = e)
    }

    selectRelevant() {
        if ("keep" === this.nonrelevant) return this.nodeset;
        const e = this.getModel().getModelItem(this.nodeset);
        if (e && !e.relevant) return null;
        const t = (new DOMParser).parseFromString("<data></data>", "application/xml").firstElementChild;
        if (0 === this.nodeset.children.length && this._isRelevant(this.nodeset)) return this.nodeset;
        return this._filterRelevant(this.nodeset, t)
    }

    _filterRelevant(e, t) {
        const {childNodes: s} = e;
        return Array.from(s).forEach(e => {
            if (this._isRelevant(e)) {
                const s = e.cloneNode(!1);
                t.appendChild(s);
                const {attributes: n} = e;
                return n && Array.from(n).forEach(e => {
                    this._isRelevant(e) ? s.setAttribute(e.nodeName, e.value) : "empty" === this.nonrelevant ? s.setAttribute(e.nodeName, "") : s.removeAttribute(e.nodeName)
                }), this._filterRelevant(e, s)
            }
            return null
        }), t
    }

    _isRelevant(e) {
        const t = this.getModel().getModelItem(e);
        return !(t && !t.relevant)
    }

    _handleError() {
        this.dispatch("submit-error", {})
    }
}

customElements.define("fx-submission", H);

class z extends (P(HTMLElement)) {
    constructor() {
        if (super(), this.style.display = "none", this.attachShadow({mode: "open"}), this.shadowRoot.innerHTML = "", !this.hasAttribute("name")) throw new Error('required attribute "name" missing');
        this.name = this.getAttribute("name")
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = ""
    }
}

customElements.define("fx-header", z);

class V extends (P(HTMLElement)) {
    constructor() {
        super(), this.value = "", this.display = this.style.display, this.required = !1, this.readonly = !1, this.widget = null
    }

    getWidget() {
        throw new Error("You have to implement the method getWidget!")
    }

    async refresh(e) {
        const t = this.value;
        if (!this.isNotBound() && (this.evalInContext(), this.isBound())) {
            if (null === this.nodeset) return void (this.style.display = "none");
            if (this.modelItem = this.getModelItem(), this.modelItem instanceof D) {
                if (this.value = this.modelItem.value, await this.updateWidgetValue(), this.handleModelItemProperties(), !this.getOwnerForm().ready) return;
                t !== this.value && this.dispatch("value-changed", {path: this.modelItem.path})
            }
        }
    }

    async updateWidgetValue() {
        throw new Error("You have to implement the method updateWidgetValue!")
    }

    handleModelItemProperties() {
        this.handleRequired(), this.handleReadonly(), this.getOwnerForm().ready && this.handleValid(), this.handleRelevant()
    }

    _getForm() {
        return this.getModel().parentNode
    }

    _dispatchEvent(e) {
        this.getOwnerForm().ready && this.dispatch(e, {})
    }

    handleRequired() {
        this.widget = this.getWidget(), this.isRequired() !== this.modelItem.required && (this.modelItem.required ? (this.widget.setAttribute("required", "required"), this.classList.add("required"), this._dispatchEvent("required")) : (this.widget.removeAttribute("required"), this.required = !1, this.classList.toggle("required"), this._dispatchEvent("optional")))
    }

    handleReadonly() {
        this.isReadonly() !== this.modelItem.readonly && (this.modelItem.readonly && (this.widget.setAttribute("readonly", "readonly"), this.classList.toggle("readonly"), this._dispatchEvent("readonly")), this.modelItem.readonly || (this.widget.removeAttribute("readonly"), this.classList.toggle("readonly"), this._dispatchEvent("readwrite")))
    }

    handleValid() {
        const e = this.querySelector("fx-alert");
        if (this.isValid() !== this.modelItem.constraint) if (this.modelItem.constraint) this.classList.remove("invalid"), e && (e.style.display = "none"), this._dispatchEvent("valid"); else {
            if (this.classList.add("invalid"), e && (e.style.display = "block"), 0 !== this.modelItem.alerts.length) {
                const {alerts: e} = this.modelItem;
                console.log("alerts from bind: ", e);
                this.querySelector("fx-alert") || e.forEach(e => {
                    const t = document.createElement("fx-alert");
                    t.innerHTML = e, this.appendChild(t), t.style.display = "block"
                })
            }
            this._dispatchEvent("invalid")
        }
    }

    handleRelevant() {
        this.isEnabled() !== this.modelItem.relevant && (this.modelItem.relevant ? (this._dispatchEvent("relevant"), this.style.display = this.display) : (this._dispatchEvent("nonrelevant"), this.style.display = "none"))
    }

    isRequired() {
        return !!this.widget.hasAttribute("required")
    }

    isValid() {
        return !this.classList.contains("invalid")
    }

    isReadonly() {
        return !!this.widget.hasAttribute("readonly")
    }

    isEnabled() {
        return "none" !== this.style.display
    }

    _fadeOut(e) {
        e.style.opacity = 1, function t() {
            (e.style.opacity -= .1) < 0 ? e.style.display = "none" : requestAnimationFrame(t)
        }()
    }

    _fadeIn(e, t) {
        e.style.opacity = 0, e.style.display = t || "block", function t() {
            let s = parseFloat(e.style.opacity);
            (s += .1) > 1 || (e.style.opacity = s, requestAnimationFrame(t))
        }()
    }
}

window.customElements.define("fx-abstract-control", V);
customElements.define("fx-alert", class extends V {
    static get styles() {
        return c`:host{display:block;height:auto;font-size:.8em;font-weight:400;color:red;display:none}`
    }

    constructor() {
        super(), this.style.display = "none"
    }

    static get properties() {
        return {...super.properties}
    }

    render() {
        return u`<slot></slot>`
    }

    async updateWidgetValue() {
        console.log("alert update", this), this.innerHTML = this.value
    }
});

class $ extends V {
    constructor() {
        super(), this.inited = !1, this.attachShadow({mode: "open"})
    }

    connectedCallback() {
        this.updateEvent = this.hasAttribute("update-event") ? this.getAttribute("update-event") : "blur", this.valueProp = this.hasAttribute("value-prop") ? this.getAttribute("value-prop") : "value", this.label = this.hasAttribute("label") ? this.getAttribute("label") : null;
        this.shadowRoot.innerHTML = `\n            <style>\n                \n            :host{\n                display:inline-block;\n            }\n        \n            </style>\n            ${this.renderHTML(this.ref)}\n        `, this.widget = this.getWidget(), "enter" === this.updateEvent && (this.widget.addEventListener("keyup", e => {
            13 === e.keyCode && (e.preventDefault(), this.setValue(this.widget[this.valueProp]))
        }), this.updateEvent = "blur"), this.widget.addEventListener(this.updateEvent, () => {
            this.setValue(this.widget[this.valueProp])
        });
        this.shadowRoot.querySelector("slot");
        this.template = this.querySelector("template")
    }

    setValue(e) {
        const t = this.getModelItem(), s = this.shadowRoot.getElementById("setvalue");
        s.setValue(t, e), s.actionPerformed()
    }

    renderHTML(e) {
        return `\n            ${this.label ? "" + this.label : ""}\n            <slot></slot>\n            <fx-setvalue id="setvalue" ref="${e}"></fx-setvalue>\n        `
    }

    getWidget() {
        if (this.widget) return this.widget;
        let e = this.querySelector(".widget");
        if (e || (e = this.querySelector("input")), !e) {
            const e = document.createElement("input");
            return e.classList.add("widget"), e.setAttribute("type", "text"), this.appendChild(e), e
        }
        return e
    }

    async updateWidgetValue() {
        if ("checked" === this.valueProp) "true" === this.value ? this.widget.checked = !0 : this.widget.checked = !1; else {
            let {widget: e} = this;
            e || (e = this), e.value = this.value
        }
    }

    getTemplate() {
        return this.querySelector("template")
    }

    async refresh(e) {
        super.refresh();
        const t = this.getWidget();
        if (t.hasAttribute("ref")) {
            const e = t.getAttribute("ref"), s = N(e, q(this, e), this), {children: n} = t;
            if (Array.from(n).forEach(e => {
                "template" !== e.nodeName.toLowerCase() && e.parentNode.removeChild(e)
            }), this.template) if (s.length) Array.from(s).forEach(e => {
                const t = this.createEntry();
                this.updateEntry(t, e)
            }); else {
                const e = this.createEntry();
                this.updateEntry(e, s)
            }
        }
        y.refreshChildren(this, e)
    }

    updateEntry(e, t) {
        if ("SELECT" !== this.widget.nodeName) return;
        const s = this._getValueAttribute(e), n = s.value, i = N(n.substring(1, n.length - 1), t, e);
        s.value = i, this.value === i && e.setAttribute("selected", "selected");
        const o = e.textContent, r = R(o.substring(1, o.length - 1), t, e);
        e.textContent = r
    }

    createEntry() {
        const e = this.template.content.firstElementChild.cloneNode(!0), t = document.importNode(e, !0);
        return this.template.parentNode.appendChild(t), t
    }

    _getValueAttribute(e) {
        let t;
        return Array.from(e.attributes).forEach(e => {
            -1 !== e.value.indexOf("{") && (t = e)
        }), t
    }
}

window.customElements.define("fx-control", $);

class j extends (P(HTMLElement)) {
    constructor() {
        super(), this.attachShadow({mode: "open"})
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = "\n            <style>\n                \n        :host {\n            display: block;\n        }\n    \n            </style>\n            \n      <slot></slot>\n    \n    ", this.getOwnerForm().registerLazyElement(this)
    }

    refresh(e) {
        !e && this.hasAttribute("refresh-on-view") || (this.isBound() && (this.evalInContext(), this.modelItem = this.getModelItem()), this._getForm().ready && this.handleModelItemProperties(), y.refreshChildren(this, e))
    }

    handleModelItemProperties() {
        this.handleReadonly(), this.handleRelevant()
    }

    _getForm() {
        return this.getModel().parentNode
    }

    handleReadonly() {
        this.isReadonly() !== this.modelItem.readonly && (this.modelItem.readonly && (this.setAttribute("readonly", "readonly"), this.dispatchEvent(new CustomEvent("readonly", {}))), this.modelItem.readonly || (this.removeAttribute("readonly"), this.dispatchEvent(new CustomEvent("readwrite", {}))))
    }

    handleRelevant() {
        this.modelItem && this.isEnabled() !== this.modelItem.enabled && (this.modelItem.enabled ? this.dispatchEvent(new CustomEvent("enabled", {})) : this.dispatchEvent(new CustomEvent("disabled", {})))
    }

    isReadonly() {
        return !!this.hasAttribute("readonly")
    }

    isEnabled() {
        return "none" !== this.style.display
    }
}

window.customElements.define("fx-container", j);
window.customElements.define("fx-group", class extends j {
    static get properties() {
        return {...super.properties, collapse: {type: Boolean, reflect: !0}}
    }

    constructor() {
        super(), this.collapse = !1
    }

    render() {
        return u`<slot></slot>`
    }

    handleModelItemProperties() {
        this.handleRelevant()
    }

    initializeChildren(e) {
        const t = Array.from(e.children);
        console.log("_initializeChildren ", t), t.forEach(e => {
            if (console.log("child ", e), y.isUiElement(e.nodeName)) e.init(this.model); else if (0 !== e.children.length) {
                Array.from(e.children).forEach(e => {
                    this.initializeChildren(e)
                })
            }
        }), console.groupEnd()
    }
});
customElements.define("fx-hint", class extends V {
    static get styles() {
        return c`:host{display:block;height:auto;font-size:.8em;font-weight:400;font-style:italic}`
    }

    static get properties() {
        return {...super.properties}
    }

    render() {
        return u`<slot></slot>`
    }
});
customElements.define("fx-output", class extends V {
    static get properties() {
        return {...super.properties, valueAttr: {type: String}}
    }

    constructor() {
        super(), this.attachShadow({mode: "open"}), this.valueAttr = this.hasAttribute("value") ? this.getAttribute("value") : null
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = '\n            <style>\n                \n          :host {\n            display: inline-block;\n          }\n          #widget {\n            display: inline-block;\n          }\n          .label{\n            display: inline-block;\n          }\n        \n            </style>\n            \n            <slot name="label"></slot>\n            <span id="value">\n                <slot></slot>\n            </span>\n        \n        ', this.addEventListener("slotchange", e => {
            console.log("slotchange ", e)
        })
    }

    async refresh() {
        if (this.valueAttr) return this.value = this.getValue(), void await this.updateWidgetValue();
        this.ref && super.refresh()
    }

    getValue() {
        try {
            const e = q(this, this.valueAttr);
            return this.hasAttribute("html") ? N(this.valueAttr, e, this) : R(this.valueAttr, e, this)
        } catch (e) {
            console.error(e), this.dispatch("error", {message: e})
        }
        return null
    }

    getWidget() {
        return this.shadowRoot.getElementById("value")
    }

    async updateWidgetValue() {
        const e = this.shadowRoot.getElementById("value");
        if (this.hasAttribute("html")) return this.modelItem.node ? void (e.innerHTML = this.modelItem.node.outerHTML) : void (e.innerHTML = this.value.outerHTML);
        e.innerHTML = this.value
    }

    isReadonly() {
        return this.readonly = !0, this.readonly
    }
});

class W extends (P(HTMLElement)) {
    static get properties() {
        return {inited: {type: Boolean}}
    }

    constructor() {
        super(), this.inited = !1, this.addEventListener("click", this._dispatchIndexChange), this.addEventListener("focusin", this._dispatchIndexChange), this.attachShadow({
            mode: "open",
            delegatesFocus: !0
        })
    }

    _handleFocus() {
        this.parentNode.setIndex(this.index)
    }

    _dispatchIndexChange() {
        this.parentNode && this.parentNode.dispatchEvent(new CustomEvent("item-changed", {
            composed: !0,
            bubbles: !0,
            detail: {item: this}
        }))
    }

    connectedCallback() {
        this.display = this.style.display;
        this.shadowRoot.innerHTML = "\n            \n           <slot></slot>\n        \n        ", this.getOwnerForm().registerLazyElement(this)
    }

    disconnectedCallback() {
        this.removeEventListener("click", this._dispatchIndexChange()), this.removeEventListener("focusin", this._handleFocus)
    }

    init() {
        this.inited = !0
    }

    getModelItem() {
        return super.getModelItem(), this.getModelItem()[this.index]
    }

    refresh(e) {
        this.modelItem = this.getModel().getModelItem(this.nodeset), this.modelItem && !this.modelItem.relevant ? this.style.display = "none" : this.style.display = this.display, y.refreshChildren(this, e)
    }
}

window.customElements.define("fx-repeatitem", W);

class G extends (P(HTMLElement)) {
    static get properties() {
        return {
            ...super.properties,
            index: {type: Number},
            template: {type: Object},
            focusOnCreate: {type: String},
            initDone: {type: Boolean},
            repeatIndex: {type: Number},
            nodeset: {type: Array}
        }
    }

    constructor() {
        super(), this.ref = "", this.dataTemplate = [], this.focusOnCreate = "", this.initDone = !1, this.repeatIndex = 1, this.nodeset = [], this.inited = !1, this.index = 1, this.repeatSize = 0, this.attachShadow({
            mode: "open",
            delegatesFocus: !0
        })
    }

    get repeatSize() {
        return this.querySelectorAll(":scope > fx-repeatitem").length
    }

    set repeatSize(e) {
        this.size = e
    }

    setIndex(e) {
        this.index = e;
        const t = this.querySelectorAll(":scope > fx-repeatitem");
        this.applyIndex(t[this.index - 1])
    }

    applyIndex(e) {
        this._removeIndexMarker(), e && e.setAttribute("repeat-index", "")
    }

    get index() {
        return this.getAttribute("index")
    }

    set index(e) {
        this.setAttribute("index", e)
    }

    connectedCallback() {
        this.ref = this.getAttribute("ref"), this.addEventListener("item-changed", e => {
            console.log("handle index event ", e);
            const {item: t} = e.detail, s = Array.from(this.children).indexOf(t);
            this.applyIndex(this.children[s]), this.index = s + 1
        }), this.addEventListener("index-changed", e => {
            if (e.stopPropagation(), !e.target === this) return;
            console.log("handle index event ", e);
            const {index: t} = e.detail;
            this.index = t, this.applyIndex(this.children[t - 1])
        }), document.addEventListener("insert", e => {
            const t = e.detail.insertedNodes;
            this.index = e.detail.position, console.log("insert catched", t, this.index)
        }), this.getOwnerForm().lazyRefresh && (this.mutationObserver = new MutationObserver(e => {
            console.log("mutations", e), this.refresh(!0)
        })), this.getOwnerForm().registerLazyElement(this);
        this.shadowRoot.innerHTML = '\n            <style>\n                \n      :host{\n        display:none;\n      }\n       .fade-out-bottom {\n          -webkit-animation: fade-out-bottom 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;\n          animation: fade-out-bottom 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;\n      }\n      .fade-out-bottom {\n          -webkit-animation: fade-out-bottom 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;\n          animation: fade-out-bottom 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;\n      }\n   \n            </style>\n            \n          <slot name="header"></slot>\n          <slot></slot>\n        \n        '
    }

    init() {
        this._evalNodeset(), this._initTemplate(), this._initRepeatItems(), this.setAttribute("index", this.index), this.inited = !0
    }

    _evalNodeset() {
        const e = q(this, this.ref);
        this.mutationObserver && e.nodeName && this.mutationObserver.observe(e, {childList: !0, subtree: !0});
        const t = N(this.ref, e, this.getOwnerForm());
        if (null !== t) {
            if ("object" == typeof t) {
                if ("nodeType" in t) return void (this.nodeset = [t]);
                if (Array.isArray(t)) return void (this.nodeset = t)
            }
            throw new Error("Unexpected result of repeat nodeset: " + t)
        }
        this.nodeset = []
    }

    async refresh(e) {
        this.inited || this.init(), console.time("repeat-refresh", this), this._evalNodeset();
        const t = this.querySelectorAll(":scope > fx-repeatitem"), s = t.length;
        let n = 1;
        Array.isArray(this.nodeset) && (n = this.nodeset.length);
        const i = n;
        if (i < s) for (let e = s; e > i; e -= 1) {
            const s = t[e - 1];
            s.parentNode.removeChild(s), this.getOwnerForm().unRegisterLazyElement(s)
        }
        if (i > s) for (let e = s + 1; e <= i; e += 1) {
            const t = document.createElement("fx-repeatitem"), s = this._clone();
            t.appendChild(s), this.appendChild(t), t.nodeset = this.nodeset[e - 1], t.index = e
        }
        for (let e = 0; e < s; e += 1) {
            const s = t[e];
            this.getOwnerForm().registerLazyElement(s), s.nodeset !== this.nodeset[e] && (s.nodeset = this.nodeset[e])
        }
        this.getOwnerForm().lazyRefresh && !e || y.refreshChildren(this, e), this.style.display = "block", this.setIndex(this.index), console.timeEnd("repeat-refresh"), console.groupEnd()
    }

    _fadeOut(e) {
        e.style.opacity = 1, function t() {
            (e.style.opacity -= .1) < 0 ? e.style.display = "none" : requestAnimationFrame(t)
        }()
    }

    _fadeIn(e) {
        e && (e.style.opacity = 0, e.style.display = this.display, function t() {
            let s = parseFloat(e.style.opacity);
            (s += .1) > 1 || (e.style.opacity = s, requestAnimationFrame(t))
        }())
    }

    _initTemplate() {
        this.template = this.querySelector("template"), null === this.template && this.dispatchEvent(new CustomEvent("no-template-error", {
            composed: !0,
            bubbles: !0,
            detail: {message: "no template found for repeat:" + this.id}
        })), this.shadowRoot.appendChild(this.template)
    }

    _initRepeatItems() {
        this.nodeset.forEach((e, t) => {
            const s = document.createElement("fx-repeatitem");
            s.nodeset = this.nodeset[t], s.index = t + 1;
            const n = this._clone();
            s.appendChild(n), this.appendChild(s), 1 === s.index && this.applyIndex(s)
        })
    }

    _clone() {
        this.template = this.shadowRoot.querySelector("template");
        const e = this.template.content.cloneNode(!0);
        return document.importNode(e, !0)
    }

    _removeIndexMarker() {
        Array.from(this.children).forEach(e => {
            e.removeAttribute("repeat-index")
        })
    }
}

window.customElements.define("fx-repeat", G);
window.customElements.define("fx-switch", class extends j {
    connectedCallback() {
        super.connectedCallback && super.connectedCallback();
        this.shadowRoot.innerHTML = "\n        <style>\n            \n       :host ::slotted(fx-case.selected-case){\n        display: block !important;\n    }\n    \n        </style>\n        \n       <slot></slot>\n    \n    "
    }

    refresh() {
        super.refresh(), console.log("refresh on switch ");
        const e = this.querySelectorAll("fx-case");
        if (this.isBound()) Array.from(e).forEach(e => {
            e.getAttribute("name") === this.modelItem.value ? e.classList.add("selected-case") : e.classList.remove("selected-case")
        }); else {
            this.querySelector(".selected-case") || e[0].classList.add("selected-case")
        }
        y.refreshChildren(this)
    }

    toggle(e) {
        const t = this.querySelectorAll("fx-case");
        Array.from(t).forEach(t => {
            e === t ? t.classList.add("selected-case") : t.classList.remove("selected-case")
        })
    }
});
customElements.define("fx-trigger", class extends V {
    connectedCallback() {
        this.attachShadow({mode: "open"}), this.ref = this.hasAttribute("ref") ? this.getAttribute("ref") : null;
        this.shadowRoot.innerHTML = `\n                <style>\n                    \n          :host {\n            cursor:pointer;\n          }\n        \n                </style>\n                ${this.renderHTML()}\n        `;
        const e = this.shadowRoot.querySelector("slot");
        e.addEventListener("slotchange", () => {
            const t = e.assignedElements({flatten: !0});
            t[0].setAttribute("tabindex", "0"), t[0].setAttribute("role", "button");
            const s = t[0];
            s.addEventListener("click", e => this.performActions(e)), this.widget = s, "BUTTON" !== s.nodeName && s.addEventListener("keypress", e => {
                "Space" !== e.code && "Enter" !== e.code || this.performActions(e)
            })
        })
    }

    renderHTML() {
        return "\n            <slot></slot>\n    "
    }

    getWidget() {
        return this.widget
    }

    async updateWidgetValue() {
        return console.log("trigger update", this), null
    }

    handleReadonly() {
        super.handleReadonly(), this.widget.hasAttribute("readonly") ? this.widget.setAttribute("disabled", "disabled") : this.widget.removeAttribute("disabled")
    }

    async performActions(e) {
        const t = this.closest("fx-repeatitem");
        t && (console.log("repeated click"), t.click());
        (async () => {
            for (let t = 0; t < this.children.length; t += 1) {
                const s = this.children[t];
                "function" == typeof s.execute && await s.execute(e)
            }
        })()
    }
});

class Y extends HTMLElement {
    constructor() {
        super(), this.attachShadow({mode: "open"})
    }

    connectedCallback() {
        this.hasAttribute("label") && (this.label = this.getAttribute("label")), this.hasAttribute("name") && (this.name = this.getAttribute("name")), this.hasAttribute("selected") && (this.selected = this.getAttribute("selected"));
        const e = `\n           ${this.label ? `<span>${this.label}</span>` : ""}\n           <slot></slot>\n        `;
        this.shadowRoot.innerHTML = `\n            <style>\n                \n            :host {\n                display: none;\n            }\n        \n            </style>\n            ${e}\n    `, this.style.display = "none"
    }
}

window.customElements.define("fx-case", Y);

async function Q(e) {
    return new Promise(t => setTimeout(() => t(), e))
}

customElements.define("fx-items", class extends ${static get properties(){return{...super.properties,valueAttr:{type:String}
}
}
constructor()
{
    super(), this.valueAttr = this.hasAttribute("value") ? this.getAttribute("value") : null
}
connectedCallback()
{
    super.connectedCallback(), this.addEventListener("click", e => {
        const t = this.querySelectorAll("[value]");
        let s;
        "LABEL" === e.target.nodeName && (s = document.getElementById(e.target.getAttribute("for")), s.checked = !s.checked);
        let n = "";
        Array.from(t).forEach(e => {
            e.checked && (n += " " + e.getAttribute("value"))
        }), this.setAttribute("value", n.trim());
        const i = this.parentNode.closest("[ref]");
        if (!i) return;
        const o = i.getModelItem(), r = this.shadowRoot.getElementById("setvalue");
        r.setValue(o, n.trim()), r.actionPerformed()
    })
}
getWidget()
{
    return this
}
async
updateWidgetValue()
{
    const e = this.parentNode.closest("[ref]");
    e && (this.value = e.value), this.setAttribute("value", this.value)
}
updateEntry(e, t)
{
    const s = e.querySelector("label");
    s.textContent = t.textContent;
    const n = y.createUUID();
    s.setAttribute("for", n);
    const i = e.querySelector("[value]"), o = i.value, r = N(o.substring(1, o.length - 1), t, e),
        a = this.getAttribute("value");
    i.value = r, i.setAttribute("id", n), -1 !== a.indexOf(i.value) && (i.checked = !0)
}
})
;

class J extends (P(HTMLElement)) {
    static get properties() {
        return {
            ...super.properties,
            detail: {type: Object},
            needsUpdate: {type: Boolean},
            event: {type: Object},
            target: {type: String},
            ifExpr: {type: String},
            whileExpr: {type: String},
            delay: {type: Number}
        }
    }

    constructor() {
        super(), this.detail = {}, this.needsUpdate = !1
    }

    connectedCallback() {
        this.style.display = "none", this.repeatContext = void 0, this.hasAttribute("event") ? this.event = this.getAttribute("event") : this.event = "activate", this.target = this.getAttribute("target"), this.target ? "#window" === this.target ? window.addEventListener(this.event, e => this.execute(e)) : "#document" === this.target ? document.addEventListener(this.event, e => this.execute(e)) : (this.targetElement = document.getElementById(this.target), this.targetElement.addEventListener(this.event, e => this.execute(e))) : (this.targetElement = this.parentNode, this.targetElement.addEventListener(this.event, e => this.execute(e))), this.ifExpr = this.hasAttribute("if") ? this.getAttribute("if") : null, this.whileExpr = this.hasAttribute("while") ? this.getAttribute("while") : null, this.delay = this.hasAttribute("delay") ? Number(this.getAttribute("delay")) : 0
    }

    async execute(e) {
        if (console.log("executing", this), e && e.detail && (this.detail = e.detail), this.needsUpdate = !1, this.evalInContext(), this.targetElement && this.targetElement.nodeset && (this.nodeset = this.targetElement.nodeset), !this.ifExpr || _(this.ifExpr, this.nodeset, this.getOwnerForm())) {
            if (this.whileExpr) {
                const e = async () => {
                    await Q(this.delay || 0), this.ownerDocument.contains(this) && _(this.whileExpr, this.nodeset, this.getOwnerForm()) && (this.perform(), await e())
                };
                return await e(), void this.actionPerformed()
            }
            !this.delay || (await Q(this.delay), this.ownerDocument.contains(this)) ? (this.perform(), this.actionPerformed()) : this.actionPerformed()
        }
    }

    perform() {
        (this.isBound() || "FX-ACTION" === this.nodeName) && this.evalInContext()
    }

    actionPerformed() {
        if (this.needsUpdate) {
            const e = this.getModel();
            e.recalculate(), e.revalidate(), e.parentNode.refresh(!0), this._dispatchActionPerformed()
        }
    }

    _dispatchActionPerformed() {
        console.log("action-performed ", this), this.dispatchEvent(new CustomEvent("action-performed", {
            composed: !0,
            bubbles: !0,
            detail: {}
        }))
    }
}

window.customElements.define("abstract-action", J);
window.customElements.define("fx-append", class extends J {
    static get properties() {
        return {ref: {type: String}, repeat: {type: String}, clear: {type: String}}
    }

    constructor() {
        super(), this.repeat = ""
    }

    connectedCallback() {
        super.connectedCallback(), console.log("connectedCallback ", this), this.ref = this.getAttribute("ref"), this.repeat = this.getAttribute("repeat")
    }

    perform() {
        super.perform(), this._dataFromTemplate(), this.needsUpdate = !0
    }

    actionPerformed() {
        super.actionPerformed(), this.dispatch()
    }

    _dataFromTemplate() {
        const e = this.getInScopeContext(), t = this.getOwnerForm().querySelector("#" + this.repeat),
            s = t.shadowRoot.querySelector("template"), n = e.ownerDocument.createElement(t.ref),
            i = this._generateInstance(s.content, n);
        e.appendChild(i)
    }

    dispatch() {
        let e;
        y.isRepeated(this) ? (console.log("append repeated ", this.repeatContext), e = y.getRepeatTarget(this, this.repeat)) : e = document.getElementById(this.repeat), console.log("dispatching index change ", e.nodeset.length), e.dispatchEvent(new CustomEvent("index-changed", {
            composed: !0,
            bubbles: !0,
            detail: {index: e.nodeset.length}
        }))
    }

    _clear(e) {
        let t = e.firstChild;
        const s = e.attributes;
        for (let e = 0; e < s.length; e += 1) s[e].value = "";
        for (; t;) 1 === t.nodeType && t.hasAttributes() && (t.textContent = ""), this._clear(t), t = t.nextSibling
    }

    _generateInstance(e, t) {
        if (1 === e.nodeType && e.hasAttribute("ref")) {
            const s = e.getAttribute("ref");
            let n;
            "." === s || (s.startsWith("@") ? t.setAttribute(s.substring(1), "") : (n = document.createElement(s), t.appendChild(n), 0 === e.children.length && (n.textContent = e.textContent)))
        }
        if (e.hasChildNodes()) {
            const s = e.children;
            for (let e = 0; e < s.length; e += 1) this._generateInstance(s[e], t)
        }
        return t
    }

    getInstanceId() {
        return this.ref.startsWith("instance(") ? "not implemented" : "default"
    }
});
window.customElements.define("fx-delete", class extends J {
    constructor() {
        super(), this.repeatId = ""
    }

    perform() {
        if (super.perform(), console.log("##### fx-delete executing..."), console.log("delete nodeset ", this.nodeset), "" === this.repeatId) {
            const e = this.parentNode.closest("fx-repeatitem"), t = Array.from(e.parentNode.children).indexOf(e) + 1;
            this.model = this.getModel();
            const s = this.parentNode.closest("fx-repeat");
            let n;
            n = Array.isArray(this.nodeset) ? this.nodeset[t - 1] : this.nodeset;
            n.parentNode.removeChild(n), e.parentNode.removeChild(e);
            const {repeatSize: i} = s;
            1 === t || 1 === i ? s.setIndex(1) : t > i ? s.setIndex(i) : s.setIndex(t)
        }
        this.needsUpdate = !0
    }

    actionPerformed() {
        this.getModel().rebuild(), super.actionPerformed()
    }
});
window.customElements.define("fx-insert", class extends J {
    constructor() {
        super(), this.attachShadow({mode: "open"})
    }

    connectedCallback() {
        super.connectedCallback && super.connectedCallback();
        this.shadowRoot.innerHTML = "\n        <style>\n            \n        :host{\n            display:none;\n        }\n    \n        </style>\n        <slot></slot>\n    ", this.at = Number(this.hasAttribute("at") ? this.getAttribute("at") : 0), this.position = this.hasAttribute("position") ? this.getAttribute("position") : "after", this.origin = this.hasAttribute("origin") ? this.getAttribute("origin") : null, this.keepValues = !!this.hasAttribute("keep-values")
    }

    _cloneOriginSequence(e, t) {
        let s;
        if (this.origin) {
            let t;
            try {
                t = I(this.origin, e, this.getOwnerForm()), Array.isArray(t) && 0 === t.length && (console.warn("invalid origin for this insert action - ignoring...", this), s = null), s = t.cloneNode(!0)
            } catch (e) {
                console.warn("invalid origin for this insert action - ignoring...", this)
            }
        } else t && (s = this._cloneTargetSequence(t), s && !this.keepValues && this._clear(s));
        return s
    }

    _getInsertIndex(e, t) {
        return 0 === t.length ? null : this.hasAttribute("at") ? L(this.getAttribute("at"), e, this.getOwnerForm()) : t.length
    }

    perform() {
        const e = q(this, this.ref), t = C(this.ref, e, this.getOwnerForm()), s = this._cloneOriginSequence(e, t);
        if (!s) return;
        let n, i;
        this._getInsertIndex(e, t);
        if (0 === t.length) n = e, e.appendChild(s), i = 1, console.log("appended", e); else {
            if (this.hasAttribute("at") ? (i = L(this.getAttribute("at"), e, this.getOwnerForm()), n = t[i - 1]) : (i = t.length, n = t[t.length - 1]), !n) {
                i = 1, n = t;
                i = N("count(preceding::*)", t, this.getOwnerForm()) + 1
            }
            this.position && "before" === this.position && n.parentNode.insertBefore(s, n), this.position && "after" === this.position && (i += 1, n.insertAdjacentElement("afterend", s))
        }
        document.dispatchEvent(new CustomEvent("insert", {
            composed: !0,
            bubbles: !0,
            detail: {insertedNodes: s, position: i}
        })), this.needsUpdate = !0
    }

    _cloneTargetSequence(e) {
        return Array.isArray(e) && 0 !== e.length ? e[e.length - 1].cloneNode(!0) : !Array.isArray(e) && e ? e.cloneNode(!0) : null
    }

    actionPerformed() {
        this.getModel().rebuild(), super.actionPerformed()
    }

    _clear(e) {
        const t = e.attributes;
        for (let e = 0; e < t.length; e += 1) t[e].value = "";
        e.textContent && (e.textContent = "");
        let s = e.firstChild;
        for (; s;) 1 === s.nodeType && s.hasAttributes() && (s.textContent = ""), this._clear(s), s = s.nextSibling
    }
});
window.customElements.define("fx-message", class extends J {
    constructor() {
        super(), this.attachShadow({mode: "open"})
    }

    connectedCallback() {
        super.connectedCallback(), this.event = this.hasAttribute("event") ? this.getAttribute("event") : "", this.level = this.hasAttribute("level") ? this.getAttribute("level") : "ephemeral";
        this.shadowRoot.innerHTML = `\n        <style>\n            \n        :host{\n            display:none;\n        }\n    \n        </style>\n        ${this.renderHTML()}\n    `
    }

    disconnectedCallback() {
        this.targetElement.removeEventListener(this.event, e => this.execute(e))
    }

    renderHTML() {
        return "\n        <slot></slot>\n    "
    }

    perform() {
        let e;
        super.perform(), e = this.hasAttribute("value") ? this.getValue() : this.textContent, this.dispatchEvent(new CustomEvent("message", {
            composed: !0,
            bubbles: !0,
            detail: {level: this.level, message: e}
        }))
    }
});
window.customElements.define("fx-setvalue", class extends J {
    static get properties() {
        return {...super.properties, ref: {type: String}, valueAttr: {type: String}}
    }

    constructor() {
        super(), this.ref = "", this.valueAttr = ""
    }

    connectedCallback() {
        if (super.connectedCallback && super.connectedCallback(), !this.hasAttribute("ref")) throw new Error('fx-setvalue must specify a "ref" attribute');
        this.ref = this.getAttribute("ref"), this.valueAttr = this.getAttribute("value")
    }

    perform() {
        super.perform();
        let {value: e} = this;
        e = null !== this.valueAttr ? N(this.valueAttr, this.nodeset, this.getOwnerForm(), this.detail) : "" !== this.textContent ? this.textContent : "";
        const t = this.getModelItem();
        this.setValue(t, e)
    }

    setValue(e, t) {
        console.log("setvalue[1]  ", e, t);
        const s = e;
        s && s.value !== t && (s.value = t, s.changed = !0, this.needsUpdate = !0, console.log("setvalue[2] ", s, t))
    }
});
window.customElements.define("fx-send", class extends J {
    constructor() {
        super(), this.value = ""
    }

    connectedCallback() {
        super.connectedCallback(), this.submission = this.getAttribute("submission")
    }

    perform() {
        super.perform(), console.log("submitting ", this.submission), console.log("submitting model", this.getModel());
        const e = this.getModel().querySelector("#" + this.submission);
        if (null === e) throw this.dispatchEvent(new CustomEvent("error", {
            composed: !0,
            bubbles: !0,
            detail: {message: `fx-submission element with id: '${this.submission}' not found`}
        })), new Error(`submission with id: ${this.submission} not found`);
        console.log("submission", e), e.submit()
    }
});

class K extends J {
    constructor() {
        super(), this.attachShadow({mode: "open"})
    }

    connectedCallback() {
        super.connectedCallback && super.connectedCallback(), this.src = this.hasAttribute("src") ? this.getAttribute("src") : null;
        this.shadowRoot.innerHTML = "\n        <style>\n            \n        :host{\n            display:none;\n        }\n    \n        </style>\n        <slot></slot>\n    "
    }

    perform() {
        const {children: e} = this;
        if (this.src) {
            this.innerHTML = "", console.log("### fx-script.perform ");
            const e = document.createElement("script");
            e.src = this.src, this.appendChild(e)
        } else Array.from(e).forEach(e => {
            e.detail = this.detail, e.execute()
        }), this.dispatchActionPerformed()
    }
}

window.customElements.define("fx-action", K);
window.customElements.define("fx-toggle", class extends K {
    connectedCallback() {
        this.hasAttribute("case") && (this.case = this.getAttribute("case"))
    }

    execute() {
        if (console.log("### fx-toggle.execute "), this.case) {
            const e = this.getOwnerForm().querySelector("#" + this.case);
            e.parentNode.toggle(e)
        }
    }
});
window.customElements.define("fx-dispatch", class extends J {
    constructor() {
        super(), this.name = null, this.targetid = null, this.details = null, this.attachShadow({mode: "open"})
    }

    connectedCallback() {
        if (super.connectedCallback(), this.name = this.getAttribute("name"), !this.name) throw new Error("no event specified for dispatch", this);
        this.targetid = this.hasAttribute("targetid") ? this.getAttribute("targetid") : null
    }

    perform() {
        console.log("### fx-dispatch.perform ", this);
        const e = this.querySelectorAll("fx-property"), t = {};
        if (Array.from(e).forEach(e => {
            console.log("prop ", e);
            const s = e.getAttribute("name"), n = e.getAttribute("value"), i = e.getAttribute("expr");
            if (i) {
                if (n) throw new Error('if "expr" is given there must not be a "value" attribute');
                const e = N(i, this.getInScopeContext(), this.getOwnerForm());
                let o = null;
                if (e.nodeName) {
                    o = (new XMLSerializer).serializeToString(e)
                }
                t[s] = o || e
            }
            n && (t[s] = n)
        }), console.log("details ", t), this.targetid) {
            let e;
            if (e = m.isRepeated(this) ? M(this.targetid, this.parentNode, null) : document.getElementById(this.targetid), console.log("target", e), !e) throw new Error(`targetid ${this.targetid} does not exist in document`);
            e.dispatchEvent(new CustomEvent(this.name, {composed: !0, bubbles: !0, detail: t}))
        } else document.dispatchEvent(new CustomEvent(this.name, {composed: !0, bubbles: !0, detail: t}))
    }
});
window.customElements.define("fx-update", class extends J {
    perform() {
        this.getModel().updateModel()
    }
});
window.customElements.define("fx-refresh", class extends J {
    perform() {
        this.getOwnerForm().refresh()
    }
});
window.customElements.define("fx-confirm", class extends K {
    connectedCallback() {
        this.message = this.hasAttribute("message") ? this.getAttribute("message") : null
    }

    perform() {
        window.confirm(this.message) && super.perform()
    }
});

class Z extends (P(HTMLElement)) {
    constructor() {
        super(), this.attachShadow({mode: "open"})
    }

    connectedCallback() {
        this.style.display = "none", this.signature = this.hasAttribute("signature") ? this.getAttribute("signature") : null, null === this.signature && console.error("signature is a required attribute"), this.type = this.hasAttribute("type") ? this.getAttribute("type") : null, this.shadowRoot.innerHTML = "<slot></slot>", this.override = this.hasAttribute("override") ? this.getAttribute("override") : "true", this.functionBody = this.innerText;
        const e = this.getAttribute("type") || "text/xpath",
            t = this.signature.match(/(?:(?<prefix>[^:]*):)?(?<localName>[^(]+)\((?<params>(?:\(\)|[^)])*)\)(?: as (?<returnType>.*))?/);
        if (!t) throw new Error(`Function signature ${this.signature} could not be parsed`);
        const {prefix: n, localName: i, params: o, returnType: r} = t.groups, a = "local" === n ? {
            namespaceURI: "http://www.w3.org/2005/xquery-local-functions",
            localName: i
        } : `${n}:${i}`, l = o ? o.split(",").map(e => {
            const t = e.match(/(?<variableName>\$[^\s]+)(?:\sas\s(?<varType>.+))/);
            if (!t) throw new Error(`Param ${e} could not be parsed`);
            const {variableName: s, varType: n} = t.groups;
            return {variableName: s, variableType: n || "item()*"}
        }) : [];
        switch (e) {
            case"text/javascript": {
                const e = new Function("_domFacade", ...l.map(e => e.variableName), "form", this.functionBody);
                s(a, l.map(e => e.variableType), r || "item()*", (...t) => e.apply(this.getInScopeContext(), [...t, this.getOwnerForm()]));
                break
            }
            case"text/xpath": {
                const e = (e, ...t) => N(this.functionBody, this.getInScopeContext(), this.getOwnerForm(), l.reduce((e, s, n) => (e[s.variableName.replace("$", "")] = t[n], e), {}));
                s(a, l.map(e => e.variableType), r || "item()*", e);
                break
            }
            default:
                throw new Error(`Unexpected mimetype ${e} for function`)
        }
    }
}

customElements.define("fx-function", Z);
//# sourceMappingURL=fore.js.map
