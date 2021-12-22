function e(e, t, n, r) {
    const a = {op: t, func: n, data: r};
    return e.push(a), a
}

function t(e, t) {
    return e
}

class n {
    constructor() {
        this.program = []
    }

    test(t, n) {
        return e(this.program, 5, t, void 0 === n ? null : n)
    }

    jump(t) {
        return e(this.program, 3, null, t)
    }

    record(n, r) {
        return e(this.program, 4, void 0 === r ? t : r, n)
    }

    bad(t = 1) {
        return e(this.program, 1, null, t)
    }

    accept() {
        return e(this.program, 0, null, null)
    }

    fail(t) {
        return e(this.program, 2, t || null, null)
    }
}

class r {
    constructor(e, t, n) {
        this.programLength = e, this.maxFromByPc = t, this.maxSurvivorFromByPc = n
    }

    static fromProgram(e) {
        const t = e.length, n = [], a = [];
        return e.forEach(e => {
            n.push(0), a.push(0)
        }), e.forEach((e, r) => {
            switch (e.op) {
                case 2:
                    if (null === e.func) return;
                    if (r + 1 >= t) throw new Error("Invalid program: program could run past end");
                    n[r + 1] += 1;
                    break;
                case 1:
                case 4:
                    if (r + 1 >= t) throw new Error("Invalid program: program could run past end");
                    n[r + 1] += 1;
                    break;
                case 3:
                    e.data.forEach(e => {
                        if (e < 0 || e >= t) throw new Error("Invalid program: program could run past end");
                        n[e] += 1
                    });
                    break;
                case 5:
                    if (r + 1 >= t) throw new Error("Invalid program: program could run past end");
                    a[r + 1] += 1;
                    break;
                case 0:
                    a[r] += 1
            }
        }), new r(t, n, a)
    }

    static createStub(e) {
        const t = [], n = [];
        for (let r = 0; r < e; ++r) t.push(e), n.push(e);
        return new r(e, t, n)
    }
}

class a {
    constructor(e) {
        this.acceptingTraces = e, this.success = e.length > 0
    }
}

class i {
    constructor(e) {
        this.t = 0, this.i = 0, this.h = new Uint16Array(e), this.l = new Uint8Array(e)
    }

    getBadness(e) {
        return this.l[e]
    }

    add(e, t) {
        this.l[e] = t > 255 ? 255 : t;
        const n = function (e, t, n, r, a) {
            let i = r, o = a;
            for (; i < o;) {
                const r = i + o >>> 1;
                n < t[e[r]] ? o = r : i = r + 1
            }
            return i
        }(this.h, this.l, t, this.i, this.t);
        this.h.copyWithin(n + 1, n, this.t), this.h[n] = e, this.t += 1
    }

    reschedule(e, t) {
        const n = Math.max(this.l[e], t > 255 ? 255 : t);
        if (this.l[e] !== n) {
            const t = this.h.indexOf(e, this.i);
            if (t < 0 || t >= this.t) return void (this.l[e] = n);
            this.h.copyWithin(t, t + 1, this.t), this.t -= 1, this.add(e, n)
        }
    }

    getNextPc() {
        return this.i >= this.t ? null : this.h[this.i++]
    }

    reset() {
        this.t = 0, this.i = 0, this.l.fill(0)
    }
}

class o {
    constructor(e) {
        this.o = [];
        let t = e.length;
        e.forEach(e => {
            this.o.push(e > 0 ? t : -1), t += e
        }), this.u = new Uint16Array(t)
    }

    clear() {
        this.u.fill(0, 0, this.o.length)
    }

    add(e, t) {
        const n = this.u[t], r = this.o[t];
        this.u[t] += 1, this.u[r + n] = e
    }

    has(e) {
        return this.u[e] > 0
    }

    forEach(e, t) {
        const n = this.u[e], r = this.o[e];
        for (let e = r; e < r + n; ++e) t(this.u[e])
    }
}

function s(e, t, n = !1) {
    return null === e ? t : Array.isArray(e) ? (-1 === e.indexOf(t) && (n && (e = e.slice()), e.push(t)), e) : e === t ? e : [e, t]
}

class u {
    constructor(e, t) {
        this.prefixes = e, this.record = t
    }
}

function l(e, t) {
    let n;
    if (null === t) {
        if (!Array.isArray(e)) return e;
        n = e
    } else n = e === u.EMPTY ? [] : Array.isArray(e) ? e : [e];
    return new u(n, t)
}

u.EMPTY = new u([], null);

class c {
    constructor(e) {
        this.p = [], this.v = [];
        for (let t = 0; t < e; ++t) this.p.push(0), this.v.push(null)
    }

    mergeTraces(e, t, n, r, a, i) {
        let o = !1;
        return n.forEach(t, t => {
            const n = this.trace(t, r, a, i);
            var u, l, c;
            l = n, c = o, e = null === (u = e) ? l : null === l ? u : Array.isArray(l) ? l.reduce((e, t) => s(e, t, e === l), u) : s(u, l, c), o = e === n
        }), e
    }

    trace(e, t, n, r) {
        switch (this.p[e]) {
            case 2:
                return this.v[e];
            case 1:
                return null
        }
        this.p[e] = 1;
        let a = null;
        const i = t[e];
        if (null !== i) a = i; else if (!n.has(e)) throw new Error("Trace without source at pc " + e);
        if (a = this.mergeTraces(a, e, n, t, n, r), null !== a) {
            const t = r[e];
            null !== t && (a = l(a, t))
        }
        return this.v[e] = a, this.p[e] = 2, a
    }

    buildSurvivorTraces(e, t, n, r, a) {
        for (let i = 0, o = e.length; i < o; ++i) {
            if (!n.has(i)) {
                t[i] = null;
                continue
            }
            this.v.fill(null), this.p.fill(0);
            const o = this.mergeTraces(null, i, n, e, r, a);
            if (null === o) throw new Error("No non-cyclic paths found to survivor " + i);
            t[i] = l(o, null)
        }
        this.v.fill(null)
    }
}

class h {
    constructor(e) {
        this.g = [], this.k = [], this.m = [], this.A = new o(e.maxFromByPc), this.T = new o(e.maxSurvivorFromByPc), this.S = new c(e.programLength);
        for (let t = 0; t < e.programLength; ++t) this.g.push(null), this.k.push(null), this.m.push(null);
        this.k[0] = u.EMPTY
    }

    reset(e) {
        this.A.clear(), this.T.clear(), this.g.fill(null), e && (this.k.fill(null), this.m.fill(null), this.k[0] = u.EMPTY)
    }

    record(e, t) {
        this.g[e] = t
    }

    has(e) {
        return this.A.has(e) || null !== this.k[e]
    }

    add(e, t) {
        this.A.add(e, t)
    }

    hasSurvivor(e) {
        return this.T.has(e)
    }

    addSurvivor(e, t) {
        this.T.add(e, t)
    }

    buildSurvivorTraces() {
        const e = this.k;
        this.S.buildSurvivorTraces(e, this.m, this.T, this.A, this.g), this.k = this.m, this.m = e
    }

    getTraces(e) {
        const t = e.reduce((e, t) => s(e, this.k[t]), null);
        return null === t ? [] : Array.isArray(t) ? t : [t]
    }
}

class p {
    constructor(e) {
        this.I = [], this.N = new i(e.programLength), this.M = new i(e.programLength), this.P = new h(e)
    }

    reset() {
        this.N.reset(), this.N.add(0, 0), this.I.length = 0, this.P.reset(!0)
    }

    getNextThreadPc() {
        return this.N.getNextPc()
    }

    step(e, t, n) {
        const r = this.P.has(t);
        this.P.add(e, t);
        const a = this.N.getBadness(e) + n;
        r ? this.N.reschedule(t, a) : this.N.add(t, a)
    }

    stepToNextGeneration(e, t) {
        const n = this.P.hasSurvivor(t);
        this.P.addSurvivor(e, t);
        const r = this.N.getBadness(e);
        n ? this.M.reschedule(t, r) : this.M.add(t, r)
    }

    accept(e) {
        this.I.push(e), this.P.addSurvivor(e, e)
    }

    fail(e) {
    }

    record(e, t) {
        this.P.record(e, t)
    }

    nextGeneration() {
        this.P.buildSurvivorTraces(), this.P.reset(!1);
        const e = this.N;
        e.reset(), this.N = this.M, this.M = e
    }

    getAcceptingTraces() {
        return this.P.getTraces(this.I)
    }
}

class f {
    constructor(e) {
        this.U = [], this.G = e, this.V = r.fromProgram(e), this.U.push(new p(this.V))
    }

    execute(e, t) {
        const n = this.U.pop() || new p(this.V);
        n.reset();
        const r = e.length;
        let i, o = -1;
        do {
            let a = n.getNextThreadPc();
            if (null === a) break;
            for (++o, i = o >= r ? null : e[o]; null !== a;) {
                const e = this.G[a];
                switch (e.op) {
                    case 0:
                        null === i ? n.accept(a) : n.fail(a);
                        break;
                    case 2: {
                        const r = e.func;
                        if (null === r || r(t)) {
                            n.fail(a);
                            break
                        }
                        n.step(a, a + 1, 0);
                        break
                    }
                    case 1:
                        n.step(a, a + 1, e.data);
                        break;
                    case 5:
                        if (null === i) {
                            n.fail(a);
                            break
                        }
                        if (!(0, e.func)(i, e.data, t)) {
                            n.fail(a);
                            break
                        }
                        n.stepToNextGeneration(a, a + 1);
                        break;
                    case 3: {
                        const t = e.data, r = t.length;
                        if (0 === r) {
                            n.fail(a);
                            break
                        }
                        for (let e = 0; e < r; ++e) n.step(a, t[e], 0);
                        break
                    }
                    case 4: {
                        const r = (0, e.func)(e.data, o, t);
                        null != r && n.record(a, r), n.step(a, a + 1, 0);
                        break
                    }
                }
                a = n.getNextThreadPc()
            }
            n.nextGeneration()
        } while (null !== i);
        const s = new a(n.getAcceptingTraces());
        return n.reset(), this.U.push(n), s
    }
}

function d(e) {
    return t => t === e
}

function m(e, t) {
    if (null === e || null === t) throw new Error("unescaped hyphen may not be used as a range endpoint");
    if (t < e) throw new Error("character range is in the wrong order");
    return n => e <= n && n <= t
}

function v(e) {
    return !0
}

function g() {
    return !1
}

function y(e, t) {
    return n => e(n) || t(n)
}

function w(e, t) {
    switch (t.kind) {
        case"predicate":
            return void e.test(t.value);
        case"regexp":
            return void A(e, t.value, !1)
    }
}

function A(e, t, n) {
    const r = e.program.length, a = e.jump([]);
    n && (a.data.push(e.program.length), e.test(() => !0), e.jump([r]));
    const i = [];
    if (t.forEach(t => {
        a.data.push(e.program.length), function (e, t) {
            t.forEach(t => {
                !function (e, t) {
                    const [n, {min: r, max: a}] = t;
                    if (null !== a) {
                        for (let t = 0; t < r; ++t) w(e, n);
                        for (let t = r; t < a; ++t) {
                            const t = e.jump([]);
                            t.data.push(e.program.length), w(e, n), t.data.push(e.program.length)
                        }
                    } else if (r > 0) {
                        for (let t = 0; t < r - 1; ++t) w(e, n);
                        const t = e.program.length;
                        w(e, n), e.jump([t]).data.push(e.program.length)
                    } else {
                        const t = e.program.length, r = e.jump([]);
                        r.data.push(e.program.length), w(e, n), e.jump([t]), r.data.push(e.program.length)
                    }
                }(e, t)
            })
        }(e, t), i.push(e.jump([]))
    }), i.forEach(t => {
        t.data.push(e.program.length)
    }), n) {
        const t = e.program.length, n = e.jump([]);
        n.data.push(e.program.length), e.test(() => !0), e.jump([t]), n.data.push(e.program.length)
    }
}

function x(e, t) {
    return {success: !0, offset: e, value: t}
}

function b(e) {
    return x(e, void 0)
}

function E(e, t, n = !1) {
    return {success: !1, offset: e, expected: t, fatal: n}
}

function B(e) {
    return (t, n) => {
        const r = n + e.length;
        return t.slice(n, r) === e ? x(r, e) : E(n, [e])
    }
}

function N(e, t) {
    return (n, r) => {
        const a = e(n, r);
        return a.success ? x(a.offset, t(a.value)) : a
    }
}

function C(e, t, n) {
    return (r, a) => {
        const i = e(r, a);
        return i.success ? t(i.value) ? i : E(a, n) : i.offset === a ? E(a, n) : i
    }
}

function T(e) {
    return (t, n) => {
        let r = null;
        for (const a of e) {
            const e = a(t, n);
            if (e.success) return e;
            if (null === r || e.offset > r.offset ? r = e : e.offset === r.offset && (r.expected = r.expected.concat(e.expected)), e.fatal) break
        }
        return r || E(n, [])
    }
}

function I(e) {
    return (t, n) => {
        const r = e(t, n);
        return r.success || r.fatal ? r : x(n, null)
    }
}

function O(e) {
    return (t, n) => {
        let r = [], a = n;
        for (; ;) {
            const n = e(t, a);
            if (!n.success) {
                if (n.fatal) return n;
                break
            }
            r.push(n.value), a = n.offset
        }
        return x(a, r)
    }
}

function S(e, t, n) {
    return (r, a) => {
        const i = e(r, a);
        if (!i.success) return i;
        const o = t(r, i.offset);
        return o.success ? x(o.offset, n(i.value, o.value)) : o
    }
}

function R(e) {
    return S(e, O(e), (e, t) => [e].concat(t))
}

function D(e, t) {
    return e
}

function G(e, t) {
    return t
}

function M(e, t) {
    return S(e, t, G)
}

function U(e, t) {
    return S(e, t, D)
}

function F(e, t, n, r = !1) {
    return M(e, r ? H(U(t, n)) : U(t, n))
}

function P(e, t) {
    return (n, r) => e(n, r).success ? E(r, t) : b(r)
}

function H(e) {
    return (t, n) => {
        const r = e(t, n);
        return r.success ? r : E(r.offset, r.expected, !0)
    }
}

const j = (e, t) => e.length === t ? b(t) : E(t, ["end of input"]),
    X = ["Lu", "Ll", "Lt", "Lm", "Lo", "Mn", "Mc", "Me", "Nd", "Nl", "No", "Pc", "Pd", "Ps", "Pe", "Pi", "Pf", "Po", "Zs", "Zl", "Zp", "Sm", "Sc", "Sk", "So", "Cc", "Cf", "Co", "Cn"],
    _ = {};

function L(e) {
    return e.codePointAt(0)
}

"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("").forEach((e, t) => {
    _[e] = t
});
const k = e => -1 === e || -2 === e;

function Y(e) {
    return t => !k(t) && !e(t)
}

function q(e, t) {
    return null === t ? e : n => e(n) && !t(n)
}

const V = function (e, t) {
        const n = new Map;
        let r = 0;
        return ["BasicLatin", "Latin-1Supplement", "LatinExtended-A", "LatinExtended-B", "IPAExtensions", "SpacingModifierLetters", "CombiningDiacriticalMarks", "GreekandCoptic|Greek", "Cyrillic", "CyrillicSupplement", "Armenian", "Hebrew", "Arabic", "Syriac", "ArabicSupplement", "Thaana", "NKo", "Samaritan", "Mandaic", "SyriacSupplement", null, "ArabicExtended-A", "Devanagari", "Bengali", "Gurmukhi", "Gujarati", "Oriya", "Tamil", "Telugu", "Kannada", "Malayalam", "Sinhala", "Thai", "Lao", "Tibetan", "Myanmar", "Georgian", "HangulJamo", "Ethiopic", "EthiopicSupplement", "Cherokee", "UnifiedCanadianAboriginalSyllabics", "Ogham", "Runic", "Tagalog", "Hanunoo", "Buhid", "Tagbanwa", "Khmer", "Mongolian", "UnifiedCanadianAboriginalSyllabicsExtended", "Limbu", "TaiLe", "NewTaiLue", "KhmerSymbols", "Buginese", "TaiTham", "CombiningDiacriticalMarksExtended", "Balinese", "Sundanese", "Batak", "Lepcha", "OlChiki", "CyrillicExtended-C", "GeorgianExtended", "SundaneseSupplement", "VedicExtensions", "PhoneticExtensions", "PhoneticExtensionsSupplement", "CombiningDiacriticalMarksSupplement", "LatinExtendedAdditional", "GreekExtended", "GeneralPunctuation", "SuperscriptsandSubscripts", "CurrencySymbols", "CombiningDiacriticalMarksforSymbols|CombiningMarksforSymbols", "LetterlikeSymbols", "NumberForms", "Arrows", "MathematicalOperators", "MiscellaneousTechnical", "ControlPictures", "OpticalCharacterRecognition", "EnclosedAlphanumerics", "BoxDrawing", "BlockElements", "GeometricShapes", "MiscellaneousSymbols", "Dingbats", "MiscellaneousMathematicalSymbols-A", "SupplementalArrows-A", "BraillePatterns", "SupplementalArrows-B", "MiscellaneousMathematicalSymbols-B", "SupplementalMathematicalOperators", "MiscellaneousSymbolsandArrows", "Glagolitic", "LatinExtended-C", "Coptic", "GeorgianSupplement", "Tifinagh", "EthiopicExtended", "CyrillicExtended-A", "SupplementalPunctuation", "CJKRadicalsSupplement", "KangxiRadicals", null, "IdeographicDescriptionCharacters", "CJKSymbolsandPunctuation", "Hiragana", "Katakana", "Bopomofo", "HangulCompatibilityJamo", "Kanbun", "BopomofoExtended", "CJKStrokes", "KatakanaPhoneticExtensions", "EnclosedCJKLettersandMonths", "CJKCompatibility", "CJKUnifiedIdeographsExtensionA", "YijingHexagramSymbols", "CJKUnifiedIdeographs", "YiSyllables", "YiRadicals", "Lisu", "Vai", "CyrillicExtended-B", "Bamum", "ModifierToneLetters", "LatinExtended-D", "SylotiNagri", "CommonIndicNumberForms", "Phags-pa", "Saurashtra", "DevanagariExtended", "KayahLi", "Rejang", "HangulJamoExtended-A", "Javanese", "MyanmarExtended-B", "Cham", "MyanmarExtended-A", "TaiViet", "MeeteiMayekExtensions", "EthiopicExtended-A", "LatinExtended-E", "CherokeeSupplement", "MeeteiMayek", "HangulSyllables", "HangulJamoExtended-B", "HighSurrogates", "HighPrivateUseSurrogates", "LowSurrogates", "PrivateUseArea|PrivateUse", "CJKCompatibilityIdeographs", "AlphabeticPresentationForms", "ArabicPresentationForms-A", "VariationSelectors", "VerticalForms", "CombiningHalfMarks", "CJKCompatibilityForms", "SmallFormVariants", "ArabicPresentationForms-B", "HalfwidthandFullwidthForms", "Specials", "LinearBSyllabary", "LinearBIdeograms", "AegeanNumbers", "AncientGreekNumbers", "AncientSymbols", "PhaistosDisc", null, "Lycian", "Carian", "CopticEpactNumbers", "OldItalic", "Gothic", "OldPermic", "Ugaritic", "OldPersian", null, "Deseret", "Shavian", "Osmanya", "Osage", "Elbasan", "CaucasianAlbanian", null, "LinearA", null, "CypriotSyllabary", "ImperialAramaic", "Palmyrene", "Nabataean", null, "Hatran", "Phoenician", "Lydian", null, "MeroiticHieroglyphs", "MeroiticCursive", "Kharoshthi", "OldSouthArabian", "OldNorthArabian", null, "Manichaean", "Avestan", "InscriptionalParthian", "InscriptionalPahlavi", "PsalterPahlavi", null, "OldTurkic", null, "OldHungarian", "HanifiRohingya", null, "RumiNumeralSymbols", null, "OldSogdian", "Sogdian", null, "Elymaic", "Brahmi", "Kaithi", "SoraSompeng", "Chakma", "Mahajani", "Sharada", "SinhalaArchaicNumbers", "Khojki", null, "Multani", "Khudawadi", "Grantha", null, "Newa", "Tirhuta", null, "Siddham", "Modi", "MongolianSupplement", "Takri", null, "Ahom", null, "Dogra", null, "WarangCiti", null, "Nandinagari", "ZanabazarSquare", "Soyombo", null, "PauCinHau", null, "Bhaiksuki", "Marchen", null, "MasaramGondi", "GunjalaGondi", null, "Makasar", null, "TamilSupplement", "Cuneiform", "CuneiformNumbersandPunctuation", "EarlyDynasticCuneiform", null, "EgyptianHieroglyphs", "EgyptianHieroglyphFormatControls", null, "AnatolianHieroglyphs", null, "BamumSupplement", "Mro", null, "BassaVah", "PahawhHmong", null, "Medefaidrin", null, "Miao", null, "IdeographicSymbolsandPunctuation", "Tangut", "TangutComponents", null, "KanaSupplement", "KanaExtended-A", "SmallKanaExtension", "Nushu", null, "Duployan", "ShorthandFormatControls", null, "ByzantineMusicalSymbols", "MusicalSymbols", "AncientGreekMusicalNotation", null, "MayanNumerals", "TaiXuanJingSymbols", "CountingRodNumerals", null, "MathematicalAlphanumericSymbols", "SuttonSignWriting", null, "GlagoliticSupplement", null, "NyiakengPuachueHmong", null, "Wancho", null, "MendeKikakui", null, "Adlam", null, "IndicSiyaqNumbers", null, "OttomanSiyaqNumbers", null, "ArabicMathematicalAlphabeticSymbols", null, "MahjongTiles", "DominoTiles", "PlayingCards", "EnclosedAlphanumericSupplement", "EnclosedIdeographicSupplement", "MiscellaneousSymbolsandPictographs", "Emoticons", "OrnamentalDingbats", "TransportandMapSymbols", "AlchemicalSymbols", "GeometricShapesExtended", "SupplementalArrows-C", "SupplementalSymbolsandPictographs", "ChessSymbols", "SymbolsandPictographsExtended-A", null, "CJKUnifiedIdeographsExtensionB", null, "CJKUnifiedIdeographsExtensionC", "CJKUnifiedIdeographsExtensionD", "CJKUnifiedIdeographsExtensionE", "CJKUnifiedIdeographsExtensionF", null, "CJKCompatibilityIdeographsSupplement", null, "Tags", null, "VariationSelectorsSupplement", null, "SupplementaryPrivateUseArea-A|PrivateUse", "SupplementaryPrivateUseArea-B|PrivateUse"].forEach((e, a) => {
            const i = t[a];
            null !== e && e.split("|").forEach(e => {
                const t = n.get(e), a = m(r, r + i - 1);
                n.set(e, t ? y(t, a) : a)
            }), r += i
        }), n
    }(0, [128, 128, 128, 208, 96, 80, 112, 144, 256, 48, 96, 112, 256, 80, 48, 64, 64, 64, 32, 16, 48, 96, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 256, 160, 96, 256, 384, 32, 96, 640, 32, 96, 32, 32, 32, 32, 128, 176, 80, 80, 48, 96, 32, 32, 144, 80, 128, 64, 64, 80, 48, 16, 48, 16, 48, 128, 64, 64, 256, 256, 112, 48, 48, 48, 80, 64, 112, 256, 256, 64, 32, 160, 128, 32, 96, 256, 192, 48, 16, 256, 128, 128, 256, 256, 96, 32, 128, 48, 80, 96, 32, 128, 128, 224, 16, 16, 64, 96, 96, 48, 96, 16, 32, 48, 16, 256, 256, 6592, 64, 20992, 1168, 64, 48, 320, 96, 96, 32, 224, 48, 16, 64, 96, 32, 48, 48, 32, 96, 32, 96, 32, 96, 32, 48, 64, 80, 64, 11184, 80, 896, 128, 1024, 6400, 512, 80, 688, 16, 16, 16, 32, 32, 144, 240, 16, 128, 128, 64, 80, 64, 48, 128, 32, 64, 32, 48, 32, 48, 32, 64, 32, 80, 48, 48, 80, 48, 64, 144, 384, 128, 64, 32, 32, 48, 48, 32, 32, 32, 64, 32, 96, 96, 32, 32, 32, 64, 64, 32, 32, 48, 80, 80, 48, 128, 64, 288, 32, 128, 48, 64, 112, 32, 128, 80, 48, 80, 48, 96, 32, 80, 48, 48, 80, 128, 128, 128, 96, 160, 128, 96, 32, 80, 48, 64, 192, 80, 80, 96, 160, 96, 80, 96, 16, 64, 256, 112, 80, 64, 96, 80, 304, 32, 192, 64, 1024, 128, 208, 2736, 1072, 16, 4032, 640, 8576, 576, 48, 96, 48, 144, 688, 96, 96, 160, 64, 32, 6144, 768, 9472, 256, 48, 64, 400, 2304, 160, 16, 4944, 256, 256, 80, 144, 32, 96, 32, 128, 1024, 688, 1360, 48, 208, 80, 368, 64, 1280, 224, 32, 96, 784, 80, 64, 80, 176, 256, 256, 48, 112, 96, 256, 256, 768, 80, 48, 128, 128, 128, 256, 256, 112, 144, 1280, 42720, 32, 4160, 224, 5776, 7488, 3088, 544, 722400, 128, 128, 240, 65040, 65536, 65536]),
    Q = function (e) {
        const t = new Map,
            n = "bfUATCYATCPAQATAXATAOATBKJTBXCTBCZPATAQAZANAZADZPAXAQAXAbgUATAYDaATAZAaAGARAXAcAaAZAaAXAMBZADATBZAMAGASAMCTACWXACGDXXADHA3DAAPDAAtCAAFDBCAADCAABCCDBCCABCAABCCDCCAABCAAFCAADDAABCAABCBADCBDBGACADCGDCAEADACAEADACAEADAAPDAARDACAEADAABCBA7DFCAABCBDBABCCAJjDBAAGADaFRZDFLZNFEZGFAZAFAZQnvBAAADFAZACADABBFADCTACABDZBCATACCBACABACAABCQBACIDiCADBCCDCAXDDCADAXAABCBDBCyDvAhaAHEJBA1CAANDAgfBAABAClBBFATFDoTAOABBaBYABAHsOAHATAHBTAHBTAHABHGaBDGDTBBKcFXCTBYATBaBHKTAcABATBGfFAGJHUKJTDGBHAmiBAATAGAHGcAaAHFFBHBaAHDGBKJGCaBGATNBAcAGAHAGdHaBBmYBAAHKGABNKJGgHIFBaATCFABBHAYBGVHDFAHIFAHCFAHEBBTOBAGYHCBBTABAGKB0GUBAGHBUHOcAHfIAG1HAIAHAGAICHHIDHAIBGAHGGJHBTBKJTAFAGOHAIBBAGHBBGBBBGVBAGGBAGABCGDBBHAGAICHDBBIBBBIBHAGABHIABDGBBAGCHBBBKJGBYBMFaAYAGATAHABBHBIABAGFBDGBBBGVBAGGBAGBBAGBBAGBBBHABAICHBBDHBBBHCBCHABGGDBAGABGKJHBGCHATABJHBIABAGIBAGCBAGVBAGGBAGBBAGEBBHAGAICHEBAHBIABAIBHABBGABOGBHBBBKJTAYABGGAHFBAHAIBBAGHBBGBBBGVBAGGBAGBBAGEBBHAGAIAHAIAHDBBIBBBIBHABHHAIABDGBBAGCHBBBKJaAGAMFBJHAGABAGFBCGCBAGDBCGBBAGABAGBBCGBBCGCBCGLBDIBHAIBBCICBAICHABBGABFIABNKJMCaFYAaABEHAICHAGHBAGCBAGWBAGPBCGAHCIDBAHCBAHDBGHBBAGCBEGBHBBBKJBGTAMGaAGAHAIBTAGHBAGCBAGWBAGJBAGEBBHAGAIAHAIEBAHAIBBAIBHBBGIBBGGABAGBHBBBKJBAGBBMHBIBBAGHBAGCBAGoHBGAICHDBAICBAICHAGAaABDGCIAMGGCHBBBKJMIaAGFBBIBBAGRBCGXBAGIBAGABBGGBCHABDICHCBAHABAIHBFKJBBIBTABLGvHAGBHGBDYAGFFAHHTAKJTBBkGBBAGABAGEBAGXBAGABAGJHAGBHIGABBGEBAFABAHFBBKJBBGDBfGAaCTOaATAaCHBaFKJMJaAHAaAHAaAHAPAQAPAQAIBGHBAGjBDHNIAHETAHBGEHKBAHjBAaHHAaFBAaBTEaDTBBkGqIBHDIAHFIAHBIBHBGAKJTFGFIBHBGDHCGAICGBIGGCHDGMHAIBHBIFHAGAIAKJICHAaBClBACABECABBDqTAFADCmIFAABAGDBBGGBAGABAGDBBGoBAGDBBGgBAGDBBGGBAGABAGDBBGOBAG4BAGDBBmCBAABBHCTIMTBCGPaJBFiVBAABBDFBBOAmrJAAaATAGQUAGZPAQABCmKBAATCLCGHBGGMBAGDHCBKGRHCTBBIGRHBBLGMBAGCBAHBBLGzHBIAHGIHHAIBHKTCFATCYAGAHABBKJBFMJBFTFOATDHCcABAKJBFGiFAG0BGGEHBGhHAGABEmFBAABJGeBAHCIDHBICBDIBHAIFHCBDaABCTBKJGdBBGEBKGrBDGZBFKJMABCahGWHBIBHABBTBG0IAHAIAHGBAHAIAHAIBHHIFHJBBHAKJBFKJBFTGFATFBBHNJAhABAAHDIAGuHAIAHEIAHAIEHAIBGGBDKJTGaJHIaIBCHBIAGdIAHDIBHBIAHCGBKJGrHAIAHBICHAIAHCIBBHTDGjIHHHIBHBBCTEKJBCGCKJGdFFTBDIBGCqBBCCTHBHHCTAHMIAHGGDHAGFHAGBIAHBGABEDrF+DMFADhFkH5BAHEgVCAADHghBAADHCHDFBBCFBBDHCHDHCHDFBBCFBBDHBACABACABACABACADHCHDNBBDHEHDHEHDHEHDEBADBCDEAZADAZCDCBADBCDEAZCDDBBDBCDBAZCDHCEZCBBDCBADBCDEAZBBAUKcEOFTBRASAPARBSAPARATHVAWAcEUATIRASATDNBTCXAPAQATKXATANATJUAcEBAcJMAFABBMFXCPAQAFAMJXCPAQABAFMBCYfBPHMJDHAJCHLBOaBCAaDCAaBDACCDBCCDAaACAaBXACEaFCAaACAaACAaACDaADACDDAGDDAaBDBCBXECADDaAXAaBDAaAMPLiCADALDMAaBBDXEaEXBaDXAaBXAaBXAaGXAaeXBaBXAaAXAae3LEAAaHPAQAPAQAaTXBaGPAQA6QBAAXAadXYanXF6EBAABYaKBUM76NBAAMV62CAAXAaIXAa1XH6uBAAXA63DAAPAQAPAQAPAQAPAQAPAQAPAQAPAQAMdarXEPAQAXePAQAPAQAPAQAPAQAPAQAXP6/DAA3CCAAPAQAPAQAPAQAPAQAPAQAPAQAPAQAPAQAPAQAPAQAPAQAX+PAQAPAQAXfPAQA3BEAAavXUaBXFamBBafBB6nBAACuBADuBAABCCDBAFCCADDACADFFBCBgjBAADAaFADHCCADABETDMATBDlBADABEDABBG3BGFATABNHAGWBIGGBAGGBAGGBAGGBAGGBAGGBAGGBAGGBAHfTBRASARASATCRASATARASATIOATBOATARASATBRASAPAQAPAQAPAQAPAQATEFATJOBTDOATAPATMBvaZBA6YBAABL6VDAABZaLBDUATCaAFAGALAPAQAPAQAPAQAPAQAPAQAaBPAQAPAQAPAQAPAQAOAPAQBaALIHDIBOAFEaBLCFAGATAaBBAmVBAABBHBZBFBGAOAmZBAATAFCGABEGqBAmdBAABAaBMDaJGaBEajBLGPaeBAMJadMHaAMOafMJamMO6/EAAm1mBABJa/mvHFABPGUFAm2RAABCa2BIGnFFTBmLEAAFATCGPKJGBBTAtGAHAJCTAHJTAFAAbFBHBmFBAALJHBTFBHZWFIZBANDBA9FADHADCAAJFAZBADGAADDBATCDABCDALBBABCCBvGAFBDAGGHAGCHAGDHAGWIBHBIAaDBDMFaBYAaABFGzTDBHIBGxIPHBBHTBKJBFHRGFTCGATAGBHAKJGbHHTBGWHKIBBKTAGcBCHCIAGuHAIBHDIBHBICTMBAFAKJBDTBGEHAFAGIKJGEBAGoHFIBHBIBHBBIGCHAGHHAIABBKJBBTDGPFAGFaCGAIAHAIAGxHAGAHCGBHBGEHBGAHAGABXGBFATBGKIAHBIBTBGAFBIAHABJGFBBGFBBGFBIGGBAGGBADqZAFDDHBHjPBAAGiIBHAIBHAIBTAIAHABBKJBFmjuCABLGWBDGwhDgAA9/jBAmtFAABBmpBAABlDGBLDEBEGAHAGJXAGMBAGEBAGABAGBBAGBBAmrBAAZPBQmqFAAQAPABPG/BBG1BnGLYAaABBHPTGPAQATABFHPTAOBNBPAQAPAQAPAQAPAQAPAQAPAQAPAQAPAQATBPAQATDNCTCBATDOAPAQAPAQAPAQATCXAOAXCBATAYATBBDGEBAmGCAABBcABATCYATCPAQATAXATAOATBKJTBXCTBCZPATAQAZANAZADZPAXAQAXAPAQATAPAQATBGJFAGsFBGeBCGFBBGFBBGFBBGCBCYBXAZAaAYBBAaAXDaBBJcCaBBBGLBAGZBAGSBAGBBAGOBBGNBhm6BAABETCBDMsBCaIL0MDaQMBaCBAaLBDaABuasHAhBCAAGcBCGwBOHAMaBDGfMDBIGTLAGHLABEGlHEBEGdBATAGjBDGHTALEBpCnDnmNBAABBKJBFCjBDDjBDGnBHGzBKTAhPCAAm2EAABIGVBJGHhXCAAGFBBGABAGrBAGBBCGABBGWBATAMHGWaBMGGeBHMIBvGSBAGBBEMEGVMFBCTAGZBETAB/G3BDMBGBMPBBMtGAHCBAHBBEHDGDBAGCBAGcBBHCBDHAMIBGTIBGGcMBTAGcMCBfGHaAGbHBBDMETGBIG1BCTGGVBBMHGSBEMHGRBGTDBLMGhPBAAmIBAAB2CyBMDyBGMFGjHDBHKJhlEAAMehACAAGcMJGABHGVHKMDTEhFCAAGWBIIAHAIAG0HOTGBDMTKJBOHCIAGsICHDIBHBTBcATDBKcABBGYBGKJBFHCGjHEIAHHBAKJTDGAIBBIGiHATBGABIHBIAGvICHIIBGDTDHDTABBKJGATAGATCBAMTBKGRBAGYICHCIBHAIAHBTFHAhABAAGGBAGABAGDBAGOBAGJTABFGuHAICHHBEKJBFHBIBBAGHBBGBBBGVBAGGBAGBBAGEBAHBGAIBHAIDBBIBBBICBBGABFIABEGEIBBBHGBCHEhKCAAG0ICHHIBHCIAHAGDTEKJBATABATAHAGABfGvICHFIAHAIDHBIAHBGBTAGABHKJhlCAAGuICHDBBIDHBIAHBTWGDHBBhGvICHHIBHAIAHBTCGABKKJBFTMBSGqHAIAHAIBHFIAHAGABGKJB1GaBBHCIBHDIAHEBDKJMBTCaAh/CAAGrICHIIAHBTAhjBAACfDfKJMIBLGAhfCAAGHBBGmICHDBBHBIDHAGATAGAIABaGAHJGnHFIAGAHDTHHABHGAHFIBHCGtHMIAHBTCGATEBcG4hGEAAGIBAGkIAHGBAHFIAHAGATEBJKJMSBCTBGdBBHVBAIAHGIAHBIAHBhIBAAGGBAGBBAGlHFBCHABAHBBAHGGAHABHKJBFGFBAGBBAGfIEBAHBBAIBHAIAHAGABGKJh1EAAGSHBIBTBhGDAAMUaHYDaQBMTAmZOAAhlBAAruBAABATEBKmDDAAh7qAAmuQAABAcIhG/AAmGJAAh4GCAm4IAABGGeBAKJBDTBhfBAAGdBBHETABJGvHGTEaDFDTAaABJKJBAMGBAGUBEGShvKAACfDfMWTDhkBAAmKBAABDHAGAI2BGHDFMB/FBTAFABbm3fBABHmyLAAhMUCAmeEAABwGCBQGDBHmLGAAhDkAAmqBAABEGMBCGIBGGJBBaAHBTAcDhbNBA61DAABJamBBa7IBHCaCIFcHHHaBHGadHDa6BW6BBAAHCaAhZCAAMTBL6WBAABIMYhGCAACZDZCZDGBADRCZDZCABACBBBCABBCBBBCDBACHDDBADABADGBADKCZDZCBBACDBBCHBACGBADZCBBACDBACEBACABCCGBADZCZDZCZDZCZDZCZDZCZDZCZDbBBCYXADYXADFCYXADYXADFCYXADYXADFCYXADYXADFCYXADYXADFCADABBKx6/HAAH2aDHxaHHAaNHAaBTEBOHEBAHOhPVAAHGBAHQBBHGBAHBBAHEhUDAAGsBCHGFGBBKJBDGAaAhvFAAGrHDKJBEYAh/TAAmEDAABBMIHGBoChDhHGFABDKJBDTBhQMAAM6aAMCYAMDhLBAAMsaAMOhBDAAGDBAGaBAGBBAGABBGABAGJBAGDBAGABAGABFGABDGABAGABAGABAGCBAGBBAGABBGABAGABAGABAGABAGABAGBBAGABBGDBAGGBAGDBAGDBAGABAGJBAGQBEGCBAGEBAGQBzXBhNEAAarBD6jBAABLaOBBaOBAaOBAakBJMMBC6cBAABCa8B4acBMarBDaIBGaBBNaFhZCAA66DAAZE6VLAABJaMBCaKBE6zBAABL6YBAABGaLBTaLBDa3BHaJBFanBHadhRBAAaLBA6kBAABAaDBCaoBBaFBCacBB6GCAABLaNBBaDBDaCBEaCBMaFhpVAAmWbKABom0ABABKmdDAABBmBaBABNmw0BAhewAAmdIAAhiXwCcABd8fBAAh/BAAnvDAAhP4PA99/PABB99/PA".split(""),
            r = X.map(() => []);
        let a = 0, i = 0;
        for (; i < n.length;) {
            const e = _[n[i]], t = (31 & e) - 2;
            let o = 1 + _[n[i + 1]];
            switch (32 & e ? (o += _[n[i + 2]] << 6, o += _[n[i + 3]] << 12, o += _[n[i + 4]] << 18, i += 5) : i += 2, t) {
                case-2: {
                    let e = 0;
                    for (let t = a; t < a + o; ++t) r[e].push(d(t)), e = (e + 1) % 2;
                    break
                }
                case-1:
                    break;
                default: {
                    const e = r[t];
                    1 === o ? e.push(d(a)) : e.push(m(a, a + o - 1));
                    break
                }
            }
            a += o
        }
        const o = new Map;
        return X.forEach((e, n) => {
            const a = r[n].reduce(y, g);
            t.set(e, a);
            const i = e.charAt(0), s = o.get(i) || [];
            o.set(i, s), s.push(a)
        }), o.forEach((e, n) => {
            t.set(n, e.reduce(y, g))
        }), t
    }();

function J(e) {
    return 32 === e || 9 === e || 10 === e || 13 === e
}

const K = [d(L(":")), m(L("A"), L("Z")), d(L("_")), m(L("a"), L("z")), m(192, 214), m(216, 246), m(192, 214), m(216, 246), m(248, 767), m(880, 893), m(895, 8191), m(8204, 8205), m(8304, 8591), m(11264, 12271), m(12289, 55295), m(63744, 64975), m(65008, 65533), m(65536, 983039)].reduce(y),
    z = [K, d(L("-")), d(L(".")), m(L("0"), L("9")), d(183), m(768, 879), m(8255, 8256)].reduce(y), Z = Q.get("Nd"),
    W = Y(Z), $ = q(m(0, 1114111), [Q.get("P"), Q.get("Z"), Q.get("C")].reduce(y)), ee = Y($);

function te(e) {
    return 10 !== e && 13 !== e && !k(e)
}

const ne = {s: J, S: Y(J), i: K, I: Y(K), c: z, C: Y(z), d: Z, D: W, w: $, W: ee}, re = B("*"), ae = B("\\"),
    ie = B("{"), oe = B("}"), se = B("["), ue = B("]"), le = B("^"), ce = B("$"), he = B(","), pe = B("-"), fe = B("("),
    de = B(")"), me = B("."), ve = B("|"), ge = B("+"), ye = B("?"), we = B("-["), Ae = L("0");

function xe(e) {
    function t(e) {
        return new Set(e.split("").map(e => L(e)))
    }

    function n(e, t) {
        const n = e.codePointAt(t);
        return void 0 === n ? E(t, ["any character"]) : x(t + String.fromCodePoint(n).length, n)
    }

    const r = "xpath" === e.language ? M(ae, T([N(B("n"), () => 10), N(B("r"), () => 13), N(B("t"), () => 9), N(T([ae, ve, me, pe, le, ye, re, ge, ie, oe, ce, fe, de, se, ue]), e => L(e))])) : M(ae, T([N(B("n"), () => 10), N(B("r"), () => 13), N(B("t"), () => 9), N(T([ae, ve, me, pe, le, ye, re, ge, ie, oe, fe, de, se, ue]), e => L(e))]));

    function a(e, r) {
        const a = t(r);
        return S(B(e), I(C(n, e => a.has(e), r.split(""))), (e, t) => function (e) {
            const t = Q.get(e);
            if (null == t) throw new Error(e + " is not a valid unicode category");
            return t
        }(null === t ? e : e + String.fromCodePoint(t)))
    }

    const i = T([a("L", "ultmo"), a("M", "nce"), a("N", "dlo"), a("P", "cdseifo"), a("Z", "slp"), a("S", "mcko"), a("C", "cfon")]),
        o = [m(L("a"), L("z")), m(L("A"), L("Z")), m(L("0"), L("9")), d(45)].reduce(y),
        s = T([i, N(M(B("Is"), function (e) {
            return (t, n) => {
                const r = e(t, n);
                return r.success ? x(r.offset, t.slice(n, r.offset)) : r
            }
        }(R(C(n, o, ["block identifier"])))), t => function (e, t) {
            const n = V.get(e);
            if (void 0 === n) {
                if (t) return v;
                throw new Error(`The unicode block identifier "${e}" is not known.`)
            }
            return n
        }(t, "xpath" !== e.language))]), u = F(B("\\p{"), s, oe, !0), l = N(F(B("\\P{"), s, oe, !0), Y),
        c = M(ae, N(T("sSiIcCdDwW".split("").map(e => B(e))), e => ne[e])), h = N(me, () => te), p = T([c, u, l]),
        f = t("\\[]"), g = T([r, C(n, e => !f.has(e), ["unescaped character"])]), w = T([N(pe, () => null), g]),
        A = S(w, M(pe, w), m);

    function b(e, t) {
        return [e].concat(t || [])
    }

    const G = N(function (e) {
            return (t, n) => {
                const r = e(t, n);
                return r.success ? x(n, r.value) : r
            }
        }(T([ue, we])), () => null), X = L("-"), _ = T([N(U(U(pe, P(se, ["not ["])), G), () => X), M(P(pe, ["not -"]), g)]),
        k = T([S(N(_, d), T([function (e, t) {
            return k(e, t)
        }, G]), b), S(T([A, p]), T([K, G]), b)]), J = T([S(N(g, d), T([k, G]), b), S(T([A, p]), T([K, G]), b)]);

    function K(e, t) {
        return J(e, t)
    }

    const z = N(J, e => e.reduce(y)), Z = N(M(le, z), Y),
        W = S(T([M(P(le, ["not ^"]), z), Z]), I(M(pe, (function (e, t) {
            return $(e, t)
        }))), q), $ = F(se, W, ue, !0),
        ee = "xpath" === e.language ? T([N(r, d), p, $, h, N(le, () => e => -1 === e), N(ce, () => e => -2 === e)]) : T([N(r, d), p, $, h]),
        xe = "xpath" === e.language ? t(".\\?*+{}()|^$[]") : t(".\\?*+{}()|[]"),
        be = C(n, e => !xe.has(e), ["NormalChar"]),
        Ee = N(M(ae, S(N(C(n, m(L("1"), L("9")), ["digit"]), e => e - Ae), O(N(C(n, m(Ae, L("9")), ["digit"]), e => e - Ae)), (e, t) => {
            t.reduce((e, t) => 10 * e + t, e)
        })), e => {
            throw new Error("Backreferences in XPath patterns are not yet implemented.")
        }), Be = "xpath" === e.language ? T([N(be, e => ({kind: "predicate", value: d(e)})), N(ee, e => ({
            kind: "predicate",
            value: e
        })), N(F(fe, M(I(B("?:")), Se), de, !0), e => ({
            kind: "regexp",
            value: e
        })), Ee]) : T([N(be, e => ({kind: "predicate", value: d(e)})), N(ee, e => ({
            kind: "predicate",
            value: e
        })), N(F(fe, Se, de, !0), e => ({kind: "regexp", value: e}))]),
        Ne = N(R(N(C(n, m(Ae, L("9")), ["digit"]), e => e - Ae)), e => e.reduce((e, t) => 10 * e + t)),
        Ce = T([S(Ne, M(he, Ne), (e, t) => {
            if (t < e) throw new Error("quantifier range is in the wrong order");
            return {min: e, max: t}
        }), S(Ne, he, e => ({min: e, max: null})), N(Ne, e => ({min: e, max: e}))]),
        Te = "xpath" === e.language ? S(T([N(ye, () => ({min: 0, max: 1})), N(re, () => ({
            min: 0,
            max: null
        })), N(ge, () => ({min: 1, max: null})), F(ie, Ce, oe, !0)]), I(ye), (e, t) => e) : T([N(ye, () => ({
            min: 0,
            max: 1
        })), N(re, () => ({min: 0, max: null})), N(ge, () => ({min: 1, max: null})), F(ie, Ce, oe, !0)]),
        Ie = O(S(Be, N(I(Te), e => null === e ? {min: 1, max: 1} : e), (e, t) => [e, t])),
        Oe = S(Ie, O(M(ve, H(Ie))), (e, t) => [e].concat(t));

    function Se(e, t) {
        return Oe(e, t)
    }

    const Re = function (e) {
        return S(e, j, D)
    }(Oe);
    return function (e) {
        let t;
        try {
            t = Re(e, 0)
        } catch (t) {
            throw new Error(`Error parsing pattern "${e}": ${t.message}`)
        }
        return t.success ? t.value : function (e, t, n) {
            const r = n.map(e => `"${e}"`);
            throw new Error(`Error parsing pattern "${e}" at offset ${t}: expected ${r.length > 1 ? "one of " + r.join(", ") : r[0]} but found "${e.slice(t, t + 1)}"`)
        }(e, t.offset, t.expected)
    }
}

function be(e) {
    return [...e].map(e => e.codePointAt(0))
}

const Ee = function (e) {
        const t = {};
        var n;

        function r(e) {
            var t = 0;
            return function () {
                return t < e.length ? {done: !1, value: e[t++]} : {done: !0}
            }
        }

        var a = "function" == typeof Object.defineProperties ? Object.defineProperty : function (e, t, n) {
            return e == Array.prototype || e == Object.prototype || (e[t] = n.value), e
        };
        var i = function (e) {
            e = ["object" == typeof globalThis && globalThis, e, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
            for (var t = 0; t < e.length; ++t) {
                var n = e[t];
                if (n && n.Math == Math) return n
            }
            throw Error("Cannot find global object")
        }(this);

        function o(e, t) {
            if (t) e:{
                var n = i;
                e = e.split(".");
                for (var r = 0; r < e.length - 1; r++) {
                    var o = e[r];
                    if (!(o in n)) break e;
                    n = n[o]
                }
                (t = t(r = n[e = e[e.length - 1]])) != r && null != t && a(n, e, {configurable: !0, writable: !0, value: t})
            }
        }

        function s(e) {
            return (e = {next: e})[Symbol.iterator] = function () {
                return this
            }, e
        }

        function u(e) {
            var t = "undefined" != typeof Symbol && Symbol.iterator && e[Symbol.iterator];
            return t ? t.call(e) : {next: r(e)}
        }

        function l(e) {
            for (var t, n = []; !(t = e.next()).done;) n.push(t.value);
            return n
        }

        function c(e) {
            return e instanceof Array ? e : l(u(e))
        }

        o("Symbol", (function (e) {
            function t(e, t) {
                this.h = e, a(this, "description", {configurable: !0, writable: !0, value: t})
            }

            if (e) return e;
            t.prototype.toString = function () {
                return this.h
            };
            var n = 0;
            return function e(r) {
                if (this instanceof e) throw new TypeError("Symbol is not a constructor");
                return new t("jscomp_symbol_" + (r || "") + "_" + n++, r)
            }
        })), o("Symbol.iterator", (function (e) {
            if (e) return e;
            e = Symbol("Symbol.iterator");
            for (var t = "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "), n = 0; n < t.length; n++) {
                var o = i[t[n]];
                "function" == typeof o && "function" != typeof o.prototype[e] && a(o.prototype, e, {
                    configurable: !0,
                    writable: !0,
                    value: function () {
                        return s(r(this))
                    }
                })
            }
            return e
        })), o("Symbol.asyncIterator", (function (e) {
            return e || Symbol("Symbol.asyncIterator")
        }));
        var h, p = "function" == typeof Object.create ? Object.create : function (e) {
            function t() {
            }

            return t.prototype = e, new t
        };
        if ("function" == typeof Object.setPrototypeOf) h = Object.setPrototypeOf; else {
            var f;
            e:{
                var d = {};
                try {
                    d.__proto__ = {a: !0}, f = d.a;
                    break e
                } catch (e) {
                }
                f = !1
            }
            h = f ? function (e, t) {
                if (e.__proto__ = t, e.__proto__ !== t) throw new TypeError(e + " is not extensible");
                return e
            } : null
        }
        var m = h;

        function v(e, t) {
            if (e.prototype = p(t.prototype), e.prototype.constructor = e, m) m(e, t); else for (var n in t) if ("prototype" != n) if (Object.defineProperties) {
                var r = Object.getOwnPropertyDescriptor(t, n);
                r && Object.defineProperty(e, n, r)
            } else e[n] = t[n];
            e.Bc = t.prototype
        }

        function g() {
            this.J = !1, this.o = null, this.v = void 0, this.h = 1, this.N = 0, this.B = null
        }

        function y(e) {
            if (e.J) throw new TypeError("Generator is already running");
            e.J = !0
        }

        function w(e, t) {
            e.B = {kc: t, nc: !0}, e.h = e.N
        }

        function A(e) {
            this.h = new g, this.o = e
        }

        function x(e, t, n, r) {
            try {
                var a = t.call(e.h.o, n);
                if (!(a instanceof Object)) throw new TypeError("Iterator result " + a + " is not an object");
                if (!a.done) return e.h.J = !1, a;
                var i = a.value
            } catch (t) {
                return e.h.o = null, w(e.h, t), b(e)
            }
            return e.h.o = null, r.call(e.h, i), b(e)
        }

        function b(e) {
            for (; e.h.h;) try {
                var t = e.o(e.h);
                if (t) return e.h.J = !1, {value: t.value, done: !1}
            } catch (t) {
                e.h.v = void 0, w(e.h, t)
            }
            if (e.h.J = !1, e.h.B) {
                if (t = e.h.B, e.h.B = null, t.nc) throw t.kc;
                return {value: t.return, done: !0}
            }
            return {value: void 0, done: !0}
        }

        function E(e) {
            this.next = function (t) {
                return y(e.h), e.h.o ? t = x(e, e.h.o.next, t, e.h.C) : (e.h.C(t), t = b(e)), t
            }, this.throw = function (t) {
                return y(e.h), e.h.o ? t = x(e, e.h.o.throw, t, e.h.C) : (w(e.h, t), t = b(e)), t
            }, this.return = function (t) {
                return function (e, t) {
                    y(e.h);
                    var n = e.h.o;
                    return n ? x(e, "return" in n ? n.return : function (e) {
                        return {value: e, done: !0}
                    }, t, e.h.return) : (e.h.return(t), b(e))
                }(e, t)
            }, this[Symbol.iterator] = function () {
                return this
            }
        }

        function B(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }

        g.prototype.C = function (e) {
            this.v = e
        }, g.prototype.return = function (e) {
            this.B = {return: e}, this.h = this.N
        }, o("Promise", (function (e) {
            function t(e) {
                this.o = 0, this.B = void 0, this.h = [], this.N = !1;
                var t = this.J();
                try {
                    e(t.resolve, t.reject)
                } catch (e) {
                    t.reject(e)
                }
            }

            function n() {
                this.h = null
            }

            function r(e) {
                return e instanceof t ? e : new t((function (t) {
                    t(e)
                }))
            }

            if (e) return e;
            n.prototype.o = function (e) {
                if (null == this.h) {
                    this.h = [];
                    var t = this;
                    this.B((function () {
                        t.v()
                    }))
                }
                this.h.push(e)
            };
            var a = i.setTimeout;
            n.prototype.B = function (e) {
                a(e, 0)
            }, n.prototype.v = function () {
                for (; this.h && this.h.length;) {
                    var e = this.h;
                    this.h = [];
                    for (var t = 0; t < e.length; ++t) {
                        var n = e[t];
                        e[t] = null;
                        try {
                            n()
                        } catch (e) {
                            this.J(e)
                        }
                    }
                }
                this.h = null
            }, n.prototype.J = function (e) {
                this.B((function () {
                    throw e
                }))
            }, t.prototype.J = function () {
                function e(e) {
                    return function (r) {
                        n || (n = !0, e.call(t, r))
                    }
                }

                var t = this, n = !1;
                return {resolve: e(this.mb), reject: e(this.v)}
            }, t.prototype.mb = function (e) {
                if (e === this) this.v(new TypeError("A Promise cannot resolve to itself")); else if (e instanceof t) this.wb(e); else {
                    e:switch (typeof e) {
                        case"object":
                            var n = null != e;
                            break e;
                        case"function":
                            n = !0;
                            break e;
                        default:
                            n = !1
                    }
                    n ? this.ua(e) : this.C(e)
                }
            }, t.prototype.ua = function (e) {
                var t = void 0;
                try {
                    t = e.then
                } catch (e) {
                    return void this.v(e)
                }
                "function" == typeof t ? this.Wb(t, e) : this.C(e)
            }, t.prototype.v = function (e) {
                this.ka(2, e)
            }, t.prototype.C = function (e) {
                this.ka(1, e)
            }, t.prototype.ka = function (e, t) {
                if (0 != this.o) throw Error("Cannot settle(" + e + ", " + t + "): Promise already settled in state" + this.o);
                this.o = e, this.B = t, 2 === this.o && this.vb(), this.na()
            }, t.prototype.vb = function () {
                var e = this;
                a((function () {
                    if (e.Ya()) {
                        var t = i.console;
                        void 0 !== t && t.error(e.B)
                    }
                }), 1)
            }, t.prototype.Ya = function () {
                if (this.N) return !1;
                var e = i.CustomEvent, t = i.Event, n = i.dispatchEvent;
                return void 0 === n || ("function" == typeof e ? e = new e("unhandledrejection", {cancelable: !0}) : "function" == typeof t ? e = new t("unhandledrejection", {cancelable: !0}) : (e = i.document.createEvent("CustomEvent")).initCustomEvent("unhandledrejection", !1, !0, e), e.promise = this, e.reason = this.B, n(e))
            }, t.prototype.na = function () {
                if (null != this.h) {
                    for (var e = 0; e < this.h.length; ++e) o.o(this.h[e]);
                    this.h = null
                }
            };
            var o = new n;
            return t.prototype.wb = function (e) {
                var t = this.J();
                e.nb(t.resolve, t.reject)
            }, t.prototype.Wb = function (e, t) {
                var n = this.J();
                try {
                    e.call(t, n.resolve, n.reject)
                } catch (e) {
                    n.reject(e)
                }
            }, t.prototype.then = function (e, n) {
                function r(e, t) {
                    return "function" == typeof e ? function (t) {
                        try {
                            a(e(t))
                        } catch (e) {
                            i(e)
                        }
                    } : t
                }

                var a, i, o = new t((function (e, t) {
                    a = e, i = t
                }));
                return this.nb(r(e, a), r(n, i)), o
            }, t.prototype.catch = function (e) {
                return this.then(void 0, e)
            }, t.prototype.nb = function (e, t) {
                function n() {
                    switch (r.o) {
                        case 1:
                            e(r.B);
                            break;
                        case 2:
                            t(r.B);
                            break;
                        default:
                            throw Error("Unexpected state: " + r.o)
                    }
                }

                var r = this;
                null == this.h ? o.o(n) : this.h.push(n), this.N = !0
            }, t.resolve = r, t.reject = function (e) {
                return new t((function (t, n) {
                    n(e)
                }))
            }, t.race = function (e) {
                return new t((function (t, n) {
                    for (var a = u(e), i = a.next(); !i.done; i = a.next()) r(i.value).nb(t, n)
                }))
            }, t.all = function (e) {
                var n = u(e), a = n.next();
                return a.done ? r([]) : new t((function (e, t) {
                    function i(t) {
                        return function (n) {
                            o[t] = n, 0 == --s && e(o)
                        }
                    }

                    var o = [], s = 0;
                    do {
                        o.push(void 0), s++, r(a.value).nb(i(o.length - 1), t), a = n.next()
                    } while (!a.done)
                }))
            }, t
        }));
        var N = "function" == typeof Object.assign ? Object.assign : function (e, t) {
            for (var n = 1; n < arguments.length; n++) {
                var r = arguments[n];
                if (r) for (var a in r) B(r, a) && (e[a] = r[a])
            }
            return e
        };

        function C(e, t, n) {
            if (null == e) throw new TypeError("The 'this' value for String.prototype." + n + " must not be null or undefined");
            if (t instanceof RegExp) throw new TypeError("First argument to String.prototype." + n + " must not be a regular expression");
            return e + ""
        }

        function T(e, t) {
            return e = void 0 !== e ? String(e) : " ", 0 < t && e ? e.repeat(Math.ceil(t / e.length)).substring(0, t) : ""
        }

        function I(e, t, n) {
            e instanceof String && (e = String(e));
            for (var r = e.length, a = 0; a < r; a++) {
                var i = e[a];
                if (t.call(n, i, a, e)) return {Hb: a, Pb: i}
            }
            return {Hb: -1, Pb: void 0}
        }

        function O(e) {
            return e || Array.prototype.fill
        }

        function S(e, t) {
            e instanceof String && (e += "");
            var n = 0, r = !1, a = {
                next: function () {
                    if (!r && n < e.length) {
                        var a = n++;
                        return {value: t(a, e[a]), done: !1}
                    }
                    return r = !0, {done: !0, value: void 0}
                }
            };
            return a[Symbol.iterator] = function () {
                return a
            }, a
        }

        function R(e, t) {
            if (!("0" !== e && "-0" !== e || "0" !== t && "-0" !== t)) return 0;
            var n = /(?:\+|(-))?(\d+)?(?:\.(\d+))?/;
            e = n.exec(e + "");
            var r = n.exec(t + ""), a = !e[1], i = !r[1];
            return t = (e[2] || "").replace(/^0*/, ""), n = (r[2] || "").replace(/^0*/, ""), e = e[3] || "", r = r[3] || "", a && !i ? 1 : !a && i ? -1 : (a = a && i, t.length > n.length ? a ? 1 : -1 : t.length < n.length ? a ? -1 : 1 : t > n ? a ? 1 : -1 : t < n ? a ? -1 : 1 : (t = Math.max(e.length, r.length), (n = e.padEnd(t, "0")) > (t = r.padEnd(t, "0")) ? a ? 1 : -1 : n < t ? a ? -1 : 1 : 0))
        }

        function D(e, t) {
            return !(-1 < (e = e.toString()).indexOf(".") && 0 === t) && (!(e = /^[-+]?0*([1-9]\d*)?(?:\.((?:\d*[1-9])*)0*)?$/.exec(e))[2] || e[2].length <= t)
        }

        function G(e, t) {
            switch (t) {
                case"required":
                    return /(Z)|([+-])([01]\d):([0-5]\d)$/.test(e.toString());
                case"prohibited":
                    return !/(Z)|([+-])([01]\d):([0-5]\d)$/.test(e.toString());
                case"optional":
                    return !0
            }
        }

        function M(e) {
            switch (e) {
                case 1:
                case 0:
                case 6:
                case 3:
                    return {};
                case 4:
                    return {
                        la: D, ra: function (e, t) {
                            return 1 > R(e, t)
                        }, zc: function (e, t) {
                            return 0 > R(e, t)
                        }, sa: function (e, t) {
                            return -1 < R(e, t)
                        }, Ac: function (e, t) {
                            return 0 < R(e, t)
                        }
                    };
                case 18:
                    return {};
                case 9:
                case 8:
                case 7:
                case 11:
                case 12:
                case 13:
                case 15:
                case 14:
                    return {xa: G};
                case 22:
                case 21:
                case 20:
                case 23:
                case 44:
                    return {};
                default:
                    return null
            }
        }

        o("Object.assign", (function (e) {
            return e || N
        })), o("String.prototype.repeat", (function (e) {
            return e || function (e) {
                var t = C(this, null, "repeat");
                if (0 > e || 1342177279 < e) throw new RangeError("Invalid count value");
                e |= 0;
                for (var n = ""; e;) 1 & e && (n += t), (e >>>= 1) && (t += t);
                return n
            }
        })), o("String.prototype.padEnd", (function (e) {
            return e || function (e, t) {
                var n = C(this, null, "padStart");
                return n + T(t, e - n.length)
            }
        })), o("WeakMap", (function (e) {
            function t(e) {
                if (this.h = (l += Math.random() + 1).toString(), e) {
                    e = u(e);
                    for (var t; !(t = e.next()).done;) t = t.value, this.set(t[0], t[1])
                }
            }

            function n() {
            }

            function r(e) {
                var t = typeof e;
                return "object" === t && null !== e || "function" === t
            }

            function i(e) {
                if (!B(e, s)) {
                    var t = new n;
                    a(e, s, {value: t})
                }
            }

            function o(e) {
                var t = Object[e];
                t && (Object[e] = function (e) {
                    return e instanceof n ? e : (Object.isExtensible(e) && i(e), t(e))
                })
            }

            if (function () {
                if (!e || !Object.seal) return !1;
                try {
                    var t = Object.seal({}), n = Object.seal({}), r = new e([[t, 2], [n, 3]]);
                    return 2 == r.get(t) && 3 == r.get(n) && (r.delete(t), r.set(n, 4), !r.has(t) && 4 == r.get(n))
                } catch (e) {
                    return !1
                }
            }()) return e;
            var s = "$jscomp_hidden_" + Math.random();
            o("freeze"), o("preventExtensions"), o("seal");
            var l = 0;
            return t.prototype.set = function (e, t) {
                if (!r(e)) throw Error("Invalid WeakMap key");
                if (i(e), !B(e, s)) throw Error("WeakMap key fail: " + e);
                return e[s][this.h] = t, this
            }, t.prototype.get = function (e) {
                return r(e) && B(e, s) ? e[s][this.h] : void 0
            }, t.prototype.has = function (e) {
                return r(e) && B(e, s) && B(e[s], this.h)
            }, t.prototype.delete = function (e) {
                return !!(r(e) && B(e, s) && B(e[s], this.h)) && delete e[s][this.h]
            }, t
        })), o("Map", (function (e) {
            function t() {
                var e = {};
                return e.Ba = e.next = e.head = e
            }

            function n(e, t) {
                var n = e.h;
                return s((function () {
                    if (n) {
                        for (; n.head != e.h;) n = n.Ba;
                        for (; n.next != n.head;) return n = n.next, {done: !1, value: t(n)};
                        n = null
                    }
                    return {done: !0, value: void 0}
                }))
            }

            function r(e, t) {
                var n = t && typeof t;
                "object" == n || "function" == n ? i.has(t) ? n = i.get(t) : (n = "" + ++o, i.set(t, n)) : n = "p_" + t;
                var r = e.o[n];
                if (r && B(e.o, n)) for (e = 0; e < r.length; e++) {
                    var a = r[e];
                    if (t != t && a.key != a.key || t === a.key) return {id: n, list: r, index: e, ja: a}
                }
                return {id: n, list: r, index: -1, ja: void 0}
            }

            function a(e) {
                if (this.o = {}, this.h = t(), this.size = 0, e) {
                    e = u(e);
                    for (var n; !(n = e.next()).done;) n = n.value, this.set(n[0], n[1])
                }
            }

            if (function () {
                if (!e || "function" != typeof e || !e.prototype.entries || "function" != typeof Object.seal) return !1;
                try {
                    var t = Object.seal({x: 4}), n = new e(u([[t, "s"]]));
                    if ("s" != n.get(t) || 1 != n.size || n.get({x: 4}) || n.set({x: 4}, "t") != n || 2 != n.size) return !1;
                    var r = n.entries(), a = r.next();
                    return !a.done && a.value[0] == t && "s" == a.value[1] && !((a = r.next()).done || 4 != a.value[0].x || "t" != a.value[1] || !r.next().done)
                } catch (e) {
                    return !1
                }
            }()) return e;
            var i = new WeakMap;
            a.prototype.set = function (e, t) {
                var n = r(this, e = 0 === e ? 0 : e);
                return n.list || (n.list = this.o[n.id] = []), n.ja ? n.ja.value = t : (n.ja = {
                    next: this.h,
                    Ba: this.h.Ba,
                    head: this.h,
                    key: e,
                    value: t
                }, n.list.push(n.ja), this.h.Ba.next = n.ja, this.h.Ba = n.ja, this.size++), this
            }, a.prototype.delete = function (e) {
                return !(!(e = r(this, e)).ja || !e.list) && (e.list.splice(e.index, 1), e.list.length || delete this.o[e.id], e.ja.Ba.next = e.ja.next, e.ja.next.Ba = e.ja.Ba, e.ja.head = null, this.size--, !0)
            }, a.prototype.clear = function () {
                this.o = {}, this.h = this.h.Ba = t(), this.size = 0
            }, a.prototype.has = function (e) {
                return !!r(this, e).ja
            }, a.prototype.get = function (e) {
                return (e = r(this, e).ja) && e.value
            }, a.prototype.entries = function () {
                return n(this, (function (e) {
                    return [e.key, e.value]
                }))
            }, a.prototype.keys = function () {
                return n(this, (function (e) {
                    return e.key
                }))
            }, a.prototype.values = function () {
                return n(this, (function (e) {
                    return e.value
                }))
            }, a.prototype.forEach = function (e, t) {
                for (var n, r = this.entries(); !(n = r.next()).done;) n = n.value, e.call(t, n[1], n[0], this)
            }, a.prototype[Symbol.iterator] = a.prototype.entries;
            var o = 0;
            return a
        })), o("Array.prototype.find", (function (e) {
            return e || function (e, t) {
                return I(this, e, t).Pb
            }
        })), o("String.prototype.startsWith", (function (e) {
            return e || function (e, t) {
                var n = C(this, e, "startsWith"), r = n.length, a = e.length;
                t = Math.max(0, Math.min(0 | t, n.length));
                for (var i = 0; i < a && t < r;) if (n[t++] != e[i++]) return !1;
                return i >= a
            }
        })), o("Array.prototype.fill", (function (e) {
            return e || function (e, t, n) {
                var r = this.length || 0;
                for (0 > t && (t = Math.max(0, r + t)), (null == n || n > r) && (n = r), 0 > (n = Number(n)) && (n = Math.max(0, r + n)), t = Number(t || 0); t < n; t++) this[t] = e;
                return this
            }
        })), o("Int8Array.prototype.fill", O), o("Uint8Array.prototype.fill", O), o("Uint8ClampedArray.prototype.fill", O), o("Int16Array.prototype.fill", O), o("Uint16Array.prototype.fill", O), o("Int32Array.prototype.fill", O), o("Uint32Array.prototype.fill", O), o("Float32Array.prototype.fill", O), o("Float64Array.prototype.fill", O), o("Array.from", (function (e) {
            return e || function (e, t, n) {
                t = null != t ? t : function (e) {
                    return e
                };
                var r = [], a = "undefined" != typeof Symbol && Symbol.iterator && e[Symbol.iterator];
                if ("function" == typeof a) {
                    e = a.call(e);
                    for (var i = 0; !(a = e.next()).done;) r.push(t.call(n, a.value, i++))
                } else for (a = e.length, i = 0; i < a; i++) r.push(t.call(n, e[i], i));
                return r
            }
        })), o("Object.is", (function (e) {
            return e || function (e, t) {
                return e === t ? 0 !== e || 1 / e == 1 / t : e != e && t != t
            }
        })), o("Array.prototype.includes", (function (e) {
            return e || function (e, t) {
                var n = this;
                n instanceof String && (n = String(n));
                var r = n.length;
                for (0 > (t = t || 0) && (t = Math.max(t + r, 0)); t < r; t++) {
                    var a = n[t];
                    if (a === e || Object.is(a, e)) return !0
                }
                return !1
            }
        })), o("String.prototype.includes", (function (e) {
            return e || function (e, t) {
                return -1 !== C(this, e, "includes").indexOf(e, t || 0)
            }
        })), o("Number.MAX_SAFE_INTEGER", (function () {
            return 9007199254740991
        })), o("Number.MIN_SAFE_INTEGER", (function () {
            return -9007199254740991
        })), o("Math.trunc", (function (e) {
            return e || function (e) {
                if (e = Number(e), isNaN(e) || 1 / 0 === e || -1 / 0 === e || 0 === e) return e;
                var t = Math.floor(Math.abs(e));
                return 0 > e ? -t : t
            }
        })), o("Number.isFinite", (function (e) {
            return e || function (e) {
                return "number" == typeof e && (!isNaN(e) && 1 / 0 !== e && -1 / 0 !== e)
            }
        })), o("String.prototype.padStart", (function (e) {
            return e || function (e, t) {
                var n = C(this, null, "padStart");
                return T(t, e - n.length) + n
            }
        })), o("Array.prototype.keys", (function (e) {
            return e || function () {
                return S(this, (function (e) {
                    return e
                }))
            }
        })), o("Number.isInteger", (function (e) {
            return e || function (e) {
                return !!Number.isFinite(e) && e === Math.floor(e)
            }
        })), o("Number.isSafeInteger", (function (e) {
            return e || function (e) {
                return Number.isInteger(e) && Math.abs(e) <= Number.MAX_SAFE_INTEGER
            }
        })), o("Array.prototype.findIndex", (function (e) {
            return e || function (e, t) {
                return I(this, e, t).Hb
            }
        })), o("String.prototype.endsWith", (function (e) {
            return e || function (e, t) {
                var n = C(this, e, "endsWith");
                void 0 === t && (t = n.length), t = Math.max(0, Math.min(0 | t, n.length));
                for (var r = e.length; 0 < r && 0 < t;) if (n[--t] != e[--r]) return !1;
                return 0 >= r
            }
        })), o("String.fromCodePoint", (function (e) {
            return e || function (e) {
                for (var t = "", n = 0; n < arguments.length; n++) {
                    var r = Number(arguments[n]);
                    if (0 > r || 1114111 < r || r !== Math.floor(r)) throw new RangeError("invalid_code_point " + r);
                    65535 >= r ? t += String.fromCharCode(r) : (r -= 65536, t += String.fromCharCode(r >>> 10 & 1023 | 55296), t += String.fromCharCode(1023 & r | 56320))
                }
                return t
            }
        })), o("String.prototype.codePointAt", (function (e) {
            return e || function (e) {
                var t = C(this, null, "codePointAt"), n = t.length;
                if (0 <= (e = Number(e) || 0) && e < n) {
                    e |= 0;
                    var r = t.charCodeAt(e);
                    return 55296 > r || 56319 < r || e + 1 === n || (56320 > (e = t.charCodeAt(e + 1)) || 57343 < e) ? r : 1024 * (r - 55296) + e + 9216
                }
            }
        })), o("Set", (function (e) {
            function t(e) {
                if (this.h = new Map, e) {
                    e = u(e);
                    for (var t; !(t = e.next()).done;) this.add(t.value)
                }
                this.size = this.h.size
            }

            return function () {
                if (!e || "function" != typeof e || !e.prototype.entries || "function" != typeof Object.seal) return !1;
                try {
                    var t = Object.seal({x: 4}), n = new e(u([t]));
                    if (!n.has(t) || 1 != n.size || n.add(t) != n || 1 != n.size || n.add({x: 4}) != n || 2 != n.size) return !1;
                    var r = n.entries(), a = r.next();
                    return !a.done && a.value[0] == t && a.value[1] == t && (!(a = r.next()).done && a.value[0] != t && 4 == a.value[0].x && a.value[1] == a.value[0] && r.next().done)
                } catch (e) {
                    return !1
                }
            }() ? e : (t.prototype.add = function (e) {
                return e = 0 === e ? 0 : e, this.h.set(e, e), this.size = this.h.size, this
            }, t.prototype.delete = function (e) {
                return e = this.h.delete(e), this.size = this.h.size, e
            }, t.prototype.clear = function () {
                this.h.clear(), this.size = 0
            }, t.prototype.has = function (e) {
                return this.h.has(e)
            }, t.prototype.entries = function () {
                return this.h.entries()
            }, t.prototype.values = function () {
                return this.h.values()
            }, t.prototype.keys = t.prototype.values, t.prototype[Symbol.iterator] = t.prototype.values, t.prototype.forEach = function (e, t) {
                var n = this;
                this.h.forEach((function (r) {
                    return e.call(t, r, r, n)
                }))
            }, t)
        })), o("Math.log10", (function (e) {
            return e || function (e) {
                return Math.log(e) / Math.LN10
            }
        })), o("Number.isNaN", (function (e) {
            return e || function (e) {
                return "number" == typeof e && isNaN(e)
            }
        })), o("Object.values", (function (e) {
            return e || function (e) {
                var t, n = [];
                for (t in e) B(e, t) && n.push(e[t]);
                return n
            }
        })), o("Array.prototype.values", (function (e) {
            return e || function () {
                return S(this, (function (e, t) {
                    return t
                }))
            }
        })), o("Object.getOwnPropertySymbols", (function (e) {
            return e || function () {
                return []
            }
        }));
        var U = {}, F = {};

        function P(e) {
            return /^([+-]?(\d*(\.\d*)?([eE][+-]?\d*)?|INF)|NaN)$/.test(e)
        }

        function H(e) {
            return /^[_:A-Za-z][-._:A-Za-z0-9]*$/.test(e)
        }

        function j(e) {
            return H(e) && /^[_A-Za-z]([-._A-Za-z0-9])*$/.test(e)
        }

        function X(e) {
            return 1 === (e = e.split(":")).length ? j(e[0]) : 2 === e.length && (j(e[0]) && j(e[1]))
        }

        function _(e) {
            return !/[\u0009\u000A\u000D]/.test(e)
        }

        function L(e) {
            return j(e)
        }

        var k = new Map([[45, function () {
            return !0
        }], [46, function () {
            return !0
        }], [1, function () {
            return !0
        }], [0, function (e) {
            return /^(0|1|true|false)$/.test(e)
        }], [6, function (e) {
            return P(e)
        }], [3, P], [4, function (e) {
            return /^[+-]?\d*(\.\d*)?$/.test(e)
        }], [18, function (e) {
            return /^(-)?P(\d+Y)?(\d+M)?(\d+D)?(T(\d+H)?(\d+M)?(\d+(\.\d*)?S)?)?$/.test(e)
        }], [9, function (e) {
            return /^-?([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T(([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?|(24:00:00(\.0+)?))(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?$/.test(e)
        }], [8, function (e) {
            return /^(([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?|(24:00:00(\.0+)?))(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?$/.test(e)
        }], [7, function (e) {
            return /^-?([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?$/.test(e)
        }], [11, function (e) {
            return /^-?([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2])(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?$/.test(e)
        }], [12, function (e) {
            return /^-?([1-9][0-9]{3,}|0[0-9]{3})(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?$/.test(e)
        }], [13, function (e) {
            return /^--(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?$/.test(e)
        }], [15, function (e) {
            return /^---(0[1-9]|[12][0-9]|3[01])(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?$/.test(e)
        }], [14, function (e) {
            return /^--(0[1-9]|1[0-2])(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?$/.test(e)
        }], [22, function (e) {
            return /^([0-9A-Fa-f]{2})*$/.test(e)
        }], [21, function (e) {
            return new RegExp(/^((([A-Za-z0-9+/] ?){4})*((([A-Za-z0-9+/] ?){3}[A-Za-z0-9+/])|(([A-Za-z0-9+/] ?){2}[AEIMQUYcgkosw048] ?=)|(([A-Za-z0-9+/] ?)[AQgw] ?= ?=)))?$/).test(e)
        }], [20, function () {
            return !0
        }], [44, X], [48, _], [52, function (e) {
            return _(e) && !/^ | {2,}| $/.test(e)
        }], [51, function (e) {
            return /^[a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*$/.test(e)
        }], [50, function (e) {
            return /^[-._:A-Za-z0-9]+$/.test(e)
        }], [25, H], [23, X], [24, j], [42, L], [41, L], [26, function (e) {
            return j(e)
        }], [5, function (e) {
            return /^[+-]?\d+$/.test(e)
        }], [16, function (e) {
            return /^-?P[0-9]+(Y([0-9]+M)?|M)$/.test(e)
        }], [17, function (e) {
            return /^-?P([0-9]+D)?(T([0-9]+H)?([0-9]+M)?([0-9]+(\.[0-9]+)?S)?)?$/.test(e)
        }]]), Y = Object.create(null);

        function q(e, t) {
            if (!Y[t]) throw Error("Unknown type");
            return {type: t, value: e}
        }

        [{D: 0, name: 59}, {D: 0, name: 46, parent: 59, L: {whiteSpace: "preserve"}}, {D: 0, name: 19, parent: 46}, {
            D: 0,
            name: 1,
            parent: 46
        }, {D: 0, name: 0, parent: 46, L: {whiteSpace: "collapse"}}, {
            D: 0,
            name: 4,
            parent: 46,
            L: {whiteSpace: "collapse"}
        }, {D: 0, name: 6, parent: 46, L: {whiteSpace: "collapse"}}, {
            D: 0,
            name: 3,
            parent: 46,
            L: {whiteSpace: "collapse"}
        }, {D: 0, name: 18, parent: 46, L: {whiteSpace: "collapse"}}, {
            D: 0,
            name: 9,
            parent: 46,
            L: {xa: "optional", whiteSpace: "collapse"}
        }, {D: 0, name: 8, parent: 46, L: {xa: "optional", whiteSpace: "collapse"}}, {
            D: 0,
            name: 7,
            parent: 46,
            L: {xa: "optional", whiteSpace: "collapse"}
        }, {D: 0, name: 11, parent: 46, L: {xa: "optional", whiteSpace: "collapse"}}, {
            D: 0,
            name: 12,
            parent: 46,
            L: {xa: "optional", whiteSpace: "collapse"}
        }, {D: 0, name: 13, parent: 46, L: {xa: "optional", whiteSpace: "collapse"}}, {
            D: 0,
            name: 15,
            parent: 46,
            L: {xa: "optional", whiteSpace: "collapse"}
        }, {D: 0, name: 14, parent: 46, L: {xa: "optional", whiteSpace: "collapse"}}, {
            D: 0,
            name: 22,
            parent: 46,
            L: {whiteSpace: "collapse"}
        }, {D: 0, name: 21, parent: 46, L: {whiteSpace: "collapse"}}, {
            D: 0,
            name: 20,
            parent: 46,
            L: {whiteSpace: "collapse"}
        }, {D: 0, name: 23, parent: 46, L: {whiteSpace: "collapse"}}, {
            D: 0,
            name: 44,
            parent: 46,
            L: {whiteSpace: "collapse"}
        }, {D: 1, name: 10, V: 9, L: {whiteSpace: "collapse", xa: "required"}}, {
            D: 1,
            name: 48,
            V: 1,
            L: {whiteSpace: "replace"}
        }, {D: 1, name: 52, V: 48, L: {whiteSpace: "collapse"}}, {
            D: 1,
            name: 51,
            V: 52,
            L: {whiteSpace: "collapse"}
        }, {D: 1, name: 50, V: 52, L: {whiteSpace: "collapse"}}, {
            D: 2,
            name: 49,
            type: 50,
            L: {minLength: 1, whiteSpace: "collapse"}
        }, {D: 1, name: 25, V: 52, L: {whiteSpace: "collapse"}}, {
            D: 1,
            name: 24,
            V: 25,
            L: {whiteSpace: "collapse"}
        }, {D: 1, name: 42, V: 24, L: {whiteSpace: "collapse"}}, {
            D: 1,
            name: 41,
            V: 24,
            L: {whiteSpace: "collapse"}
        }, {D: 2, name: 43, type: 41, L: {minLength: 1, whiteSpace: "collapse"}}, {
            D: 1,
            name: 26,
            V: 24,
            L: {whiteSpace: "collapse"}
        }, {D: 2, name: 40, type: 26, L: {minLength: 1, whiteSpace: "collapse"}}, {
            D: 0,
            name: 5,
            parent: 4,
            L: {la: 0, whiteSpace: "collapse"}
        }, {D: 1, name: 27, V: 5, L: {la: 0, ra: "0", whiteSpace: "collapse"}}, {
            D: 1,
            name: 28,
            V: 27,
            L: {la: 0, ra: "-1", whiteSpace: "collapse"}
        }, {
            D: 1,
            name: 31,
            V: 5,
            L: {la: 0, ra: "9223372036854775807", sa: "-9223372036854775808", whiteSpace: "collapse"}
        }, {D: 1, name: 32, V: 31, L: {la: 0, ra: "2147483647", sa: "-2147483648", whiteSpace: "collapse"}}, {
            D: 1,
            name: 33,
            V: 32,
            L: {la: 0, ra: "32767", sa: "-32768", whiteSpace: "collapse"}
        }, {D: 1, name: 34, V: 33, L: {la: 0, ra: "127", sa: "-128", whiteSpace: "collapse"}}, {
            D: 1,
            name: 30,
            V: 5,
            L: {la: 0, sa: "0", whiteSpace: "collapse"}
        }, {D: 1, name: 36, V: 30, L: {la: 0, ra: "18446744073709551615", sa: "0", whiteSpace: "collapse"}}, {
            D: 1,
            name: 35,
            V: 36,
            L: {la: 0, ra: "4294967295", sa: "0", whiteSpace: "collapse"}
        }, {D: 1, name: 38, V: 35, L: {la: 0, ra: "65535", sa: "0", whiteSpace: "collapse"}}, {
            D: 1,
            name: 37,
            V: 38,
            L: {la: 0, ra: "255", sa: "0", whiteSpace: "collapse"}
        }, {D: 1, name: 29, V: 30, L: {la: 0, sa: "1", whiteSpace: "collapse"}}, {
            D: 1,
            name: 16,
            V: 18,
            L: {whiteSpace: "collapse"}
        }, {D: 1, name: 17, V: 18, L: {whiteSpace: "collapse"}}, {D: 1, name: 60, V: 59}, {D: 3, name: 39, Ha: []}, {
            D: 1,
            name: 61,
            V: 60
        }, {D: 1, name: 62, V: 60}, {D: 0, name: 53, parent: 59}, {D: 1, name: 54, V: 53}, {D: 1, name: 58, V: 53}, {
            D: 1,
            name: 47,
            V: 53
        }, {D: 1, name: 56, V: 53}, {D: 1, name: 57, V: 53}, {D: 1, name: 55, V: 53}, {
            D: 3,
            name: 2,
            Ha: [4, 5, 6, 3]
        }].forEach((function (e) {
            var t = e.name, n = e.L || {};
            if (0 === e.D) {
                e = e.parent ? Y[e.parent] : null;
                var r = k.get(t) || null;
                Y[t] = {D: 0, type: t, Ia: n, parent: e, fb: r, Ka: M(t), Ha: []}
            } else 1 === e.D ? (e = Y[e.V], r = k.get(t) || null, Y[t] = {
                D: 1,
                type: t,
                Ia: n,
                parent: e,
                fb: r,
                Ka: e.Ka,
                Ha: []
            }) : 2 === e.D ? Y[t] = {
                D: 2,
                type: t,
                Ia: n,
                parent: Y[e.type],
                fb: null,
                Ka: U,
                Ha: []
            } : (e = e.Ha.map((function (e) {
                return Y[e]
            })), Y[t] = {D: 3, type: t, Ia: n, parent: null, fb: null, Ka: F, Ha: e})
        }));
        var V = q(!0, 0), Q = q(!1, 0);

        function J() {
            return Error("FORG0006: A wrong argument type was specified in a function call.")
        }

        function K(e, t) {
            this.done = e, this.value = t
        }

        var z = new K(!0, void 0);

        function Z(e) {
            return new K(!1, e)
        }

        function W(e, t) {
            return e === t || function e(t, n) {
                if (3 === n.D) return !!n.Ha.find((function (n) {
                    return e(t, n)
                }));
                for (; t;) {
                    if (t.type === n.type) return !0;
                    if (3 === t.D) return !!t.Ha.find((function (e) {
                        return W(e.type, n.type)
                    }));
                    t = t.parent
                }
                return !1
            }(Y[e], Y[t])
        }

        function $(e) {
            this.o = se, this.h = e;
            var t = -1;
            this.value = {
                next: function () {
                    return ++t >= e.length ? z : Z(e[t])
                }
            }
        }

        function ee() {
            this.value = {
                next: function () {
                    return z
                }
            }
        }

        function te(e) {
            var t = e.value;
            if (W(e.type, 53)) return !0;
            if (W(e.type, 0)) return t;
            if (W(e.type, 1) || W(e.type, 20) || W(e.type, 19)) return 0 !== t.length;
            if (W(e.type, 2)) return !isNaN(t) && 0 !== t;
            throw J()
        }

        function ne(e, t) {
            var n = this;
            this.J = se, this.value = {
                next: function (t) {
                    return null !== n.o && n.h >= n.o ? z : void 0 !== n.B[n.h] ? Z(n.B[n.h++]) : (t = e.next(t)).done ? (n.o = n.h, t) : ((n.v || 2 > n.h) && (n.B[n.h] = t.value), n.h++, t)
                }
            }, this.v = !1, this.B = [], this.h = 0, this.o = void 0 === t ? null : t
        }

        function re(e, t) {
            e.h = void 0 === t ? 0 : t
        }

        function ae(e) {
            this.B = se, this.h = e;
            var t = !1;
            this.value = {
                next: function () {
                    return t ? z : (t = !0, Z(e))
                }
            }, this.o = null
        }

        (n = $.prototype).pb = function () {
            return this
        }, n.filter = function (e) {
            var t = this, n = -1;
            return this.o.create({
                next: function () {
                    for (n++; n < t.h.length && !e(t.h[n], n, t);) n++;
                    return n >= t.h.length ? z : Z(t.h[n])
                }
            })
        }, n.first = function () {
            return this.h[0]
        }, n.S = function () {
            return this.h
        }, n.getEffectiveBooleanValue = function () {
            if (W(this.h[0].type, 53)) return !0;
            throw J()
        }, n.ya = function () {
            return this.h.length
        }, n.F = function () {
            return !1
        }, n.za = function () {
            return !1
        }, n.map = function (e) {
            var t = this, n = -1;
            return this.o.create({
                next: function () {
                    return ++n >= t.h.length ? z : Z(e(t.h[n], n, t))
                }
            }, this.h.length)
        }, n.M = function (e) {
            return e(this.h)
        }, n.aa = function (e) {
            return e.multiple ? e.multiple(this) : e.default(this)
        }, (n = ee.prototype).pb = function () {
            return this
        }, n.filter = function () {
            return this
        }, n.first = function () {
            return null
        }, n.S = function () {
            return []
        }, n.getEffectiveBooleanValue = function () {
            return !1
        }, n.ya = function () {
            return 0
        }, n.F = function () {
            return !0
        }, n.za = function () {
            return !1
        }, n.map = function () {
            return this
        }, n.M = function (e) {
            return e([])
        }, n.aa = function (e) {
            return e.empty ? e.empty(this) : e.default(this)
        }, (n = ne.prototype).pb = function () {
            return this.J.create(this.S())
        }, n.filter = function (e) {
            var t = this, n = -1, r = this.value;
            return this.J.create({
                next: function (a) {
                    n++;
                    for (var i = r.next(a); !i.done && !e(i.value, n, t);) n++, i = r.next(a);
                    return i
                }
            })
        }, n.first = function () {
            if (void 0 !== this.B[0]) return this.B[0];
            var e = this.value.next(0);
            return re(this), e.done ? null : e.value
        }, n.S = function () {
            if (this.h > this.B.length && this.o !== this.B.length) throw Error("Implementation error: Sequence Iterator has progressed.");
            var e = this.value;
            this.v = !0;
            for (var t = e.next(0); !t.done;) t = e.next(0);
            return this.B
        }, n.getEffectiveBooleanValue = function () {
            var e = this.value, t = this.h;
            re(this);
            var n = e.next(0);
            if (n.done) return re(this, t), !1;
            if (W((n = n.value).type, 53)) return re(this, t), !0;
            if (!e.next(0).done) throw J();
            return re(this, t), te(n)
        }, n.ya = function (e) {
            if (null !== this.o) return this.o;
            if (void 0 !== e && e) return -1;
            e = this.h;
            var t = this.S().length;
            return re(this, e), t
        }, n.F = function () {
            return 0 === this.o || null === this.first()
        }, n.za = function () {
            if (null !== this.o) return 1 === this.o;
            var e = this.value, t = this.h;
            return re(this), e.next(0).done ? (re(this, t), !1) : (e = e.next(0), re(this, t), e.done)
        }, n.map = function (e) {
            var t = this, n = 0, r = this.value;
            return this.J.create({
                next: function (a) {
                    return (a = r.next(a)).done ? z : Z(e(a.value, n++, t))
                }
            }, this.o)
        }, n.M = function (e, t) {
            var n, r = this.value, a = [], i = !0;
            return function () {
                for (var o = r.next(i ? 0 : t); !o.done; o = r.next(t)) i = !1, a.push(o.value);
                n = e(a).value
            }(), this.J.create({
                next: function () {
                    return n.next(0)
                }
            })
        }, n.aa = function (e) {
            function t(e) {
                r = e.value, -1 !== (e = e.ya(!0)) && (n.o = e)
            }

            var n = this, r = null;
            return this.J.create({
                next: function (a) {
                    return r ? r.next(a) : n.F() ? (t(e.empty ? e.empty(n) : e.default(n)), r.next(a)) : n.za() ? (t(e.s ? e.s(n) : e.default(n)), r.next(a)) : (t(e.multiple ? e.multiple(n) : e.default(n)), r.next(a))
                }
            })
        }, (n = ae.prototype).pb = function () {
            return this
        }, n.filter = function (e) {
            return e(this.h, 0, this) ? this : this.B.create()
        }, n.first = function () {
            return this.h
        }, n.S = function () {
            return [this.h]
        }, n.getEffectiveBooleanValue = function () {
            return null === this.o && (this.o = te(this.h)), this.o
        }, n.ya = function () {
            return 1
        }, n.F = function () {
            return !1
        }, n.za = function () {
            return !0
        }, n.map = function (e) {
            return this.B.create(e(this.h, 0, this))
        }, n.M = function (e) {
            return e([this.h])
        }, n.aa = function (e) {
            return e.s ? e.s(this) : e.default(this)
        };
        var ie = new ee;

        function oe(e, t) {
            if (null === (e = void 0 === e ? null : e)) return ie;
            if (Array.isArray(e)) switch (e.length) {
                case 0:
                    return ie;
                case 1:
                    return new ae(e[0]);
                default:
                    return new $(e)
            }
            return e.next ? new ne(e, void 0 === t ? null : t) : new ae(e)
        }

        var se = {
            create: oe, s: function (e) {
                return new ae(e)
            }, empty: function () {
                return oe()
            }, $: function () {
                return oe(V)
            }, U: function () {
                return oe(Q)
            }
        };

        function ue(e) {
            var t = [], n = e.value;
            return function () {
                var e = 0;
                return se.create({
                    next: function () {
                        if (void 0 !== t[e]) return t[e++];
                        var r = n.next(0);
                        return r.done ? r : t[e++] = r
                    }
                })
            }
        }

        function le(e, t) {
            this.type = e, this.value = t
        }

        var ce = {},
            he = (ce[0] = "xs:boolean", ce[1] = "xs:string", ce[2] = "xs:numeric", ce[3] = "xs:double", ce[4] = "xs:decimal", ce[5] = "xs:integer", ce[6] = "xs:float", ce[7] = "xs:date", ce[8] = "xs:time", ce[9] = "xs:dateTime", ce[10] = "xs:dateTimeStamp", ce[11] = "xs:gYearMonth", ce[12] = "xs:gYear", ce[13] = "xs:gMonthDay", ce[14] = "xs:gMonth", ce[15] = "xs:gDay", ce[16] = "xs:yearMonthDuration", ce[17] = "xs:dayTimeDuration", ce[18] = "xs:duration", ce[19] = "xs:untypedAtomic", ce[20] = "xs:anyURI", ce[21] = "xs:base64Binary", ce[22] = "xs:hexBinary", ce[23] = "xs:QName", ce[24] = "xs:NCName", ce[25] = "xs:Name", ce[26] = "xs:ENTITY", ce[27] = "xs:nonPositiveInteger", ce[28] = "xs:negativeInteger", ce[29] = "xs:positiveInteger", ce[30] = "xs:nonNegativeInteger", ce[31] = "xs:long", ce[32] = "xs:int", ce[33] = "xs:short", ce[34] = "xs:byte", ce[35] = "xs:unsignedInt", ce[36] = "xs:unsignedLong", ce[37] = "xs:unsignedByte", ce[38] = "xs:unsignedShort", ce[39] = "xs:error", ce[40] = "xs:ENTITIES", ce[41] = "xs:IDREF", ce[42] = "xs:ID", ce[43] = "xs:IDFREFS", ce[44] = "xs:NOTATION", ce[45] = "xs:anySimpleType", ce[46] = "xs:anyAtomicType", ce[47] = "attribute()", ce[48] = "xs:normalizedString", ce[49] = "xs:NMTOKENS", ce[50] = "xs:NMTOKEN", ce[51] = "xs:language", ce[52] = "xs:token", ce[53] = "node()", ce[54] = "element()", ce[55] = "document-node()", ce[56] = "text()", ce[57] = "processing-instruction()", ce[58] = "comment()", ce[59] = "item()", ce[60] = "function(*)", ce[61] = "map(*)", ce[62] = "array(*)", ce),
            pe = {
                "xs:boolean": 0,
                "xs:string": 1,
                "xs:numeric": 2,
                "xs:double": 3,
                "xs:decimal": 4,
                "xs:integer": 5,
                "xs:float": 6,
                "xs:date": 7,
                "xs:time": 8,
                "xs:dateTime": 9,
                "xs:dateTimeStamp": 10,
                "xs:gYearMonth": 11,
                "xs:gYear": 12,
                "xs:gMonthDay": 13,
                "xs:gMonth": 14,
                "xs:gDay": 15,
                "xs:yearMonthDuration": 16,
                "xs:dayTimeDuration": 17,
                "xs:duration": 18,
                "xs:untypedAtomic": 19,
                "xs:anyURI": 20,
                "xs:base64Binary": 21,
                "xs:hexBinary": 22,
                "xs:QName": 23,
                "xs:NCName": 24,
                "xs:Name": 25,
                "xs:ENTITY": 26,
                "xs:nonPositiveInteger": 27,
                "xs:negativeInteger": 28,
                "xs:positiveInteger": 29,
                "xs:nonNegativeInteger": 30,
                "xs:long": 31,
                "xs:int": 32,
                "xs:short": 33,
                "xs:byte": 34,
                "xs:unsignedInt": 35,
                "xs:unsignedLong": 36,
                "xs:unsignedByte": 37,
                "xs:unsignedShort": 38,
                "xs:error": 39,
                "xs:ENTITIES": 40,
                "xs:IDREF": 41,
                "xs:ID": 42,
                "xs:IDREFS": 43,
                "xs:NOTATION": 44,
                "xs:anySimpleType": 45,
                "xs:anyAtomicType": 46,
                "attribute()": 47,
                "xs:normalizedString": 48,
                "xs:NMTOKENS": 49,
                "xs:NMTOKEN": 50,
                "xs:language": 51,
                "xs:token": 52,
                "node()": 53,
                "element()": 54,
                "document-node()": 55,
                "text()": 56,
                "processing-instruction()": 57,
                "comment()": 58,
                "item()": 59,
                "function(*)": 60,
                "map(*)": 61,
                "array(*)": 62
            };

        function fe(e) {
            return 2 === e.g ? he[e.type] + "*" : 1 === e.g ? he[e.type] + "+" : 0 === e.g ? he[e.type] + "?" : he[e.type]
        }

        function de(e) {
            if (!e.startsWith("xs:") && 0 <= e.indexOf(":")) throw Error("XPST0081: Invalid prefix for input " + e);
            var t = pe[e];
            if (void 0 === t) throw Error('XPST0051: The type "' + e + '" could not be found');
            return t
        }

        function me(e) {
            switch (e[e.length - 1]) {
                case"*":
                    return {type: de(e.substr(0, e.length - 1)), g: 2};
                case"?":
                    return {type: de(e.substr(0, e.length - 1)), g: 0};
                case"+":
                    return {type: de(e.substr(0, e.length - 1)), g: 1};
                default:
                    return {type: de(e), g: 3}
            }
        }

        function ve(e, t, n) {
            this.namespaceURI = t || null, this.prefix = e || "", this.localName = n
        }

        function ge(e) {
            var t = e.l, n = e.arity, r = void 0 !== e.Oa && e.Oa, a = void 0 !== e.I && e.I, i = e.localName,
                o = e.namespaceURI, s = e.j;
            for (e = e.value, le.call(this, 60, null), this.value = e, this.I = a, a = -1, e = 0; e < t.length; e++) 4 === t[e] && (a = e);
            -1 < a && (e = Array(n - (t.length - 1)).fill(t[a - 1]), t = t.slice(0, a).concat(e)), this.o = t, this.B = n, this.N = r, this.J = i, this.v = o, this.C = s
        }

        function ye(e, t) {
            var n = [];
            return 2 !== e && 1 !== e || n.push("type-1-or-type-2"), n.push("type-" + e), t && n.push("name-" + t), n
        }

        function we(e) {
            var t = e.node.nodeType;
            if (2 === t || 1 === t) var n = e.node.localName;
            return ye(t, n)
        }

        function Ae(e) {
            var t = e.nodeType;
            if (2 === t || 1 === t) var n = e.localName;
            return ye(t, n)
        }

        function xe() {
        }

        function be() {
        }

        ve.prototype.va = function () {
            return this.prefix ? this.prefix + ":" + this.localName : this.localName
        }, v(ge, le), ge.prototype.Oa = function () {
            return this.N
        }, xe.prototype.getAllAttributes = function (e, t) {
            return t = void 0 === t ? null : t, 1 !== e.nodeType ? [] : (e = Array.from(e.attributes), null === t ? e : e.filter((function (e) {
                return Ae(e).includes(t)
            })))
        }, xe.prototype.getAttribute = function (e, t) {
            return 1 !== e.nodeType ? null : e.getAttribute(t)
        }, xe.prototype.getChildNodes = function (e, t) {
            return t = void 0 === t ? null : t, e = Array.from(e.childNodes), null === t ? e : e.filter((function (e) {
                return Ae(e).includes(t)
            }))
        }, xe.prototype.getData = function (e) {
            return 2 === e.nodeType ? e.value : e.data
        }, xe.prototype.getFirstChild = function (e, t) {
            for (t = void 0 === t ? null : t, e = e.firstChild; e; e = e.nextSibling) if (null === t || Ae(e).includes(t)) return e;
            return null
        }, xe.prototype.getLastChild = function (e, t) {
            for (t = void 0 === t ? null : t, e = e.lastChild; e; e = e.previousSibling) if (null === t || Ae(e).includes(t)) return e;
            return null
        }, xe.prototype.getNextSibling = function (e, t) {
            for (t = void 0 === t ? null : t, e = e.nextSibling; e; e = e.nextSibling) if (null === t || Ae(e).includes(t)) return e;
            return null
        }, xe.prototype.getParentNode = function (e, t) {
            return t = void 0 === t ? null : t, (e = 2 === e.nodeType ? e.ownerElement : e.parentNode) && (null === t || Ae(e).includes(t)) ? e : null
        }, xe.prototype.getPreviousSibling = function (e, t) {
            for (t = void 0 === t ? null : t, e = e.previousSibling; e; e = e.previousSibling) if (null === t || Ae(e).includes(t)) return e;
            return null
        }, (n = be.prototype).insertBefore = function (e, t, n) {
            return e.insertBefore(t, n)
        }, n.removeAttributeNS = function (e, t, n) {
            return e.removeAttributeNS(t, n)
        }, n.removeChild = function (e, t) {
            return e.removeChild(t)
        }, n.setAttributeNS = function (e, t, n, r) {
            e.setAttributeNS(t, n, r)
        }, n.setData = function (e, t) {
            e.data = t
        };
        var Ee = new be;

        function Be(e) {
            this.h = e
        }

        function Ne(e) {
            return void 0 !== e.Pa
        }

        function Ce(e, t, n) {
            var r = null;
            return t && (Ne(t.node) ? r = {G: t.G, offset: n, parent: t.node} : t.G && (r = t.G)), {node: e, G: r}
        }

        function Te(e) {
            this.h = e, this.o = []
        }

        function Ie(e, t, n) {
            return e.getAllAttributes(t.node, void 0 === n ? null : n).map((function (e) {
                return Ce(e, t, e.nodeName)
            }))
        }

        function Oe(e, t, n) {
            return Ne(t = t.node) ? (e = t.attributes.find((function (e) {
                return n === e.name
            }))) ? e.value : null : (e = e.h.getAttribute(t, n)) ? e : null
        }

        function Se(e, t, n) {
            return e.getChildNodes(t.node, void 0 === n ? null : n).map((function (e, n) {
                return Ce(e, t, n)
            }))
        }

        function Re(e, t) {
            return e.getData(t.node)
        }

        function De(e, t, n) {
            var r = t.node;
            return Ne(r) ? e = r.childNodes[0] : ((n = e.h.getFirstChild(r, void 0 === n ? null : n)) && 10 === n.nodeType && (n = e.h.getNextSibling(n)), e = n), e ? Ce(e, t, 0) : null
        }

        function Ge(e, t, n) {
            n = void 0 === n ? null : n;
            var r = t.node;
            return Ne(r) ? (e = r.childNodes.length - 1, r = r.childNodes[e]) : ((r = e.h.getLastChild(r, n)) && 10 === r.nodeType && (r = e.h.getPreviousSibling(r)), e = e.getChildNodes(t.node, n).length - 1), r ? Ce(r, t, e) : null
        }

        function Me(e, t, n) {
            n = void 0 === n ? null : n;
            var r = t.node, a = t.G;
            if (Ne(r)) {
                if (a) var i = a.offset + 1, o = a.parent.childNodes[i]
            } else {
                if (!a) {
                    for (o = r; o && (!(o = e.h.getNextSibling(o, n)) || 10 === o.nodeType);) ;
                    return o ? {node: o, G: null} : null
                }
                i = a.offset + 1;
                var s = Ue(e, t, null);
                o = e.getChildNodes(s.node, n)[i]
            }
            return o ? Ce(o, s || Ue(e, t, n), i) : null
        }

        function Ue(e, t, n) {
            n = void 0 === n ? null : n;
            var r = t.node, a = t.G;
            if (a) "number" == typeof a.offset && r === a.parent.childNodes[a.offset] || "string" == typeof a.offset && r === a.parent.attributes.find((function (e) {
                return a.offset === e.nodeName
            })) ? (e = a.parent, t = a.G) : (e = e.getParentNode(r, n), t = a); else {
                if (Ne(r)) return null;
                e = e.getParentNode(r, n), t = null
            }
            return e ? {node: e, G: t} : null
        }

        function Fe(e, t, n) {
            n = void 0 === n ? null : n;
            var r = t.node, a = t.G;
            if (Ne(r)) {
                if (a) var i = a.offset - 1, o = a.parent.childNodes[i]
            } else {
                if (!a) {
                    for (o = r; o && (!(o = e.h.getPreviousSibling(o, n)) || 10 === o.nodeType);) ;
                    return o ? {node: o, G: null} : null
                }
                i = a.offset - 1;
                var s = Ue(e, t, null);
                o = e.getChildNodes(s.node, n)[i]
            }
            return o ? Ce(o, s || Ue(e, t, n), i) : null
        }

        function Pe(e, t, n, r, a) {
            return a.M((function (e) {
                var t = u(e).next().value;
                return r.M((function (e) {
                    e = u(e).next().value;
                    var n = t.value;
                    if (0 >= n || n > e.R.length) throw Error("FOAY0001: array position out of bounds.");
                    return e.R[n - 1]()
                }))
            }))
        }

        function He(e) {
            ge.call(this, {
                value: function (e, n, r, a) {
                    return Pe(0, 0, 0, se.s(t), a)
                },
                localName: "get",
                namespaceURI: "http://www.w3.org/2005/xpath-functions/array",
                l: [{type: 5, g: 3}],
                arity: 1,
                j: {type: 59, g: 2}
            });
            var t = this;
            this.type = 62, this.R = e
        }

        function je(e) {
            switch (e.node.nodeType) {
                case 2:
                    return 47;
                case 1:
                    return 54;
                case 3:
                case 4:
                    return 56;
                case 7:
                    return 57;
                case 8:
                    return 58;
                case 9:
                    return 55;
                default:
                    return 53
            }
        }

        function Xe(e) {
            return {type: je(e), value: e}
        }

        function _e(e, t) {
            return t(e = e.map((function (e) {
                return e.first()
            })))
        }

        function Le(e, t) {
            var n = W(e.type, 1) || W(e.type, 20) || W(e.type, 19), r = W(t.type, 1) || W(t.type, 20) || W(t.type, 19);
            return n && r ? e.value === t.value : (n = W(e.type, 4) || W(e.type, 3) || W(e.type, 6), r = W(t.type, 4) || W(t.type, 3) || W(t.type, 6), n && r ? !(!isNaN(e.value) || !isNaN(t.value)) || e.value === t.value : (n = W(e.type, 0) || W(e.type, 22) || W(e.type, 18) || W(e.type, 23) || W(e.type, 44), r = W(t.type, 0) || W(t.type, 22) || W(t.type, 18) || W(t.type, 23) || W(t.type, 44), !(!n || !r) && e.value === t.value))
        }

        function ke(e, t, n, r, a) {
            return _e([r, a], (function (e) {
                var t = (e = u(e)).next().value, n = e.next().value;
                return (e = t.h.find((function (e) {
                    return Le(e.key, n)
                }))) ? e.value() : se.empty()
            }))
        }

        function Ye(e) {
            ge.call(this, {
                l: [{type: 59, g: 3}],
                arity: 1,
                localName: "get",
                namespaceURI: "http://www.w3.org/2005/xpath-functions/map",
                value: function (e, n, r, a) {
                    return ke(0, 0, 0, se.s(t), a)
                },
                j: {type: 59, g: 2}
            });
            var t = this;
            this.type = 61, this.h = e
        }

        function qe() {
        }

        function Ve(e, t) {
            return e.ab() === t.ab() && e.bb() === t.bb()
        }

        function Qe(e) {
            if (e > Number.MAX_SAFE_INTEGER || e < Number.MIN_SAFE_INTEGER) throw Error("FODT0002: Number of seconds given to construct DayTimeDuration overflows MAX_SAFE_INTEGER or MIN_SAFE_INTEGER");
            this.ea = e
        }

        function Je(e) {
            var t = Math.abs(e.Za()), n = Math.abs(e.getHours()), r = Math.abs(e.getMinutes());
            return n = (n ? n + "H" : "") + (r ? r + "M" : "") + ((e = Math.abs(e.getSeconds())) ? e + "S" : ""), (t = t ? t + "D" : "") && n ? t + "T" + n : t || (n ? "T" + n : "T0S")
        }

        function Ke(e, t, n, r, a, i) {
            return e = 86400 * e + 3600 * t + 60 * n + r + a, new Qe(i || 0 === e ? e : -e)
        }

        function ze(e) {
            return (e = /^(-)?P(\d+Y)?(\d+M)?(\d+D)?(?:T(\d+H)?(\d+M)?(\d+(\.\d*)?S)?)?$/.exec(e)) ? Ke(e[4] ? parseInt(e[4], 10) : 0, e[5] ? parseInt(e[5], 10) : 0, e[6] ? parseInt(e[6], 10) : 0, e[7] ? parseInt(e[7], 10) : 0, e[8] ? parseFloat(e[8]) : 0, !e[1]) : null
        }

        function Ze(e) {
            return "Z" === (e = /^(Z)|([+-])([01]\d):([0-5]\d)$/.exec(e))[1] ? Ke(0, 0, 0, 0, 0, !0) : Ke(0, e[3] ? parseInt(e[3], 10) : 0, e[4] ? parseInt(e[4], 10) : 0, 0, 0, "+" === e[2])
        }

        function We(e, t) {
            if (isNaN(t)) throw Error("FOCA0005: Cannot multiply xs:dayTimeDuration by NaN");
            if ((e = e.ea * t) > Number.MAX_SAFE_INTEGER || !Number.isFinite(e)) throw Error("FODT0002: Value overflow while multiplying xs:dayTimeDuration");
            return new Qe(e < Number.MIN_SAFE_INTEGER || Object.is(-0, e) ? 0 : e)
        }

        function $e(e) {
            return e ? parseInt(e, 10) : null
        }

        function et(e) {
            var t = (e += "").startsWith("-");
            return t && (e = e.substring(1)), (t ? "-" : "") + e.padStart(4, "0")
        }

        function tt(e) {
            return (e + "").padStart(2, "0")
        }

        function nt(e) {
            return 1 === (e += "").split(".")[0].length && (e = e.padStart(e.length + 1, "0")), e
        }

        function rt(e) {
            return 0 === e.getHours() && 0 === e.getMinutes() ? "Z" : (e.oa() ? "+" : "-") + tt(Math.abs(e.getHours())) + ":" + tt(Math.abs(e.getMinutes()))
        }

        function at(e, t, n, r, a, i, o, s, u) {
            this.B = e, this.h = t, this.o = n + (24 === r ? 1 : 0), this.v = 24 === r ? 0 : r, this.C = a, this.J = i, this.pa = o, this.ba = s, this.type = void 0 === u ? 9 : u
        }

        function it(e, t) {
            switch (t) {
                case 15:
                    return new at(1972, 12, e.o, 0, 0, 0, 0, e.ba, 15);
                case 14:
                    return new at(1972, e.h, 1, 0, 0, 0, 0, e.ba, 14);
                case 12:
                    return new at(e.B, 1, 1, 0, 0, 0, 0, e.ba, 12);
                case 13:
                    return new at(1972, e.h, e.o, 0, 0, 0, 0, e.ba, 13);
                case 11:
                    return new at(e.B, e.h, 1, 0, 0, 0, 0, e.ba, 11);
                case 8:
                    return new at(1972, 12, 31, e.v, e.C, e.J, e.pa, e.ba, 8);
                case 7:
                    return new at(e.B, e.h, e.o, 0, 0, 0, 0, e.ba, 7);
                default:
                    return new at(e.B, e.h, e.o, e.v, e.C, e.J, e.pa, e.ba, 9)
            }
        }

        function ot(e, t) {
            return t = e.ba || t || Ze("Z"), new Date(Date.UTC(e.B, e.h - 1, e.o, e.v - t.getHours(), e.C - t.getMinutes(), e.J + e.pa))
        }

        function st(e) {
            var t = /^(?:(-?\d{4,}))?(?:--?(\d\d))?(?:-{1,3}(\d\d))?(T)?(?:(\d\d):(\d\d):(\d\d))?(\.\d+)?(Z|(?:[+-]\d\d:\d\d))?$/.exec(e);
            e = t[1] ? parseInt(t[1], 10) : null;
            var n = $e(t[2]), r = $e(t[3]), a = t[4], i = $e(t[5]), o = $e(t[6]), s = $e(t[7]),
                u = t[8] ? parseFloat(t[8]) : 0;
            if (t = t[9] ? Ze(t[9]) : null, e && (-271821 > e || 273860 < e)) throw Error("FODT0001: Datetime year is out of bounds");
            return a ? new at(e, n, r, i, o, s, u, t, 9) : null !== i && null !== o && null !== s ? new at(1972, 12, 31, i, o, s, u, t, 8) : null !== e && null !== n && null !== r ? new at(e, n, r, 0, 0, 0, 0, t, 7) : null !== e && null !== n ? new at(e, n, 1, 0, 0, 0, 0, t, 11) : null !== n && null !== r ? new at(1972, n, r, 0, 0, 0, 0, t, 13) : null !== e ? new at(e, 1, 1, 0, 0, 0, 0, t, 12) : null !== n ? new at(1972, n, 1, 0, 0, 0, 0, t, 14) : new at(1972, 12, r, 0, 0, 0, 0, t, 15)
        }

        function ut(e, t, n) {
            var r = ot(e, n).getTime();
            return r === (n = ot(t, n).getTime()) ? e.pa === t.pa ? 0 : e.pa > t.pa ? 1 : -1 : r > n ? 1 : -1
        }

        function lt(e, t, n) {
            return 0 === ut(e, t, n)
        }

        function ct(e, t, n) {
            return new Qe(e = (ot(e, n).getTime() - ot(t, n).getTime()) / 1e3)
        }

        function ht(e) {
            throw Error("Not implemented: adding durations to " + he[e.type])
        }

        function pt(e) {
            throw Error("Not implemented: subtracting durations from " + he[e.type])
        }

        function ft(e, t) {
            if ("number" != typeof e && ("string" != typeof e || !k.get(t)(e))) throw Error("Cannot convert JavaScript value '" + e + "' to the XPath type " + he[t] + " since it is not valid.")
        }

        function dt(e, t, n) {
            if (null === t) return null;
            switch (e) {
                case 0:
                    return t ? V : Q;
                case 1:
                    return q(t + "", 1);
                case 3:
                case 2:
                    return ft(t, 3), q(+t, 3);
                case 4:
                    return ft(t, e), q(+t, 4);
                case 5:
                    return ft(t, e), q(0 | t, 5);
                case 6:
                    return ft(t, e), q(+t, 6);
                case 7:
                case 8:
                case 9:
                case 11:
                case 12:
                case 13:
                case 14:
                case 15:
                    if (!(t instanceof Date)) throw Error("The JavaScript value " + t + " with type " + typeof t + " is not a valid type to be converted to an XPath " + he[e] + ".");
                    return q(it(st(t.toISOString()), e), e);
                case 53:
                case 47:
                case 55:
                case 54:
                case 56:
                case 57:
                case 58:
                    if ("object" != typeof t || !("nodeType" in t)) throw Error("The JavaScript value " + t + " with type " + typeof t + " is not a valid type to be converted to an XPath " + he[e] + ".");
                    return Xe({node: t, G: null});
                case 59:
                    return function e(t, n) {
                        if (null === t) return null;
                        switch (typeof t) {
                            case"boolean":
                                return t ? V : Q;
                            case"number":
                                return q(t, 3);
                            case"string":
                                return q(t, 1);
                            case"object":
                                return "nodeType" in t ? Xe({
                                    node: t,
                                    G: null
                                }) : Array.isArray(t) ? new He(t.map((function (t) {
                                    return void 0 === t ? function () {
                                        return se.empty()
                                    } : ue(t = null === (t = e(t)) ? se.empty() : se.s(t))
                                }))) : new Ye(Object.keys(t).filter((function (e) {
                                    return void 0 !== t[e]
                                })).map((function (n) {
                                    var r = e(t[n]);
                                    return r = null === r ? se.empty() : se.s(r), {key: q(n, 1), value: ue(r)}
                                })))
                        }
                        throw Error("Value " + String(t) + ' of type "' + typeof t + '" is not adaptable to an XPath value.')
                    }(t);
                default:
                    throw Error('Values of the type "' + e + '" can not be adapted to equivalent XPath values.')
            }
        }

        function mt(e, t, n) {
            if (0 === n.g) return null === (t = dt(n.type, t)) ? [] : [t];
            if (2 === n.g || 1 === n.g) {
                if (!Array.isArray(t)) throw Error("The JavaScript value " + t + " should be an array if it is to be converted to " + fe(n) + ".");
                return t.map((function (e) {
                    return dt(n.type, e)
                })).filter((function (e) {
                    return null !== e
                }))
            }
            var r = dt(n.type, t);
            if (null === r) throw Error("The JavaScript value " + t + " should be a single entry if it is to be converted to " + fe(n) + ".");
            return [r]
        }

        function vt(e, t, n) {
            return n = void 0 === n ? {type: 59, g: 0} : n, se.create(mt(0, t, n))
        }

        function gt(e, t) {
            this.h = t = void 0 === t ? {
                xb: null,
                Bb: null,
                qb: !1
            } : t, this.Ga = e.Ga, this.wa = e.wa, this.O = e.O, this.ta = e.ta || Object.create(null)
        }

        function yt(e, t) {
            var n = 0, r = t.value;
            return {
                next: function (a) {
                    return (a = r.next(a)).done ? z : Z(xt(e, n++, a.value, t))
                }
            }
        }

        function wt(e) {
            return e.h.qb || (e.h.qb = !0, e.h.xb = st((new Date).toISOString()), e.h.Bb = ze("PT0S")), e.h.xb
        }

        function At(e) {
            return e.h.qb || (e.h.qb = !0, e.h.xb = st((new Date).toISOString()), e.h.Bb = ze("PT0S")), e.h.Bb
        }

        function xt(e, t, n, r) {
            return new gt({O: n, Ga: t, wa: r || e.wa, ta: e.ta}, e.h)
        }

        function bt(e, t) {
            return new gt({O: e.O, Ga: e.Ga, wa: e.wa, ta: Object.assign(Object.create(null), e.ta, t)}, e.h)
        }

        function Et(e, t, n, r, a, i) {
            var o = new Map;
            this.debug = e, this.h = t, this.o = n, this.B = r, this.J = a, this.C = o, this.v = i, this.Ta = !0
        }

        function Bt(e) {
            var t = 0, n = null, r = !0;
            return se.create({
                next: function (a) {
                    for (; t < e.length;) {
                        n || (n = e[t].value, r = !0);
                        var i = n.next(r ? 0 : a);
                        if (r = !1, !i.done) return i;
                        t++, n = null
                    }
                    return z
                }
            })
        }

        function Nt(e, t, n) {
            return Error("FORG0001: Cannot cast " + e + " to " + he[t] + (n ? ", " + n : ""))
        }

        function Ct(e) {
            return Error("XPTY0004: " + e)
        }

        function Tt(e) {
            return Error("FOTY0013: Atomization is not supported for " + he[e] + ".")
        }

        function It(e) {
            return Error("XPST0081: The prefix " + e + " could not be resolved.")
        }

        function Ot(e, t) {
            if (W(e.type, 46) || W(e.type, 19) || W(e.type, 0) || W(e.type, 4) || W(e.type, 3) || W(e.type, 6) || W(e.type, 5) || W(e.type, 2) || W(e.type, 23) || W(e.type, 1)) return se.create(e);
            var n = t.h;
            if (W(e.type, 53)) {
                var r = e.value;
                if (2 === r.node.nodeType || 3 === r.node.nodeType) return se.create(q(Re(n, r), 19));
                if (8 === r.node.nodeType || 7 === r.node.nodeType) return se.create(q(Re(n, r), 1));
                var a = [];
                return function e(t) {
                    if (8 !== r.node.nodeType && 7 !== r.node.nodeType) {
                        var i = t.nodeType;
                        3 === i || 4 === i ? a.push(n.getData(t)) : 1 !== i && 9 !== i || n.getChildNodes(t).forEach((function (t) {
                            e(t)
                        }))
                    }
                }(r.node), se.create(q(a.join(""), 19))
            }
            if (W(e.type, 60) && !W(e.type, 62)) throw Tt(e.type);
            if (W(e.type, 62)) return Bt(e.R.map((function (e) {
                return St(e(), t)
            })));
            throw Error("Atomizing " + e.type + " is not implemented.")
        }

        function St(e, t) {
            var n = !1, r = e.value, a = null;
            return se.create({
                next: function () {
                    for (; !n;) {
                        if (!a) {
                            var e = r.next(0);
                            if (e.done) {
                                n = !0;
                                break
                            }
                            a = Ot(e.value, t).value
                        }
                        if (!(e = a.next(0)).done) return e;
                        a = null
                    }
                    return z
                }
            })
        }

        function Rt(e) {
            for (e = Y[e]; e && 0 !== e.D;) e = e.parent;
            return e ? e.type : null
        }

        function Dt(e, t) {
            var n = (t = Y[t]).Ia;
            if (!n || !n.whiteSpace) return t.parent ? Dt(e, t.parent.type) : e;
            switch (t.Ia.whiteSpace) {
                case"replace":
                    return e.replace(/[\u0009\u000A\u000D]/g, " ");
                case"collapse":
                    return e.replace(/[\u0009\u000A\u000D]/g, " ").replace(/ {2,}/g, " ").replace(/^ | $/g, "")
            }
            return e
        }

        function Gt(e, t) {
            for (t = Y[t]; t && null === t.fb;) {
                if (2 === t.D || 3 === t.D) return !0;
                t = t.parent
            }
            return !t || t.fb(e)
        }

        function Mt(e, t) {
            for (; e;) {
                if (e.Ka && e.Ka[t]) return e.Ka[t];
                e = e.parent
            }
            return function () {
                return !0
            }
        }

        function Ut(e, t) {
            return e(2) ? function (e) {
                return {u: !0, value: e}
            } : e(0) ? function (e) {
                return {u: !0, value: e ? 1 : 0}
            } : e(1) || e(19) ? function (e) {
                switch (e) {
                    case"NaN":
                        return {u: !0, value: NaN};
                    case"INF":
                    case"+INF":
                        return {u: !0, value: 1 / 0};
                    case"-INF":
                        return {u: !0, value: -1 / 0};
                    case"0":
                    case"+0":
                        return {u: !0, value: 0};
                    case"-0":
                        return {u: !0, value: -0}
                }
                var n = parseFloat(e);
                return isNaN(n) ? {u: !1, error: Nt(e, t)} : {u: !0, value: n}
            } : function () {
                return {
                    u: !1,
                    error: Error("XPTY0004: Casting not supported from given type to " + t + " or any of its derived types.")
                }
            }
        }

        function Ft(e) {
            if (e > Number.MAX_SAFE_INTEGER || e < Number.MIN_SAFE_INTEGER) throw Error("FODT0002: Number of months given to construct YearMonthDuration overflows MAX_SAFE_INTEGER or MIN_SAFE_INTEGER");
            this.ha = e
        }

        function Pt(e) {
            var t = Math.abs(e.cb());
            return (t ? t + "Y" : "") + ((e = Math.abs(e.$a())) ? e + "M" : "") || "0M"
        }

        function Ht(e) {
            var t = /^(-)?P(\d+Y)?(\d+M)?(\d+D)?(?:T(\d+H)?(\d+M)?(\d+(\.\d*)?S)?)?$/.exec(e);
            if (t) {
                if (e = !t[1], (t = 12 * (t[2] ? parseInt(t[2], 10) : 0) + (t[3] ? parseInt(t[3], 10) : 0)) > Number.MAX_SAFE_INTEGER || !Number.isFinite(t)) throw Error("FODT0002: Value overflow while constructing xs:yearMonthDuration");
                e = new Ft(e || 0 === t ? t : -t)
            } else e = null;
            return e
        }

        function jt(e, t) {
            if (isNaN(t)) throw Error("FOCA0005: Cannot multiply xs:yearMonthDuration by NaN");
            if ((e = Math.round(e.ha * t)) > Number.MAX_SAFE_INTEGER || !Number.isFinite(e)) throw Error("FODT0002: Value overflow while constructing xs:yearMonthDuration");
            return new Ft(e < Number.MIN_SAFE_INTEGER || 0 === e ? 0 : e)
        }

        function Xt(e, t) {
            this.Sa = e, this.Fa = t
        }

        (n = Be.prototype).insertBefore = function (e, t, n) {
            return this.h.insertBefore(e, t, n)
        }, n.removeAttributeNS = function (e, t, n) {
            return this.h.removeAttributeNS(e, t, n)
        }, n.removeChild = function (e, t) {
            return this.h.removeChild(e, t)
        }, n.setAttributeNS = function (e, t, n, r) {
            this.h.setAttributeNS(e, t, n, r)
        }, n.setData = function (e, t) {
            this.h.setData(e, t)
        }, Te.prototype.getAllAttributes = function (e, t) {
            return Ne(e) ? e.attributes : this.h.getAllAttributes(e, void 0 === t ? null : t)
        }, Te.prototype.getChildNodes = function (e, t) {
            return t = Ne(e) ? e.childNodes : this.h.getChildNodes(e, void 0 === t ? null : t), 9 === e.nodeType ? t.filter((function (e) {
                return 10 !== e.nodeType
            })) : t
        }, Te.prototype.getData = function (e) {
            return Ne(e) ? 2 === e.nodeType ? e.value : e.data : this.h.getData(e) || ""
        }, Te.prototype.getParentNode = function (e, t) {
            return this.h.getParentNode(e, void 0 === t ? null : t)
        }, v(He, ge), v(Ye, ge), (n = qe.prototype).Za = function () {
            return 0
        }, n.getHours = function () {
            return 0
        }, n.getMinutes = function () {
            return 0
        }, n.$a = function () {
            return 0
        }, n.ab = function () {
            return 0
        }, n.bb = function () {
            return 0
        }, n.getSeconds = function () {
            return 0
        }, n.cb = function () {
            return 0
        }, n.oa = function () {
            return !0
        }, v(Qe, qe), (n = Qe.prototype).Za = function () {
            return Math.trunc(this.ea / 86400)
        }, n.getHours = function () {
            return Math.trunc(this.ea % 86400 / 3600)
        }, n.getMinutes = function () {
            return Math.trunc(this.ea % 3600 / 60)
        }, n.bb = function () {
            return this.ea
        }, n.getSeconds = function () {
            var e = this.ea % 60;
            return Object.is(-0, e) ? 0 : e
        }, n.oa = function () {
            return !Object.is(-0, this.ea) && 0 <= this.ea
        }, n.toString = function () {
            return (this.oa() ? "P" : "-P") + Je(this)
        }, (n = at.prototype).getDay = function () {
            return this.o
        }, n.getHours = function () {
            return this.v
        }, n.getMinutes = function () {
            return this.C
        }, n.getMonth = function () {
            return this.h
        }, n.getSeconds = function () {
            return this.J
        }, n.getYear = function () {
            return this.B
        }, n.toString = function () {
            switch (this.type) {
                case 9:
                    return et(this.B) + "-" + tt(this.h) + "-" + tt(this.o) + "T" + tt(this.v) + ":" + tt(this.C) + ":" + nt(this.J + this.pa) + (this.ba ? rt(this.ba) : "");
                case 7:
                    return et(this.B) + "-" + tt(this.h) + "-" + tt(this.o) + (this.ba ? rt(this.ba) : "");
                case 8:
                    return tt(this.v) + ":" + tt(this.C) + ":" + nt(this.J + this.pa) + (this.ba ? rt(this.ba) : "");
                case 15:
                    return "---" + tt(this.o) + (this.ba ? rt(this.ba) : "");
                case 14:
                    return "--" + tt(this.h) + (this.ba ? rt(this.ba) : "");
                case 13:
                    return "--" + tt(this.h) + "-" + tt(this.o) + (this.ba ? rt(this.ba) : "");
                case 12:
                    return et(this.B) + (this.ba ? rt(this.ba) : "");
                case 11:
                    return et(this.B) + "-" + tt(this.h) + (this.ba ? rt(this.ba) : "")
            }
            throw Error("Unexpected subType")
        }, v(Ft, qe), (n = Ft.prototype).$a = function () {
            var e = this.ha % 12;
            return 0 === e ? 0 : e
        }, n.ab = function () {
            return this.ha
        }, n.cb = function () {
            return Math.trunc(this.ha / 12)
        }, n.oa = function () {
            return !Object.is(-0, this.ha) && 0 <= this.ha
        }, n.toString = function () {
            return (this.oa() ? "P" : "-P") + Pt(this)
        }, v(Xt, qe), (n = Xt.prototype).Za = function () {
            return this.Fa.Za()
        }, n.getHours = function () {
            return this.Fa.getHours()
        }, n.getMinutes = function () {
            return this.Fa.getMinutes()
        }, n.$a = function () {
            return this.Sa.$a()
        }, n.ab = function () {
            return this.Sa.ab()
        }, n.bb = function () {
            return this.Fa.bb()
        }, n.getSeconds = function () {
            return this.Fa.getSeconds()
        }, n.cb = function () {
            return this.Sa.cb()
        }, n.oa = function () {
            return this.Sa.oa() && this.Fa.oa()
        }, n.toString = function () {
            var e = this.oa() ? "P" : "-P", t = Pt(this.Sa), n = Je(this.Fa);
            return "0M" === t ? e + n : "T0S" === n ? e + t : e + t + n
        };
        var _t = [3, 6, 4, 5];

        function Lt(e) {
            if (e(1) || e(19)) return function (e) {
                return {u: !0, value: e + ""}
            };
            if (e(20)) return function (e) {
                return {u: !0, value: e}
            };
            if (e(23)) return function (e) {
                return {u: !0, value: e.prefix ? e.prefix + ":" + e.localName : e.localName}
            };
            if (e(44)) return function (e) {
                return {u: !0, value: e.toString()}
            };
            if (e(2)) {
                if (e(5) || e(4)) return function (e) {
                    return {u: !0, value: (e + "").replace("e", "E")}
                };
                if (e(6) || e(3)) return function (e) {
                    return isNaN(e) ? {u: !0, value: "NaN"} : isFinite(e) ? Object.is(e, -0) ? {
                        u: !0,
                        value: "-0"
                    } : {u: !0, value: (e + "").replace("e", "E").replace("E+", "E")} : {
                        u: !0,
                        value: (0 > e ? "-" : "") + "INF"
                    }
                }
            }
            return e(9) || e(7) || e(8) || e(15) || e(14) || e(13) || e(12) || e(11) || e(16) || e(17) || e(18) ? function (e) {
                return {u: !0, value: e.toString()}
            } : e(22) ? function (e) {
                return {u: !0, value: e.toUpperCase()}
            } : function (e) {
                return {u: !0, value: e + ""}
            }
        }

        var kt = [2, 5, 17, 16];

        function Yt(e, t) {
            function n(t) {
                return W(e, t)
            }

            if (39 === t) return function () {
                return {u: !1, error: Error("FORG0001: Casting to xs:error is always invalid.")}
            };
            switch (t) {
                case 19:
                    return function (e) {
                        var t = Lt(e);
                        return function (e) {
                            return (e = t(e)).u ? {u: !0, value: q(e.value, 19)} : e
                        }
                    }(n);
                case 1:
                    return function (e) {
                        var t = Lt(e);
                        return function (e) {
                            return (e = t(e)).u ? {u: !0, value: q(e.value, 1)} : e
                        }
                    }(n);
                case 6:
                    return function (e) {
                        var t = Ut(e, 6);
                        return function (e) {
                            return (e = t(e)).u ? {u: !0, value: q(e.value, 6)} : e
                        }
                    }(n);
                case 3:
                    return function (e) {
                        var t = Ut(e, 3);
                        return function (e) {
                            return (e = t(e)).u ? {u: !0, value: q(e.value, 3)} : e
                        }
                    }(n);
                case 4:
                    return function (e) {
                        return e(5) ? function (e) {
                            return {u: !0, value: q(e, 4)}
                        } : e(6) || e(3) ? function (e) {
                            return isNaN(e) || !isFinite(e) ? {
                                u: !1,
                                error: Error("FOCA0002: Can not cast " + e + " to xs:decimal")
                            } : Math.abs(e) > Number.MAX_VALUE ? {
                                u: !1,
                                error: Error("FOAR0002: Can not cast " + e + " to xs:decimal, it is out of bounds for JavaScript numbers")
                            } : {u: !0, value: q(e, 4)}
                        } : e(0) ? function (e) {
                            return {u: !0, value: q(e ? 1 : 0, 4)}
                        } : e(1) || e(19) ? function (e) {
                            var t = parseFloat(e);
                            return !isNaN(t) || isFinite(t) ? {u: !0, value: q(t, 4)} : {
                                u: !1,
                                error: Error("FORG0001: Can not cast " + e + " to xs:decimal")
                            }
                        } : function () {
                            return {
                                u: !1,
                                error: Error("XPTY0004: Casting not supported from given type to xs:decimal or any of its derived types.")
                            }
                        }
                    }(n);
                case 5:
                    return function (e) {
                        return e(0) ? function (e) {
                            return {u: !0, value: q(e ? 1 : 0, 5)}
                        } : e(2) ? function (e) {
                            var t = Math.trunc(e);
                            return !isFinite(t) || isNaN(t) ? {
                                u: !1,
                                error: Error("FOCA0002: can not cast " + e + " to xs:integer")
                            } : Number.isSafeInteger(t) ? {u: !0, value: q(t, 5)} : {
                                u: !1,
                                error: Error("FOAR0002: can not cast " + e + " to xs:integer, it is out of bounds for JavaScript numbers.")
                            }
                        } : e(1) || e(19) ? function (e) {
                            var t = parseInt(e, 10);
                            return isNaN(t) ? {u: !1, error: Nt(e, 5)} : Number.isSafeInteger(t) ? {
                                u: !0,
                                value: q(t, 5)
                            } : {
                                u: !1,
                                error: Error("FOCA0003: can not cast " + e + " to xs:integer, it is out of bounds for JavaScript numbers.")
                            }
                        } : function () {
                            return {
                                u: !1,
                                error: Error("XPTY0004: Casting not supported from given type to xs:integer or any of its derived types.")
                            }
                        }
                    }(n);
                case 2:
                    return function (e) {
                        var t = Yt;
                        return function (n) {
                            for (var r = u(_t), a = r.next(); !a.done; a = r.next()) if ((a = t(e, a.value)(n)).u) return a;
                            return {
                                u: !1,
                                error: Error('XPTY0004: Casting not supported from "' + n + '" given type to xs:numeric or any of its derived types.')
                            }
                        }
                    }(e);
                case 18:
                    return function (e) {
                        return e(16) ? function (e) {
                            return {u: !0, value: q(new Xt(e, new Qe(e.oa() ? 0 : -0)), 18)}
                        } : e(17) ? function (e) {
                            return {u: !0, value: q(e = new Xt(new Ft(e.oa() ? 0 : -0), e), 18)}
                        } : e(18) ? function (e) {
                            return {u: !0, value: q(e, 18)}
                        } : e(19) || e(1) ? function (e) {
                            return {u: !0, value: q(new Xt(Ht(e), ze(e)), 18)}
                        } : function () {
                            return {
                                u: !1,
                                error: Error("XPTY0004: Casting not supported from given type to xs:duration or any of its derived types.")
                            }
                        }
                    }(n);
                case 16:
                    return function (e) {
                        return e(18) && !e(17) ? function (e) {
                            return {u: !0, value: q(e.Sa, 16)}
                        } : e(17) ? function () {
                            return {u: !0, value: q(Ht("P0M"), 16)}
                        } : e(19) || e(1) ? function (e) {
                            var t = Ht(e);
                            return t ? {u: !0, value: q(t, 16)} : {u: !1, error: Nt(e, 16)}
                        } : function () {
                            return {
                                u: !1,
                                error: Error("XPTY0004: Casting not supported from given type to xs:yearMonthDuration or any of its derived types.")
                            }
                        }
                    }(n);
                case 17:
                    return function (e) {
                        return e(18) && !e(16) ? function (e) {
                            return {u: !0, value: q(e.Fa, 17)}
                        } : e(16) ? function () {
                            return {u: !0, value: q(ze("PT0.0S"), 17)}
                        } : e(19) || e(1) ? function (e) {
                            var t = ze(e);
                            return t ? {u: !0, value: q(t, 17)} : {
                                u: !1,
                                error: Error("FORG0001: Can not cast " + e + " to xs:dayTimeDuration")
                            }
                        } : function () {
                            return {
                                u: !1,
                                error: Error("XPTY0004: Casting not supported from given type to xs:dayTimeDuration or any of its derived types.")
                            }
                        }
                    }(n);
                case 9:
                    return function (e) {
                        return e(7) ? function (e) {
                            return {u: !0, value: q(it(e, 9), 9)}
                        } : e(19) || e(1) ? function (e) {
                            return {u: !0, value: q(st(e), 9)}
                        } : function () {
                            return {
                                u: !1,
                                error: Error("XPTY0004: Casting not supported from given type to xs:dateTime or any of its derived types.")
                            }
                        }
                    }(n);
                case 8:
                    return function (e) {
                        return e(9) ? function (e) {
                            return {u: !0, value: q(it(e, 8), 8)}
                        } : e(19) || e(1) ? function (e) {
                            return {u: !0, value: q(st(e), 8)}
                        } : function () {
                            return {
                                u: !1,
                                error: Error("XPTY0004: Casting not supported from given type to xs:time or any of its derived types.")
                            }
                        }
                    }(n);
                case 7:
                    return function (e) {
                        return e(9) ? function (e) {
                            return {u: !0, value: q(it(e, 7), 7)}
                        } : e(19) || e(1) ? function (e) {
                            return {u: !0, value: q(st(e), 7)}
                        } : function () {
                            return {
                                u: !1,
                                error: Error("XPTY0004: Casting not supported from given type to xs:date or any of its derived types.")
                            }
                        }
                    }(n);
                case 11:
                    return function (e) {
                        return e(7) || e(9) ? function (e) {
                            return {u: !0, value: q(it(e, 11), 11)}
                        } : e(19) || e(1) ? function (e) {
                            return {u: !0, value: q(st(e), 11)}
                        } : function () {
                            return {
                                u: !1,
                                error: Error("XPTY0004: Casting not supported from given type to xs:gYearMonth or any of its derived types.")
                            }
                        }
                    }(n);
                case 12:
                    return function (e) {
                        return e(7) || e(9) ? function (e) {
                            return {u: !0, value: q(it(e, 12), 12)}
                        } : e(19) || e(1) ? function (e) {
                            return {u: !0, value: q(st(e), 12)}
                        } : function () {
                            return {
                                u: !1,
                                error: Error("XPTY0004: Casting not supported from given type to xs:gYear or any of its derived types.")
                            }
                        }
                    }(n);
                case 13:
                    return function (e) {
                        return e(7) || e(9) ? function (e) {
                            return {u: !0, value: q(it(e, 13), 13)}
                        } : e(19) || e(1) ? function (e) {
                            return {u: !0, value: q(st(e), 13)}
                        } : function () {
                            return {
                                u: !1,
                                error: Error("XPTY0004: Casting not supported from given type to xs:gMonthDay or any of its derived types.")
                            }
                        }
                    }(n);
                case 15:
                    return function (e) {
                        return e(7) || e(9) ? function (e) {
                            return {u: !0, value: q(it(e, 15), 15)}
                        } : e(19) || e(1) ? function (e) {
                            return {u: !0, value: q(st(e), 15)}
                        } : function () {
                            return {
                                u: !1,
                                error: Error("XPTY0004: Casting not supported from given type to xs:gDay or any of its derived types.")
                            }
                        }
                    }(n);
                case 14:
                    return function (e) {
                        return e(7) || e(9) ? function (e) {
                            return {u: !0, value: q(it(e, 14), 14)}
                        } : e(19) || e(1) ? function (e) {
                            return {u: !0, value: q(st(e), 14)}
                        } : function () {
                            return {
                                u: !1,
                                error: Error("XPTY0004: Casting not supported from given type to xs:gMonth or any of its derived types.")
                            }
                        }
                    }(n);
                case 0:
                    return function (e) {
                        return e(2) ? function (e) {
                            return {u: !0, value: 0 === e || isNaN(e) ? Q : V}
                        } : e(1) || e(19) ? function (e) {
                            switch (e) {
                                case"true":
                                case"1":
                                    return {u: !0, value: V};
                                case"false":
                                case"0":
                                    return {u: !0, value: Q};
                                default:
                                    return {
                                        u: !1,
                                        error: Error("XPTY0004: Casting not supported from given type to xs:boolean or any of its derived types.")
                                    }
                            }
                        } : function () {
                            return {
                                u: !1,
                                error: Error("XPTY0004: Casting not supported from given type to xs:boolean or any of its derived types.")
                            }
                        }
                    }(n);
                case 21:
                    return function (e) {
                        return e(22) ? function (e) {
                            for (var t = "", n = 0; n < e.length; n += 2) t += String.fromCharCode(parseInt(e.substr(n, 2), 16));
                            return {u: !0, value: q(btoa(t), 21)}
                        } : e(1) || e(19) ? function (e) {
                            return {u: !0, value: q(e, 21)}
                        } : function () {
                            return {
                                error: Error("XPTY0004: Casting not supported from given type to xs:base64Binary or any of its derived types."),
                                u: !1
                            }
                        }
                    }(n);
                case 22:
                    return function (e) {
                        return e(21) ? function (e) {
                            for (var t = "", n = 0, r = (e = atob(e)).length; n < r; n++) t += Number(e.charCodeAt(n)).toString(16);
                            return {u: !0, value: q(t.toUpperCase(), 22)}
                        } : e(1) || e(19) ? function (e) {
                            return {u: !0, value: q(e, 22)}
                        } : function () {
                            return {
                                u: !1,
                                error: Error("XPTY0004: Casting not supported from given type to xs:hexBinary or any of its derived types.")
                            }
                        }
                    }(n);
                case 20:
                    return function (e) {
                        return e(1) || e(19) ? function (e) {
                            return {u: !0, value: q(e, 20)}
                        } : function () {
                            return {
                                u: !1,
                                error: Error("XPTY0004: Casting not supported from given type to xs:anyURI or any of its derived types.")
                            }
                        }
                    }(n);
                case 23:
                    throw Error("Casting to xs:QName is not implemented.")
            }
            return function () {
                return {u: !1, error: Error("XPTY0004: Casting not supported from " + e + " to " + t + ".")}
            }
        }

        var qt = Object.create(null);

        function Vt(e, t) {
            if (19 === e && 1 === t) return function (e) {
                return {u: !0, value: q(e, 1)}
            };
            if (44 === t) return function () {
                return {u: !1, error: Error("XPST0080: Casting to xs:NOTATION is not permitted.")}
            };
            if (39 === t) return function () {
                return {u: !1, error: Error("FORG0001: Casting to xs:error is not permitted.")}
            };
            if (45 === e || 45 === t) return function () {
                return {u: !1, error: Error("XPST0080: Casting from or to xs:anySimpleType is not permitted.")}
            };
            if (46 === e || 46 === t) return function () {
                return {u: !1, error: Error("XPST0080: Casting from or to xs:anyAtomicType is not permitted.")}
            };
            if (W(e, 60) && 1 === t) return function () {
                return {u: !1, error: Error("FOTY0014: Casting from function item to xs:string is not permitted.")}
            };
            if (e === t) return function (e) {
                return {u: !0, value: {type: t, value: e}}
            };
            var n = kt.includes(e) ? e : Rt(e), r = kt.includes(t) ? t : Rt(t);
            if (null === r || null === n) return function () {
                return {u: !1, error: Error("XPST0081: Can not cast: type " + (r ? he[e] : he[t]) + " is unknown.")}
            };
            var a = [];
            return 1 !== n && 19 !== n || a.push((function (e) {
                var n = Dt(e, t);
                return Gt(n, t) ? {u: !0, value: n} : {u: !1, error: Nt(e, t, "pattern validation failed.")}
            })), n !== r && (a.push(Yt(n, r)), a.push((function (e) {
                return {u: !0, value: e.value}
            }))), 19 !== r && 1 !== r || a.push((function (e) {
                return Gt(e, t) ? {u: !0, value: e} : {u: !1, error: Nt(e, t, "pattern validation failed.")}
            })), a.push((function (e) {
                return function (e, t) {
                    for (var n = Y[t]; n;) {
                        if (n.Ia && !Object.keys(n.Ia).every((function (t) {
                            if ("whiteSpace" === t) return !0;
                            var r = Mt(n, t);
                            return !r || r(e, n.Ia[t])
                        }))) return !1;
                        n = n.parent
                    }
                    return !0
                }(e, t) ? {u: !0, value: e} : {u: !1, error: Nt(e, t, "pattern validation failed.")}
            })), a.push((function (e) {
                return {u: !0, value: {type: t, value: e}}
            })), function (e) {
                e = {u: !0, value: e};
                for (var t = 0, n = a.length; t < n && !1 !== (e = a[t](e.value)).u; ++t) ;
                return e
            }
        }

        function Qt(e, t) {
            var n = e.type + 1e4 * t, r = qt[n];
            return r || (r = qt[n] = Vt(e.type, t)), r.call(void 0, e.value, t)
        }

        function Jt(e, t) {
            if (!0 === (e = Qt(e, t)).u) return e.value;
            throw e.error
        }

        function Kt(e) {
            var t = !1;
            return {
                next: function () {
                    return t ? z : (t = !0, Z(e))
                }
            }
        }

        function zt(e, t) {
            return !!(e === t || e.node === t.node && function e(t, n) {
                return t === n || !(!t || !n || t.offset !== n.offset || t.parent !== n.parent) && e(t.G, n.G)
            }(e.G, t.G))
        }

        function Zt(e, t) {
            for (var n = []; t; t = Ue(e, t, null)) n.unshift(t);
            return n
        }

        function Wt(e, t) {
            for (var n = []; t; t = e.getParentNode(t, null)) n.unshift(t);
            return n
        }

        function $t(e, t, n, r) {
            if (n.G || r.G || Ne(n.node) || Ne(r.node)) {
                if (zt(n, r)) return 0;
                n = Zt(t, n), r = Zt(t, r);
                var a = n[0], i = r[0];
                if (!zt(a, i)) return t = e.findIndex((function (e) {
                    return zt(e, a)
                })), n = e.findIndex((function (e) {
                    return zt(e, i)
                })), -1 === t && (t = e.push(a)), -1 === n && (n = e.push(i)), t - n;
                e = 1;
                for (var o = Math.min(n.length, r.length); e < o && zt(n[e], r[e]); ++e) ;
                return n[e] ? r[e] ? function (e, t, n) {
                    var r = Ue(e, t, null);
                    e = Se(e, r, null), r = 0;
                    for (var a = e.length; r < a; ++r) {
                        var i = e[r];
                        if (zt(i, t)) return -1;
                        if (zt(i, n)) return 1
                    }
                }(t, n[e], r[e]) : 1 : -1
            }
            if ((n = n.node) === (r = r.node)) return 0;
            if (n = Wt(t, n), r = Wt(t, r), n[0] !== r[0]) {
                var s = {node: n[0], G: null}, u = {node: r[0], G: null};
                return t = e.findIndex((function (e) {
                    return zt(e, s)
                })), n = e.findIndex((function (e) {
                    return zt(e, u)
                })), -1 === t && (t = e.push(s)), -1 === n && (n = e.push(u)), t - n
            }
            for (o = 1, e = Math.min(n.length, r.length); o < e && n[o] === r[o]; ++o) ;
            if (e = n[o], n = r[o], !e) return -1;
            if (!n) return 1;
            for (t = t.getChildNodes(r[o - 1], null), r = 0, o = t.length; r < o; ++r) {
                var l = t[r];
                if (l === e) return -1;
                if (l === n) return 1
            }
        }

        function en(e, t, n, r) {
            var a = W(n.type, 47), i = W(r.type, 47);
            if (a && !i) {
                if (zt(n = Ue(t, n.value), r = r.value)) return 1
            } else if (i && !a) {
                if (zt(n = n.value, r = Ue(t, r.value))) return -1
            } else if (a && i) {
                if (zt(Ue(t, r.value), Ue(t, n.value))) return n.value.node.localName > r.value.node.localName ? 1 : -1;
                n = Ue(t, n.value), r = Ue(t, r.value)
            } else n = n.value, r = r.value;
            return $t(e, t, n, r)
        }

        function tn(e, t, n) {
            return en(e.o, e, t, n)
        }

        function nn(e, t) {
            return function e(t, n) {
                if (n = void 0 === n ? rn : n, 1 >= t.length) return t;
                var r = Math.floor(t.length / 2), a = e(t.slice(0, r), n);
                for (t = e(t.slice(r), n), r = []; a.length && t.length;) 0 > n(a[0], t[0]) ? r.push(a.shift()) : r.push(t.shift());
                return r.concat(a.concat(t))
            }(t, (function (t, n) {
                return en(e.o, e, t, n)
            })).filter((function (e, t, n) {
                return 0 === t || !zt(e.value, n[t - 1].value)
            }))
        }

        function rn(e, t) {
            return e < t ? -1 : 0
        }

        var an = e;

        function on(e, t, n, r, a) {
            if (W(e.type, t.type)) return e;
            if (W(t.type, 46) && W(e.type, 53) && (e = Ot(e, n).first()), W(e.type, t.type) || 46 === t.type) return e;
            if (W(e.type, 19)) {
                if (!(n = Jt(e, t.type))) throw Error("XPTY0004 Unable to convert " + (a ? "return" : "argument") + " of type " + he[e.type] + " to type " + fe(t) + " while calling " + r);
                return n
            }
            if (!(n = function (e, t) {
                if (W(e.type, 2)) {
                    if (W(e.type, 6)) return 3 === t ? q(e.value, 3) : null;
                    if (W(e.type, 4)) {
                        if (6 === t) return q(e.value, 6);
                        if (3 === t) return q(e.value, 3)
                    }
                    return null
                }
                return W(e.type, 20) && 1 === t ? q(e.value, 1) : null
            }(e, t.type))) throw Error("XPTY0004 Unable to cast " + (a ? "return" : "argument") + " of type " + he[e.type] + " to type " + fe(t) + " while calling " + r);
            return n
        }

        function sn(e, t, n, r, a) {
            return 0 === e.g ? t.aa({
                default: function () {
                    return t.map((function (t) {
                        return on(t, e, n, r, a)
                    }))
                }, multiple: function () {
                    throw Error("XPTY0004: Multiplicity of " + (a ? "function return value" : "function argument") + " of type " + he[e.type] + (e.type || "") + " for " + r + ' is incorrect. Expected "?", but got "+".')
                }
            }) : 1 === e.g ? t.aa({
                empty: function () {
                    throw Error("XPTY0004: Multiplicity of " + (a ? "function return value" : "function argument") + " of type " + he[e.type] + (e.type || "") + " for " + r + ' is incorrect. Expected "+", but got "empty-sequence()"')
                }, default: function () {
                    return t.map((function (t) {
                        return on(t, e, n, r, a)
                    }))
                }
            }) : 2 === e.g ? t.map((function (t) {
                return on(t, e, n, r, a)
            })) : t.aa({
                s: function () {
                    return t.map((function (t) {
                        return on(t, e, n, r, a)
                    }))
                }, default: function () {
                    throw Error("XPTY0004: Multiplicity of " + (a ? "function return value" : "function argument") + " of type " + he[e.type] + (e.type || "") + " for " + r + " is incorrect. Expected exactly one")
                }
            })
        }

        function un(e, t) {
            return W(e, 5) ? q(t, 5) : W(e, 6) ? q(t, 6) : W(e, 3) ? q(t, 3) : q(t, 4)
        }

        function ln(e, t, n, r, a, i) {
            var o = !1;
            return se.create({
                next: function () {
                    if (o) return z;
                    var t, n = a.first();
                    if (!n) return o = !0, z;
                    if ((W(n.type, 6) || W(n.type, 3)) && (0 === n.value || isNaN(n.value) || 1 / 0 === n.value || -1 / 0 === n.value)) return o = !0, Z(n);
                    if (t = i ? i.first().value : 0, o = !0, function (e) {
                        if (Math.floor(e) === e || isNaN(e)) return 0;
                        var t = (e = /\d+(?:\.(\d*))?(?:[Ee](-)?(\d+))*/.exec(e + ""))[1] ? e[1].length : 0;
                        return e[3] ? e[2] ? t + parseInt(e[3], 10) : 0 > (e = t - parseInt(e[3], 10)) ? 0 : e : t
                    }(n.value) < t) return Z(n);
                    var r = [5, 4, 3, 6].find((function (e) {
                        return W(n.type, e)
                    }));
                    switch (t = function (e, t, n) {
                        return t && 0 == e * n % 1 % .5 ? 0 == Math.floor(e * n) % 2 ? Math.floor(e * n) / n : Math.ceil(e * n) / n : Math.round(e * n) / n
                    }(Jt(n, 4).value, e, Math.pow(10, t)), r) {
                        case 4:
                            return Z(q(t, 4));
                        case 3:
                            return Z(q(t, 3));
                        case 6:
                            return Z(q(t, 6));
                        case 5:
                            return Z(q(t, 5))
                    }
                }
            })
        }

        function cn(e, t, n, r) {
            return St(r, t).aa({
                empty: function () {
                    return se.s(q(NaN, 3))
                }, s: function () {
                    var e = Qt(r.first(), 3);
                    return e.u ? se.s(e.value) : se.s(q(NaN, 3))
                }, multiple: function () {
                    throw Error("fn:number may only be called with zero or one values")
                }
            })
        }

        function hn(e, t, n, r) {
            return r.F() ? r : (e = r.S(), se.s(e[Math.floor(Math.random() * e.length)]))
        }

        var pn = [{
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "abs",
            l: [{type: 2, g: 0}],
            j: {type: 2, g: 0},
            m: function (e, t, n, r) {
                return r.map((function (e) {
                    return un(e.type, Math.abs(e.value))
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "ceiling",
            l: [{type: 2, g: 0}],
            j: {type: 2, g: 0},
            m: function (e, t, n, r) {
                return r.map((function (e) {
                    return un(e.type, Math.ceil(e.value))
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "floor",
            l: [{type: 2, g: 0}],
            j: {type: 2, g: 0},
            m: function (e, t, n, r) {
                return r.map((function (e) {
                    return un(e.type, Math.floor(e.value))
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "round",
            l: [{type: 2, g: 0}],
            j: {type: 2, g: 0},
            m: ln.bind(null, !1)
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "round",
            l: [{type: 2, g: 0}, {type: 5, g: 3}],
            j: {type: 2, g: 0},
            m: ln.bind(null, !1)
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "round-half-to-even",
            l: [{type: 2, g: 0}],
            j: {type: 2, g: 0},
            m: ln.bind(null, !0)
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "round-half-to-even",
            l: [{type: 2, g: 0}, {type: 5, g: 3}],
            j: {type: 2, g: 0},
            m: ln.bind(null, !0)
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "number",
            l: [{type: 46, g: 0}],
            j: {type: 3, g: 3},
            m: cn
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "number",
            l: [],
            j: {type: 3, g: 3},
            m: function (e, t, n) {
                var r = e.O && sn({type: 46, g: 0}, se.s(e.O), t, "fn:number", !1);
                if (!r) throw Error("XPDY0002: fn:number needs an atomizable context item.");
                return cn(0, t, 0, r)
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "random-number-generator",
            l: [],
            j: {type: 61, g: 3},
            m: function e() {
                return se.s(new Ye([{
                    key: q("number", 1), value: function () {
                        return se.s(q(Math.random(), 3))
                    }
                }, {
                    key: q("next", 1), value: function () {
                        return se.s(new ge({
                            value: e,
                            Oa: !0,
                            localName: "",
                            namespaceURI: "",
                            l: [],
                            arity: 0,
                            j: {type: 61, g: 3}
                        }))
                    }
                }, {
                    key: q("permute", 1), value: function () {
                        return se.s(new ge({
                            value: hn,
                            Oa: !0,
                            localName: "",
                            namespaceURI: "",
                            l: [{type: 59, g: 2}],
                            arity: 1,
                            j: {type: 59, g: 2}
                        }))
                    }
                }]))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "random-number-generator",
            l: [{type: 46, g: 0}],
            j: {type: 61, g: 3},
            m: function () {
                throw Error("Not implemented: Specifying a seed is not supported")
            }
        }];

        function fn() {
            throw Error("FOCH0002: No collations are supported")
        }

        function dn(e, t, n, r) {
            if (null === t.O) throw Error("XPDY0002: The function which was called depends on dynamic context, which is absent.");
            return e(t, n, r, se.s(t.O))
        }

        function mn(e, t, n, r) {
            return r.aa({
                empty: function () {
                    return se.s(q("", 1))
                }, default: function () {
                    return r.map((function (e) {
                        if (W(e.type, 53)) {
                            var n = Ot(e, t).first();
                            return W(e.type, 47) ? Jt(n, 1) : n
                        }
                        return Jt(e, 1)
                    }))
                }
            })
        }

        function vn(e, t, n, r, a) {
            return _e([a], (function (e) {
                var n = u(e).next().value;
                return St(r, t).M((function (e) {
                    return e = e.map((function (e) {
                        return Jt(e, 1).value
                    })).join(n.value), se.s(q(e, 1))
                }))
            }))
        }

        function gn(e, t, n, r) {
            return r.F() ? se.s(q(0, 5)) : (e = r.first().value, se.s(q(Array.from(e).length, 5)))
        }

        function yn(e, t, n, r, a, i) {
            var o = ln(!1, 0, 0, 0, a, null), s = null !== i ? ln(!1, 0, 0, 0, i, null) : null, u = !1, l = null, c = null,
                h = null;
            return se.create({
                next: function () {
                    return u ? z : l || null !== (l = r.first()) ? (c || (c = o.first()), !h && i && (h = null, h = s.first()), u = !0, Z(q(Array.from(l.value).slice(Math.max(c.value - 1, 0), i ? c.value + h.value - 1 : void 0).join(""), 1))) : (u = !0, Z(q("", 1)))
                }
            })
        }

        function wn(e, t, n, r, a) {
            if (r.F() || 0 === r.first().value.length) return se.empty();
            e = r.first().value, a = a.first().value;
            try {
                var i = new RegExp(a)
            } catch (e) {
                throw Error("FORX0002: " + e)
            }
            return se.create(e.split(i).map((function (e) {
                return q(e, 1)
            })))
        }

        function An(e, t, n, r) {
            return r.F() ? se.s(q("", 1)) : (e = r.first().value.trim(), se.s(q(e.replace(/\s+/g, " "), 1)))
        }

        var xn = new Map, bn = [{
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "compare",
            l: [{type: 1, g: 0}, {type: 1, g: 0}],
            j: {type: 5, g: 0},
            m: function (e, t, n, r, a) {
                return r.F() || a.F() ? se.empty() : (e = r.first().value) > (a = a.first().value) ? se.s(q(1, 5)) : e < a ? se.s(q(-1, 5)) : se.s(q(0, 5))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "compare",
            l: [{type: 1, g: 0}, {type: 1, g: 0}, {type: 1, g: 3}],
            j: {type: 5, g: 0},
            m: fn
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "concat",
            l: [{type: 46, g: 0}, {type: 46, g: 0}, 4],
            j: {type: 1, g: 3},
            m: function (e, t, n, r) {
                for (var a = [], i = 3; i < arguments.length; ++i) a[i - 3] = arguments[i];
                return _e(a = a.map((function (e) {
                    return St(e, t).M((function (e) {
                        return se.s(q(e.map((function (e) {
                            return null === e ? "" : Jt(e, 1).value
                        })).join(""), 1))
                    }))
                })), (function (e) {
                    return se.s(q(e.map((function (e) {
                        return e.value
                    })).join(""), 1))
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "contains",
            l: [{type: 1, g: 0}, {type: 1, g: 0}, {type: 1, g: 0}],
            j: {type: 0, g: 3},
            m: fn
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "contains",
            l: [{type: 1, g: 0}, {type: 1, g: 0}],
            j: {type: 0, g: 3},
            m: function (e, t, n, r, a) {
                return e = r.F() ? "" : r.first().value, 0 === (a = a.F() ? "" : a.first().value).length ? se.$() : 0 === e.length ? se.U() : e.includes(a) ? se.$() : se.U()
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "ends-with",
            l: [{type: 1, g: 0}, {type: 1, g: 0}],
            j: {type: 0, g: 3},
            m: function (e, t, n, r, a) {
                return 0 === (e = a.F() ? "" : a.first().value).length ? se.$() : 0 === (r = r.F() ? "" : r.first().value).length ? se.U() : r.endsWith(e) ? se.$() : se.U()
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "ends-with",
            l: [{type: 1, g: 0}, {type: 1, g: 0}, {type: 1, g: 3}],
            j: {type: 0, g: 3},
            m: fn
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "normalize-space",
            l: [{type: 1, g: 0}],
            j: {type: 1, g: 3},
            m: An
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "normalize-space",
            l: [],
            j: {type: 1, g: 3},
            m: dn.bind(null, (function (e, t, n, r) {
                return An(e, 0, 0, mn(0, t, 0, r))
            }))
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "starts-with",
            l: [{type: 1, g: 0}, {type: 1, g: 0}],
            j: {type: 0, g: 3},
            m: function (e, t, n, r, a) {
                return 0 === (e = a.F() ? "" : a.first().value).length ? se.$() : 0 === (r = r.F() ? "" : r.first().value).length ? se.U() : r.startsWith(e) ? se.$() : se.U()
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "starts-with",
            l: [{type: 1, g: 0}, {type: 1, g: 0}, {type: 1, g: 3}],
            j: {type: 0, g: 3},
            m: fn
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "string",
            l: [{type: 59, g: 0}],
            j: {type: 1, g: 3},
            m: mn
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "string",
            l: [],
            j: {type: 1, g: 3},
            m: dn.bind(null, mn)
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "substring-before",
            l: [{type: 1, g: 0}, {type: 1, g: 0}],
            j: {type: 1, g: 3},
            m: function (e, t, n, r, a) {
                return e = r.F() ? "" : r.first().value, "" === (a = a.F() ? "" : a.first().value) || -1 === (a = e.indexOf(a)) ? se.s(q("", 1)) : se.s(q(e.substring(0, a), 1))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "substring-after",
            l: [{type: 1, g: 0}, {type: 1, g: 0}],
            j: {type: 1, g: 3},
            m: function (e, t, n, r, a) {
                return e = r.F() ? "" : r.first().value, "" === (a = a.F() ? "" : a.first().value) ? se.s(q(e, 1)) : -1 === (t = e.indexOf(a)) ? se.s(q("", 1)) : se.s(q(e.substring(t + a.length), 1))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "substring",
            l: [{type: 1, g: 0}, {type: 3, g: 3}],
            j: {type: 1, g: 3},
            m: yn
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "substring",
            l: [{type: 1, g: 0}, {type: 3, g: 3}, {type: 3, g: 3}],
            j: {type: 1, g: 3},
            m: yn
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "upper-case",
            l: [{type: 1, g: 0}],
            j: {type: 1, g: 3},
            m: function (e, t, n, r) {
                return r.F() ? se.s(q("", 1)) : r.map((function (e) {
                    return q(e.value.toUpperCase(), 1)
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "lower-case",
            l: [{type: 1, g: 0}],
            j: {type: 1, g: 3},
            m: function (e, t, n, r) {
                return r.F() ? se.s(q("", 1)) : r.map((function (e) {
                    return q(e.value.toLowerCase(), 1)
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "string-join",
            l: [{type: 46, g: 2}, {type: 1, g: 3}],
            j: {type: 1, g: 3},
            m: vn
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "string-join",
            l: [{type: 46, g: 2}],
            j: {type: 1, g: 3},
            m: function (e, t, n, r) {
                return vn(0, t, 0, r, se.s(q("", 1)))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "string-length",
            l: [{type: 1, g: 0}],
            j: {type: 5, g: 3},
            m: gn
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "string-length",
            l: [],
            j: {type: 5, g: 3},
            m: dn.bind(null, (function (e, t, n, r) {
                return gn(e, 0, 0, mn(0, t, 0, r))
            }))
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "tokenize",
            l: [{type: 1, g: 0}, {type: 1, g: 3}, {type: 1, g: 3}],
            j: {type: 1, g: 2},
            m: function () {
                throw Error("Not implemented: Using flags in tokenize is not supported")
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "tokenize",
            l: [{type: 1, g: 0}, {type: 1, g: 3}],
            j: {type: 1, g: 2},
            m: wn
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "tokenize",
            l: [{type: 1, g: 0}],
            j: {type: 1, g: 2},
            m: function (e, t, n, r) {
                return wn(e, 0, 0, An(e, 0, 0, r), se.s(q(" ", 1)))
            }
        }, {
            l: [{type: 1, g: 0}, {type: 1, g: 3}, {type: 1, g: 3}], m: function (e, t, n, r, a, i) {
                return _e([r, a, i], (function (e) {
                    var t = u(e), n = t.next().value;
                    e = t.next().value, t = t.next().value, n = Array.from(n ? n.value : "");
                    var r = Array.from(e.value), a = Array.from(t.value);
                    return e = n.map((function (e) {
                        return r.includes(e) ? (e = r.indexOf(e)) <= a.length ? a[e] : void 0 : e
                    })), se.s(q(e.join(""), 1))
                }))
            }, localName: "translate", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 1, g: 3}
        }, {
            l: [{type: 5, g: 2}], m: function (e, t, n, r) {
                return r.M((function (e) {
                    return e = e.map((function (e) {
                        if (9 === (e = e.value) || 10 === e || 13 === e || 32 <= e && 55295 >= e || 57344 <= e && 65533 >= e || 65536 <= e && 1114111 >= e) return String.fromCodePoint(e);
                        throw Error("FOCH0001")
                    })).join(""), se.s(q(e, 1))
                }))
            }, localName: "codepoints-to-string", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 1, g: 3}
        }, {
            l: [{type: 1, g: 0}], m: function (e, t, n, r) {
                return _e([r], (function (e) {
                    return 0 === (e = (e = u(e).next().value) ? e.value.split("") : []).length ? se.empty() : se.create(e.map((function (e) {
                        return q(e.codePointAt(0), 5)
                    })))
                }))
            }, localName: "string-to-codepoints", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 5, g: 2}
        }, {
            l: [{type: 1, g: 0}], m: function (e, t, n, r) {
                return _e([r], (function (e) {
                    return null === (e = u(e).next().value) || 0 === e.value.length ? se.create(q("", 1)) : se.create(q(encodeURIComponent(e.value).replace(/[!'()*]/g, (function (e) {
                        return "%" + e.charCodeAt(0).toString(16).toUpperCase()
                    })), 1))
                }))
            }, localName: "encode-for-uri", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 1, g: 3}
        }, {
            l: [{type: 1, g: 0}], m: function (e, t, n, r) {
                return _e([r], (function (e) {
                    return null === (e = u(e).next().value) || 0 === e.value.length ? se.create(q("", 1)) : se.create(q(e.value.replace(/([\u00A0-\uD7FF\uE000-\uFDCF\uFDF0-\uFFEF "<>{}|\\^`/\n\u007f\u0080-\u009f]|[\uD800-\uDBFF][\uDC00-\uDFFF])/g, (function (e) {
                        return encodeURI(e)
                    })), 1))
                }))
            }, localName: "iri-to-uri", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 1, g: 3}
        }, {
            l: [{type: 1, g: 0}, {type: 1, g: 0}], m: function (e, t, n, r, a) {
                return _e([r, a], (function (e) {
                    var t = u(e);
                    if (e = t.next().value, t = t.next().value, null === e || null === t) return se.empty();
                    if (e = e.value, t = t.value, e.length !== t.length) return se.U();
                    e = e.split(""), t = t.split("");
                    for (var n = 0; n < e.length; n++) if (e[n].codePointAt(0) !== t[n].codePointAt(0)) return se.U();
                    return se.$()
                }))
            }, localName: "codepoint-equal", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 0, g: 0}
        }, {
            l: [{type: 1, g: 0}, {type: 1, g: 3}], m: function (e, t, n, r, a) {
                return _e([r, a], (function (e) {
                    var t = (e = u(e)).next().value;
                    e = e.next().value, t = t ? t.value : "";
                    var n = e.value, r = xn.get(n);
                    if (!r) try {
                        r = an.compile(e.value, {language: "xpath"}), xn.set(n, r)
                    } catch (e) {
                        throw Error("FORX0002: " + e)
                    }
                    return r(t) ? se.$() : se.U()
                }))
            }, localName: "matches", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 0, g: 3}
        }];

        function En(e, t, n, r) {
            if (null === t.O) throw Error("XPDY0002: The function which was called depends on dynamic context, which is absent.");
            return e(t, n, r, se.s(t.O))
        }

        function Bn(e, t, n, r) {
            return _e([r], (function (e) {
                if (null === (e = u(e).next().value)) return se.empty();
                switch ((e = e.value).node.nodeType) {
                    case 1:
                    case 2:
                        return se.s(q(new ve(e.node.prefix, e.node.namespaceURI, e.node.localName), 23));
                    case 7:
                        return se.s(q(new ve("", "", e.node.target), 23));
                    default:
                        return se.empty()
                }
            }))
        }

        function Nn(e, t, n, r) {
            return r.aa({
                default: function () {
                    return mn(0, t, 0, Bn(0, 0, 0, r))
                }, empty: function () {
                    return se.empty()
                }
            })
        }

        function Cn(e, t, n, r) {
            return St(r, t)
        }

        function Tn(e, t, n, r) {
            return _e([r], (function (e) {
                return null !== (e = (e = u(e).next().value) ? e.value : null) && De(t.h, e, null) ? se.$() : se.U()
            }))
        }

        function In(e, t, n, r) {
            return _e([r], (function (e) {
                function n(e) {
                    for (var t = 0, n = e; null !== n;) (e.node.nodeType !== n.node.nodeType ? 0 : 1 === n.node.nodeType ? n.node.localName === e.node.localName && n.node.namespaceURI === e.node.namespaceURI : 7 === n.node.nodeType ? n.node.target === e.node.target : 1) && t++, n = Fe(a, n, null);
                    return t
                }

                var r = u(e).next().value;
                if (null === r) return se.empty();
                var a = t.h;
                for (e = "", r = r.value; null !== Ue(t.h, r, null); r = Ue(t.h, r, null)) switch (r.node.nodeType) {
                    case 1:
                        var i = r;
                        e = "/Q{" + (i.node.namespaceURI || "") + "}" + i.node.localName + "[" + n(i) + "]" + e;
                        break;
                    case 2:
                        e = "/@" + ((i = r).node.namespaceURI ? "Q{" + i.node.namespaceURI + "}" : "") + i.node.localName + e;
                        break;
                    case 3:
                        e = "/text()[" + n(r) + "]" + e;
                        break;
                    case 7:
                        e = "/processing-instruction(" + (i = r).node.target + ")[" + n(i) + "]" + e;
                        break;
                    case 8:
                        e = "/comment()[" + n(r) + "]" + e
                }
                return 9 === r.node.nodeType ? se.create(q(e || "/", 1)) : se.create(q("Q{http://www.w3.org/2005/xpath-functions}root()" + e, 1))
            }))
        }

        function On(e, t, n, r) {
            return r.map((function (e) {
                return q(e.value.node.namespaceURI || "", 20)
            }))
        }

        function Sn(e, t, n, r) {
            return r.aa({
                default: function () {
                    return r.map((function (e) {
                        return 7 === e.value.node.nodeType ? q(e.value.node.target, 1) : q(e.value.node.localName || "", 1)
                    }))
                }, empty: function () {
                    return se.s(q("", 1))
                }
            })
        }

        function Rn(e, t, n) {
            if (2 === t.node.nodeType) return zt(t, n);
            for (; n;) {
                if (zt(t, n)) return !0;
                if (9 === n.node.nodeType) break;
                n = Ue(e, n, null)
            }
            return !1
        }

        function Dn(e, t, n, r) {
            return r.map((function (e) {
                if (!W(e.type, 53)) throw Error("XPTY0004 Argument passed to fn:root() should be of the type node()");
                for (e = e.value; e;) {
                    var n = e;
                    e = Ue(t.h, n, null)
                }
                return Xe(n)
            }))
        }

        var Gn = [{
            l: [{type: 53, g: 0}],
            m: Nn,
            localName: "name",
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            j: {type: 1, g: 0}
        }, {
            l: [],
            m: En.bind(null, Nn),
            localName: "name",
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            j: {type: 1, g: 3}
        }, {
            l: [{type: 53, g: 3}],
            m: On,
            localName: "namespace-uri",
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            j: {type: 20, g: 3}
        }, {
            l: [],
            m: En.bind(null, On),
            localName: "namespace-uri",
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            j: {type: 20, g: 3}
        }, {
            l: [{type: 53, g: 2}], m: function (e, t, n, r) {
                return r.M((function (e) {
                    return e.length ? (e = nn(t.h, e).reduceRight((function (e, n, r, a) {
                        return r === a.length - 1 ? (e.push(n), e) : (Rn(t.h, n.value, e[0].value) || e.unshift(n), e)
                    }), []), se.create(e)) : se.empty()
                }))
            }, localName: "innermost", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 53, g: 2}
        }, {
            l: [{type: 53, g: 2}], m: function (e, t, n, r) {
                return r.M((function (e) {
                    return e.length ? (e = nn(t.h, e).reduce((function (e, n, r) {
                        return 0 === r ? (e.push(n), e) : (Rn(t.h, e[e.length - 1].value, n.value) || e.push(n), e)
                    }), []), se.create(e)) : se.empty()
                }), 1)
            }, localName: "outermost", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 53, g: 2}
        }, {
            l: [{type: 53, g: 0}],
            m: Tn,
            localName: "has-children",
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            j: {type: 0, g: 3}
        }, {
            l: [],
            m: En.bind(null, Tn),
            localName: "has-children",
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            j: {type: 0, g: 3}
        }, {
            l: [{type: 53, g: 0}],
            m: In,
            localName: "path",
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            j: {type: 1, g: 0}
        }, {
            l: [],
            m: En.bind(null, In),
            localName: "path",
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            j: {type: 1, g: 0}
        }, {
            l: [{type: 53, g: 0}],
            m: Bn,
            localName: "node-name",
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            j: {type: 23, g: 0}
        }, {
            l: [],
            m: En.bind(null, Bn),
            localName: "node-name",
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            j: {type: 23, g: 0}
        }, {
            l: [{type: 53, g: 0}],
            m: Sn,
            localName: "local-name",
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            j: {type: 1, g: 3}
        }, {
            l: [],
            m: En.bind(null, Sn),
            localName: "local-name",
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            j: {type: 1, g: 3}
        }, {
            l: [{type: 53, g: 0}],
            m: Dn,
            localName: "root",
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            j: {type: 53, g: 0}
        }, {
            l: [],
            m: En.bind(null, Dn),
            localName: "root",
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            j: {type: 53, g: 0}
        }, {
            l: [],
            m: En.bind(null, Cn),
            localName: "data",
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            j: {type: 46, g: 2}
        }, {
            l: [{type: 59, g: 2}],
            m: Cn,
            localName: "data",
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            j: {type: 46, g: 2}
        }];

        function Mn(e, t) {
            var n = 0, r = e.length, a = !1, i = null;
            return {
                next: function () {
                    if (!a) {
                        for (; n < r;) {
                            i || (i = t(e[n], n, e));
                            var o = i.next(0);
                            if (i = null, !o.value) return Z(!1);
                            n++
                        }
                        return a = !0, Z(!0)
                    }
                    return z
                }
            }
        }

        function Un(e) {
            return 1 === (e = e.node.nodeType) || 3 === e
        }

        function Fn(e, t) {
            if ((W(e.type, 4) || W(e.type, 6)) && (W(t.type, 4) || W(t.type, 6))) {
                var n = Jt(e, 6), r = Jt(t, 6);
                return n.value === r.value || isNaN(e.value) && isNaN(t.value)
            }
            return (W(e.type, 4) || W(e.type, 6) || W(e.type, 3)) && (W(t.type, 4) || W(t.type, 6) || W(t.type, 3)) ? (n = Jt(e, 3), r = Jt(t, 3), n.value === r.value || isNaN(e.value) && isNaN(t.value)) : W(e.type, 23) && W(t.type, 23) ? e.value.namespaceURI === t.value.namespaceURI && e.value.localName === t.value.localName : (W(e.type, 9) || W(e.type, 7) || W(e.type, 8) || W(e.type, 11) || W(e.type, 12) || W(e.type, 13) || W(e.type, 14) || W(e.type, 15)) && (W(t.type, 9) || W(t.type, 7) || W(t.type, 8) || W(t.type, 11) || W(t.type, 12) || W(t.type, 13) || W(t.type, 14) || W(t.type, 15)) ? lt(e.value, t.value) : e.value === t.value
        }

        function Pn(e, t, n) {
            return n = u([t, n].map((function (t) {
                return {
                    type: 1, value: t.reduce((function (t, n) {
                        return t + Ot(n, e).first().value
                    }), "")
                }
            }))), Z(Fn(t = n.next().value, n = n.next().value))
        }

        function Hn(e, t, n, r) {
            for (; e.value && W(e.value.type, 56);) {
                t.push(e.value);
                var a = Me(r, e.value.value);
                if (e = n.next(0), a && 3 !== a.node.nodeType) break
            }
            return e
        }

        function jn(e, t, n, r, a) {
            var i, o = t.h, s = r.value, u = a.value, l = null, c = null, h = null, p = [], f = [];
            return {
                next: function () {
                    for (; !i;) if (l || (l = s.next(0)), l = Hn(l, p, s, o), c || (c = u.next(0)), c = Hn(c, f, u, o), p.length || f.length) {
                        var r = Pn(t, p, f);
                        if (p.length = 0, f.length = 0, !1 === r.value) return i = !0, r
                    } else {
                        if (l.done || c.done) return i = !0, Z(l.done === c.done);
                        if (h || (h = _n(e, t, n, l.value, c.value)), r = h.next(0), h = null, !1 === r.value) return i = !0, r;
                        c = l = null
                    }
                    return z
                }
            }
        }

        function Xn(e, t, n, r, a) {
            return r = Se(t.h, r.value), a = Se(t.h, a.value), r = r.filter((function (e) {
                return Un(e)
            })), a = a.filter((function (e) {
                return Un(e)
            })), jn(e, t, n, r = se.create(r.map((function (e) {
                return Xe(e)
            }))), a = se.create(a.map((function (e) {
                return Xe(e)
            }))))
        }

        function _n(e, t, n, r, a) {
            if (W(r.type, 46) && W(a.type, 46)) return Kt(Fn(r, a));
            if (W(r.type, 61) && W(a.type, 61)) return function (e, t, n, r, a) {
                return r.h.length !== a.h.length ? Kt(!1) : Mn(r.h, (function (r) {
                    var i = a.h.find((function (e) {
                        return Fn(e.key, r.key)
                    }));
                    return i ? jn(e, t, n, r.value(), i.value()) : Kt(!1)
                }))
            }(e, t, n, r, a);
            if (W(r.type, 62) && W(a.type, 62)) return function (e, t, n, r, a) {
                return r.R.length !== a.R.length ? Kt(!1) : Mn(r.R, (function (r, i) {
                    return i = a.R[i], jn(e, t, n, r(), i())
                }))
            }(e, t, n, r, a);
            if (W(r.type, 53) && W(a.type, 53)) {
                if (W(r.type, 55) && W(a.type, 55)) return Xn(e, t, n, r, a);
                if (W(r.type, 54) && W(a.type, 54)) return function (e, t, n, r, a) {
                    var i = jn(e, t, n, Bn(0, 0, 0, se.s(r)), Bn(0, 0, 0, se.s(a))), o = Xn(e, t, n, r, a);
                    r = Ie(t.h, r.value).filter((function (e) {
                        return "http://www.w3.org/2000/xmlns/" !== e.node.namespaceURI
                    })).sort((function (e, t) {
                        return e.node.nodeName > t.node.nodeName ? 1 : -1
                    })).map((function (e) {
                        return Xe(e)
                    })), a = Ie(t.h, a.value).filter((function (e) {
                        return "http://www.w3.org/2000/xmlns/" !== e.node.namespaceURI
                    })).sort((function (e, t) {
                        return e.node.nodeName > t.node.nodeName ? 1 : -1
                    })).map((function (e) {
                        return Xe(e)
                    }));
                    var s = jn(e, t, n, se.create(r), se.create(a)), u = !1;
                    return {
                        next: function () {
                            if (u) return z;
                            var e = i.next(0);
                            return (e.done || !1 !== e.value) && ((e = s.next(0)).done || !1 !== e.value) ? (e = o.next(0), u = !0, e) : (u = !0, e)
                        }
                    }
                }(e, t, n, r, a);
                if (W(r.type, 47) && W(a.type, 47) || W(r.type, 57) && W(a.type, 57) || W(r.type, 58) && W(a.type, 58)) return function (e, t, n, r, a) {
                    var i = jn(e, t, n, Bn(0, 0, 0, se.s(r)), Bn(0, 0, 0, se.s(a))), o = !1;
                    return {
                        next: function () {
                            if (o) return z;
                            var e = i.next(0);
                            return e.done || !1 !== e.value ? Z(Fn(Ot(r, t).first(), Ot(a, t).first())) : (o = !0, e)
                        }
                    }
                }(e, t, n, r, a)
            }
            return Kt(!1)
        }

        function Ln(e) {
            return Error("XUST0001: " + (void 0 === e ? "Can not execute an updating expression in a non-updating context." : e))
        }

        function kn(e) {
            return Error("XUTY0004: The attribute " + e.name + '="' + e.value + '" follows a node that is not an attribute node.')
        }

        function Yn() {
            return Error("XUTY0005: The target of a insert expression with into must be a single element or document node.")
        }

        function qn() {
            return Error("XUTY0006: The target of a insert expression with before or after must be a single element, text, comment, or processing instruction node.")
        }

        function Vn() {
            return Error("XUTY0008: The target of a replace expression must be a single element, attribute, text, comment, or processing instruction node.")
        }

        function Qn() {
            return Error("XUTY0012: The target of a rename expression must be a single element, attribute, or processing instruction node.")
        }

        function Jn(e) {
            return Error("XUDY0017: The target " + e.outerHTML + " is used in more than one replace value of expression.")
        }

        function Kn(e) {
            return Error("XUDY0021: Applying the updates will result in the XDM instance violating constraint: '" + e + "'")
        }

        function zn(e) {
            return Error("XUDY0023: The namespace binding " + e + " is conflicting.")
        }

        function Zn(e) {
            return Error("XUDY0024: The namespace binding " + e + " is conflicting.")
        }

        function Wn() {
            return Error("XUDY0027: The target for an insert, replace, or rename expression expression should not be empty.")
        }

        function $n(e, t, n, r, a) {
            n = void 0 === n ? {
                A: !1,
                Z: !1,
                T: "unsorted",
                subtree: !1
            } : n, this.K = e, this.B = n.T || "unsorted", this.subtree = !!n.subtree, this.Z = !!n.Z, this.A = !!n.A, this.J = t, this.I = !1, this.Ya = null, this.wb = void 0 !== r && r, this.type = a
        }

        function er(e, t, n) {
            return t && null !== t.O && e.A ? (null === e.Ya && (e.Ya = ue(e.evaluate(null, n).pb())), e = e.Ya()) : e = e.evaluate(t, n), e
        }

        function tr(e, t) {
            this.H = e, this.fa = t
        }

        function nr(e) {
            e && "nodeType" in e && ("function" == typeof (e = e.ownerDocument || e).createElementNS && "function" == typeof e.createProcessingInstruction && "function" == typeof e.createTextNode && "function" == typeof e.createComment && (this.h = e)), this.h || (this.h = null)
        }

        function rr(e, t, n) {
            t.forEach((function (t) {
                n.insertBefore(e.node, t.node, null)
            }))
        }

        function ar(e, t, n, r) {
            var a = Ue(n, e), i = e.node.nodeType;
            if (2 === i) {
                if (t.some((function (e) {
                    return 2 !== e.node.nodeType
                }))) throw Error('Constraint "If $target is an attribute node, $replacement must consist of zero or more attribute nodes." failed.');
                var o = a ? a.node : null;
                r.removeAttributeNS(o, e.node.namespaceURI, e.node.nodeName), t.forEach((function (e) {
                    var t = e.node.nodeName;
                    if (Oe(n, a, t)) throw Kn("An attribute " + t + " already exists.");
                    r.setAttributeNS(o, e.node.namespaceURI, t, Re(n, e))
                }))
            }
            if (1 === i || 3 === i || 8 === i || 7 === i) {
                var s = (i = Me(n, e)) ? i.node : null;
                r.removeChild(a.node, e.node), t.forEach((function (e) {
                    r.insertBefore(a.node, e.node, s)
                }))
            }
        }

        function ir(e, t, n, r) {
            if (function (e, t) {
                function n(e) {
                    return new ve(e.node.prefix, e.node.namespaceURI, e.node.localName)
                }

                function r(t, n) {
                    var r = new Set;
                    e.filter((function (e) {
                        return e.type === t
                    })).map((function (e) {
                        return e.target
                    })).forEach((function (e) {
                        e = e ? e.node : null, r.has(e) && n(e), r.add(e)
                    }))
                }

                r("rename", (function (e) {
                    throw Error("XUDY0015: The target " + e.outerHTML + " is used in more than one rename expression.")
                })), r("replaceNode", (function (e) {
                    throw Error("XUDY0016: The target " + e.outerHTML + " is used in more than one replace expression.")
                })), r("replaceValue", (function (e) {
                    throw Jn(e)
                })), r("replaceElementContent", (function (e) {
                    throw Jn(e)
                }));
                var a = new Map;
                e.filter((function (e) {
                    return "replaceNode" === e.type && 2 === e.target.node.nodeType
                })).forEach((function (e) {
                    var r = Ue(t, e.target);
                    r = r ? r.node : null;
                    var i = a.get(r);
                    i ? i.push.apply(i, c(e.o.map(n))) : a.set(r, e.o.map(n))
                })), e.filter((function (e) {
                    return "rename" === e.type && 2 === e.target.node.nodeType
                })).forEach((function (e) {
                    var n = Ue(t, e.target);
                    if (n) {
                        n = n.node;
                        var r = a.get(n);
                        r ? r.push(e.o) : a.set(n, [e.o])
                    }
                })), a.forEach((function (e) {
                    var t = {};
                    e.forEach((function (e) {
                        if (t[e.prefix] || (t[e.prefix] = e.namespaceURI), t[e.prefix] !== e.namespaceURI) throw Zn(e.namespaceURI)
                    }))
                }))
            }(e, t), e.filter((function (e) {
                return -1 !== ["insertInto", "insertAttributes", "replaceValue", "rename"].indexOf(e.type)
            })).forEach((function (e) {
                switch (e.type) {
                    case"insertInto":
                        rr(e.target, e.content, r);
                        break;
                    case"insertAttributes":
                        !function (e, t, n, r) {
                            t.forEach((function (t) {
                                var a = t.node.nodeName;
                                if (Oe(n, e, a)) throw Kn("An attribute " + a + " already exists.");
                                r.setAttributeNS(e.node, t.node.namespaceURI, a, Re(n, t))
                            }))
                        }(e.target, e.content, t, r);
                        break;
                    case"rename":
                        !function (e, t, n, r, a) {
                            switch (r || (r = new nr(e ? e.node : null)), e.node.nodeType) {
                                case 1:
                                    var i = n.getAllAttributes(e.node), o = n.getChildNodes(e.node),
                                        s = r.createElementNS(t.namespaceURI, t.va()), u = {node: s, G: null};
                                    i.forEach((function (e) {
                                        a.setAttributeNS(s, e.namespaceURI, e.nodeName, e.value)
                                    })), o.forEach((function (e) {
                                        a.insertBefore(s, e, null)
                                    }));
                                    break;
                                case 2:
                                    (t = r.createAttributeNS(t.namespaceURI, t.va())).value = Re(n, e), u = {
                                        node: t,
                                        G: null
                                    };
                                    break;
                                case 7:
                                    u = {node: r.createProcessingInstruction(t.va(), Re(n, e)), G: null}
                            }
                            if (!Ue(n, e)) throw Error("Not supported: renaming detached nodes.");
                            ar(e, [u], n, a)
                        }(e.target, e.o, t, n, r);
                        break;
                    case"replaceValue":
                        var a = e.target;
                        if (e = e.o, 2 === a.node.nodeType) {
                            var i = Ue(t, a);
                            i ? r.setAttributeNS(i.node, a.node.namespaceURI, a.node.nodeName, e) : a.node.value = e
                        } else r.setData(a.node, e)
                }
            })), e.filter((function (e) {
                return -1 !== ["insertBefore", "insertAfter", "insertIntoAsFirst", "insertIntoAsLast"].indexOf(e.type)
            })).forEach((function (e) {
                switch (e.type) {
                    case"insertAfter":
                        !function (e, t, n, r) {
                            var a = Ue(n, e).node, i = (e = Me(n, e)) ? e.node : null;
                            t.forEach((function (e) {
                                r.insertBefore(a, e.node, i)
                            }))
                        }(e.target, e.content, t, r);
                        break;
                    case"insertBefore":
                        !function (e, t, n, r) {
                            var a = Ue(n, e).node;
                            t.forEach((function (t) {
                                r.insertBefore(a, t.node, e.node)
                            }))
                        }(e.target, e.content, t, r);
                        break;
                    case"insertIntoAsFirst":
                        !function (e, t, n, r) {
                            var a = (n = De(n, e)) ? n.node : null;
                            t.forEach((function (t) {
                                r.insertBefore(e.node, t.node, a)
                            }))
                        }(e.target, e.content, t, r);
                        break;
                    case"insertIntoAsLast":
                        rr(e.target, e.content, r)
                }
            })), e.filter((function (e) {
                return "replaceNode" === e.type
            })).forEach((function (e) {
                ar(e.target, e.o, t, r)
            })), e.filter((function (e) {
                return "replaceElementContent" === e.type
            })).forEach((function (e) {
                !function (e, t, n, r) {
                    n.getChildNodes(e.node).forEach((function (t) {
                        return r.removeChild(e.node, t)
                    })), t && r.insertBefore(e.node, t.node, null)
                }(e.target, e.text, t, r)
            })), e.filter((function (e) {
                return "delete" === e.type
            })).forEach((function (e) {
                e = e.target;
                var n = Ue(t, e);
                (n = n ? n.node : null) && (2 === e.node.nodeType ? r.removeAttributeNS(n, e.node.namespaceURI, e.node.nodeName) : r.removeChild(n, e.node))
            })), e.some((function (e) {
                return "put" === e.type
            }))) throw Error('Not implemented: the execution for pendingUpdate "put" is not yet implemented.')
        }

        function or(e, t) {
            for (var n = [], r = 1; r < arguments.length; ++r) n[r - 1] = arguments[r];
            return e.concat.apply(e, c(n.filter(Boolean)))
        }

        function sr(e, t, n, r) {
            $n.call(this, e, t, n, !0, r), this.I = !0
        }

        function ur(e) {
            return e.I ? function (t, n) {
                return e.o(t, n)
            } : function (t, n) {
                var r = e.evaluate(t, n);
                return {
                    next: function () {
                        return Z({fa: [], H: r.S()})
                    }
                }
            }
        }

        function lr(e, t) {
            return t((e = e.next(0)).value.fa), se.create(e.value.H)
        }

        function cr(e, t, n, r) {
            sr.call(this, e, t, n, r), this.I = this.J.some((function (e) {
                return e.I
            }))
        }

        $n.prototype.Y = function () {
            return null
        }, $n.prototype.P = function (e) {
            if (this.J.forEach((function (t) {
                return t.P(e)
            })), !this.wb && this.J.some((function (e) {
                return e.I
            }))) throw Ln()
        }, (n = nr.prototype).createAttributeNS = function (e, t) {
            if (!this.h) throw Error("Please pass a node factory if an XQuery script uses node constructors");
            return this.h.createAttributeNS(e, t)
        }, n.createCDATASection = function (e) {
            if (!this.h) throw Error("Please pass a node factory if an XQuery script uses node constructors");
            return this.h.createCDATASection(e)
        }, n.createComment = function (e) {
            if (!this.h) throw Error("Please pass a node factory if an XQuery script uses node constructors");
            return this.h.createComment(e)
        }, n.createDocument = function () {
            if (!this.h) throw Error("Please pass a node factory if an XQuery script uses node constructors");
            return this.h.implementation.createDocument(null, null, null)
        }, n.createElementNS = function (e, t) {
            if (!this.h) throw Error("Please pass a node factory if an XQuery script uses node constructors");
            return this.h.createElementNS(e, t)
        }, n.createProcessingInstruction = function (e, t) {
            if (!this.h) throw Error("Please pass a node factory if an XQuery script uses node constructors");
            return this.h.createProcessingInstruction(e, t)
        }, n.createTextNode = function (e) {
            if (!this.h) throw Error("Please pass a node factory if an XQuery script uses node constructors");
            return this.h.createTextNode(e)
        }, v(sr, $n), sr.prototype.evaluate = function () {
            throw Ln()
        }, v(cr, sr), cr.prototype.evaluate = function (e, t) {
            return this.v(e, t, this.J.map((function (e) {
                return function (n) {
                    return e.evaluate(n, t)
                }
            })))
        }, cr.prototype.o = function (e, t) {
            var n = [], r = this.v(e, t, this.J.map((function (e) {
                return e.I ? function (r) {
                    return lr(r = e.o(r, t), (function (e) {
                        return n = or(n, e)
                    }))
                } : function (n) {
                    return e.evaluate(n, t)
                }
            }))), a = !1;
            return {
                next: function () {
                    if (a) return z;
                    var e = r.S();
                    return a = !0, Z(new tr(e, n))
                }
            }
        }, cr.prototype.P = function (e) {
            sr.prototype.P.call(this, e), function (e) {
                e.J.some((function (e) {
                    return e.I
                })) && (e.I = !0)
            }(this)
        };
        var hr = ["external", "attribute", "nodeName", "nodeType", "universal"], pr = hr.length;

        function fr(e) {
            if (this.h = hr.map((function (t) {
                return e[t] || 0
            })), Object.keys(e).some((function (e) {
                return !hr.includes(e)
            }))) throw Error("Invalid specificity kind passed")
        }

        function dr(e, t) {
            for (var n = 0; n < pr; ++n) {
                if (t.h[n] < e.h[n]) return 1;
                if (t.h[n] > e.h[n]) return -1
            }
            return 0
        }

        function mr() {
            return Ct("Expected base expression of a function call to evaluate to a sequence of single function item")
        }

        function vr(e, t, n, r) {
            for (var a = [], i = 0; i < t.length; ++i) if (null === t[i]) a.push(null); else {
                var o = sn(e[i], t[i], n, r, !1);
                a.push(o)
            }
            return a
        }

        function gr(e, t) {
            if (!W(e.type, 60)) throw Ct("Expected base expression to evaluate to a function item");
            if (e.B !== t) throw mr();
            return e
        }

        function yr(e, t, n, r, a, i, o) {
            var s = 0;
            return a = a.map((function (e) {
                return e ? null : i[s++](n)
            })), 0 <= (a = vr(e.o, a, r, e.J)).indexOf(null) ? function (e, t) {
                var n = e.value, r = t.map((function (e) {
                    return null === e ? null : ue(e)
                }));
                return t = new ge({
                    l: t = t.reduce((function (t, n, r) {
                        return null === n && t.push(e.o[r]), t
                    }), []),
                    arity: t.length,
                    Oa: !0,
                    I: e.I,
                    localName: "boundFunction",
                    namespaceURI: e.v,
                    j: e.C,
                    value: function (e, t, a) {
                        var i = Array.from(arguments).slice(3), o = r.map((function (e) {
                            return null === e ? i.shift() : e()
                        }));
                        return n.apply(void 0, [e, t, a].concat(o))
                    }
                }), se.s(t)
            }(e, a) : (t = t.apply(void 0, [n, r, o].concat(c(a))), sn(e.C, t, r, e.J, !0))
        }

        function wr(e, t, n) {
            var r = {};
            cr.call(this, new fr((r.external = 1, r)), [e].concat(t.filter((function (e) {
                return !!e
            }))), {T: "unsorted", Z: !1, subtree: !1, A: !1}, n), this.ka = t.length, this.N = t.map((function (e) {
                return null === e
            })), this.C = null, this.na = e, this.ua = t
        }

        function Ar(e, t, n, r, a, i) {
            return _e([r, a, i], (function (e) {
                var t = u(e);
                e = t.next().value;
                var n = t.next().value;
                if (t = t.next().value, n = n.value, t = t.value, n > e.R.length || 0 >= n) throw Error("FOAY0001: subarray start out of bounds.");
                if (0 > t) throw Error("FOAY0002: subarray length out of bounds.");
                if (n + t > e.R.length + 1) throw Error("FOAY0001: subarray start + length out of bounds.");
                return se.s(new He(e.R.slice(n - 1, t + n - 1)))
            }))
        }

        function xr(e, t, n, r, a) {
            return _e([r], (function (e) {
                var t = u(e).next().value;
                return a.M((function (e) {
                    e = e.map((function (e) {
                        return e.value
                    })).sort((function (e, t) {
                        return t - e
                    })).filter((function (e, t, n) {
                        return n[t - 1] !== e
                    }));
                    for (var n = t.R.concat(), r = 0, a = e.length; r < a; ++r) {
                        var i = e[r];
                        if (i > t.R.length || 0 >= i) throw Error("FOAY0001: subarray position out of bounds.");
                        n.splice(i - 1, 1)
                    }
                    return se.s(new He(n))
                }))
            }))
        }

        function br(e) {
            return W(e, 1) || W(e, 20) || W(e, 19)
        }

        function Er(e, t, n, r) {
            return r.sort((function (r, a) {
                return jn(e, t, n, se.create(r), se.create(a)).next(0).value ? 0 : function e(t, n, r, a, i) {
                    return 0 === a.length ? 0 !== i.length : 0 !== i.length && _n(t, n, r, a[0], i[0]).next(0).value ? e(t, n, r, a.slice(1), i.slice(1)) : a[0].value != a[0].value || (br(a[0].type) && 0 !== i.length && br(i[0].type) || 0 !== i.length) && a[0].value < i[0].value
                }(e, t, n, r, a) ? -1 : 1
            })), se.s(new He(r.map((function (e) {
                return function () {
                    return se.create(e)
                }
            }))))
        }

        function Br(e, t) {
            return W(t.type, 62) ? t.R.reduce((function (e, t) {
                return t().M((function (t) {
                    return t.reduce(Br, e)
                }))
            }), e) : Bt([e, se.s(t)])
        }

        fr.prototype.add = function (e) {
            var t = this;
            return new fr(hr.reduce((function (n, r, a) {
                return n[r] = t.h[a] + e.h[a], n
            }), Object.create(null)))
        }, v(wr, cr), wr.prototype.o = function (e, t) {
            var n = this;
            if (!this.h || !this.h.I) return cr.prototype.o.call(this, e, t);
            var r = [], a = yr(this.h, (function (e, t, a, i) {
                for (var o = [], s = 3; s < arguments.length; ++s) o[s - 3] = arguments[s];
                return lr(n.h.value.apply(n.h, [e, t, a].concat(c(o))), (function (e) {
                    r = or(r, e)
                }))
            }), e, t, this.N, this.ua.map((function (n) {
                return function () {
                    return n.I ? lr(n.o(e, t), (function (e) {
                        r = or(r, e)
                    })) : er(n, e, t)
                }
            })), this.C), i = !1;
            return {
                next: function () {
                    if (i) return z;
                    var e = a.S();
                    return i = !0, Z({fa: r, H: e})
                }
            }
        }, wr.prototype.v = function (e, t, n) {
            var r = this, a = (n = u(n)).next().value, i = l(n);
            if (this.h) return yr(this.h, (function (e, t, n, a) {
                for (var i = [], o = 3; o < arguments.length; ++o) i[o - 3] = arguments[o];
                return r.h.value.apply(r.h, [e, t, n].concat(c(i)))
            }), e, t, this.N, i, this.C);
            var o = a(e);
            return o.aa({
                default: function () {
                    throw mr()
                }, s: function () {
                    return o.M((function (n) {
                        if ((n = gr(n = u(n).next().value, r.ka)).I) throw Error("XUDY0038: The function returned by the PrimaryExpr of a dynamic function invocation can not be an updating function");
                        return yr(n, n.value, e, t, r.N, i, r.C)
                    }))
                }
            })
        }, wr.prototype.P = function (e) {
            if (this.C = Po(e), cr.prototype.P.call(this, e), this.na.A) {
                if (!(e = er(this.na, null, null)).za()) throw mr();
                this.h = gr(e.first(), this.ka), this.h.I && (this.I = !0)
            }
        };
        var Nr = [{
            namespaceURI: "http://www.w3.org/2005/xpath-functions/array",
            localName: "size",
            l: [{type: 62, g: 3}],
            j: {type: 5, g: 3},
            m: function (e, t, n, r) {
                return _e([r], (function (e) {
                    return e = u(e).next().value, se.s(q(e.R.length, 5))
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/array",
            localName: "get",
            l: [{type: 62, g: 3}, {type: 5, g: 3}],
            j: {type: 59, g: 2},
            m: Pe
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/array",
            localName: "put",
            l: [{type: 62, g: 3}, {type: 5, g: 3}, {type: 59, g: 2}],
            j: {type: 62, g: 3},
            m: function (e, t, n, r, a, i) {
                return _e([a, r], (function (e) {
                    var t = u(e);
                    if (e = t.next().value, t = t.next().value, 0 >= (e = e.value) || e > t.R.length) throw Error("FOAY0001: array position out of bounds.");
                    return (t = t.R.concat()).splice(e - 1, 1, ue(i)), se.s(new He(t))
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/array",
            localName: "append",
            l: [{type: 62, g: 3}, {type: 59, g: 2}],
            j: {type: 62, g: 3},
            m: function (e, t, n, r, a) {
                return _e([r], (function (e) {
                    return e = u(e).next().value.R.concat([ue(a)]), se.s(new He(e))
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/array",
            localName: "subarray",
            l: [{type: 62, g: 3}, {type: 5, g: 3}, {type: 5, g: 3}],
            j: {type: 62, g: 3},
            m: Ar
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/array",
            localName: "subarray",
            l: [{type: 62, g: 3}, {type: 5, g: 3}],
            j: {type: 62, g: 3},
            m: function (e, t, n, r, a) {
                var i = se.s(q(r.first().value.length - a.first().value + 1, 5));
                return Ar(0, 0, 0, r, a, i)
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/array",
            localName: "remove",
            l: [{type: 62, g: 3}, {type: 5, g: 2}],
            j: {type: 62, g: 3},
            m: xr
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/array",
            localName: "insert-before",
            l: [{type: 62, g: 3}, {type: 5, g: 3}, {type: 59, g: 2}],
            j: {type: 62, g: 3},
            m: function (e, t, n, r, a, i) {
                return _e([r, a], (function (e) {
                    var t = u(e);
                    if (e = t.next().value, (t = t.next().value.value) > e.R.length + 1 || 0 >= t) throw Error("FOAY0001: subarray position out of bounds.");
                    return (e = e.R.concat()).splice(t - 1, 0, ue(i)), se.s(new He(e))
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/array",
            localName: "head",
            l: [{type: 62, g: 3}],
            j: {type: 59, g: 2},
            m: function (e, t, n, r) {
                return Pe(0, 0, 0, r, se.s(q(1, 5)))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/array",
            localName: "tail",
            l: [{type: 62, g: 3}],
            j: {type: 59, g: 2},
            m: function (e, t, n, r) {
                return xr(0, 0, 0, r, se.s(q(1, 5)))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/array",
            localName: "reverse",
            l: [{type: 62, g: 3}],
            j: {type: 62, g: 3},
            m: function (e, t, n, r) {
                return _e([r], (function (e) {
                    return e = u(e).next().value, se.s(new He(e.R.concat().reverse()))
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/array",
            localName: "join",
            l: [{type: 62, g: 2}],
            j: {type: 62, g: 3},
            m: function (e, t, n, r) {
                return r.M((function (e) {
                    return e = e.reduce((function (e, t) {
                        return e.concat(t.R)
                    }), []), se.s(new He(e))
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/array",
            localName: "for-each",
            l: [{type: 62, g: 3}, {type: 60, g: 3}],
            j: {type: 62, g: 3},
            m: function (e, t, n, r, a) {
                return _e([r, a], (function (r) {
                    var a = (r = u(r)).next().value, i = r.next().value;
                    if (1 !== i.B) throw Ct("The callback passed into array:for-each has a wrong arity.");
                    return r = a.R.map((function (r) {
                        return ue(i.value.call(void 0, e, t, n, vr(i.o, [r()], t, "array:for-each")[0]))
                    })), se.s(new He(r))
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/array",
            localName: "filter",
            l: [{type: 62, g: 3}, {type: 60, g: 3}],
            j: {type: 62, g: 3},
            m: function (e, t, n, r, a) {
                return _e([r, a], (function (r) {
                    var a = (r = u(r)).next().value, i = r.next().value;
                    if (1 !== i.B) throw Ct("The callback passed into array:filter has a wrong arity.");
                    var o = a.R.map((function (r) {
                        return r = vr(i.o, [r()], t, "array:filter")[0], (0, i.value)(e, t, n, r)
                    })), s = [], l = !1;
                    return se.create({
                        next: function () {
                            if (l) return z;
                            for (var e = 0, t = a.R.length; e < t; ++e) {
                                var n = o[e].getEffectiveBooleanValue();
                                s[e] = n
                            }
                            return e = a.R.filter((function (e, t) {
                                return s[t]
                            })), l = !0, Z(new He(e))
                        }
                    })
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/array",
            localName: "fold-left",
            l: [{type: 62, g: 3}, {type: 59, g: 2}, {type: 60, g: 3}],
            j: {type: 59, g: 2},
            m: function (e, t, n, r, a, i) {
                return _e([r, i], (function (r) {
                    var i = (r = u(r)).next().value, o = r.next().value;
                    if (2 !== o.B) throw Ct("The callback passed into array:fold-left has a wrong arity.");
                    return i.R.reduce((function (r, a) {
                        return a = vr(o.o, [a()], t, "array:fold-left")[0], o.value.call(void 0, e, t, n, r, a)
                    }), a)
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/array",
            localName: "fold-right",
            l: [{type: 62, g: 3}, {type: 59, g: 2}, {type: 60, g: 3}],
            j: {type: 59, g: 2},
            m: function (e, t, n, r, a, i) {
                return _e([r, i], (function (r) {
                    var i = (r = u(r)).next().value, o = r.next().value;
                    if (2 !== o.B) throw Ct("The callback passed into array:fold-right has a wrong arity.");
                    return i.R.reduceRight((function (r, a) {
                        return a = vr(o.o, [a()], t, "array:fold-right")[0], o.value.call(void 0, e, t, n, r, a)
                    }), a)
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/array",
            localName: "for-each-pair",
            l: [{type: 62, g: 3}, {type: 62, g: 3}, {type: 60, g: 3}],
            j: {type: 62, g: 3},
            m: function (e, t, n, r, a, i) {
                return _e([r, a, i], (function (r) {
                    var a = u(r);
                    r = a.next().value;
                    var i = a.next().value;
                    if (2 !== (a = a.next().value).B) throw Ct("The callback passed into array:for-each-pair has a wrong arity.");
                    for (var o = [], s = 0, l = Math.min(r.R.length, i.R.length); s < l; ++s) {
                        var c = u(vr(a.o, [r.R[s](), i.R[s]()], t, "array:for-each-pair")), h = c.next().value;
                        c = c.next().value, o[s] = ue(a.value.call(void 0, e, t, n, h, c))
                    }
                    return se.s(new He(o))
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/array",
            localName: "sort",
            l: [{type: 62, g: 3}],
            j: {type: 62, g: 3},
            m: function (e, t, n, r) {
                return _e([r], (function (r) {
                    return r = u(r).next().value.R.map((function (e) {
                        return e().S()
                    })), Er(e, t, n, r)
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/array",
            localName: "flatten",
            l: [{type: 59, g: 2}],
            j: {type: 59, g: 2},
            m: function (e, t, n, r) {
                return r.M((function (e) {
                    return e.reduce(Br, se.empty())
                }))
            }
        }];

        function Cr(e, t, n, r, a) {
            return a.F() ? a : se.s(Jt(a.first(), e))
        }

        var Tr = [{
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "untypedAtomic",
            l: [{type: 46, g: 0}],
            j: {type: 19, g: 0},
            m: Cr.bind(null, 19)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "error",
            l: [{type: 46, g: 0}],
            j: {type: 39, g: 0},
            m: Cr.bind(null, 39)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "string",
            l: [{type: 46, g: 0}],
            j: {type: 1, g: 0},
            m: Cr.bind(null, 1)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "boolean",
            l: [{type: 46, g: 0}],
            j: {type: 0, g: 0},
            m: Cr.bind(null, 0)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "decimal",
            l: [{type: 46, g: 0}],
            j: {type: 4, g: 0},
            m: Cr.bind(null, 4)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "float",
            l: [{type: 46, g: 0}],
            j: {type: 6, g: 0},
            m: Cr.bind(null, 6)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "double",
            l: [{type: 46, g: 0}],
            j: {type: 3, g: 0},
            m: Cr.bind(null, 3)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "duration",
            l: [{type: 46, g: 0}],
            j: {type: 18, g: 0},
            m: Cr.bind(null, 18)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "dateTime",
            l: [{type: 46, g: 0}],
            j: {type: 9, g: 0},
            m: Cr.bind(null, 9)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "dateTimeStamp",
            l: [{type: 46, g: 0}],
            j: {type: 10, g: 0},
            m: Cr.bind(null, 10)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "time",
            l: [{type: 46, g: 0}],
            j: {type: 8, g: 0},
            m: Cr.bind(null, 8)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "date",
            l: [{type: 46, g: 0}],
            j: {type: 7, g: 0},
            m: Cr.bind(null, 7)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "gYearMonth",
            l: [{type: 46, g: 0}],
            j: {type: 11, g: 0},
            m: Cr.bind(null, 11)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "gYear",
            l: [{type: 46, g: 0}],
            j: {type: 12, g: 0},
            m: Cr.bind(null, 12)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "gMonthDay",
            l: [{type: 46, g: 0}],
            j: {type: 13, g: 0},
            m: Cr.bind(null, 13)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "gDay",
            l: [{type: 46, g: 0}],
            j: {type: 15, g: 0},
            m: Cr.bind(null, 15)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "gMonth",
            l: [{type: 46, g: 0}],
            j: {type: 14, g: 0},
            m: Cr.bind(null, 14)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "hexBinary",
            l: [{type: 46, g: 0}],
            j: {type: 22, g: 0},
            m: Cr.bind(null, 22)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "base64Binary",
            l: [{type: 46, g: 0}],
            j: {type: 21, g: 0},
            m: Cr.bind(null, 21)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "QName",
            l: [{type: 46, g: 0}],
            j: {type: 23, g: 0},
            m: function (e, t, n, r) {
                if (r.F()) return r;
                if (W((e = r.first()).type, 2)) throw Error("XPTY0004: The provided QName is not a string-like value.");
                if (!Gt(e = Dt(e = Jt(e, 1).value, 23), 23)) throw Error("FORG0001: The provided QName is invalid.");
                if (!e.includes(":")) return n = n.ga(""), se.s(q(new ve("", n, e), 23));
                if (t = (r = u(e.split(":"))).next().value, r = r.next().value, !(n = n.ga(t))) throw Error("FONS0004: The value " + e + " can not be cast to a QName. Did you mean to use fn:QName?");
                return se.s(q(new ve(t, n, r), 23))
            }
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "anyURI",
            l: [{type: 46, g: 0}],
            j: {type: 20, g: 0},
            m: Cr.bind(null, 20)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "normalizedString",
            l: [{type: 46, g: 0}],
            j: {type: 48, g: 0},
            m: Cr.bind(null, 48)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "token",
            l: [{type: 46, g: 0}],
            j: {type: 52, g: 0},
            m: Cr.bind(null, 52)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "language",
            l: [{type: 46, g: 0}],
            j: {type: 51, g: 0},
            m: Cr.bind(null, 51)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "NMTOKEN",
            l: [{type: 46, g: 0}],
            j: {type: 50, g: 0},
            m: Cr.bind(null, 50)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "NMTOKENS",
            l: [{type: 46, g: 0}],
            j: {type: 49, g: 2},
            m: Cr.bind(null, 49)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "Name",
            l: [{type: 46, g: 0}],
            j: {type: 25, g: 0},
            m: Cr.bind(null, 25)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "NCName",
            l: [{type: 46, g: 0}],
            j: {type: 24, g: 0},
            m: Cr.bind(null, 24)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "ID",
            l: [{type: 46, g: 0}],
            j: {type: 42, g: 0},
            m: Cr.bind(null, 42)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "IDREF",
            l: [{type: 46, g: 0}],
            j: {type: 41, g: 0},
            m: Cr.bind(null, 41)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "IDREFS",
            l: [{type: 46, g: 0}],
            j: {type: 43, g: 2},
            m: Cr.bind(null, 43)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "ENTITY",
            l: [{type: 46, g: 0}],
            j: {type: 26, g: 0},
            m: Cr.bind(null, 26)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "ENTITIES",
            l: [{type: 46, g: 0}],
            j: {type: 40, g: 2},
            m: Cr.bind(null, 40)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "integer",
            l: [{type: 46, g: 0}],
            j: {type: 5, g: 0},
            m: Cr.bind(null, 5)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "nonPositiveInteger",
            l: [{type: 46, g: 0}],
            j: {type: 27, g: 0},
            m: Cr.bind(null, 27)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "negativeInteger",
            l: [{type: 46, g: 0}],
            j: {type: 28, g: 0},
            m: Cr.bind(null, 28)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "long",
            l: [{type: 46, g: 0}],
            j: {type: 31, g: 0},
            m: Cr.bind(null, 31)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "int",
            l: [{type: 46, g: 0}],
            j: {type: 32, g: 0},
            m: Cr.bind(null, 32)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "short",
            l: [{type: 46, g: 0}],
            j: {type: 33, g: 0},
            m: Cr.bind(null, 33)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "byte",
            l: [{type: 46, g: 0}],
            j: {type: 34, g: 0},
            m: Cr.bind(null, 34)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "nonNegativeInteger",
            l: [{type: 46, g: 0}],
            j: {type: 30, g: 0},
            m: Cr.bind(null, 30)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "unsignedLong",
            l: [{type: 46, g: 0}],
            j: {type: 36, g: 0},
            m: Cr.bind(null, 36)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "unsignedInt",
            l: [{type: 46, g: 0}],
            j: {type: 35, g: 0},
            m: Cr.bind(null, 35)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "unsignedShort",
            l: [{type: 46, g: 0}],
            j: {type: 38, g: 0},
            m: Cr.bind(null, 38)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "unsignedByte",
            l: [{type: 46, g: 0}],
            j: {type: 37, g: 0},
            m: Cr.bind(null, 37)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "positiveInteger",
            l: [{type: 46, g: 0}],
            j: {type: 29, g: 0},
            m: Cr.bind(null, 29)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "yearMonthDuration",
            l: [{type: 46, g: 0}],
            j: {type: 16, g: 0},
            m: Cr.bind(null, 16)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "dayTimeDuration",
            l: [{type: 46, g: 0}],
            j: {type: 17, g: 0},
            m: Cr.bind(null, 17)
        }, {
            namespaceURI: "http://www.w3.org/2001/XMLSchema",
            localName: "dateTimeStamp",
            l: [{type: 46, g: 0}],
            j: {type: 10, g: 0},
            m: Cr.bind(null, 10)
        }];

        function Ir(e, t, n, r) {
            return r.F() ? r : se.s(q(r.first().value.getYear(), 5))
        }

        function Or(e, t, n, r) {
            return r.F() ? r : se.s(q(r.first().value.getMonth(), 5))
        }

        function Sr(e, t, n, r) {
            return r.F() ? r : se.s(q(r.first().value.getDay(), 5))
        }

        function Rr(e, t, n, r) {
            return r.F() ? r : se.s(q(r.first().value.getHours(), 5))
        }

        function Dr(e, t, n, r) {
            return r.F() ? r : se.s(q(r.first().value.getMinutes(), 5))
        }

        function Gr(e, t, n, r) {
            return r.F() || (t = (e = se).s, r = r.first().value, r = t.call(e, q(r.J + r.pa, 4))), r
        }

        function Mr(e, t, n, r) {
            return r.F() ? r : (e = r.first().value.ba) ? se.s(q(e, 17)) : se.empty()
        }

        var Ur = [{
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "dateTime",
            l: [{type: 7, g: 0}, {type: 8, g: 0}],
            j: {type: 9, g: 0},
            m: function (e, t, n, r, a) {
                if (r.F()) return r;
                if (a.F()) return a;
                if (e = r.first().value, a = a.first().value, t = e.ba, n = a.ba, t || n) {
                    if (!t || n) if (!t && n) t = n; else if (!Ve(t, n)) throw Error("FORG0008: fn:dateTime: got a date and time value with different timezones.")
                } else t = null;
                return se.s(q(new at(e.getYear(), e.getMonth(), e.getDay(), a.getHours(), a.getMinutes(), a.getSeconds(), a.pa, t), 9))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "year-from-dateTime",
            l: [{type: 9, g: 0}],
            j: {type: 5, g: 0},
            m: Ir
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "month-from-dateTime",
            l: [{type: 9, g: 0}],
            j: {type: 5, g: 0},
            m: Or
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "day-from-dateTime",
            l: [{type: 9, g: 0}],
            j: {type: 5, g: 0},
            m: Sr
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "hours-from-dateTime",
            l: [{type: 9, g: 0}],
            j: {type: 5, g: 0},
            m: Rr
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "minutes-from-dateTime",
            l: [{type: 9, g: 0}],
            j: {type: 5, g: 0},
            m: Dr
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "seconds-from-dateTime",
            l: [{type: 9, g: 0}],
            j: {type: 4, g: 0},
            m: Gr
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "timezone-from-dateTime",
            l: [{type: 9, g: 0}],
            j: {type: 17, g: 0},
            m: Mr
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "year-from-date",
            l: [{type: 7, g: 0}],
            j: {type: 5, g: 0},
            m: Ir
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "month-from-date",
            l: [{type: 7, g: 0}],
            j: {type: 5, g: 0},
            m: Or
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "day-from-date",
            l: [{type: 7, g: 0}],
            j: {type: 5, g: 0},
            m: Sr
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "timezone-from-date",
            l: [{type: 7, g: 0}],
            j: {type: 17, g: 0},
            m: Mr
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "hours-from-time",
            l: [{type: 8, g: 0}],
            j: {type: 5, g: 0},
            m: Rr
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "minutes-from-time",
            l: [{type: 8, g: 0}],
            j: {type: 5, g: 0},
            m: Dr
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "seconds-from-time",
            l: [{type: 8, g: 0}],
            j: {type: 4, g: 0},
            m: Gr
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "timezone-from-time",
            l: [{type: 8, g: 0}],
            j: {type: 17, g: 0},
            m: Mr
        }];

        function Fr(e, t, n, r, a) {
            return r.M((function (e) {
                for (var n = St(se.create(e), t).map((function (e) {
                    return Jt(e, 1)
                })).S(), r = "", i = 0; i < n.length; i++) r += "{type: " + n[i].type + ", value: " + n[i].value + "}\n";
                return void 0 !== a && (r += a.first().value), t.v.trace(r), se.create(e)
            }))
        }

        var Pr = [{
            l: [{type: 59, g: 2}],
            m: Fr,
            localName: "trace",
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            j: {type: 59, g: 2}
        }, {
            l: [{type: 59, g: 2}, {type: 1, g: 3}],
            m: Fr,
            localName: "trace",
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            j: {type: 59, g: 2}
        }];

        function Hr(e, t) {
            e = Error.call(this, e), this.message = e.message, "stack" in e && (this.stack = e.stack), this.position = {
                end: {
                    da: t.end.da,
                    line: t.end.line,
                    offset: t.end.offset
                }, start: {da: t.start.da, line: t.start.line, offset: t.start.offset}
            }
        }

        function jr(e, t) {
            if (t instanceof Error) throw t;
            var n = function e(t) {
                return t.h instanceof Error ? t.location : e(t.h)
            }(t);
            e = e.replace("\r", "").split("\n");
            var r = Math.floor(Math.log10(Math.min(n.end.line + 2, e.length))) + 1;
            throw e = e.reduce((function (e, t, a) {
                var i = a + 1;
                if (2 < n.start.line - i || 2 < i - n.end.line) return e;
                if (a = Array(r).fill(" ", 0, Math.floor(Math.log10(i)) + 1 - r).join("") + i + ": ", e.push(a + t), i >= n.start.line && i <= n.end.line) {
                    var o = i < n.end.line ? t.length + a.length : n.end.da - 1 + a.length;
                    i = i > n.start.line ? a.length : n.start.da - 1 + a.length, e.push(Array(a.length + t.length).fill(" ", 0, i).fill("^", i, o).join(""))
                }
                return e
            }), []), t = function e(t) {
                var n = t.h instanceof Hr ? ["Inner error:", t.h.message] : t.h instanceof Error ? [t.h.toString()] : e(t.h);
                return n.push("  at <" + t.o + ">:" + t.location.start.line + ":" + t.location.start.da + " - " + t.location.end.line + ":" + t.location.end.da), n
            }(t).join("\n"), new Hr(e.join("\n") + "\n\n" + t, n)
        }

        function Xr(e, t) {
            "*" === t || Array.isArray(t) || (t = [t]);
            for (var n = 1; n < e.length; ++n) if (Array.isArray(e[n])) {
                var r = e[n];
                if ("*" === t || t.includes(r[0])) return r
            }
            return null
        }

        function _r(e) {
            return 2 > e.length ? "" : "object" == typeof e[1] ? e[2] || "" : e[1] || ""
        }

        function Lr(e, t) {
            return Array.isArray(e) ? "object" != typeof (e = e[1]) || Array.isArray(e) ? null : t in e ? e[t] : null : null
        }

        function kr(e, t) {
            return t.reduce(Xr, e)
        }

        function Yr(e, t) {
            for (var n = [], r = 1; r < e.length; ++r) if (Array.isArray(e[r])) {
                var a = e[r];
                "*" !== t && a[0] !== t || n.push(a)
            }
            return n
        }

        function qr(e) {
            return {localName: _r(e), namespaceURI: Lr(e, "URI"), prefix: Lr(e, "prefix") || ""}
        }

        function Vr(e) {
            var t = Xr(e, "typeDeclaration");
            if (!t || Xr(t, "voidSequenceType")) return {type: 59, g: 2};
            e = {
                type: function e(n) {
                    switch (n[0]) {
                        case"documentTest":
                            return 55;
                        case"elementTest":
                            return 54;
                        case"attributeTest":
                            return 47;
                        case"piTest":
                            return 57;
                        case"commentTest":
                            return 58;
                        case"textTest":
                            return 56;
                        case"anyKindTest":
                            return 53;
                        case"anyItemType":
                            return 59;
                        case"anyFunctionTest":
                        case"functionTest":
                        case"typedFunctionTest":
                            return 60;
                        case"anyMapTest":
                        case"typedMapTest":
                            return 61;
                        case"anyArrayTest":
                        case"typedArrayTest":
                            return 62;
                        case"atomicType":
                            return de([Lr(n, "prefix"), _r(n)].join(":"));
                        case"parenthesizedItemType":
                            return e(Xr(n, "*"));
                        default:
                            throw Error('Type declaration "' + Xr(t, "*")[0] + '" is not supported.')
                    }
                }(Xr(t, "*")), g: 3
            };
            var n = null, r = Xr(t, "occurrenceIndicator");
            switch (r && (n = _r(r)), n) {
                case"*":
                    return e.g = 2, e;
                case"?":
                    return e.g = 0, e;
                case"+":
                    return e.g = 1, e;
                case"":
                case null:
                    return e
            }
        }

        function Qr(e, t) {
            if ("object" != typeof e[1] || Array.isArray(e[1])) {
                var n = {};
                n.type = t, e.splice(1, 0, n)
            } else e[1].type = t
        }

        function Jr(e, t) {
            var n = {};
            $n.call(this, new fr((n.external = 1, n)), e, {
                A: e.every((function (e) {
                    return e.A
                }))
            }, !1, t), this.h = e
        }

        function Kr(e, t) {
            var n = {};
            $n.call(this, new fr((n.external = 1, n)), e, {
                A: e.every((function (e) {
                    return e.A
                }))
            }, !1, t), this.h = e
        }

        function zr(e) {
            if (null === e) throw Error("XPDY0002: context is absent, it needs to be present to use axes.");
            if (!W(e.type, 53)) throw Error("XPTY0020: Axes can only be applied to nodes.");
            return e.value
        }

        function Zr(e, t) {
            t = t || {Na: !1}, $n.call(this, e.K, [e], {
                T: "reverse-sorted",
                Z: !1,
                subtree: !1,
                A: !1
            }), this.h = e, this.o = !!t.Na
        }

        function Wr(e) {
            var t = {};
            $n.call(this, new fr((t.attribute = 1, t)), [e], {T: "unsorted", subtree: !0, Z: !0, A: !1}), this.h = e
        }

        function $r(e) {
            $n.call(this, e.K, [e], {T: "sorted", subtree: !0, Z: !0, A: !1}), this.h = e
        }

        function ea(e, t, n) {
            var r = t.node.nodeType;
            if (1 !== r && 9 !== r) return {
                next: function () {
                    return z
                }
            };
            var a = De(e, t, n);
            return {
                next: function () {
                    if (!a) return z;
                    var t = a;
                    return a = Me(e, a, n), Z(t)
                }
            }
        }

        function ta(e, t) {
            t = t || {Na: !1}, $n.call(this, e.K, [e], {
                A: !1,
                Z: !1,
                T: "sorted",
                subtree: !0
            }), this.h = e, this.o = !!t.Na, this.v = (e = this.h.Y()) && (e.startsWith("name-") || "type-1" === e) ? "type-1" : null
        }

        function na(e, t, n) {
            var r = e.node.nodeType;
            if (1 !== r && 9 !== r) return e;
            for (r = Ge(t, e, n); null !== r;) {
                if (1 !== r.node.nodeType) return r;
                r = Ge(t, e = r, n)
            }
            return e
        }

        function ra(e, t, n, r) {
            if (void 0 !== n && n) {
                var a = t, i = !1;
                return {
                    next: function () {
                        if (i) return z;
                        if (zt(a, t)) return zt(a = na(t, e, r), t) ? (i = !0, z) : Z(Xe(a));
                        var n = a.node.nodeType, o = 9 === n || 2 === n ? null : Fe(e, a, r);
                        return null !== o ? Z(Xe(a = na(o, e, r))) : zt(a = 9 === n ? null : Ue(e, a, r), t) ? (i = !0, z) : Z(Xe(a))
                    }
                }
            }
            var o = [ea(e, t, r)];
            return {
                next: function () {
                    if (!o.length) return z;
                    for (var t = o[0].next(0); t.done;) {
                        if (o.shift(), !o.length) return z;
                        t = o[0].next(0)
                    }
                    return o.unshift(ea(e, t.value, r)), Z(Xe(t.value))
                }
            }
        }

        function aa(e) {
            $n.call(this, e.K, [e], {
                T: "sorted",
                Z: !0,
                subtree: !1,
                A: !1
            }), this.h = e, this.o = (e = this.h.Y()) && (e.startsWith("name-") || "type-1" === e) ? "type-1" : null
        }

        function ia(e) {
            $n.call(this, e.K, [e], {T: "sorted", Z: !0, subtree: !1, A: !1}), this.h = e
        }

        function oa(e) {
            $n.call(this, e.K, [e], {T: "reverse-sorted", Z: !0, subtree: !0, A: !1}), this.h = e
        }

        function sa(e) {
            $n.call(this, e.K, [e], {
                A: !1,
                Z: !0,
                T: "reverse-sorted",
                subtree: !1
            }), this.h = e, this.o = (e = this.h.Y()) && (e.startsWith("name-") || "type-1" === e) ? "type-1" : null
        }

        function ua(e) {
            $n.call(this, e.K, [e], {A: !1, Z: !0, T: "reverse-sorted", subtree: !1}), this.h = e
        }

        function la(e) {
            $n.call(this, e.K, [e], {T: "sorted", subtree: !0, Z: !0, A: !1}), this.h = e
        }

        function ca(e, t, n, r) {
            var a = e.K.add(t.K).add(n.K);
            cr.call(this, a, [e, t, n], {
                A: e.A && t.A && n.A,
                Z: t.Z === n.Z && t.Z,
                T: t.B === n.B ? t.B : "unsorted",
                subtree: t.subtree === n.subtree && t.subtree
            }, r), this.h = e
        }

        function ha(e, t, n) {
            this.location = e, this.o = t, this.h = n
        }

        function pa(e, t, n) {
            cr.call(this, n.K, [n], {A: n.A, Z: n.Z, T: n.B, subtree: n.subtree}), this.h = t, this.C = {
                end: {
                    da: e.end.da,
                    line: e.end.line,
                    offset: e.end.offset
                }, start: {da: e.start.da, line: e.start.line, offset: e.start.offset}
            }
        }

        function fa(e, t, n, r) {
            $n.call(this, e, t, n, !0), this.h = r, this.I = this.h.I
        }

        function da(e, t, n, r) {
            fa.call(this, t.K.add(r.K), [t, r], {A: !1}, r), this.N = e.prefix, this.ka = e.namespaceURI, this.vb = e.localName, this.mb = null, this.v = n, this.ua = null, this.na = t
        }

        function ma(e, t, n) {
            var r = {};
            $n.call(this, new fr((r.external = 1, r)), [n], {A: !1, T: "unsorted"}), this.N = e.map((function (e) {
                return e.name
            })), this.v = e.map((function (e) {
                return e.type
            })), this.o = null, this.C = t, this.h = n
        }

        function va(e, t, n) {
            if (fa.call(this, t.K.add(n.K), [t, n], {
                A: !1,
                Z: n.Z,
                T: n.B,
                subtree: n.subtree
            }, n), e.prefix || e.namespaceURI) throw Error("Not implemented: let expressions with namespace usage.");
            this.v = e.prefix, this.N = e.namespaceURI, this.ua = e.localName, this.ka = t, this.na = null
        }

        function ga(e, t) {
            switch ($n.call(this, new fr({}), [], {A: !0, T: "sorted"}, !1, t), t.type) {
                case 5:
                    var n = q(parseInt(e, 10), t.type);
                    break;
                case 1:
                    n = q(e, t.type);
                    break;
                case 4:
                case 3:
                    n = q(parseFloat(e), t.type);
                    break;
                default:
                    throw new TypeError("Type " + t + " not expected in a literal")
            }
            this.h = function () {
                return se.s(n)
            }
        }

        function ya(e, t) {
            var n = {};
            $n.call(this, new fr((n.external = 1, n)), e.reduce((function (e, t) {
                return e.concat(t.key, t.value)
            }), []), {A: !1}, !1, t), this.h = e
        }

        v(Hr, Error), v(Jr, $n), Jr.prototype.evaluate = function (e, t) {
            return 0 === this.h.length ? se.s(new He([])) : er(this.h[0], e, t).M((function (e) {
                return se.s(new He(e.map((function (e) {
                    return ue(se.s(e))
                }))))
            }))
        }, v(Kr, $n), Kr.prototype.evaluate = function (e, t) {
            return se.s(new He(this.h.map((function (n) {
                return ue(er(n, e, t))
            }))))
        }, v(Zr, $n), Zr.prototype.evaluate = function (e, t) {
            var n = this;
            t = t.h, e = zr(e.O);
            var r = this.h.Y();
            return r = r && (r.startsWith("name-") || "type-1" === r) ? "type-1" : null, se.create(function (e, t, n) {
                var r = t;
                return {
                    next: function () {
                        if (!r) return z;
                        var t = r;
                        return r = Ue(e, t, n), Z(Xe(t))
                    }
                }
            }(t, this.o ? e : Ue(t, e, r), r)).filter((function (e) {
                return n.h.h(e)
            }))
        }, v(Wr, $n), Wr.prototype.evaluate = function (e, t) {
            var n = this;
            return t = t.h, 1 !== (e = zr(e.O)).node.nodeType ? se.empty() : (e = Ie(t, e, this.h.Y()).filter((function (e) {
                return "http://www.w3.org/2000/xmlns/" !== e.node.namespaceURI
            })).map((function (e) {
                return Xe(e)
            })).filter((function (e) {
                return n.h.h(e)
            })), se.create(e))
        }, Wr.prototype.Y = function () {
            return "type-1"
        }, v($r, $n), $r.prototype.evaluate = function (e, t) {
            var n = this;
            t = t.h;
            var r = (e = zr(e.O)).node.nodeType, a = [];
            return 1 !== r && 9 !== r || Se(t, e, this.h.Y()).forEach((function (e) {
                return a.push(Xe(e))
            })), se.create(a).filter((function (e) {
                return n.h.h(e)
            }))
        }, v(ta, $n), ta.prototype.evaluate = function (e, t) {
            var n = this;
            return e = function (e, t, n) {
                var r = [Kt(t)];
                return {
                    next: function (t) {
                        if (0 < r.length && 0 != (1 & t) && r.shift(), !r.length) return z;
                        for (t = r[0].next(0); t.done;) {
                            if (r.shift(), !r.length) return z;
                            t = r[0].next(0)
                        }
                        return r.unshift(ea(e, t.value, n)), Z(Xe(t.value))
                    }
                }
            }(t = t.h, e = zr(e.O), this.v), this.o || e.next(0), se.create(e).filter((function (e) {
                return n.h.h(e)
            }))
        }, v(aa, $n), aa.prototype.evaluate = function (e, t) {
            var n = this;
            return t = t.h, e = zr(e.O), se.create(function (e, t, n) {
                for (var r = []; t && 9 !== t.node.nodeType; t = Ue(e, t, null)) {
                    var a = Me(e, t, n);
                    a && r.push(a)
                }
                var i = null;
                return {
                    next: function () {
                        for (; i || r.length;) {
                            if (!i) {
                                i = ra(e, r[0], !1, n);
                                var t = Z(Xe(r[0])), a = Me(e, r[0], n);
                                return a ? r[0] = a : r.shift(), t
                            }
                            if (!(t = i.next(0)).done) return t;
                            i = null
                        }
                        return z
                    }
                }
            }(t, e, this.o)).filter((function (e) {
                return n.h.h(e)
            }))
        }, v(ia, $n), ia.prototype.evaluate = function (e, t) {
            var n = this;
            return t = t.h, e = zr(e.O), se.create(function (e, t, n) {
                return {
                    next: function () {
                        return (t = t && Me(e, t, n)) ? Z(Xe(t)) : z
                    }
                }
            }(t, e, this.h.Y())).filter((function (e) {
                return n.h.h(e)
            }))
        }, v(oa, $n), oa.prototype.evaluate = function (e, t) {
            return (e = Ue(t = t.h, e = zr(e.O), this.h.Y())) ? (e = Xe(e), this.h.h(e) ? se.s(e) : se.empty()) : se.empty()
        }, v(sa, $n), sa.prototype.evaluate = function (e, t) {
            var n = this;
            return t = t.h, e = zr(e.O), se.create(function (e, t, n) {
                for (var r = []; t && 9 !== t.node.nodeType; t = Ue(e, t, null)) {
                    var a = Fe(e, t, n);
                    null !== a && r.push(a)
                }
                var i = null;
                return {
                    next: function () {
                        for (; i || r.length;) {
                            i || (i = ra(e, r[0], !0, n));
                            var t = i.next(0);
                            if (t.done) {
                                i = null, t = Fe(e, r[0], n);
                                var a = Z(Xe(r[0]));
                                return null === t ? r.shift() : r[0] = t, a
                            }
                            return t
                        }
                        return z
                    }
                }
            }(t, e, this.o)).filter((function (e) {
                return n.h.h(e)
            }))
        }, v(ua, $n), ua.prototype.evaluate = function (e, t) {
            var n = this;
            return t = t.h, e = zr(e.O), se.create(function (e, t, n) {
                return {
                    next: function () {
                        return (t = t && Fe(e, t, n)) ? Z(Xe(t)) : z
                    }
                }
            }(t, e, this.h.Y())).filter((function (e) {
                return n.h.h(e)
            }))
        }, v(la, $n), la.prototype.evaluate = function (e) {
            return zr(e.O), this.h.h(e.O) ? se.s(e.O) : se.empty()
        }, la.prototype.Y = function () {
            return this.h.Y()
        }, v(ca, cr), ca.prototype.v = function (e, t, n) {
            var r = null, a = n[0](e);
            return se.create({
                next: function (t) {
                    return r || (r = (a.getEffectiveBooleanValue() ? n[1](e) : n[2](e)).value), r.next(t)
                }
            })
        }, ca.prototype.P = function (e) {
            if (cr.prototype.P.call(this, e), this.h.I) throw Ln()
        }, v(pa, cr), pa.prototype.v = function (e, t, n) {
            var r = this;
            t = u(n).next().value;
            try {
                var a = t(e)
            } catch (e) {
                throw new ha(this.C, this.h, e)
            }
            return se.create({
                next: function (e) {
                    try {
                        return a.value.next(e)
                    } catch (e) {
                        throw new ha(r.C, r.h, e)
                    }
                }
            })
        }, pa.prototype.P = function (e) {
            try {
                cr.prototype.P.call(this, e)
            } catch (e) {
                throw new ha(this.C, this.h, e)
            }
        }, v(fa, $n), fa.prototype.evaluate = function (e, t) {
            var n = this;
            return this.C(e, Kt(e), t, (function (r) {
                if (n.h instanceof fa) return function e(t, n, r, a) {
                    return t.C(n, r, a, (function (r) {
                        if (t.h instanceof fa) return e(t.h, n, r, a);
                        var i = null;
                        return se.create({
                            next: function () {
                                for (; ;) {
                                    if (!i) {
                                        var e = r.next(0);
                                        if (e.done) return z;
                                        i = er(t.h, e.value, a).value
                                    }
                                    if (!(e = i.next(0)).done) return e;
                                    i = null
                                }
                            }
                        })
                    }))
                }(n.h, e, r, t);
                var a = null;
                return se.create({
                    next: function (e) {
                        for (; ;) {
                            if (!a) {
                                var i = r.next(0);
                                if (i.done) return z;
                                a = er(n.h, i.value, t).value
                            }
                            if (!(i = a.next(e)).done) return i;
                            a = null
                        }
                    }
                })
            }))
        }, fa.prototype.o = function (e, t) {
            return function e(t, n, r, a) {
                var i = [], o = t.C(n, r, a, (function (r) {
                    if (t.h instanceof fa) return lr(e(t.h, n, r, a), (function (e) {
                        return i = e
                    }));
                    var o = null;
                    return se.create({
                        next: function () {
                            for (; ;) {
                                if (!o) {
                                    var e = r.next(0);
                                    if (e.done) return z;
                                    e = t.h.o(e.value, a), o = lr(e, (function (e) {
                                        return i = or(i, e)
                                    })).value
                                }
                                if (!(e = o.next(0)).done) return e;
                                o = null
                            }
                        }
                    })
                })), s = !1;
                return {
                    next: function () {
                        if (s) return z;
                        var e = o.S();
                        return s = !0, Z(new tr(e, i))
                    }
                }
            }(this, e, Kt(e), t)
        }, fa.prototype.P = function (e) {
            $n.prototype.P.call(this, e), this.I = this.h.I;
            for (var t = (e = u(this.J)).next(); !t.done; t = e.next()) if ((t = t.value) !== this.h && t.I) throw Ln()
        }, v(da, fa), da.prototype.C = function (e, t, n, r) {
            var a = this, i = null, o = null, s = 0;
            return r({
                next: function () {
                    for (var e = {}; ;) {
                        if (!i) {
                            var r = t.next(0);
                            if (r.done) return z;
                            o = r.value, s = 0, i = er(a.na, o, n).value
                        }
                        if (e.hb = i.next(0), !e.hb.done) return s++, (r = {})[a.mb] = function (e) {
                            return function () {
                                return se.s(e.hb.value)
                            }
                        }(e), e = r, a.ua && (e[a.ua] = function () {
                            return se.s(new le(5, s))
                        }), Z(bt(o, e));
                        i = null, e = {hb: e.hb}
                    }
                }
            })
        }, da.prototype.P = function (e) {
            if (this.N && (this.ka = e.ga(this.N), !this.ka && this.N)) throw Error("XPST0081: Could not resolve namespace for prefix " + this.N + " in a for expression");
            if (this.na.P(e), Ho(e), this.mb = Xo(e, this.ka, this.vb), this.v) {
                if (this.v.prefix && (this.v.namespaceURI = e.ga(this.v.prefix), !this.v.namespaceURI && this.v.prefix)) throw Error("XPST0081: Could not resolve namespace for prefix " + this.N + " in the positionalVariableBinding in a for expression");
                this.ua = Xo(e, this.v.namespaceURI, this.v.localName)
            }
            if (this.h.P(e), Lo(e), this.na.I) throw Ln();
            this.h.I && (this.I = !0)
        }, v(ma, $n), ma.prototype.evaluate = function (e, t) {
            var n = this, r = new ge({
                l: this.v,
                arity: this.v.length,
                Oa: !0,
                I: this.h.I,
                localName: "dynamic-function",
                namespaceURI: "",
                j: this.C,
                value: function (r, a, i, o) {
                    for (var s = [], u = 3; u < arguments.length; ++u) s[u - 3] = arguments[u];
                    return u = bt(xt(e, -1, null, se.empty()), n.o.reduce((function (e, t, n) {
                        return e[t] = ue(s[n]), e
                    }), Object.create(null))), er(n.h, u, t)
                }
            });
            return se.s(r)
        }, ma.prototype.P = function (e) {
            if (Ho(e), this.o = this.N.map((function (t) {
                return Xo(e, t.namespaceURI, t.localName)
            })), this.h.P(e), Lo(e), this.h.I) throw Error("Not implemented: inline functions can not yet be updating.")
        }, v(va, fa), va.prototype.C = function (e, t, n, r) {
            var a = this;
            return r({
                next: function () {
                    var e = t.next(0);
                    if (e.done) return z;
                    var r = {};
                    return Z(e = bt(e = e.value, (r[a.na] = ue(er(a.ka, e, n)), r)))
                }
            })
        }, va.prototype.P = function (e) {
            if (this.v && (this.N = e.ga(this.v), !this.N && this.v)) throw Error("XPST0081: Could not resolve namespace for prefix " + this.v + " using in a for expression");
            if (this.ka.P(e), Ho(e), this.na = Xo(e, this.N, this.ua), this.h.P(e), Lo(e), this.I = this.h.I, this.ka.I) throw Ln()
        }, v(ga, $n), ga.prototype.evaluate = function () {
            return this.h()
        }, v(ya, $n), ya.prototype.evaluate = function (e, t) {
            var n = this;
            return _e(this.h.map((function (n) {
                return St(er(n.key, e, t), t).aa({
                    default: function () {
                        throw Error("XPTY0004: A key of a map should be a single atomizable value.")
                    }, s: function (e) {
                        return e
                    }
                })
            })), (function (r) {
                return se.s(new Ye(r.map((function (r, a) {
                    return {key: r, value: ue(er(n.h[a].value, e, t))}
                }))))
            }))
        };
        var wa = Object.create(null);

        function Aa(e, t) {
            for (var n = [], r = 0; r < e.length + 1; ++r) n[r] = [];
            return function r(a, i) {
                if (0 === a) return i;
                if (0 === i) return a;
                if (void 0 !== n[a][i]) return n[a][i];
                var o = 0;
                return e[a - 1] !== t[i - 1] && (o = 1), o = Math.min(r(a - 1, i) + 1, r(a, i - 1) + 1, r(a - 1, i - 1) + o), n[a][i] = o
            }(e.length, t.length)
        }

        function xa(e) {
            var t = wa[e] ? wa[e] : Object.keys(wa).map((function (t) {
                return {name: t, yb: Aa(e, t.slice(t.lastIndexOf(":") + 1))}
            })).sort((function (e, t) {
                return e.yb - t.yb
            })).slice(0, 5).filter((function (t) {
                return t.yb < e.length / 2
            })).reduce((function (e, t) {
                return e.concat(wa[t.name])
            }), []).slice(0, 5);
            return t.length ? t.map((function (e) {
                return '"Q{' + e.namespaceURI + "}" + e.localName + " (" + e.l.map((function (e) {
                    return 4 === e ? "..." : fe(e)
                })).join(", ") + ')"'
            })).reduce((function (e, t, n, r) {
                return 0 === n ? e + t : e + (n !== r.length - 1 ? ", " : " or ") + t
            }), "Did you mean ") + "?" : "No similar functions found."
        }

        function ba(e, t, n, r, a) {
            wa[e + ":" + t] || (wa[e + ":" + t] = []), wa[e + ":" + t].push({
                l: n,
                arity: n.length,
                m: a,
                I: !1,
                localName: t,
                namespaceURI: e,
                j: r
            })
        }

        function Ea(e, t, n) {
            var r = {};
            $n.call(this, new fr((r.external = 1, r)), [], {A: !0}, !1, n), this.o = t, this.v = e, this.h = null
        }

        function Ba(e, t, n) {
            return (e << 20) + (t << 12) + (n.charCodeAt(0) << 8) + n.charCodeAt(1)
        }

        v(Ea, $n), Ea.prototype.evaluate = function () {
            var e = new ge({
                l: this.h.l,
                I: this.h.I,
                arity: this.o,
                localName: this.h.localName,
                namespaceURI: this.h.namespaceURI,
                j: this.h.j,
                value: this.h.m
            });
            return se.s(e)
        }, Ea.prototype.P = function (e) {
            var t = this.v.namespaceURI, n = this.v.localName, r = this.v.prefix;
            if (!t) {
                var a = e.Qa({localName: n, prefix: r}, this.o);
                if (!a) throw Error("XPST0017: The function " + (r ? r + ":" : "") + n + " with arity " + this.o + " could not be resolved. " + xa(n));
                t = a.namespaceURI, n = a.localName
            }
            if (this.h = e.Aa(t, n, this.o) || null, !this.h) throw e = this.v, Error("XPST0017: Function " + (e.namespaceURI ? "Q{" + e.namespaceURI + "}" : e.prefix ? e.prefix + ":" : "") + e.localName + " with arity of " + this.o + " not registered. " + xa(n));
            $n.prototype.P.call(this, e)
        };
        var Na = {},
            Ca = (Na[Ba(2, 2, "idivOp")] = 5, Na[Ba(16, 16, "addOp")] = 16, Na[Ba(16, 16, "subtractOp")] = 16, Na[Ba(16, 16, "divOp")] = 4, Na[Ba(16, 2, "multiplyOp")] = 16, Na[Ba(16, 2, "divOp")] = 16, Na[Ba(2, 16, "multiplyOp")] = 16, Na[Ba(17, 17, "addOp")] = 17, Na[Ba(17, 17, "subtractOp")] = 17, Na[Ba(17, 17, "divOp")] = 4, Na[Ba(17, 2, "multiplyOp")] = 17, Na[Ba(17, 2, "divOp")] = 17, Na[Ba(2, 17, "multiplyOp")] = 17, Na[Ba(9, 9, "subtractOp")] = 17, Na[Ba(7, 7, "subtractOp")] = 17, Na[Ba(8, 8, "subtractOp")] = 17, Na[Ba(9, 16, "addOp")] = 9, Na[Ba(9, 16, "subtractOp")] = 9, Na[Ba(9, 17, "addOp")] = 9, Na[Ba(9, 17, "subtractOp")] = 9, Na[Ba(7, 16, "addOp")] = 7, Na[Ba(7, 16, "subtractOp")] = 7, Na[Ba(7, 17, "addOp")] = 7, Na[Ba(7, 17, "subtractOp")] = 7, Na[Ba(8, 17, "addOp")] = 8, Na[Ba(8, 17, "subtractOp")] = 8, Na[Ba(9, 16, "addOp")] = 9, Na[Ba(9, 16, "subtractOp")] = 9, Na[Ba(9, 17, "addOp")] = 9, Na[Ba(9, 17, "subtractOp")] = 9, Na[Ba(7, 17, "addOp")] = 7, Na[Ba(7, 17, "subtractOp")] = 7, Na[Ba(7, 16, "addOp")] = 7, Na[Ba(7, 16, "subtractOp")] = 7, Na[Ba(8, 17, "addOp")] = 8, Na[Ba(8, 17, "subtractOp")] = 8, Na),
            Ta = {}, Ia = (Ta[Ba(2, 2, "addOp")] = function (e, t) {
                return e + t
            }, Ta[Ba(2, 2, "subtractOp")] = function (e, t) {
                return e - t
            }, Ta[Ba(2, 2, "multiplyOp")] = function (e, t) {
                return e * t
            }, Ta[Ba(2, 2, "divOp")] = function (e, t) {
                return e / t
            }, Ta[Ba(2, 2, "modOp")] = function (e, t) {
                return e % t
            }, Ta[Ba(2, 2, "idivOp")] = function (e, t) {
                return Math.trunc(e / t)
            }, Ta[Ba(16, 16, "addOp")] = function (e, t) {
                return new Ft(e.ha + t.ha)
            }, Ta[Ba(16, 16, "subtractOp")] = function (e, t) {
                return new Ft(e.ha - t.ha)
            }, Ta[Ba(16, 16, "divOp")] = function (e, t) {
                return e.ha / t.ha
            }, Ta[Ba(16, 2, "multiplyOp")] = jt, Ta[Ba(16, 2, "divOp")] = function (e, t) {
                if (isNaN(t)) throw Error("FOCA0005: Cannot divide xs:yearMonthDuration by NaN");
                if ((e = Math.round(e.ha / t)) > Number.MAX_SAFE_INTEGER || !Number.isFinite(e)) throw Error("FODT0002: Value overflow while dividing xs:yearMonthDuration");
                return new Ft(e < Number.MIN_SAFE_INTEGER || 0 === e ? 0 : e)
            }, Ta[Ba(2, 16, "multiplyOp")] = function (e, t) {
                return jt(t, e)
            }, Ta[Ba(17, 17, "addOp")] = function (e, t) {
                return new Qe(e.ea + t.ea)
            }, Ta[Ba(17, 17, "subtractOp")] = function (e, t) {
                return new Qe(e.ea - t.ea)
            }, Ta[Ba(17, 17, "divOp")] = function (e, t) {
                if (0 === t.ea) throw Error("FOAR0001: Division by 0");
                return e.ea / t.ea
            }, Ta[Ba(17, 2, "multiplyOp")] = We, Ta[Ba(17, 2, "divOp")] = function (e, t) {
                if (isNaN(t)) throw Error("FOCA0005: Cannot divide xs:dayTimeDuration by NaN");
                if ((e = e.ea / t) > Number.MAX_SAFE_INTEGER || !Number.isFinite(e)) throw Error("FODT0002: Value overflow while dividing xs:dayTimeDuration");
                return new Qe(e < Number.MIN_SAFE_INTEGER || Object.is(-0, e) ? 0 : e)
            }, Ta[Ba(2, 17, "multiplyOp")] = function (e, t) {
                return We(t, e)
            }, Ta[Ba(9, 9, "subtractOp")] = ct, Ta[Ba(7, 7, "subtractOp")] = ct, Ta[Ba(8, 8, "subtractOp")] = ct, Ta[Ba(9, 16, "addOp")] = ht, Ta[Ba(9, 16, "subtractOp")] = pt, Ta[Ba(9, 17, "addOp")] = ht, Ta[Ba(9, 17, "subtractOp")] = pt, Ta[Ba(7, 16, "addOp")] = ht, Ta[Ba(7, 16, "subtractOp")] = pt, Ta[Ba(7, 17, "addOp")] = ht, Ta[Ba(7, 17, "subtractOp")] = pt, Ta[Ba(8, 17, "addOp")] = ht, Ta[Ba(8, 17, "subtractOp")] = pt, Ta[Ba(9, 16, "addOp")] = ht, Ta[Ba(9, 16, "subtractOp")] = pt, Ta[Ba(9, 17, "addOp")] = ht, Ta[Ba(9, 17, "subtractOp")] = pt, Ta[Ba(7, 17, "addOp")] = ht, Ta[Ba(7, 17, "subtractOp")] = pt, Ta[Ba(7, 16, "addOp")] = ht, Ta[Ba(7, 16, "subtractOp")] = pt, Ta[Ba(8, 17, "addOp")] = ht, Ta[Ba(8, 17, "subtractOp")] = pt, Ta);

        function Oa(e, t) {
            return W(e, 5) && W(t, 5) ? 5 : W(e, 4) && W(t, 4) ? 4 : W(e, 6) && W(t, 6) ? 6 : 3
        }

        var Sa = [2, 16, 17, 9, 7, 8];

        function Ra(e, t, n) {
            function r(e, t) {
                return {W: a ? a(e) : e, X: i ? i(t) : t}
            }

            var a = null, i = null;
            W(t, 19) && (a = function (e) {
                return Jt(e, 3)
            }, t = 3), W(n, 19) && (i = function (e) {
                return Jt(e, 3)
            }, n = 3);
            var o = Sa.filter((function (e) {
                return W(t, e)
            })), s = Sa.filter((function (e) {
                return W(n, e)
            }));
            if (o.includes(2) && s.includes(2)) {
                var l = Ia[Ba(2, 2, e)], c = Ca[Ba(2, 2, e)];
                return c || (c = Oa(t, n)), "divOp" === e && 5 === c && (c = 4), "idivOp" === e ? Da(r, l)[0] : function (e, t) {
                    return e = r(e, t), q(l(e.W.value, e.X.value), c)
                }
            }
            for (var h = (o = u(o)).next(); !h.done; h = o.next()) {
                h = h.value;
                for (var p = {}, f = u(s), d = f.next(); !d.done; p = {
                    ib: p.ib,
                    lb: p.lb
                }, d = f.next()) if (d = d.value, p.ib = Ia[Ba(h, d, e)], p.lb = Ca[Ba(h, d, e)], p.ib && void 0 !== p.lb) return function (e) {
                    return function (t, n) {
                        return t = r(t, n), q(e.ib(t.W.value, t.X.value), e.lb)
                    }
                }(p)
            }
        }

        function Da(e, t) {
            return [function (n, r) {
                if (n = (r = e(n, r)).W, 0 === (r = r.X).value) throw Error("FOAR0001: Divisor of idiv operator cannot be (-)0");
                if (Number.isNaN(n.value) || Number.isNaN(r.value) || !Number.isFinite(n.value)) throw Error("FOAR0002: One of the operands of idiv is NaN or the first operand is (-)INF");
                return Number.isFinite(n.value) && !Number.isFinite(r.value) ? q(0, 5) : q(t(n.value, r.value), 5)
            }, 5]
        }

        var Ga = Object.create(null);

        function Ma(e, t, n, r, a) {
            $n.call(this, t.K.add(n.K), [t, n], {A: !1}, !1, r), this.v = t, this.C = n, this.h = e, this.o = a
        }

        v(Ma, $n), Ma.prototype.evaluate = function (e, t) {
            var n = this;
            return St(er(this.v, e, t), t).M((function (r) {
                return 0 === r.length ? se.empty() : St(er(n.C, e, t), t).M((function (e) {
                    if (0 === e.length) return se.empty();
                    if (1 < r.length || 1 < e.length) throw Error('XPTY0004: the operands of the "' + n.h + '" operator should be empty or singleton.');
                    var t = r[0];
                    if (e = e[0], n.o && n.type) return se.s(n.o(t, e));
                    var a = t.type, i = e.type, o = n.h, s = a + "~" + i + "~" + o, u = Ga[s];
                    if (u || (u = Ga[s] = Ra(o, a, i)), !(a = u)) throw Error("XPTY0004: " + n.h + " not available for types " + he[t.type] + " and " + he[e.type]);
                    return se.s(a(t, e))
                }))
            }))
        };
        var Ua = {},
            Fa = (Ua[5] = 5, Ua[27] = 5, Ua[28] = 5, Ua[31] = 5, Ua[32] = 5, Ua[33] = 5, Ua[34] = 5, Ua[30] = 5, Ua[36] = 5, Ua[35] = 5, Ua[38] = 5, Ua[37] = 5, Ua[29] = 5, Ua[4] = 4, Ua[6] = 6, Ua[3] = 3, Ua);

        function Pa(e, t, n) {
            $n.call(this, t.K, [t], {A: !1}, !1, n), this.o = t, this.h = e
        }

        function Ha(e, t) {
            $n.call(this, e.reduce((function (e, t) {
                return e.add(t.K)
            }), new fr({})), e, {
                A: e.every((function (e) {
                    return e.A
                }))
            }, !1, t), this.h = e
        }

        function ja(e, t) {
            var n, r = e.reduce((function (e, t) {
                return 0 < dr(e, t.K) ? e : t.K
            }), new fr({}));
            for ($n.call(this, r, e, {
                A: e.every((function (e) {
                    return e.A
                }))
            }, !1, t), t = 0; t < e.length && (void 0 === n && (n = e[t].Y()), null !== n); ++t) if (n !== e[t].Y()) {
                n = null;
                break
            }
            this.o = n, this.h = e
        }

        function Xa(e, t, n) {
            function r(e, t) {
                return {W: o ? o(e) : e, X: s ? s(t) : t}
            }

            function a(e) {
                return W(t, e) && W(n, e)
            }

            function i(e) {
                return 0 < e.filter((function (e) {
                    return W(t, e)
                })).length && 0 < e.filter((function (e) {
                    return W(n, e)
                })).length
            }

            var o = null, s = null;
            if (W(t, 19) && W(n, 19) ? t = n = 1 : W(t, 19) ? (o = function (e) {
                return Jt(e, n)
            }, t = n) : W(n, 19) && (s = function (e) {
                return Jt(e, t)
            }, n = t), W(t, 23) && W(n, 23)) return function (e, t) {
                if ("eqOp" === e) return function (e, n) {
                    return e = (n = t(e, n)).W, n = n.X, e.value.namespaceURI === n.value.namespaceURI && e.value.localName === n.value.localName
                };
                if ("neOp" === e) return function (e, n) {
                    return e = (n = t(e, n)).W, n = n.X, e.value.namespaceURI !== n.value.namespaceURI || e.value.localName !== n.value.localName
                };
                throw Error('XPTY0004: Only the "eq" and "ne" comparison is defined for xs:QName')
            }(e, r);
            if (a(0) || i([1, 47, 61]) || i([2, 47, 61]) || a(20) || a(22) || a(21) || i([1, 20])) {
                var u = function (e, t) {
                    switch (e) {
                        case"eqOp":
                            return function (e, n) {
                                return (e = t(e, n)).W.value === e.X.value
                            };
                        case"neOp":
                            return function (e, n) {
                                return (e = t(e, n)).W.value !== e.X.value
                            };
                        case"ltOp":
                            return function (e, n) {
                                return (e = t(e, n)).W.value < e.X.value
                            };
                        case"leOp":
                            return function (e, n) {
                                return (e = t(e, n)).W.value <= e.X.value
                            };
                        case"gtOp":
                            return function (e, n) {
                                return (e = t(e, n)).W.value > e.X.value
                            };
                        case"geOp":
                            return function (e, n) {
                                return (e = t(e, n)).W.value >= e.X.value
                            }
                    }
                }(e, r);
                if (void 0 !== u) return u
            }
            if (a(16) && void 0 !== (u = function (e, t) {
                switch (e) {
                    case"ltOp":
                        return function (e, n) {
                            return (e = t(e, n)).W.value.ha < e.X.value.ha
                        };
                    case"leOp":
                        return function (e, n) {
                            return e = (n = t(e, n)).W, n = n.X, Ve(e.value, n.value) || e.value.ha < n.value.ha
                        };
                    case"gtOp":
                        return function (e, n) {
                            return (e = t(e, n)).W.value.ha > e.X.value.ha
                        };
                    case"geOp":
                        return function (e, n) {
                            return e = (n = t(e, n)).W, n = n.X, Ve(e.value, n.value) || e.value.ha > n.value.ha
                        }
                }
            }(e, r)) || a(17) && void 0 !== (u = function (e, t) {
                switch (e) {
                    case"eqOp":
                        return function (e, n) {
                            return Ve((e = t(e, n)).W.value, e.X.value)
                        };
                    case"ltOp":
                        return function (e, n) {
                            return (e = t(e, n)).W.value.ea < e.X.value.ea
                        };
                    case"leOp":
                        return function (e, n) {
                            return e = (n = t(e, n)).W, n = n.X, Ve(e.value, n.value) || e.value.ea < n.value.ea
                        };
                    case"gtOp":
                        return function (e, n) {
                            return (e = t(e, n)).W.value.ea > e.X.value.ea
                        };
                    case"geOp":
                        return function (e, n) {
                            return e = (n = t(e, n)).W, n = n.X, Ve(e.value, n.value) || e.value.ea > n.value.ea
                        }
                }
            }(e, r)) || a(18) && void 0 !== (u = function (e, t) {
                switch (e) {
                    case"eqOp":
                        return function (e, n) {
                            return Ve((e = t(e, n)).W.value, e.X.value)
                        };
                    case"neOp":
                        return function (e, n) {
                            return !Ve((e = t(e, n)).W.value, e.X.value)
                        }
                }
            }(e, r))) return u;
            if ((a(9) || a(7) || a(8)) && void 0 !== (u = function (e, t) {
                switch (e) {
                    case"eqOp":
                        return function (e, n, r) {
                            return lt((e = t(e, n)).W.value, e.X.value, At(r))
                        };
                    case"neOp":
                        return function (e, n, r) {
                            return !lt((e = t(e, n)).W.value, e.X.value, At(r))
                        };
                    case"ltOp":
                        return function (e, n, r) {
                            return e = t(e, n), r = At(r), 0 > ut(e.W.value, e.X.value, r)
                        };
                    case"leOp":
                        return function (e, n, r) {
                            var a;
                            return e = (n = t(e, n)).W, n = n.X, (a = lt(e.value, n.value, At(r))) || (r = At(r), a = 0 > ut(e.value, n.value, r)), a
                        };
                    case"gtOp":
                        return function (e, n, r) {
                            return e = t(e, n), r = At(r), 0 < ut(e.W.value, e.X.value, r)
                        };
                    case"geOp":
                        return function (e, n, r) {
                            var a;
                            return e = (n = t(e, n)).W, n = n.X, (a = lt(e.value, n.value, At(r))) || (r = At(r), a = 0 < ut(e.value, n.value, r)), a
                        }
                }
            }(e, r))) return u;
            if ((a(11) || a(12) || a(13) || a(14) || a(15)) && void 0 !== (u = function (e, t) {
                switch (e) {
                    case"eqOp":
                        return function (e, n, r) {
                            return lt((e = t(e, n)).W.value, e.X.value, At(r))
                        };
                    case"neOp":
                        return function (e, n, r) {
                            return !lt((e = t(e, n)).W.value, e.X.value, At(r))
                        }
                }
            }(e, r))) return u;
            throw Error("XPTY0004: " + e + " not available for " + he[t] + " and " + he[n])
        }

        v(Pa, $n), Pa.prototype.evaluate = function (e, t) {
            var n = this;
            return St(er(this.o, e, t), t).M((function (e) {
                if (0 === e.length) return se.empty();
                var t = e[0];
                if (n.type) return e = "+" === n.h ? +t.value : -t.value, 0 === t.type && (e = Number.NaN), se.s(q(e, n.type.type));
                if (1 < e.length) throw Error("XPTY0004: The operand to a unary operator must be a sequence with a length less than one");
                return W(t.type, 19) ? (t = Jt(t, 3).value, se.s(q("+" === n.h ? t : -t, 3))) : W(t.type, 2) ? "+" === n.h ? se.s(t) : se.s(q(-1 * t.value, Fa[t.type])) : se.s(q(Number.NaN, 3))
            }))
        }, v(Ha, $n), Ha.prototype.evaluate = function (e, t) {
            var n = this, r = 0, a = null, i = !1, o = null;
            if (null !== e) {
                var s = e.O;
                null !== s && W(s.type, 53) && (o = we(s.value))
            }
            return se.create({
                next: function () {
                    if (!i) {
                        for (; r < n.h.length;) {
                            if (!a) {
                                var s = n.h[r];
                                if (null !== o && null !== s.Y() && !o.includes(s.Y())) return r++, i = !0, Z(Q);
                                a = er(s, e, t)
                            }
                            if (!1 === a.getEffectiveBooleanValue()) return i = !0, Z(Q);
                            a = null, r++
                        }
                        return i = !0, Z(V)
                    }
                    return z
                }
            })
        }, Ha.prototype.Y = function () {
            for (var e = 0, t = this.h.length; e < t; ++e) {
                var n = this.h[e].Y();
                if (n) return n
            }
            return null
        }, v(ja, $n), ja.prototype.evaluate = function (e, t) {
            var n = this, r = 0, a = null, i = !1, o = null;
            if (null !== e) {
                var s = e.O;
                null !== s && W(s.type, 53) && (o = we(s.value))
            }
            return se.create({
                next: function () {
                    if (!i) {
                        for (; r < n.h.length;) {
                            if (!a) {
                                var s = n.h[r];
                                if (null !== o && null !== s.Y() && !o.includes(s.Y())) {
                                    r++;
                                    continue
                                }
                                a = er(s, e, t)
                            }
                            if (!0 === a.getEffectiveBooleanValue()) return i = !0, Z(V);
                            a = null, r++
                        }
                        return i = !0, Z(Q)
                    }
                    return z
                }
            })
        }, ja.prototype.Y = function () {
            return this.o
        };
        var _a = Object.create(null);

        function La(e, t, n) {
            var r = t + "~" + n + "~" + e, a = _a[r];
            return a || (a = _a[r] = Xa(e, t, n)), a
        }

        function ka(e, t, n) {
            try {
                var r = La(e, t, n);
                return function (e, t, n) {
                    if (1 < e.ya() || 1 < t.ya()) throw Error("XPTY0004: Sequences to compare are not singleton.");
                    return r(e.first(), t.first(), n)
                }
            } catch (e) {
            }
        }

        var Ya = {},
            qa = (Ya.equalOp = "eqOp", Ya.notEqualOp = "neOp", Ya.lessThanOrEqualOp = "leOp", Ya.lessThanOp = "ltOp", Ya.greaterThanOrEqualOp = "geOp", Ya.greaterThanOp = "gtOp", Ya);

        function Va(e, t) {
            var n, r;
            return (W(e, 19) || W(t, 19)) && (W(e, 2) ? r = 3 : W(t, 2) ? n = 3 : W(e, 17) ? r = 17 : W(t, 17) ? n = 17 : W(e, 16) ? r = 16 : W(t, 16) ? n = 16 : W(e, 19) ? n = t : W(t, 19) && (r = e)), [n, r]
        }

        function Qa(e, t, n, r) {
            if (!W(n, 53) || !W(r, 53)) throw Error("XPTY0004: Sequences to compare are not nodes");
            switch (e) {
                case"isOp":
                    return function (e, t) {
                        return e !== t || 47 !== e && 53 !== e && 54 !== e && 55 !== e && 56 !== e && 57 !== e && 58 !== e ? function () {
                            return !1
                        } : function (e, t) {
                            return zt(e.first().value, t.first().value)
                        }
                    }(n, r);
                case"nodeBeforeOp":
                    return t ? function (e, n) {
                        return 0 > tn(t, e.first(), n.first())
                    } : void 0;
                case"nodeAfterOp":
                    return t ? function (e, n) {
                        return 0 < tn(t, e.first(), n.first())
                    } : void 0;
                default:
                    throw Error("Unexpected operator")
            }
        }

        function Ja(e, t, n, r, a) {
            switch ($n.call(this, t.K.add(n.K), [t, n], {A: !1}), this.C = t, this.N = n, e) {
                case"equalOp":
                case"notEqualOp":
                case"lessThanOrEqualOp":
                case"lessThanOp":
                case"greaterThanOrEqualOp":
                case"greaterThanOp":
                    if (this.h = "generalCompare", t = [59, 62, 46, 53], r && a && !t.includes(r.type) && !t.includes(a.type)) {
                        if (3 === r.g && 3 === a.g) r = ka(e, r.type, a.type); else {
                            n = qa[e];
                            var i = u(Va(r.type, a.type));
                            t = i.next().value, i = i.next().value, n = La(n, r.type, a.type), r = 0 === r.g && 0 === a.g ? function (e, t, n) {
                                return function (r, a, i) {
                                    return !r.F() && !a.F() && (r = r.first(), a = a.first(), e && (r = Jt(r, e)), t && (a = Jt(a, t)), n(r, a, i))
                                }
                            }(t, i, n) : function (e, t, n) {
                                return function (r, a, i) {
                                    return a.M((function (a) {
                                        return r.filter((function (r) {
                                            for (var o = 0, s = a.length; o < s; ++o) {
                                                var u = a[o];
                                                if (e && (r = Jt(r, e)), t && (u = Jt(u, t)), n(r, u, i)) return !0
                                            }
                                            return !1
                                        })).aa({
                                            default: function () {
                                                return se.$()
                                            }, empty: function () {
                                                return se.U()
                                            }
                                        })
                                    })).getEffectiveBooleanValue()
                                }
                            }(t, i, n)
                        }
                        this.o = r
                    }
                    break;
                case"eqOp":
                case"neOp":
                case"ltOp":
                case"leOp":
                case"gtOp":
                case"geOp":
                    this.h = "valueCompare", r && a && (this.o = ka(e, r.type, a.type));
                    break;
                default:
                    this.h = "nodeCompare", r && a && (this.o = Qa(e, void 0, r.type, a.type))
            }
            this.v = e
        }

        function Ka(e, t, n, r) {
            return n.M((function (n) {
                if (n.some((function (e) {
                    return !W(e.type, 53)
                }))) throw Error("XPTY0004: Sequences given to " + e + " should only contain nodes.");
                return "sorted" === r ? se.create(n) : "reverse-sorted" === r ? se.create(n.reverse()) : se.create(nn(t, n))
            }))
        }

        function za(e, t, n, r) {
            $n.call(this, 0 < dr(t.K, n.K) ? t.K : n.K, [t, n], {A: t.A && n.A}, !1, r), this.h = e, this.o = t, this.v = n
        }

        function Za(e, t) {
            cr.call(this, e.reduce((function (e, t) {
                return e.add(t.K)
            }), new fr({})), e, {
                T: "unsorted", A: e.every((function (e) {
                    return e.A
                }))
            }, t)
        }

        function Wa(e, t, n) {
            $n.call(this, new fr({}).add(e.K), [e, t], {A: e.A && t.A}, !1, n), this.h = e, this.o = t
        }

        function $a(e, t, n) {
            if ($n.call(this, e.K, [e], {A: !1}), this.h = de(t.prefix ? t.prefix + ":" + t.localName : t.localName), 46 === this.h || 45 === this.h || 44 === this.h) throw Error("XPST0080: Casting to xs:anyAtomicType, xs:anySimpleType or xs:NOTATION is not permitted.");
            if (t.namespaceURI) throw Error("Not implemented: castable as expressions with a namespace URI.");
            this.v = e, this.o = n
        }

        function ei(e, t, n) {
            if ($n.call(this, e.K, [e], {A: !1}), this.h = de(t.prefix ? t.prefix + ":" + t.localName : t.localName), 46 === this.h || 45 === this.h || 44 === this.h) throw Error("XPST0080: Casting to xs:anyAtomicType, xs:anySimpleType or xs:NOTATION is not permitted.");
            if (t.namespaceURI) throw Error("Not implemented: casting expressions with a namespace URI.");
            this.v = e, this.o = n
        }

        function ti(e, t) {
            var n = e.value, r = null, a = !1;
            return se.create({
                next: function () {
                    for (; !a;) {
                        if (!r) {
                            var e = n.next(0);
                            if (e.done) return a = !0, Z(V);
                            r = t(e.value)
                        }
                        if (e = r.getEffectiveBooleanValue(), r = null, !1 === e) return a = !0, Z(Q)
                    }
                    return z
                }
            })
        }

        function ni(e, t, n, r) {
            $n.call(this, e.K, [e], {A: !1}, !1, r), this.v = e, this.o = t, this.h = n
        }

        function ri(e, t) {
            return !(null === e || null === t || !W(e.type, 53) || !W(t.type, 53)) && zt(e.value, t.value)
        }

        function ai(e) {
            var t = e.next(0);
            if (t.done) return se.empty();
            var n = null, r = null;
            return se.create({
                next: function (a) {
                    if (t.done) return z;
                    n || (n = t.value.value);
                    do {
                        var i = n.next(a);
                        if (i.done) {
                            if ((t = e.next(0)).done) return i;
                            n = t.value.value
                        }
                    } while (i.done || ri(i.value, r));
                    return r = i.value, i
                }
            })
        }

        function ii(e, t) {
            var n = [];
            !function () {
                for (var e = t.next(0), r = {}; !e.done;) r.jb = e.value.value, (e = {
                    current: r.jb.next(0),
                    next: function (e) {
                        return function (t) {
                            return e.jb.next(t)
                        }
                    }(r)
                }).current.done || n.push(e), e = t.next(0), r = {jb: r.jb}
            }();
            var r = null, a = !1, i = {};
            return se.create((i[Symbol.iterator] = function () {
                return this
            }, i.next = function () {
                a || (a = !0, n.every((function (e) {
                    return W(e.current.value.type, 53)
                })) && n.sort((function (t, n) {
                    return tn(e, t.current.value, n.current.value)
                })));
                do {
                    if (!n.length) return z;
                    var t = n.shift(), i = t.current;
                    if (t.current = t.next(0), !W(i.value.type, 53)) return i;
                    if (!t.current.done) {
                        for (var o = 0, s = n.length - 1, u = 0; o <= s;) {
                            u = Math.floor((o + s) / 2);
                            var l = tn(e, t.current.value, n[u].current.value);
                            if (0 === l) {
                                o = u;
                                break
                            }
                            0 < l ? o = u + 1 : s = u - 1
                        }
                        n.splice(o, 0, t)
                    }
                } while (ri(i.value, r));
                return r = i.value, i
            }, i))
        }

        function oi(e, t) {
            var n = e.reduce((function (e, t) {
                return 0 < dr(e, t.K) ? e : t.K
            }), new fr({}));
            $n.call(this, n, e, {
                A: e.every((function (e) {
                    return e.A
                }))
            }, !1, t), this.h = e
        }

        function si(e) {
            return e.every((function (e) {
                return null === e || W(e.type, 5) || W(e.type, 4)
            })) || null !== e.map((function (e) {
                return e ? Rt(e.type) : null
            })).reduce((function (e, t) {
                return null === t || t === e ? e : null
            })) ? e : e.every((function (e) {
                return null === e || W(e.type, 1) || W(e.type, 20)
            })) ? e.map((function (e) {
                return e ? Jt(e, 1) : null
            })) : e.every((function (e) {
                return null === e || W(e.type, 4) || W(e.type, 6)
            })) ? e.map((function (e) {
                return e ? Jt(e, 6) : e
            })) : e.every((function (e) {
                return null === e || W(e.type, 4) || W(e.type, 6) || W(e.type, 3)
            })) ? e.map((function (e) {
                return e ? Jt(e, 3) : e
            })) : null
        }

        function ui(e) {
            return Error("XPTY0004: " + e)
        }

        function li(e, t) {
            return e = 2 === e.node.nodeType ? e.node.nodeName + '="' + Re(t, e) + '"' : e.node.outerHTML, Error("XQTY0024: The node " + e + " follows a node that is not an attribute node or a namespace node.")
        }

        function ci() {
            return Error("XQST0045: Functions and variables may not be declared in one of the reserved namespace URIs.")
        }

        function hi() {
            return Error("XQST0060: Functions declared in a module or as an external function must reside in a namespace.")
        }

        function pi() {
            return Error("XQST0070: The prefixes xml and xmlns may not be used in a namespace declaration or be bound to another namespaceURI.")
        }

        function fi(e) {
            return Error('XQDY0074: The value "' + e + '" of a name expressions cannot be converted to an expanded QName.')
        }

        function di(e) {
            return Error('XPST0081: The prefix "' + e + '" could not be resolved')
        }

        function mi(e, t) {
            var n = new fr({});
            fa.call(this, n, [t].concat(c(e.map((function (e) {
                return e.ia
            })))), {A: !1, Z: !1, T: "unsorted", subtree: !1}, t), this.v = e
        }

        function vi(e) {
            $n.call(this, e ? e.K : new fr({}), e ? [e] : [], {T: "sorted", subtree: !1, Z: !1, A: !1}), this.h = e
        }

        function gi(e) {
            $n.call(this, new fr({}), [], {T: "sorted"}, !1, e)
        }

        function yi(e, t) {
            var n = e.every((function (e) {
                return e.Z
            })), r = e.every((function (e) {
                return e.subtree
            }));
            $n.call(this, e.reduce((function (e, t) {
                return e.add(t.K)
            }), new fr({})), e, {A: !1, Z: n, T: t ? "sorted" : "unsorted", subtree: r}), this.h = e, this.o = t
        }

        function wi(e, t) {
            $n.call(this, e.K.add(t.K), [e, t], {A: e.A && t.A, Z: e.Z, T: e.B, subtree: e.subtree}), this.o = e, this.h = t
        }

        function Ai(e, t, n) {
            if (n = [n], W(e.type, 62)) if ("*" === t) n.push.apply(n, c(e.R.map((function (e) {
                return e()
            })))); else {
                if (!W(t.type, 5)) throw ui("The key specifier is not an integer.");
                var r = t.value;
                if (e.R.length < r || 0 >= r) throw Error("FOAY0001: Array index out of bounds");
                n.push(e.R[r - 1]())
            } else {
                if (!W(e.type, 61)) throw ui("The provided context item is not a map or an array.");
                "*" === t ? n.push.apply(n, c(e.h.map((function (e) {
                    return e.value()
                })))) : (e = e.h.find((function (e) {
                    return Le(e.key, t)
                }))) && n.push(e.value())
            }
            return Bt(n)
        }

        function xi(e, t, n, r, a) {
            return "*" === t ? Ai(e, t, n) : Bt([n, t = ue(t = er(t, r, a))().M((function (t) {
                return t.reduce((function (t, n) {
                    return Ai(e, n, t)
                }), new ee)
            }))])
        }

        function bi(e, t) {
            $n.call(this, e.K, [e].concat("*" === t ? [] : [t]), {
                A: e.A,
                T: e.B,
                subtree: e.subtree
            }), this.h = e, this.o = t
        }

        function Ei(e, t) {
            var n = {};
            $n.call(this, new fr((n.external = 1, n)), "*" === e ? [] : [e], {A: !1}, !1, t), this.h = e
        }

        function Bi(e, t, n, r) {
            var a = t.map((function (e) {
                return e.eb
            }));
            t = t.map((function (e) {
                return e.name
            }));
            var i = a.reduce((function (e, t) {
                return e.add(t.K)
            }), n.K);
            $n.call(this, i, a.concat(n), {A: !1}, !1, r), this.o = e, this.v = t, this.C = a, this.N = n, this.h = null
        }

        function Ni(e) {
            $n.call(this, e, [], {A: !1})
        }

        function Ci(e) {
            var t = {};
            Ni.call(this, new fr((t.nodeType = 1, t))), this.o = e
        }

        function Ti(e, t) {
            t = void 0 === t ? {kind: null} : t;
            var n = e.prefix, r = e.namespaceURI, a = {};
            "*" !== (e = e.localName) && (a.nodeName = 1), a.nodeType = 1, Ni.call(this, new fr(a)), this.o = e, this.C = r, this.v = n || (r ? null : ""), this.N = t.kind
        }

        function Ii(e) {
            var t = {};
            Ni.call(this, new fr((t.nodeName = 1, t))), this.o = e
        }

        function Oi(e) {
            Ni.call(this, new fr({})), this.o = e
        }

        function Si(e, t, n) {
            $n.call(this, new fr({}), [], {
                A: !1,
                T: "unsorted"
            }), this.o = n, this.v = t || void 0, this.C = e, this.h = null
        }

        function Ri(e, t) {
            var n = new fr({});
            fa.call(this, n, [e, t], {A: !1, Z: !1, T: "unsorted", subtree: !1}, t), this.v = e
        }

        function Di(e, t) {
            var n = t.h, r = t.o, a = t.B;
            switch (e.node.nodeType) {
                case 1:
                    var i = r.createElementNS(e.node.namespaceURI, e.node.nodeName);
                    for (n.getAllAttributes(e.node).forEach((function (e) {
                        return a.setAttributeNS(i, e.namespaceURI, e.nodeName, e.value)
                    })), e = (r = u(Se(n, e))).next(); !e.done; e = r.next()) e = Di(e.value, t), a.insertBefore(i, e.node, null);
                    return {node: i, G: null};
                case 2:
                    return (t = r.createAttributeNS(e.node.namespaceURI, e.node.nodeName)).value = Re(n, e), {
                        node: t,
                        G: null
                    };
                case 4:
                    return {node: r.createCDATASection(Re(n, e)), G: null};
                case 8:
                    return {node: r.createComment(Re(n, e)), G: null};
                case 9:
                    for (r = r.createDocument(), e = (n = u(Se(n, e))).next(); !e.done; e = n.next()) e = Di(e.value, t), a.insertBefore(r, e.node, null);
                    return {node: r, G: null};
                case 7:
                    return {node: r.createProcessingInstruction(e.node.target, Re(n, e)), G: null};
                case 3:
                    return {node: r.createTextNode(Re(n, e)), G: null}
            }
        }

        function Gi(e, t) {
            var n = t.B, r = t.o, a = t.h;
            if (!Ne(e.node)) return Di(e, t).node;
            switch (e.node.nodeType) {
                case 2:
                    return (r = r.createAttributeNS(e.node.namespaceURI, e.node.nodeName)).value = Re(a, e), r;
                case 8:
                    return r.createComment(Re(a, e));
                case 1:
                    var i = e.node.prefix, o = e.node.localName,
                        s = r.createElementNS(e.node.namespaceURI, i ? i + ":" + o : o);
                    return Se(a, e).forEach((function (e) {
                        e = Gi(e, t), n.insertBefore(s, e, null)
                    })), Ie(a, e).forEach((function (e) {
                        n.setAttributeNS(s, e.node.namespaceURI, e.node.nodeName, Re(a, e))
                    })), s.normalize(), s;
                case 7:
                    return r.createProcessingInstruction(e.node.target, Re(a, e));
                case 3:
                    return r.createTextNode(Re(a, e))
            }
        }

        function Mi(e, t, n) {
            var r = e.node;
            if (!(Ne(r) || n || e.G)) return r;
            n = t.C, e = function (e, t, n) {
                var r = e;
                for (e = Ue(n, r); null !== e;) {
                    if (2 === r.node.nodeType) t.push(r.node.nodeName); else {
                        var a = Se(n, e);
                        t.push(a.findIndex((function (e) {
                            return zt(e, r)
                        })))
                    }
                    e = Ue(n, r = e)
                }
                return r
            }(e, r = [], t.h);
            var a = n.get(e.node);
            return a || (a = {node: Gi(e, t), G: null}, n.set(e.node, a)), function (e, t, n) {
                for (var r = {}; 0 < t.length;) r.Xa = t.pop(), e = "string" == typeof r.Xa ? Ie(n, e).find(function (e) {
                    return function (t) {
                        return t.node.nodeName === e.Xa
                    }
                }(r)) : Se(n, e)[r.Xa], r = {Xa: r.Xa};
                return e.node
            }(a, r, t.h)
        }

        function Ui(e) {
            this.type = e
        }

        function Fi(e) {
            this.type = "delete", this.target = e
        }

        function Pi(e, t, n) {
            this.type = n, this.target = e, this.content = t
        }

        function Hi(e, t) {
            Pi.call(this, e, t, "insertAfter")
        }

        function ji(e, t) {
            this.type = "insertAttributes", this.target = e, this.content = t
        }

        function Xi(e, t) {
            Pi.call(this, e, t, "insertBefore")
        }

        function _i(e, t) {
            Pi.call(this, e, t, "insertIntoAsFirst")
        }

        function Li(e, t) {
            Pi.call(this, e, t, "insertIntoAsLast")
        }

        function ki(e, t) {
            Pi.call(this, e, t, "insertInto")
        }

        function Yi(e, t) {
            this.type = "rename", this.target = e, this.o = t.va ? t : new ve(t.prefix, t.namespaceURI, t.localName)
        }

        function qi(e, t) {
            this.type = "replaceElementContent", this.target = e, this.text = t
        }

        function Vi(e, t) {
            this.type = "replaceNode", this.target = e, this.o = t
        }

        function Qi(e, t) {
            this.type = "replaceValue", this.target = e, this.o = t
        }

        function Ji(e, t) {
            return new Vi(e, t)
        }

        function Ki(e) {
            sr.call(this, new fr({}), [e], {A: !1, T: "unsorted"}), this.h = e
        }

        function zi(e, t, n) {
            var r = [], a = [], i = !1;
            return e.forEach((function (e) {
                i = function e(t, n, r, a, i, o) {
                    var s = n.h;
                    return t.reduce((function e(t, n) {
                        return W(n.type, 62) ? (n.R.forEach((function (n) {
                            return n().S().forEach((function (n) {
                                return e(t, n)
                            }))
                        })), t) : (t.push(n), t)
                    }), []).forEach((function (t, u, l) {
                        if (W(t.type, 47)) {
                            if (i) throw o(t.value, s);
                            r.push(t.value.node)
                        } else if (W(t.type, 46) || W(t.type, 53) && 3 === t.value.node.nodeType) {
                            var c = W(t.type, 46) ? Jt(Ot(t, n).first(), 1).value : Re(s, t.value);
                            0 !== u && W(l[u - 1].type, 46) && W(t.type, 46) ? (a.push({
                                data: " " + c,
                                Pa: !0,
                                nodeType: 3
                            }), i = !0) : c && (a.push({data: "" + c, Pa: !0, nodeType: 3}), i = !0)
                        } else if (W(t.type, 55)) {
                            var h = [];
                            Se(s, t.value).forEach((function (e) {
                                return h.push(Xe(e))
                            })), i = e(h, n, r, a, i, o)
                        } else {
                            if (!W(t.type, 53)) {
                                if (W(t.type, 60)) throw Tt(t.type);
                                throw Error("Atomizing " + t.type + " is not implemented.")
                            }
                            a.push(t.value.node), i = !0
                        }
                    })), i
                }(e, t, r, a, i, n)
            })), {attributes: r, Ua: a}
        }

        function Zi(e, t, n, r, a) {
            var i = [];
            switch (e) {
                case 4:
                    r.length && i.push(new ji(t, r)), a.length && i.push(new _i(t, a));
                    break;
                case 5:
                    r.length && i.push(new ji(t, r)), a.length && i.push(new Li(t, a));
                    break;
                case 3:
                    r.length && i.push(new ji(t, r)), a.length && i.push(new ki(t, a));
                    break;
                case 2:
                    r.length && i.push(new ji(n, r)), a.length && i.push(new Xi(t, a));
                    break;
                case 1:
                    r.length && i.push(new ji(n, r)), a.length && i.push(new Hi(t, a))
            }
            return i
        }

        function Wi(e, t, n) {
            sr.call(this, new fr({}), [e, n], {A: !1, T: "unsorted"}), this.C = e, this.h = t, this.v = n
        }

        function $i() {
            return Ct("Casting not supported from given type to a single xs:string or xs:untypedAtomic or any of its derived types.")
        }

        v(Ja, $n), Ja.prototype.evaluate = function (e, t) {
            var n = this, r = er(this.C, e, t), a = er(this.N, e, t);
            if (this.o) {
                if ("nodeCompare" === this.h) return r.F() || a.F() ? se.empty() : this.o(r, a, e) ? se.$() : se.U();
                var i = St(r, t), o = St(a, t);
                return i.F() || o.F() ? "valueCompare" === this.h ? se.empty() : se.U() : this.o(i, o, e) ? se.$() : se.U()
            }
            return r.aa({
                empty: function () {
                    return "valueCompare" === n.h || "nodeCompare" === n.h ? se.empty() : se.U()
                }, default: function () {
                    return a.aa({
                        empty: function () {
                            return "valueCompare" === n.h || "nodeCompare" === n.h ? se.empty() : se.U()
                        }, default: function () {
                            if ("nodeCompare" === n.h) return r.aa({
                                default: function () {
                                    throw Error("XPTY0004: Sequences to compare are not singleton")
                                }, s: function () {
                                    return function (e, t, n, r, a) {
                                        return n.aa({
                                            default: function () {
                                                throw Error("XPTY0004: Sequences to compare are not singleton")
                                            }, s: function () {
                                                return _e([t, n], (function (i) {
                                                    var o = u(i);
                                                    return i = o.next().value, o = o.next().value, Qa(e.v, r.h, i.type, o.type)(t, n, a) ? se.$() : se.U()
                                                }))
                                            }
                                        })
                                    }(n, r, a, t, e)
                                }
                            });
                            var i = St(r, t), o = St(a, t);
                            return "valueCompare" === n.h ? i.aa({
                                s: function () {
                                    return o.aa({
                                        s: function () {
                                            return i.M((function (t) {
                                                var r = u(t).next().value;
                                                return o.M((function (t) {
                                                    return t = u(t).next().value, La(n.v, r.type, t.type)(r, t, e) ? se.$() : se.U()
                                                }))
                                            }))
                                        }, default: function () {
                                            throw Error("XPTY0004: Sequences to compare are not singleton.")
                                        }
                                    })
                                }, default: function () {
                                    throw Error("XPTY0004: Sequences to compare are not singleton.")
                                }
                            }) : function (e, t, n, r) {
                                return e = qa[e], n.M((function (n) {
                                    return t.filter((function (t) {
                                        for (var a = 0, i = n.length; a < i; ++a) {
                                            var o = n[a], s = u(Va(t.type, o.type)), l = s.next().value;
                                            if (s = s.next().value, l ? t = Jt(t, l) : s && (o = Jt(o, s)), La(e, t.type, o.type)(t, o, r)) return !0
                                        }
                                        return !1
                                    })).aa({
                                        default: function () {
                                            return se.$()
                                        }, empty: function () {
                                            return se.U()
                                        }
                                    })
                                }))
                            }(n.v, i, o, e)
                        }
                    })
                }
            })
        }, v(za, $n), za.prototype.evaluate = function (e, t) {
            var n = this, r = Ka(this.h, t.h, er(this.o, e, t), this.o.B);
            e = Ka(this.h, t.h, er(this.v, e, t), this.v.B);
            var a = r.value, i = e.value, o = null, s = null, u = !1, l = !1;
            return se.create({
                next: function () {
                    if (u) return z;
                    for (; !l;) {
                        if (!o) {
                            var e = a.next(0);
                            if (e.done) return u = !0, z;
                            o = e.value
                        }
                        if (!s) {
                            if ((e = i.next(0)).done) {
                                l = !0;
                                break
                            }
                            s = e.value
                        }
                        if (zt(o.value, s.value)) {
                            if (e = Z(o), s = o = null, "intersectOp" === n.h) return e
                        } else if (0 > tn(t.h, o, s)) {
                            if (e = Z(o), o = null, "exceptOp" === n.h) return e
                        } else s = null
                    }
                    return "exceptOp" === n.h ? null !== o ? (e = Z(o), o = null, e) : a.next(0) : (u = !0, z)
                }
            })
        }, v(Za, cr), Za.prototype.v = function (e, t, n) {
            return n.length ? Bt(n.map((function (t) {
                return t(e)
            }))) : se.empty()
        }, v(Wa, $n), Wa.prototype.evaluate = function (e, t) {
            var n = this, r = yt(e, er(this.h, e, t)), a = null, i = null, o = !1;
            return se.create({
                next: function (e) {
                    for (; !o;) {
                        if (!a && (a = r.next(e)).done) return o = !0, z;
                        i || (i = er(n.o, a.value, t));
                        var s = i.value.next(e);
                        if (!s.done) return s;
                        a = i = null
                    }
                }
            })
        }, v($a, $n), $a.prototype.evaluate = function (e, t) {
            var n = this, r = St(er(this.v, e, t), t);
            return r.aa({
                empty: function () {
                    return n.o ? se.$() : se.U()
                }, s: function () {
                    return r.map((function (e) {
                        return Qt(e, n.h).u ? V : Q
                    }))
                }, multiple: function () {
                    return se.U()
                }
            })
        }, v(ei, $n), ei.prototype.evaluate = function (e, t) {
            var n = this, r = St(er(this.v, e, t), t);
            return r.aa({
                empty: function () {
                    if (!n.o) throw Error("XPTY0004: Sequence to cast is empty while target type is singleton.");
                    return se.empty()
                }, s: function () {
                    return r.map((function (e) {
                        return Jt(e, n.h)
                    }))
                }, multiple: function () {
                    throw Error("XPTY0004: Sequence to cast is not singleton or empty.")
                }
            })
        }, v(ni, $n), ni.prototype.evaluate = function (e, t) {
            var n = this, r = er(this.v, e, t);
            return r.aa({
                empty: function () {
                    return "?" === n.h || "*" === n.h ? se.$() : se.U()
                }, multiple: function () {
                    return "+" === n.h || "*" === n.h ? ti(r, (function (r) {
                        var a = se.s(r);
                        return r = xt(e, 0, r, a), er(n.o, r, t)
                    })) : se.U()
                }, s: function () {
                    return ti(r, (function (r) {
                        var a = se.s(r);
                        return r = xt(e, 0, r, a), er(n.o, r, t)
                    }))
                }
            })
        }, v(oi, $n), oi.prototype.evaluate = function (e, t) {
            var n = this;
            if (this.h.every((function (e) {
                return "sorted" === e.B
            }))) {
                var r = 0;
                return ii(t.h, {
                    next: function () {
                        return r >= n.h.length ? z : Z(er(n.h[r++], e, t))
                    }
                }).map((function (e) {
                    if (!W(e.type, 53)) throw Error("XPTY0004: The sequences to union are not of type node()*");
                    return e
                }))
            }
            return Bt(this.h.map((function (n) {
                return er(n, e, t)
            }))).M((function (e) {
                if (e.some((function (e) {
                    return !W(e.type, 53)
                }))) throw Error("XPTY0004: The sequences to union are not of type node()*");
                return e = nn(t.h, e), se.create(e)
            }))
        }, v(mi, fa), mi.prototype.C = function (e, t, n, r) {
            if (this.v[1]) throw Error("More than one order spec is not supported for the order by clause.");
            var a, i, o = [], s = !1, l = null, c = this.v[0];
            return se.create({
                next: function () {
                    if (!s) {
                        for (var h = t.next(0); !h.done;) o.push(h.value), h = t.next(0);
                        if ((h = o.map((function (e) {
                            return c.ia.evaluate(e, n)
                        })).map((function (e) {
                            return St(e, n)
                        }))).find((function (e) {
                            return !e.F() && !e.za()
                        }))) throw ui("Order by only accepts empty or singleton sequences");
                        if (function (e) {
                            return (e = e.find((function (e) {
                                return !!e
                            }))) ? Rt(e.type) : null
                        }(a = (a = h.map((function (e) {
                            return e.first()
                        }))).map((function (e) {
                            return null === e ? e : W(19, e.type) ? Jt(e, 1) : e
                        }))) && !(a = si(a))) throw ui("Could not cast values");
                        h = a.length, i = a.map((function (e, t) {
                            return t
                        }));
                        for (var p = 0; p < h; p++) if (p + 1 !== h) for (var f = p; 0 <= f; f--) {
                            var d = f, m = f + 1;
                            if (m !== h) {
                                var v = a[i[d]], g = a[i[m]];
                                if (null !== g || null !== v) {
                                    if (c.mc) {
                                        if (null === v) continue;
                                        if (null === g && null !== v) {
                                            v = u([i[m], i[d]]), i[d] = v.next().value, i[m] = v.next().value;
                                            continue
                                        }
                                        if (isNaN(g.value) && null !== v && !isNaN(v.value)) {
                                            v = u([i[m], i[d]]), i[d] = v.next().value, i[m] = v.next().value;
                                            continue
                                        }
                                    } else {
                                        if (null === g) continue;
                                        if (null === v && null !== g) {
                                            v = u([i[m], i[d]]), i[d] = v.next().value, i[m] = v.next().value;
                                            continue
                                        }
                                        if (isNaN(v.value) && null !== g && !isNaN(g.value)) {
                                            v = u([i[m], i[d]]), i[d] = v.next().value, i[m] = v.next().value;
                                            continue
                                        }
                                    }
                                    La("gtOp", v.type, g.type)(v, g, e) && (v = u([i[m], i[d]]), i[d] = v.next().value, i[m] = v.next().value)
                                }
                            }
                        }
                        var y = c.Ib ? 0 : a.length - 1;
                        l = r({
                            next: function () {
                                return c.Ib ? y >= a.length ? z : Z(o[i[y++]]) : 0 > y ? z : Z(o[i[y--]])
                            }
                        }).value, s = !0
                    }
                    return l.next(0)
                }
            })
        }, v(vi, $n), vi.prototype.evaluate = function (e, t) {
            if (null === e.O) throw Error("XPDY0002: context is absent, it needs to be present to use paths.");
            for (var n = t.h, r = e.O.value; 9 !== r.node.nodeType;) if (null === (r = Ue(n, r))) throw Error("XPDY0050: the root node of the context node is not a document node.");
            return n = se.s(Xe(r)), this.h ? er(this.h, xt(e, 0, n.first(), n), t) : n
        }, v(gi, $n), gi.prototype.evaluate = function (e) {
            if (null === e.O) throw Error('XPDY0002: context is absent, it needs to be present to use the "." operator');
            return se.s(e.O)
        }, v(yi, $n), yi.prototype.evaluate = function (e, t) {
            var n = this, r = !0;
            return this.h.reduce((function (a, i, o) {
                var s = null === a ? Kt(e) : yt(e, a);
                if (a = {
                    next: function (e) {
                        if ((e = s.next(e)).done) return z;
                        if (null !== e.value.O && !W(e.value.O.type, 53) && 0 < o) throw Error("XPTY0019: The result of E1 in a path expression E1/E2 should not evaluate to a sequence of nodes.");
                        return Z(er(i, e.value, t))
                    }
                }, n.o) switch (i.B) {
                    case"reverse-sorted":
                        var u = a;
                        a = {
                            next: function (e) {
                                return (e = u.next(e)).done ? e : Z(e.value.M((function (e) {
                                    return se.create(e.reverse())
                                })))
                            }
                        };
                    case"sorted":
                        if (i.subtree && r) {
                            var l = ai(a);
                            break
                        }
                        l = ii(t.h, a);
                        break;
                    case"unsorted":
                        return ai(a).M((function (e) {
                            return se.create(function (e, t) {
                                var n = !1, r = !1;
                                if (t.forEach((function (e) {
                                    W(e.type, 53) ? n = !0 : r = !0
                                })), r && n) throw Error("XPTY0018: The path operator should either return nodes or non-nodes. Mixed sequences are not allowed.");
                                return n ? nn(e, t) : t
                            }(t.h, e))
                        }))
                } else l = ai(a);
                return r = r && i.Z, l
            }), null)
        }, yi.prototype.Y = function () {
            return this.h[0].Y()
        }, v(wi, $n), wi.prototype.evaluate = function (e, t) {
            var n = this, r = er(this.o, e, t);
            if (this.h.A) {
                var a = er(this.h, e, t);
                if (a.F()) return a;
                var i = a.first();
                if (W(i.type, 2)) {
                    var o = i.value;
                    if (!Number.isInteger(o)) return se.empty();
                    var s = r.value, u = !1;
                    return se.create({
                        next: function () {
                            if (!u) {
                                for (var e = s.next(0); !e.done; e = s.next(0)) if (1 == o--) return u = !0, e;
                                u = !0
                            }
                            return z
                        }
                    })
                }
                return a.getEffectiveBooleanValue() ? r : se.empty()
            }
            var l = r.value, c = null, h = 0, p = null;
            return se.create({
                next: function (a) {
                    for (var i = !1; (!c || !c.done) && (c || (c = l.next(i ? 0 : a), i = !0), !c.done);) {
                        p || (p = er(n.h, xt(e, h, c.value, r), t));
                        var o = p.first();
                        o = null !== o && (W(o.type, 2) ? o.value === h + 1 : p.getEffectiveBooleanValue()), p = null;
                        var s = c.value;
                        if (c = null, h++, o) return Z(s)
                    }
                    return c
                }
            })
        }, wi.prototype.Y = function () {
            return this.o.Y()
        }, v(bi, $n), bi.prototype.evaluate = function (e, t) {
            var n = this;
            return er(this.h, e, t).M((function (r) {
                return r.reduce((function (r, a) {
                    return xi(a, n.o, r, e, t)
                }), new ee)
            }))
        }, bi.prototype.Y = function () {
            return this.h.Y()
        }, v(Ei, $n), Ei.prototype.evaluate = function (e, t) {
            return xi(e.O, this.h, new ee, e, t)
        }, v(Bi, $n), Bi.prototype.evaluate = function (e, t) {
            var n = this, r = e, a = this.h.map((function (a, i) {
                var o = er(n.C[i], r, t).S();
                return r = bt(e, ((i = {})[a] = function () {
                    return se.create(o)
                }, i)), o
            }));
            if (a.some((function (e) {
                return 0 === e.length
            }))) return "every" === this.o ? se.$() : se.U();
            var i = Array(a.length).fill(0);
            i[0] = -1;
            for (var o = !0; o;) {
                o = !1;
                for (var s = 0, u = i.length; s < u; ++s) {
                    var l = a[s];
                    if (!(++i[s] > l.length - 1)) {
                        for (o = Object.create(null), s = {}, u = 0; u < i.length; s = {ub: s.ub}, u++) s.ub = a[u][i[u]], o[this.h[u]] = function (e) {
                            return function () {
                                return se.s(e.ub)
                            }
                        }(s);
                        if (o = bt(e, o), (o = er(this.N, o, t)).getEffectiveBooleanValue() && "some" === this.o) return se.$();
                        if (!o.getEffectiveBooleanValue() && "every" === this.o) return se.U();
                        o = !0;
                        break
                    }
                    i[s] = 0
                }
            }
            return "every" === this.o ? se.$() : se.U()
        }, Bi.prototype.P = function (e) {
            this.h = [];
            for (var t = 0, n = this.v.length; t < n; ++t) {
                this.C[t].P(e), Ho(e);
                var r = this.v[t], a = r.prefix ? e.ga(r.prefix) : null;
                r = Xo(e, a, r.localName), this.h[t] = r
            }
            for (this.N.P(e), t = 0, n = this.v.length; t < n; ++t) Lo(e)
        }, v(Ni, $n), Ni.prototype.evaluate = function (e) {
            return this.h(e.O) ? se.$() : se.U()
        }, v(Ci, Ni), Ci.prototype.h = function (e) {
            return !!W(e.type, 53) && (e = e.value.node.nodeType, 3 === this.o && 4 === e || this.o === e)
        }, Ci.prototype.Y = function () {
            return "type-" + this.o
        }, v(Ti, Ni), Ti.prototype.h = function (e) {
            var t = W(e.type, 54), n = W(e.type, 47);
            return !(!t && !n) && (e = e.value, !(null !== this.N && (1 === this.N && !t || 2 === this.N && !n)) && (null === this.v && "" !== this.C && "*" === this.o || ("*" === this.v ? "*" === this.o || this.o === e.node.localName : ("*" === this.o || this.o === e.node.localName) && (e.node.namespaceURI || null) === (("" === this.v ? t ? this.C : null : this.C) || null))))
        }, Ti.prototype.Y = function () {
            return "*" === this.o ? null === this.N ? "type-1-or-type-2" : "type-" + this.N : "name-" + this.o
        }, Ti.prototype.P = function (e) {
            if (null === this.C && "*" !== this.v && (this.C = e.ga(this.v || "") || null, !this.C && this.v)) throw Error("XPST0081: The prefix " + this.v + " could not be resolved.")
        }, v(Ii, Ni), Ii.prototype.h = function (e) {
            return W(e.type, 57) && e.value.node.target === this.o
        }, Ii.prototype.Y = function () {
            return "type-7"
        }, v(Oi, Ni), Oi.prototype.h = function (e) {
            return W(e.type, de(this.o.prefix ? this.o.prefix + ":" + this.o.localName : this.o.localName))
        }, v(Si, $n), Si.prototype.evaluate = function (e, t) {
            if (!e.ta[this.h]) {
                if (this.N) return this.N(e, t);
                throw Error("XQDY0054: The variable " + this.o + " is declared but not in scope.")
            }
            return e.ta[this.h]()
        }, Si.prototype.P = function (e) {
            if (this.C && (this.v = e.ga(this.C)), this.h = e.rb(this.v || void 0, this.o), !this.h) throw Error("XPST0008, The variable " + this.o + " is not in scope.");
            (e = e.Da[this.h]) && (this.N = e)
        }, v(Ri, fa), Ri.prototype.C = function (e, t, n, r) {
            var a = this, i = null, o = null;
            return r({
                next: function () {
                    for (; ;) {
                        if (!o) {
                            var e = t.next(0);
                            if (e.done) return z;
                            i = e.value, o = er(a.v, i, n)
                        }
                        e = o.getEffectiveBooleanValue();
                        var r = i;
                        if (o = i = null, e) return Z(r)
                    }
                }
            })
        }, v(Fi, Ui), Fi.prototype.h = function (e) {
            var t = {};
            return t.type = this.type, t.target = Mi(this.target, e, !1), t
        }, v(Pi, Ui), Pi.prototype.h = function (e) {
            var t = {};
            return t.type = this.type, t.target = Mi(this.target, e, !1), t.content = this.content.map((function (t) {
                return Mi(t, e, !0)
            })), t
        }, v(Hi, Pi), v(ji, Ui), ji.prototype.h = function (e) {
            var t = {};
            return t.type = this.type, t.target = Mi(this.target, e, !1), t.content = this.content.map((function (t) {
                return Mi(t, e, !0)
            })), t
        }, v(Xi, Pi), v(_i, Pi), v(Li, Pi), v(ki, Pi), v(Yi, Ui), Yi.prototype.h = function (e) {
            var t = {}, n = {};
            return n.type = this.type, n.target = Mi(this.target, e, !1), n.newName = (t.prefix = this.o.prefix, t.namespaceURI = this.o.namespaceURI, t.localName = this.o.localName, t), n
        }, v(qi, Ui), qi.prototype.h = function (e) {
            var t = {};
            return t.type = this.type, t.target = Mi(this.target, e, !1), t.text = this.text ? Mi(this.text, e, !0) : null, t
        }, v(Vi, Ui), Vi.prototype.h = function (e) {
            var t = {};
            return t.type = this.type, t.target = Mi(this.target, e, !1), t.replacement = this.o.map((function (t) {
                return Mi(t, e, !0)
            })), t
        }, v(Qi, Ui), Qi.prototype.h = function (e) {
            var t = {};
            return t.type = this.type, t.target = Mi(this.target, e, !1), t["string-value"] = this.o, t
        }, v(Ki, sr), Ki.prototype.o = function (e, t) {
            var n, r, a = ur(this.h)(e, t), i = t.h;
            return {
                next: function () {
                    if (!n) {
                        var e = a.next(0);
                        if (e.value.H.some((function (e) {
                            return !W(e.type, 53)
                        }))) throw Error("XUTY0007: The target of a delete expression must be a sequence of zero or more nodes.");
                        n = e.value.H, r = e.value.fa
                    }
                    return Z({
                        fa: or((n = n.filter((function (e) {
                            return Ue(i, e.value)
                        }))).map((function (e) {
                            return new Fi(e.value)
                        })), r), H: []
                    })
                }
            }
        }, v(Wi, sr), Wi.prototype.o = function (e, t) {
            var n, r, a, i, o, s, u = this, l = ur(this.C)(e, t), c = ur(this.v)(e, t), h = t.h;
            return {
                next: function () {
                    if (!n) {
                        var e = l.next(0), p = zi([e.value.H], t, kn);
                        n = p.attributes.map((function (e) {
                            return {node: e, G: null}
                        })), r = p.Ua.map((function (e) {
                            return {node: e, G: null}
                        })), a = e.value.fa
                    }
                    if (!i) {
                        if (0 === (e = c.next(0)).value.H.length) throw Wn();
                        if (3 <= u.h) {
                            if (1 !== e.value.H.length) throw Yn();
                            if (!W(e.value.H[0].type, 54) && !W(e.value.H[0].type, 55)) throw Yn()
                        } else {
                            if (1 !== e.value.H.length) throw qn();
                            if (!(W(e.value.H[0].type, 54) || W(e.value.H[0].type, 56) || W(e.value.H[0].type, 58) || W(e.value.H[0].type, 57))) throw qn();
                            if (null === (s = Ue(h, e.value.H[0].value, null))) throw Error("XUDY0029: The target " + e.value.H[0].value.outerHTML + " for inserting a node before or after must have a parent.")
                        }
                        i = e.value.H[0], o = e.value.fa
                    }
                    if (n.length) {
                        if (3 <= u.h) {
                            if (!W(i.type, 54)) throw Error("XUTY0022: An insert expression specifies the insertion of an attribute node into a document node.")
                        } else if (1 !== s.node.nodeType) throw Error("XUDY0030: An insert expression specifies the insertion of an attribute node before or after a child of a document node.");
                        n.reduce((function (e, t) {
                            var n = t.node.prefix || "", r = t.node.prefix || "", a = t.node.namespaceURI,
                                o = r ? i.value.node.lookupNamespaceURI(r) : null;
                            if (o && o !== a) throw zn(a);
                            if ((r = e[r]) && a !== r) throw Zn(a);
                            return e[n] = t.node.namespaceURI, e
                        }), {})
                    }
                    return Z({H: [], fa: or(Zi(u.h, i.value, s || null, n, r), a, o)})
                }
            }
        };
        var eo = /([A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])/,
            to = new RegExp(eo.source + new RegExp("(" + eo.source + "|[-.0-9·̀-ͯ‿⁀])").source + "*", "g");

        function no(e) {
            return !!(e = e.match(to)) && 1 === e.length
        }

        function ro(e, t) {
            return St(t, e).aa({
                s: function (e) {
                    if (W((e = e.first()).type, 1) || W(e.type, 19)) {
                        if (!no(e.value)) throw Error('XQDY0041: The value "' + e.value + '" of a name expressions cannot be converted to a NCName.');
                        return se.s(e)
                    }
                    throw $i()
                }, default: function () {
                    throw $i()
                }
            }).value
        }

        function ao(e, t, n) {
            return St(n, t).aa({
                s: function (t) {
                    if (W((t = t.first()).type, 23)) return se.s(t);
                    if (W(t.type, 1) || W(t.type, 19)) {
                        if (1 === (t = t.value.split(":")).length) t = t[0]; else {
                            var n = t[0], r = e.ga(n);
                            t = t[1]
                        }
                        if (!no(t) || n && !no(n)) throw fi(n ? n + ":" + t : t);
                        if (n && !r) throw fi(n + ":" + t);
                        return se.s({type: 23, value: new ve(n, r, t)})
                    }
                    throw $i()
                }, default: function () {
                    throw $i()
                }
            }).value
        }

        function io(e, t) {
            sr.call(this, new fr({}), [e, t], {A: !1, T: "unsorted"}), this.v = e, this.C = t, this.h = void 0
        }

        function oo(e, t, n) {
            sr.call(this, new fr({}), [t, n], {A: !1, T: "unsorted"}), this.C = e, this.h = t, this.v = n
        }

        function so(e) {
            switch (e.type) {
                case"delete":
                    return new Fi({node: e.target, G: null});
                case"insertAfter":
                    return new Hi({node: e.target, G: null}, e.content.map((function (e) {
                        return {node: e, G: null}
                    })));
                case"insertBefore":
                    return new Xi({node: e.target, G: null}, e.content.map((function (e) {
                        return {node: e, G: null}
                    })));
                case"insertInto":
                    return new ki({node: e.target, G: null}, e.content.map((function (e) {
                        return {node: e, G: null}
                    })));
                case"insertIntoAsFirst":
                    return new _i({node: e.target, G: null}, e.content.map((function (e) {
                        return {node: e, G: null}
                    })));
                case"insertIntoAsLast":
                    return new Li({node: e.target, G: null}, e.content.map((function (e) {
                        return {node: e, G: null}
                    })));
                case"insertAttributes":
                    return new ji({node: e.target, G: null}, e.content.map((function (e) {
                        return {node: e, G: null}
                    })));
                case"rename":
                    return new Yi({node: e.target, G: null}, e.newName);
                case"replaceNode":
                    return new Vi({node: e.target, G: null}, e.replacement.map((function (e) {
                        return {node: e, G: null}
                    })));
                case"replaceValue":
                    return new Qi({node: e.target, G: null}, e["string-value"]);
                case"replaceElementContent":
                    return new qi({node: e.target, G: null}, e.text ? {node: e.text, G: null} : null);
                default:
                    throw Error('Unexpected type "' + e.type + '" when parsing a transferable pending update.')
            }
        }

        function uo(e, t, n) {
            sr.call(this, new fr({}), e.reduce((function (e, t) {
                return e.push(t.eb), e
            }), [t, n]), {A: !1, T: "unsorted"}), this.h = e, this.C = t, this.v = n, this.I = null
        }

        function lo(e, t) {
            return {
                node: {
                    nodeType: 2,
                    Pa: !0,
                    nodeName: e.va(),
                    namespaceURI: e.namespaceURI,
                    prefix: e.prefix,
                    localName: e.localName,
                    name: e.va(),
                    value: t
                }, G: null
            }
        }

        function co(e, t) {
            var n = t.tb || [];
            n = n.concat(e.Ja || []), $n.call(this, new fr({}), n, {
                A: !1,
                T: "unsorted"
            }), e.Ja ? this.o = e.Ja : this.name = new ve(e.prefix, e.namespaceURI, e.localName), this.h = t, this.v = void 0
        }

        function ho(e) {
            $n.call(this, e ? e.K : new fr({}), e ? [e] : [], {A: !1, T: "unsorted"}), this.h = e
        }

        function po(e, t, n, r) {
            $n.call(this, new fr({}), r.concat(t).concat(e.Ja || []), {
                A: !1,
                T: "unsorted"
            }), e.Ja ? this.o = e.Ja : this.h = new ve(e.prefix, e.namespaceURI, e.localName), this.N = n.reduce((function (e, t) {
                if (t.prefix in e) throw Error("XQST0071: The namespace declaration with the prefix " + t.prefix + " has already been declared on the constructed element.");
                return e[t.prefix] = t.uri, e
            }), {}), this.C = t, this.ka = r, this.v = void 0
        }

        function fo(e) {
            if (/^xml$/i.test(e)) throw Error('XQDY0064: The target of a created PI may not be "' + e + '"')
        }

        function mo(e, t) {
            return {node: {data: t, Pa: !0, nodeName: e, nodeType: 7, target: e}, G: null}
        }

        function vo(e, t) {
            var n = e.Db ? [e.Db].concat(t) : [t];
            $n.call(this, n.reduce((function (e, t) {
                return e.add(t.K)
            }), new fr({})), n, {A: !1, T: "unsorted"}), this.h = e, this.o = t
        }

        function go(e) {
            $n.call(this, e ? e.K : new fr({}), e ? [e] : [], {A: !1, T: "unsorted"}), this.h = e
        }

        function yo(e, t, n, r) {
            var a, i = new fr({});
            cr.call(this, i, (a = [e].concat(c(t.map((function (e) {
                return e.jc
            }))), [n])).concat.apply(a, c(t.map((function (e) {
                return e.Ob.map((function (e) {
                    return e.Nb
                }))
            })))), {
                A: !1,
                Z: !1,
                T: "unsorted",
                subtree: !1
            }, r), this.C = e, this.h = t.length, this.N = t.map((function (e) {
                return e.Ob
            }))
        }

        v(io, sr), io.prototype.o = function (e, t) {
            var n = this, r = ur(this.v)(e, t), a = ur(this.C)(e, t);
            return {
                next: function () {
                    var e = r.next(0), i = e.value.H;
                    if (0 === i.length) throw Wn();
                    if (1 !== i.length) throw Qn();
                    if (!W(i[0].type, 54) && !W(i[0].type, 47) && !W(i[0].type, 57)) throw Qn();
                    i = i[0];
                    var o = a.next(0);
                    e:{
                        var s = n.h, u = se.create(o.value.H);
                        switch (i.type) {
                            case 54:
                                if (s = ao(s, t, u).next(0).value.value, (u = i.value.node.lookupNamespaceURI(s.prefix)) && u !== s.namespaceURI) throw zn(s.namespaceURI);
                                break e;
                            case 47:
                                if ((s = ao(s, t, u).next(0).value.value).namespaceURI && (u = i.value.node.lookupNamespaceURI(s.prefix)) && u !== s.namespaceURI) throw zn(s.namespaceURI);
                                break e;
                            case 57:
                                s = new ve("", null, s = ro(t, u).next(0).value.value);
                                break e
                        }
                        s = void 0
                    }
                    return Z({H: [], fa: or([new Yi(i.value, s)], e.value.fa, o.value.fa)})
                }
            }
        }, io.prototype.P = function (e) {
            this.h = Po(e), sr.prototype.P.call(this, e)
        }, v(oo, sr), oo.prototype.o = function (e, t) {
            var n = ur(this.h)(e, t);
            return e = ur(this.v)(e, t), this.C ? function (e, t, n) {
                var r, a, i, o, s = !1;
                return {
                    next: function () {
                        if (s) return z;
                        if (!i) {
                            var u = n.next(0), l = St(se.create(u.value.H), e).map((function (e) {
                                return Jt(e, 1)
                            })).S().map((function (e) {
                                return e.value
                            })).join(" ");
                            i = 0 === l.length ? null : {node: e.o.createTextNode(l), G: null}, o = u.value.fa
                        }
                        if (!r) {
                            if (0 === (u = t.next(0)).value.H.length) throw Wn();
                            if (1 !== u.value.H.length) throw Vn();
                            if (!(W(u.value.H[0].type, 54) || W(u.value.H[0].type, 47) || W(u.value.H[0].type, 56) || W(u.value.H[0].type, 58) || W(u.value.H[0].type, 57))) throw Vn();
                            r = u.value.H[0], a = u.value.fa
                        }
                        if (W(r.type, 54)) return s = !0, Z({H: [], fa: or([new qi(r.value, i)], o, a)});
                        if (W(r.type, 47) || W(r.type, 56) || W(r.type, 58) || W(r.type, 57)) {
                            if (u = i ? Re(e.h, i) : "", W(r.type, 58) && (u.includes("--") || u.endsWith("-"))) throw Error('XQDY0072: The content "' + u + '" for a comment node contains two adjacent hyphens or ends with a hyphen.');
                            if (W(r.type, 57) && u.includes("?>")) throw Error('XQDY0026: The content "' + u + '" for a processing instruction node contains "?>".');
                            return s = !0, Z({H: [], fa: or([new Qi(r.value, u)], o, a)})
                        }
                    }
                }
            }(t, n, e) : function (e, t, n) {
                var r, a, i;
                return {
                    next: function () {
                        if (!r) {
                            var o = n.next(0), s = zi([o.value.H], e, Zn);
                            r = {
                                attributes: s.attributes.map((function (e) {
                                    return {node: e, G: null}
                                })), Ua: s.Ua.map((function (e) {
                                    return {node: e, G: null}
                                }))
                            }, a = o.value.fa
                        }
                        if (0 === (s = t.next(0)).value.H.length) throw Wn();
                        if (1 !== s.value.H.length) throw Vn();
                        if (!(W(s.value.H[0].type, 54) || W(s.value.H[0].type, 47) || W(s.value.H[0].type, 56) || W(s.value.H[0].type, 58) || W(s.value.H[0].type, 57))) throw Vn();
                        if (null === (i = Ue(e.h, s.value.H[0].value, null))) throw Error("XUDY0009: The target " + s.value.H[0].value.outerHTML + " for replacing a node must have a parent.");
                        if (o = s.value.H[0], s = s.value.fa, W(o.type, 47)) {
                            if (r.Ua.length) throw Error("XUTY0011: When replacing an attribute the new value must be zero or more attribute nodes.");
                            r.attributes.reduce((function (e, t) {
                                var n = t.node.prefix || "";
                                t = t.node.namespaceURI;
                                var r = i.node.lookupNamespaceURI(n);
                                if (r && r !== t) throw zn(t);
                                if ((r = e[n]) && t !== r) throw Zn(t);
                                return e[n] = t, e
                            }), {})
                        } else if (r.attributes.length) throw Error("XUTY0010: When replacing an an element, text, comment, or processing instruction node the new value must be a single node.");
                        return Z({H: [], fa: or([Ji(o.value, [].concat(r.attributes, r.Ua))], a, s)})
                    }
                }
            }(t, n, e)
        }, v(uo, sr), uo.prototype.evaluate = function (e, t) {
            return lr(e = this.o(e, t), (function () {
            }))
        }, uo.prototype.o = function (e, t) {
            var n, r, a, i = this, o = t.h, s = t.o, u = t.B, l = [], h = [], p = [];
            return {
                next: function () {
                    if (h.length !== i.h.length) for (var f = {}, d = h.length; d < i.h.length; f = {gb: f.gb}, d++) {
                        var m = i.h[d], v = l[d];
                        if (v || (l[d] = v = ur(m.eb)(e, t)), 1 !== (v = v.next(0)).value.H.length || !W(v.value.H[0].type, 53)) throw Error("XUTY0013: The source expression of a copy modify expression must return a single node.");
                        f.gb = Xe(Di(v.value.H[0].value, t)), h.push(f.gb.value), p.push(v.value.fa), e = bt(e, ((v = {})[m.sc] = function (e) {
                            return function () {
                                return se.s(e.gb)
                            }
                        }(f), v))
                    }
                    return a || (n || (n = ur(i.C)(e, t)), a = n.next(0).value.fa), a.forEach((function (e) {
                        if (e.target && !function e(t, n, r) {
                            if (n.find((function (e) {
                                return zt(e, t)
                            }))) return !0;
                            var a = Ue(r, t);
                            return !!a && e(a, n, r)
                        }(e.target, h, o)) throw Error("XUDY0014: The target " + e.target.node.outerHTML + " must be a node created by the copy clause.");
                        if ("put" === e.type) throw Error("XUDY0037: The modify expression of a copy modify expression can not contain a fn:put.")
                    })), ir(f = a.map((function (e) {
                        return so(e = e.h(t))
                    })), o, s, u), r || (r = ur(i.v)(e, t)), Z({
                        H: (f = r.next(0)).value.H,
                        fa: or.apply(null, [f.value.fa].concat(c(p)))
                    })
                }
            }
        }, uo.prototype.P = function (e) {
            Ho(e), this.h.forEach((function (t) {
                return t.sc = Xo(e, t.Qb.namespaceURI, t.Qb.localName)
            })), sr.prototype.P.call(this, e), Lo(e), this.I = this.h.some((function (e) {
                return e.eb.I
            })) || this.v.I
        }, v(co, $n), co.prototype.evaluate = function (e, t) {
            var n, r, a, i = this, o = !1;
            return se.create({
                next: function () {
                    if (o) return z;
                    if (!r) {
                        if (i.o) {
                            if (!n) {
                                var s = i.o.evaluate(e, t);
                                n = ao(i.v, t, s)
                            }
                            r = n.next(0).value.value
                        } else r = i.name;
                        if (r && ("xmlns" === r.prefix || !r.prefix && "xmlns" === r.localName || "http://www.w3.org/2000/xmlns/" === r.namespaceURI || "xml" === r.prefix && "http://www.w3.org/XML/1998/namespace" !== r.namespaceURI || r.prefix && "xml" !== r.prefix && "http://www.w3.org/XML/1998/namespace" === r.namespaceURI)) throw Error('XQDY0044: The node name "' + r.va() + '" is invalid for a computed attribute constructor.')
                    }
                    return i.h.tb ? (s = i.h.tb, a || (a = Bt(s.map((function (n) {
                        return St(n.evaluate(e, t), t).M((function (e) {
                            return se.s(q(e.map((function (e) {
                                return e.value
                            })).join(" "), 1))
                        }))
                    }))).M((function (e) {
                        return se.s(Xe(lo(r, e.map((function (e) {
                            return e.value
                        })).join(""))))
                    })).value), a.next(0)) : (o = !0, Z(Xe(lo(r, i.h.value))))
                }
            })
        }, co.prototype.P = function (e) {
            if (this.v = Po(e), this.name && this.name.prefix && !this.name.namespaceURI) {
                var t = e.ga(this.name.prefix);
                if (void 0 === t && this.name.prefix) throw It(this.name.prefix);
                this.name.namespaceURI = t || null
            }
            $n.prototype.P.call(this, e)
        }, v(ho, $n), ho.prototype.evaluate = function (e, t) {
            var n = {data: "", Pa: !0, nodeType: 8}, r = {node: n, G: null};
            return this.h ? St(e = er(this.h, e, t), t).M((function (e) {
                if (-1 !== (e = e.map((function (e) {
                    return Jt(e, 1).value
                })).join(" ")).indexOf("--\x3e")) throw Error('XQDY0072: The contents of the data of a comment may not include "--\x3e"');
                return n.data = e, se.s(Xe(r))
            })) : se.s(Xe(r))
        }, v(po, $n), po.prototype.evaluate = function (e, t) {
            var n, r, a, i, o, s = this, u = !1, l = !1, c = !1;
            return se.create({
                next: function () {
                    if (c) return z;
                    if (u || (n || (n = Bt(s.C.map((function (n) {
                        return er(n, e, t)
                    })))), r = n.S(), u = !0), !l) {
                        a || (a = s.ka.map((function (n) {
                            return er(n, e, t)
                        })));
                        for (var h = [], p = 0; p < a.length; p++) {
                            var f = a[p].S();
                            h.push(f)
                        }
                        i = h, l = !0
                    }
                    if (s.o && (o || (h = s.o.evaluate(e, t), o = ao(s.v, t, h)), h = o.next(0), s.h = h.value.value), "xmlns" === s.h.prefix || "http://www.w3.org/2000/xmlns/" === s.h.namespaceURI || "xml" === s.h.prefix && "http://www.w3.org/XML/1998/namespace" !== s.h.namespaceURI || s.h.prefix && "xml" !== s.h.prefix && "http://www.w3.org/XML/1998/namespace" === s.h.namespaceURI) throw Error('XQDY0096: The node name "' + s.h.va() + '" is invalid for a computed element constructor.');
                    var d = {
                        nodeType: 1,
                        Pa: !0,
                        attributes: [],
                        childNodes: [],
                        nodeName: s.h.va(),
                        namespaceURI: s.h.namespaceURI,
                        prefix: s.h.prefix,
                        localName: s.h.localName
                    };
                    for (h = {node: d, G: null}, r.forEach((function (e) {
                        d.attributes.push(e.value.node)
                    })), (p = zi(i, t, li)).attributes.forEach((function (e) {
                        if (d.attributes.find((function (t) {
                            return t.namespaceURI === e.namespaceURI && t.localName === e.localName
                        }))) throw Error("XQDY0025: The attribute " + e.name + " does not have an unique name in the constructed element.");
                        d.attributes.push(e)
                    })), p.Ua.forEach((function (e) {
                        d.childNodes.push(e)
                    })), p = 0; p < d.childNodes.length; p++) if (Ne(f = d.childNodes[p]) && 3 === f.nodeType) {
                        var m = d.childNodes[p - 1];
                        m && Ne(m) && 3 === m.nodeType && (m.data += f.data, d.childNodes.splice(p, 1), p--)
                    }
                    return c = !0, Z(Xe(h))
                }
            })
        }, po.prototype.P = function (e) {
            var t = this;
            if (Ho(e), Object.keys(this.N).forEach((function (n) {
                e.o[e.h][n] = t.N[n]
            })), this.J.forEach((function (t) {
                return t.P(e)
            })), this.C.reduce((function (t, n) {
                if (n.name) {
                    if (n = "Q{" + (n.name.namespaceURI || e.ga(n.name.prefix)) + "}" + n.name.localName, t.includes(n)) throw Error("XQST0040: The attribute " + n + " does not have an unique name in the constructed element.");
                    t.push(n)
                }
                return t
            }), []), this.h) {
                var n = e.ga(this.h.prefix);
                if (void 0 === n && this.h.prefix) throw It(this.h.prefix);
                this.h.namespaceURI = n || null
            }
            this.v = Po(e), Lo(e)
        }, v(vo, $n), vo.prototype.evaluate = function (e, t) {
            var n = this;
            return St(er(this.o, e, t), t).M((function (r) {
                var a = r.map((function (e) {
                    return Jt(e, 1).value
                })).join(" ");
                if (-1 !== a.indexOf("?>")) throw Error('XQDY0026: The contents of the data of a processing instruction may not include "?>"');
                if (null !== n.h.Mb) return fo(r = n.h.Mb), se.s(Xe(mo(r, a)));
                r = er(n.h.Db, e, t);
                var i = ro(t, r);
                return se.create({
                    next: function () {
                        var e = i.next(0);
                        return e.done ? e : (fo(e = e.value.value), Z(Xe(mo(e, a))))
                    }
                })
            }))
        }, v(go, $n), go.prototype.evaluate = function (e, t) {
            return this.h ? St(e = er(this.h, e, t), t).M((function (e) {
                return 0 === e.length ? se.empty() : (e = {
                    node: {
                        data: e.map((function (e) {
                            return Jt(e, 1).value
                        })).join(" "), Pa: !0, nodeType: 3
                    }, G: null
                }, se.s(Xe(e)))
            })) : se.empty()
        }, v(yo, cr), yo.prototype.v = function (e, t, n) {
            var r = this;
            return n[0](e).M((function (a) {
                for (var i = 0; i < r.h; i++) if (r.N[i].some((function (n) {
                    switch (n.pc) {
                        case"?":
                            if (1 < a.length) return !1;
                            break;
                        case"*":
                            break;
                        case"+":
                            if (1 > a.length) return !1;
                            break;
                        default:
                            if (1 !== a.length) return !1
                    }
                    var r = se.create(a);
                    return a.every((function (a, i) {
                        return a = xt(e, i, a, r), er(n.Nb, a, t).getEffectiveBooleanValue()
                    }))
                }))) return n[i + 1](e);
                return n[r.h + 1](e)
            }))
        }, yo.prototype.P = function (e) {
            if (cr.prototype.P.call(this, e), this.C.I) throw Ln()
        };
        var wo = {ca: !1, qa: !1}, Ao = {ca: !0, qa: !1}, xo = {ca: !0, qa: !0};

        function bo(e) {
            return e.ca ? e.qa ? xo : Ao : wo
        }

        function Eo(e, t) {
            switch (e[0]) {
                case"andOp":
                    var n = Lr(e, "type");
                    return new Ha(No("andOp", e, bo(t)), n);
                case"orOp":
                    return n = Lr(e, "type"), new ja(No("orOp", e, bo(t)), n);
                case"unaryPlusOp":
                    return n = Xr(Xr(e, "operand"), "*"), e = Lr(e, "type"), new Pa("+", Eo(n, t), e);
                case"unaryMinusOp":
                    return n = Xr(Xr(e, "operand"), "*"), e = Lr(e, "type"), new Pa("-", Eo(n, t), e);
                case"addOp":
                case"subtractOp":
                case"multiplyOp":
                case"divOp":
                case"idivOp":
                case"modOp":
                    var r = e[0], a = Eo(kr(e, ["firstOperand", "*"]), bo(t));
                    t = Eo(kr(e, ["secondOperand", "*"]), bo(t));
                    var i = Lr(e, "type"), o = Lr(kr(e, ["firstOperand", "*"]), "type"),
                        s = Lr(kr(e, ["secondOperand", "*"]), "type");
                    return o && s && Lr(e, "type") && (n = Ra(r, o.type, s.type)), new Ma(r, a, t, i, n);
                case"sequenceExpr":
                    return function (e, t) {
                        var n = Yr(e, "*").map((function (e) {
                            return Eo(e, t)
                        }));
                        return 1 === n.length ? n[0] : (n = Lr(e, "type"), new Za(Yr(e, "*").map((function (e) {
                            return Eo(e, t)
                        })), n))
                    }(e, t);
                case"unionOp":
                    return n = Lr(e, "type"), new oi([Eo(kr(e, ["firstOperand", "*"]), bo(t)), Eo(kr(e, ["secondOperand", "*"]), bo(t))], n);
                case"exceptOp":
                case"intersectOp":
                    return n = Lr(e, "type"), new za(e[0], Eo(kr(e, ["firstOperand", "*"]), bo(t)), Eo(kr(e, ["secondOperand", "*"]), bo(t)), n);
                case"stringConcatenateOp":
                    return function (e, t) {
                        var n = Lr(e, "type");
                        return new wr(new Ea({
                            localName: "concat",
                            namespaceURI: "http://www.w3.org/2005/xpath-functions",
                            prefix: ""
                        }, (e = [Xr(e, "firstOperand")[1], Xr(e, "secondOperand")[1]]).length, n), e.map((function (e) {
                            return Eo(e, bo(t))
                        })), n)
                    }(e, t);
                case"rangeSequenceExpr":
                    return function (e, t) {
                        var n = Lr(e, "type");
                        return new wr(new Ea({
                            localName: "to",
                            namespaceURI: "http://fontoxpath/operators",
                            prefix: ""
                        }, (e = [Xr(e, "startExpr")[1], Xr(e, "endExpr")[1]]).length, n), e.map((function (e) {
                            return Eo(e, bo(t))
                        })), n)
                    }(e, t);
                case"equalOp":
                case"notEqualOp":
                case"lessThanOrEqualOp":
                case"lessThanOp":
                case"greaterThanOrEqualOp":
                case"greaterThanOp":
                case"eqOp":
                case"neOp":
                case"ltOp":
                case"leOp":
                case"gtOp":
                case"geOp":
                case"isOp":
                case"nodeBeforeOp":
                case"nodeAfterOp":
                    return n = kr(e, ["firstOperand", "*"]), r = kr(e, ["secondOperand", "*"]), a = Lr(n, "type"), i = Lr(r, "type"), new Ja(e[0], Eo(n, bo(t)), Eo(r, bo(t)), a, i);
                case"pathExpr":
                    return function (e, t) {
                        var n = Lr(e, "type"), r = Yr(e, "stepExpr"), a = !1, i = r.map((function (e) {
                            var r = Xr(e, "xpathAxis");
                            if (r) {
                                a = !0;
                                var i = Xr(e, "attributeTest anyElementTest piTest documentTest elementTest commentTest namespaceTest anyKindTest textTest anyFunctionTest typedFunctionTest schemaAttributeTest atomicType anyItemType parenthesizedItemType typedMapTest typedArrayTest nameTest Wildcard".split(" "));
                                switch (i = Bo(i), _r(r)) {
                                    case"ancestor":
                                        var o = new Zr(i, {Na: !1});
                                        break;
                                    case"ancestor-or-self":
                                        o = new Zr(i, {Na: !0});
                                        break;
                                    case"attribute":
                                        o = new Wr(i);
                                        break;
                                    case"child":
                                        o = new $r(i);
                                        break;
                                    case"descendant":
                                        o = new ta(i, {Na: !1});
                                        break;
                                    case"descendant-or-self":
                                        o = new ta(i, {Na: !0});
                                        break;
                                    case"parent":
                                        o = new oa(i);
                                        break;
                                    case"following-sibling":
                                        o = new ia(i);
                                        break;
                                    case"preceding-sibling":
                                        o = new ua(i);
                                        break;
                                    case"following":
                                        o = new aa(i);
                                        break;
                                    case"preceding":
                                        o = new sa(i);
                                        break;
                                    case"self":
                                        o = new la(i)
                                }
                            } else o = Eo(o = kr(e, ["filterExpr", "*"]), bo(t));
                            for (r = (e = u(e = Yr(e, "*"))).next(); !r.done; r = e.next()) switch (r = r.value, r[0]) {
                                case"lookup":
                                    o = new bi(o, Co(r, t));
                                    break;
                                case"predicate":
                                case"predicates":
                                    o = Yr(r, "*").reduce((function (e, n) {
                                        return new wi(e, Eo(n, bo(t)))
                                    }), o)
                            }
                            return o.type = n, o
                        }));
                        return e = Xr(e, "rootExpr"), !(r = a || null !== e || 1 < r.length) && 1 === i.length || !e && 1 === i.length && "sorted" === i[0].B ? i[0] : e && 0 === i.length ? new vi(null) : (i = new yi(i, r), e ? new vi(i) : i)
                    }(e, t);
                case"contextItemExpr":
                    return new gi(e = Lr(e, "type"));
                case"functionCallExpr":
                    return function (e, t) {
                        var n = Xr(e, "functionName"), r = Yr(Xr(e, "arguments"), "*");
                        return e = Lr(e, "type"), new wr(new Ea(qr(n), r.length, e), r.map((function (e) {
                            return "argumentPlaceholder" === e[0] ? null : Eo(e, t)
                        })), e)
                    }(e, t);
                case"inlineFunctionExpr":
                    return function (e, t) {
                        var n = Yr(Xr(e, "paramList"), "*"), r = kr(e, ["functionBody", "*"]), a = Lr(e, "type");
                        return new ma(n.map((function (e) {
                            return {name: qr(Xr(e, "varName")), type: Vr(e)}
                        })), Vr(e), r ? Eo(r, t) : new Za([], a))
                    }(e, t);
                case"arrowExpr":
                    return function (e, t) {
                        var n = Lr(e, "type"), r = kr(e, ["argExpr", "*"]);
                        e = Yr(e, "*").slice(1), r = [Eo(r, t)];
                        for (var a = 0; a < e.length; a++) if ("arguments" !== e[a][0]) {
                            if ("arguments" === e[a + 1][0]) {
                                var i = Yr(e[a + 1], "*");
                                r = r.concat(i.map((function (e) {
                                    return "argumentPlaceholder" === e[0] ? null : Eo(e, t)
                                })))
                            }
                            i = "EQName" === e[a][0] ? new Ea(qr(e[a]), r.length, n) : Eo(e[a], bo(t)), r = [new wr(i, r, n)]
                        }
                        return r[0]
                    }(e, t);
                case"dynamicFunctionInvocationExpr":
                    return function (e, t) {
                        var n = kr(e, ["functionItem", "*"]), r = Lr(e, "type");
                        e = Xr(e, "arguments");
                        var a = [];
                        return e && (a = Yr(e, "*").map((function (e) {
                            return "argumentPlaceholder" === e[0] ? null : Eo(e, t)
                        }))), new wr(Eo(n, t), a, r)
                    }(e, t);
                case"namedFunctionRef":
                    return t = Xr(e, "functionName"), n = Lr(e, "type"), e = _r(kr(e, ["integerConstantExpr", "value"])), new Ea(qr(t), parseInt(e, 10), n);
                case"integerConstantExpr":
                    return new ga(_r(Xr(e, "value")), {type: 5, g: 3});
                case"stringConstantExpr":
                    return new ga(_r(Xr(e, "value")), {type: 1, g: 3});
                case"decimalConstantExpr":
                    return new ga(_r(Xr(e, "value")), {type: 4, g: 3});
                case"doubleConstantExpr":
                    return new ga(_r(Xr(e, "value")), {type: 3, g: 3});
                case"varRef":
                    return new Si((e = qr(Xr(e, "name"))).prefix, e.namespaceURI, e.localName);
                case"flworExpr":
                    return function (e, t) {
                        var n = Yr(e, "*");
                        if (e = Xr(n[n.length - 1], "*"), 1 < (n = n.slice(0, -1)).length && !t.ca) throw Error("XPST0003: Use of XQuery FLWOR expressions in XPath is no allowed");
                        return n.reduceRight((function (e, n) {
                            switch (n[0]) {
                                case"forClause":
                                    for (var r = (n = Yr(n, "*")).length - 1; 0 <= r; --r) {
                                        var a = n[r], i = kr(a, ["forExpr", "*"]), o = Xr(a, "positionalVariableBinding");
                                        e = new da(qr(kr(a, ["typedVariableBinding", "varName"])), Eo(i, bo(t)), o ? qr(o) : null, e)
                                    }
                                    return e;
                                case"letClause":
                                    for (r = (n = Yr(n, "*")).length - 1; 0 <= r; --r) i = kr(a = n[r], ["letExpr", "*"]), e = new va(qr(kr(a, ["typedVariableBinding", "varName"])), Eo(i, bo(t)), e);
                                    return e;
                                case"whereClause":
                                    for (r = (n = Yr(n, "*")).length - 1; 0 <= r; --r) e = new Ri(Eo(n[r], t), e);
                                    return e;
                                case"windowClause":
                                case"groupByClause":
                                    throw Error("Not implemented: " + n[0] + " is not implemented yet.");
                                case"orderByClause":
                                    return function (e, t, n) {
                                        return new mi((e = Yr(e, "*")).filter((function (e) {
                                            return "stable" !== e[0]
                                        })).map((function (e) {
                                            var n = Xr(e, "orderModifier"), r = n ? Xr(n, "orderingKind") : null;
                                            return n = n ? Xr(n, "emptyOrderingMode") : null, r = !r || "ascending" === _r(r), n = !n || "empty least" === _r(n), {
                                                ia: Eo(kr(e, ["orderByExpr", "*"]), t),
                                                Ib: r,
                                                mc: n
                                            }
                                        })), n)
                                    }(n, t, e);
                                case"countClause":
                                    throw Error("Not implemented: " + n[0] + " is not implemented yet.");
                                default:
                                    throw Error("Not implemented: " + n[0] + " is not supported in a flwor expression")
                            }
                        }), Eo(e, t))
                    }(e, t);
                case"quantifiedExpr":
                    return function (e, t) {
                        var n = Lr(e, "type"), r = _r(Xr(e, "quantifier")), a = kr(e, ["predicateExpr", "*"]);
                        return e = Yr(e, "quantifiedExprInClause").map((function (e) {
                            return {
                                name: qr(kr(e, ["typedVariableBinding", "varName"])),
                                eb: Eo(e = kr(e, ["sourceExpr", "*"]), bo(t))
                            }
                        })), new Bi(r, e, Eo(a, bo(t)), n)
                    }(e, t);
                case"ifThenElseExpr":
                    return n = Lr(e, "type"), new ca(Eo(Xr(Xr(e, "ifClause"), "*"), bo(t)), Eo(Xr(Xr(e, "thenClause"), "*"), t), Eo(Xr(Xr(e, "elseClause"), "*"), t), n);
                case"instanceOfExpr":
                    return n = Eo(kr(e, ["argExpr", "*"]), t), r = kr(e, ["sequenceType", "*"]), a = kr(e, ["sequenceType", "occurrenceIndicator"]), e = Lr(e, "type"), new ni(n, Eo(r, bo(t)), a ? _r(a) : "", e);
                case"castExpr":
                    return t = Eo(Xr(Xr(e, "argExpr"), "*"), bo(t)), n = Xr(e, "singleType"), new ei(t, e = qr(Xr(n, "atomicType")), n = null !== Xr(n, "optional"));
                case"castableExpr":
                    return t = Eo(Xr(Xr(e, "argExpr"), "*"), bo(t)), n = Xr(e, "singleType"), new $a(t, e = qr(Xr(n, "atomicType")), n = null !== Xr(n, "optional"));
                case"simpleMapExpr":
                    return function (e, t) {
                        var n = Lr(e, "type");
                        return Yr(e, "*").reduce((function (e, r) {
                            return null === e ? Eo(r, bo(t)) : new Wa(e, Eo(r, bo(t)), n)
                        }), null)
                    }(e, t);
                case"mapConstructor":
                    return function (e, t) {
                        var n = Lr(e, "type");
                        return new ya(Yr(e, "mapConstructorEntry").map((function (e) {
                            return {
                                key: Eo(kr(e, ["mapKeyExpr", "*"]), bo(t)),
                                value: Eo(kr(e, ["mapValueExpr", "*"]), bo(t))
                            }
                        })), n)
                    }(e, t);
                case"arrayConstructor":
                    return function (e, t) {
                        var n = Lr(e, "type"), r = Yr(e = Xr(e, "*"), "arrayElem").map((function (e) {
                            return Eo(Xr(e, "*"), bo(t))
                        }));
                        switch (e[0]) {
                            case"curlyArray":
                                return new Jr(r, n);
                            case"squareArray":
                                return new Kr(r, n);
                            default:
                                throw Error("Unrecognized arrayType: " + e[0])
                        }
                    }(e, t);
                case"unaryLookup":
                    return n = Lr(e, "type"), new Ei(Co(e, t), n);
                case"typeswitchExpr":
                    return function (e, t) {
                        if (!t.ca) throw Error("XPST0003: Use of XQuery functionality is not allowed in XPath context");
                        var n = Lr(e, "type"), r = Eo(Xr(Xr(e, "argExpr"), "*"), t),
                            a = Yr(e, "typeswitchExprCaseClause").map((function (e) {
                                var n = 0 === Yr(e, "sequenceTypeUnion").length ? [Xr(e, "sequenceType")] : Yr(Xr(e, "sequenceTypeUnion"), "sequenceType");
                                return {
                                    jc: Eo(kr(e, ["resultExpr", "*"]), t), Ob: n.map((function (e) {
                                        var n = Xr(e, "occurrenceIndicator");
                                        return {pc: n ? _r(n) : "", Nb: Eo(Xr(e, "*"), t)}
                                    }))
                                }
                            }));
                        return e = Eo(kr(e, ["typeswitchExprDefaultClause", "resultExpr", "*"]), t), new yo(r, a, e, n)
                    }(e, t);
                case"elementConstructor":
                    return function (e, t) {
                        if (!t.ca) throw Error("XPST0003: Use of XQuery functionality is not allowed in XPath context");
                        var n = qr(Xr(e, "tagName")), r = Xr(e, "attributeList"),
                            a = r ? Yr(r, "attributeConstructor").map((function (e) {
                                return Eo(e, bo(t))
                            })) : [];
                        return r = r ? Yr(r, "namespaceDeclaration").map((function (e) {
                            var t = Xr(e, "prefix");
                            return {prefix: t ? _r(t) : "", uri: _r(Xr(e, "uri"))}
                        })) : [], e = (e = Xr(e, "elementContent")) ? Yr(e, "*").map((function (e) {
                            return Eo(e, bo(t))
                        })) : [], new po(n, a, r, e)
                    }(e, t);
                case"attributeConstructor":
                    return function (e, t) {
                        if (!t.ca) throw Error("XPST0003: Use of XQuery functionality is not allowed in XPath context");
                        var n = qr(Xr(e, "attributeName")), r = Xr(e, "attributeValue");
                        return r = r ? _r(r) : null, e = (e = Xr(e, "attributeValueExpr")) ? Yr(e, "*").map((function (e) {
                            return Eo(e, bo(t))
                        })) : null, new co(n, {value: r, tb: e})
                    }(e, t);
                case"computedAttributeConstructor":
                    return (n = Xr(e, "tagName")) ? n = qr(n) : (n = Xr(e, "tagNameExpr"), n = {Ja: Eo(Xr(n, "*"), bo(t))}), new co(n, {tb: [e = Eo(Xr(Xr(e, "valueExpr"), "*"), bo(t))]});
                case"computedCommentConstructor":
                    if (!t.ca) throw Error("XPST0003: Use of XQuery functionality is not allowed in XPath context");
                    return new ho(e = (e = Xr(e, "argExpr")) ? Eo(Xr(e, "*"), bo(t)) : null);
                case"computedTextConstructor":
                    if (!t.ca) throw Error("XPST0003: Use of XQuery functionality is not allowed in XPath context");
                    return new go(e = (e = Xr(e, "argExpr")) ? Eo(Xr(e, "*"), bo(t)) : null);
                case"computedElementConstructor":
                    return function (e, t) {
                        var n = Xr(e, "tagName");
                        return n ? n = qr(n) : (n = Xr(e, "tagNameExpr"), n = {Ja: Eo(Xr(n, "*"), bo(t))}), e = (e = Xr(e, "contentExpr")) ? Yr(e, "*").map((function (e) {
                            return Eo(e, bo(t))
                        })) : [], new po(n, [], [], e)
                    }(e, t);
                case"computedPIConstructor":
                    if (!t.ca) throw Error("XPST0003: Use of XQuery functionality is not allowed in XPath context");
                    return n = Xr(e, "piTargetExpr"), r = Xr(e, "piTarget"), a = Xr(e, "piValueExpr"), e = Lr(e, "type"), new vo({
                        Db: n ? Eo(Xr(n, "*"), bo(t)) : null,
                        Mb: r ? _r(r) : null
                    }, a ? Eo(Xr(a, "*"), bo(t)) : new Za([], e));
                case"CDataSection":
                    return new ga(_r(e), {type: 1, g: 3});
                case"deleteExpr":
                    return new Ki(e = Eo(kr(e, ["targetExpr", "*"]), t));
                case"insertExpr":
                    switch (n = Eo(kr(e, ["sourceExpr", "*"]), t), (a = Yr(e, "*")[1])[0]) {
                        case"insertAfter":
                            r = 1;
                            break;
                        case"insertBefore":
                            r = 2;
                            break;
                        case"insertInto":
                            r = (r = Xr(a, "*")) ? "insertAsFirst" === r[0] ? 4 : 5 : 3
                    }
                    return new Wi(n, r, e = Eo(kr(e, ["targetExpr", "*"]), t));
                case"renameExpr":
                    return new io(n = Eo(kr(e, ["targetExpr", "*"]), t), e = Eo(kr(e, ["newNameExpr", "*"]), t));
                case"replaceExpr":
                    return new oo(n = !!Xr(e, "replaceValue"), r = Eo(kr(e, ["targetExpr", "*"]), t), e = Eo(kr(e, ["replacementExpr", "*"]), t));
                case"transformExpr":
                    return function (e, t) {
                        var n = Yr(Xr(e, "transformCopies"), "transformCopy").map((function (e) {
                            var n = qr(Xr(Xr(e, "varRef"), "name"));
                            return {
                                eb: Eo(Xr(Xr(e, "copySource"), "*"), t),
                                Qb: new ve(n.prefix, n.namespaceURI, n.localName)
                            }
                        })), r = Eo(Xr(Xr(e, "modifyExpr"), "*"), t);
                        return e = Eo(Xr(Xr(e, "returnExpr"), "*"), t), new uo(n, r, e)
                    }(e, t);
                case"x:stackTrace":
                    for (n = e[1], e = e[2]; "x:stackTrace" === e[0];) e = e[2];
                    return new pa(n, e[0], Eo(e, t));
                default:
                    return Bo(e)
            }
        }

        function Bo(e) {
            switch (e[0]) {
                case"nameTest":
                    return new Ti(qr(e));
                case"piTest":
                    return (e = Xr(e, "piTarget")) ? new Ii(_r(e)) : new Ci(7);
                case"commentTest":
                    return new Ci(8);
                case"textTest":
                    return new Ci(3);
                case"documentTest":
                    return new Ci(9);
                case"attributeTest":
                    var t = (e = Xr(e, "attributeName")) && Xr(e, "star");
                    return !e || t ? new Ci(2) : new Ti(qr(Xr(e, "QName")), {kind: 2});
                case"elementTest":
                    return t = (e = Xr(e, "elementName")) && Xr(e, "star"), !e || t ? new Ci(1) : new Ti(qr(Xr(e, "QName")), {kind: 1});
                case"anyKindTest":
                    return new Oi({prefix: "", namespaceURI: null, localName: "node()"});
                case"anyMapTest":
                    return new Oi({prefix: "", namespaceURI: null, localName: "map(*)"});
                case"anyArrayTest":
                    return new Oi({prefix: "", namespaceURI: null, localName: "array(*)"});
                case"Wildcard":
                    return Xr(e, "star") ? (t = Xr(e, "uri")) ? e = new Ti({
                        localName: "*",
                        namespaceURI: _r(t),
                        prefix: ""
                    }) : (t = Xr(e, "NCName"), e = "star" === Xr(e, "*")[0] ? new Ti({
                        localName: _r(t),
                        namespaceURI: null,
                        prefix: "*"
                    }) : new Ti({localName: "*", namespaceURI: null, prefix: _r(t)})) : e = new Ti({
                        localName: "*",
                        namespaceURI: null,
                        prefix: "*"
                    }), e;
                case"atomicType":
                    return new Oi(e = qr(e));
                case"anyItemType":
                    return new Oi({prefix: "", namespaceURI: null, localName: "item()"});
                default:
                    throw Error("No selector counterpart for: " + e[0] + ".")
            }
        }

        function No(e, t, n) {
            var r = [];
            return function t(a) {
                var i = Xr(a, "firstOperand")[1];
                a = Xr(a, "secondOperand")[1], i[0] === e ? t(i) : r.push(Eo(i, n)), a[0] === e ? t(a) : r.push(Eo(a, n))
            }(t), r
        }

        function Co(e, t) {
            switch ((e = Xr(e, "*"))[0]) {
                case"NCName":
                    return new ga(_r(e), {type: 1, g: 3});
                case"star":
                    return "*";
                default:
                    return Eo(e, bo(t))
            }
        }

        function To(e, t) {
            return Eo(e, t)
        }

        var Io = {};
        !function (e) {
            (function () {
                !function (e) {
                    function t(e, n, r, a) {
                        return e = Error.call(this, e), Object.setPrototypeOf && Object.setPrototypeOf(e, t.prototype), e.wc = n, e.xc = r, e.location = a, e.name = "SyntaxError", e
                    }

                    function n(e, t, n) {
                        return n = n || " ", e.length > t ? e : (t -= e.length, e + (n += n.repeat(t)).slice(0, t))
                    }

                    !function (e, t) {
                        function n() {
                            this.constructor = e
                        }

                        n.prototype = t.prototype, e.prototype = new n
                    }(t, Error), t.prototype.format = function (e) {
                        var t = "Error: " + this.message;
                        if (this.location) {
                            var r, a = null;
                            for (r = 0; r < e.length; r++) if (e[r].source === this.location.source) {
                                a = e[r].text.split(/\r\n|\n|\r/g);
                                break
                            }
                            if (e = this.location.start, r = this.location.source + ":" + e.line + ":" + e.da, a) {
                                var i = this.location.end, o = n("", e.line.toString().length);
                                a = a[e.line - 1], i = e.line === i.line ? i.da : a.length + 1, t += "\n --\x3e " + r + "\n" + o + " |\n" + e.line + " | " + a + "\n" + o + " | " + n("", e.da - 1) + n("", i - e.da, "^")
                            } else t += "\n at " + r
                        }
                        return t
                    }, t.ic = function (e, t) {
                        function n(e) {
                            return e.charCodeAt(0).toString(16).toUpperCase()
                        }

                        function r(e) {
                            return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, (function (e) {
                                return "\\x0" + n(e)
                            })).replace(/[\x10-\x1F\x7F-\x9F]/g, (function (e) {
                                return "\\x" + n(e)
                            }))
                        }

                        function a(e) {
                            return e.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, (function (e) {
                                return "\\x0" + n(e)
                            })).replace(/[\x10-\x1F\x7F-\x9F]/g, (function (e) {
                                return "\\x" + n(e)
                            }))
                        }

                        function i(e) {
                            return o[e.type](e)
                        }

                        var o = {
                            literal: function (e) {
                                return '"' + r(e.text) + '"'
                            }, class: function (e) {
                                var t = e.rc.map((function (e) {
                                    return Array.isArray(e) ? a(e[0]) + "-" + a(e[1]) : a(e)
                                }));
                                return "[" + (e.lc ? "^" : "") + t + "]"
                            }, any: function () {
                                return "any character"
                            }, end: function () {
                                return "end of input"
                            }, other: function (e) {
                                return e.description
                            }
                        };
                        return "Expected " + function (e) {
                            var t, n;
                            if ((e = e.map(i)).sort(), 0 < e.length) {
                                for (n = t = 1; t < e.length; t++) e[t - 1] !== e[t] && (e[n] = e[t], n++);
                                e.length = n
                            }
                            switch (e.length) {
                                case 1:
                                    return e[0];
                                case 2:
                                    return e[0] + " or " + e[1];
                                default:
                                    return e.slice(0, -1).join(", ") + ", or " + e[e.length - 1]
                            }
                        }(e) + " but " + (t ? '"' + r(t) + '"' : "end of input") + " found."
                    }, e.tc = {
                        SyntaxError: t, parse: function (e, n) {
                            function r(e, t, n) {
                                return ["decimalFormatParam", ["decimalFormatParamName", t], ["decimalFormatParamValue", n]]
                            }

                            function a(e, t) {
                                return {type: "literal", text: e, ignoreCase: t}
                            }

                            function i(e, t, n) {
                                return {type: "class", rc: e, lc: t, ignoreCase: n}
                            }

                            function o(t) {
                                var n, r = Jl[t];
                                if (r) return r;
                                for (n = t - 1; !Jl[n];) n--;
                                for (r = {
                                    line: (r = Jl[n]).line,
                                    da: r.da
                                }; n < t;) 10 === e.charCodeAt(n) ? (r.line++, r.da = 1) : r.da++, n++;
                                return Jl[t] = r
                            }

                            function s(e, t) {
                                var n = o(e), r = o(t);
                                return {
                                    source: tt,
                                    start: {offset: e, line: n.line, da: n.da},
                                    end: {offset: t, line: r.line, da: r.da}
                                }
                            }

                            function u(e) {
                                Vl < Kl || (Vl > Kl && (Kl = Vl, zl = []), zl.push(e))
                            }

                            function l() {
                                var t, n, r = 233 * Vl;
                                if (t = Wl[r]) return Vl = t.i, t.result;
                                t = Vl, He();
                                var a = 233 * Vl + 2;
                                if (n = Wl[a]) Vl = n.i, a = n.result; else {
                                    if (n = Vl, e.substr(Vl, 6) === at) {
                                        var i = at;
                                        Vl += 6
                                    } else i = et, 0 === Zl && u(Ni);
                                    if (i !== et) {
                                        if (He(), i = Vl, e.substr(Vl, 8) === it) {
                                            var o = it;
                                            Vl += 8
                                        } else o = et, 0 === Zl && u(Ci);
                                        if (o !== et ? (o = je()) !== et ? (o = Ce()) !== et ? (Ql = i, i = ["encoding", o]) : (Vl = i, i = et) : (Vl = i, i = et) : (Vl = i, i = et), i === et) if (i = Vl, e.substr(Vl, 7) === ot ? (o = ot, Vl += 7) : (o = et, 0 === Zl && u(Ti)), o !== et) if ((o = je()) !== et) if ((o = Ce()) !== et) {
                                            var s = Vl, l = je();
                                            l !== et ? (e.substr(Vl, 8) === it ? (l = it, Vl += 8) : (l = et, 0 === Zl && u(Ci)), l !== et ? (l = je()) !== et ? (l = Ce()) !== et ? (Ql = s, s = l) : (Vl = s, s = et) : (Vl = s, s = et) : (Vl = s, s = et)) : (Vl = s, s = et), s === et && (s = null), Ql = i, i = [["version", o]].concat(s ? [["encoding", s]] : [])
                                        } else Vl = i, i = et; else Vl = i, i = et; else Vl = i, i = et;
                                        i !== et ? (He(), (o = h()) !== et ? (Ql = n, n = ["versionDecl"].concat(i)) : (Vl = n, n = et)) : (Vl = n, n = et)
                                    } else Vl = n, n = et;
                                    Wl[a] = {i: Vl, result: n}, a = n
                                }
                                if (a === et && (a = null), He(), i = Wl[n = 233 * Vl + 3]) Vl = i.i, n = i.result; else {
                                    if (i = Vl, s = Wl[o = 233 * Vl + 4]) Vl = s.i, o = s.result; else {
                                        if (s = Vl, e.substr(Vl, 6) === st ? (l = st, Vl += 6) : (l = et, 0 === Zl && u(Ii)), l !== et) if ((l = je()) !== et) if (e.substr(Vl, 9) === ut ? (l = ut, Vl += 9) : (l = et, 0 === Zl && u(Oi)), l !== et) if ((l = je()) !== et) {
                                            l = Vl;
                                            var p = Ge();
                                            if ((l = p !== et ? e.substring(l, Vl) : p) !== et) if (He(), 61 === e.charCodeAt(Vl) ? (p = lt, Vl++) : (p = et, 0 === Zl && u(Si)), p !== et) if (He(), (p = Ce()) !== et) He(), h() !== et ? (Ql = s, s = ["moduleDecl", ["prefix", l], ["uri", p]]) : (Vl = s, s = et); else Vl = s, s = et; else Vl = s, s = et; else Vl = s, s = et
                                        } else Vl = s, s = et; else Vl = s, s = et; else Vl = s, s = et; else Vl = s, s = et;
                                        Wl[o] = {i: Vl, result: s}, o = s
                                    }
                                    o !== et ? (He(), s = c(), Ql = i, i = ["libraryModule", o].concat(s ? [s] : [])) : (Vl = i, i = et), Wl[n] = {
                                        i: Vl,
                                        result: i
                                    }, n = i
                                }
                                return n === et && ((i = Wl[n = 233 * Vl + 1]) ? (Vl = i.i, n = i.result) : (i = Vl, o = c(), He(), (l = Wl[s = 233 * Vl + 36]) ? (Vl = l.i, s = l.result) : (l = Vl, (p = C()) !== et && (Ql = l, p = ["queryBody", p]), l = p, Wl[s] = {
                                    i: Vl,
                                    result: l
                                }, s = l), s !== et ? (Ql = i, i = ["mainModule"].concat(o ? [o] : [], [s])) : (Vl = i, i = et), Wl[n] = {
                                    i: Vl,
                                    result: i
                                }, n = i)), n !== et ? (He(), Ql = t, t = ["module"].concat(a ? [a] : [], [n])) : (Vl = t, t = et), Wl[r] = {
                                    i: Vl,
                                    result: t
                                }, t
                            }

                            function c() {
                                var e, t = 233 * Vl + 5;
                                if (e = Wl[t]) return Vl = e.i, e.result;
                                e = Vl;
                                var n = [], r = Vl, a = v();
                                if (a === et && ((a = p()) === et && ((a = m()) === et && (a = d()))), a !== et) {
                                    He();
                                    var i = h();
                                    i !== et ? (He(), Ql = r, r = a) : (Vl = r, r = et)
                                } else Vl = r, r = et;
                                for (; r !== et;) n.push(r), r = Vl, (a = v()) === et && ((a = p()) === et && ((a = m()) === et && (a = d()))), a !== et ? (He(), (i = h()) !== et ? (He(), Ql = r, r = a) : (Vl = r, r = et)) : (Vl = r, r = et);
                                if (r = [], a = Vl, (i = A()) === et && ((i = g()) === et && (i = N())), i !== et) {
                                    He();
                                    var o = h();
                                    o !== et ? (He(), Ql = a, a = i) : (Vl = a, a = et)
                                } else Vl = a, a = et;
                                for (; a !== et;) r.push(a), a = Vl, (i = A()) === et && ((i = g()) === et && (i = N())), i !== et ? (He(), (o = h()) !== et ? (He(), Ql = a, a = i) : (Vl = a, a = et)) : (Vl = a, a = et);
                                return Ql = e, e = 0 === n.length && 0 === r.length ? null : ["prolog"].concat(n, r), Wl[t] = {
                                    i: Vl,
                                    result: e
                                }, e
                            }

                            function h() {
                                var t, n = 233 * Vl + 6;
                                return (t = Wl[n]) ? (Vl = t.i, t.result) : (59 === e.charCodeAt(Vl) ? (t = ct, Vl++) : (t = et, 0 === Zl && u(Ri)), Wl[n] = {
                                    i: Vl,
                                    result: t
                                }, t)
                            }

                            function p() {
                                var t, n, a = 233 * Vl + 7;
                                if (t = Wl[a]) return Vl = t.i, t.result;
                                if (n = Wl[t = 233 * Vl + 8]) Vl = n.i, t = n.result; else {
                                    if (n = Vl, e.substr(Vl, 7) === ht) {
                                        var i = ht;
                                        Vl += 7
                                    } else i = et, 0 === Zl && u(Di);
                                    i !== et ? (i = je()) !== et ? (e.substr(Vl, 14) === pt ? (i = pt, Vl += 14) : (i = et, 0 === Zl && u(Gi)), i !== et ? (i = je()) !== et ? (e.substr(Vl, 8) === ft ? (i = ft, Vl += 8) : (i = et, 0 === Zl && u(Mi)), i === et && (e.substr(Vl, 5) === dt ? (i = dt, Vl += 5) : (i = et, 0 === Zl && u(Ui))), i !== et ? (Ql = n, n = ["boundarySpaceDecl", i]) : (Vl = n, n = et)) : (Vl = n, n = et) : (Vl = n, n = et)) : (Vl = n, n = et) : (Vl = n, n = et), Wl[t] = {
                                        i: Vl,
                                        result: n
                                    }, t = n
                                }
                                if (t === et && ((n = Wl[t = 233 * Vl + 9]) ? (Vl = n.i, t = n.result) : (n = Vl, e.substr(Vl, 7) === ht ? (i = ht, Vl += 7) : (i = et, 0 === Zl && u(Di)), i !== et ? (i = je()) !== et ? (e.substr(Vl, 7) === mt ? (i = mt, Vl += 7) : (i = et, 0 === Zl && u(Fi)), i !== et ? (i = je()) !== et ? (e.substr(Vl, 9) === vt ? (i = vt, Vl += 9) : (i = et, 0 === Zl && u(Pi)), i !== et ? (i = je()) !== et ? (i = Ce()) !== et ? (Ql = n, n = ["defaultCollationDecl", i]) : (Vl = n, n = et) : (Vl = n, n = et) : (Vl = n, n = et)) : (Vl = n, n = et) : (Vl = n, n = et)) : (Vl = n, n = et) : (Vl = n, n = et), Wl[t] = {
                                    i: Vl,
                                    result: n
                                }, t = n), t === et && ((n = Wl[t = 233 * Vl + 10]) ? (Vl = n.i, t = n.result) : (n = Vl, e.substr(Vl, 7) === ht ? (i = ht, Vl += 7) : (i = et, 0 === Zl && u(Di)), i !== et ? (i = je()) !== et ? (e.substr(Vl, 8) === gt ? (i = gt, Vl += 8) : (i = et, 0 === Zl && u(Hi)), i !== et ? (i = je()) !== et ? (i = Ce()) !== et ? (Ql = n, n = ["baseUriDecl", i]) : (Vl = n, n = et) : (Vl = n, n = et) : (Vl = n, n = et)) : (Vl = n, n = et) : (Vl = n, n = et), Wl[t] = {
                                    i: Vl,
                                    result: n
                                }, t = n), t === et && ((n = Wl[t = 233 * Vl + 11]) ? (Vl = n.i, t = n.result) : (n = Vl, e.substr(Vl, 7) === ht ? (i = ht, Vl += 7) : (i = et, 0 === Zl && u(Di)), i !== et ? (i = je()) !== et ? (e.substr(Vl, 12) === yt ? (i = yt, Vl += 12) : (i = et, 0 === Zl && u(ji)), i !== et ? (i = je()) !== et ? (e.substr(Vl, 5) === dt ? (i = dt, Vl += 5) : (i = et, 0 === Zl && u(Ui)), i === et && (e.substr(Vl, 8) === ft ? (i = ft, Vl += 8) : (i = et, 0 === Zl && u(Mi))), i !== et ? (Ql = n, n = ["constructionDecl", i]) : (Vl = n, n = et)) : (Vl = n, n = et) : (Vl = n, n = et)) : (Vl = n, n = et) : (Vl = n, n = et), Wl[t] = {
                                    i: Vl,
                                    result: n
                                }, t = n), t === et && ((n = Wl[t = 233 * Vl + 12]) ? (Vl = n.i, t = n.result) : (n = Vl, e.substr(Vl, 7) === ht ? (i = ht, Vl += 7) : (i = et, 0 === Zl && u(Di)), i !== et ? (i = je()) !== et ? (e.substr(Vl, 8) === wt ? (i = wt, Vl += 8) : (i = et, 0 === Zl && u(Xi)), i !== et ? (i = je()) !== et ? (e.substr(Vl, 7) === At ? (i = At, Vl += 7) : (i = et, 0 === Zl && u(_i)), i === et && (e.substr(Vl, 9) === xt ? (i = xt, Vl += 9) : (i = et, 0 === Zl && u(Li))), i !== et ? (Ql = n, n = ["orderingModeDecl", i]) : (Vl = n, n = et)) : (Vl = n, n = et) : (Vl = n, n = et)) : (Vl = n, n = et) : (Vl = n, n = et), Wl[t] = {
                                    i: Vl,
                                    result: n
                                }, t = n), t === et && ((n = Wl[t = 233 * Vl + 13]) ? (Vl = n.i, t = n.result) : (n = Vl, e.substr(Vl, 7) === ht ? (i = ht, Vl += 7) : (i = et, 0 === Zl && u(Di)), i !== et ? (i = je()) !== et ? (e.substr(Vl, 7) === mt ? (i = mt, Vl += 7) : (i = et, 0 === Zl && u(Fi)), i !== et ? (i = je()) !== et ? (e.substr(Vl, 5) === bt ? (i = bt, Vl += 5) : (i = et, 0 === Zl && u(ki)), i !== et ? (i = je()) !== et ? (e.substr(Vl, 5) === Et ? (i = Et, Vl += 5) : (i = et, 0 === Zl && u(Yi)), i !== et ? (i = je()) !== et ? (e.substr(Vl, 8) === Bt ? (i = Bt, Vl += 8) : (i = et, 0 === Zl && u(qi)), i === et && (e.substr(Vl, 5) === Nt ? (i = Nt, Vl += 5) : (i = et, 0 === Zl && u(Vi))), i !== et ? (Ql = n, n = ["emptyOrderDecl", i]) : (Vl = n, n = et)) : (Vl = n, n = et) : (Vl = n, n = et)) : (Vl = n, n = et) : (Vl = n, n = et)) : (Vl = n, n = et) : (Vl = n, n = et)) : (Vl = n, n = et) : (Vl = n, n = et), Wl[t] = {
                                    i: Vl,
                                    result: n
                                }, t = n), t === et)))))) {
                                    var o;
                                    if (n = Wl[t = 233 * Vl + 14]) Vl = n.i, t = n.result; else {
                                        var s;
                                        if (n = Vl, e.substr(Vl, 7) === ht ? (i = ht, Vl += 7) : (i = et, 0 === Zl && u(Di)), i !== et) if ((i = je()) !== et) if (e.substr(Vl, 15) === Ct ? (i = Ct, Vl += 15) : (i = et, 0 === Zl && u(Qi)), i !== et) if ((i = je()) !== et) if ((o = Wl[i = 233 * Vl + 15]) ? (Vl = o.i, i = o.result) : (e.substr(Vl, 8) === ft ? (o = ft, Vl += 8) : (o = et, 0 === Zl && u(Mi)), o === et && (e.substr(Vl, 11) === It ? (o = It, Vl += 11) : (o = et, 0 === Zl && u(Ki))), Wl[i] = {
                                            i: Vl,
                                            result: o
                                        }, i = o), i !== et) if (He(), 44 === e.charCodeAt(Vl) ? (o = Tt, Vl++) : (o = et, 0 === Zl && u(Ji)), o !== et) He(), (s = Wl[o = 233 * Vl + 16]) ? (Vl = s.i, o = s.result) : (e.substr(Vl, 7) === Ot ? (s = Ot, Vl += 7) : (s = et, 0 === Zl && u(zi)), s === et && (e.substr(Vl, 10) === St ? (s = St, Vl += 10) : (s = et, 0 === Zl && u(Zi))), Wl[o] = {
                                            i: Vl,
                                            result: s
                                        }, o = s), o !== et ? (Ql = n, n = ["copyNamespacesDecl", ["preserveMode", i], ["inheritMode", o]]) : (Vl = n, n = et); else Vl = n, n = et; else Vl = n, n = et; else Vl = n, n = et; else Vl = n, n = et; else Vl = n, n = et; else Vl = n, n = et;
                                        Wl[t] = {i: Vl, result: n}, t = n
                                    }
                                    if (t === et) if (n = Wl[t = 233 * Vl + 17]) Vl = n.i, t = n.result; else {
                                        if (n = Vl, e.substr(Vl, 7) === ht ? (i = ht, Vl += 7) : (i = et, 0 === Zl && u(Di)), i !== et) if ((i = je()) !== et) {
                                            if (i = Vl, e.substr(Vl, 14) === Rt ? (o = Rt, Vl += 14) : (o = et, 0 === Zl && u(Wi)), o !== et) if ((s = je()) !== et) {
                                                var l = Be();
                                                l !== et ? (Ql = i, i = ["decimalFormatName"].concat(l)) : (Vl = i, i = et)
                                            } else Vl = i, i = et; else Vl = i, i = et;
                                            if (i === et && (i = Vl, e.substr(Vl, 7) === mt ? (o = mt, Vl += 7) : (o = et, 0 === Zl && u(Fi)), o !== et ? (s = je()) !== et ? (e.substr(Vl, 14) === Rt ? (l = Rt, Vl += 14) : (l = et, 0 === Zl && u(Wi)), l !== et ? (Ql = i, i = null) : (Vl = i, i = et)) : (Vl = i, i = et) : (Vl = i, i = et)), i !== et) {
                                                if (o = [], s = Vl, (l = je()) !== et) if ((l = f()) !== et) {
                                                    var c = je();
                                                    c !== et ? (61 === e.charCodeAt(Vl) ? (c = lt, Vl++) : (c = et, 0 === Zl && u(Si)), c !== et ? (c = je()) !== et ? (c = Ce()) !== et ? (Ql = s, s = r(0, l, c)) : (Vl = s, s = et) : (Vl = s, s = et) : (Vl = s, s = et)) : (Vl = s, s = et)
                                                } else Vl = s, s = et; else Vl = s, s = et;
                                                for (; s !== et;) o.push(s), s = Vl, (l = je()) !== et ? (l = f()) !== et ? (c = je()) !== et ? (61 === e.charCodeAt(Vl) ? (c = lt, Vl++) : (c = et, 0 === Zl && u(Si)), c !== et ? (c = je()) !== et ? (c = Ce()) !== et ? (Ql = s, s = r(0, l, c)) : (Vl = s, s = et) : (Vl = s, s = et) : (Vl = s, s = et)) : (Vl = s, s = et) : (Vl = s, s = et) : (Vl = s, s = et);
                                                Ql = n, n = ["decimalFormatDecl"].concat(i ? [i] : [], o)
                                            } else Vl = n, n = et
                                        } else Vl = n, n = et; else Vl = n, n = et;
                                        Wl[t] = {i: Vl, result: n}, t = n
                                    }
                                }
                                return Wl[a] = {i: Vl, result: t}, t
                            }

                            function f() {
                                var t, n = 233 * Vl + 18;
                                return (t = Wl[n]) ? (Vl = t.i, t.result) : (e.substr(Vl, 17) === Dt ? (t = Dt, Vl += 17) : (t = et, 0 === Zl && u($i)), t === et && (e.substr(Vl, 18) === Gt ? (t = Gt, Vl += 18) : (t = et, 0 === Zl && u(eo)), t === et && (e.substr(Vl, 8) === Mt ? (t = Mt, Vl += 8) : (t = et, 0 === Zl && u(to)), t === et && (e.substr(Vl, 10) === Ut ? (t = Ut, Vl += 10) : (t = et, 0 === Zl && u(no)), t === et && (e.substr(Vl, 3) === Ft ? (t = Ft, Vl += 3) : (t = et, 0 === Zl && u(ro)), t === et && (e.substr(Vl, 7) === Pt ? (t = Pt, Vl += 7) : (t = et, 0 === Zl && u(ao)), t === et && (e.substr(Vl, 9) === Ht ? (t = Ht, Vl += 9) : (t = et, 0 === Zl && u(io)), t === et && (e.substr(Vl, 10) === jt ? (t = jt, Vl += 10) : (t = et, 0 === Zl && u(oo)), t === et && (e.substr(Vl, 5) === Xt ? (t = Xt, Vl += 5) : (t = et, 0 === Zl && u(so)), t === et && (e.substr(Vl, 17) === _t ? (t = _t, Vl += 17) : (t = et, 0 === Zl && u(uo)), t === et && (e.substr(Vl, 18) === Lt ? (t = Lt, Vl += 18) : (t = et, 0 === Zl && u(lo)))))))))))), Wl[n] = {
                                    i: Vl,
                                    result: t
                                }, t)
                            }

                            function d() {
                                var t, n, r, a = 233 * Vl + 19;
                                if (t = Wl[a]) return Vl = t.i, t.result;
                                if (n = Wl[t = 233 * Vl + 20]) Vl = n.i, t = n.result; else {
                                    if (n = Vl, e.substr(Vl, 6) === kt) {
                                        var i = kt;
                                        Vl += 6
                                    } else i = et, 0 === Zl && u(co);
                                    if (i !== et) if ((i = je()) !== et) if (e.substr(Vl, 6) === Yt ? (i = Yt, Vl += 6) : (i = et, 0 === Zl && u(ho)), i !== et) {
                                        i = Vl;
                                        var o = je();
                                        if (o !== et) {
                                            if (r = Wl[o = 233 * Vl + 21]) Vl = r.i, o = r.result; else {
                                                if (r = Vl, e.substr(Vl, 9) === ut) {
                                                    var s = ut;
                                                    Vl += 9
                                                } else s = et, 0 === Zl && u(Oi);
                                                if (s !== et) {
                                                    var l = je();
                                                    if (l !== et) {
                                                        var c = Ge();
                                                        if (c !== et) {
                                                            if (He(), 61 === e.charCodeAt(Vl)) {
                                                                var h = lt;
                                                                Vl++
                                                            } else h = et, 0 === Zl && u(Si);
                                                            h !== et ? (Ql = r, r = ["namespacePrefix", c]) : (Vl = r, r = et)
                                                        } else Vl = r, r = et
                                                    } else Vl = r, r = et
                                                } else Vl = r, r = et;
                                                if (r === et) {
                                                    if (s = r = Vl, e.substr(Vl, 7) === mt ? (l = mt, Vl += 7) : (l = et, 0 === Zl && u(Fi)), l !== et) if ((c = je()) !== et) {
                                                        if (e.substr(Vl, 7) === Vt) {
                                                            var p = Vt;
                                                            Vl += 7
                                                        } else p = et, 0 === Zl && u(fo);
                                                        if (p !== et) if ((h = je()) !== et) {
                                                            if (e.substr(Vl, 9) === ut) {
                                                                var f = ut;
                                                                Vl += 9
                                                            } else f = et, 0 === Zl && u(Oi);
                                                            if (f !== et) {
                                                                var d = Ve();
                                                                d !== et ? s = l = [l, c, p, h, f, d] : (Vl = s, s = et)
                                                            } else Vl = s, s = et
                                                        } else Vl = s, s = et; else Vl = s, s = et
                                                    } else Vl = s, s = et; else Vl = s, s = et;
                                                    s !== et && (Ql = r, s = ["defaultElementNamespace"]), r = s
                                                }
                                                Wl[o] = {i: Vl, result: r}, o = r
                                            }
                                            o !== et ? (Ql = i, i = o) : (Vl = i, i = et)
                                        } else Vl = i, i = et;
                                        if (i === et && (i = null), He(), (o = Ce()) !== et) {
                                            if (r = Vl, (s = je()) !== et) if (e.substr(Vl, 2) === qt ? (s = qt, Vl += 2) : (s = et, 0 === Zl && u(po)), s !== et) if ((s = je()) !== et) if ((s = Ce()) !== et) {
                                                for (l = [], c = Vl, (p = je()) !== et ? (44 === e.charCodeAt(Vl) ? (p = Tt, Vl++) : (p = et, 0 === Zl && u(Ji)), p !== et ? (p = je()) !== et ? (p = Ce()) !== et ? (Ql = c, c = p) : (Vl = c, c = et) : (Vl = c, c = et) : (Vl = c, c = et)) : (Vl = c, c = et); c !== et;) l.push(c), c = Vl, (p = je()) !== et ? (44 === e.charCodeAt(Vl) ? (p = Tt, Vl++) : (p = et, 0 === Zl && u(Ji)), p !== et ? (p = je()) !== et ? (p = Ce()) !== et ? (Ql = c, c = p) : (Vl = c, c = et) : (Vl = c, c = et) : (Vl = c, c = et)) : (Vl = c, c = et);
                                                Ql = r, r = [s].concat(l)
                                            } else Vl = r, r = et; else Vl = r, r = et; else Vl = r, r = et; else Vl = r, r = et;
                                            r === et && (r = null), Ql = n, n = ["schemaImport"].concat(i ? [i] : [], [["targetNamespace", o]], r ? [r] : [])
                                        } else Vl = n, n = et
                                    } else Vl = n, n = et; else Vl = n, n = et; else Vl = n, n = et;
                                    Wl[t] = {i: Vl, result: n}, t = n
                                }
                                if (t === et) if (n = Wl[t = 233 * Vl + 22]) Vl = n.i, t = n.result; else {
                                    if (n = Vl, e.substr(Vl, 6) === kt ? (i = kt, Vl += 6) : (i = et, 0 === Zl && u(co)), i !== et) if ((i = je()) !== et) if (e.substr(Vl, 6) === st ? (i = st, Vl += 6) : (i = et, 0 === Zl && u(Ii)), i !== et) if (i = Vl, (o = je()) !== et ? (e.substr(Vl, 9) === ut ? (o = ut, Vl += 9) : (o = et, 0 === Zl && u(Oi)), o !== et ? (r = je()) !== et ? (s = Vl, (s = (l = Ge()) !== et ? e.substring(s, Vl) : l) !== et ? (He(), 61 === e.charCodeAt(Vl) ? (l = lt, Vl++) : (l = et, 0 === Zl && u(Si)), l !== et ? (Ql = i, i = s) : (Vl = i, i = et)) : (Vl = i, i = et)) : (Vl = i, i = et) : (Vl = i, i = et)) : (Vl = i, i = et), i === et && (i = null), He(), (o = Ce()) !== et) {
                                        if (r = Vl, (s = je()) !== et) if (e.substr(Vl, 2) === qt ? (l = qt, Vl += 2) : (l = et, 0 === Zl && u(po)), l !== et) if ((l = je()) !== et) if ((s = Ce()) !== et) for (r = [], s = Vl, l = He(), 44 === e.charCodeAt(Vl) ? (c = Tt, Vl++) : (c = et, 0 === Zl && u(Ji)), c !== et ? (p = He(), (h = Ce()) !== et ? s = l = [l, c, p, h] : (Vl = s, s = et)) : (Vl = s, s = et); s !== et;) r.push(s), s = Vl, l = He(), 44 === e.charCodeAt(Vl) ? (c = Tt, Vl++) : (c = et, 0 === Zl && u(Ji)), c !== et ? (p = He(), (h = Ce()) !== et ? s = l = [l, c, p, h] : (Vl = s, s = et)) : (Vl = s, s = et); else Vl = r; else Vl = r; else Vl = r; else Vl = r;
                                        Ql = n, n = ["moduleImport", ["namespacePrefix", i], ["targetNamespace", o]]
                                    } else Vl = n, n = et; else Vl = n, n = et; else Vl = n, n = et; else Vl = n, n = et;
                                    Wl[t] = {i: Vl, result: n}, t = n
                                }
                                return Wl[a] = {i: Vl, result: t}, t
                            }

                            function m() {
                                var t, n = 233 * Vl + 23;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                if (t = Vl, e.substr(Vl, 7) === ht) {
                                    var r = ht;
                                    Vl += 7
                                } else r = et, 0 === Zl && u(Di);
                                if (r !== et) if ((r = je()) !== et) if (e.substr(Vl, 9) === ut ? (r = ut, Vl += 9) : (r = et, 0 === Zl && u(Oi)), r !== et) if ((r = je()) !== et) if ((r = Ge()) !== et) {
                                    if (He(), 61 === e.charCodeAt(Vl)) {
                                        var a = lt;
                                        Vl++
                                    } else a = et, 0 === Zl && u(Si);
                                    a !== et ? (He(), (a = Ce()) !== et ? (Ql = t, t = ["namespaceDecl", ["prefix", r], ["uri", a]]) : (Vl = t, t = et)) : (Vl = t, t = et)
                                } else Vl = t, t = et; else Vl = t, t = et; else Vl = t, t = et; else Vl = t, t = et; else Vl = t, t = et;
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function v() {
                                var t, n = 233 * Vl + 24;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                if (t = Vl, e.substr(Vl, 7) === ht) {
                                    var r = ht;
                                    Vl += 7
                                } else r = et, 0 === Zl && u(Di);
                                if (r !== et) if ((r = je()) !== et) if (e.substr(Vl, 7) === mt ? (r = mt, Vl += 7) : (r = et, 0 === Zl && u(Fi)), r !== et) if ((r = je()) !== et) if (e.substr(Vl, 7) === Vt ? (r = Vt, Vl += 7) : (r = et, 0 === Zl && u(fo)), r === et && (e.substr(Vl, 8) === Qt ? (r = Qt, Vl += 8) : (r = et, 0 === Zl && u(mo))), r !== et) {
                                    var a = je();
                                    a !== et ? (e.substr(Vl, 9) === ut ? (a = ut, Vl += 9) : (a = et, 0 === Zl && u(Oi)), a !== et ? (a = je()) !== et ? (a = Ce()) !== et ? (Ql = t, t = ["defaultNamespaceDecl", ["defaultNamespaceCategory", r], ["uri", a]]) : (Vl = t, t = et) : (Vl = t, t = et) : (Vl = t, t = et)) : (Vl = t, t = et)
                                } else Vl = t, t = et; else Vl = t, t = et; else Vl = t, t = et; else Vl = t, t = et; else Vl = t, t = et;
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function g() {
                                var t, n = 233 * Vl + 25;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                if (t = Vl, e.substr(Vl, 7) === ht) {
                                    var r = ht;
                                    Vl += 7
                                } else r = et, 0 === Zl && u(Di);
                                if (r !== et) if ((r = je()) !== et) {
                                    r = [];
                                    var a = Vl, i = w();
                                    if (i === et && (i = y()), i !== et) {
                                        var o = je();
                                        o !== et ? (Ql = a, a = i) : (Vl = a, a = et)
                                    } else Vl = a, a = et;
                                    for (; a !== et;) r.push(a), a = Vl, (i = w()) === et && (i = y()), i !== et ? (o = je()) !== et ? (Ql = a, a = i) : (Vl = a, a = et) : (Vl = a, a = et);
                                    if (i = Wl[a = 233 * Vl + 28]) Vl = i.i, a = i.result; else {
                                        if (i = Vl, e.substr(Vl, 8) === Wt ? (o = Wt, Vl += 8) : (o = et, 0 === Zl && u(Ao)), o !== et) if ((o = je()) !== et) if (36 === e.charCodeAt(Vl) ? (o = $t, Vl++) : (o = et, 0 === Zl && u(xo)), o !== et) if (He(), (o = Be()) !== et) {
                                            var s = Vl;
                                            He();
                                            var l = me();
                                            l !== et ? (Ql = s, s = l) : (Vl = s, s = et), s === et && (s = null);
                                            var c = Vl;
                                            if (He(), e.substr(Vl, 2) === en ? (l = en, Vl += 2) : (l = et, 0 === Zl && u(bo)), l !== et ? (He(), (l = T()) !== et ? (Ql = c, c = ["varValue", l]) : (Vl = c, c = et)) : (Vl = c, c = et), c === et) if (c = Vl, (l = je()) !== et) if (e.substr(Vl, 8) === tn ? (l = tn, Vl += 8) : (l = et, 0 === Zl && u(Eo)), l !== et) {
                                                if (l = Vl, He(), e.substr(Vl, 2) === en) {
                                                    var h = en;
                                                    Vl += 2
                                                } else h = et, 0 === Zl && u(bo);
                                                h !== et ? (He(), (h = T()) !== et ? (Ql = l, l = ["varValue", h]) : (Vl = l, l = et)) : (Vl = l, l = et), l === et && (l = null), Ql = c, c = ["external"].concat(l ? [l] : [])
                                            } else Vl = c, c = et; else Vl = c, c = et;
                                            c !== et ? (Ql = i, i = ["varDecl", ["varName"].concat(o)].concat(s ? [s] : [], [c])) : (Vl = i, i = et)
                                        } else Vl = i, i = et; else Vl = i, i = et; else Vl = i, i = et; else Vl = i, i = et;
                                        Wl[a] = {i: Vl, result: i}, a = i
                                    }
                                    a === et && ((i = Wl[a = 233 * Vl + 30]) ? (Vl = i.i, a = i.result) : (i = Vl, e.substr(Vl, 8) === Qt ? (o = Qt, Vl += 8) : (o = et, 0 === Zl && u(mo)), o !== et ? (o = je()) !== et ? (s = Vl, Zl++, o = qe(), Zl--, o === et ? s = void 0 : (Vl = s, s = et), s !== et ? (o = Be()) !== et ? (He(), 40 === e.charCodeAt(Vl) ? (s = zt, Vl++) : (s = et, 0 === Zl && u(yo)), s !== et ? (He(), (s = x()) === et && (s = null), He(), 41 === e.charCodeAt(Vl) ? (c = Zt, Vl++) : (c = et, 0 === Zl && u(wo)), c !== et ? (c = Vl, (l = je()) !== et ? (e.substr(Vl, 2) === an ? (l = an, Vl += 2) : (l = et, 0 === Zl && u(Co)), l !== et ? (h = je()) !== et ? (l = ve()) !== et ? (Ql = c, c = l) : (Vl = c, c = et) : (Vl = c, c = et) : (Vl = c, c = et)) : (Vl = c, c = et), c === et && (c = null), He(), l = Vl, (h = E()) !== et && (Ql = l, h = ["functionBody", h]), (l = h) === et && (l = Vl, e.substr(Vl, 8) === tn ? (h = tn, Vl += 8) : (h = et, 0 === Zl && u(Eo)), h !== et && (Ql = l, h = ["externalDefinition"]), l = h), l !== et ? (Ql = i, i = ["functionDecl", ["functionName"].concat(o), ["paramList"].concat(s || [])].concat(c ? [["typeDeclaration"].concat(c)] : [], [l])) : (Vl = i, i = et)) : (Vl = i, i = et)) : (Vl = i, i = et)) : (Vl = i, i = et) : (Vl = i, i = et)) : (Vl = i, i = et) : (Vl = i, i = et), Wl[a] = {
                                        i: Vl,
                                        result: i
                                    }, a = i)), a !== et ? (Ql = t, t = [a[0]].concat(r, a.slice(1))) : (Vl = t, t = et)
                                } else Vl = t, t = et; else Vl = t, t = et;
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function y() {
                                var t, n = 233 * Vl + 26;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                if (t = Vl, e.substr(Vl, 8) === Jt) {
                                    var r = Jt;
                                    Vl += 8
                                } else r = et, 0 === Zl && u(vo);
                                return r !== et && (Ql = t, r = ["annotation", ["annotationName", "updating"]]), t = r, Wl[n] = {
                                    i: Vl,
                                    result: t
                                }, t
                            }

                            function w() {
                                var t, n = 233 * Vl + 27;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                if (t = Vl, 37 === e.charCodeAt(Vl)) {
                                    var r = Kt;
                                    Vl++
                                } else r = et, 0 === Zl && u(go);
                                if (r !== et) if (He(), (r = Be()) !== et) {
                                    var a = Vl;
                                    if (He(), 40 === e.charCodeAt(Vl)) {
                                        var i = zt;
                                        Vl++
                                    } else i = et, 0 === Zl && u(yo);
                                    if (i !== et) if (He(), (i = re()) !== et) {
                                        var o = [], s = Vl;
                                        if (He(), 44 === e.charCodeAt(Vl)) {
                                            var l = Tt;
                                            Vl++
                                        } else l = et, 0 === Zl && u(Ji);
                                        for (l !== et ? (He(), (l = re()) !== et ? (Ql = s, s = l) : (Vl = s, s = et)) : (Vl = s, s = et); s !== et;) o.push(s), s = Vl, He(), 44 === e.charCodeAt(Vl) ? (l = Tt, Vl++) : (l = et, 0 === Zl && u(Ji)), l !== et ? (He(), (l = re()) !== et ? (Ql = s, s = l) : (Vl = s, s = et)) : (Vl = s, s = et);
                                        He(), 41 === e.charCodeAt(Vl) ? (s = Zt, Vl++) : (s = et, 0 === Zl && u(wo)), s !== et ? (Ql = a, a = i.concat(o)) : (Vl = a, a = et)
                                    } else Vl = a, a = et; else Vl = a, a = et;
                                    a === et && (a = null), Ql = t, t = ["annotation", ["annotationName"].concat(r)].concat(a ? ["arguments", a] : [])
                                } else Vl = t, t = et; else Vl = t, t = et;
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function A() {
                                var t, n = 233 * Vl + 29;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                if (t = Vl, e.substr(Vl, 7) === ht) {
                                    var r = ht;
                                    Vl += 7
                                } else r = et, 0 === Zl && u(Di);
                                if (r !== et) if ((r = je()) !== et) if (e.substr(Vl, 7) === nn ? (r = nn, Vl += 7) : (r = et, 0 === Zl && u(Bo)), r !== et) if ((r = je()) !== et) if (e.substr(Vl, 4) === rn ? (r = rn, Vl += 4) : (r = et, 0 === Zl && u(No)), r !== et) {
                                    var a = Vl, i = je();
                                    if (i !== et) if (e.substr(Vl, 2) === an ? (r = an, Vl += 2) : (r = et, 0 === Zl && u(Co)), r !== et) {
                                        var o = ge();
                                        o !== et || (Vl = a)
                                    } else Vl = a; else Vl = a;
                                    if (i = Vl, r = He(), e.substr(Vl, 2) === en ? (o = en, Vl += 2) : (o = et, 0 === Zl && u(bo)), o !== et) {
                                        a = He();
                                        var s = T();
                                        s !== et ? i = r = [r, o, a, s] : (Vl = i, i = et)
                                    } else Vl = i, i = et;
                                    if (i === et) if (i = Vl, (r = je()) !== et) if (e.substr(Vl, 8) === tn ? (o = tn, Vl += 8) : (o = et, 0 === Zl && u(Eo)), o !== et) {
                                        if (a = Vl, s = He(), e.substr(Vl, 2) === en ? (i = en, Vl += 2) : (i = et, 0 === Zl && u(bo)), i !== et) {
                                            var l = He(), c = T();
                                            c !== et ? a = s = [s, i, l, c] : (Vl = a, a = et)
                                        } else Vl = a, a = et;
                                        a === et && (a = null), i = r = [r, o, a]
                                    } else Vl = i, i = et; else Vl = i, i = et;
                                    i !== et ? (Ql = t, t = {type: "contextItemDecl"}) : (Vl = t, t = et)
                                } else Vl = t, t = et; else Vl = t, t = et; else Vl = t, t = et; else Vl = t, t = et; else Vl = t, t = et;
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function x() {
                                var t, n = 233 * Vl + 31;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                t = Vl;
                                var r = b();
                                if (r !== et) {
                                    var a = [], i = Vl;
                                    if (He(), 44 === e.charCodeAt(Vl)) {
                                        var o = Tt;
                                        Vl++
                                    } else o = et, 0 === Zl && u(Ji);
                                    for (o !== et ? (He(), (o = b()) !== et ? (Ql = i, i = o) : (Vl = i, i = et)) : (Vl = i, i = et); i !== et;) a.push(i), i = Vl, He(), 44 === e.charCodeAt(Vl) ? (o = Tt, Vl++) : (o = et, 0 === Zl && u(Ji)), o !== et ? (He(), (o = b()) !== et ? (Ql = i, i = o) : (Vl = i, i = et)) : (Vl = i, i = et);
                                    Ql = t, t = [r].concat(a)
                                } else Vl = t, t = et;
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function b() {
                                var t, n = 233 * Vl + 32;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                if (t = Vl, 36 === e.charCodeAt(Vl)) {
                                    var r = $t;
                                    Vl++
                                } else r = et, 0 === Zl && u(xo);
                                if (r !== et) if ((r = Be()) !== et) {
                                    var a = Vl, i = je();
                                    i !== et ? (i = me()) !== et ? (Ql = a, a = i) : (Vl = a, a = et) : (Vl = a, a = et), a === et && (a = null), Ql = t, t = ["param", ["varName"].concat(r)].concat(a ? [a] : [])
                                } else Vl = t, t = et; else Vl = t, t = et;
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function E() {
                                var e, t = 233 * Vl + 33;
                                if (e = Wl[t]) return Vl = e.i, e.result;
                                e = Vl;
                                var n = B();
                                return n !== et && (Ql = e, n = n || ["sequenceExpr"]), e = n, Wl[t] = {i: Vl, result: e}, e
                            }

                            function B() {
                                var t, n = 233 * Vl + 34;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                if (t = Vl, 123 === e.charCodeAt(Vl)) {
                                    var r = on;
                                    Vl++
                                } else r = et, 0 === Zl && u(To);
                                if (r !== et) {
                                    if (He(), (r = C()) === et && (r = null), He(), 125 === e.charCodeAt(Vl)) {
                                        var a = sn;
                                        Vl++
                                    } else a = et, 0 === Zl && u(Io);
                                    a !== et ? (Ql = t, t = r || null) : (Vl = t, t = et)
                                } else Vl = t, t = et;
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function N() {
                                var t, n = 233 * Vl + 35;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                if (t = Vl, e.substr(Vl, 7) === ht) {
                                    var r = ht;
                                    Vl += 7
                                } else r = et, 0 === Zl && u(Di);
                                return r !== et ? (r = je()) !== et ? (e.substr(Vl, 6) === un ? (r = un, Vl += 6) : (r = et, 0 === Zl && u(Oo)), r !== et ? (r = je()) !== et ? (r = Be()) !== et ? (r = je()) !== et ? (r = Ce()) !== et ? (Ql = t, t = {type: "optionDecl"}) : (Vl = t, t = et) : (Vl = t, t = et) : (Vl = t, t = et) : (Vl = t, t = et) : (Vl = t, t = et)) : (Vl = t, t = et) : (Vl = t, t = et), Wl[n] = {
                                    i: Vl,
                                    result: t
                                }, t
                            }

                            function C() {
                                var t, n = 233 * Vl + 37;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                t = Vl;
                                var r = T();
                                if (r !== et) {
                                    var a = [], i = Vl;
                                    if (He(), 44 === e.charCodeAt(Vl)) {
                                        var o = Tt;
                                        Vl++
                                    } else o = et, 0 === Zl && u(Ji);
                                    for (o !== et ? (He(), (o = T()) !== et ? (Ql = i, i = o) : (Vl = i, i = et)) : (Vl = i, i = et); i !== et;) a.push(i), i = Vl, He(), 44 === e.charCodeAt(Vl) ? (o = Tt, Vl++) : (o = et, 0 === Zl && u(Ji)), o !== et ? (He(), (o = T()) !== et ? (Ql = i, i = o) : (Vl = i, i = et)) : (Vl = i, i = et);
                                    Ql = t, t = 0 === a.length ? r : ["sequenceExpr", r].concat(a)
                                } else Vl = t, t = et;
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function T() {
                                var t = 233 * Vl + 38, n = Wl[t];
                                if (n) return Vl = n.i, n.result;
                                var r = Vl, a = 233 * Vl + 39, i = Wl[a];
                                if (i) {
                                    Vl = i.i;
                                    var o = i.result
                                } else {
                                    var s = Vl, l = I();
                                    if (l !== et) {
                                        var c = [], h = Vl, p = He(), f = O();
                                        for (f !== et ? (Ql = h, h = f) : (Vl = h, h = et); h !== et;) c.push(h), h = Vl, p = He(), (f = O()) !== et ? (Ql = h, h = f) : (Vl = h, h = et);
                                        h = He();
                                        var d = 233 * Vl + 58, m = Wl[d];
                                        if (m) Vl = m.i, p = m.result; else {
                                            var v = Vl;
                                            if (e.substr(Vl, 6) === wn) {
                                                var g = wn;
                                                Vl += 6
                                            } else g = et, 0 === Zl && u(Xo);
                                            if (g !== et) {
                                                He();
                                                var y = T();
                                                y !== et ? (Ql = v, v = ["returnClause", y]) : (Vl = v, v = et)
                                            } else Vl = v, v = et;
                                            Wl[d] = {i: Vl, result: v}, p = v
                                        }
                                        p !== et ? (Ql = s, s = ["flworExpr", l].concat(c, [p])) : (Vl = s, s = et)
                                    } else Vl = s, s = et;
                                    Wl[a] = {i: Vl, result: s}, o = s
                                }
                                if (o !== et && (Ql = r, o = $e(o)), (r = o) === et) {
                                    r = Vl;
                                    var w = 233 * Vl + 59, A = Wl[w];
                                    if (A) Vl = A.i, o = A.result; else {
                                        var x = Vl;
                                        if (e.substr(Vl, 4) === An) {
                                            var b = An;
                                            Vl += 4
                                        } else b = et, 0 === Zl && u(_o);
                                        if (b === et && (e.substr(Vl, 5) === xn ? (b = xn, Vl += 5) : (b = et, 0 === Zl && u(Lo))), b !== et) if (je() !== et) {
                                            var E = 233 * Vl + 60, B = Wl[E];
                                            if (B) {
                                                Vl = B.i;
                                                var N = B.result
                                            } else {
                                                var S = Vl, R = M();
                                                if (R !== et) {
                                                    var D = [], G = Vl;
                                                    if (He(), 44 === e.charCodeAt(Vl)) {
                                                        var P = Tt;
                                                        Vl++
                                                    } else P = et, 0 === Zl && u(Ji);
                                                    if (P !== et) {
                                                        He();
                                                        var H = M();
                                                        H !== et ? (Ql = G, G = H) : (Vl = G, G = et)
                                                    } else Vl = G, G = et;
                                                    for (; G !== et;) D.push(G), G = Vl, He(), 44 === e.charCodeAt(Vl) ? (P = Tt, Vl++) : (P = et, 0 === Zl && u(Ji)), P !== et ? (He(), (H = M()) !== et ? (Ql = G, G = H) : (Vl = G, G = et)) : (Vl = G, G = et);
                                                    Ql = S, S = [R].concat(D)
                                                } else Vl = S, S = et;
                                                Wl[E] = {i: Vl, result: S}, N = S
                                            }
                                            if (N !== et) if (je() !== et) {
                                                if (e.substr(Vl, 9) === bn) {
                                                    var j = bn;
                                                    Vl += 9
                                                } else j = et, 0 === Zl && u(ko);
                                                if (j !== et) if (je() !== et) {
                                                    var X = T();
                                                    X !== et ? (Ql = x, x = ["quantifiedExpr", ["quantifier", b]].concat(N, [["predicateExpr", X]])) : (Vl = x, x = et)
                                                } else Vl = x, x = et; else Vl = x, x = et
                                            } else Vl = x, x = et; else Vl = x, x = et
                                        } else Vl = x, x = et; else Vl = x, x = et;
                                        Wl[w] = {i: Vl, result: x}, o = x
                                    }
                                    if (o !== et && (Ql = r, o = $e(o)), (r = o) === et) {
                                        r = Vl;
                                        var _ = 233 * Vl + 62, L = Wl[_];
                                        if (L) Vl = L.i, o = L.result; else {
                                            var k = Vl;
                                            if (e.substr(Vl, 10) === En) {
                                                var Y = En;
                                                Vl += 10
                                            } else Y = et, 0 === Zl && u(Yo);
                                            if (Y !== et) {
                                                if (He(), 40 === e.charCodeAt(Vl)) {
                                                    var q = zt;
                                                    Vl++
                                                } else q = et, 0 === Zl && u(yo);
                                                if (q !== et) {
                                                    var V = C();
                                                    if (V !== et) {
                                                        if (41 === e.charCodeAt(Vl)) {
                                                            var Q = Zt;
                                                            Vl++
                                                        } else Q = et, 0 === Zl && u(wo);
                                                        if (Q !== et) {
                                                            He();
                                                            var J = [], K = Vl, z = U();
                                                            if (z !== et) {
                                                                var Z = He();
                                                                Ql = K, K = z
                                                            } else Vl = K, K = et;
                                                            if (K !== et) for (; K !== et;) J.push(K), K = Vl, (z = U()) !== et ? (Z = He(), Ql = K, K = z) : (Vl = K, K = et); else J = et;
                                                            if (J !== et) if (e.substr(Vl, 7) === mt ? (K = mt, Vl += 7) : (K = et, 0 === Zl && u(Fi)), K !== et) if ((z = je()) !== et) {
                                                                if (Z = Vl, 36 === e.charCodeAt(Vl)) {
                                                                    var W = $t;
                                                                    Vl++
                                                                } else W = et, 0 === Zl && u(xo);
                                                                if (W !== et) {
                                                                    var $ = Be();
                                                                    if ($ !== et) {
                                                                        var ee = je();
                                                                        ee !== et ? (Ql = Z, Z = $) : (Vl = Z, Z = et)
                                                                    } else Vl = Z, Z = et
                                                                } else Vl = Z, Z = et;
                                                                Z === et && (Z = null), e.substr(Vl, 6) === wn ? (W = wn, Vl += 6) : (W = et, 0 === Zl && u(Xo)), W !== et ? ($ = je()) !== et ? (ee = T()) !== et ? (Ql = k, k = ["typeswitchExpr", ["argExpr", V]].concat(J, [["typeswitchExprDefaultClause"].concat(Z || [], [["resultExpr", ee]])])) : (Vl = k, k = et) : (Vl = k, k = et) : (Vl = k, k = et)
                                                            } else Vl = k, k = et; else Vl = k, k = et; else Vl = k, k = et
                                                        } else Vl = k, k = et
                                                    } else Vl = k, k = et
                                                } else Vl = k, k = et
                                            } else Vl = k, k = et;
                                            Wl[_] = {i: Vl, result: k}, o = k
                                        }
                                        if (o !== et && (Ql = r, o = $e(o)), (r = o) === et) {
                                            r = Vl;
                                            var te = 233 * Vl + 65, ne = Wl[te];
                                            if (ne) Vl = ne.i, o = ne.result; else {
                                                var re = Vl;
                                                if (e.substr(Vl, 2) === Cn) {
                                                    var ae = Cn;
                                                    Vl += 2
                                                } else ae = et, 0 === Zl && u(Qo);
                                                if (ae !== et) {
                                                    if (He(), 40 === e.charCodeAt(Vl)) {
                                                        var ie = zt;
                                                        Vl++
                                                    } else ie = et, 0 === Zl && u(yo);
                                                    if (ie !== et) {
                                                        He();
                                                        var oe = C();
                                                        if (oe !== et) {
                                                            if (He(), 41 === e.charCodeAt(Vl)) {
                                                                var se = Zt;
                                                                Vl++
                                                            } else se = et, 0 === Zl && u(wo);
                                                            if (se !== et) {
                                                                if (He(), e.substr(Vl, 4) === Tn) {
                                                                    var ue = Tn;
                                                                    Vl += 4
                                                                } else ue = et, 0 === Zl && u(Jo);
                                                                if (ue !== et) if (Ve() !== et) {
                                                                    He();
                                                                    var le = T();
                                                                    if (le !== et) {
                                                                        if (He(), e.substr(Vl, 4) === In) {
                                                                            var ce = In;
                                                                            Vl += 4
                                                                        } else ce = et, 0 === Zl && u(Ko);
                                                                        if (ce !== et) if (Ve() !== et) {
                                                                            He();
                                                                            var he = T();
                                                                            he !== et ? (Ql = re, re = ["ifThenElseExpr", ["ifClause", oe], ["thenClause", le], ["elseClause", he]]) : (Vl = re, re = et)
                                                                        } else Vl = re, re = et; else Vl = re, re = et
                                                                    } else Vl = re, re = et
                                                                } else Vl = re, re = et; else Vl = re, re = et
                                                            } else Vl = re, re = et
                                                        } else Vl = re, re = et
                                                    } else Vl = re, re = et
                                                } else Vl = re, re = et;
                                                Wl[te] = {i: Vl, result: re}, o = re
                                            }
                                            if (o !== et && (Ql = r, o = $e(o)), (r = o) === et) {
                                                r = Vl;
                                                var pe = 233 * Vl + 214, fe = Wl[pe];
                                                if (fe) Vl = fe.i, o = fe.result; else {
                                                    var de = Vl;
                                                    if (e.substr(Vl, 6) === ja) {
                                                        var me = ja;
                                                        Vl += 6
                                                    } else me = et, 0 === Zl && u(Bl);
                                                    if (me !== et) if (je() !== et) {
                                                        if (e.substr(Vl, 5) === Xa) {
                                                            var ve = Xa;
                                                            Vl += 5
                                                        } else ve = et, 0 === Zl && u(Nl);
                                                        if (ve === et && (e.substr(Vl, 4) === _a ? (ve = _a, Vl += 4) : (ve = et, 0 === Zl && u(Cl))), ve !== et) if (je() !== et) {
                                                            var ge = T();
                                                            if (ge !== et) if (je() !== et) {
                                                                var ye, we = 233 * Vl + 213, Ae = Wl[we];
                                                                if (Ae) {
                                                                    Vl = Ae.i;
                                                                    var xe = Ae.result
                                                                } else {
                                                                    var be = ye = Vl;
                                                                    if (e.substr(Vl, 2) === an) {
                                                                        var Ee = an;
                                                                        Vl += 2
                                                                    } else Ee = et, 0 === Zl && u(Co);
                                                                    if (Ee !== et) if (je() !== et) {
                                                                        var Ne = Vl;
                                                                        if (e.substr(Vl, 5) === Ma) {
                                                                            var Ce = Ma;
                                                                            Vl += 5
                                                                        } else Ce = et, 0 === Zl && u(wl);
                                                                        Ce !== et && (Ql = Ne, Ce = ["insertAsFirst"]), (Ne = Ce) === et && (Ne = Vl, e.substr(Vl, 4) === Ua ? (Ce = Ua, Vl += 4) : (Ce = et, 0 === Zl && u(Al)), Ce !== et && (Ql = Ne, Ce = ["insertAsLast"]), Ne = Ce), Ne !== et ? (Ce = je()) !== et ? (Ql = be, be = Ne) : (Vl = be, be = et) : (Vl = be, be = et)
                                                                    } else Vl = be, be = et; else Vl = be, be = et;
                                                                    be === et && (be = null), e.substr(Vl, 4) === Fa ? (Ee = Fa, Vl += 4) : (Ee = et, 0 === Zl && u(xl)), Ee !== et ? (Ql = ye, ye = be ? ["insertInto", be] : ["insertInto"]) : (Vl = ye, ye = et), ye === et && (ye = Vl, e.substr(Vl, 5) === Pa ? (be = Pa, Vl += 5) : (be = et, 0 === Zl && u(bl)), be !== et && (Ql = ye, be = ["insertAfter"]), (ye = be) === et && (ye = Vl, e.substr(Vl, 6) === Ha ? (be = Ha, Vl += 6) : (be = et, 0 === Zl && u(El)), be !== et && (Ql = ye, be = ["insertBefore"]), ye = be)), Wl[we] = {
                                                                        i: Vl,
                                                                        result: ye
                                                                    }, xe = ye
                                                                }
                                                                if (xe !== et) if (je() !== et) {
                                                                    var Te = T();
                                                                    Te !== et ? (Ql = de, de = ["insertExpr", ["sourceExpr", ge], xe, ["targetExpr", Te]]) : (Vl = de, de = et)
                                                                } else Vl = de, de = et; else Vl = de, de = et
                                                            } else Vl = de, de = et; else Vl = de, de = et
                                                        } else Vl = de, de = et; else Vl = de, de = et
                                                    } else Vl = de, de = et; else Vl = de, de = et;
                                                    Wl[pe] = {i: Vl, result: de}, o = de
                                                }
                                                if (o !== et && (Ql = r, o = $e(o)), (r = o) === et) {
                                                    r = Vl;
                                                    var Ie = 233 * Vl + 215, Oe = Wl[Ie];
                                                    if (Oe) Vl = Oe.i, o = Oe.result; else {
                                                        var Se = Vl;
                                                        if (e.substr(Vl, 6) === La) {
                                                            var Re = La;
                                                            Vl += 6
                                                        } else Re = et, 0 === Zl && u(Tl);
                                                        if (Re !== et) if (je() !== et) {
                                                            if (e.substr(Vl, 5) === Xa) {
                                                                var De = Xa;
                                                                Vl += 5
                                                            } else De = et, 0 === Zl && u(Nl);
                                                            if (De === et && (e.substr(Vl, 4) === _a ? (De = _a, Vl += 4) : (De = et, 0 === Zl && u(Cl))), De !== et) if (je() !== et) {
                                                                var Ge = T();
                                                                Ge !== et ? (Ql = Se, Se = ["deleteExpr", ["targetExpr", Ge]]) : (Vl = Se, Se = et)
                                                            } else Vl = Se, Se = et; else Vl = Se, Se = et
                                                        } else Vl = Se, Se = et; else Vl = Se, Se = et;
                                                        Wl[Ie] = {i: Vl, result: Se}, o = Se
                                                    }
                                                    if (o !== et && (Ql = r, o = $e(o)), (r = o) === et) {
                                                        r = Vl;
                                                        var Me = 233 * Vl + 217, Ue = Wl[Me];
                                                        if (Ue) Vl = Ue.i, o = Ue.result; else {
                                                            var Fe = Vl;
                                                            if (e.substr(Vl, 6) === Va) {
                                                                var Xe = Va;
                                                                Vl += 6
                                                            } else Xe = et, 0 === Zl && u(Rl);
                                                            if (Xe !== et) if (je() !== et) {
                                                                if (e.substr(Vl, 4) === _a) {
                                                                    var _e = _a;
                                                                    Vl += 4
                                                                } else _e = et, 0 === Zl && u(Cl);
                                                                if (_e !== et) {
                                                                    He();
                                                                    var Le = T();
                                                                    if (Le !== et) if (je() !== et) {
                                                                        if (e.substr(Vl, 2) === an) {
                                                                            var ke = an;
                                                                            Vl += 2
                                                                        } else ke = et, 0 === Zl && u(Co);
                                                                        if (ke !== et) if (je() !== et) {
                                                                            var Ye = T();
                                                                            Ye !== et ? (Ql = Fe, Fe = ["renameExpr", ["targetExpr", Le], ["newNameExpr", Ye]]) : (Vl = Fe, Fe = et)
                                                                        } else Vl = Fe, Fe = et; else Vl = Fe, Fe = et
                                                                    } else Vl = Fe, Fe = et; else Vl = Fe, Fe = et
                                                                } else Vl = Fe, Fe = et
                                                            } else Vl = Fe, Fe = et; else Vl = Fe, Fe = et;
                                                            Wl[Me] = {i: Vl, result: Fe}, o = Fe
                                                        }
                                                        if (o !== et && (Ql = r, o = $e(o)), (r = o) === et) {
                                                            r = Vl;
                                                            var qe = 233 * Vl + 216, Je = Wl[qe];
                                                            if (Je) Vl = Je.i, o = Je.result; else {
                                                                var Ke = Vl;
                                                                if (e.substr(Vl, 7) === ka) {
                                                                    var ze = ka;
                                                                    Vl += 7
                                                                } else ze = et, 0 === Zl && u(Il);
                                                                if (ze !== et) if (je() !== et) {
                                                                    var Ze = Vl;
                                                                    if (e.substr(Vl, 5) === Ya) {
                                                                        var We = Ya;
                                                                        Vl += 5
                                                                    } else We = et, 0 === Zl && u(Ol);
                                                                    if (We !== et) {
                                                                        var tt = je();
                                                                        if (tt !== et) {
                                                                            if (e.substr(Vl, 2) === kn) {
                                                                                var nt = kn;
                                                                                Vl += 2
                                                                            } else nt = et, 0 === Zl && u(cs);
                                                                            if (nt !== et) {
                                                                                var rt = je();
                                                                                rt !== et ? Ze = We = [We, tt, nt, rt] : (Vl = Ze, Ze = et)
                                                                            } else Vl = Ze, Ze = et
                                                                        } else Vl = Ze, Ze = et
                                                                    } else Vl = Ze, Ze = et;
                                                                    if (Ze === et && (Ze = null), e.substr(Vl, 4) === _a ? (We = _a, Vl += 4) : (We = et, 0 === Zl && u(Cl)), We !== et) if ((tt = je()) !== et) if ((nt = T()) !== et) if ((rt = je()) !== et) {
                                                                        if (e.substr(Vl, 4) === qa) {
                                                                            var at = qa;
                                                                            Vl += 4
                                                                        } else at = et, 0 === Zl && u(Sl);
                                                                        if (at !== et) if (je() !== et) {
                                                                            var it = T();
                                                                            it !== et ? (Ql = Ke, Ke = Ze ? ["replaceExpr", ["replaceValue"], ["targetExpr", nt], ["replacementExpr", it]] : ["replaceExpr", ["targetExpr", nt], ["replacementExpr", it]]) : (Vl = Ke, Ke = et)
                                                                        } else Vl = Ke, Ke = et; else Vl = Ke, Ke = et
                                                                    } else Vl = Ke, Ke = et; else Vl = Ke, Ke = et; else Vl = Ke, Ke = et; else Vl = Ke, Ke = et
                                                                } else Vl = Ke, Ke = et; else Vl = Ke, Ke = et;
                                                                Wl[qe] = {i: Vl, result: Ke}, o = Ke
                                                            }
                                                            if (o !== et && (Ql = r, o = $e(o)), (r = o) === et) {
                                                                r = Vl;
                                                                var ot = 233 * Vl + 218, st = Wl[ot];
                                                                if (st) Vl = st.i, o = st.result; else {
                                                                    var ut = Vl;
                                                                    if (e.substr(Vl, 4) === Qa) {
                                                                        var lt = Qa;
                                                                        Vl += 4
                                                                    } else lt = et, 0 === Zl && u(Dl);
                                                                    if (lt !== et) if (je() !== et) {
                                                                        var ct = Pe();
                                                                        if (ct !== et) {
                                                                            var ht = [], pt = Vl, ft = He();
                                                                            if (44 === e.charCodeAt(Vl)) {
                                                                                var dt = Tt;
                                                                                Vl++
                                                                            } else dt = et, 0 === Zl && u(Ji);
                                                                            if (dt !== et) {
                                                                                var vt = He(), gt = Pe();
                                                                                gt !== et ? (Ql = pt, pt = gt) : (Vl = pt, pt = et)
                                                                            } else Vl = pt, pt = et;
                                                                            for (; pt !== et;) ht.push(pt), pt = Vl, ft = He(), 44 === e.charCodeAt(Vl) ? (dt = Tt, Vl++) : (dt = et, 0 === Zl && u(Ji)), dt !== et ? (vt = He(), (gt = Pe()) !== et ? (Ql = pt, pt = gt) : (Vl = pt, pt = et)) : (Vl = pt, pt = et);
                                                                            if (pt = He(), e.substr(Vl, 6) === Ja ? (ft = Ja, Vl += 6) : (ft = et, 0 === Zl && u(Gl)), ft !== et) if ((dt = je()) !== et) if ((vt = T()) !== et) if ((gt = je()) !== et) {
                                                                                if (e.substr(Vl, 6) === wn) {
                                                                                    var yt = wn;
                                                                                    Vl += 6
                                                                                } else yt = et, 0 === Zl && u(Xo);
                                                                                if (yt !== et) if (je() !== et) {
                                                                                    var wt = T();
                                                                                    wt !== et ? (Ql = ut, ut = ["transformExpr", ["transformCopies", ct].concat(ht), ["modifyExpr", vt], ["returnExpr", wt]]) : (Vl = ut, ut = et)
                                                                                } else Vl = ut, ut = et; else Vl = ut, ut = et
                                                                            } else Vl = ut, ut = et; else Vl = ut, ut = et; else Vl = ut, ut = et; else Vl = ut, ut = et
                                                                        } else Vl = ut, ut = et
                                                                    } else Vl = ut, ut = et; else Vl = ut, ut = et;
                                                                    Wl[ot] = {i: Vl, result: ut}, o = ut
                                                                }
                                                                if (o !== et && (Ql = r, o = $e(o)), (r = o) === et) {
                                                                    r = Vl;
                                                                    var At = 233 * Vl + 66, xt = Wl[At];
                                                                    if (xt) Vl = xt.i, o = xt.result; else {
                                                                        var bt = Vl, Et = F();
                                                                        if (Et !== et) {
                                                                            var Bt = [], Nt = Vl;
                                                                            if (He(), e.substr(Vl, 2) === On) {
                                                                                var Ct = On;
                                                                                Vl += 2
                                                                            } else Ct = et, 0 === Zl && u(zo);
                                                                            if (Ct !== et) {
                                                                                var It = Ve();
                                                                                if (It !== et) {
                                                                                    He();
                                                                                    var Ot = F();
                                                                                    Ot !== et ? (Ql = Nt, Nt = Ot) : (Vl = Nt, Nt = et)
                                                                                } else Vl = Nt, Nt = et
                                                                            } else Vl = Nt, Nt = et;
                                                                            for (; Nt !== et;) Bt.push(Nt), Nt = Vl, He(), e.substr(Vl, 2) === On ? (Ct = On, Vl += 2) : (Ct = et, 0 === Zl && u(zo)), Ct !== et ? (It = Ve()) !== et ? (He(), (Ot = F()) !== et ? (Ql = Nt, Nt = Ot) : (Vl = Nt, Nt = et)) : (Vl = Nt, Nt = et) : (Vl = Nt, Nt = et);
                                                                            Ql = bt, bt = Qe("orOp", Et, Bt)
                                                                        } else Vl = bt, bt = et;
                                                                        Wl[At] = {i: Vl, result: bt}, o = bt
                                                                    }
                                                                    o !== et && (Ql = r, o = $e(o)), r = o
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                return Wl[t] = {i: Vl, result: r}, r
                            }

                            function I() {
                                var t, n, r = 233 * Vl + 40;
                                if (t = Wl[r]) return Vl = t.i, t.result;
                                if (n = Wl[t = 233 * Vl + 42]) Vl = n.i, t = n.result; else {
                                    if (n = Vl, e.substr(Vl, 3) === ln) {
                                        var a = ln;
                                        Vl += 3
                                    } else a = et, 0 === Zl && u(So);
                                    if (a !== et) if ((a = je()) !== et) if ((a = S()) !== et) {
                                        var i = [], o = Vl;
                                        if (He(), 44 === e.charCodeAt(Vl)) {
                                            var s = Tt;
                                            Vl++
                                        } else s = et, 0 === Zl && u(Ji);
                                        for (s !== et ? (He(), (s = S()) !== et ? (Ql = o, o = s) : (Vl = o, o = et)) : (Vl = o, o = et); o !== et;) i.push(o), o = Vl, He(), 44 === e.charCodeAt(Vl) ? (s = Tt, Vl++) : (s = et, 0 === Zl && u(Ji)), s !== et ? (He(), (s = S()) !== et ? (Ql = o, o = s) : (Vl = o, o = et)) : (Vl = o, o = et);
                                        Ql = n, n = ["forClause", a].concat(i)
                                    } else Vl = n, n = et; else Vl = n, n = et; else Vl = n, n = et;
                                    Wl[t] = {i: Vl, result: n}, t = n
                                }
                                if (t === et) if (n = Wl[t = 233 * Vl + 46]) Vl = n.i, t = n.result; else {
                                    if (n = Vl, e.substr(Vl, 3) === pn ? (a = pn, Vl += 3) : (a = et, 0 === Zl && u(Go)), a !== et) if (He(), (a = R()) !== et) {
                                        for (He(), i = [], o = Vl, 44 === e.charCodeAt(Vl) ? (s = Tt, Vl++) : (s = et, 0 === Zl && u(Ji)), s !== et ? (He(), (s = R()) !== et ? (Ql = o, o = s) : (Vl = o, o = et)) : (Vl = o, o = et); o !== et;) i.push(o), o = Vl, 44 === e.charCodeAt(Vl) ? (s = Tt, Vl++) : (s = et, 0 === Zl && u(Ji)), s !== et ? (He(), (s = R()) !== et ? (Ql = o, o = s) : (Vl = o, o = et)) : (Vl = o, o = et);
                                        Ql = n, n = ["letClause", a].concat(i)
                                    } else Vl = n, n = et; else Vl = n, n = et;
                                    Wl[t] = {i: Vl, result: n}, t = n
                                }
                                return Wl[r] = {i: Vl, result: t}, t
                            }

                            function O() {
                                var t, n = 233 * Vl + 41;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                if ((t = I()) === et) {
                                    var r;
                                    if (r = Wl[t = 233 * Vl + 48]) Vl = r.i, t = r.result; else {
                                        if (r = Vl, e.substr(Vl, 5) === fn) {
                                            var a = fn;
                                            Vl += 5
                                        } else a = et, 0 === Zl && u(Mo);
                                        a !== et ? (a = Ve()) !== et ? (He(), (a = T()) !== et ? (Ql = r, r = ["whereClause", a]) : (Vl = r, r = et)) : (Vl = r, r = et) : (Vl = r, r = et), Wl[t] = {
                                            i: Vl,
                                            result: r
                                        }, t = r
                                    }
                                    if (t === et) {
                                        if (r = Wl[t = 233 * Vl + 49]) Vl = r.i, t = r.result; else {
                                            if (r = Vl, e.substr(Vl, 5) === dn ? (a = dn, Vl += 5) : (a = et, 0 === Zl && u(Uo)), a !== et) if ((a = je()) !== et) if (e.substr(Vl, 2) === mn ? (a = mn, Vl += 2) : (a = et, 0 === Zl && u(Fo)), a !== et) {
                                                var i;
                                                if (He(), i = Wl[a = 233 * Vl + 50]) Vl = i.i, a = i.result; else {
                                                    i = Vl;
                                                    var o = D();
                                                    if (o !== et) {
                                                        var s = [], l = Vl;
                                                        if (He(), 44 === e.charCodeAt(Vl)) {
                                                            var c = Tt;
                                                            Vl++
                                                        } else c = et, 0 === Zl && u(Ji);
                                                        for (c !== et ? (He(), (c = D()) !== et ? (Ql = l, l = c) : (Vl = l, l = et)) : (Vl = l, l = et); l !== et;) s.push(l), l = Vl, He(), 44 === e.charCodeAt(Vl) ? (c = Tt, Vl++) : (c = et, 0 === Zl && u(Ji)), c !== et ? (He(), (c = D()) !== et ? (Ql = l, l = c) : (Vl = l, l = et)) : (Vl = l, l = et);
                                                        Ql = i, i = [o].concat(s)
                                                    } else Vl = i, i = et;
                                                    Wl[a] = {i: Vl, result: i}, a = i
                                                }
                                                a !== et ? (Ql = r, r = ["groupByClause"].concat(a)) : (Vl = r, r = et)
                                            } else Vl = r, r = et; else Vl = r, r = et; else Vl = r, r = et;
                                            Wl[t] = {i: Vl, result: r}, t = r
                                        }
                                        if (t === et) if (r = Wl[t = 233 * Vl + 54]) Vl = r.i, t = r.result; else {
                                            if (a = r = Vl, e.substr(Vl, 5) === bt ? (i = bt, Vl += 5) : (i = et, 0 === Zl && u(ki)), i !== et ? (i = je()) !== et ? (e.substr(Vl, 2) === mn ? (i = mn, Vl += 2) : (i = et, 0 === Zl && u(Fo)), i !== et ? (Ql = a, a = !1) : (Vl = a, a = et)) : (Vl = a, a = et) : (Vl = a, a = et), a === et && (a = Vl, e.substr(Vl, 6) === vn ? (i = vn, Vl += 6) : (i = et, 0 === Zl && u(Po)), i !== et ? (i = je()) !== et ? (e.substr(Vl, 5) === bt ? (i = bt, Vl += 5) : (i = et, 0 === Zl && u(ki)), i !== et ? (i = je()) !== et ? (e.substr(Vl, 2) === mn ? (i = mn, Vl += 2) : (i = et, 0 === Zl && u(Fo)), i !== et ? (Ql = a, a = !0) : (Vl = a, a = et)) : (Vl = a, a = et) : (Vl = a, a = et)) : (Vl = a, a = et) : (Vl = a, a = et)), a !== et) {
                                                if (He(), o = Wl[i = 233 * Vl + 55]) Vl = o.i, i = o.result; else {
                                                    if (o = Vl, (s = G()) !== et) {
                                                        if (l = [], c = Vl, He(), 44 === e.charCodeAt(Vl)) {
                                                            var h = Tt;
                                                            Vl++
                                                        } else h = et, 0 === Zl && u(Ji);
                                                        for (h !== et ? (He(), (h = G()) !== et ? (Ql = c, c = h) : (Vl = c, c = et)) : (Vl = c, c = et); c !== et;) l.push(c), c = Vl, He(), 44 === e.charCodeAt(Vl) ? (h = Tt, Vl++) : (h = et, 0 === Zl && u(Ji)), h !== et ? (He(), (h = G()) !== et ? (Ql = c, c = h) : (Vl = c, c = et)) : (Vl = c, c = et);
                                                        Ql = o, o = [s].concat(l)
                                                    } else Vl = o, o = et;
                                                    Wl[i] = {i: Vl, result: o}, i = o
                                                }
                                                i !== et ? (Ql = r, r = ["orderByClause"].concat(a ? [["stable"]] : [], i)) : (Vl = r, r = et)
                                            } else Vl = r, r = et;
                                            Wl[t] = {i: Vl, result: r}, t = r
                                        }
                                    }
                                }
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function S() {
                                var t, n, r = 233 * Vl + 43;
                                if (t = Wl[r]) return Vl = t.i, t.result;
                                if (t = Vl, 36 === e.charCodeAt(Vl)) {
                                    var a = $t;
                                    Vl++
                                } else a = et, 0 === Zl && u(xo);
                                if (a !== et) if ((a = Be()) !== et) {
                                    He();
                                    var i = me();
                                    i === et && (i = null), He();
                                    var o = 233 * Vl + 44;
                                    if (n = Wl[o]) Vl = n.i, o = n.result; else {
                                        if (n = Vl, e.substr(Vl, 8) === hn) {
                                            var s = hn;
                                            Vl += 8
                                        } else s = et, 0 === Zl && u(Do);
                                        if (s !== et) {
                                            var l = je();
                                            if (l !== et) {
                                                if (e.substr(Vl, 5) === Et) {
                                                    var c = Et;
                                                    Vl += 5
                                                } else c = et, 0 === Zl && u(Yi);
                                                c !== et ? n = s = [s, l, c] : (Vl = n, n = et)
                                            } else Vl = n, n = et
                                        } else Vl = n, n = et;
                                        Wl[o] = {i: Vl, result: n}, o = n
                                    }
                                    o === et && (o = null), He(), (s = Wl[n = 233 * Vl + 45]) ? (Vl = s.i, n = s.result) : (s = Vl, e.substr(Vl, 2) === qt ? (l = qt, Vl += 2) : (l = et, 0 === Zl && u(po)), l !== et ? (l = je()) !== et ? (36 === e.charCodeAt(Vl) ? (l = $t, Vl++) : (l = et, 0 === Zl && u(xo)), l !== et ? (l = Be()) !== et ? (Ql = s, s = ["positionalVariableBinding"].concat(l)) : (Vl = s, s = et) : (Vl = s, s = et)) : (Vl = s, s = et) : (Vl = s, s = et), Wl[n] = {
                                        i: Vl,
                                        result: s
                                    }, n = s), n === et && (n = null), He(), e.substr(Vl, 2) === cn ? (s = cn, Vl += 2) : (s = et, 0 === Zl && u(Ro)), s !== et ? (He(), (s = T()) !== et ? (Ql = t, t = ["forClauseItem", ["typedVariableBinding", ["varName"].concat(a, i ? [i] : [])]].concat(o ? [["allowingEmpty"]] : [], n ? [n] : [], [["forExpr", s]])) : (Vl = t, t = et)) : (Vl = t, t = et)
                                } else Vl = t, t = et; else Vl = t, t = et;
                                return Wl[r] = {i: Vl, result: t}, t
                            }

                            function R() {
                                var t, n = 233 * Vl + 47;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                if (t = Vl, 36 === e.charCodeAt(Vl)) {
                                    var r = $t;
                                    Vl++
                                } else r = et, 0 === Zl && u(xo);
                                if (r !== et) if ((r = Be()) !== et) {
                                    He();
                                    var a = me();
                                    if (a === et && (a = null), He(), e.substr(Vl, 2) === en) {
                                        var i = en;
                                        Vl += 2
                                    } else i = et, 0 === Zl && u(bo);
                                    i !== et ? (He(), (i = T()) !== et ? (Ql = t, t = ["letClauseItem", ["typedVariableBinding", ["varName"].concat(r)].concat(a ? [a] : []), ["letExpr", i]]) : (Vl = t, t = et)) : (Vl = t, t = et)
                                } else Vl = t, t = et; else Vl = t, t = et;
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function D() {
                                var t, n, r = 233 * Vl + 51;
                                if (t = Wl[r]) return Vl = t.i, t.result;
                                t = Vl;
                                var a = 233 * Vl + 53;
                                if (n = Wl[a]) Vl = n.i, a = n.result; else {
                                    if (n = Vl, 36 === e.charCodeAt(Vl)) {
                                        var i = $t;
                                        Vl++
                                    } else i = et, 0 === Zl && u(xo);
                                    i !== et ? (i = Be()) !== et ? (Ql = n, n = ["varName"].concat(i)) : (Vl = n, n = et) : (Vl = n, n = et), Wl[a] = {
                                        i: Vl,
                                        result: n
                                    }, a = n
                                }
                                if (a !== et) {
                                    if (i = Wl[n = 233 * Vl + 52]) Vl = i.i, n = i.result; else {
                                        i = Vl, He();
                                        var o = me();
                                        if (o === et && (o = null), He(), e.substr(Vl, 2) === en) {
                                            var s = en;
                                            Vl += 2
                                        } else s = et, 0 === Zl && u(bo);
                                        s !== et ? (He(), (s = T()) !== et ? (Ql = i, i = ["groupVarInitialize"].concat(o ? [["typeDeclaration"].concat(o)] : [], [["varValue", s]])) : (Vl = i, i = et)) : (Vl = i, i = et), Wl[n] = {
                                            i: Vl,
                                            result: i
                                        }, n = i
                                    }
                                    n === et && (n = null), i = Vl, He(), e.substr(Vl, 9) === vt ? (o = vt, Vl += 9) : (o = et, 0 === Zl && u(Pi)), o !== et ? (He(), (o = Ce()) !== et ? (Ql = i, i = ["collation", o]) : (Vl = i, i = et)) : (Vl = i, i = et), i === et && (i = null), Ql = t, t = ["groupingSpec", a].concat(n ? [n] : [], i ? [i] : [])
                                } else Vl = t, t = et;
                                return Wl[r] = {i: Vl, result: t}, t
                            }

                            function G() {
                                var t, n = 233 * Vl + 56;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                t = Vl;
                                var r = T();
                                if (r !== et) {
                                    var a;
                                    He();
                                    var i = 233 * Vl + 57;
                                    if (a = Wl[i]) Vl = a.i, i = a.result; else {
                                        if (a = Vl, e.substr(Vl, 9) === gn) {
                                            var o = gn;
                                            Vl += 9
                                        } else o = et, 0 === Zl && u(Ho);
                                        o === et && (e.substr(Vl, 10) === yn ? (o = yn, Vl += 10) : (o = et, 0 === Zl && u(jo))), o === et && (o = null), He();
                                        var s = Vl;
                                        if (e.substr(Vl, 5) === Et) {
                                            var l = Et;
                                            Vl += 5
                                        } else l = et, 0 === Zl && u(Yi);
                                        if (l !== et) {
                                            He();
                                            var c = Vl;
                                            if (e.substr(Vl, 8) === Bt) {
                                                var h = Bt;
                                                Vl += 8
                                            } else h = et, 0 === Zl && u(qi);
                                            h !== et && (Ql = c, h = "empty greatest"), (c = h) === et && (c = Vl, e.substr(Vl, 5) === Nt ? (h = Nt, Vl += 5) : (h = et, 0 === Zl && u(Vi)), h !== et && (Ql = c, h = "empty least"), c = h), c !== et ? (Ql = s, s = c) : (Vl = s, s = et)
                                        } else Vl = s, s = et;
                                        if (s === et && (s = null), He(), l = Vl, e.substr(Vl, 9) === vt ? (c = vt, Vl += 9) : (c = et, 0 === Zl && u(Pi)), c !== et) {
                                            h = He();
                                            var p = Ce();
                                            p !== et ? l = c = [c, h, p] : (Vl = l, l = et)
                                        } else Vl = l, l = et;
                                        l === et && (l = null), Ql = a, a = o || s || l ? ["orderModifier"].concat(o ? [["orderingKind", o]] : [], s ? [["emptyOrderingMode", s]] : [], l ? [["collation", l]] : []) : null, Wl[i] = {
                                            i: Vl,
                                            result: a
                                        }, i = a
                                    }
                                    Ql = t, t = ["orderBySpec", ["orderByExpr", r]].concat(i ? [i] : [])
                                } else Vl = t, t = et;
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function M() {
                                var t, n = 233 * Vl + 61;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                if (t = Vl, 36 === e.charCodeAt(Vl)) {
                                    var r = $t;
                                    Vl++
                                } else r = et, 0 === Zl && u(xo);
                                if (r !== et) if ((r = Be()) !== et) {
                                    var a = Vl, i = je();
                                    i !== et ? (i = me()) !== et ? (Ql = a, a = i) : (Vl = a, a = et) : (Vl = a, a = et), a === et && (a = null), (i = je()) !== et ? (e.substr(Vl, 2) === cn ? (i = cn, Vl += 2) : (i = et, 0 === Zl && u(Ro)), i !== et ? (i = je()) !== et ? (i = T()) !== et ? (Ql = t, t = ["quantifiedExprInClause", ["typedVariableBinding", ["varName"].concat(r)].concat(a ? [a] : []), ["sourceExpr", i]]) : (Vl = t, t = et) : (Vl = t, t = et) : (Vl = t, t = et)) : (Vl = t, t = et)
                                } else Vl = t, t = et; else Vl = t, t = et;
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function U() {
                                var t, n = 233 * Vl + 63;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                if (t = Vl, e.substr(Vl, 4) === Bn) {
                                    var r = Bn;
                                    Vl += 4
                                } else r = et, 0 === Zl && u(qo);
                                if (r !== et) {
                                    if (He(), r = Vl, 36 === e.charCodeAt(Vl)) {
                                        var a = $t;
                                        Vl++
                                    } else a = et, 0 === Zl && u(xo);
                                    if (a !== et) if ((a = Be()) !== et) {
                                        var i = je();
                                        i !== et ? (e.substr(Vl, 2) === an ? (i = an, Vl += 2) : (i = et, 0 === Zl && u(Co)), i !== et ? (Ql = r, r = a) : (Vl = r, r = et)) : (Vl = r, r = et)
                                    } else Vl = r, r = et; else Vl = r, r = et;
                                    if (r === et && (r = null), He(), i = Wl[a = 233 * Vl + 64]) Vl = i.i, a = i.result; else {
                                        i = Vl;
                                        var o = ve();
                                        if (o !== et) {
                                            var s = [], l = Vl;
                                            if (He(), 124 === e.charCodeAt(Vl)) {
                                                var c = Nn;
                                                Vl++
                                            } else c = et, 0 === Zl && u(Vo);
                                            for (c !== et ? (He(), (c = ve()) !== et ? (Ql = l, l = c) : (Vl = l, l = et)) : (Vl = l, l = et); l !== et;) s.push(l), l = Vl, He(), 124 === e.charCodeAt(Vl) ? (c = Nn, Vl++) : (c = et, 0 === Zl && u(Vo)), c !== et ? (He(), (c = ve()) !== et ? (Ql = l, l = c) : (Vl = l, l = et)) : (Vl = l, l = et);
                                            Ql = i, i = function (e, t) {
                                                return t.length ? [["sequenceTypeUnion", ["sequenceType"].concat(e)].concat(t.map((function (e) {
                                                    return ["sequenceType"].concat(e)
                                                })))] : [["sequenceType"].concat(e)]
                                            }(o, s)
                                        } else Vl = i, i = et;
                                        Wl[a] = {i: Vl, result: i}, a = i
                                    }
                                    a !== et ? (i = je()) !== et ? (e.substr(Vl, 6) === wn ? (i = wn, Vl += 6) : (i = et, 0 === Zl && u(Xo)), i !== et ? (i = je()) !== et ? (i = T()) !== et ? (Ql = t, t = ["typeswitchExprCaseClause"].concat(r ? [["variableBinding"].concat(r)] : [], a, [["resultExpr", i]])) : (Vl = t, t = et) : (Vl = t, t = et) : (Vl = t, t = et)) : (Vl = t, t = et) : (Vl = t, t = et)
                                } else Vl = t, t = et;
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function F() {
                                var t, n = 233 * Vl + 67;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                t = Vl;
                                var r = P();
                                if (r !== et) {
                                    var a = [], i = Vl;
                                    if (He(), e.substr(Vl, 3) === Sn) {
                                        var o = Sn;
                                        Vl += 3
                                    } else o = et, 0 === Zl && u(Zo);
                                    for (o !== et ? (o = Ve()) !== et ? (He(), (o = P()) !== et ? (Ql = i, i = o) : (Vl = i, i = et)) : (Vl = i, i = et) : (Vl = i, i = et); i !== et;) a.push(i), i = Vl, He(), e.substr(Vl, 3) === Sn ? (o = Sn, Vl += 3) : (o = et, 0 === Zl && u(Zo)), o !== et ? (o = Ve()) !== et ? (He(), (o = P()) !== et ? (Ql = i, i = o) : (Vl = i, i = et)) : (Vl = i, i = et) : (Vl = i, i = et);
                                    Ql = t, t = Qe("andOp", r, a)
                                } else Vl = t, t = et;
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function P() {
                                var t, n, r = 233 * Vl + 68;
                                if (t = Wl[r]) return Vl = t.i, t.result;
                                t = Vl;
                                var a = H();
                                if (a !== et) {
                                    var i = Vl;
                                    He();
                                    var o = 233 * Vl + 83;
                                    if (n = Wl[o]) Vl = n.i, o = n.result; else {
                                        if (n = Vl, e.substr(Vl, 2) === $n) {
                                            var s = $n;
                                            Vl += 2
                                        } else s = et, 0 === Zl && u(As);
                                        s !== et ? (s = Ve()) !== et ? (Ql = n, n = "eqOp") : (Vl = n, n = et) : (Vl = n, n = et), n === et && (n = Vl, e.substr(Vl, 2) === er ? (s = er, Vl += 2) : (s = et, 0 === Zl && u(xs)), s !== et ? (s = Ve()) !== et ? (Ql = n, n = "neOp") : (Vl = n, n = et) : (Vl = n, n = et), n === et && (n = Vl, e.substr(Vl, 2) === tr ? (s = tr, Vl += 2) : (s = et, 0 === Zl && u(bs)), s !== et ? (s = Ve()) !== et ? (Ql = n, n = "ltOp") : (Vl = n, n = et) : (Vl = n, n = et), n === et && (n = Vl, e.substr(Vl, 2) === nr ? (s = nr, Vl += 2) : (s = et, 0 === Zl && u(Es)), s !== et ? (s = Ve()) !== et ? (Ql = n, n = "leOp") : (Vl = n, n = et) : (Vl = n, n = et), n === et && (n = Vl, e.substr(Vl, 2) === rr ? (s = rr, Vl += 2) : (s = et, 0 === Zl && u(Bs)), s !== et ? (s = Ve()) !== et ? (Ql = n, n = "gtOp") : (Vl = n, n = et) : (Vl = n, n = et), n === et && (n = Vl, e.substr(Vl, 2) === ar ? (s = ar, Vl += 2) : (s = et, 0 === Zl && u(Ns)), s !== et ? (s = Ve()) !== et ? (Ql = n, n = "geOp") : (Vl = n, n = et) : (Vl = n, n = et)))))), Wl[o] = {
                                            i: Vl,
                                            result: n
                                        }, o = n
                                    }
                                    o === et && ((n = Wl[o = 233 * Vl + 84]) ? (Vl = n.i, o = n.result) : (n = Vl, e.substr(Vl, 2) === ir ? (s = ir, Vl += 2) : (s = et, 0 === Zl && u(Cs)), s !== et ? (s = Ve()) !== et ? (Ql = n, n = "isOp") : (Vl = n, n = et) : (Vl = n, n = et), n === et && (n = Vl, e.substr(Vl, 2) === or ? (s = or, Vl += 2) : (s = et, 0 === Zl && u(Ts)), s !== et && (Ql = n, s = "nodeBeforeOp"), (n = s) === et && (n = Vl, e.substr(Vl, 2) === sr ? (s = sr, Vl += 2) : (s = et, 0 === Zl && u(Is)), s !== et && (Ql = n, s = "nodeAfterOp"), n = s)), Wl[o] = {
                                        i: Vl,
                                        result: n
                                    }, o = n), o === et && ((n = Wl[o = 233 * Vl + 82]) ? (Vl = n.i, o = n.result) : (n = Vl, 61 === e.charCodeAt(Vl) ? (s = lt, Vl++) : (s = et, 0 === Zl && u(Si)), s !== et && (Ql = n, s = "equalOp"), (n = s) === et && (n = Vl, e.substr(Vl, 2) === Jn ? (s = Jn, Vl += 2) : (s = et, 0 === Zl && u(ms)), s !== et && (Ql = n, s = "notEqualOp"), (n = s) === et && (n = Vl, e.substr(Vl, 2) === Kn ? (s = Kn, Vl += 2) : (s = et, 0 === Zl && u(vs)), s !== et && (Ql = n, s = "lessThanOrEqualOp"), (n = s) === et && (n = Vl, 60 === e.charCodeAt(Vl) ? (s = zn, Vl++) : (s = et, 0 === Zl && u(gs)), s !== et && (Ql = n, s = "lessThanOp"), (n = s) === et && (n = Vl, e.substr(Vl, 2) === Zn ? (s = Zn, Vl += 2) : (s = et, 0 === Zl && u(ys)), s !== et && (Ql = n, s = "greaterThanOrEqualOp"), (n = s) === et && (n = Vl, 62 === e.charCodeAt(Vl) ? (s = Wn, Vl++) : (s = et, 0 === Zl && u(ws)), s !== et && (Ql = n, s = "greaterThanOp"), n = s))))), Wl[o] = {
                                        i: Vl,
                                        result: n
                                    }, o = n))), o !== et ? (He(), (n = H()) !== et ? (Ql = i, i = [o, n]) : (Vl = i, i = et)) : (Vl = i, i = et), i === et && (i = null), Ql = t, t = i ? [i[0], ["firstOperand", a], ["secondOperand", i[1]]] : a
                                } else Vl = t, t = et;
                                return Wl[r] = {i: Vl, result: t}, t
                            }

                            function H() {
                                var t, n = 233 * Vl + 69;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                t = Vl;
                                var r = j();
                                if (r !== et) {
                                    var a = [], i = Vl;
                                    if (He(), e.substr(Vl, 2) === Rn) {
                                        var o = Rn;
                                        Vl += 2
                                    } else o = et, 0 === Zl && u(Wo);
                                    for (o !== et ? (He(), (o = j()) !== et ? (Ql = i, i = o) : (Vl = i, i = et)) : (Vl = i, i = et); i !== et;) a.push(i), i = Vl, He(), e.substr(Vl, 2) === Rn ? (o = Rn, Vl += 2) : (o = et, 0 === Zl && u(Wo)), o !== et ? (He(), (o = j()) !== et ? (Ql = i, i = o) : (Vl = i, i = et)) : (Vl = i, i = et);
                                    Ql = t, t = Qe("stringConcatenateOp", r, a)
                                } else Vl = t, t = et;
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function j() {
                                var t, n = 233 * Vl + 70;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                t = Vl;
                                var r = X();
                                if (r !== et) {
                                    var a = Vl;
                                    if (He(), e.substr(Vl, 2) === Dn) {
                                        var i = Dn;
                                        Vl += 2
                                    } else i = et, 0 === Zl && u($o);
                                    i !== et ? (i = Ve()) !== et ? (He(), (i = X()) !== et ? (Ql = a, a = i) : (Vl = a, a = et)) : (Vl = a, a = et) : (Vl = a, a = et), a === et && (a = null), Ql = t, t = null === a ? r : ["rangeSequenceExpr", ["startExpr", r], ["endExpr", a]]
                                } else Vl = t, t = et;
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function X() {
                                var t, n = 233 * Vl + 71;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                t = Vl;
                                var r = _();
                                if (r !== et) {
                                    var a = [], i = Vl;
                                    He();
                                    var o = Vl;
                                    if (45 === e.charCodeAt(Vl)) {
                                        var s = Gn;
                                        Vl++
                                    } else s = et, 0 === Zl && u(es);
                                    for (s !== et && (Ql = o, s = "subtractOp"), (o = s) === et && (o = Vl, 43 === e.charCodeAt(Vl) ? (s = Mn, Vl++) : (s = et, 0 === Zl && u(ts)), s !== et && (Ql = o, s = "addOp"), o = s), o !== et ? (He(), (s = _()) !== et ? (Ql = i, i = [o, s]) : (Vl = i, i = et)) : (Vl = i, i = et); i !== et;) a.push(i), i = Vl, He(), o = Vl, 45 === e.charCodeAt(Vl) ? (s = Gn, Vl++) : (s = et, 0 === Zl && u(es)), s !== et && (Ql = o, s = "subtractOp"), (o = s) === et && (o = Vl, 43 === e.charCodeAt(Vl) ? (s = Mn, Vl++) : (s = et, 0 === Zl && u(ts)), s !== et && (Ql = o, s = "addOp"), o = s), o !== et ? (He(), (s = _()) !== et ? (Ql = i, i = [o, s]) : (Vl = i, i = et)) : (Vl = i, i = et);
                                    Ql = t, t = function (e, t) {
                                        return t.reduce((function (e, t) {
                                            return [t[0], ["firstOperand", e], ["secondOperand", t[1]]]
                                        }), e)
                                    }(r, a)
                                } else Vl = t, t = et;
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function _() {
                                var t, n = 233 * Vl + 72;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                t = Vl;
                                var r = L();
                                if (r !== et) {
                                    var a = [], i = Vl;
                                    He();
                                    var o = Vl;
                                    if (42 === e.charCodeAt(Vl)) {
                                        var s = Un;
                                        Vl++
                                    } else s = et, 0 === Zl && u(ns);
                                    for (s !== et && (Ql = o, s = "multiplyOp"), (o = s) === et && (o = Vl, e.substr(Vl, 3) === Fn ? (s = Fn, Vl += 3) : (s = et, 0 === Zl && u(rs)), s !== et ? (s = Ve()) !== et ? (Ql = o, o = "divOp") : (Vl = o, o = et) : (Vl = o, o = et), o === et && (o = Vl, e.substr(Vl, 4) === Pn ? (s = Pn, Vl += 4) : (s = et, 0 === Zl && u(as)), s !== et ? (s = Ve()) !== et ? (Ql = o, o = "idivOp") : (Vl = o, o = et) : (Vl = o, o = et), o === et && (o = Vl, e.substr(Vl, 3) === Hn ? (s = Hn, Vl += 3) : (s = et, 0 === Zl && u(is)), s !== et ? (s = Ve()) !== et ? (Ql = o, o = "modOp") : (Vl = o, o = et) : (Vl = o, o = et)))), o !== et ? (He(), (s = L()) !== et ? (Ql = i, i = [o, s]) : (Vl = i, i = et)) : (Vl = i, i = et); i !== et;) a.push(i), i = Vl, He(), o = Vl, 42 === e.charCodeAt(Vl) ? (s = Un, Vl++) : (s = et, 0 === Zl && u(ns)), s !== et && (Ql = o, s = "multiplyOp"), (o = s) === et && (o = Vl, e.substr(Vl, 3) === Fn ? (s = Fn, Vl += 3) : (s = et, 0 === Zl && u(rs)), s !== et ? (s = Ve()) !== et ? (Ql = o, o = "divOp") : (Vl = o, o = et) : (Vl = o, o = et), o === et && (o = Vl, e.substr(Vl, 4) === Pn ? (s = Pn, Vl += 4) : (s = et, 0 === Zl && u(as)), s !== et ? (s = Ve()) !== et ? (Ql = o, o = "idivOp") : (Vl = o, o = et) : (Vl = o, o = et), o === et && (o = Vl, e.substr(Vl, 3) === Hn ? (s = Hn, Vl += 3) : (s = et, 0 === Zl && u(is)), s !== et ? (s = Ve()) !== et ? (Ql = o, o = "modOp") : (Vl = o, o = et) : (Vl = o, o = et)))), o !== et ? (He(), (s = L()) !== et ? (Ql = i, i = [o, s]) : (Vl = i, i = et)) : (Vl = i, i = et);
                                    Ql = t, t = function (e, t) {
                                        return t.reduce((function (e, t) {
                                            return [t[0], ["firstOperand", e], ["secondOperand", t[1]]]
                                        }), e)
                                    }(r, a)
                                } else Vl = t, t = et;
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function L() {
                                var t, n = 233 * Vl + 73;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                t = Vl;
                                var r = k();
                                if (r !== et) {
                                    var a = [], i = Vl;
                                    if (He(), 124 === e.charCodeAt(Vl)) {
                                        var o = Nn;
                                        Vl++
                                    } else o = et, 0 === Zl && u(Vo);
                                    if (o === et) {
                                        if (o = Vl, e.substr(Vl, 5) === jn) {
                                            var s = jn;
                                            Vl += 5
                                        } else s = et, 0 === Zl && u(os);
                                        if (s !== et) {
                                            var l = Ve();
                                            l !== et ? o = s = [s, l] : (Vl = o, o = et)
                                        } else Vl = o, o = et
                                    }
                                    for (o !== et ? (He(), (l = k()) !== et ? (Ql = i, i = l) : (Vl = i, i = et)) : (Vl = i, i = et); i !== et;) a.push(i), i = Vl, He(), 124 === e.charCodeAt(Vl) ? (o = Nn, Vl++) : (o = et, 0 === Zl && u(Vo)), o === et && (o = Vl, e.substr(Vl, 5) === jn ? (s = jn, Vl += 5) : (s = et, 0 === Zl && u(os)), s !== et ? (l = Ve()) !== et ? o = s = [s, l] : (Vl = o, o = et) : (Vl = o, o = et)), o !== et ? (He(), (l = k()) !== et ? (Ql = i, i = l) : (Vl = i, i = et)) : (Vl = i, i = et);
                                    Ql = t, t = Qe("unionOp", r, a)
                                } else Vl = t, t = et;
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function k() {
                                var t, n, r = 233 * Vl + 74;
                                if (t = Wl[r]) return Vl = t.i, t.result;
                                t = Vl;
                                var a = 233 * Vl + 75;
                                if (n = Wl[a]) Vl = n.i, a = n.result; else {
                                    n = Vl;
                                    var i = Y();
                                    if (i !== et) {
                                        var o = Vl;
                                        if (He(), e.substr(Vl, 8) === Ln) {
                                            var s = Ln;
                                            Vl += 8
                                        } else s = et, 0 === Zl && u(ls);
                                        s !== et ? (s = je()) !== et ? (e.substr(Vl, 2) === kn ? (s = kn, Vl += 2) : (s = et, 0 === Zl && u(cs)), s !== et ? (s = Ve()) !== et ? (He(), (s = ve()) !== et ? (Ql = o, o = s) : (Vl = o, o = et)) : (Vl = o, o = et) : (Vl = o, o = et)) : (Vl = o, o = et) : (Vl = o, o = et), o === et && (o = null), Ql = n, n = o ? ["instanceOfExpr", ["argExpr", i], ["sequenceType"].concat(o)] : i
                                    } else Vl = n, n = et;
                                    n === et && (n = Y()), Wl[a] = {i: Vl, result: n}, a = n
                                }
                                if (a !== et) {
                                    for (n = [], i = Vl, He(), o = Vl, e.substr(Vl, 9) === Xn ? (s = Xn, Vl += 9) : (s = et, 0 === Zl && u(ss)), s !== et && (Ql = o, s = "intersectOp"), (o = s) === et && (o = Vl, e.substr(Vl, 6) === _n ? (s = _n, Vl += 6) : (s = et, 0 === Zl && u(us)), s !== et && (Ql = o, s = "exceptOp"), o = s), o !== et ? (s = Ve()) !== et ? (He(), (s = k()) !== et ? (Ql = i, i = [o, s]) : (Vl = i, i = et)) : (Vl = i, i = et) : (Vl = i, i = et); i !== et;) n.push(i), i = Vl, He(), o = Vl, e.substr(Vl, 9) === Xn ? (s = Xn, Vl += 9) : (s = et, 0 === Zl && u(ss)), s !== et && (Ql = o, s = "intersectOp"), (o = s) === et && (o = Vl, e.substr(Vl, 6) === _n ? (s = _n, Vl += 6) : (s = et, 0 === Zl && u(us)), s !== et && (Ql = o, s = "exceptOp"), o = s), o !== et ? (s = Ve()) !== et ? (He(), (s = k()) !== et ? (Ql = i, i = [o, s]) : (Vl = i, i = et)) : (Vl = i, i = et) : (Vl = i, i = et);
                                    Ql = t, t = function (e, t) {
                                        return t.reduce((function (e, t) {
                                            return [t[0], ["firstOperand", e], ["secondOperand", t[1]]]
                                        }), e)
                                    }(a, n)
                                } else Vl = t, t = et;
                                return Wl[r] = {i: Vl, result: t}, t
                            }

                            function Y() {
                                var t, n, r, a = 233 * Vl + 76;
                                if (t = Wl[a]) return Vl = t.i, t.result;
                                t = Vl;
                                var i = 233 * Vl + 77;
                                if (n = Wl[i]) Vl = n.i, i = n.result; else {
                                    var o;
                                    n = Vl;
                                    var s = 233 * Vl + 78;
                                    if (r = Wl[s]) Vl = r.i, s = r.result; else {
                                        r = Vl;
                                        var l = 233 * Vl + 79;
                                        if (o = Wl[l]) Vl = o.i, l = o.result; else {
                                            o = Vl;
                                            var c = function t() {
                                                var n, r = 233 * Vl + 80;
                                                if (n = Wl[r]) return Vl = n.i, n.result;
                                                if (n = Vl, 45 === e.charCodeAt(Vl)) {
                                                    var a = Gn;
                                                    Vl++
                                                } else a = et, 0 === Zl && u(es);
                                                if (a !== et ? (He(), (a = t()) !== et ? (Ql = n, n = ["unaryMinusOp", ["operand", a]]) : (Vl = n, n = et)) : (Vl = n, n = et), n === et && (n = Vl, 43 === e.charCodeAt(Vl) ? (a = Mn, Vl++) : (a = et, 0 === Zl && u(ts)), a !== et ? (He(), (a = t()) !== et ? (Ql = n, n = ["unaryPlusOp", ["operand", a]]) : (Vl = n, n = et)) : (Vl = n, n = et), n === et)) if (a = Wl[n = 233 * Vl + 81]) Vl = a.i, n = a.result; else {
                                                    var i, o;
                                                    if (i = Wl[a = 233 * Vl + 85]) Vl = i.i, a = i.result; else {
                                                        if (i = Vl, e.substr(Vl, 8) === ur) {
                                                            var s = ur;
                                                            Vl += 8
                                                        } else s = et, 0 === Zl && u(Os);
                                                        if (s !== et) {
                                                            s = Vl, He();
                                                            var l = 233 * Vl + 86;
                                                            (o = Wl[l]) ? (Vl = o.i, l = o.result) : (e.substr(Vl, 3) === cr ? (o = cr, Vl += 3) : (o = et, 0 === Zl && u(Rs)), o === et && (e.substr(Vl, 6) === hr ? (o = hr, Vl += 6) : (o = et, 0 === Zl && u(Ds))), Wl[l] = {
                                                                i: Vl,
                                                                result: o
                                                            }, l = o), l !== et ? (Ql = s, s = ["validationMode", l]) : (Vl = s, s = et), s === et && (s = Vl, He(), e.substr(Vl, 4) === lr ? (l = lr, Vl += 4) : (l = et, 0 === Zl && u(Ss)), l !== et ? (He(), (l = Be()) !== et ? (Ql = s, s = ["type"].concat(l)) : (Vl = s, s = et)) : (Vl = s, s = et)), s === et && (s = null), He(), 123 === e.charCodeAt(Vl) ? (l = on, Vl++) : (l = et, 0 === Zl && u(To)), l !== et ? (He(), (l = C()) !== et ? (He(), 125 === e.charCodeAt(Vl) ? (o = sn, Vl++) : (o = et, 0 === Zl && u(Io)), o !== et ? (Ql = i, i = ["validateExpr"].concat(s ? [s] : [], [["argExpr", l]])) : (Vl = i, i = et)) : (Vl = i, i = et)) : (Vl = i, i = et)
                                                        } else Vl = i, i = et;
                                                        Wl[a] = {i: Vl, result: i}, a = i
                                                    }
                                                    if (a === et) {
                                                        if (i = Wl[a = 233 * Vl + 87]) Vl = i.i, a = i.result; else {
                                                            if (i = Vl, s = [], (l = q()) !== et) for (; l !== et;) s.push(l), l = q(); else s = et;
                                                            s !== et ? (He(), 123 === e.charCodeAt(Vl) ? (l = on, Vl++) : (l = et, 0 === Zl && u(To)), l !== et ? (He(), C(), He(), 125 === e.charCodeAt(Vl) ? (l = sn, Vl++) : (l = et, 0 === Zl && u(Io)), l !== et ? (Ql = i, i = ["extensionExpr"].concat(s)) : (Vl = i, i = et)) : (Vl = i, i = et)) : (Vl = i, i = et), Wl[a] = {
                                                                i: Vl,
                                                                result: i
                                                            }, a = i
                                                        }
                                                        if (a === et) if (i = Wl[a = 233 * Vl + 90]) Vl = i.i, a = i.result; else {
                                                            if (i = Vl, (s = V()) !== et) {
                                                                if (l = [], o = Vl, He(), 33 === e.charCodeAt(Vl)) {
                                                                    var c = dr;
                                                                    Vl++
                                                                } else c = et, 0 === Zl && u(Us);
                                                                for (c !== et ? (He(), (c = V()) !== et ? (Ql = o, o = c) : (Vl = o, o = et)) : (Vl = o, o = et); o !== et;) l.push(o), o = Vl, He(), 33 === e.charCodeAt(Vl) ? (c = dr, Vl++) : (c = et, 0 === Zl && u(Us)), c !== et ? (He(), (c = V()) !== et ? (Ql = o, o = c) : (Vl = o, o = et)) : (Vl = o, o = et);
                                                                Ql = i, i = function (e, t) {
                                                                    return 0 === t.length ? $e(e) : $e(["simpleMapExpr", "pathExpr" === e[0] ? e : ["pathExpr", ["stepExpr", ["filterExpr", Ze(e)]]]].concat(t.map((function (e) {
                                                                        return "pathExpr" === e[0] ? e : ["pathExpr", ["stepExpr", ["filterExpr", Ze(e)]]]
                                                                    }))))
                                                                }(s, l)
                                                            } else Vl = i, i = et;
                                                            Wl[a] = {i: Vl, result: i}, a = i
                                                        }
                                                    }
                                                    Wl[n] = {i: Vl, result: a}, n = a
                                                }
                                                return Wl[r] = {i: Vl, result: n}, n
                                            }();
                                            if (c !== et) {
                                                var h = [], p = Vl;
                                                if (He(), e.substr(Vl, 2) === Qn) {
                                                    var f = Qn;
                                                    Vl += 2
                                                } else f = et, 0 === Zl && u(ds);
                                                if (f !== et) if (He(), (f = te()) !== et) {
                                                    He();
                                                    var d = Z();
                                                    d !== et ? (Ql = p, p = [f, d]) : (Vl = p, p = et)
                                                } else Vl = p, p = et; else Vl = p, p = et;
                                                for (; p !== et;) h.push(p), p = Vl, He(), e.substr(Vl, 2) === Qn ? (f = Qn, Vl += 2) : (f = et, 0 === Zl && u(ds)), f !== et ? (He(), (f = te()) !== et ? (He(), (d = Z()) !== et ? (Ql = p, p = [f, d]) : (Vl = p, p = et)) : (Vl = p, p = et)) : (Vl = p, p = et);
                                                Ql = o, o = function (e, t) {
                                                    return t.reduce((function (e, t) {
                                                        return ["arrowExpr", ["argExpr", e], t[0], ["arguments"].concat(t[1])]
                                                    }), e)
                                                }(c, h)
                                            } else Vl = o, o = et;
                                            Wl[l] = {i: Vl, result: o}, l = o
                                        }
                                        l !== et ? (o = Vl, He(), e.substr(Vl, 4) === Vn ? (c = Vn, Vl += 4) : (c = et, 0 === Zl && u(fs)), c !== et ? (c = je()) !== et ? (e.substr(Vl, 2) === an ? (c = an, Vl += 2) : (c = et, 0 === Zl && u(Co)), c !== et ? (c = Ve()) !== et ? (He(), (c = de()) !== et ? (Ql = o, o = c) : (Vl = o, o = et)) : (Vl = o, o = et) : (Vl = o, o = et)) : (Vl = o, o = et) : (Vl = o, o = et), o === et && (o = null), Ql = r, r = o ? ["castExpr", ["argExpr", l], o] : l) : (Vl = r, r = et), Wl[s] = {
                                            i: Vl,
                                            result: r
                                        }, s = r
                                    }
                                    s !== et ? (r = Vl, He(), e.substr(Vl, 8) === qn ? (l = qn, Vl += 8) : (l = et, 0 === Zl && u(ps)), l !== et ? (l = je()) !== et ? (e.substr(Vl, 2) === an ? (l = an, Vl += 2) : (l = et, 0 === Zl && u(Co)), l !== et ? (l = Ve()) !== et ? (He(), (l = de()) !== et ? (Ql = r, r = l) : (Vl = r, r = et)) : (Vl = r, r = et) : (Vl = r, r = et)) : (Vl = r, r = et) : (Vl = r, r = et), r === et && (r = null), Ql = n, n = r ? ["castableExpr", ["argExpr", s], r] : s) : (Vl = n, n = et), Wl[i] = {
                                        i: Vl,
                                        result: n
                                    }, i = n
                                }
                                return i !== et ? (n = Vl, He(), e.substr(Vl, 5) === Yn ? (s = Yn, Vl += 5) : (s = et, 0 === Zl && u(hs)), s !== et ? (s = je()) !== et ? (e.substr(Vl, 2) === an ? (s = an, Vl += 2) : (s = et, 0 === Zl && u(Co)), s !== et ? (s = Ve()) !== et ? (He(), (s = ve()) !== et ? (Ql = n, n = s) : (Vl = n, n = et)) : (Vl = n, n = et) : (Vl = n, n = et)) : (Vl = n, n = et) : (Vl = n, n = et), n === et && (n = null), Ql = t, t = n ? ["treatExpr", ["argExpr", i], ["sequenceType"].concat(n)] : i) : (Vl = t, t = et), Wl[a] = {
                                    i: Vl,
                                    result: t
                                }, t
                            }

                            function q() {
                                var t, n = 233 * Vl + 88;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                if (t = Vl, e.substr(Vl, 2) === pr) {
                                    var r = pr;
                                    Vl += 2
                                } else r = et, 0 === Zl && u(Gs);
                                if (r !== et) if (je(), (r = Be()) !== et) {
                                    var a = Vl, i = je();
                                    if (i !== et) {
                                        var o;
                                        if (o = Wl[i = 233 * Vl + 89]) Vl = o.i, i = o.result; else {
                                            o = Vl;
                                            var s = [], l = Vl, c = Me();
                                            if (c !== et) {
                                                var h = Vl;
                                                if (Zl++, e.substr(Vl, 2) === fr) {
                                                    var p = fr;
                                                    Vl += 2
                                                } else p = et, 0 === Zl && u(Ms);
                                                Zl--, p === et ? h = void 0 : (Vl = h, h = et), h !== et ? (Ql = l, l = c) : (Vl = l, l = et)
                                            } else Vl = l, l = et;
                                            for (; l !== et;) s.push(l), l = Vl, (c = Me()) !== et ? (h = Vl, Zl++, e.substr(Vl, 2) === fr ? (p = fr, Vl += 2) : (p = et, 0 === Zl && u(Ms)), Zl--, p === et ? h = void 0 : (Vl = h, h = et), h !== et ? (Ql = l, l = c) : (Vl = l, l = et)) : (Vl = l, l = et);
                                            Ql = o, o = s = s.join(""), Wl[i] = {i: Vl, result: o}, i = o
                                        }
                                        Ql = a, a = i
                                    } else Vl = a, a = et;
                                    a === et && (a = null), He(), e.substr(Vl, 2) === fr ? (i = fr, Vl += 2) : (i = et, 0 === Zl && u(Ms)), i !== et ? (Ql = t, t = a ? ["pragma", ["pragmaName", r], ["pragmaContents", a]] : ["pragma", ["pragmaName", r]]) : (Vl = t, t = et)
                                } else Vl = t, t = et; else Vl = t, t = et;
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function V() {
                                var t, r, a = 233 * Vl + 91;
                                if (t = Wl[a]) return Vl = t.i, t.result;
                                if (r = Wl[t = 233 * Vl + 92]) Vl = r.i, t = r.result; else {
                                    r = Vl;
                                    var i = J();
                                    if (i !== et) {
                                        He();
                                        var o = K();
                                        if (o !== et) {
                                            He();
                                            var s = Q();
                                            s !== et ? (Ql = r, r = ["pathExpr", i, o].concat(s)) : (Vl = r, r = et)
                                        } else Vl = r, r = et
                                    } else Vl = r, r = et;
                                    if (r === et && (r = Vl, (i = J()) !== et ? (He(), 47 === e.charCodeAt(Vl) ? (o = mr, Vl++) : (o = et, 0 === Zl && u(Fs)), o !== et ? (He(), (s = Q()) !== et ? (Ql = r, r = ["pathExpr", i].concat(s)) : (Vl = r, r = et)) : (Vl = r, r = et)) : (Vl = r, r = et), r === et)) {
                                        if (i = Wl[r = 233 * Vl + 98]) Vl = i.i, r = i.result; else {
                                            if (i = Vl, (o = ne()) !== et) {
                                                s = Vl, Zl++;
                                                var l = Vl, c = He(), h = W();
                                                h !== et ? l = c = [c, h] : (Vl = l, l = et), l === et && (l = Vl, c = He(), (h = Z()) !== et ? l = c = [c, h] : (Vl = l, l = et), l === et && (l = Vl, c = He(), (h = $()) !== et ? l = c = [c, h] : (Vl = l, l = et))), Zl--, l === et ? s = void 0 : (Vl = s, s = et), s !== et ? (Ql = i, i = o) : (Vl = i, i = et)
                                            } else Vl = i, i = et;
                                            Wl[r] = {i: Vl, result: i}, r = i
                                        }
                                        r === et && (r = Vl, (i = J()) !== et && (Ql = r, i = ["pathExpr", i]), r = i)
                                    }
                                    Wl[t] = {i: Vl, result: r}, t = r
                                }
                                return t === et && ((r = Wl[t = 233 * Vl + 95]) ? (Vl = r.i, t = r.result) : (r = Vl, 47 === e.charCodeAt(Vl) ? (o = mr, Vl++) : (o = et, 0 === Zl && u(Fs)), o !== et ? (He(), (i = Q()) !== et ? (Ql = r, r = ["pathExpr", ["rootExpr"]].concat(i)) : (Vl = r, r = et)) : (Vl = r, r = et), r === et && (r = Vl, (o = K()) !== et ? (He(), (i = Q()) !== et ? (Ql = r, r = ["pathExpr", ["rootExpr"], o].concat(i)) : (Vl = r, r = et)) : (Vl = r, r = et), r === et && (r = Vl, 47 === e.charCodeAt(Vl) ? (o = mr, Vl++) : (o = et, 0 === Zl && u(Fs)), o !== et ? (o = Vl, Zl++, i = Vl, s = He(), Ql = l = Vl, (c = (c = n.Ra) ? void 0 : et) !== et ? (ai.test(e.charAt(Vl)) ? (h = e.charAt(Vl), Vl++) : (h = et, 0 === Zl && u(Ps)), h !== et ? l = c = [c, h] : (Vl = l, l = et)) : (Vl = l, l = et), l !== et ? i = s = [s, l] : (Vl = i, i = et), i === et && (Ql = i = Vl, (s = (s = !n.Ra) ? void 0 : et) !== et ? (ii.test(e.charAt(Vl)) ? (l = e.charAt(Vl), Vl++) : (l = et, 0 === Zl && u(Hs)), l !== et ? i = s = [s, l] : (Vl = i, i = et)) : (Vl = i, i = et)), Zl--, i === et ? o = void 0 : (Vl = o, o = et), o !== et ? (Ql = r, r = ["pathExpr", ["rootExpr"]]) : (Vl = r, r = et)) : (Vl = r, r = et))), Wl[t] = {
                                    i: Vl,
                                    result: r
                                }, t = r)), Wl[a] = {i: Vl, result: t}, t
                            }

                            function Q() {
                                var t, n = 233 * Vl + 93;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                t = Vl;
                                var r = J();
                                if (r !== et) {
                                    He();
                                    var a = K();
                                    if (a !== et) {
                                        He();
                                        var i = Q();
                                        i !== et ? (Ql = t, t = [r, a].concat(i)) : (Vl = t, t = et)
                                    } else Vl = t, t = et
                                } else Vl = t, t = et;
                                return t === et && (t = Vl, (r = J()) !== et ? (He(), 47 === e.charCodeAt(Vl) ? (a = mr, Vl++) : (a = et, 0 === Zl && u(Fs)), a !== et ? (He(), (i = Q()) !== et ? (Ql = t, t = [r].concat(i)) : (Vl = t, t = et)) : (Vl = t, t = et)) : (Vl = t, t = et), t === et && (t = Vl, (r = J()) !== et && (Ql = t, r = [r]), t = r)), Wl[n] = {
                                    i: Vl,
                                    result: t
                                }, t
                            }

                            function J() {
                                var t, n, r = 233 * Vl + 94;
                                if (t = Wl[r]) return Vl = t.i, t.result;
                                t = Vl;
                                var a = 233 * Vl + 97;
                                if (n = Wl[a]) Vl = n.i, a = n.result; else {
                                    var i = n = Vl, o = ne();
                                    if (o !== et && (Ql = i, o = Ze(o)), (i = o) !== et) {
                                        o = [];
                                        var s = Vl;
                                        He();
                                        var l = W();
                                        for (l !== et ? (Ql = s, s = ["predicate", l]) : (Vl = s, s = et), s === et && (s = Vl, He(), (l = Z()) !== et ? (Ql = s, s = ["argumentList", l]) : (Vl = s, s = et), s === et && (s = Vl, He(), (l = $()) !== et ? (Ql = s, s = l) : (Vl = s, s = et))); s !== et;) o.push(s), s = Vl, He(), (l = W()) !== et ? (Ql = s, s = ["predicate", l]) : (Vl = s, s = et), s === et && (s = Vl, He(), (l = Z()) !== et ? (Ql = s, s = ["argumentList", l]) : (Vl = s, s = et), s === et && (s = Vl, He(), (l = $()) !== et ? (Ql = s, s = l) : (Vl = s, s = et)));
                                        Ql = n, n = function (e, t) {
                                            function n() {
                                                s && 1 === i.length ? o.push(["predicate", i[0]]) : 0 !== i.length && o.push(["predicates"].concat(i)), i.length = 0
                                            }

                                            function r(e) {
                                                n(), 0 !== o.length ? ("sequenceExpr" === a[0] && 2 < a.length && (a = ["sequenceExpr", a]), a = [["filterExpr", a]].concat(o)) : a = e ? [["filterExpr", a]] : [a], o.length = 0
                                            }

                                            var a = e, i = [], o = [], s = !1;
                                            return t.forEach((function (e) {
                                                "predicate" === e[0] ? i.push(e[1]) : "lookup" === e[0] ? (s = !0, n(), o.push(e)) : "argumentList" === e[0] && (r(!1), 1 < a.length && (a = [["sequenceExpr", ["pathExpr", ["stepExpr"].concat(a)]]]), a = ["dynamicFunctionInvocationExpr", ["functionItem"].concat(a)].concat(e[1].length ? [["arguments"].concat(e[1])] : []))
                                            })), r(!0), a
                                        }(i, o)
                                    } else Vl = n, n = et;
                                    Wl[a] = {i: Vl, result: n}, a = n
                                }
                                if (a !== et && (Ql = t, a = ["stepExpr"].concat(a)), (t = a) === et) if (a = Wl[t = 233 * Vl + 99]) Vl = a.i, t = a.result; else {
                                    if (a = Vl, i = Wl[n = 233 * Vl + 103]) Vl = i.i, n = i.result; else {
                                        if (i = Vl, s = Wl[o = 233 * Vl + 104]) Vl = s.i, o = s.result; else {
                                            if (l = s = Vl, e.substr(Vl, 6) === Cr) {
                                                var c = Cr;
                                                Vl += 6
                                            } else c = et, 0 === Zl && u(Ks);
                                            if (c !== et) {
                                                if (e.substr(Vl, 2) === yr) {
                                                    var h = yr;
                                                    Vl += 2
                                                } else h = et, 0 === Zl && u(_s);
                                                h !== et ? l = c = [c, h] : (Vl = l, l = et)
                                            } else Vl = l, l = et;
                                            l !== et && (Ql = s, l = "parent"), (s = l) === et && (l = s = Vl, e.substr(Vl, 8) === Tr ? (c = Tr, Vl += 8) : (c = et, 0 === Zl && u(zs)), c !== et ? (e.substr(Vl, 2) === yr ? (h = yr, Vl += 2) : (h = et, 0 === Zl && u(_s)), h !== et ? l = c = [c, h] : (Vl = l, l = et)) : (Vl = l, l = et), l !== et && (Ql = s, l = "ancestor"), (s = l) === et && (l = s = Vl, e.substr(Vl, 17) === Ir ? (c = Ir, Vl += 17) : (c = et, 0 === Zl && u(Zs)), c !== et ? (e.substr(Vl, 2) === yr ? (h = yr, Vl += 2) : (h = et, 0 === Zl && u(_s)), h !== et ? l = c = [c, h] : (Vl = l, l = et)) : (Vl = l, l = et), l !== et && (Ql = s, l = "preceding-sibling"), (s = l) === et && (l = s = Vl, e.substr(Vl, 9) === Or ? (c = Or, Vl += 9) : (c = et, 0 === Zl && u(Ws)), c !== et ? (e.substr(Vl, 2) === yr ? (h = yr, Vl += 2) : (h = et, 0 === Zl && u(_s)), h !== et ? l = c = [c, h] : (Vl = l, l = et)) : (Vl = l, l = et), l !== et && (Ql = s, l = "preceding"), (s = l) === et && (l = s = Vl, e.substr(Vl, 16) === Sr ? (c = Sr, Vl += 16) : (c = et, 0 === Zl && u($s)), c !== et ? (e.substr(Vl, 2) === yr ? (h = yr, Vl += 2) : (h = et, 0 === Zl && u(_s)), h !== et ? l = c = [c, h] : (Vl = l, l = et)) : (Vl = l, l = et), l !== et && (Ql = s, l = "ancestor-or-self"), s = l)))), Wl[o] = {
                                                i: Vl,
                                                result: s
                                            }, o = s
                                        }
                                        o !== et ? (s = z()) !== et ? (Ql = i, i = ["stepExpr", ["xpathAxis", o], s]) : (Vl = i, i = et) : (Vl = i, i = et), i === et && (i = Vl, (s = Wl[o = 233 * Vl + 105]) ? (Vl = s.i, o = s.result) : (s = Vl, e.substr(Vl, 2) === Rr ? (l = Rr, Vl += 2) : (l = et, 0 === Zl && u(eu)), l !== et && (Ql = s, l = ["stepExpr", ["xpathAxis", "parent"], ["anyKindTest"]]), s = l, Wl[o] = {
                                            i: Vl,
                                            result: s
                                        }, o = s), o !== et && (Ql = i), i = o), Wl[n] = {i: Vl, result: i}, n = i
                                    }
                                    if (n === et && ((i = Wl[n = 233 * Vl + 100]) ? (Vl = i.i, n = i.result) : (i = Vl, (s = Wl[o = 233 * Vl + 101]) ? (Vl = s.i, o = s.result) : (l = s = Vl, e.substr(Vl, 5) === gr ? (c = gr, Vl += 5) : (c = et, 0 === Zl && u(Xs)), c !== et ? (e.substr(Vl, 2) === yr ? (h = yr, Vl += 2) : (h = et, 0 === Zl && u(_s)), h !== et ? l = c = [c, h] : (Vl = l, l = et)) : (Vl = l, l = et), l !== et && (Ql = s, l = "child"), (s = l) === et && (l = s = Vl, e.substr(Vl, 10) === wr ? (c = wr, Vl += 10) : (c = et, 0 === Zl && u(Ls)), c !== et ? (e.substr(Vl, 2) === yr ? (h = yr, Vl += 2) : (h = et, 0 === Zl && u(_s)), h !== et ? l = c = [c, h] : (Vl = l, l = et)) : (Vl = l, l = et), l !== et && (Ql = s, l = "descendant"), (s = l) === et && (l = s = Vl, e.substr(Vl, 9) === Ar ? (c = Ar, Vl += 9) : (c = et, 0 === Zl && u(ks)), c !== et ? (e.substr(Vl, 2) === yr ? (h = yr, Vl += 2) : (h = et, 0 === Zl && u(_s)), h !== et ? l = c = [c, h] : (Vl = l, l = et)) : (Vl = l, l = et), l !== et && (Ql = s, l = "attribute"), (s = l) === et && (l = s = Vl, e.substr(Vl, 4) === xr ? (c = xr, Vl += 4) : (c = et, 0 === Zl && u(Ys)), c !== et ? (e.substr(Vl, 2) === yr ? (h = yr, Vl += 2) : (h = et, 0 === Zl && u(_s)), h !== et ? l = c = [c, h] : (Vl = l, l = et)) : (Vl = l, l = et), l !== et && (Ql = s, l = "self"), (s = l) === et && (l = s = Vl, e.substr(Vl, 18) === br ? (c = br, Vl += 18) : (c = et, 0 === Zl && u(qs)), c !== et ? (e.substr(Vl, 2) === yr ? (h = yr, Vl += 2) : (h = et, 0 === Zl && u(_s)), h !== et ? l = c = [c, h] : (Vl = l, l = et)) : (Vl = l, l = et), l !== et && (Ql = s, l = "descendant-or-self"), (s = l) === et && (l = s = Vl, e.substr(Vl, 17) === Er ? (c = Er, Vl += 17) : (c = et, 0 === Zl && u(Vs)), c !== et ? (e.substr(Vl, 2) === yr ? (h = yr, Vl += 2) : (h = et, 0 === Zl && u(_s)), h !== et ? l = c = [c, h] : (Vl = l, l = et)) : (Vl = l, l = et), l !== et && (Ql = s, l = "following-sibling"), (s = l) === et && (l = s = Vl, e.substr(Vl, 9) === Br ? (c = Br, Vl += 9) : (c = et, 0 === Zl && u(Qs)), c !== et ? (e.substr(Vl, 2) === yr ? (h = yr, Vl += 2) : (h = et, 0 === Zl && u(_s)), h !== et ? l = c = [c, h] : (Vl = l, l = et)) : (Vl = l, l = et), l !== et && (Ql = s, l = "following"), s = l)))))), Wl[o] = {
                                        i: Vl,
                                        result: s
                                    }, o = s), o !== et ? (s = z()) !== et ? (Ql = i, i = ["stepExpr", ["xpathAxis", o], s]) : (Vl = i, i = et) : (Vl = i, i = et), i === et && ((o = Wl[i = 233 * Vl + 102]) ? (Vl = o.i, i = o.result) : (o = Vl, 64 === e.charCodeAt(Vl) ? (s = Nr, Vl++) : (s = et, 0 === Zl && u(Js)), s === et && (s = null), (l = z()) !== et ? (Ql = o, o = s || "attributeTest" === l[0] || "schemaAttributeTest" === l[0] ? ["stepExpr", ["xpathAxis", "attribute"], l] : ["stepExpr", ["xpathAxis", "child"], l]) : (Vl = o, o = et), Wl[i] = {
                                        i: Vl,
                                        result: o
                                    }, i = o)), Wl[n] = {i: Vl, result: i}, n = i)), n !== et) {
                                        if (o = Wl[i = 233 * Vl + 110]) Vl = o.i, i = o.result; else {
                                            for (o = Vl, s = [], l = Vl, He(), (c = W()) !== et ? (Ql = l, l = c) : (Vl = l, l = et); l !== et;) s.push(l), l = Vl, He(), (c = W()) !== et ? (Ql = l, l = c) : (Vl = l, l = et);
                                            Ql = o, o = s = s.length ? ["predicates"].concat(s) : [], Wl[i] = {
                                                i: Vl,
                                                result: o
                                            }, i = o
                                        }
                                        Ql = a, a = 0 === i.length ? n : n.concat([i])
                                    } else Vl = a, a = et;
                                    Wl[t] = {i: Vl, result: a}, t = a
                                }
                                return Wl[r] = {i: Vl, result: t}, t
                            }

                            function K() {
                                var t, n = 233 * Vl + 96;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                if (t = Vl, e.substr(Vl, 2) === vr) {
                                    var r = vr;
                                    Vl += 2
                                } else r = et, 0 === Zl && u(js);
                                return r !== et && (Ql = t, r = ["stepExpr", ["xpathAxis", "descendant-or-self"], ["anyKindTest"]]), t = r, Wl[n] = {
                                    i: Vl,
                                    result: t
                                }, t
                            }

                            function z() {
                                var t, n, r, a = 233 * Vl + 106;
                                if (t = Wl[a]) return Vl = t.i, t.result;
                                if ((t = we()) === et) if (n = Wl[t = 233 * Vl + 107]) Vl = n.i, t = n.result; else {
                                    if (r = Wl[n = 233 * Vl + 108]) Vl = r.i, n = r.result; else {
                                        if (r = Vl, e.substr(Vl, 2) === Dr) {
                                            var i = Dr;
                                            Vl += 2
                                        } else i = et, 0 === Zl && u(tu);
                                        if (i !== et) {
                                            var o = Ge();
                                            o !== et ? (Ql = r, r = ["Wildcard", ["star"], ["NCName", o]]) : (Vl = r, r = et)
                                        } else Vl = r, r = et;
                                        r === et && (r = Vl, 42 === e.charCodeAt(Vl) ? (i = Un, Vl++) : (i = et, 0 === Zl && u(ns)), i !== et && (Ql = r, i = ["Wildcard"]), (r = i) === et && (r = Vl, (i = Te()) !== et ? (42 === e.charCodeAt(Vl) ? (o = Un, Vl++) : (o = et, 0 === Zl && u(ns)), o !== et ? (Ql = r, r = ["Wildcard", ["uri", i], ["star"]]) : (Vl = r, r = et)) : (Vl = r, r = et), r === et && (r = Vl, (i = Ge()) !== et ? (e.substr(Vl, 2) === Gr ? (o = Gr, Vl += 2) : (o = et, 0 === Zl && u(nu)), o !== et ? (Ql = r, r = ["Wildcard", ["NCName", i], ["star"]]) : (Vl = r, r = et)) : (Vl = r, r = et)))), Wl[n] = {
                                            i: Vl,
                                            result: r
                                        }, n = r
                                    }
                                    n === et && (n = Vl, (r = Be()) !== et && (Ql = n, r = ["nameTest"].concat(r)), n = r), Wl[t] = {
                                        i: Vl,
                                        result: n
                                    }, t = n
                                }
                                return Wl[a] = {i: Vl, result: t}, t
                            }

                            function Z() {
                                var t, n = 233 * Vl + 109;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                if (t = Vl, 40 === e.charCodeAt(Vl)) {
                                    var r = zt;
                                    Vl++
                                } else r = et, 0 === Zl && u(yo);
                                if (r !== et) {
                                    He(), r = Vl;
                                    var a = oe();
                                    if (a !== et) {
                                        var i = [], o = Vl;
                                        if (He(), 44 === e.charCodeAt(Vl)) {
                                            var s = Tt;
                                            Vl++
                                        } else s = et, 0 === Zl && u(Ji);
                                        for (s !== et ? (He(), (s = oe()) !== et ? (Ql = o, o = s) : (Vl = o, o = et)) : (Vl = o, o = et); o !== et;) i.push(o), o = Vl, He(), 44 === e.charCodeAt(Vl) ? (s = Tt, Vl++) : (s = et, 0 === Zl && u(Ji)), s !== et ? (He(), (s = oe()) !== et ? (Ql = o, o = s) : (Vl = o, o = et)) : (Vl = o, o = et);
                                        Ql = r, r = [a].concat(i)
                                    } else Vl = r, r = et;
                                    r === et && (r = null), He(), 41 === e.charCodeAt(Vl) ? (i = Zt, Vl++) : (i = et, 0 === Zl && u(wo)), i !== et ? (Ql = t, t = r || []) : (Vl = t, t = et)
                                } else Vl = t, t = et;
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function W() {
                                var t, n = 233 * Vl + 111;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                if (t = Vl, 91 === e.charCodeAt(Vl)) {
                                    var r = Mr;
                                    Vl++
                                } else r = et, 0 === Zl && u(ru);
                                if (r !== et) if (He(), (r = C()) !== et) {
                                    if (He(), 93 === e.charCodeAt(Vl)) {
                                        var a = Ur;
                                        Vl++
                                    } else a = et, 0 === Zl && u(au);
                                    a !== et ? (Ql = t, t = r) : (Vl = t, t = et)
                                } else Vl = t, t = et; else Vl = t, t = et;
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function $() {
                                var t, n = 233 * Vl + 112;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                if (t = Vl, 63 === e.charCodeAt(Vl)) {
                                    var r = Fr;
                                    Vl++
                                } else r = et, 0 === Zl && u(iu);
                                return r !== et ? (He(), (r = ee()) !== et ? (Ql = t, t = "*" === r ? ["lookup", ["star"]] : "string" == typeof r ? ["lookup", ["NCName", r]] : ["lookup", r]) : (Vl = t, t = et)) : (Vl = t, t = et), Wl[n] = {
                                    i: Vl,
                                    result: t
                                }, t
                            }

                            function ee() {
                                var t, n = 233 * Vl + 113;
                                return (t = Wl[n]) ? (Vl = t.i, t.result) : ((t = Ge()) === et && ((t = Ne()) === et && ((t = ie()) === et && (42 === e.charCodeAt(Vl) ? (t = Un, Vl++) : (t = et, 0 === Zl && u(ns))))), Wl[n] = {
                                    i: Vl,
                                    result: t
                                }, t)
                            }

                            function te() {
                                var e, t = 233 * Vl + 114;
                                if (e = Wl[t]) return Vl = e.i, e.result;
                                e = Vl;
                                var n = Be();
                                return n !== et && (Ql = e, n = ["EQName"].concat(n)), (e = n) === et && ((e = ae()) === et && (e = ie())), Wl[t] = {
                                    i: Vl,
                                    result: e
                                }, e
                            }

                            function ne() {
                                var t = 233 * Vl + 115, n = Wl[t];
                                if (n) return Vl = n.i, n.result;
                                var r = re();
                                if (r === et && ((r = ae()) === et && (r = ie()) === et)) {
                                    var a = 233 * Vl + 120, i = Wl[a];
                                    if (i) Vl = i.i, r = i.result; else {
                                        var o = Vl;
                                        if (46 === e.charCodeAt(Vl)) {
                                            var s = Pr;
                                            Vl++
                                        } else s = et, 0 === Zl && u(su);
                                        if (s !== et) {
                                            var l = Vl;
                                            if (Zl++, 46 === e.charCodeAt(Vl)) {
                                                var c = Pr;
                                                Vl++
                                            } else c = et, 0 === Zl && u(su);
                                            Zl--, c === et ? l = void 0 : (Vl = l, l = et), l !== et ? (Ql = o, o = ["contextItemExpr"]) : (Vl = o, o = et)
                                        } else Vl = o, o = et;
                                        Wl[a] = {i: Vl, result: o}, r = o
                                    }
                                    if (r === et) {
                                        var h, p = 233 * Vl + 121, f = Wl[p];
                                        if (f) Vl = f.i, r = f.result; else {
                                            var d = h = Vl;
                                            Zl++;
                                            var m = Vl, v = qe();
                                            if (v !== et) {
                                                var g = He();
                                                if (40 === e.charCodeAt(Vl)) {
                                                    var y = zt;
                                                    Vl++
                                                } else y = et, 0 === Zl && u(yo);
                                                y !== et ? m = v = [v, g, y] : (Vl = m, m = et)
                                            } else Vl = m, m = et;
                                            Zl--, m === et ? d = void 0 : (Vl = d, d = et), d !== et ? (m = Be()) !== et ? (He(), (g = Z()) !== et ? (Ql = h, h = ["functionCallExpr", ["functionName"].concat(m), ["arguments"].concat(g)]) : (Vl = h, h = et)) : (Vl = h, h = et) : (Vl = h, h = et), Wl[p] = {
                                                i: Vl,
                                                result: h
                                            }, r = h
                                        }
                                        if (r === et) {
                                            var A = 233 * Vl + 124, b = Wl[A];
                                            if (b) Vl = b.i, r = b.result; else {
                                                var N = se();
                                                if (N === et) {
                                                    var I = 233 * Vl + 140, O = Wl[I];
                                                    if (O) Vl = O.i, N = O.result; else {
                                                        var S = 233 * Vl + 141, R = Wl[S];
                                                        if (R) {
                                                            Vl = R.i;
                                                            var D = R.result
                                                        } else {
                                                            var G = Vl;
                                                            if (e.substr(Vl, 8) === zr) {
                                                                var M = zr;
                                                                Vl += 8
                                                            } else M = et, 0 === Zl && u(Au);
                                                            if (M !== et) {
                                                                He();
                                                                var U = B();
                                                                U !== et ? (Ql = G, G = U ? ["computedDocumentConstructor", ["argExpr", U]] : ["computedDocumentConstructor"]) : (Vl = G, G = et)
                                                            } else Vl = G, G = et;
                                                            Wl[S] = {i: Vl, result: G}, D = G
                                                        }
                                                        if (D === et) {
                                                            var F = 233 * Vl + 142, P = Wl[F];
                                                            if (P) Vl = P.i, D = P.result; else {
                                                                var H = Vl;
                                                                if (e.substr(Vl, 7) === Vt) {
                                                                    var j = Vt;
                                                                    Vl += 7
                                                                } else j = et, 0 === Zl && u(fo);
                                                                if (j !== et) {
                                                                    He();
                                                                    var X = Vl, _ = Be();
                                                                    if (_ !== et && (Ql = X, _ = ["tagName"].concat(_)), (X = _) === et) if (X = Vl, 123 === e.charCodeAt(Vl) ? (_ = on, Vl++) : (_ = et, 0 === Zl && u(To)), _ !== et) {
                                                                        He();
                                                                        var L = C();
                                                                        if (L !== et) {
                                                                            if (He(), 125 === e.charCodeAt(Vl)) {
                                                                                var k = sn;
                                                                                Vl++
                                                                            } else k = et, 0 === Zl && u(Io);
                                                                            k !== et ? (Ql = X, X = ["tagNameExpr", L]) : (Vl = X, X = et)
                                                                        } else Vl = X, X = et
                                                                    } else Vl = X, X = et;
                                                                    if (X !== et) {
                                                                        He();
                                                                        var Y = 233 * Vl + 143, q = Wl[Y];
                                                                        if (q) {
                                                                            Vl = q.i;
                                                                            var V = q.result
                                                                        } else {
                                                                            var Q = Vl, J = B();
                                                                            J !== et && (Ql = Q, J = J ? [["contentExpr", J]] : []), Q = J, Wl[Y] = {
                                                                                i: Vl,
                                                                                result: Q
                                                                            }, V = Q
                                                                        }
                                                                        V !== et ? (Ql = H, H = ["computedElementConstructor", X].concat(V)) : (Vl = H, H = et)
                                                                    } else Vl = H, H = et
                                                                } else Vl = H, H = et;
                                                                Wl[F] = {i: Vl, result: H}, D = H
                                                            }
                                                            if (D === et) {
                                                                var K = 233 * Vl + 144, z = Wl[K];
                                                                if (z) Vl = z.i, D = z.result; else {
                                                                    var W = Vl;
                                                                    if (e.substr(Vl, 9) === Ar) {
                                                                        var $ = Ar;
                                                                        Vl += 9
                                                                    } else $ = et, 0 === Zl && u(ks);
                                                                    if ($ !== et) {
                                                                        var te = Vl;
                                                                        if (Ve() !== et) {
                                                                            He();
                                                                            var ne = Be();
                                                                            ne !== et ? (Ql = te, te = ["tagName"].concat(ne)) : (Vl = te, te = et)
                                                                        } else Vl = te, te = et;
                                                                        if (te === et) {
                                                                            if (te = Vl, He(), 123 === e.charCodeAt(Vl)) {
                                                                                var oe = on;
                                                                                Vl++
                                                                            } else oe = et, 0 === Zl && u(To);
                                                                            if (oe !== et) {
                                                                                He();
                                                                                var ue = C();
                                                                                if (ue !== et) {
                                                                                    if (He(), 125 === e.charCodeAt(Vl)) {
                                                                                        var le = sn;
                                                                                        Vl++
                                                                                    } else le = et, 0 === Zl && u(Io);
                                                                                    le !== et ? (Ql = te, te = ["tagNameExpr", ue]) : (Vl = te, te = et)
                                                                                } else Vl = te, te = et
                                                                            } else Vl = te, te = et
                                                                        }
                                                                        te !== et ? (He(), (oe = B()) !== et ? (Ql = W, W = ["computedAttributeConstructor", te].concat([["valueExpr", oe || ["sequenceExpr"]]])) : (Vl = W, W = et)) : (Vl = W, W = et)
                                                                    } else Vl = W, W = et;
                                                                    Wl[K] = {i: Vl, result: W}, D = W
                                                                }
                                                                if (D === et) {
                                                                    var ce = 233 * Vl + 145, he = Wl[ce];
                                                                    if (he) Vl = he.i, D = he.result; else {
                                                                        var pe = Vl;
                                                                        if (e.substr(Vl, 9) === ut) {
                                                                            var de = ut;
                                                                            Vl += 9
                                                                        } else de = et, 0 === Zl && u(Oi);
                                                                        if (de !== et) {
                                                                            He();
                                                                            var me = 233 * Vl + 146, ge = Wl[me];
                                                                            if (ge) {
                                                                                Vl = ge.i;
                                                                                var ye = ge.result
                                                                            } else {
                                                                                var we = Vl, Ae = Ge();
                                                                                Ae !== et && (Ql = we, Ae = ["prefix", Ae]), we = Ae, Wl[me] = {
                                                                                    i: Vl,
                                                                                    result: we
                                                                                }, ye = we
                                                                            }
                                                                            if (ye === et) {
                                                                                var xe = 233 * Vl + 147, be = Wl[xe];
                                                                                if (be) Vl = be.i, ye = be.result; else {
                                                                                    var Ee = Vl, Ce = B();
                                                                                    Ce !== et && (Ql = Ee, Ce = Ce ? [["prefixExpr", Ce]] : []), Ee = Ce, Wl[xe] = {
                                                                                        i: Vl,
                                                                                        result: Ee
                                                                                    }, ye = Ee
                                                                                }
                                                                            }
                                                                            if (ye !== et) {
                                                                                He();
                                                                                var Te = 233 * Vl + 148, Ie = Wl[Te];
                                                                                if (Ie) {
                                                                                    Vl = Ie.i;
                                                                                    var Oe = Ie.result
                                                                                } else {
                                                                                    var Se = Vl, Re = B();
                                                                                    Re !== et && (Ql = Se, Re = Re ? [["URIExpr", Re]] : []), Se = Re, Wl[Te] = {
                                                                                        i: Vl,
                                                                                        result: Se
                                                                                    }, Oe = Se
                                                                                }
                                                                                Oe !== et ? (Ql = pe, pe = ["computedNamespaceConstructor"].concat(ye, Oe)) : (Vl = pe, pe = et)
                                                                            } else Vl = pe, pe = et
                                                                        } else Vl = pe, pe = et;
                                                                        Wl[ce] = {i: Vl, result: pe}, D = pe
                                                                    }
                                                                    if (D === et) {
                                                                        var De = 233 * Vl + 149, Me = Wl[De];
                                                                        if (Me) Vl = Me.i, D = Me.result; else {
                                                                            var Ue = Vl;
                                                                            if (e.substr(Vl, 4) === Zr) {
                                                                                var Fe = Zr;
                                                                                Vl += 4
                                                                            } else Fe = et, 0 === Zl && u(xu);
                                                                            if (Fe !== et) {
                                                                                He();
                                                                                var Pe = B();
                                                                                Pe !== et ? (Ql = Ue, Ue = ["computedTextConstructor"].concat(Pe ? [["argExpr", Pe]] : [])) : (Vl = Ue, Ue = et)
                                                                            } else Vl = Ue, Ue = et;
                                                                            Wl[De] = {i: Vl, result: Ue}, D = Ue
                                                                        }
                                                                        if (D === et) {
                                                                            var Xe = 233 * Vl + 150, _e = Wl[Xe];
                                                                            if (_e) Vl = _e.i, D = _e.result; else {
                                                                                var Le = Vl;
                                                                                if (e.substr(Vl, 7) === Wr) {
                                                                                    var ke = Wr;
                                                                                    Vl += 7
                                                                                } else ke = et, 0 === Zl && u(bu);
                                                                                if (ke !== et) {
                                                                                    He();
                                                                                    var Ye = B();
                                                                                    Ye !== et ? (Ql = Le, Le = ["computedCommentConstructor"].concat(Ye ? [["argExpr", Ye]] : [])) : (Vl = Le, Le = et)
                                                                                } else Vl = Le, Le = et;
                                                                                Wl[Xe] = {i: Vl, result: Le}, D = Le
                                                                            }
                                                                            if (D === et) {
                                                                                var Qe = 233 * Vl + 151, Je = Wl[Qe];
                                                                                if (Je) Vl = Je.i, D = Je.result; else {
                                                                                    var Ke = Vl;
                                                                                    if (e.substr(Vl, 22) === $r) {
                                                                                        var ze = $r;
                                                                                        Vl += 22
                                                                                    } else ze = et, 0 === Zl && u(Eu);
                                                                                    if (ze !== et) {
                                                                                        He();
                                                                                        var Ze = Vl, We = Ge();
                                                                                        if (We !== et && (Ql = Ze, We = ["piTarget", We]), (Ze = We) === et) if (Ze = Vl, 123 === e.charCodeAt(Vl) ? (We = on, Vl++) : (We = et, 0 === Zl && u(To)), We !== et) {
                                                                                            He();
                                                                                            var $e = C();
                                                                                            if ($e !== et) {
                                                                                                if (He(), 125 === e.charCodeAt(Vl)) {
                                                                                                    var tt = sn;
                                                                                                    Vl++
                                                                                                } else tt = et, 0 === Zl && u(Io);
                                                                                                tt !== et ? (Ql = Ze, Ze = ["piTargetExpr", $e]) : (Vl = Ze, Ze = et)
                                                                                            } else Vl = Ze, Ze = et
                                                                                        } else Vl = Ze, Ze = et;
                                                                                        if (Ze !== et) {
                                                                                            He();
                                                                                            var nt = B();
                                                                                            nt !== et ? (Ql = Ke, Ke = ["computedPIConstructor", Ze].concat(nt ? [["piValueExpr", nt]] : [])) : (Vl = Ke, Ke = et)
                                                                                        } else Vl = Ke, Ke = et
                                                                                    } else Vl = Ke, Ke = et;
                                                                                    Wl[Qe] = {i: Vl, result: Ke}, D = Ke
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        Wl[I] = {i: Vl, result: D}, N = D
                                                    }
                                                }
                                                Wl[A] = {i: Vl, result: N}, r = N
                                            }
                                            if (r === et) {
                                                var rt = 233 * Vl + 152, at = Wl[rt];
                                                if (at) Vl = at.i, r = at.result; else {
                                                    var it = 233 * Vl + 153, ot = Wl[it];
                                                    if (ot) {
                                                        Vl = ot.i;
                                                        var st = ot.result
                                                    } else {
                                                        var lt = Vl, ct = Be();
                                                        if (ct !== et) {
                                                            if (35 === e.charCodeAt(Vl)) {
                                                                var ht = ea;
                                                                Vl++
                                                            } else ht = et, 0 === Zl && u(Bu);
                                                            if (ht !== et) {
                                                                var pt = Ne();
                                                                pt !== et ? (Ql = lt, lt = ["namedFunctionRef", ["functionName"].concat(ct), pt]) : (Vl = lt, lt = et)
                                                            } else Vl = lt, lt = et
                                                        } else Vl = lt, lt = et;
                                                        Wl[it] = {i: Vl, result: lt}, st = lt
                                                    }
                                                    if (st === et) {
                                                        var ft, dt = 233 * Vl + 154, mt = Wl[dt];
                                                        if (mt) Vl = mt.i, st = mt.result; else {
                                                            var vt = Vl, gt = [];
                                                            for (ft = w(); ft !== et;) gt.push(ft), ft = w();
                                                            if (He(), e.substr(Vl, 8) === Qt) {
                                                                var yt = Qt;
                                                                Vl += 8
                                                            } else yt = et, 0 === Zl && u(mo);
                                                            if (yt !== et) {
                                                                if (He(), 40 === e.charCodeAt(Vl)) {
                                                                    var wt = zt;
                                                                    Vl++
                                                                } else wt = et, 0 === Zl && u(yo);
                                                                if (wt !== et) {
                                                                    He();
                                                                    var At = x();
                                                                    if (At === et && (At = null), He(), 41 === e.charCodeAt(Vl)) {
                                                                        var xt = Zt;
                                                                        Vl++
                                                                    } else xt = et, 0 === Zl && u(wo);
                                                                    if (xt !== et) {
                                                                        He();
                                                                        var bt = Vl;
                                                                        if (e.substr(Vl, 2) === an) {
                                                                            var Et = an;
                                                                            Vl += 2
                                                                        } else Et = et, 0 === Zl && u(Co);
                                                                        if (Et !== et) if (je() !== et) {
                                                                            var Bt = ve();
                                                                            Bt !== et ? (He(), Ql = bt, bt = ["typeDeclaration"].concat(Bt)) : (Vl = bt, bt = et)
                                                                        } else Vl = bt, bt = et; else Vl = bt, bt = et;
                                                                        bt === et && (bt = null), (Et = E()) !== et ? (Ql = vt, vt = ["inlineFunctionExpr"].concat(gt, [["paramList"].concat(At || [])], bt ? [bt] : [], [["functionBody", Et]])) : (Vl = vt, vt = et)
                                                                    } else Vl = vt, vt = et
                                                                } else Vl = vt, vt = et
                                                            } else Vl = vt, vt = et;
                                                            Wl[dt] = {i: Vl, result: vt}, st = vt
                                                        }
                                                    }
                                                    Wl[rt] = {i: Vl, result: st}, r = st
                                                }
                                                if (r === et) {
                                                    var Nt = 233 * Vl + 155, Ct = Wl[Nt];
                                                    if (Ct) Vl = Ct.i, r = Ct.result; else {
                                                        var It = Vl;
                                                        if (e.substr(Vl, 3) === ta) {
                                                            var Ot = ta;
                                                            Vl += 3
                                                        } else Ot = et, 0 === Zl && u(Nu);
                                                        if (Ot !== et) {
                                                            if (He(), 123 === e.charCodeAt(Vl)) {
                                                                var St = on;
                                                                Vl++
                                                            } else St = et, 0 === Zl && u(To);
                                                            if (St !== et) {
                                                                He();
                                                                var Rt = Vl, Dt = fe();
                                                                if (Dt !== et) {
                                                                    var Gt = [], Mt = Vl;
                                                                    if (He(), 44 === e.charCodeAt(Vl)) {
                                                                        var Ut = Tt;
                                                                        Vl++
                                                                    } else Ut = et, 0 === Zl && u(Ji);
                                                                    if (Ut !== et) {
                                                                        He();
                                                                        var Ft = fe();
                                                                        Ft !== et ? (Ql = Mt, Mt = Ft) : (Vl = Mt, Mt = et)
                                                                    } else Vl = Mt, Mt = et;
                                                                    for (; Mt !== et;) Gt.push(Mt), Mt = Vl, He(), 44 === e.charCodeAt(Vl) ? (Ut = Tt, Vl++) : (Ut = et, 0 === Zl && u(Ji)), Ut !== et ? (He(), (Ft = fe()) !== et ? (Ql = Mt, Mt = Ft) : (Vl = Mt, Mt = et)) : (Vl = Mt, Mt = et);
                                                                    Ql = Rt, Rt = [Dt].concat(Gt)
                                                                } else Vl = Rt, Rt = et;
                                                                Rt === et && (Rt = null), He(), 125 === e.charCodeAt(Vl) ? (Gt = sn, Vl++) : (Gt = et, 0 === Zl && u(Io)), Gt !== et ? (Ql = It, It = Rt ? ["mapConstructor"].concat(Rt) : ["mapConstructor"]) : (Vl = It, It = et)
                                                            } else Vl = It, It = et
                                                        } else Vl = It, It = et;
                                                        Wl[Nt] = {i: Vl, result: It}, r = It
                                                    }
                                                    if (r === et) {
                                                        var Pt = 233 * Vl + 159, Ht = Wl[Pt];
                                                        if (Ht) Vl = Ht.i, r = Ht.result; else {
                                                            var jt = Vl, Xt = 233 * Vl + 160, _t = Wl[Xt];
                                                            if (_t) {
                                                                Vl = _t.i;
                                                                var Lt = _t.result
                                                            } else {
                                                                var kt = Vl;
                                                                if (91 === e.charCodeAt(Vl)) {
                                                                    var Yt = Mr;
                                                                    Vl++
                                                                } else Yt = et, 0 === Zl && u(ru);
                                                                if (Yt !== et) {
                                                                    He();
                                                                    var qt = Vl, Jt = T();
                                                                    if (Jt !== et) {
                                                                        He();
                                                                        var Kt = [], Wt = Vl;
                                                                        if (44 === e.charCodeAt(Vl)) {
                                                                            var $t = Tt;
                                                                            Vl++
                                                                        } else $t = et, 0 === Zl && u(Ji);
                                                                        if ($t !== et) {
                                                                            He();
                                                                            var en = T();
                                                                            en !== et ? (Ql = Wt, Wt = en) : (Vl = Wt, Wt = et)
                                                                        } else Vl = Wt, Wt = et;
                                                                        for (; Wt !== et;) Kt.push(Wt), Wt = Vl, 44 === e.charCodeAt(Vl) ? ($t = Tt, Vl++) : ($t = et, 0 === Zl && u(Ji)), $t !== et ? (He(), (en = T()) !== et ? (Ql = Wt, Wt = en) : (Vl = Wt, Wt = et)) : (Vl = Wt, Wt = et);
                                                                        Ql = qt, qt = function (e, t) {
                                                                            return [e].concat(t).map((function (e) {
                                                                                return ["arrayElem", e]
                                                                            }))
                                                                        }(Jt, Kt)
                                                                    } else Vl = qt, qt = et;
                                                                    if (qt === et && (qt = null), He(), 93 === e.charCodeAt(Vl)) {
                                                                        var tn = Ur;
                                                                        Vl++
                                                                    } else tn = et, 0 === Zl && u(au);
                                                                    tn !== et ? (Ql = kt, kt = ["squareArray"].concat(qt)) : (Vl = kt, kt = et)
                                                                } else Vl = kt, kt = et;
                                                                Wl[Xt] = {i: Vl, result: kt}, Lt = kt
                                                            }
                                                            if (Lt !== et && (Ql = jt, Lt = ["arrayConstructor", Lt]), (jt = Lt) === et) {
                                                                jt = Vl;
                                                                var nn = 233 * Vl + 161, rn = Wl[nn];
                                                                if (rn) Vl = rn.i, Lt = rn.result; else {
                                                                    var un = Vl;
                                                                    if (e.substr(Vl, 5) === ra) {
                                                                        var ln = ra;
                                                                        Vl += 5
                                                                    } else ln = et, 0 === Zl && u(Tu);
                                                                    if (ln !== et) {
                                                                        He();
                                                                        var cn = B();
                                                                        cn !== et ? (Ql = un, un = ["curlyArray"].concat(cn ? [["arrayElem", cn]] : [])) : (Vl = un, un = et)
                                                                    } else Vl = un, un = et;
                                                                    Wl[nn] = {i: Vl, result: un}, Lt = un
                                                                }
                                                                Lt !== et && (Ql = jt, Lt = ["arrayConstructor", Lt]), jt = Lt
                                                            }
                                                            Wl[Pt] = {i: Vl, result: jt}, r = jt
                                                        }
                                                        if (r === et) {
                                                            var hn = 233 * Vl + 162, pn = Wl[hn];
                                                            if (pn) Vl = pn.i, r = pn.result; else {
                                                                var fn = Vl;
                                                                if (63 === e.charCodeAt(Vl)) {
                                                                    var dn = Fr;
                                                                    Vl++
                                                                } else dn = et, 0 === Zl && u(iu);
                                                                if (dn !== et) {
                                                                    He();
                                                                    var mn = ee();
                                                                    mn !== et ? (Ql = fn, fn = "*" === mn ? ["unaryLookup", ["star"]] : "string" == typeof mn ? ["unaryLookup", ["NCName", mn]] : ["unaryLookup", mn]) : (Vl = fn, fn = et)
                                                                } else Vl = fn, fn = et;
                                                                Wl[hn] = {i: Vl, result: fn}, r = fn
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                return Wl[t] = {i: Vl, result: r}, r
                            }

                            function re() {
                                var t, n, r, a, i = 233 * Vl + 116;
                                if (t = Wl[i]) return Vl = t.i, t.result;
                                if (n = Wl[t = 233 * Vl + 117]) Vl = n.i, t = n.result; else {
                                    var o;
                                    n = Vl;
                                    var s = 233 * Vl + 195;
                                    if (r = Wl[s]) Vl = r.i, s = r.result; else {
                                        var l = o = a = r = Vl;
                                        if (46 === e.charCodeAt(Vl)) {
                                            var c = Pr;
                                            Vl++
                                        } else c = et, 0 === Zl && u(su);
                                        if (c !== et) {
                                            var h = Ue();
                                            h !== et ? l = c = [c, h] : (Vl = l, l = et)
                                        } else Vl = l, l = et;
                                        if (l === et) if (l = Vl, (c = Ue()) !== et) {
                                            if (h = Vl, 46 === e.charCodeAt(Vl)) {
                                                var p = Pr;
                                                Vl++
                                            } else p = et, 0 === Zl && u(su);
                                            if (p !== et) {
                                                for (l = [], si.test(e.charAt(Vl)) ? (h = e.charAt(Vl), Vl++) : (h = et, 0 === Zl && u(_u)); h !== et;) l.push(h), si.test(e.charAt(Vl)) ? (h = e.charAt(Vl), Vl++) : (h = et, 0 === Zl && u(_u));
                                                h = p = [p, l]
                                            } else Vl = h, h = et;
                                            h === et && (h = null), l = c = [c, h]
                                        } else Vl = l, l = et;
                                        l !== et ? (ui.test(e.charAt(Vl)) ? (c = e.charAt(Vl), Vl++) : (c = et, 0 === Zl && u(Lu)), c !== et ? (li.test(e.charAt(Vl)) ? (h = e.charAt(Vl), Vl++) : (h = et, 0 === Zl && u(ku)), h === et && (h = null), (p = Ue()) !== et ? o = l = [l, c, h, p] : (Vl = o, o = et)) : (Vl = o, o = et)) : (Vl = o, o = et), (a = o !== et ? e.substring(a, Vl) : o) !== et && (Ql = r, a = ["doubleConstantExpr", ["value", a]]), r = a, Wl[s] = {
                                            i: Vl,
                                            result: r
                                        }, s = r
                                    }
                                    s === et && ((r = Wl[s = 233 * Vl + 194]) ? (Vl = r.i, s = r.result) : (p = a = r = Vl, 46 === e.charCodeAt(Vl) ? (o = Pr, Vl++) : (o = et, 0 === Zl && u(su)), o !== et ? (c = Ue()) !== et ? p = o = [o, c] : (Vl = p, p = et) : (Vl = p, p = et), (a = p !== et ? e.substring(a, Vl) : p) !== et && (Ql = r, a = ["decimalConstantExpr", ["value", a]]), (r = a) === et && (p = a = r = Vl, (o = Ue()) !== et ? (46 === e.charCodeAt(Vl) ? (c = Pr, Vl++) : (c = et, 0 === Zl && u(su)), c !== et ? ((p = Ue()) === et && (p = null), p = o = [o, c, p]) : (Vl = p, p = et)) : (Vl = p, p = et), (a = p !== et ? e.substring(a, Vl) : p) !== et && (Ql = r, a = ["decimalConstantExpr", ["value", a]]), r = a), Wl[s] = {
                                        i: Vl,
                                        result: r
                                    }, s = r), s === et && (s = Ne())), s !== et ? (r = Vl, Zl++, oi.test(e.charAt(Vl)) ? (a = e.charAt(Vl), Vl++) : (a = et, 0 === Zl && u(ou)), Zl--, a === et ? r = void 0 : (Vl = r, r = et), r !== et ? (Ql = n, n = s) : (Vl = n, n = et)) : (Vl = n, n = et), Wl[t] = {
                                        i: Vl,
                                        result: n
                                    }, t = n
                                }
                                return t === et && (t = Vl, (n = Ce()) !== et && (Ql = t, n = ["stringConstantExpr", ["value", Ke(n)]]), t = n), Wl[i] = {
                                    i: Vl,
                                    result: t
                                }, t
                            }

                            function ae() {
                                var t, n = 233 * Vl + 118;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                if (t = Vl, 36 === e.charCodeAt(Vl)) {
                                    var r = $t;
                                    Vl++
                                } else r = et, 0 === Zl && u(xo);
                                return r !== et ? (r = Be()) !== et ? (Ql = t, t = ["varRef", ["name"].concat(r)]) : (Vl = t, t = et) : (Vl = t, t = et), Wl[n] = {
                                    i: Vl,
                                    result: t
                                }, t
                            }

                            function ie() {
                                var t, n = 233 * Vl + 119;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                if (t = Vl, 40 === e.charCodeAt(Vl)) {
                                    var r = zt;
                                    Vl++
                                } else r = et, 0 === Zl && u(yo);
                                if (r !== et) if (He(), (r = C()) !== et) {
                                    if (He(), 41 === e.charCodeAt(Vl)) {
                                        var a = Zt;
                                        Vl++
                                    } else a = et, 0 === Zl && u(wo);
                                    a !== et ? (Ql = t, t = r) : (Vl = t, t = et)
                                } else Vl = t, t = et; else Vl = t, t = et;
                                return t === et && (t = Vl, 40 === e.charCodeAt(Vl) ? (r = zt, Vl++) : (r = et, 0 === Zl && u(yo)), r !== et ? (He(), 41 === e.charCodeAt(Vl) ? (r = Zt, Vl++) : (r = et, 0 === Zl && u(wo)), r !== et ? (Ql = t, t = ["sequenceExpr"]) : (Vl = t, t = et)) : (Vl = t, t = et)), Wl[n] = {
                                    i: Vl,
                                    result: t
                                }, t
                            }

                            function oe() {
                                var t, n, r = 233 * Vl + 122;
                                if (t = Wl[r]) return Vl = t.i, t.result;
                                if ((t = T()) === et) if (n = Wl[t = 233 * Vl + 123]) Vl = n.i, t = n.result; else {
                                    if (n = Vl, 63 === e.charCodeAt(Vl)) {
                                        var a = Fr;
                                        Vl++
                                    } else a = et, 0 === Zl && u(iu);
                                    a !== et && (Ql = n, a = ["argumentPlaceholder"]), n = a, Wl[t] = {
                                        i: Vl,
                                        result: n
                                    }, t = n
                                }
                                return Wl[r] = {i: Vl, result: t}, t
                            }

                            function se() {
                                var t, n, r, a = 233 * Vl + 125;
                                if (t = Wl[a]) return Vl = t.i, t.result;
                                if (n = Wl[t = 233 * Vl + 126]) Vl = n.i, t = n.result; else {
                                    if (n = Vl, 60 === e.charCodeAt(Vl)) {
                                        var i = zn;
                                        Vl++
                                    } else i = et, 0 === Zl && u(gs);
                                    if (i !== et) if ((i = De()) !== et) {
                                        var o = 233 * Vl + 127;
                                        if (r = Wl[o]) Vl = r.i, o = r.result; else {
                                            r = Vl;
                                            var s = [], l = Vl, c = Xe();
                                            for (c !== et ? ((c = ue()) === et && (c = null), Ql = l, l = c) : (Vl = l, l = et); l !== et;) s.push(l), l = Vl, (c = Xe()) !== et ? ((c = ue()) === et && (c = null), Ql = l, l = c) : (Vl = l, l = et);
                                            Ql = r, r = s = s.filter(Boolean), Wl[o] = {i: Vl, result: r}, o = r
                                        }
                                        if (s = Vl, e.substr(Vl, 2) === Hr ? (r = Hr, Vl += 2) : (r = et, 0 === Zl && u(uu)), r !== et && (Ql = s, r = null), (s = r) === et) if (s = Vl, 62 === e.charCodeAt(Vl) ? (r = Wn, Vl++) : (r = et, 0 === Zl && u(ws)), r !== et) {
                                            for (r = [], l = he(); l !== et;) r.push(l), l = he();
                                            He(), e.substr(Vl, 2) === jr ? (l = jr, Vl += 2) : (l = et, 0 === Zl && u(lu)), l !== et ? (l = De()) !== et ? (Xe(), 62 === e.charCodeAt(Vl) ? (c = Wn, Vl++) : (c = et, 0 === Zl && u(ws)), c !== et ? (Ql = s, (s = 1 === i.length ? i[0] : i[0].prefix + ":" + i[1]) !== (l = 1 === l.length ? l[0] : l[0].prefix + ":" + l[1]) && We("XQST0118", 'The start and the end tag of an element constructor must be equal. "' + s + '" does not match "' + l + '"'), s = ze(r, !0, !0)) : (Vl = s, s = et)) : (Vl = s, s = et) : (Vl = s, s = et)
                                        } else Vl = s, s = et;
                                        s !== et ? (Ql = n, n = ["elementConstructor", ["tagName"].concat(i)].concat(o.length ? [["attributeList"].concat(o)] : [], s && s.length ? [["elementContent"].concat(s)] : [])) : (Vl = n, n = et)
                                    } else Vl = n, n = et; else Vl = n, n = et;
                                    Wl[t] = {i: Vl, result: n}, t = n
                                }
                                if (t === et) {
                                    if (n = Wl[t = 233 * Vl + 134]) Vl = n.i, t = n.result; else {
                                        if (n = Vl, e.substr(Vl, 4) === Yr ? (i = Yr, Vl += 4) : (i = et, 0 === Zl && u(du)), i !== et) {
                                            if (i = Vl, r = Wl[o = 233 * Vl + 135]) Vl = r.i; else {
                                                if (r = [], l = s = Vl, Zl++, 45 === e.charCodeAt(Vl) ? (c = Gn, Vl++) : (c = et, 0 === Zl && u(es)), Zl--, c === et ? l = void 0 : (Vl = l, l = et), l !== et ? (c = Me()) !== et ? s = l = [l, c] : (Vl = s, s = et) : (Vl = s, s = et), s === et) if (s = Vl, 45 === e.charCodeAt(Vl) ? (l = Gn, Vl++) : (l = et, 0 === Zl && u(es)), l !== et) {
                                                    var h = c = Vl;
                                                    if (Zl++, 45 === e.charCodeAt(Vl)) {
                                                        var p = Gn;
                                                        Vl++
                                                    } else p = et, 0 === Zl && u(es);
                                                    Zl--, p === et ? h = void 0 : (Vl = h, h = et), h !== et ? (p = Me()) !== et ? c = h = [h, p] : (Vl = c, c = et) : (Vl = c, c = et), c !== et ? s = l = [l, c] : (Vl = s, s = et)
                                                } else Vl = s, s = et;
                                                for (; s !== et;) r.push(s), l = s = Vl, Zl++, 45 === e.charCodeAt(Vl) ? (c = Gn, Vl++) : (c = et, 0 === Zl && u(es)), Zl--, c === et ? l = void 0 : (Vl = l, l = et), l !== et ? (c = Me()) !== et ? s = l = [l, c] : (Vl = s, s = et) : (Vl = s, s = et), s === et && (s = Vl, 45 === e.charCodeAt(Vl) ? (l = Gn, Vl++) : (l = et, 0 === Zl && u(es)), l !== et ? (h = c = Vl, Zl++, 45 === e.charCodeAt(Vl) ? (p = Gn, Vl++) : (p = et, 0 === Zl && u(es)), Zl--, p === et ? h = void 0 : (Vl = h, h = et), h !== et ? (p = Me()) !== et ? c = h = [h, p] : (Vl = c, c = et) : (Vl = c, c = et), c !== et ? s = l = [l, c] : (Vl = s, s = et)) : (Vl = s, s = et));
                                                Wl[o] = {i: Vl, result: r}
                                            }
                                            i = e.substring(i, Vl), e.substr(Vl, 3) === qr ? (o = qr, Vl += 3) : (o = et, 0 === Zl && u(mu)), o !== et ? (Ql = n, n = ["computedCommentConstructor", ["argExpr", ["stringConstantExpr", ["value", i]]]]) : (Vl = n, n = et)
                                        } else Vl = n, n = et;
                                        Wl[t] = {i: Vl, result: n}, t = n
                                    }
                                    if (t === et) if (n = Wl[t = 233 * Vl + 136]) Vl = n.i, t = n.result; else {
                                        if (n = Vl, e.substr(Vl, 2) === Vr ? (i = Vr, Vl += 2) : (i = et, 0 === Zl && u(vu)), i !== et) {
                                            if (i = Vl, r = Wl[o = 233 * Vl + 206]) Vl = r.i, o = r.result; else {
                                                if (s = r = Vl, Zl++, l = Vl, 88 === e.charCodeAt(Vl) ? (c = Ca, Vl++) : (c = et, 0 === Zl && u(sl)), c === et && (120 === e.charCodeAt(Vl) ? (c = Ta, Vl++) : (c = et, 0 === Zl && u(ul))), c !== et ? (77 === e.charCodeAt(Vl) ? (h = Ia, Vl++) : (h = et, 0 === Zl && u(ll)), h === et && (109 === e.charCodeAt(Vl) ? (h = Oa, Vl++) : (h = et, 0 === Zl && u(cl))), h !== et ? (76 === e.charCodeAt(Vl) ? (p = Sa, Vl++) : (p = et, 0 === Zl && u(hl)), p === et && (108 === e.charCodeAt(Vl) ? (p = Ra, Vl++) : (p = et, 0 === Zl && u(pl))), p !== et ? l = c = [c, h, p] : (Vl = l, l = et)) : (Vl = l, l = et)) : (Vl = l, l = et), Zl--, l === et ? s = void 0 : (Vl = s, s = et), s !== et) {
                                                    var f;
                                                    if (c = Wl[l = 233 * Vl + 230]) Vl = c.i, l = c.result; else {
                                                        if (h = c = Vl, (f = Wl[p = 233 * Vl + 229]) ? (Vl = f.i, p = f.result) : ((f = Le()) === et && (58 === e.charCodeAt(Vl) ? (f = na, Vl++) : (f = et, 0 === Zl && u(Cu))), Wl[p] = {
                                                            i: Vl,
                                                            result: f
                                                        }, p = f), p !== et) {
                                                            for (h = [], f = Ye(); f !== et;) h.push(f), f = Ye();
                                                            h = p = [p, h]
                                                        } else Vl = h, h = et;
                                                        c = h !== et ? e.substring(c, Vl) : h, Wl[l] = {
                                                            i: Vl,
                                                            result: c
                                                        }, l = c
                                                    }
                                                    l !== et ? r = s = [s, l] : (Vl = r, r = et)
                                                } else Vl = r, r = et;
                                                Wl[o] = {i: Vl, result: r}, o = r
                                            }
                                            if ((i = o !== et ? e.substring(i, Vl) : o) !== et) {
                                                if (o = Vl, (r = Xe()) !== et) {
                                                    if (r = Vl, l = Wl[s = 233 * Vl + 137]) Vl = l.i; else {
                                                        for (l = [], h = c = Vl, Zl++, e.substr(Vl, 2) === Qr ? (p = Qr, Vl += 2) : (p = et, 0 === Zl && u(gu)), Zl--, p === et ? h = void 0 : (Vl = h, h = et), h !== et ? (p = Me()) !== et ? c = h = [h, p] : (Vl = c, c = et) : (Vl = c, c = et); c !== et;) l.push(c), h = c = Vl, Zl++, e.substr(Vl, 2) === Qr ? (p = Qr, Vl += 2) : (p = et, 0 === Zl && u(gu)), Zl--, p === et ? h = void 0 : (Vl = h, h = et), h !== et ? (p = Me()) !== et ? c = h = [h, p] : (Vl = c, c = et) : (Vl = c, c = et);
                                                        Wl[s] = {i: Vl, result: l}
                                                    }
                                                    r = e.substring(r, Vl), Ql = o, o = r
                                                } else Vl = o, o = et;
                                                o === et && (o = null), e.substr(Vl, 2) === Qr ? (r = Qr, Vl += 2) : (r = et, 0 === Zl && u(gu)), r !== et ? (Ql = n, n = ["computedPIConstructor", ["piTarget", i], ["piValueExpr", ["stringConstantExpr", ["value", o]]]]) : (Vl = n, n = et)
                                            } else Vl = n, n = et
                                        } else Vl = n, n = et;
                                        Wl[t] = {i: Vl, result: n}, t = n
                                    }
                                }
                                return Wl[a] = {i: Vl, result: t}, t
                            }

                            function ue() {
                                var t, n = 233 * Vl + 128;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                var r = Vl;
                                if ((t = De()) !== et) {
                                    if (Xe(), 61 === e.charCodeAt(Vl)) {
                                        var a = lt;
                                        Vl++
                                    } else a = et, 0 === Zl && u(Si);
                                    if (a !== et) {
                                        var i;
                                        if (Xe(), i = Wl[a = 233 * Vl + 129]) Vl = i.i, a = i.result; else {
                                            if (i = Vl, 34 === e.charCodeAt(Vl)) {
                                                var o = Xr;
                                                Vl++
                                            } else o = et, 0 === Zl && u(cu);
                                            if (o !== et) {
                                                o = [];
                                                var s = Oe();
                                                for (s === et && (s = le()); s !== et;) o.push(s), (s = Oe()) === et && (s = le());
                                                34 === e.charCodeAt(Vl) ? (s = Xr, Vl++) : (s = et, 0 === Zl && u(cu)), s !== et ? (Ql = i, i = ze(o, !1, !1)) : (Vl = i, i = et)
                                            } else Vl = i, i = et;
                                            if (i === et) if (i = Vl, 39 === e.charCodeAt(Vl) ? (o = _r, Vl++) : (o = et, 0 === Zl && u(hu)), o !== et) {
                                                for (o = [], (s = Se()) === et && (s = ce()); s !== et;) o.push(s), (s = Se()) === et && (s = ce());
                                                39 === e.charCodeAt(Vl) ? (s = _r, Vl++) : (s = et, 0 === Zl && u(hu)), s !== et ? (Ql = i, i = ze(o, !1, !1)) : (Vl = i, i = et)
                                            } else Vl = i, i = et;
                                            Wl[a] = {i: Vl, result: i}, a = i
                                        }
                                        a !== et ? (Ql = r, r = a, 1 === t.length && "xmlns" === t[0] ? (r.length && "string" != typeof r[0] && We("XQST0022", "A namespace declaration may not contain enclosed expressions"), r = ["namespaceDeclaration", r.length ? ["uri", r[0]] : ["uri"]]) : "xmlns" === t[0].prefix ? (r.length && "string" != typeof r[0] && We("XQST0022", "The namespace declaration for 'xmlns:" + t[1] + "' may not contain enclosed expressions"), r = ["namespaceDeclaration", ["prefix", t[1]], r.length ? ["uri", r[0]] : ["uri"]]) : r = ["attributeConstructor", ["attributeName"].concat(t), 0 === r.length ? ["attributeValue"] : 1 === r.length && "string" == typeof r[0] ? ["attributeValue", r[0]] : ["attributeValueExpr"].concat(r)]) : (Vl = r, r = et)
                                    } else Vl = r, r = et
                                } else Vl = r, r = et;
                                return Wl[n] = {i: Vl, result: r}, r
                            }

                            function le() {
                                var t, n, r = 233 * Vl + 130;
                                if (t = Wl[r]) return Vl = t.i, t.result;
                                t = Vl;
                                var a = 233 * Vl + 203;
                                if (n = Wl[a]) Vl = n.i, a = n.result; else {
                                    var i = n = Vl;
                                    if (Zl++, vi.test(e.charAt(Vl))) {
                                        var o = e.charAt(Vl);
                                        Vl++
                                    } else o = et, 0 === Zl && u(rl);
                                    Zl--, o === et ? i = void 0 : (Vl = i, i = et), i !== et ? (o = Me()) !== et ? (Ql = n, n = o) : (Vl = n, n = et) : (Vl = n, n = et), Wl[a] = {
                                        i: Vl,
                                        result: n
                                    }, a = n
                                }
                                return a !== et && (Ql = t, a = a.replace(/[\x20\x0D\x0A\x09]/g, " ")), (t = a) === et && (t = pe()), Wl[r] = {
                                    i: Vl,
                                    result: t
                                }, t
                            }

                            function ce() {
                                var t, n, r = 233 * Vl + 131;
                                if (t = Wl[r]) return Vl = t.i, t.result;
                                t = Vl;
                                var a = 233 * Vl + 204;
                                if (n = Wl[a]) Vl = n.i, a = n.result; else {
                                    var i = n = Vl;
                                    if (Zl++, gi.test(e.charAt(Vl))) {
                                        var o = e.charAt(Vl);
                                        Vl++
                                    } else o = et, 0 === Zl && u(al);
                                    Zl--, o === et ? i = void 0 : (Vl = i, i = et), i !== et ? (o = Me()) !== et ? (Ql = n, n = o) : (Vl = n, n = et) : (Vl = n, n = et), Wl[a] = {
                                        i: Vl,
                                        result: n
                                    }, a = n
                                }
                                return a !== et && (Ql = t, a = a.replace(/[\x20\x0D\x0A\x09]/g, " ")), (t = a) === et && (t = pe()), Wl[r] = {
                                    i: Vl,
                                    result: t
                                }, t
                            }

                            function he() {
                                var t, n, r = 233 * Vl + 132;
                                if (t = Wl[r]) return Vl = t.i, t.result;
                                t = Vl;
                                var a = 233 * Vl + 138;
                                if (n = Wl[a]) Vl = n.i, a = n.result; else {
                                    if (n = Vl, e.substr(Vl, 9) === Jr) {
                                        var i = Jr;
                                        Vl += 9
                                    } else i = et, 0 === Zl && u(yu);
                                    if (i !== et) {
                                        var o, s;
                                        i = Vl;
                                        var l = 233 * Vl + 139;
                                        if (o = Wl[l]) Vl = o.i; else {
                                            o = [];
                                            var c = s = Vl;
                                            if (Zl++, e.substr(Vl, 3) === Kr) {
                                                var h = Kr;
                                                Vl += 3
                                            } else h = et, 0 === Zl && u(wu);
                                            for (Zl--, h === et ? c = void 0 : (Vl = c, c = et), c !== et ? (h = Me()) !== et ? s = c = [c, h] : (Vl = s, s = et) : (Vl = s, s = et); s !== et;) o.push(s), c = s = Vl, Zl++, e.substr(Vl, 3) === Kr ? (h = Kr, Vl += 3) : (h = et, 0 === Zl && u(wu)), Zl--, h === et ? c = void 0 : (Vl = c, c = et), c !== et ? (h = Me()) !== et ? s = c = [c, h] : (Vl = s, s = et) : (Vl = s, s = et);
                                            Wl[l] = {i: Vl, result: o}
                                        }
                                        i = e.substring(i, Vl), e.substr(Vl, 3) === Kr ? (l = Kr, Vl += 3) : (l = et, 0 === Zl && u(wu)), l !== et ? (Ql = n, n = ["CDataSection", i]) : (Vl = n, n = et)
                                    } else Vl = n, n = et;
                                    Wl[a] = {i: Vl, result: n}, a = n
                                }
                                return a !== et && (Ql = t), (t = a) === et && (t = Vl, (a = se()) !== et && (Ql = t), (t = a) === et && (t = Vl, (a = pe()) !== et && (Ql = t), (t = a) === et && (a = t = Vl, (i = Wl[n = 233 * Vl + 202]) ? (Vl = i.i, n = i.result) : (l = i = Vl, Zl++, mi.test(e.charAt(Vl)) ? (o = e.charAt(Vl), Vl++) : (o = et, 0 === Zl && u(nl)), Zl--, o === et ? l = void 0 : (Vl = l, l = et), l !== et ? (o = Me()) !== et ? i = l = [l, o] : (Vl = i, i = et) : (Vl = i, i = et), Wl[n] = {
                                    i: Vl,
                                    result: i
                                }, n = i), (a = n !== et ? e.substring(a, Vl) : n) !== et && (Ql = t), t = a))), Wl[r] = {
                                    i: Vl,
                                    result: t
                                }, t
                            }

                            function pe() {
                                var t, n = 233 * Vl + 133;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                if ((t = Ie()) === et && (t = Re()) === et) {
                                    if (t = Vl, e.substr(Vl, 2) === Lr) {
                                        var r = Lr;
                                        Vl += 2
                                    } else r = et, 0 === Zl && u(pu);
                                    r !== et && (Ql = t, r = "{"), (t = r) === et && (t = Vl, e.substr(Vl, 2) === kr ? (r = kr, Vl += 2) : (r = et, 0 === Zl && u(fu)), r !== et && (Ql = t, r = "}"), (t = r) === et && (t = Vl, (r = B()) !== et && (Ql = t, r = r || ["sequenceExpr"]), t = r))
                                }
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function fe() {
                                var t, n, r = 233 * Vl + 156;
                                if (t = Wl[r]) return Vl = t.i, t.result;
                                t = Vl;
                                var a = 233 * Vl + 157;
                                if (n = Wl[a]) Vl = n.i, a = n.result; else {
                                    n = Vl;
                                    var i = T();
                                    i !== et && (Ql = n, i = ["mapKeyExpr", i]), n = i, Wl[a] = {i: Vl, result: n}, a = n
                                }
                                if (a !== et) if (He(), 58 === e.charCodeAt(Vl) ? (n = na, Vl++) : (n = et, 0 === Zl && u(Cu)), n !== et) {
                                    if (He(), i = Wl[n = 233 * Vl + 158]) Vl = i.i, n = i.result; else {
                                        i = Vl;
                                        var o = T();
                                        o !== et && (Ql = i, o = ["mapValueExpr", o]), i = o, Wl[n] = {
                                            i: Vl,
                                            result: i
                                        }, n = i
                                    }
                                    n !== et ? (Ql = t, t = ["mapConstructorEntry", a, n]) : (Vl = t, t = et)
                                } else Vl = t, t = et; else Vl = t, t = et;
                                return Wl[r] = {i: Vl, result: t}, t
                            }

                            function de() {
                                var t, n = 233 * Vl + 163;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                t = Vl;
                                var r = Be();
                                if (r !== et) {
                                    if (63 === e.charCodeAt(Vl)) {
                                        var a = Fr;
                                        Vl++
                                    } else a = et, 0 === Zl && u(iu);
                                    a === et && (a = null), Ql = t, t = a ? ["singleType", ["atomicType"].concat(r), ["optional"]] : ["singleType", ["atomicType"].concat(r)]
                                } else Vl = t, t = et;
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function me() {
                                var t, n = 233 * Vl + 164;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                if (t = Vl, e.substr(Vl, 2) === an) {
                                    var r = an;
                                    Vl += 2
                                } else r = et, 0 === Zl && u(Co);
                                return r !== et ? (r = je()) !== et ? (r = ve()) !== et ? (Ql = t, t = ["typeDeclaration"].concat(r)) : (Vl = t, t = et) : (Vl = t, t = et) : (Vl = t, t = et), Wl[n] = {
                                    i: Vl,
                                    result: t
                                }, t
                            }

                            function ve() {
                                var t, n = 233 * Vl + 165;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                if (t = Vl, e.substr(Vl, 16) === aa) {
                                    var r = aa;
                                    Vl += 16
                                } else r = et, 0 === Zl && u(Iu);
                                if (r !== et && (Ql = t, r = [["voidSequenceType"]]), (t = r) === et) if (t = Vl, (r = ge()) !== et) {
                                    var a, i = Vl;
                                    He();
                                    var o = 233 * Vl + 166;
                                    (a = Wl[o]) ? (Vl = a.i, o = a.result) : (63 === e.charCodeAt(Vl) ? (a = Fr, Vl++) : (a = et, 0 === Zl && u(iu)), a === et && (42 === e.charCodeAt(Vl) ? (a = Un, Vl++) : (a = et, 0 === Zl && u(ns)), a === et && (43 === e.charCodeAt(Vl) ? (a = Mn, Vl++) : (a = et, 0 === Zl && u(ts)))), Wl[o] = {
                                        i: Vl,
                                        result: a
                                    }, o = a), o !== et ? (Ql = i, i = o) : (Vl = i, i = et), i === et && (i = null), Ql = t, t = [r].concat(i ? [["occurrenceIndicator", i]] : [])
                                } else Vl = t, t = et;
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function ge() {
                                var t, n = 233 * Vl + 167;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                if ((t = we()) === et) {
                                    if (t = Vl, e.substr(Vl, 6) === ia) {
                                        var r = ia;
                                        Vl += 6
                                    } else r = et, 0 === Zl && u(Ou);
                                    if (r !== et && (Ql = t, r = ["anyItemType"]), (t = r) === et) {
                                        var a;
                                        if (r = Wl[t = 233 * Vl + 182]) Vl = r.i, t = r.result; else {
                                            r = Vl;
                                            var i, o = [];
                                            for (a = w(); a !== et;) o.push(a), a = w();
                                            if (i = Wl[a = 233 * Vl + 183]) Vl = i.i, a = i.result; else {
                                                if (i = Vl, e.substr(Vl, 8) === Qt) {
                                                    var s = Qt;
                                                    Vl += 8
                                                } else s = et, 0 === Zl && u(mo);
                                                s !== et ? (He(), 40 === e.charCodeAt(Vl) ? (s = zt, Vl++) : (s = et, 0 === Zl && u(yo)), s !== et ? (He(), 42 === e.charCodeAt(Vl) ? (s = Un, Vl++) : (s = et, 0 === Zl && u(ns)), s !== et ? (He(), 41 === e.charCodeAt(Vl) ? (s = Zt, Vl++) : (s = et, 0 === Zl && u(wo)), s !== et ? (Ql = i, i = ["anyFunctionTest"]) : (Vl = i, i = et)) : (Vl = i, i = et)) : (Vl = i, i = et)) : (Vl = i, i = et), Wl[a] = {
                                                    i: Vl,
                                                    result: i
                                                }, a = i
                                            }
                                            if (a === et) if (i = Wl[a = 233 * Vl + 184]) Vl = i.i, a = i.result; else {
                                                if (i = Vl, e.substr(Vl, 8) === Qt ? (s = Qt, Vl += 8) : (s = et, 0 === Zl && u(mo)), s !== et) if (He(), 40 === e.charCodeAt(Vl) ? (s = zt, Vl++) : (s = et, 0 === Zl && u(yo)), s !== et) {
                                                    He(), s = Vl;
                                                    var l = ve();
                                                    if (l !== et) {
                                                        var c = [], h = Vl;
                                                        if (44 === e.charCodeAt(Vl)) {
                                                            var p = Tt;
                                                            Vl++
                                                        } else p = et, 0 === Zl && u(Ji);
                                                        for (p !== et ? (He(), (p = ve()) !== et ? (Ql = h, h = p) : (Vl = h, h = et)) : (Vl = h, h = et); h !== et;) c.push(h), h = Vl, 44 === e.charCodeAt(Vl) ? (p = Tt, Vl++) : (p = et, 0 === Zl && u(Ji)), p !== et ? (He(), (p = ve()) !== et ? (Ql = h, h = p) : (Vl = h, h = et)) : (Vl = h, h = et);
                                                        Ql = s, s = l.concat.apply(l, c)
                                                    } else Vl = s, s = et;
                                                    s === et && (s = null), He(), 41 === e.charCodeAt(Vl) ? (c = Zt, Vl++) : (c = et, 0 === Zl && u(wo)), c !== et ? (h = je()) !== et ? (e.substr(Vl, 2) === an ? (p = an, Vl += 2) : (p = et, 0 === Zl && u(Co)), p !== et ? (l = je()) !== et ? (p = ve()) !== et ? (Ql = i, i = ["typedFunctionTest", ["paramTypeList", ["sequenceType"].concat(s)], ["sequenceType"].concat(p)]) : (Vl = i, i = et) : (Vl = i, i = et) : (Vl = i, i = et)) : (Vl = i, i = et) : (Vl = i, i = et)
                                                } else Vl = i, i = et; else Vl = i, i = et;
                                                Wl[a] = {i: Vl, result: i}, a = i
                                            }
                                            a !== et ? (Ql = r, r = [a[0]].concat(o, a.slice(1))) : (Vl = r, r = et), Wl[t] = {
                                                i: Vl,
                                                result: r
                                            }, t = r
                                        }
                                        t === et && ((r = Wl[t = 233 * Vl + 185]) ? (Vl = r.i, t = r.result) : ((o = Wl[r = 233 * Vl + 186]) ? (Vl = o.i, r = o.result) : (o = Vl, e.substr(Vl, 3) === ta ? (a = ta, Vl += 3) : (a = et, 0 === Zl && u(Nu)), a !== et ? (He(), 40 === e.charCodeAt(Vl) ? (a = zt, Vl++) : (a = et, 0 === Zl && u(yo)), a !== et ? (He(), 42 === e.charCodeAt(Vl) ? (a = Un, Vl++) : (a = et, 0 === Zl && u(ns)), a !== et ? (He(), 41 === e.charCodeAt(Vl) ? (a = Zt, Vl++) : (a = et, 0 === Zl && u(wo)), a !== et ? (Ql = o, o = ["anyMapTest"]) : (Vl = o, o = et)) : (Vl = o, o = et)) : (Vl = o, o = et)) : (Vl = o, o = et), Wl[r] = {
                                            i: Vl,
                                            result: o
                                        }, r = o), r === et && ((o = Wl[r = 233 * Vl + 187]) ? (Vl = o.i, r = o.result) : (o = Vl, e.substr(Vl, 3) === ta ? (a = ta, Vl += 3) : (a = et, 0 === Zl && u(Nu)), a !== et ? (He(), 40 === e.charCodeAt(Vl) ? (a = zt, Vl++) : (a = et, 0 === Zl && u(yo)), a !== et ? (He(), (a = ye()) !== et ? (He(), 44 === e.charCodeAt(Vl) ? (i = Tt, Vl++) : (i = et, 0 === Zl && u(Ji)), i !== et ? (He(), (i = ve()) !== et ? (He(), 41 === e.charCodeAt(Vl) ? (s = Zt, Vl++) : (s = et, 0 === Zl && u(wo)), s !== et ? (Ql = o, o = ["typedMapTest", a, ["sequenceType"].concat(i)]) : (Vl = o, o = et)) : (Vl = o, o = et)) : (Vl = o, o = et)) : (Vl = o, o = et)) : (Vl = o, o = et)) : (Vl = o, o = et), Wl[r] = {
                                            i: Vl,
                                            result: o
                                        }, r = o)), Wl[t] = {
                                            i: Vl,
                                            result: r
                                        }, t = r), t === et && ((r = Wl[t = 233 * Vl + 188]) ? (Vl = r.i, t = r.result) : ((o = Wl[r = 233 * Vl + 189]) ? (Vl = o.i, r = o.result) : (o = Vl, e.substr(Vl, 5) === ra ? (a = ra, Vl += 5) : (a = et, 0 === Zl && u(Tu)), a !== et ? (He(), 40 === e.charCodeAt(Vl) ? (a = zt, Vl++) : (a = et, 0 === Zl && u(yo)), a !== et ? (He(), 42 === e.charCodeAt(Vl) ? (a = Un, Vl++) : (a = et, 0 === Zl && u(ns)), a !== et ? (He(), 41 === e.charCodeAt(Vl) ? (a = Zt, Vl++) : (a = et, 0 === Zl && u(wo)), a !== et ? (Ql = o, o = ["anyArrayTest"]) : (Vl = o, o = et)) : (Vl = o, o = et)) : (Vl = o, o = et)) : (Vl = o, o = et), Wl[r] = {
                                            i: Vl,
                                            result: o
                                        }, r = o), r === et && ((o = Wl[r = 233 * Vl + 190]) ? (Vl = o.i, r = o.result) : (o = Vl, e.substr(Vl, 5) === ra ? (a = ra, Vl += 5) : (a = et, 0 === Zl && u(Tu)), a !== et ? (He(), 40 === e.charCodeAt(Vl) ? (a = zt, Vl++) : (a = et, 0 === Zl && u(yo)), a !== et ? (He(), (a = ve()) !== et ? (He(), 41 === e.charCodeAt(Vl) ? (i = Zt, Vl++) : (i = et, 0 === Zl && u(wo)), i !== et ? (Ql = o, o = ["typedArrayTest", ["sequenceType"].concat(a)]) : (Vl = o, o = et)) : (Vl = o, o = et)) : (Vl = o, o = et)) : (Vl = o, o = et), Wl[r] = {
                                            i: Vl,
                                            result: o
                                        }, r = o)), Wl[t] = {
                                            i: Vl,
                                            result: r
                                        }, t = r), t === et && ((t = ye()) === et && ((r = Wl[t = 233 * Vl + 191]) ? (Vl = r.i, t = r.result) : (r = Vl, 40 === e.charCodeAt(Vl) ? (o = zt, Vl++) : (o = et, 0 === Zl && u(yo)), o !== et ? (He(), (o = ge()) !== et ? (He(), 41 === e.charCodeAt(Vl) ? (a = Zt, Vl++) : (a = et, 0 === Zl && u(wo)), a !== et ? (Ql = r, r = ["parenthesizedItemType", o]) : (Vl = r, r = et)) : (Vl = r, r = et)) : (Vl = r, r = et), Wl[t] = {
                                            i: Vl,
                                            result: r
                                        }, t = r)))))
                                    }
                                }
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function ye() {
                                var e, t = 233 * Vl + 168;
                                if (e = Wl[t]) return Vl = e.i, e.result;
                                e = Vl;
                                var n = Be();
                                return n !== et && (Ql = e, n = ["atomicType"].concat(n)), e = n, Wl[t] = {
                                    i: Vl,
                                    result: e
                                }, e
                            }

                            function we() {
                                var t, n, r = 233 * Vl + 169;
                                if (t = Wl[r]) return Vl = t.i, t.result;
                                if (n = Wl[t = 233 * Vl + 171]) Vl = n.i, t = n.result; else {
                                    if (n = Vl, e.substr(Vl, 14) === sa) {
                                        var a = sa;
                                        Vl += 14
                                    } else a = et, 0 === Zl && u(Ru);
                                    if (a !== et) {
                                        if (He(), (a = xe()) === et && (a = Ee()), a === et && (a = null), He(), 41 === e.charCodeAt(Vl)) {
                                            var i = Zt;
                                            Vl++
                                        } else i = et, 0 === Zl && u(wo);
                                        i !== et ? (Ql = n, n = ["documentTest"].concat(a ? [a] : [])) : (Vl = n, n = et)
                                    } else Vl = n, n = et;
                                    Wl[t] = {i: Vl, result: n}, t = n
                                }
                                if (t === et && (t = xe()) === et) {
                                    if (n = Wl[t = 233 * Vl + 176]) Vl = n.i, t = n.result; else {
                                        if (n = Vl, e.substr(Vl, 10) === fa ? (a = fa, Vl += 10) : (a = et, 0 === Zl && u(Pu)), a !== et) if (He(), (a = Ae()) !== et) if (He(), 44 === e.charCodeAt(Vl) ? (i = Tt, Vl++) : (i = et, 0 === Zl && u(Ji)), i !== et) if (He(), (i = Be()) !== et) {
                                            if (He(), 41 === e.charCodeAt(Vl)) {
                                                var o = Zt;
                                                Vl++
                                            } else o = et, 0 === Zl && u(wo);
                                            o !== et ? (Ql = n, n = ["attributeTest", ["attributeName", a], ["typeName"].concat(i)]) : (Vl = n, n = et)
                                        } else Vl = n, n = et; else Vl = n, n = et; else Vl = n, n = et; else Vl = n, n = et;
                                        n === et && (n = Vl, e.substr(Vl, 10) === fa ? (a = fa, Vl += 10) : (a = et, 0 === Zl && u(Pu)), a !== et ? (He(), (a = Ae()) !== et ? (He(), 41 === e.charCodeAt(Vl) ? (i = Zt, Vl++) : (i = et, 0 === Zl && u(wo)), i !== et ? (Ql = n, n = ["attributeTest", ["attributeName", a]]) : (Vl = n, n = et)) : (Vl = n, n = et)) : (Vl = n, n = et), n === et && (n = Vl, e.substr(Vl, 11) === da ? (a = da, Vl += 11) : (a = et, 0 === Zl && u(Hu)), a !== et && (Ql = n, a = ["attributeTest"]), n = a)), Wl[t] = {
                                            i: Vl,
                                            result: n
                                        }, t = n
                                    }
                                    t === et && ((t = Ee()) === et && ((n = Wl[t = 233 * Vl + 178]) ? (Vl = n.i, t = n.result) : (n = Vl, e.substr(Vl, 17) === ma ? (a = ma, Vl += 17) : (a = et, 0 === Zl && u(ju)), a !== et ? (He(), (a = Be()) !== et ? (He(), 41 === e.charCodeAt(Vl) ? (i = Zt, Vl++) : (i = et, 0 === Zl && u(wo)), i !== et ? (Ql = n, n = ["schemaAttributeTest"].concat(a)) : (Vl = n, n = et)) : (Vl = n, n = et)) : (Vl = n, n = et), Wl[t] = {
                                        i: Vl,
                                        result: n
                                    }, t = n), t === et && ((n = Wl[t = 233 * Vl + 175]) ? (Vl = n.i, t = n.result) : (n = Vl, e.substr(Vl, 23) === ha ? (a = ha, Vl += 23) : (a = et, 0 === Zl && u(Uu)), a !== et ? (He(), (a = Ge()) !== et ? (He(), 41 === e.charCodeAt(Vl) ? (i = Zt, Vl++) : (i = et, 0 === Zl && u(wo)), i !== et ? (Ql = n, n = ["piTest", ["piTarget", a]]) : (Vl = n, n = et)) : (Vl = n, n = et)) : (Vl = n, n = et), n === et && (n = Vl, e.substr(Vl, 23) === ha ? (a = ha, Vl += 23) : (a = et, 0 === Zl && u(Uu)), a !== et ? (He(), (a = Ce()) !== et ? (He(), 41 === e.charCodeAt(Vl) ? (i = Zt, Vl++) : (i = et, 0 === Zl && u(wo)), i !== et ? (Ql = n, n = ["piTest", ["piTarget", a]]) : (Vl = n, n = et)) : (Vl = n, n = et)) : (Vl = n, n = et), n === et && (n = Vl, e.substr(Vl, 24) === pa ? (a = pa, Vl += 24) : (a = et, 0 === Zl && u(Fu)), a !== et && (Ql = n, a = ["piTest"]), n = a)), Wl[t] = {
                                        i: Vl,
                                        result: n
                                    }, t = n), t === et && ((n = Wl[t = 233 * Vl + 173]) ? (Vl = n.i, t = n.result) : (n = Vl, e.substr(Vl, 9) === la ? (a = la, Vl += 9) : (a = et, 0 === Zl && u(Gu)), a !== et && (Ql = n, a = ["commentTest"]), n = a, Wl[t] = {
                                        i: Vl,
                                        result: n
                                    }, t = n), t === et && ((n = Wl[t = 233 * Vl + 172]) ? (Vl = n.i, t = n.result) : (n = Vl, e.substr(Vl, 6) === ua ? (a = ua, Vl += 6) : (a = et, 0 === Zl && u(Du)), a !== et && (Ql = n, a = ["textTest"]), n = a, Wl[t] = {
                                        i: Vl,
                                        result: n
                                    }, t = n), t === et && ((n = Wl[t = 233 * Vl + 174]) ? (Vl = n.i, t = n.result) : (n = Vl, e.substr(Vl, 16) === ca ? (a = ca, Vl += 16) : (a = et, 0 === Zl && u(Mu)), a !== et && (Ql = n, a = ["namespaceTest"]), n = a, Wl[t] = {
                                        i: Vl,
                                        result: n
                                    }, t = n), t === et && ((n = Wl[t = 233 * Vl + 170]) ? (Vl = n.i, t = n.result) : (n = Vl, e.substr(Vl, 6) === oa ? (a = oa, Vl += 6) : (a = et, 0 === Zl && u(Su)), a !== et && (Ql = n, a = ["anyKindTest"]), n = a, Wl[t] = {
                                        i: Vl,
                                        result: n
                                    }, t = n))))))))
                                }
                                return Wl[r] = {i: Vl, result: t}, t
                            }

                            function Ae() {
                                var t, n = 233 * Vl + 177;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                t = Vl;
                                var r = Be();
                                return r !== et && (Ql = t, r = ["QName"].concat(r)), (t = r) === et && (t = Vl, 42 === e.charCodeAt(Vl) ? (r = Un, Vl++) : (r = et, 0 === Zl && u(ns)), r !== et && (Ql = t, r = ["star"]), t = r), Wl[n] = {
                                    i: Vl,
                                    result: t
                                }, t
                            }

                            function xe() {
                                var t, n = 233 * Vl + 179;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                if (t = Vl, e.substr(Vl, 7) === Vt) {
                                    var r = Vt;
                                    Vl += 7
                                } else r = et, 0 === Zl && u(fo);
                                if (r !== et) if (He(), 40 === e.charCodeAt(Vl) ? (r = zt, Vl++) : (r = et, 0 === Zl && u(yo)), r !== et) if (He(), (r = be()) !== et) {
                                    if (He(), 44 === e.charCodeAt(Vl)) {
                                        var a = Tt;
                                        Vl++
                                    } else a = et, 0 === Zl && u(Ji);
                                    if (a !== et) if (He(), (a = Be()) !== et) {
                                        if (He(), 41 === e.charCodeAt(Vl)) {
                                            var i = Zt;
                                            Vl++
                                        } else i = et, 0 === Zl && u(wo);
                                        i !== et ? (Ql = t, t = ["elementTest", ["elementName", r], ["typeName"].concat(a)]) : (Vl = t, t = et)
                                    } else Vl = t, t = et; else Vl = t, t = et
                                } else Vl = t, t = et; else Vl = t, t = et; else Vl = t, t = et;
                                return t === et && (t = Vl, e.substr(Vl, 7) === Vt ? (r = Vt, Vl += 7) : (r = et, 0 === Zl && u(fo)), r !== et ? (He(), 40 === e.charCodeAt(Vl) ? (r = zt, Vl++) : (r = et, 0 === Zl && u(yo)), r !== et ? (He(), (r = be()) !== et ? (He(), 41 === e.charCodeAt(Vl) ? (a = Zt, Vl++) : (a = et, 0 === Zl && u(wo)), a !== et ? (Ql = t, t = ["elementTest", ["elementName", r]]) : (Vl = t, t = et)) : (Vl = t, t = et)) : (Vl = t, t = et)) : (Vl = t, t = et), t === et && (t = Vl, e.substr(Vl, 7) === Vt ? (r = Vt, Vl += 7) : (r = et, 0 === Zl && u(fo)), r !== et ? (He(), 40 === e.charCodeAt(Vl) ? (r = zt, Vl++) : (r = et, 0 === Zl && u(yo)), r !== et ? (He(), 41 === e.charCodeAt(Vl) ? (r = Zt, Vl++) : (r = et, 0 === Zl && u(wo)), r !== et ? (Ql = t, t = ["elementTest"]) : (Vl = t, t = et)) : (Vl = t, t = et)) : (Vl = t, t = et))), Wl[n] = {
                                    i: Vl,
                                    result: t
                                }, t
                            }

                            function be() {
                                var t, n = 233 * Vl + 180;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                t = Vl;
                                var r = Be();
                                return r !== et && (Ql = t, r = ["QName"].concat(r)), (t = r) === et && (t = Vl, 42 === e.charCodeAt(Vl) ? (r = Un, Vl++) : (r = et, 0 === Zl && u(ns)), r !== et && (Ql = t, r = ["star"]), t = r), Wl[n] = {
                                    i: Vl,
                                    result: t
                                }, t
                            }

                            function Ee() {
                                var t, n = 233 * Vl + 181;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                if (t = Vl, e.substr(Vl, 14) === va) {
                                    var r = va;
                                    Vl += 14
                                } else r = et, 0 === Zl && u(Xu);
                                if (r !== et) if (He(), 40 === e.charCodeAt(Vl) ? (r = zt, Vl++) : (r = et, 0 === Zl && u(yo)), r !== et) if ((r = Be()) !== et) {
                                    if (41 === e.charCodeAt(Vl)) {
                                        var a = Zt;
                                        Vl++
                                    } else a = et, 0 === Zl && u(wo);
                                    a !== et ? (Ql = t, t = ["schemaElementTest"].concat(r)) : (Vl = t, t = et)
                                } else Vl = t, t = et; else Vl = t, t = et; else Vl = t, t = et;
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function Be() {
                                var e, t, n = 233 * Vl + 192;
                                if (e = Wl[n]) return Vl = e.i, e.result;
                                e = Vl;
                                var r = 233 * Vl + 197;
                                if (t = Wl[r]) Vl = t.i, r = t.result; else {
                                    t = Vl;
                                    var a = Te();
                                    if (a !== et) {
                                        var i = Ge();
                                        i !== et ? (Ql = t, t = [a, i]) : (Vl = t, t = et)
                                    } else Vl = t, t = et;
                                    Wl[r] = {i: Vl, result: t}, r = t
                                }
                                return r !== et && (Ql = e, e = r, r = [((r = {}).prefix = null, r.URI = e[0], r), e[1]]), (e = r) === et && (e = De()), Wl[n] = {
                                    i: Vl,
                                    result: e
                                }, e
                            }

                            function Ne() {
                                var e, t = 233 * Vl + 193;
                                if (e = Wl[t]) return Vl = e.i, e.result;
                                e = Vl;
                                var n = Ue();
                                return n !== et && (Ql = e, n = ["integerConstantExpr", ["value", n]]), e = n, Wl[t] = {
                                    i: Vl,
                                    result: e
                                }, e
                            }

                            function Ce() {
                                var t, r, a = 233 * Vl + 196;
                                if (t = Wl[a]) return Vl = t.i, t.result;
                                if (Ql = t = Vl, (r = (r = n.Ra) ? void 0 : et) !== et) if (34 === e.charCodeAt(Vl) ? (r = Xr, Vl++) : (r = et, 0 === Zl && u(cu)), r !== et) {
                                    r = [];
                                    var i = Ie();
                                    for (i === et && ((i = Re()) === et && ((i = Oe()) === et && (ci.test(e.charAt(Vl)) ? (i = e.charAt(Vl), Vl++) : (i = et, 0 === Zl && u(Yu))))); i !== et;) r.push(i), (i = Ie()) === et && ((i = Re()) === et && ((i = Oe()) === et && (ci.test(e.charAt(Vl)) ? (i = e.charAt(Vl), Vl++) : (i = et, 0 === Zl && u(Yu)))));
                                    34 === e.charCodeAt(Vl) ? (i = Xr, Vl++) : (i = et, 0 === Zl && u(cu)), i !== et ? (Ql = t, t = r.join("")) : (Vl = t, t = et)
                                } else Vl = t, t = et; else Vl = t, t = et;
                                if (t === et) {
                                    if (Ql = t = Vl, (r = (r = n.Ra) ? void 0 : et) !== et) if (39 === e.charCodeAt(Vl) ? (r = _r, Vl++) : (r = et, 0 === Zl && u(hu)), r !== et) {
                                        for (r = [], (i = Ie()) === et && ((i = Re()) === et && ((i = Se()) === et && (hi.test(e.charAt(Vl)) ? (i = e.charAt(Vl), Vl++) : (i = et, 0 === Zl && u(qu))))); i !== et;) r.push(i), (i = Ie()) === et && ((i = Re()) === et && ((i = Se()) === et && (hi.test(e.charAt(Vl)) ? (i = e.charAt(Vl), Vl++) : (i = et, 0 === Zl && u(qu)))));
                                        39 === e.charCodeAt(Vl) ? (i = _r, Vl++) : (i = et, 0 === Zl && u(hu)), i !== et ? (Ql = t, t = r.join("")) : (Vl = t, t = et)
                                    } else Vl = t, t = et; else Vl = t, t = et;
                                    if (t === et) {
                                        if (Ql = t = Vl, (r = (r = !n.Ra) ? void 0 : et) !== et) if (34 === e.charCodeAt(Vl) ? (r = Xr, Vl++) : (r = et, 0 === Zl && u(cu)), r !== et) {
                                            for (r = [], (i = Oe()) === et && (pi.test(e.charAt(Vl)) ? (i = e.charAt(Vl), Vl++) : (i = et, 0 === Zl && u(Vu))); i !== et;) r.push(i), (i = Oe()) === et && (pi.test(e.charAt(Vl)) ? (i = e.charAt(Vl), Vl++) : (i = et, 0 === Zl && u(Vu)));
                                            34 === e.charCodeAt(Vl) ? (i = Xr, Vl++) : (i = et, 0 === Zl && u(cu)), i !== et ? (Ql = t, t = r.join("")) : (Vl = t, t = et)
                                        } else Vl = t, t = et; else Vl = t, t = et;
                                        if (t === et) if (Ql = t = Vl, (r = (r = !n.Ra) ? void 0 : et) !== et) if (39 === e.charCodeAt(Vl) ? (r = _r, Vl++) : (r = et, 0 === Zl && u(hu)), r !== et) {
                                            for (r = [], (i = Se()) === et && (fi.test(e.charAt(Vl)) ? (i = e.charAt(Vl), Vl++) : (i = et, 0 === Zl && u(Qu))); i !== et;) r.push(i), (i = Se()) === et && (fi.test(e.charAt(Vl)) ? (i = e.charAt(Vl), Vl++) : (i = et, 0 === Zl && u(Qu)));
                                            39 === e.charCodeAt(Vl) ? (i = _r, Vl++) : (i = et, 0 === Zl && u(hu)), i !== et ? (Ql = t, t = r.join("")) : (Vl = t, t = et)
                                        } else Vl = t, t = et; else Vl = t, t = et
                                    }
                                }
                                return Wl[a] = {i: Vl, result: t}, t
                            }

                            function Te() {
                                var t, n = 233 * Vl + 198;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                if (t = Vl, 81 === e.charCodeAt(Vl)) {
                                    var r = ga;
                                    Vl++
                                } else r = et, 0 === Zl && u(Ju);
                                if (r !== et) if (He(), 123 === e.charCodeAt(Vl) ? (r = on, Vl++) : (r = et, 0 === Zl && u(To)), r !== et) {
                                    if (r = [], di.test(e.charAt(Vl))) {
                                        var a = e.charAt(Vl);
                                        Vl++
                                    } else a = et, 0 === Zl && u(Ku);
                                    for (; a !== et;) r.push(a), di.test(e.charAt(Vl)) ? (a = e.charAt(Vl), Vl++) : (a = et, 0 === Zl && u(Ku));
                                    125 === e.charCodeAt(Vl) ? (a = sn, Vl++) : (a = et, 0 === Zl && u(Io)), a !== et ? (Ql = t, t = r.join("").replace(/\s+/g, " ").trim()) : (Vl = t, t = et)
                                } else Vl = t, t = et; else Vl = t, t = et;
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function Ie() {
                                var t, n = 233 * Vl + 199;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                var r = t = Vl;
                                if (38 === e.charCodeAt(Vl)) {
                                    var a = ya;
                                    Vl++
                                } else a = et, 0 === Zl && u(zu);
                                if (a !== et) {
                                    if (e.substr(Vl, 2) === tr) {
                                        var i = tr;
                                        Vl += 2
                                    } else i = et, 0 === Zl && u(bs);
                                    if (i === et && (e.substr(Vl, 2) === rr ? (i = rr, Vl += 2) : (i = et, 0 === Zl && u(Bs)), i === et && (e.substr(Vl, 3) === wa ? (i = wa, Vl += 3) : (i = et, 0 === Zl && u(Zu)), i === et && (e.substr(Vl, 4) === Aa ? (i = Aa, Vl += 4) : (i = et, 0 === Zl && u(Wu)), i === et && (e.substr(Vl, 4) === xa ? (i = xa, Vl += 4) : (i = et, 0 === Zl && u($u)))))), i !== et) {
                                        if (59 === e.charCodeAt(Vl)) {
                                            var o = ct;
                                            Vl++
                                        } else o = et, 0 === Zl && u(Ri);
                                        o !== et ? r = a = [a, i, o] : (Vl = r, r = et)
                                    } else Vl = r, r = et
                                } else Vl = r, r = et;
                                return t = r !== et ? e.substring(t, Vl) : r, Wl[n] = {i: Vl, result: t}, t
                            }

                            function Oe() {
                                var t, n = 233 * Vl + 200;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                if (t = Vl, e.substr(Vl, 2) === ba) {
                                    var r = ba;
                                    Vl += 2
                                } else r = et, 0 === Zl && u(el);
                                return r !== et && (Ql = t, r = '"'), t = r, Wl[n] = {i: Vl, result: t}, t
                            }

                            function Se() {
                                var t, n = 233 * Vl + 201;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                if (t = Vl, e.substr(Vl, 2) === Ea) {
                                    var r = Ea;
                                    Vl += 2
                                } else r = et, 0 === Zl && u(tl);
                                return r !== et && (Ql = t, r = "'"), t = r, Wl[n] = {i: Vl, result: t}, t
                            }

                            function Re() {
                                var t, n = 233 * Vl + 207;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                var r = t = Vl;
                                if (e.substr(Vl, 3) === Da) {
                                    var a = Da;
                                    Vl += 3
                                } else a = et, 0 === Zl && u(fl);
                                if (a !== et) {
                                    var i = [];
                                    if (yi.test(e.charAt(Vl))) {
                                        var o = e.charAt(Vl);
                                        Vl++
                                    } else o = et, 0 === Zl && u(dl);
                                    if (o !== et) for (; o !== et;) i.push(o), yi.test(e.charAt(Vl)) ? (o = e.charAt(Vl), Vl++) : (o = et, 0 === Zl && u(dl)); else i = et;
                                    i !== et ? (59 === e.charCodeAt(Vl) ? (o = ct, Vl++) : (o = et, 0 === Zl && u(Ri)), o !== et ? r = a = [a, i, o] : (Vl = r, r = et)) : (Vl = r, r = et)
                                } else Vl = r, r = et;
                                if ((t = r !== et ? e.substring(t, Vl) : r) === et) {
                                    if (r = t = Vl, e.substr(Vl, 2) === Ga ? (a = Ga, Vl += 2) : (a = et, 0 === Zl && u(ml)), a !== et) {
                                        if (i = [], si.test(e.charAt(Vl)) ? (o = e.charAt(Vl), Vl++) : (o = et, 0 === Zl && u(_u)), o !== et) for (; o !== et;) i.push(o), si.test(e.charAt(Vl)) ? (o = e.charAt(Vl), Vl++) : (o = et, 0 === Zl && u(_u)); else i = et;
                                        i !== et ? (59 === e.charCodeAt(Vl) ? (o = ct, Vl++) : (o = et, 0 === Zl && u(Ri)), o !== et ? r = a = [a, i, o] : (Vl = r, r = et)) : (Vl = r, r = et)
                                    } else Vl = r, r = et;
                                    t = r !== et ? e.substring(t, Vl) : r
                                }
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function De() {
                                var t, n, r = 233 * Vl + 208;
                                if (t = Wl[r]) return Vl = t.i, t.result;
                                if (n = Wl[t = 233 * Vl + 224]) Vl = n.i, t = n.result; else {
                                    var a = Vl;
                                    if ((n = Ge()) !== et) {
                                        if (58 === e.charCodeAt(Vl)) {
                                            var i = na;
                                            Vl++
                                        } else i = et, 0 === Zl && u(Cu);
                                        i !== et ? (i = Ge()) !== et ? (Ql = a, a = [((a = {}).prefix = n, a), i]) : (Vl = a, a = et) : (Vl = a, a = et)
                                    } else Vl = a, a = et;
                                    Wl[t] = {i: Vl, result: a}, t = a
                                }
                                return t === et && ((n = Wl[t = 233 * Vl + 225]) ? (Vl = n.i, t = n.result) : (n = Vl, (a = Ge()) !== et && (Ql = n, a = [a]), n = a, Wl[t] = {
                                    i: Vl,
                                    result: n
                                }, t = n)), Wl[r] = {i: Vl, result: t}, t
                            }

                            function Ge() {
                                var e, t, n = 233 * Vl + 209;
                                if (e = Wl[n]) return Vl = e.i, e.result;
                                e = Vl;
                                var r = Le();
                                if (r !== et) {
                                    var a = [];
                                    for (t = ke(); t !== et;) a.push(t), t = ke();
                                    Ql = e, e = r + a.join("")
                                } else Vl = e, e = et;
                                return Wl[n] = {i: Vl, result: e}, e
                            }

                            function Me() {
                                var t, n = 233 * Vl + 210;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                if (wi.test(e.charAt(Vl)) ? (t = e.charAt(Vl), Vl++) : (t = et, 0 === Zl && u(vl)), t === et) {
                                    if (t = Vl, Ai.test(e.charAt(Vl))) {
                                        var r = e.charAt(Vl);
                                        Vl++
                                    } else r = et, 0 === Zl && u(gl);
                                    if (r !== et) {
                                        if (xi.test(e.charAt(Vl))) {
                                            var a = e.charAt(Vl);
                                            Vl++
                                        } else a = et, 0 === Zl && u(yl);
                                        a !== et ? t = r = [r, a] : (Vl = t, t = et)
                                    } else Vl = t, t = et
                                }
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function Ue() {
                                var t, n = 233 * Vl + 211;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                t = Vl;
                                var r = [];
                                if (si.test(e.charAt(Vl))) {
                                    var a = e.charAt(Vl);
                                    Vl++
                                } else a = et, 0 === Zl && u(_u);
                                if (a !== et) for (; a !== et;) r.push(a), si.test(e.charAt(Vl)) ? (a = e.charAt(Vl), Vl++) : (a = et, 0 === Zl && u(_u)); else r = et;
                                return r !== et && (Ql = t, r = r.join("")), t = r, Wl[n] = {i: Vl, result: t}, t
                            }

                            function Fe() {
                                var t, n = 233 * Vl + 212;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                var r = t = Vl;
                                if (Zl++, e.substr(Vl, 2) === Ba) {
                                    var a = Ba;
                                    Vl += 2
                                } else a = et, 0 === Zl && u(il);
                                if (Zl--, a === et ? r = void 0 : (Vl = r, r = et), r !== et) {
                                    if (a = Vl, Zl++, e.substr(Vl, 2) === Na) {
                                        var i = Na;
                                        Vl += 2
                                    } else i = et, 0 === Zl && u(ol);
                                    Zl--, i === et ? a = void 0 : (Vl = a, a = et), a !== et ? (i = Me()) !== et ? t = r = [r, a, i] : (Vl = t, t = et) : (Vl = t, t = et)
                                } else Vl = t, t = et;
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function Pe() {
                                var t, n = 233 * Vl + 219;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                t = Vl;
                                var r = ae();
                                if (r !== et) {
                                    if (He(), e.substr(Vl, 2) === en) {
                                        var a = en;
                                        Vl += 2
                                    } else a = et, 0 === Zl && u(bo);
                                    a !== et ? (He(), (a = T()) !== et ? (Ql = t, t = ["transformCopy", r, ["copySource", a]]) : (Vl = t, t = et)) : (Vl = t, t = et)
                                } else Vl = t, t = et;
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function He() {
                                var e, t, n = 233 * Vl + 220;
                                if (e = Wl[n]) return Vl = e.i, e.result;
                                for (e = [], t = _e(); t !== et;) e.push(t), t = _e();
                                return Wl[n] = {i: Vl, result: e}, e
                            }

                            function je() {
                                var e, t = 233 * Vl + 221;
                                if (e = Wl[t]) return Vl = e.i, e.result;
                                e = [];
                                var n = _e();
                                if (n !== et) for (; n !== et;) e.push(n), n = _e(); else e = et;
                                return Wl[t] = {i: Vl, result: e}, e
                            }

                            function Xe() {
                                var t, n = 233 * Vl + 222;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                if (t = [], 32 === e.charCodeAt(Vl)) {
                                    var r = Ka;
                                    Vl++
                                } else r = et, 0 === Zl && u(Ml);
                                if (r === et && (9 === e.charCodeAt(Vl) ? (r = za, Vl++) : (r = et, 0 === Zl && u(Ul)), r === et && (13 === e.charCodeAt(Vl) ? (r = Za, Vl++) : (r = et, 0 === Zl && u(Fl)), r === et && (10 === e.charCodeAt(Vl) ? (r = Wa, Vl++) : (r = et, 0 === Zl && u(Pl))))), r !== et) for (; r !== et;) t.push(r), 32 === e.charCodeAt(Vl) ? (r = Ka, Vl++) : (r = et, 0 === Zl && u(Ml)), r === et && (9 === e.charCodeAt(Vl) ? (r = za, Vl++) : (r = et, 0 === Zl && u(Ul)), r === et && (13 === e.charCodeAt(Vl) ? (r = Za, Vl++) : (r = et, 0 === Zl && u(Fl)), r === et && (10 === e.charCodeAt(Vl) ? (r = Wa, Vl++) : (r = et, 0 === Zl && u(Pl))))); else t = et;
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function _e() {
                                var t, n = 233 * Vl + 223;
                                return (t = Wl[n]) ? (Vl = t.i, t.result) : (32 === e.charCodeAt(Vl) ? (t = Ka, Vl++) : (t = et, 0 === Zl && u(Ml)), t === et && (9 === e.charCodeAt(Vl) ? (t = za, Vl++) : (t = et, 0 === Zl && u(Ul)), t === et && (13 === e.charCodeAt(Vl) ? (t = Za, Vl++) : (t = et, 0 === Zl && u(Fl)), t === et && (10 === e.charCodeAt(Vl) ? (t = Wa, Vl++) : (t = et, 0 === Zl && u(Pl)), t === et && (t = function t() {
                                    var n, r = 233 * Vl + 205;
                                    if (n = Wl[r]) return Vl = n.i, n.result;
                                    if (n = Vl, e.substr(Vl, 2) === Ba) {
                                        var a = Ba;
                                        Vl += 2
                                    } else a = et, 0 === Zl && u(il);
                                    if (a !== et) {
                                        var i = [], o = Fe();
                                        for (o === et && (o = t()); o !== et;) i.push(o), (o = Fe()) === et && (o = t());
                                        e.substr(Vl, 2) === Na ? (o = Na, Vl += 2) : (o = et, 0 === Zl && u(ol)), o !== et ? n = a = [a, i, o] : (Vl = n, n = et)
                                    } else Vl = n, n = et;
                                    return Wl[r] = {i: Vl, result: n}, n
                                }())))), Wl[n] = {i: Vl, result: t}, t)
                            }

                            function Le() {
                                var t, n = 233 * Vl + 226;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                if (bi.test(e.charAt(Vl)) ? (t = e.charAt(Vl), Vl++) : (t = et, 0 === Zl && u(Hl)), t === et) {
                                    if (t = Vl, Ei.test(e.charAt(Vl))) {
                                        var r = e.charAt(Vl);
                                        Vl++
                                    } else r = et, 0 === Zl && u(jl);
                                    if (r !== et) {
                                        if (xi.test(e.charAt(Vl))) {
                                            var a = e.charAt(Vl);
                                            Vl++
                                        } else a = et, 0 === Zl && u(yl);
                                        a !== et ? t = r = [r, a] : (Vl = t, t = et)
                                    } else Vl = t, t = et
                                }
                                return Wl[n] = {i: Vl, result: t}, t
                            }

                            function ke() {
                                var t, n = 233 * Vl + 227;
                                return (t = Wl[n]) ? (Vl = t.i, t.result) : ((t = Le()) === et && (Bi.test(e.charAt(Vl)) ? (t = e.charAt(Vl), Vl++) : (t = et, 0 === Zl && u(Xl))), Wl[n] = {
                                    i: Vl,
                                    result: t
                                }, t)
                            }

                            function Ye() {
                                var t, n = 233 * Vl + 228;
                                return (t = Wl[n]) ? (Vl = t.i, t.result) : ((t = ke()) === et && (58 === e.charCodeAt(Vl) ? (t = na, Vl++) : (t = et, 0 === Zl && u(Cu))), Wl[n] = {
                                    i: Vl,
                                    result: t
                                }, t)
                            }

                            function qe() {
                                var t, n = 233 * Vl + 231;
                                return (t = Wl[n]) ? (Vl = t.i, t.result) : (e.substr(Vl, 5) === ra ? (t = ra, Vl += 5) : (t = et, 0 === Zl && u(Tu)), t === et && (e.substr(Vl, 9) === Ar ? (t = Ar, Vl += 9) : (t = et, 0 === Zl && u(ks)), t === et && (e.substr(Vl, 7) === Wr ? (t = Wr, Vl += 7) : (t = et, 0 === Zl && u(bu)), t === et && (e.substr(Vl, 13) === $a ? (t = $a, Vl += 13) : (t = et, 0 === Zl && u(_l)), t === et && (e.substr(Vl, 7) === Vt ? (t = Vt, Vl += 7) : (t = et, 0 === Zl && u(fo)), t === et && (e.substr(Vl, 14) === ei ? (t = ei, Vl += 14) : (t = et, 0 === Zl && u(Ll)), t === et && (e.substr(Vl, 8) === Qt ? (t = Qt, Vl += 8) : (t = et, 0 === Zl && u(mo)), t === et && (e.substr(Vl, 2) === Cn ? (t = Cn, Vl += 2) : (t = et, 0 === Zl && u(Qo)), t === et && (e.substr(Vl, 4) === rn ? (t = rn, Vl += 4) : (t = et, 0 === Zl && u(No)), t === et && (e.substr(Vl, 3) === ta ? (t = ta, Vl += 3) : (t = et, 0 === Zl && u(Nu)), t === et && (e.substr(Vl, 14) === ti ? (t = ti, Vl += 14) : (t = et, 0 === Zl && u(kl)), t === et && (e.substr(Vl, 4) === _a ? (t = _a, Vl += 4) : (t = et, 0 === Zl && u(Cl)), t === et && (e.substr(Vl, 22) === $r ? (t = $r, Vl += 22) : (t = et, 0 === Zl && u(Eu)), t === et && (e.substr(Vl, 16) === ni ? (t = ni, Vl += 16) : (t = et, 0 === Zl && u(Yl)), t === et && (e.substr(Vl, 14) === va ? (t = va, Vl += 14) : (t = et, 0 === Zl && u(Xu)), t === et && (e.substr(Vl, 6) === ri ? (t = ri, Vl += 6) : (t = et, 0 === Zl && u(ql)), t === et && (e.substr(Vl, 4) === Zr ? (t = Zr, Vl += 4) : (t = et, 0 === Zl && u(xu)), t === et && (e.substr(Vl, 10) === En ? (t = En, Vl += 10) : (t = et, 0 === Zl && u(Yo))))))))))))))))))), Wl[n] = {
                                    i: Vl,
                                    result: t
                                }, t)
                            }

                            function Ve() {
                                var t, n = 233 * Vl + 232;
                                if (t = Wl[n]) return Vl = t.i, t.result;
                                if (t = Vl, Zl++, 40 === e.charCodeAt(Vl)) {
                                    var r = zt;
                                    Vl++
                                } else r = et, 0 === Zl && u(yo);
                                return r === et && (34 === e.charCodeAt(Vl) ? (r = Xr, Vl++) : (r = et, 0 === Zl && u(cu)), r === et && (39 === e.charCodeAt(Vl) ? (r = _r, Vl++) : (r = et, 0 === Zl && u(hu)), r === et && (r = _e()))), Zl--, r !== et ? (Vl = t, t = void 0) : t = et, Wl[n] = {
                                    i: Vl,
                                    result: t
                                }, t
                            }

                            function Qe(e, t, n) {
                                return n.reduce((function (t, n) {
                                    return [e, ["firstOperand", t], ["secondOperand", n]]
                                }), t)
                            }

                            function Je(e) {
                                1 <= e && 55295 >= e || 57344 <= e && 65533 >= e || 65536 <= e && 1114111 >= e || We("XQST0090", "The character reference " + e + " (" + e.toString(16) + ") does not reference a valid codePoint.")
                            }

                            function Ke(e) {
                                return n.Ra ? e.replace(/(&[^;]+);/g, (function (e) {
                                    if (/^&#x/.test(e)) return Je(e = parseInt(e.slice(3, -1), 16)), String.fromCodePoint(e);
                                    if (/^&#/.test(e)) return Je(e = parseInt(e.slice(2, -1), 10)), String.fromCodePoint(e);
                                    switch (e) {
                                        case"&lt;":
                                            return "<";
                                        case"&gt;":
                                            return ">";
                                        case"&amp;":
                                            return "&";
                                        case"&quot;":
                                            return String.fromCharCode(34);
                                        case"&apos;":
                                            return String.fromCharCode(39)
                                    }
                                    We("XPST0003", 'Unknown character reference: "' + e + '"')
                                })) : e
                            }

                            function ze(e, t, n) {
                                if (!e.length) return [];
                                for (var r = [e[0]], a = 1; a < e.length; ++a) "string" == typeof r[r.length - 1] && "string" == typeof e[a] ? r[r.length - 1] += e[a] : r.push(e[a]);
                                if ("string" == typeof r[0] && 0 === r.length) return [];
                                if (!(r = r.reduce((function (e, t, a) {
                                    if ("string" != typeof t) e.push(t); else if (n && /^\s*$/.test(t)) {
                                        var i = r[a + 1];
                                        (i && "CDataSection" === i[0] || (a = r[a - 1]) && "CDataSection" === a[0]) && e.push(Ke(t))
                                    } else e.push(Ke(t));
                                    return e
                                }), [])).length) return r;
                                if (1 < r.length || t) for (a = 0; a < r.length; a++) "string" == typeof r[a] && (r[a] = ["stringConstantExpr", ["value", r[a]]]);
                                return r
                            }

                            function Ze(e) {
                                switch (e[0]) {
                                    case"constantExpr":
                                    case"varRef":
                                    case"contextItemExpr":
                                    case"functionCallExpr":
                                    case"sequenceExpr":
                                    case"elementConstructor":
                                    case"computedElementConstructor":
                                    case"computedAttributeConstructor":
                                    case"computedDocumentConstructor":
                                    case"computedTextConstructor":
                                    case"computedCommentConstructor":
                                    case"computedNamespaceConstructor":
                                    case"computedPIConstructor":
                                    case"orderedExpr":
                                    case"unorderedExpr":
                                    case"namedFunctionRef":
                                    case"inlineFunctionExpr":
                                    case"dynamicFunctionInvocationExpr":
                                    case"mapConstructor":
                                    case"arrayConstructor":
                                    case"stringConstructor":
                                    case"unaryLookup":
                                        return e
                                }
                                return ["sequenceExpr", e]
                            }

                            function We(e, t) {
                                throw Error(e + ": " + t)
                            }

                            function $e(e) {
                                return n.qc ? ["x:stackTrace", s(Ql, Vl), e] : e
                            }

                            var et = {}, tt = (n = void 0 !== n ? n : {}).yc, nt = {Module: l}, rt = l, at = "xquery",
                                it = "encoding", ot = "version", st = "module", ut = "namespace", lt = "=", ct = ";",
                                ht = "declare", pt = "boundary-space", ft = "preserve", dt = "strip", mt = "default",
                                vt = "collation", gt = "base-uri", yt = "construction", wt = "ordering", At = "ordered",
                                xt = "unordered", bt = "order", Et = "empty", Bt = "greatest", Nt = "least",
                                Ct = "copy-namespaces", Tt = ",", It = "no-preserve", Ot = "inherit", St = "no-inherit",
                                Rt = "decimal-format", Dt = "decimal-separator", Gt = "grouping-separator", Mt = "infinity",
                                Ut = "minus-sign", Ft = "NaN", Pt = "percent", Ht = "per-mille", jt = "zero-digit",
                                Xt = "digit", _t = "pattern-separator", Lt = "exponent-separator", kt = "import",
                                Yt = "schema", qt = "at", Vt = "element", Qt = "function", Jt = "updating", Kt = "%",
                                zt = "(", Zt = ")", Wt = "variable", $t = "$", en = ":=", tn = "external", nn = "context",
                                rn = "item", an = "as", on = "{", sn = "}", un = "option", ln = "for", cn = "in",
                                hn = "allowing", pn = "let", fn = "where", dn = "group", mn = "by", vn = "stable",
                                gn = "ascending", yn = "descending", wn = "return", An = "some", xn = "every",
                                bn = "satisfies", En = "typeswitch", Bn = "case", Nn = "|", Cn = "if", Tn = "then",
                                In = "else", On = "or", Sn = "and", Rn = "||", Dn = "to", Gn = "-", Mn = "+", Un = "*",
                                Fn = "div", Pn = "idiv", Hn = "mod", jn = "union", Xn = "intersect", _n = "except",
                                Ln = "instance", kn = "of", Yn = "treat", qn = "castable", Vn = "cast", Qn = "=>",
                                Jn = "!=", Kn = "<=", zn = "<", Zn = ">=", Wn = ">", $n = "eq", er = "ne", tr = "lt",
                                nr = "le", rr = "gt", ar = "ge", ir = "is", or = "<<", sr = ">>", ur = "validate",
                                lr = "type", cr = "lax", hr = "strict", pr = "(#", fr = "#)", dr = "!", mr = "/", vr = "//",
                                gr = "child", yr = "::", wr = "descendant", Ar = "attribute", xr = "self",
                                br = "descendant-or-self", Er = "following-sibling", Br = "following", Nr = "@",
                                Cr = "parent", Tr = "ancestor", Ir = "preceding-sibling", Or = "preceding",
                                Sr = "ancestor-or-self", Rr = "..", Dr = "*:", Gr = ":*", Mr = "[", Ur = "]", Fr = "?",
                                Pr = ".", Hr = "/>", jr = "</", Xr = '"', _r = "'", Lr = "{{", kr = "}}", Yr = "\x3c!--",
                                qr = "--\x3e", Vr = "<?", Qr = "?>", Jr = "<![CDATA[", Kr = "]]>", zr = "document",
                                Zr = "text", Wr = "comment", $r = "processing-instruction", ea = "#", ta = "map", na = ":",
                                ra = "array", aa = "empty-sequence()", ia = "item()", oa = "node()", sa = "document-node(",
                                ua = "text()", la = "comment()", ca = "namespace-node()", ha = "processing-instruction(",
                                pa = "processing-instruction()", fa = "attribute(", da = "attribute()",
                                ma = "schema-attribute(", va = "schema-element", ga = "Q", ya = "&", wa = "amp",
                                Aa = "quot", xa = "apos", ba = '""', Ea = "''", Ba = "(:", Na = ":)", Ca = "X", Ta = "x",
                                Ia = "M", Oa = "m", Sa = "L", Ra = "l", Da = "&#x", Ga = "&#", Ma = "first", Ua = "last",
                                Fa = "into", Pa = "after", Ha = "before", ja = "insert", Xa = "nodes", _a = "node",
                                La = "delete", ka = "replace", Ya = "value", qa = "with", Va = "rename", Qa = "copy",
                                Ja = "modify", Ka = " ", za = "\t", Za = "\r", Wa = "\n", $a = "document-node",
                                ei = "empty-sequence", ti = "namespace-node", ni = "schema-attribute", ri = "switch",
                                ai = /^[*<a-zA-Z]/, ii = /^[*a-zA-Z]/, oi = /^[a-zA-Z]/, si = /^[0-9]/, ui = /^[eE]/,
                                li = /^[+\-]/, ci = /^[^"&]/, hi = /^[^'&]/, pi = /^[^"]/, fi = /^[^']/, di = /^[^{}]/,
                                mi = /^[{}<&]/, vi = /^["{}<&]/, gi = /^['{}<&]/, yi = /^[0-9a-fA-F]/,
                                wi = /^[\t\n\r -\uD7FF\uE000\uFFFD]/, Ai = /^[\uD800-\uDBFF]/, xi = /^[\uDC00-\uDFFF]/,
                                bi = /^[A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/,
                                Ei = /^[\uD800-\uDB7F]/, Bi = /^[\-.0-9\xB7\u0300-\u036F\u203F\u2040]/,
                                Ni = a("xquery", !1), Ci = a("encoding", !1), Ti = a("version", !1), Ii = a("module", !1),
                                Oi = a("namespace", !1), Si = a("=", !1), Ri = a(";", !1), Di = a("declare", !1),
                                Gi = a("boundary-space", !1), Mi = a("preserve", !1), Ui = a("strip", !1),
                                Fi = a("default", !1), Pi = a("collation", !1), Hi = a("base-uri", !1),
                                ji = a("construction", !1), Xi = a("ordering", !1), _i = a("ordered", !1),
                                Li = a("unordered", !1), ki = a("order", !1), Yi = a("empty", !1), qi = a("greatest", !1),
                                Vi = a("least", !1), Qi = a("copy-namespaces", !1), Ji = a(",", !1),
                                Ki = a("no-preserve", !1), zi = a("inherit", !1), Zi = a("no-inherit", !1),
                                Wi = a("decimal-format", !1), $i = a("decimal-separator", !1),
                                eo = a("grouping-separator", !1), to = a("infinity", !1), no = a("minus-sign", !1),
                                ro = a("NaN", !1), ao = a("percent", !1), io = a("per-mille", !1), oo = a("zero-digit", !1),
                                so = a("digit", !1), uo = a("pattern-separator", !1), lo = a("exponent-separator", !1),
                                co = a("import", !1), ho = a("schema", !1), po = a("at", !1), fo = a("element", !1),
                                mo = a("function", !1), vo = a("updating", !1), go = a("%", !1), yo = a("(", !1),
                                wo = a(")", !1), Ao = a("variable", !1), xo = a("$", !1), bo = a(":=", !1),
                                Eo = a("external", !1), Bo = a("context", !1), No = a("item", !1), Co = a("as", !1),
                                To = a("{", !1), Io = a("}", !1), Oo = a("option", !1), So = a("for", !1), Ro = a("in", !1),
                                Do = a("allowing", !1), Go = a("let", !1), Mo = a("where", !1), Uo = a("group", !1),
                                Fo = a("by", !1), Po = a("stable", !1), Ho = a("ascending", !1), jo = a("descending", !1),
                                Xo = a("return", !1), _o = a("some", !1), Lo = a("every", !1), ko = a("satisfies", !1),
                                Yo = a("typeswitch", !1), qo = a("case", !1), Vo = a("|", !1), Qo = a("if", !1),
                                Jo = a("then", !1), Ko = a("else", !1), zo = a("or", !1), Zo = a("and", !1),
                                Wo = a("||", !1), $o = a("to", !1), es = a("-", !1), ts = a("+", !1), ns = a("*", !1),
                                rs = a("div", !1), as = a("idiv", !1), is = a("mod", !1), os = a("union", !1),
                                ss = a("intersect", !1), us = a("except", !1), ls = a("instance", !1), cs = a("of", !1),
                                hs = a("treat", !1), ps = a("castable", !1), fs = a("cast", !1), ds = a("=>", !1),
                                ms = a("!=", !1), vs = a("<=", !1), gs = a("<", !1), ys = a(">=", !1), ws = a(">", !1),
                                As = a("eq", !1), xs = a("ne", !1), bs = a("lt", !1), Es = a("le", !1), Bs = a("gt", !1),
                                Ns = a("ge", !1), Cs = a("is", !1), Ts = a("<<", !1), Is = a(">>", !1),
                                Os = a("validate", !1), Ss = a("type", !1), Rs = a("lax", !1), Ds = a("strict", !1),
                                Gs = a("(#", !1), Ms = a("#)", !1), Us = a("!", !1), Fs = a("/", !1),
                                Ps = i(["*", "<", ["a", "z"], ["A", "Z"]], !1, !1),
                                Hs = i(["*", ["a", "z"], ["A", "Z"]], !1, !1), js = a("//", !1), Xs = a("child", !1),
                                _s = a("::", !1), Ls = a("descendant", !1), ks = a("attribute", !1), Ys = a("self", !1),
                                qs = a("descendant-or-self", !1), Vs = a("following-sibling", !1), Qs = a("following", !1),
                                Js = a("@", !1), Ks = a("parent", !1), zs = a("ancestor", !1),
                                Zs = a("preceding-sibling", !1), Ws = a("preceding", !1), $s = a("ancestor-or-self", !1),
                                eu = a("..", !1), tu = a("*:", !1), nu = a(":*", !1), ru = a("[", !1), au = a("]", !1),
                                iu = a("?", !1), ou = i([["a", "z"], ["A", "Z"]], !1, !1), su = a(".", !1),
                                uu = a("/>", !1), lu = a("</", !1), cu = a('"', !1), hu = a("'", !1), pu = a("{{", !1),
                                fu = a("}}", !1), du = a("\x3c!--", !1), mu = a("--\x3e", !1), vu = a("<?", !1),
                                gu = a("?>", !1), yu = a("<![CDATA[", !1), wu = a("]]>", !1), Au = a("document", !1),
                                xu = a("text", !1), bu = a("comment", !1), Eu = a("processing-instruction", !1),
                                Bu = a("#", !1), Nu = a("map", !1), Cu = a(":", !1), Tu = a("array", !1),
                                Iu = a("empty-sequence()", !1), Ou = a("item()", !1), Su = a("node()", !1),
                                Ru = a("document-node(", !1), Du = a("text()", !1), Gu = a("comment()", !1),
                                Mu = a("namespace-node()", !1), Uu = a("processing-instruction(", !1),
                                Fu = a("processing-instruction()", !1), Pu = a("attribute(", !1), Hu = a("attribute()", !1),
                                ju = a("schema-attribute(", !1), Xu = a("schema-element", !1), _u = i([["0", "9"]], !1, !1),
                                Lu = i(["e", "E"], !1, !1), ku = i(["+", "-"], !1, !1), Yu = i(['"', "&"], !0, !1),
                                qu = i(["'", "&"], !0, !1), Vu = i(['"'], !0, !1), Qu = i(["'"], !0, !1), Ju = a("Q", !1),
                                Ku = i(["{", "}"], !0, !1), zu = a("&", !1), Zu = a("amp", !1), Wu = a("quot", !1),
                                $u = a("apos", !1), el = a('""', !1), tl = a("''", !1),
                                nl = i(["{", "}", "<", "&"], !1, !1), rl = i(['"', "{", "}", "<", "&"], !1, !1),
                                al = i(["'", "{", "}", "<", "&"], !1, !1), il = a("(:", !1), ol = a(":)", !1),
                                sl = a("X", !1), ul = a("x", !1), ll = a("M", !1), cl = a("m", !1), hl = a("L", !1),
                                pl = a("l", !1), fl = a("&#x", !1), dl = i([["0", "9"], ["a", "f"], ["A", "F"]], !1, !1),
                                ml = a("&#", !1), vl = i(["\t", "\n", "\r", [" ", "퟿"], "", "�"], !1, !1),
                                gl = i([["\ud800", "\udbff"]], !1, !1), yl = i([["\udc00", "\udfff"]], !1, !1),
                                wl = a("first", !1), Al = a("last", !1), xl = a("into", !1), bl = a("after", !1),
                                El = a("before", !1), Bl = a("insert", !1), Nl = a("nodes", !1), Cl = a("node", !1),
                                Tl = a("delete", !1), Il = a("replace", !1), Ol = a("value", !1), Sl = a("with", !1),
                                Rl = a("rename", !1), Dl = a("copy", !1), Gl = a("modify", !1), Ml = a(" ", !1),
                                Ul = a("\t", !1), Fl = a("\r", !1), Pl = a("\n", !1),
                                Hl = i([["A", "Z"], "_", ["a", "z"], ["À", "Ö"], ["Ø", "ö"], ["ø", "˿"], ["Ͱ", "ͽ"], ["Ϳ", "῿"], "‌", "‍", ["⁰", "↏"], ["Ⰰ", "⿯"], ["、", "퟿"], ["豈", "﷏"], ["ﷰ", "�"]], !1, !1),
                                jl = i([["\ud800", "\udb7f"]], !1, !1),
                                Xl = i(["-", ".", ["0", "9"], "·", ["̀", "ͯ"], "‿", "⁀"], !1, !1),
                                _l = a("document-node", !1), Ll = a("empty-sequence", !1), kl = a("namespace-node", !1),
                                Yl = a("schema-attribute", !1), ql = a("switch", !1), Vl = 0, Ql = 0,
                                Jl = [{line: 1, da: 1}], Kl = 0, zl = [], Zl = 0, Wl = {};
                            if ("startRule" in n) {
                                if (!(n.Kb in nt)) throw Error("Can't start parsing from rule \"" + n.Kb + '".');
                                rt = nt[n.Kb]
                            }
                            var $l = rt();
                            if ($l !== et && Vl === e.length) return $l;
                            throw $l !== et && Vl < e.length && u({type: "end"}), function (e, n, r) {
                                return new t(t.ic(e, n), e, n, r)
                            }(zl, Kl < e.length ? e.charAt(Kl) : null, Kl < e.length ? s(Kl, Kl + 1) : s(Kl, Kl))
                        }
                    }
                }(this)
            }).call(e)
        }(Io);
        var Oo = Io.tc, So = Oo.parse, Ro = Oo.SyntaxError, Do = Object.create(null);

        function Go(e, t) {
            var n = t.ca ? "XQuery" : "XPath", r = t.debug ? null : Do[n + "~" + e] || null;
            try {
                if (r) var a = r; else a = So(e, {Ra: !!t.ca, qc: !!t.debug}), t.debug || (Do[n + "~" + e] = a);
                return a
            } catch (t) {
                if (t instanceof Ro) throw Error('XPST0003: Unable to parse: "' + e + '".\n' + t.message + "\n" + e.slice(0, t.location.start.offset) + "[Error is around here]" + e.slice(t.location.start.offset));
                throw t
            }
        }

        function Mo(e, t) {
            return "Q{" + (e || "") + "}" + t
        }

        function Uo(e, t) {
            for (var n = e.length - 1; 0 <= n; --n) if (t in e[n]) return e[n][t]
        }

        function Fo(e) {
            this.B = e, this.C = this.h = 0, this.o = [Object.create(null)], this.v = Object.create(null), this.J = null, this.Da = e.Da, this.Ca = e.Ca
        }

        function Po(e) {
            for (var t = new Fo(e.B), n = 0; n < e.h + 1; ++n) t.o = [Object.assign(Object.create(null), t.o[0], e.o[n])], t.Ca = [Object.assign(Object.create(null), t.Ca[0], e.Ca[n])], t.v = Object.assign(Object.create(null), e.v), t.Da = e.Da, t.J = e.J;
            return t
        }

        function Ho(e) {
            e.C++, e.h++, e.o[e.h] = Object.create(null), e.Ca[e.h] = Object.create(null)
        }

        function jo(e, t, n, r, a) {
            if (r = Mo(t, n) + "~" + r, e.v[r]) throw Error('XQST0049: The function or variable "Q{' + t + "}" + n + '" is declared more than once.');
            e.v[r] = a
        }

        function Xo(e, t, n) {
            return t = Mo(t || "", n), e.Ca[e.h][t] = t + "[" + e.C + "]"
        }

        function _o(e, t, n, r) {
            e.Da[Mo(t || "", n) + "[" + e.C + "]"] = r
        }

        function Lo(e) {
            e.o.length = e.h, e.Ca.length = e.h, e.h--
        }

        Fo.prototype.Aa = function (e, t, n, r) {
            r = void 0 !== r && r;
            var a = this.v[Mo(e, t) + "~" + n];
            return !a || r && a.Cb ? null === this.B ? null : this.B.Aa(e, t, n, r) : a
        }, Fo.prototype.rb = function (e, t) {
            var n = Uo(this.Ca, Mo(e, t));
            return n || this.B.rb(e, t)
        }, Fo.prototype.Qa = function (e, t) {
            var n = e.prefix, r = e.localName;
            return !n && this.J ? {localName: r, namespaceURI: this.J} : n && (n = this.ga(n, !1)) ? {
                localName: r,
                namespaceURI: n
            } : this.B.Qa(e, t)
        }, Fo.prototype.ga = function (e, t) {
            var n = Uo(this.o, e);
            return void 0 === n ? null === this.B ? void 0 : this.B.ga(e, void 0 === t || t) : n
        };
        var ko = Object.create(null);

        function Yo(e, t) {
            var n = ko[e];
            n || (n = ko[e] = {La: [], Va: []}), n.La = n.La.concat(t.La), n.Va = n.Va.concat(t.Va)
        }

        function qo(e, t) {
            var n = ko[t];
            if (!n) throw Error("XQST0051: No modules found with the namespace uri " + t);
            n.La.forEach((function (n) {
                return jo(e, t, n.localName, n.arity, n.Gb)
            })), n.Va.forEach((function (n) {
                Xo(e, t, n.localName), _o(e, t, n.localName, (function (e, t) {
                    return er(n.ia, e, t)
                }))
            }))
        }

        var Vo = "http://www.w3.org/XML/1998/namespace http://www.w3.org/2001/XMLSchema http://www.w3.org/2001/XMLSchema-instance http://www.w3.org/2005/xpath-functions http://www.w3.org/2005/xpath-functions/math http://www.w3.org/2012/xquery http://www.w3.org/2005/xpath-functions/array http://www.w3.org/2005/xpath-functions/map".split(" ");

        function Qo(e, t) {
            var n = [], r = [];
            Yr(e, "*").forEach((function (e) {
                switch (e[0]) {
                    case"moduleImport":
                    case"namespaceDecl":
                    case"defaultNamespaceDecl":
                    case"functionDecl":
                    case"varDecl":
                        break;
                    default:
                        throw Error("Not implemented: only module imports, namespace declarations, and function declarations are implemented in XQuery modules")
                }
            }));
            var a = new Set;
            Yr(e, "moduleImport").forEach((function (e) {
                var n = _r(Xr(e, "namespacePrefix"));
                if (e = _r(Xr(e, "targetNamespace")), a.has(e)) throw Error('XQST0047: The namespace "' + e + '" is imported more than once.');
                a.add(e), t.o[t.h][n] = e, qo(t, e)
            })), Yr(e, "namespaceDecl").forEach((function (e) {
                var n = _r(Xr(e, "prefix"));
                if (e = _r(Xr(e, "uri")), "xml" === n || "xmlns" === n) throw pi();
                if ("http://www.w3.org/XML/1998/namespace" === e || "http://www.w3.org/2000/xmlns/" === e) throw pi();
                t.o[t.h][n] = e
            }));
            var i = Yr(e, "defaultNamespaceDecl").filter((function (e) {
                if ("function" === (e = _r(Xr(e, "defaultNamespaceCategory")))) return e;
                if ("element" === e) throw Error("Not Implemented: default namespace element.")
            }));
            if (1 === i.length) {
                if (!(i = _r(Xr(Xr(e, "defaultNamespaceDecl"), "uri")))) throw hi();
                if ("http://www.w3.org/XML/1998/namespace" === i || "http://www.w3.org/2000/xmlns/" === i) throw pi();
                t.J = i
            } else if (1 < i.length) throw Error("XQST0066: A Prolog may contain at most one default function namespace declaration.");
            Yr(e, "functionDecl").forEach((function (e) {
                var a = Xr(e, "functionName"), i = Lr(a, "prefix"), o = Lr(a, "URI"), s = _r(a);
                if (null === o && (!(o = null === i ? t.J || "http://www.w3.org/2005/xpath-functions" : t.ga(i)) && i)) throw di(i);
                if (Vo.includes(o)) throw ci();
                if (a = (i = Yr(e, "annotation").map((function (e) {
                    return Xr(e, "annotationName")
                }))).every((function (e) {
                    return !Lr(e, "URI") && "private" !== _r(e)
                })), i = i.some((function (e) {
                    return !Lr(e, "URI") && "updating" === _r(e)
                })), !o) throw hi();
                var u, l = Vr(e), h = Yr(Xr(e, "paramList"), "param"), p = h.map((function (e) {
                    return Xr(e, "varName")
                })), f = h.map((function (e) {
                    return Vr(e)
                }));
                if (e = Xr(e, "functionBody")) {
                    if (t.Aa(o, s, f.length)) throw Error("XQST0049: The function Q{" + o + "}" + s + "#" + f.length + " has already been declared.");
                    var d = To(e[1], {qa: !1, ca: !0}), m = new Fo(t), v = p.map((function (e) {
                        var n = Lr(e, "URI"), r = Lr(e, "prefix");
                        return e = _r(e), r && null === n && (n = t.ga(r || "")), Xo(m, n, e)
                    }));
                    u = i ? {
                        l: f, arity: p.length, m: function (e, t, n, r) {
                            for (var a = [], i = 3; i < arguments.length; ++i) a[i - 3] = arguments[i];
                            return i = bt(xt(e, -1, null, se.empty()), v.reduce((function (e, t, n) {
                                return e[t] = ue(a[n]), e
                            }), Object.create(null))), d.o(i, t)
                        }, Cb: !1, I: !0, localName: s, namespaceURI: o, j: l
                    } : {
                        l: f, arity: p.length, m: function (e, t, n, r) {
                            for (var a = [], i = 3; i < arguments.length; ++i) a[i - 3] = arguments[i];
                            return i = bt(xt(e, -1, null, se.empty()), v.reduce((function (e, t, n) {
                                return e[t] = ue(a[n]), e
                            }), Object.create(null))), er(d, i, t)
                        }, Cb: !1, I: !1, localName: s, namespaceURI: o, j: l
                    }, n.push({ia: d, Lb: m}), a && r.push({arity: p.length, ia: d, Gb: u, localName: s, namespaceURI: o})
                } else {
                    if (i) throw Error("Updating external function declarations are not supported");
                    u = {
                        l: f, arity: p.length, m: function (e, t, n, r) {
                            for (var a = [], i = 3; i < arguments.length; ++i) a[i - 3] = arguments[i];
                            if (!(i = n.Aa(o, s, p.length, !0))) throw Error("XPST0017: Function Q{" + o + "}" + s + " with arity of " + p.length + " not registered. " + xa(s));
                            if (i.j.type !== l.type || i.l.some((function (e, t) {
                                return e.type !== f[t].type
                            }))) throw Error("External function declaration types do not match actual function");
                            return i.m.apply(i, [e, t, n].concat(c(a)))
                        }, Cb: !0, I: !1, localName: s, namespaceURI: o, j: l
                    }
                }
                jo(t, o, s, p.length, u)
            }));
            var o = [];
            return Yr(e, "varDecl").forEach((function (e) {
                var r = qr(Xr(e, "varName")), a = r.namespaceURI;
                if (null === a && (!(a = t.ga(r.prefix)) && r.prefix)) throw di(r.prefix);
                if (Vo.includes(a)) throw ci();
                var i, s, u = Xr(e, "external");
                if (e = Xr(e, "varValue"), null !== u ? null !== (u = Xr(u, "varValue")) && (i = Xr(u, "*")) : null !== e && (i = Xr(e, "*")), i && (s = To(i, {
                    qa: !1,
                    ca: !0
                })), o.some((function (e) {
                    return e.namespaceURI === a && e.localName === r.localName
                }))) throw Error("XQST0049: The variable " + (a ? "Q{" + a + "}" : "") + r.localName + " has already been declared.");
                if (Xo(t, a || "", r.localName), i && !function (e, t, n) {
                    return (e = e.Da[Mo(t, n)]) ? e : null
                }(t, a || "", r.localName)) {
                    var l = null;
                    _o(t, a, r.localName, (function (e, t) {
                        return l ? l() : (l = ue(er(s, e, t)))()
                    })), n.push({ia: s, Lb: t}), o.push({ia: s, localName: r.localName, namespaceURI: a})
                }
            })), n.forEach((function (e) {
                e.ia.P(e.Lb)
            })), r.forEach((function (e) {
                if (!e.Gb.I && e.ia.I) throw Ln("The function Q{" + e.namespaceURI + "}" + e.localName + " is updating but the %updating annotation is missing.")
            })), {La: r, Va: o}
        }

        function Jo(e, t, n) {
            var r = kr(e, ["forClauseItem", "typedVariableBinding", "varName"])[1];
            (e = kr(e, ["forClauseItem", "forExpr", "sequenceExpr"])) && ((e = Yr(e, "*").map((function (e) {
                return n(e, t)
            }))).includes(void 0) || e.includes(null) || 1 === (e = Ko(e)).length && ss(t, r, e[0]))
        }

        function Ko(e) {
            return e.filter((function (e, t, n) {
                return n.findIndex((function (t) {
                    return t.type === e.type && t.g === e.g
                })) === t
            }))
        }

        function zo(e, t, n) {
            var r = Yr(e, "*"), a = Xr(e, "atomicType");
            if (!a) return {type: 59, g: 2};
            if (de(Lr(a, "prefix") + ":" + a[2]) === t.type) if (1 === r.length) {
                if (3 === t.g) return n
            } else if (e = Xr(e, "occurrenceIndicator")[1], t.g === function (e) {
                switch (e) {
                    case"*":
                        return 2;
                    case"?":
                        return 0;
                    case"+":
                        return 1;
                    default:
                        return 3
                }
            }(e)) return n
        }

        function Zo(e, t) {
            Wo(e, t)
        }

        function Wo(e, t) {
            var n = is.get(e[0]);
            if (n) return n(e, t);
            for (n = 1; n < e.length; n++) e[n] && Wo(e[n], t)
        }

        function $o(e, t) {
            var n = Wo(Xr(e, "firstOperand")[1], t), r = Wo(Xr(e, "secondOperand")[1], t), a = e[0];
            if (n && r) {
                if (!(t = function (e, t, n) {
                    var r = [2, 53, 59, 46, 47];
                    if (r.includes(t) || r.includes(n)) return 2;
                    var a = null, i = null;
                    W(t, 19) && (a = function (e) {
                        return Jt(e, 3)
                    }, t = 3), W(n, 19) && (i = function (e) {
                        return Jt(e, 3)
                    }, n = 3);
                    var o = Sa.filter((function (e) {
                        return W(t, e)
                    }));
                    if (r = Sa.filter((function (e) {
                        return W(n, e)
                    })), o.includes(2) && r.includes(2)) return void 0 === (r = Ca[Ba(2, 2, e)]) && (r = Oa(t, n)), "divOp" === e && 5 === r && (r = 4), "idivOp" === e ? Da((function (e, t) {
                        return {W: a ? a(e) : e, X: i ? i(t) : t}
                    }), (function (e, t) {
                        return Math.trunc(e / t)
                    }))[1] : r;
                    for (var s = (o = u(o)).next(); !s.done; s = o.next()) {
                        s = s.value;
                        for (var l = u(r), c = l.next(); !c.done; c = l.next()) if (void 0 !== (c = Ca[Ba(s, c.value, e)])) return c
                    }
                }(a, n.type, r.type))) throw Error("XPTY0004: " + a + " not available for types " + fe(n) + " and " + fe(r));
                n = {type: t, g: n.g}, 2 !== t && 59 !== t && Qr(e, n), e = n
            } else e = {type: 2, g: 3};
            return e
        }

        function es(e, t) {
            Wo(Xr(e, "firstOperand")[1], t), Wo(Xr(e, "secondOperand")[1], t);
            e:{
                switch (e[0]) {
                    case"orOp":
                    case"andOp":
                        Qr(e, t = {type: 0, g: 3}), e = t;
                        break e
                }
                e = void 0
            }
            return e
        }

        function ts(e, t) {
            Wo(Xr(e, "firstOperand")[1], t), Wo(Xr(e, "secondOperand")[1], t);
            e:{
                switch (e[0]) {
                    case"unionOp":
                    case"intersectOp":
                    case"exceptOp":
                        Qr(e, t = {type: 53, g: 2}), e = t;
                        break e
                }
                e = void 0
            }
            return e
        }

        function ns(e, t) {
            return Wo(Xr(e, "firstOperand")[1], t), Wo(Xr(e, "secondOperand")[1], t), Qr(e, t = {type: 0, g: 3}), t
        }

        function rs(e, t) {
            return Wo(Xr(e, "firstOperand")[1], t), Wo(Xr(e, "secondOperand")[1], t), Qr(e, t = {type: 0, g: 3}), t
        }

        function as(e, t) {
            return Wo(Xr(e, "firstOperand")[1], t), Wo(Xr(e, "secondOperand")[1], t), Qr(e, t = {type: 0, g: 3}), t
        }

        var is = new Map([["unaryMinusOp", function (e, t) {
            return (t = Wo(Xr(e, "operand")[1], t)) ? W(t.type, 2) ? (Qr(e, t = {
                type: t.type,
                g: t.g
            }), e = t) : (Qr(e, t = {type: 3, g: 3}), e = t) : (Qr(e, t = {type: 2, g: 2}), e = t), e
        }], ["unaryPlusOp", function (e, t) {
            return (t = Wo(Xr(e, "operand")[1], t)) ? W(t.type, 2) ? (Qr(e, t = {
                type: t.type,
                g: t.g
            }), e = t) : (Qr(e, t = {type: 3, g: 3}), e = t) : (Qr(e, t = {type: 2, g: 2}), e = t), e
        }], ["addOp", $o], ["subtractOp", $o], ["divOp", $o], ["idivOp", $o], ["modOp", $o], ["multiplyOp", $o], ["andOp", es], ["orOp", es], ["sequenceExpr", function (e, t) {
            var n = Yr(e, "*"), r = n.map((function (e) {
                return Wo(e, t)
            }));
            return function (e, t, n) {
                if (0 === t) var r = {type: 53, g: 2}; else n.includes(void 0) || n.includes(null) ? r = {
                    type: 59,
                    g: 2
                } : r = 1 < (t = Ko(n)).length ? {type: 59, g: 2} : {type: t[0].type, g: 2};
                return r && 59 !== r.type && Qr(e, r), r
            }(e, n.length, r)
        }], ["unionOp", ts], ["intersectOp", ts], ["exceptOp", ts], ["stringConcatenateOp", function (e, t) {
            return Wo(Xr(e, "firstOperand")[1], t), Wo(Xr(e, "secondOperand")[1], t), Qr(e, t = {type: 1, g: 3}), t
        }], ["rangeSequenceExpr", function (e, t) {
            return Wo(Xr(e, "startExpr")[1], t), Wo(Xr(e, "endExpr")[1], t), Qr(e, t = {type: 5, g: 1}), t
        }], ["equalOp", ns], ["notEqualOp", ns], ["lessThanOrEqualOp", ns], ["lessThanOp", ns], ["greaterThanOrEqualOp", ns], ["greaterThanOp", ns], ["eqOp", rs], ["neOp", rs], ["ltOp", rs], ["leOp", rs], ["gtOp", rs], ["geOp", rs], ["isOp", as], ["nodeBeforeOp", as], ["nodeAfterOp", as], ["pathExpr", function (e, t) {
            var n = Xr(e, "rootExpr");
            return n && n[1] && Wo(n[1], t), Yr(e, "stepExpr").map((function (e) {
                return Wo(e, t)
            })), function (e) {
                var t = Yr(e, "stepExpr");
                if (!t) return {type: 59, g: 2};
                for (var n = (t = u(t)).next(); !n.done; n = t.next()) {
                    var r = n.value;
                    if (n = void 0, r) {
                        for (var a = Yr(r, "*"), i = (a = u(a)).next(); !i.done; i = a.next()) switch (i = i.value, i[0]) {
                            case"filterExpr":
                                n = Lr(kr(i, ["*"]), "type");
                                break;
                            case"xpathAxis":
                                e:{
                                    switch (i[1]) {
                                        case"attribute":
                                            n = {type: 47, g: 2};
                                            break e;
                                        case"child":
                                        case"decendant":
                                        case"self":
                                        case"descendant-or-self":
                                        case"following-sibling":
                                        case"following":
                                        case"namespace":
                                        case"parent":
                                        case"ancestor":
                                        case"preceding-sibling":
                                        case"preceding":
                                        case"ancestor-or-self":
                                            n = {type: 53, g: 2};
                                            break e
                                    }
                                    n = void 0
                                }
                        }
                        n && 59 !== n.type && Qr(r, n)
                    }
                    r = Lr(r, "type")
                }
                return r && 59 !== r.type && Qr(e, r), r
            }(e)
        }], ["contextItemExpr", function () {
            return {type: 59, g: 2}
        }], ["ifThenElseExpr", function (e, t) {
            Wo(Xr(Xr(e, "ifClause"), "*"), t);
            var n = Wo(Xr(Xr(e, "thenClause"), "*"), t);
            return t = Wo(Xr(Xr(e, "elseClause"), "*"), t), n && t && n.type === t.type && n.g === t.g ? (59 !== n.type && Qr(e, n), e = n) : e = {
                type: 59,
                g: 2
            }, e
        }], ["instanceOfExpr", function (e, t) {
            return Wo(Xr(e, "argExpr"), t), Wo(Xr(e, "sequenceType"), t), Qr(e, t = {type: 0, g: 3}), t
        }], ["integerConstantExpr", function (e) {
            var t = {type: 5, g: 3};
            return Qr(e, t), t
        }], ["doubleConstantExpr", function (e) {
            var t = {type: 3, g: 3};
            return Qr(e, t), t
        }], ["decimalConstantExpr", function (e) {
            var t = {type: 4, g: 3};
            return Qr(e, t), t
        }], ["stringConstantExpr", function (e) {
            var t = {type: 1, g: 3};
            return Qr(e, t), t
        }], ["functionCallExpr", function (e, t) {
            return Yr(Xr(e, "arguments"), "*").map((function (e) {
                return Wo(e, t)
            })), function (e, t) {
                if (!t || !t.ma) return {type: 59, g: 2};
                var n = qr(Xr(e, "functionName")), r = n.localName, a = n.prefix;
                return n = Yr(Xr(e, "arguments"), "*"), (r = t.ma.Qa({
                    localName: r,
                    prefix: a
                }, n.length)) && (t = t.ma.Aa(r.namespaceURI, r.localName, n.length)) ? (59 !== t.j.type && Qr(e, t.j), t.j) : {
                    type: 59,
                    g: 2
                }
            }(e, t)
        }], ["arrowExpr", function (e, t) {
            return Wo(Xr(e, "argExpr")[1], t), function (e, t) {
                if (!t || !t.ma) return {type: 59, g: 2};
                var n = Xr(e, "EQName");
                if (!n) return {type: 59, g: 2};
                var r = qr(n);
                n = r.localName;
                var a = r.prefix;
                return r = Yr(Xr(e, "arguments"), "*"), (n = t.ma.Qa({
                    localName: n,
                    prefix: a
                }, r.length)) && (t = t.ma.Aa(n.namespaceURI, n.localName, r.length + 1)) ? (59 !== t.j.type && Qr(e, t.j), t.j) : {
                    type: 59,
                    g: 2
                }
            }(e, t)
        }], ["dynamicFunctionInvocationExpr", function (e, t) {
            return Wo(kr(e, ["functionItem", "*"]), t), (e = Xr(e, "arguments")) && Wo(e, t), {type: 59, g: 2}
        }], ["namedFunctionRef", function (e, t) {
            return function (e, t) {
                if (!t || !t.ma) return {type: 59, g: 2};
                var n = qr(Xr(e, "functionName")), r = n.localName, a = n.namespaceURI, i = n.prefix;
                if (n = Number(kr(e, ["integerConstantExpr", "value"])[1]), !a) {
                    if (!(a = t.ma.Qa({localName: r, prefix: i}, n))) return {type: 59, g: 2};
                    r = a.localName, a = a.namespaceURI
                }
                return (t = t.ma.Aa(a, r, n) || null) ? (59 !== t.j.type && Qr(e, t.j), t.j) : {type: 59, g: 2}
            }(e, t)
        }], ["inlineFunctionExpr", function (e, t) {
            return Wo(Xr(e, "functionBody")[1], t), Qr(e, t = {type: 60, g: 3}), t
        }], ["castExpr", function (e) {
            var t = kr(e, ["singleType", "atomicType"]);
            return 59 !== (t = {type: de(t = Lr(t, "prefix") + ":" + t[2]), g: 3}).type && Qr(e, t), t
        }], ["castableExpr", function (e) {
            var t = {type: 0, g: 3};
            return Qr(e, t), t
        }], ["simpleMapExpr", function (e, t) {
            for (var n, r = Yr(e, "pathExpr"), a = 0; a < r.length; a++) n = Wo(r[a], t);
            return null != n ? (59 !== (t = {type: n.type, g: 2}).type && Qr(e, t), e = t) : e = {type: 59, g: 2}, e
        }], ["mapConstructor", function (e, t) {
            return Yr(e, "mapConstructorEntry").map((function (e) {
                return {key: Wo(kr(e, ["mapKeyExpr", "*"]), t), value: Wo(kr(e, ["mapValueExpr", "*"]), t)}
            })), function (e) {
                var t = {type: 61, g: 3};
                return Qr(e, t), t
            }(e)
        }], ["arrayConstructor", function (e, t) {
            return Yr(Xr(e, "*"), "arrayElem").map((function (e) {
                return Wo(e, t)
            })), function (e) {
                var t = {type: 62, g: 3};
                return Qr(e, t), t
            }(e)
        }], ["unaryLookup", function (e) {
            return Xr(e, "NCName"), {type: 59, g: 2}
        }], ["typeswitchExpr", function (e, t) {
            return function (e, t, n, r) {
                if (!t || n.includes(void 0)) return {type: 59, g: 2};
                for (var a = Yr(e, "typeswitchExprCaseClause"), i = 0; i < n.length; i++) {
                    var o = Xr(a[i], "*");
                    switch (o[0]) {
                        case"sequenceType":
                            if (o = zo(o, t, n[i])) return 59 !== o.type && Qr(e, o), o;
                            continue;
                        case"sequenceTypeUnion":
                            for (r = Yr(o, "*"), a = 0; 2 > a; a++) if (o = zo(r[a], t, n[i])) return 59 !== o.type && Qr(e, o), o;
                        default:
                            return {type: 59, g: 2}
                    }
                }
                return 59 !== r.type && Qr(e, r), r
            }(e, Wo(Xr(e, "argExpr")[1], t), Yr(e, "typeswitchExprCaseClause").map((function (e) {
                return Wo(kr(e, ["resultExpr"])[1], t)
            })), Wo(kr(e, ["typeswitchExprDefaultClause", "resultExpr"])[1], t))
        }], ["quantifiedExpr", function (e, t) {
            return Yr(e, "*").map((function (e) {
                return Wo(e, t)
            })), function (e) {
                var t = {type: 0, g: 3};
                return Qr(e, t), t
            }(e)
        }], ["x:stackTrace", function (e, t) {
            return Wo((e = Yr(e, "*"))[0], t)
        }], ["queryBody", function (e, t) {
            return Wo(e[1], t)
        }], ["flworExpr", function (e, t) {
            return function (e, t) {
                for (var n = Wo, r = !1, a = 1; a < e.length; a++) switch (e[a][0]) {
                    case"letClause":
                        us(t);
                        var i = e[a], o = t, s = n;
                        ss(o, kr(i, ["letClauseItem", "typedVariableBinding", "varName"])[1], s = s((i = kr(i, ["letClauseItem", "letExpr"]))[1], o));
                        break;
                    case"forClause":
                        r = !0, us(t), Jo(e[a], t, n);
                        break;
                    case"whereClause":
                        us(t), n(o = e[a], t), Qr(o, {type: 0, g: 3});
                        break;
                    case"orderByClause":
                        us(t);
                        break;
                    case"returnClause":
                        return o = n, Qr(n = kr(a = e[a], ["*"]), t = o(n, t)), Qr(a, t), (n = t) ? (r && (n = {
                            type: n.type,
                            g: 2
                        }), 59 !== n.type && Qr(e, n), n) : {type: 59, g: 2};
                    default:
                        return (n = n(e[a], t)) ? (r && (n = {
                            type: n.type,
                            g: 2
                        }), 59 !== n.type && Qr(e, n), n) : {type: 59, g: 2}
                }
                if (!(0 < t.h)) throw Error("Variable scope out of bound");
                t.h--, t.o.pop()
            }(e, t)
        }], ["varRef", function (e, t) {
            e:{
                for (var n = e[1][1], r = t.h; 0 <= r;) {
                    t = t.o[r][n];
                    break e
                }
                throw Error("XPST0008, The variable " + n + " is not in scope.")
            }
            return t && 59 !== t.type && Qr(e, t), t
        }]]);

        function os(e) {
            this.h = 0, this.ma = e, this.o = [{}]
        }

        function ss(e, t, n) {
            if (e.o[e.h][t]) throw Error("Another variable of in the scope " + e.h + " with the same name " + t + " already exists");
            e.o[e.h][t] = n
        }

        function us(e) {
            e.h++, e.o.push({})
        }

        var ls = {},
            cs = (ls.xml = "http://www.w3.org/XML/1998/namespace", ls.xs = "http://www.w3.org/2001/XMLSchema", ls.fn = "http://www.w3.org/2005/xpath-functions", ls.map = "http://www.w3.org/2005/xpath-functions/map", ls.array = "http://www.w3.org/2005/xpath-functions/array", ls.math = "http://www.w3.org/2005/xpath-functions/math", ls.fontoxpath = "http://fontoxml.com/fontoxpath", ls.local = "http://www.w3.org/2005/xquery-local-functions", ls);

        function hs(e, t, n) {
            this.Ca = [Object.create(null)], this.Da = Object.create(null), this.v = e, this.C = Object.keys(t).reduce((function (e, n) {
                return void 0 === t[n] || (e[n] = "Q{}" + n + "[0]"), e
            }), Object.create(null)), this.o = Object.create(null), this.h = Object.create(null), this.J = n, this.B = []
        }

        function ps(e, t, n) {
            if (1 !== t.node.nodeType && 9 !== t.node.nodeType) return [];
            var r = Se(e, t).reduce((function (t, r) {
                for (var a = (r = u(ps(e, r, n))).next(); !a.done; a = r.next()) t.push(a.value);
                return t
            }), []);
            return n(t) && r.unshift(t), r
        }

        function fs(e, t, n, r, a) {
            if (!(e = a.first())) throw Error("XPDY0002: The context is absent, it needs to be present to use id function.");
            if (!W(e.type, 53)) throw Ct("The context item is not a node, it needs to be node to use id function.");
            var i = t.h, o = r.S().reduce((function (e, t) {
                return t.value.split(/\s+/).forEach((function (t) {
                    e[t] = !0
                })), e
            }), Object.create(null));
            for (t = e.value; 9 !== t.node.nodeType;) if (null === (t = Ue(i, t))) throw Error("FODC0001: the root node of the target node is not a document node.");
            return t = ps(i, t, (function (e) {
                return 1 === e.node.nodeType && (!(!(e = Oe(i, e, "id")) || !o[e]) && (o[e] = !1, !0))
            })), se.create(t.map((function (e) {
                return Xe(e)
            })))
        }

        function ds(e, t, n, r, a) {
            if (!(e = a.first())) throw Error("XPDY0002: The context is absent, it needs to be present to use idref function.");
            if (!W(e.type, 53)) throw Ct("The context item is not a node, it needs to be node to use idref function.");
            var i = t.h, o = r.S().reduce((function (e, t) {
                return e[t.value] = !0, e
            }), Object.create(null));
            for (t = e.value; 9 !== t.node.nodeType;) if (null === (t = Ue(i, t))) throw Error("FODC0001: the root node of the context node is not a document node.");
            return t = ps(i, t, (function (e) {
                return 1 === e.node.nodeType && (!!(e = Oe(i, e, "idref")) && e.split(/\s+/).some((function (e) {
                    return o[e]
                })))
            })), se.create(t.map((function (e) {
                return Xe(e)
            })))
        }

        function ms(e, t, n, r, a) {
            var i = (e = ke(0, 0, 0, a, se.s(q("duplicates", 1)))).F() ? "use-first" : e.first().value;
            return r.M((function (e) {
                return se.s(new Ye(e.reduce((function (e, t) {
                    return t.h.forEach((function (t) {
                        var n = e.findIndex((function (e) {
                            return Le(e.key, t.key)
                        }));
                        if (0 <= n) switch (i) {
                            case"reject":
                                throw Error("FOJS0003: Duplicate encountered when merging maps.");
                            case"use-last":
                                return void e.splice(n, 1, t);
                            case"combine":
                                return void e.splice(n, 1, {
                                    key: t.key,
                                    value: ue(se.create(e[n].value().S().concat(t.value().S())))
                                });
                            default:
                                return
                        }
                        e.push(t)
                    })), e
                }), [])))
            }))
        }

        function vs(e, t, n) {
            var r = 1, a = e.value;
            e = e.ya(!0);
            var i = null, o = Math.max(t - 1, 0);
            return -1 !== e && (i = Math.max(0, (null === n ? e : Math.max(0, Math.min(e, n + (t - 1)))) - o)), se.create({
                next: function (e) {
                    for (; r < t;) a.next(e), r++;
                    return null !== n && r >= t + n ? z : (e = a.next(e), r++, e)
                }
            }, i)
        }

        function gs(e) {
            return e.map((function (e) {
                return W(e.type, 19) ? Jt(e, 3) : e
            }))
        }

        function ys(e) {
            if ((e = gs(e)).some((function (e) {
                return Number.isNaN(e.value)
            }))) return [q(NaN, 3)];
            if (!(e = si(e))) throw Error("FORG0006: Incompatible types to be converted to a common type");
            return e
        }

        function ws(e, t, n, r, a, i) {
            return _e([a, i], (function (e) {
                var t = u(e);
                if (e = t.next().value, t = t.next().value, 1 / 0 === e.value) return se.empty();
                if (-1 / 0 === e.value) return t && 1 / 0 === t.value ? se.empty() : r;
                if (t) {
                    if (isNaN(t.value)) return se.empty();
                    1 / 0 === t.value && (t = null)
                }
                return isNaN(e.value) ? se.empty() : vs(r, Math.round(e.value), t ? Math.round(t.value) : null)
            }))
        }

        function As(e, t, n, r, a) {
            if (r.F()) return a;
            if (!(e = si(e = gs(r.S())))) throw Error("FORG0006: Incompatible types to be converted to a common type");
            if (!e.every((function (e) {
                return W(e.type, 2)
            }))) throw Error("FORG0006: items passed to fn:sum are not all numeric.");
            return t = e.reduce((function (e, t) {
                return e + t.value
            }), 0), e.every((function (e) {
                return W(e.type, 5)
            })) ? se.s(q(t, 5)) : e.every((function (e) {
                return W(e.type, 3)
            })) ? se.s(q(t, 3)) : e.every((function (e) {
                return W(e.type, 4)
            })) ? se.s(q(t, 4)) : se.s(q(t, 6))
        }

        hs.prototype.Aa = function (e, t, n) {
            return function (e, t, n) {
                var r = wa[e + ":" + t];
                return r && (r = r.find((function (e) {
                    return e.l.some((function (e) {
                        return 4 === e
                    })) ? e.l.length - 1 <= n : e.l.length === n
                }))) ? {l: r.l, arity: n, m: r.m, I: r.I, localName: t, namespaceURI: e, j: r.j} : null
            }(e, t, n)
        }, hs.prototype.rb = function (e, t) {
            return e ? null : (e = this.C[t], this.o[t] || (this.o[t] = {name: t}), e)
        }, hs.prototype.Qa = function (e, t) {
            var n = this.J(e, t);
            if (n) this.B.push({oc: e, arity: t, Jb: n}); else if (t = this.ga(e.prefix, !0)) return {
                namespaceURI: t,
                localName: e.localName
            };
            return n
        }, hs.prototype.ga = function (e, t) {
            return void 0 === t || t ? cs[e] ? cs[e] : (t = this.v(e), this.h[e] || (this.h[e] = {
                namespaceURI: t,
                prefix: e
            }), void 0 !== t || e ? t : null) : null
        };
        var xs = [].concat(Nr, [{
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "boolean",
            l: [{type: 59, g: 2}],
            j: {type: 0, g: 3},
            m: function (e, t, n, r) {
                return r.getEffectiveBooleanValue() ? se.$() : se.U()
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "true",
            l: [],
            j: {type: 0, g: 3},
            m: function () {
                return se.$()
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "not",
            l: [{type: 59, g: 2}],
            j: {type: 0, g: 3},
            m: function (e, t, n, r) {
                return !1 === r.getEffectiveBooleanValue() ? se.$() : se.U()
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "false",
            l: [],
            j: {type: 0, g: 3},
            m: function () {
                return se.U()
            }
        }], [{
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "last",
            l: [],
            j: {type: 5, g: 3},
            m: function (e) {
                if (null === e.O) throw Error("XPDY0002: The fn:last() function depends on dynamic context, which is absent.");
                var t = !1;
                return se.create({
                    next: function () {
                        if (t) return z;
                        var n = e.wa.ya();
                        return t = !0, Z(q(n, 5))
                    }
                }, 1)
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "position",
            l: [],
            j: {type: 5, g: 3},
            m: function (e) {
                if (null === e.O) throw Error("XPDY0002: The fn:position() function depends on dynamic context, which is absent.");
                return se.s(q(e.Ga + 1, 5))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "current-dateTime",
            l: [],
            j: {type: 10, g: 3},
            m: function (e) {
                return se.s(q(wt(e), 10))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "current-date",
            l: [],
            j: {type: 7, g: 3},
            m: function (e) {
                return se.s(q(it(wt(e), 7), 7))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "current-time",
            l: [],
            j: {type: 8, g: 3},
            m: function (e) {
                return se.s(q(it(wt(e), 8), 8))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "implicit-timezone",
            l: [],
            j: {type: 17, g: 3},
            m: function (e) {
                return se.s(q(At(e), 17))
            }
        }], Tr, Ur, Pr, [{
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "years-from-duration",
            l: [{type: 18, g: 0}],
            j: {type: 5, g: 0},
            m: function (e, t, n, r) {
                return r.F() ? r : se.s(q(r.first().value.cb(), 5))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "months-from-duration",
            l: [{type: 18, g: 0}],
            j: {type: 5, g: 0},
            m: function (e, t, n, r) {
                return r.F() ? r : se.s(q(r.first().value.$a(), 5))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "days-from-duration",
            l: [{type: 18, g: 0}],
            j: {type: 5, g: 0},
            m: function (e, t, n, r) {
                return r.F() ? r : se.s(q(r.first().value.Za(), 5))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "hours-from-duration",
            l: [{type: 18, g: 0}],
            j: {type: 5, g: 0},
            m: function (e, t, n, r) {
                return r.F() ? r : se.s(q(r.first().value.getHours(), 5))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "minutes-from-duration",
            l: [{type: 18, g: 0}],
            j: {type: 5, g: 0},
            m: function (e, t, n, r) {
                return r.F() ? r : se.s(q(r.first().value.getMinutes(), 5))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "seconds-from-duration",
            l: [{type: 18, g: 0}],
            j: {type: 4, g: 0},
            m: function (e, t, n, r) {
                return r.F() ? r : se.s(q(r.first().value.getSeconds(), 4))
            }
        }], [{
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "id",
            l: [{type: 1, g: 2}, {type: 53, g: 3}],
            j: {type: 54, g: 2},
            m: fs
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "id",
            l: [{type: 1, g: 2}],
            j: {type: 54, g: 2},
            m: function (e, t, n, r) {
                return fs(e, t, 0, r, se.s(e.O))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "idref",
            l: [{type: 1, g: 2}, {type: 53, g: 3}],
            j: {type: 53, g: 2},
            m: ds
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "idref",
            l: [{type: 1, g: 2}],
            j: {type: 53, g: 2},
            m: function (e, t, n, r) {
                return ds(e, t, 0, r, se.s(e.O))
            }
        }], [{
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "parse-json",
            l: [{type: 1, g: 3}],
            j: {type: 59, g: 0},
            m: function (e, t, n, r) {
                try {
                    var a = JSON.parse(r.first().value)
                } catch (e) {
                    throw Error("FOJS0001: parsed JSON string contains illegal JSON.")
                }
                return function e(t) {
                    switch (typeof t) {
                        case"object":
                            return Array.isArray(t) ? se.s(new He(t.map((function (t) {
                                return ue(e(t))
                            })))) : null === t ? se.empty() : se.s(new Ye(Object.keys(t).map((function (n) {
                                return {key: q(n, 1), value: ue(e(t[n]))}
                            }))));
                        case"number":
                            return se.s(q(t, 3));
                        case"string":
                            return se.s(q(t, 1));
                        case"boolean":
                            return t ? se.$() : se.U();
                        default:
                            throw Error("Unexpected type in JSON parse")
                    }
                }(a)
            }
        }], [{
            namespaceURI: "http://www.w3.org/2005/xpath-functions/map",
            localName: "contains",
            l: [{type: 61, g: 3}, {type: 46, g: 3}],
            j: {type: 0, g: 3},
            m: function (e, t, n, r, a) {
                return _e([r, a], (function (e) {
                    var t = (e = u(e)).next().value, n = e.next().value;
                    return t.h.some((function (e) {
                        return Le(e.key, n)
                    })) ? se.$() : se.U()
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/map",
            localName: "entry",
            l: [{type: 46, g: 3}, {type: 59, g: 2}],
            j: {type: 61, g: 3},
            m: function (e, t, n, r, a) {
                return r.map((function (e) {
                    return new Ye([{key: e, value: ue(a)}])
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/map",
            localName: "for-each",
            l: [{type: 61, g: 3}, {type: 59, g: 2}],
            j: {type: 59, g: 2},
            m: function (e, t, n, r, a) {
                return _e([r, a], (function (r) {
                    var a = (r = u(r)).next().value, i = r.next().value;
                    return Bt(a.h.map((function (r) {
                        return i.value.call(void 0, e, t, n, se.s(r.key), r.value())
                    })))
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/map",
            localName: "get",
            l: [{type: 61, g: 3}, {type: 46, g: 3}],
            j: {type: 59, g: 2},
            m: ke
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/map",
            localName: "keys",
            l: [{type: 61, g: 3}],
            j: {type: 46, g: 2},
            m: function (e, t, n, r) {
                return _e([r], (function (e) {
                    return e = u(e).next().value, se.create(e.h.map((function (e) {
                        return e.key
                    })))
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/map",
            localName: "merge",
            l: [{type: 61, g: 2}, {type: 61, g: 3}],
            j: {type: 61, g: 3},
            m: ms
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/map",
            localName: "merge",
            l: [{type: 61, g: 2}],
            j: {type: 61, g: 3},
            m: function (e, t, n, r) {
                return ms(e, 0, 0, r, se.s(new Ye([{
                    key: q("duplicates", 1), value: function () {
                        return se.s(q("use-first", 1))
                    }
                }])))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/map",
            localName: "put",
            l: [{type: 61, g: 3}, {type: 46, g: 3}, {type: 59, g: 2}],
            j: {type: 61, g: 3},
            m: function (e, t, n, r, a, i) {
                return _e([r, a], (function (e) {
                    var t = (e = u(e)).next().value, n = e.next().value;
                    return e = t.h.concat(), 0 <= (t = e.findIndex((function (e) {
                        return Le(e.key, n)
                    }))) ? e.splice(t, 1, {key: n, value: ue(i)}) : e.push({key: n, value: ue(i)}), se.s(new Ye(e))
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/map",
            localName: "remove",
            l: [{type: 61, g: 3}, {type: 46, g: 2}],
            j: {type: 61, g: 3},
            m: function (e, t, n, r, a) {
                return _e([r], (function (e) {
                    var t = u(e).next().value.h.concat();
                    return a.M((function (e) {
                        return e.forEach((function (e) {
                            var n = t.findIndex((function (t) {
                                return Le(t.key, e)
                            }));
                            0 <= n && t.splice(n, 1)
                        })), se.s(new Ye(t))
                    }))
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/map",
            localName: "size",
            l: [{type: 61, g: 3}],
            j: {type: 5, g: 3},
            m: function (e, t, n, r) {
                return r.map((function (e) {
                    return q(e.h.length, 5)
                }))
            }
        }], [{
            namespaceURI: "http://www.w3.org/2005/xpath-functions/math",
            localName: "pi",
            l: [],
            j: {type: 3, g: 3},
            m: function () {
                return se.s(q(Math.PI, 3))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/math",
            localName: "exp",
            l: [{type: 3, g: 0}],
            j: {type: 3, g: 0},
            m: function (e, t, n, r) {
                return r.map((function (e) {
                    return q(Math.pow(Math.E, e.value), 3)
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/math",
            localName: "exp10",
            l: [{type: 3, g: 0}],
            j: {type: 3, g: 0},
            m: function (e, t, n, r) {
                return r.map((function (e) {
                    return q(Math.pow(10, e.value), 3)
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/math",
            localName: "log",
            l: [{type: 3, g: 0}],
            j: {type: 3, g: 0},
            m: function (e, t, n, r) {
                return r.map((function (e) {
                    return q(Math.log(e.value), 3)
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/math",
            localName: "log10",
            l: [{type: 3, g: 0}],
            j: {type: 3, g: 0},
            m: function (e, t, n, r) {
                return r.map((function (e) {
                    return q(Math.log10(e.value), 3)
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/math",
            localName: "pow",
            l: [{type: 3, g: 0}, {type: 2, g: 3}],
            j: {type: 3, g: 0},
            m: function (e, t, n, r, a) {
                return a.M((function (e) {
                    var t = u(e).next().value;
                    return r.map((function (e) {
                        return 1 !== Math.abs(e.value) || Number.isFinite(t.value) ? q(Math.pow(e.value, t.value), 3) : q(1, 3)
                    }))
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/math",
            localName: "sqrt",
            l: [{type: 3, g: 0}],
            j: {type: 3, g: 0},
            m: function (e, t, n, r) {
                return r.map((function (e) {
                    return q(Math.sqrt(e.value), 3)
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/math",
            localName: "sin",
            l: [{type: 3, g: 0}],
            j: {type: 3, g: 0},
            m: function (e, t, n, r) {
                return r.map((function (e) {
                    return q(Math.sin(e.value), 3)
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/math",
            localName: "cos",
            l: [{type: 3, g: 0}],
            j: {type: 3, g: 0},
            m: function (e, t, n, r) {
                return r.map((function (e) {
                    return q(Math.cos(e.value), 3)
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/math",
            localName: "tan",
            l: [{type: 3, g: 0}],
            j: {type: 3, g: 0},
            m: function (e, t, n, r) {
                return r.map((function (e) {
                    return q(Math.tan(e.value), 3)
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/math",
            localName: "asin",
            l: [{type: 3, g: 0}],
            j: {type: 3, g: 0},
            m: function (e, t, n, r) {
                return r.map((function (e) {
                    return q(Math.asin(e.value), 3)
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/math",
            localName: "acos",
            l: [{type: 3, g: 0}],
            j: {type: 3, g: 0},
            m: function (e, t, n, r) {
                return r.map((function (e) {
                    return q(Math.acos(e.value), 3)
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/math",
            localName: "atan",
            l: [{type: 3, g: 0}],
            j: {type: 3, g: 0},
            m: function (e, t, n, r) {
                return r.map((function (e) {
                    return q(Math.atan(e.value), 3)
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions/math",
            localName: "atan2",
            l: [{type: 3, g: 0}, {type: 3, g: 3}],
            j: {type: 3, g: 0},
            m: function (e, t, n, r, a) {
                return a.M((function (e) {
                    var t = u(e).next().value;
                    return r.map((function (e) {
                        return q(Math.atan2(e.value, t.value), 3)
                    }))
                }))
            }
        }], Gn, pn, [{
            namespaceURI: "http://fontoxpath/operators",
            localName: "to",
            l: [{type: 5, g: 0}, {type: 5, g: 0}],
            j: {type: 5, g: 2},
            m: function (e, t, n, r, a) {
                if (e = r.first(), a = a.first(), null === e || null === a) return se.empty();
                var i = e.value;
                return a = a.value, i > a ? se.empty() : se.create({
                    next: function () {
                        return Z(q(i++, 5))
                    }
                }, a - i + 1)
            }
        }], [{
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "QName",
            l: [{type: 1, g: 0}, {type: 1, g: 3}],
            j: {type: 23, g: 3},
            m: function (e, t, n, r, a) {
                return _e([r, a], (function (e) {
                    var t = u(e);
                    if (e = t.next().value, !Gt(t = t.next().value.value, 23)) throw Error("FOCA0002: The provided QName is invalid.");
                    if (null === (e = e && e.value || null) && t.includes(":")) throw Error("FOCA0002: The URI of a QName may not be empty if a prefix is provided.");
                    if (r.F()) return se.s(q(new ve("", null, t), 23));
                    if (!t.includes(":")) return se.s(q(new ve("", e, t), 23));
                    var n = u(t.split(":"));
                    return t = n.next().value, n = n.next().value, se.s(q(new ve(t, e, n), 23))
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "prefix-from-QName",
            l: [{type: 23, g: 0}],
            j: {type: 24, g: 0},
            m: function (e, t, n, r) {
                return _e([r], (function (e) {
                    return null === (e = u(e).next().value) ? se.empty() : (e = e.value).prefix ? se.s(q(e.prefix, 24)) : se.empty()
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "local-name-from-QName",
            l: [{type: 23, g: 0}],
            j: {type: 24, g: 0},
            m: function (e, t, n, r) {
                return r.map((function (e) {
                    return q(e.value.localName, 24)
                }))
            }
        }, {
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            localName: "namespace-uri-from-QName",
            l: [{type: 23, g: 0}],
            j: {type: 20, g: 0},
            m: function (e, t, n, r) {
                return r.map((function (e) {
                    return q(e.value.namespaceURI || "", 20)
                }))
            }
        }], [{
            l: [{type: 59, g: 2}], m: function (e, t, n, r) {
                return r.aa({
                    empty: function () {
                        return se.$()
                    }, multiple: function () {
                        return se.U()
                    }, s: function () {
                        return se.U()
                    }
                })
            }, localName: "empty", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 0, g: 3}
        }, {
            l: [{type: 59, g: 2}], m: function (e, t, n, r) {
                return r.aa({
                    empty: function () {
                        return se.U()
                    }, multiple: function () {
                        return se.$()
                    }, s: function () {
                        return se.$()
                    }
                })
            }, localName: "exists", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 0, g: 3}
        }, {
            l: [{type: 59, g: 2}], m: function (e, t, n, r) {
                return vs(r, 1, 1)
            }, localName: "head", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 59, g: 0}
        }, {
            l: [{type: 59, g: 2}], m: function (e, t, n, r) {
                return vs(r, 2, null)
            }, localName: "tail", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 59, g: 2}
        }, {
            l: [{type: 59, g: 2}, {type: 5, g: 3}, {type: 59, g: 2}], m: function (e, t, n, r, a, i) {
                return r.F() ? i : i.F() ? r : (e = r.S(), 0 > (a = a.first().value - 1) ? a = 0 : a > e.length && (a = e.length), t = e.slice(a), se.create(e.slice(0, a).concat(i.S(), t)))
            }, localName: "insert-before", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 59, g: 2}
        }, {
            l: [{type: 59, g: 2}, {type: 5, g: 3}], m: function (e, t, n, r, a) {
                return e = a.first().value, !(r = r.S()).length || 1 > e || e > r.length || r.splice(e - 1, 1), se.create(r)
            }, localName: "remove", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 59, g: 2}
        }, {
            l: [{type: 59, g: 2}], m: function (e, t, n, r) {
                return r.M((function (e) {
                    return se.create(e.reverse())
                }))
            }, localName: "reverse", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 59, g: 2}
        }, {
            l: [{type: 59, g: 2}, {type: 3, g: 3}], m: function (e, t, n, r, a) {
                return ws(0, 0, 0, r, a, se.empty())
            }, localName: "subsequence", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 59, g: 2}
        }, {
            l: [{type: 59, g: 2}, {type: 3, g: 3}, {type: 3, g: 3}],
            m: ws,
            localName: "subsequence",
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            j: {type: 59, g: 2}
        }, {
            l: [{type: 59, g: 2}], m: function (e, t, n, r) {
                return r
            }, localName: "unordered", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 59, g: 2}
        }, {
            l: [{type: 46, g: 2}, {type: 46, g: 3}], m: function (e, t, n, r, a) {
                return a.M((function (n) {
                    var a = u(n).next().value;
                    return St(r, t).map((function (t, n) {
                        return La("eqOp", t.type, a.type)(t, a, e) ? q(n + 1, 5) : q(-1, 5)
                    })).filter((function (e) {
                        return -1 !== e.value
                    }))
                }))
            }, localName: "index-of", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 5, g: 2}
        }, {
            l: [{type: 46, g: 2}, {type: 46, g: 3}, {type: 1, g: 3}], m: function () {
                throw Error("FOCH0002: No collations are supported")
            }, localName: "index-of", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 5, g: 2}
        }, {
            l: [{type: 59, g: 2}, {type: 59, g: 2}], m: function (e, t, n, r, a) {
                var i = !1, o = jn(e, t, n, r, a);
                return se.create({
                    next: function () {
                        if (i) return z;
                        var e = o.next(0);
                        return e.done ? e : (i = !0, Z(q(e.value, 0)))
                    }
                })
            }, localName: "deep-equal", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 0, g: 3}
        }, {
            l: [{type: 59, g: 2}, {type: 59, g: 2}, {type: 1, g: 3}], m: function () {
                throw Error("FOCH0002: No collations are supported")
            }, localName: "deep-equal", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 0, g: 3}
        }, {
            l: [{type: 59, g: 2}], m: function (e, t, n, r) {
                var a = !1;
                return se.create({
                    next: function () {
                        if (a) return z;
                        var e = r.ya();
                        return a = !0, Z(q(e, 5))
                    }
                })
            }, localName: "count", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 5, g: 3}
        }, {
            l: [{type: 46, g: 2}], m: function (e, t, n, r) {
                if (r.F()) return r;
                if (!(e = si(e = gs(r.S())))) throw Error("FORG0006: Incompatible types to be converted to a common type");
                if (!e.every((function (e) {
                    return W(e.type, 2)
                }))) throw Error("FORG0006: items passed to fn:avg are not all numeric.");
                return t = e.reduce((function (e, t) {
                    return e + t.value
                }), 0) / e.length, e.every((function (e) {
                    return W(e.type, 5) || W(e.type, 3)
                })) ? se.s(q(t, 3)) : e.every((function (e) {
                    return W(e.type, 4)
                })) ? se.s(q(t, 4)) : se.s(q(t, 6))
            }, localName: "avg", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 46, g: 0}
        }, {
            l: [{type: 46, g: 2}], m: function (e, t, n, r) {
                return r.F() ? r : (e = ys(r.S()), se.s(e.reduce((function (e, t) {
                    return e.value < t.value ? t : e
                }))))
            }, localName: "max", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 46, g: 0}
        }, {
            l: [{type: 46, g: 2}, {type: 1, g: 3}], m: function () {
                throw Error("FOCH0002: No collations are supported")
            }, localName: "max", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 46, g: 0}
        }, {
            l: [{type: 46, g: 2}], m: function (e, t, n, r) {
                return r.F() ? r : (e = ys(r.S()), se.s(e.reduce((function (e, t) {
                    return e.value > t.value ? t : e
                }))))
            }, localName: "min", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 46, g: 0}
        }, {
            l: [{type: 46, g: 2}, {type: 1, g: 3}], m: function () {
                throw Error("FOCH0002: No collations are supported")
            }, localName: "min", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 46, g: 0}
        }, {
            l: [{type: 46, g: 2}], m: function (e, t, n, r) {
                return As(e, t, 0, r, se.s(q(0, 5)))
            }, localName: "sum", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 46, g: 3}
        }, {
            l: [{type: 46, g: 2}, {type: 46, g: 0}],
            m: As,
            localName: "sum",
            namespaceURI: "http://www.w3.org/2005/xpath-functions",
            j: {type: 46, g: 0}
        }, {
            l: [{type: 59, g: 2}], m: function (e, t, n, r) {
                if (!r.F() && !r.za()) throw Error("FORG0003: The argument passed to fn:zero-or-one contained more than one item.");
                return r
            }, localName: "zero-or-one", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 59, g: 0}
        }, {
            l: [{type: 59, g: 2}], m: function (e, t, n, r) {
                if (r.F()) throw Error("FORG0004: The argument passed to fn:one-or-more was empty.");
                return r
            }, localName: "one-or-more", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 59, g: 1}
        }, {
            l: [{type: 59, g: 2}], m: function (e, t, n, r) {
                if (!r.za()) throw Error("FORG0005: The argument passed to fn:exactly-one is empty or contained more than one item.");
                return r
            }, localName: "exactly-one", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 59, g: 3}
        }, {
            l: [{type: 59, g: 2}, {type: 60, g: 3}], m: function (e, t, n, r, a) {
                if (r.F()) return r;
                var i = a.first(), o = i.o;
                if (1 !== o.length) throw Error("XPTY0004: signature of function passed to fn:filter is incompatible.");
                return r.filter((function (r) {
                    if (r = sn(o[0], se.s(r), t, "fn:filter", !1), !(r = i.value.call(void 0, e, t, n, r)).za() || !W(r.first().type, 0)) throw Error("XPTY0004: signature of function passed to fn:filter is incompatible.");
                    return r.first().value
                }))
            }, localName: "filter", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 59, g: 2}
        }, {
            l: [{type: 59, g: 2}, {type: 60, g: 3}], m: function (e, t, n, r, a) {
                if (r.F()) return r;
                var i = a.first(), o = i.o;
                if (1 !== o.length) throw Error("XPTY0004: signature of function passed to fn:for-each is incompatible.");
                var s, u = r.value;
                return se.create({
                    next: function (r) {
                        for (; ;) {
                            if (!s) {
                                var a = u.next(0);
                                if (a.done) return a;
                                a = sn(o[0], se.s(a.value), t, "fn:for-each", !1), s = i.value.call(void 0, e, t, n, a).value
                            }
                            if (!(a = s.next(r)).done) return a;
                            s = null
                        }
                    }
                })
            }, localName: "for-each", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 59, g: 2}
        }, {
            l: [{type: 59, g: 2}, {type: 59, g: 2}, {type: 60, g: 3}], m: function (e, t, n, r, a, i) {
                if (r.F()) return r;
                var o = i.first(), s = o.o;
                if (2 !== s.length) throw Error("XPTY0004: signature of function passed to fn:fold-left is incompatible.");
                return r.M((function (r) {
                    return r.reduce((function (r, a) {
                        return r = sn(s[0], r, t, "fn:fold-left", !1), a = sn(s[1], se.s(a), t, "fn:fold-left", !1), o.value.call(void 0, e, t, n, r, a)
                    }), a)
                }))
            }, localName: "fold-left", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 59, g: 2}
        }, {
            l: [{type: 59, g: 2}, {type: 59, g: 2}, {type: 60, g: 3}], m: function (e, t, n, r, a, i) {
                if (r.F()) return r;
                var o = i.first(), s = o.o;
                if (2 !== s.length) throw Error("XPTY0004: signature of function passed to fn:fold-right is incompatible.");
                return r.M((function (r) {
                    return r.reduceRight((function (r, a) {
                        return r = sn(s[0], r, t, "fn:fold-right", !1), a = sn(s[1], se.s(a), t, "fn:fold-right", !1), o.value.call(void 0, e, t, n, a, r)
                    }), a)
                }))
            }, localName: "fold-right", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 59, g: 2}
        }], bn, [{
            l: [{type: 1, g: 3}, {type: 61, g: 3}], m: function (e, t, n, r, a) {
                var i, o;
                return se.create({
                    next: function () {
                        if (!i) {
                            o = r.value.next(0).value.value;
                            var e = a.first().h.reduce((function (e, t) {
                                return e[t.key.value] = ue(t.value()), e
                            }), Object.create(null)), s = e["."] ? e["."]() : se.empty();
                            delete e["."];
                            var u = new hs((function (e) {
                                return n.ga(e)
                            }), Object.keys(e).reduce((function (e, t) {
                                return e[t] = t, e
                            }), {}), (function (e, t) {
                                return n.Qa(e, t)
                            })), l = new Fo(u), c = Go(o, {ca: !1, debug: t.debug});
                            t.Ta && Zo(c, new os(l));
                            var h = kr(c, ["mainModule", "prolog"]);
                            h && Qo(h, l), c = To(c = kr(c, ["mainModule", "queryBody", "*"]), {qa: !1, ca: !0});
                            try {
                                c.P(l)
                            } catch (e) {
                                jr(o, e)
                            }
                            l = Object.keys(e).reduce((function (t, n) {
                                return t[u.rb(null, n)] = e[n], t
                            }), Object.create(null)), s = new gt(s = s.F() ? {
                                O: null,
                                Ga: -1,
                                wa: s,
                                ta: l
                            } : {O: s.first(), Ga: 0, wa: s, ta: l});
                            try {
                                i = c.evaluate(s, t).value
                            } catch (e) {
                                jr(o, e)
                            }
                        }
                        try {
                            return i.next(0)
                        } catch (e) {
                            jr(o, e)
                        }
                    }
                })
            }, localName: "evaluate", namespaceURI: "http://fontoxml.com/fontoxpath", j: {type: 59, g: 2}
        }, {
            l: [], m: function () {
                return se.s(q("3.20.4", 1))
            }, localName: "version", namespaceURI: "http://fontoxml.com/fontoxpath", j: {type: 1, g: 3}
        }], [{
            l: [{type: 23, g: 3}, {type: 5, g: 3}], m: function (e, t, n, r, a) {
                return _e([r, a], (function (e) {
                    var t = u(e);
                    e = t.next().value, t = t.next().value;
                    var r = n.Aa(e.value.namespaceURI, e.value.localName, t.value);
                    return null === r ? se.empty() : (e = new ge({
                        l: r.l,
                        arity: t.value,
                        localName: e.value.localName,
                        namespaceURI: e.value.namespaceURI,
                        j: r.j,
                        value: r.m
                    }), se.s(e))
                }))
            }, localName: "function-lookup", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {g: 0, type: 60}
        }, {
            l: [{type: 60, g: 3}], m: function (e, t, n, r) {
                return _e([r], (function (e) {
                    return (e = u(e).next().value).Oa() ? se.empty() : se.s(q(new ve("", e.v, e.J), 23))
                }))
            }, localName: "function-name", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 23, g: 0}
        }, {
            l: [{type: 60, g: 3}], m: function (e, t, n, r) {
                return _e([r], (function (e) {
                    return e = u(e).next().value, se.s(q(e.B, 5))
                }))
            }, localName: "function-arity", namespaceURI: "http://www.w3.org/2005/xpath-functions", j: {type: 5, g: 3}
        }]);

        function bs(e) {
            this.h = e
        }

        (n = bs.prototype).createAttributeNS = function (e, t) {
            return this.h.createAttributeNS(e, t)
        }, n.createCDATASection = function (e) {
            return this.h.createCDATASection(e)
        }, n.createComment = function (e) {
            return this.h.createComment(e)
        }, n.createDocument = function () {
            return this.h.createDocument()
        }, n.createElementNS = function (e, t) {
            return this.h.createElementNS(e, t)
        }, n.createProcessingInstruction = function (e, t) {
            return this.h.createProcessingInstruction(e, t)
        }, n.createTextNode = function (e) {
            return this.h.createTextNode(e)
        };
        var Es = Object.create(null), Bs = Object.create(null);

        function Ns(e, t, n, r, a, i) {
            this.J = e, this.v = t, this.h = n, this.B = r, this.o = a, this.C = i
        }

        function Cs(e, t) {
            return e + (t ? "_DEBUG" : "")
        }

        function Ts(e, t, n) {
            return t = Cs(t, n), (n = Bs[e]) ? n[t] || null : (e = Es[e]) && (e = e[t]) && 0 !== e.length ? e[0].h : null
        }

        function Is(e, t, n, r, a, i, o) {
            !function (e, t, n, r) {
                t = Cs(t, n), (e = Bs[e]) && (n = e[t]) && n === r && delete e[t]
            }(e, t, i, a);
            var s = Es[e];
            s || (s = Es[e] = Object.create(null)), (t = s[e = Cs(t, i)]) || (t = s[e] = []), t.push(new Ns(Object.values(n.h), Object.values(n.o), a, Object.keys(r).map((function (e) {
                return {namespaceURI: r[e], prefix: e}
            })), o, n.B))
        }

        function Os(e, t, n, r, a, i, o) {
            var s = t.ca ? "XQuery" : "XPath", u = t.ob ? null : function (e, t, n, r, a, i, o, s) {
                var u = Es[e];
                return u ? (u = u[t = Cs(t, i)]) && (u = u.find((function (e) {
                    return e.o === o && e.J.every((function (e) {
                        return n(e.prefix) === e.namespaceURI
                    })) && e.v.every((function (e) {
                        return void 0 !== r[e.name]
                    })) && e.B.every((function (e) {
                        return a[e.prefix] === e.namespaceURI
                    })) && e.C.every((function (e) {
                        var t = s(e.oc, e.arity);
                        return t && t.namespaceURI === e.Jb.namespaceURI && t.localName === e.Jb.localName
                    }))
                }))) ? {ia: u.h, sb: !1} : (e = Bs[e] && Bs[e][t]) ? {ia: e, sb: !0} : null : (e = Ts(e, t, i)) ? {
                    ia: e,
                    sb: !0
                } : null
            }(e, s, n, r, a, t.debug, i, o), l = new Fo(n = new hs(n, r, o));
            if (null !== u) r = u.ia; else {
                if (r = Go(e, t), o = new os(l), t.Ta && Wo(r, o), !(o = Xr(r, "mainModule"))) throw Error("Can not execute a library module.");
                if (r = Xr(o, "prolog"), o = kr(o, ["queryBody", "*"]), r) {
                    if (!t.ca) throw Error("XPST0003: Use of XQuery functionality is not allowed in XPath context");
                    Qo(r, l)
                }
                r = Eo(o, t)
            }
            return (null === u || u.sb) && (Object.keys(a).forEach((function (e) {
                var t = a[e];
                qo(l, t), l.o[l.h][e] = t
            })), r.P(l), t.ob || Is(e, s, n, a, r, t.debug, i)), {ia: r, ma: l}
        }

        var Ss = Symbol("IS_XPATH_VALUE_SYMBOL");

        function Rs(e) {
            return e && "object" == typeof e && "lookupNamespaceURI" in e ? function (t) {
                return e.lookupNamespaceURI(t || null)
            } : function () {
                return null
            }
        }

        function Ds(e) {
            return e.replace(/(\x0D\x0A)|(\x0D(?!\x0A))/g, String.fromCharCode(10))
        }

        function Gs(e) {
            return function (t) {
                var n = t.localName;
                return t.prefix ? null : {namespaceURI: e, localName: n}
            }
        }

        function Ms(e, t, n, r, a, i) {
            var o, s, l, c, h, p;
            null == r && (r = r || {}), a ? (o = a.logger || {trace: console.log.bind(console)}, s = a.documentWriter, l = a.moduleImports, c = a.namespaceResolver, h = a.functionNameResolver, p = a.nodesFactory) : (o = {trace: console.log.bind(console)}, l = {}, c = null, p = null, s = null, h = void 0);
            var f = new Te(null === n ? new xe : n);
            e = Ds(e), n = l || Object.create(null), l = a.defaultFunctionNamespaceURI || "http://www.w3.org/2005/xpath-functions";
            var d = Os(e, i, c || Rs(t), r, n, l, h || Gs(l));
            for (e = t ? vt(0, t) : se.empty(), t = !p && i.ca ? new nr(t) : new bs(p), s = s ? new Be(s) : Ee, p = Object.keys(r).reduce((function (e, t) {
                var n = r[t];
                return e["Q{}" + t + "[0]"] = n && "object" == typeof n && Ss in n ? function () {
                    return se.create(n.Eb)
                } : function () {
                    return vt(0, r[t])
                }, e
            }), Object.create(null)), c = {}, n = (h = u(Object.keys(d.ma.Da))).next(); !n.done; c = {Wa: c.Wa}, n = h.next()) c.Wa = n.value, p[c.Wa] || (p[c.Wa] = function (e) {
                return function () {
                    return (0, d.ma.Da[e.Wa])(m, v)
                }
            }(c));
            var m = new gt({O: e.first(), Ga: 0, wa: e, ta: p}), v = new Et(i.debug, f, t, s, a.currentContext, o);
            return {zb: m, Ab: v, ia: d.ia}
        }

        function Us(e, t) {
            var n = {}, r = 0, a = !1, i = null;
            return {
                next: function () {
                    if (a) return z;
                    for (var o = {}; r < e.h.length;) {
                        e:{
                            var s = e.h[r].key.value;
                            if (!i) {
                                o.kb = e.h[r];
                                var u = o.kb.value().aa({
                                    default: function (e) {
                                        return e
                                    }, multiple: function (e) {
                                        return function () {
                                            throw Error("Serialization error: The value of an entry in a map is expected to be a single item or an empty sequence. Use arrays when putting multiple values in a map. The value of the key " + e.kb.key.value + " holds multiple items")
                                        }
                                    }(o)
                                }).first();
                                if (null === u) {
                                    n[s] = null, r++;
                                    break e
                                }
                                i = Ps(u, t)
                            }
                            u = i.next(0), i = null, n[s] = u.value, r++
                        }
                        o = {kb: o.kb}
                    }
                    return a = !0, Z(n)
                }
            }
        }

        function Fs(e, t) {
            var n = [], r = 0, a = !1, i = null;
            return {
                next: function () {
                    if (a) return z;
                    for (; r < e.R.length;) {
                        if (!i) {
                            var o = e.R[r]().aa({
                                default: function (e) {
                                    return e
                                }, multiple: function () {
                                    throw Error("Serialization error: The value of an entry in an array is expected to be a single item or an empty sequence. Use nested arrays when putting multiple values in an array.")
                                }
                            }).first();
                            if (null === o) {
                                n[r++] = null;
                                continue
                            }
                            i = Ps(o, t)
                        }
                        o = i.next(0), i = null, n[r++] = o.value
                    }
                    return a = !0, Z(n)
                }
            }
        }

        function Ps(e, t) {
            if (W(e.type, 61)) return Us(e, t);
            if (W(e.type, 62)) return Fs(e, t);
            if (W(e.type, 23)) {
                var n = e.value;
                return {
                    next: function () {
                        return Z("Q{" + (n.namespaceURI || "") + "}" + n.localName)
                    }
                }
            }
            switch (e.type) {
                case 7:
                case 8:
                case 9:
                case 11:
                case 12:
                case 13:
                case 14:
                case 15:
                    var r = e.value;
                    return {
                        next: function () {
                            return Z(ot(r))
                        }
                    };
                case 47:
                case 53:
                case 54:
                case 55:
                case 56:
                case 57:
                case 58:
                    var a = e.value;
                    return {
                        next: function () {
                            return Z(Mi(a, t, !1))
                        }
                    };
                default:
                    return {
                        next: function () {
                            return Z(e.value)
                        }
                    }
            }
        }

        xs.forEach((function (e) {
            ba(e.namespaceURI, e.localName, e.l, e.j, e.m)
        }));
        var Hs = {
            ANY: 0,
            NUMBER: 1,
            STRING: 2,
            BOOLEAN: 3,
            NODES: 7,
            FIRST_NODE: 9,
            STRINGS: 10,
            MAP: 11,
            ARRAY: 12,
            NUMBERS: 13,
            ASYNC_ITERATOR: 99
        };

        function js(e, t, n, r) {
            switch (n) {
                case 3:
                    return t.getEffectiveBooleanValue();
                case 2:
                    return (t = St(t, r).S()).length ? t.map((function (e) {
                        return Jt(e, 1).value
                    })).join(" ") : "";
                case 10:
                    return (t = St(t, r).S()).length ? t.map((function (e) {
                        return e.value + ""
                    })) : [];
                case 1:
                    return null !== (t = t.first()) && W(t.type, 2) ? t.value : NaN;
                case 9:
                    if (null === (t = t.first())) return null;
                    if (!W(t.type, 53)) throw Error("Expected XPath " + e + " to resolve to Node. Got " + t.type);
                    return Mi(t.value, r, !1);
                case 7:
                    if (!(t = t.S()).every((function (e) {
                        return W(e.type, 53)
                    }))) throw Error("Expected XPath " + e + " to resolve to a sequence of Nodes.");
                    return t.map((function (e) {
                        return Mi(e.value, r, !1)
                    }));
                case 11:
                    if (1 !== (t = t.S()).length) throw Error("Expected XPath " + e + " to resolve to a single map.");
                    if (!W((t = t[0]).type, 61)) throw Error("Expected XPath " + e + " to resolve to a map");
                    return Us(t, r).next(0).value;
                case 12:
                    if (1 !== (t = t.S()).length) throw Error("Expected XPath " + e + " to resolve to a single array.");
                    if (!W((t = t[0]).type, 62)) throw Error("Expected XPath " + e + " to resolve to an array");
                    return Fs(t, r).next(0).value;
                case 13:
                    return t.S().map((function (t) {
                        if (!W(t.type, 2)) throw Error("Expected XPath " + e + " to resolve to numbers");
                        return t.value
                    }));
                case 99:
                    var a = t.value, i = null, o = !1, s = function () {
                        for (; !o;) {
                            if (!i) {
                                var e = a.next(0);
                                if (e.done) {
                                    o = !0;
                                    break
                                }
                                i = Ps(e.value, r)
                            }
                            return e = i.next(0), i = null, e
                        }
                        return Promise.resolve({done: !0, value: null})
                    };
                    return "asyncIterator" in Symbol ? ((t = {})[Symbol.asyncIterator] = function () {
                        return this
                    }, t.next = function () {
                        return new Promise((function (e) {
                            return e(s())
                        })).catch((function (t) {
                            jr(e, t)
                        }))
                    }, t = t) : t = {
                        next: function () {
                            return new Promise((function (e) {
                                return e(s())
                            }))
                        }
                    }, t;
                default:
                    return (t = t.S()).every((function (e) {
                        return W(e.type, 53) && !W(e.type, 47)
                    })) ? 1 === (t = t.map((function (e) {
                        return Mi(e.value, r, !1)
                    }))).length ? t[0] : t : 1 === t.length ? W((t = t[0]).type, 62) ? Fs(t, r).next(0).value : W(t.type, 61) ? Us(t, r).next(0).value : Ot(t, r).first().value : St(se.create(t), r).S().map((function (e) {
                        return e.value
                    }))
            }
        }

        Hs[Hs.ANY] = "ANY", Hs[Hs.NUMBER] = "NUMBER", Hs[Hs.STRING] = "STRING", Hs[Hs.BOOLEAN] = "BOOLEAN", Hs[Hs.NODES] = "NODES", Hs[Hs.FIRST_NODE] = "FIRST_NODE", Hs[Hs.STRINGS] = "STRINGS", Hs[Hs.MAP] = "MAP", Hs[Hs.ARRAY] = "ARRAY", Hs[Hs.NUMBERS] = "NUMBERS", Hs[Hs.ASYNC_ITERATOR] = "ASYNC_ITERATOR";
        var Xs = !1, _s = null, Ls = {
            getPerformanceSummary: function () {
                var e = _s.getEntriesByType("measure").filter((function (e) {
                    return e.name.startsWith("XPath: ")
                }));
                return Array.from(e.reduce((function (e, t) {
                    var n = t.name.substring(7);
                    return e.has(n) ? ((n = e.get(n)).times += 1, n.totalDuration += t.duration) : e.set(n, {
                        xpath: n,
                        times: 1,
                        totalDuration: t.duration,
                        average: 0
                    }), e
                }), new Map).values()).map((function (e) {
                    return e.average = e.totalDuration / e.times, e
                })).sort((function (e, t) {
                    return t.totalDuration - e.totalDuration
                }))
            }, setPerformanceImplementation: function (e) {
                _s = e
            }, startProfiling: function () {
                if (null === _s) throw Error("Performance API object must be set using `profiler.setPerformanceImplementation` before starting to profile");
                _s.clearMarks(), _s.clearMeasures(), Xs = !0
            }, stopProfiling: function () {
                Xs = !1
            }
        }, ks = 0;

        function Ys(e, t, n, r, a, i) {
            if (a = a || 0, !e || "string" != typeof e) throw new TypeError("Failed to execute 'evaluateXPath': xpathExpression must be a string.");
            i = i || {};
            try {
                var o = Ms(e, t, n || null, r || {}, i, {
                    qa: "XQueryUpdate3.1" === i.language,
                    ca: "XQuery3.1" === i.language || "XQueryUpdate3.1" === i.language,
                    debug: !!i.debug,
                    ob: !!i.disableCache,
                    Ta: !!i.annotateAst
                }), s = o.zb, u = o.Ab, l = o.ia
            } catch (t) {
                jr(e, t)
            }
            if (l.I) throw Error("XUST0001: Updating expressions should be evaluated as updating expressions");
            if (3 === a && t && "nodeType" in t && (n = l.Y(), t = Ae(t), null !== n && !t.includes(n))) return !1;
            try {
                Xs && (_s.mark(e + (0 === ks ? "" : "@" + ks)), ks++);
                var c = js(e, er(l, s, u), a, u);
                return Xs && (a = e + (0 === --ks ? "" : "@" + ks), _s.measure("XPath: " + e, a), _s.clearMarks(a)), c
            } catch (t) {
                jr(e, t)
            }
        }

        Object.assign(Ys, {
            ANY_TYPE: 0,
            NUMBER_TYPE: 1,
            STRING_TYPE: 2,
            BOOLEAN_TYPE: 3,
            Zb: 7,
            Vb: 9,
            cc: 10,
            Xb: 11,
            Sb: 12,
            Tb: 99,
            $b: 13,
            hc: "XQueryUpdate3.1",
            vc: "XQuery3.1",
            uc: "XPath3.1"
        });
        var qs = {};

        function Vs(e, t, n, r, a) {
            return Ys(e, t, n, r, Ys.Tb, a)
        }

        function Qs(e, t, n, r) {
            var a = {};
            return a.pendingUpdateList = e.fa.map((function (e) {
                return e.h(r)
            })), a.xdmValue = js(t, se.create(e.H), n, r), a
        }

        function Js(e, t, n) {
            switch (t.type) {
                case 0:
                    return [e, {type: 0}];
                case 1:
                    return [e, {type: 1}];
                case 3:
                    return ["" + Js(e + "(" + (n || "contextItem") + ")", t.j, n)[0], t.j];
                case 4:
                    return [e, {type: 4}];
                case 5:
                    throw Error("Trying to get value of generated code with type None");
                default:
                    throw Error("Unreachable! Trying to get compiled value of unsupported GeneratedCodeType.")
            }
        }

        function Ks(e, t, n) {
            return {code: e, Ma: t, isAstAccepted: !0, Ea: n}
        }

        function zs(e) {
            return {isAstAccepted: !1, reason: e}
        }

        function Zs(e, t, n, r) {
            switch (r = void 0 === r ? "contextItem" : r, n.type) {
                case 0:
                case 1:
                    return Ks("!!" + e, {type: 0}, [t]);
                case 3:
                    return (e = Zs(e + "(" + r + ")", "", n.j, r)).isAstAccepted ? Ks("!!" + e.code, e.Ma, [t]) : e;
                case 4:
                    return Ks("(() => {\n\t\t\t\t\tconst result = " + e + ".next();\n\t\t\t\t\treturn result.done ? false : !!result.value; \n\t\t\t\t})()", {type: 0});
                case 5:
                    throw Error("Trying to get value of generated code with type None");
                default:
                    throw Error("Unreachable! Trying to get compiled value of unsupported GeneratedCodeType.")
            }
        }

        Object.assign(Ys, (qs.ANY_TYPE = 0, qs.NUMBER_TYPE = 1, qs.STRING_TYPE = 2, qs.BOOLEAN_TYPE = 3, qs.NODES_TYPE = 7, qs.FIRST_NODE_TYPE = 9, qs.STRINGS_TYPE = 10, qs.MAP_TYPE = 11, qs.ARRAY_TYPE = 12, qs.ASYNC_ITERATOR_TYPE = 99, qs.NUMBERS_TYPE = 13, qs.XQUERY_UPDATE_3_1_LANGUAGE = "XQueryUpdate3.1", qs.XQUERY_3_1_LANGUAGE = "XQuery3.1", qs.XPATH_3_1_LANGUAGE = "XPath3.1", qs));
        var Ws = {DONE_TOKEN: z, getEffectiveBooleanValue: te, isSubtypeOf: W, ready: Z},
            $s = {bc: "pathExpr", Rb: "andOp", ac: "orOp", dc: "stringConstantExpr"}, eu = Object.values($s);

        function tu(e, t, n, r, a) {
            return e = Xr(e, n), (e = Xr(e, eu)) ? (t += n, (r = r.Fb(e, t, r)).isAstAccepted ? 0 === a ? Zs(t, r.code, r.Ma) : Ks(t, r.Ma, [r.code]) : r) : zs("Unsupported: a base expression used with an operand.")
        }

        function nu(e, t, n) {
            return 4 === t && (e += ".next().value"), 47 === n && (e = "(function () { const attr = " + e + "; return attr ? domFacade.getData(attr) : null})()"), e
        }

        function ru(e, t, n, r, a) {
            var i = Lr(Xr(e, "firstOperand")[1], "type");
            if (e = Lr(Xr(e, "secondOperand")[1], "type"), !i || !e) return zs("Left or right type of compare are not found, annotation failed.");
            var o = [47, 1];
            if (!o.includes(i.type) || !o.includes(e.type)) return zs("Unsupported types in compare: [" + he[i.type] + ", " + he[e.type] + "]");
            if (!n.isAstAccepted) return n;
            if (!r.isAstAccepted) return r;
            if (!i || !e) return zs("Operands in compare weren't annotated");
            if (!(o = new Map([["eqOp", "==="], ["neOp", "!=="]])).has(t)) return zs(t + " not yet implemented");
            t = o.get(t), o = Js(n.code, n.Ma);
            var s = Js(r.code, r.Ma);
            return Ks("function " + a + "(contextItem) {\n\t\t\t\t" + n.Ea.join("\n") + "\n\t\t\t \t" + r.Ea.join("\n") + "\n\t \t     \treturn " + nu(o[0], o[1].type, i.type) + " " + t + " " + nu(s[0], s[1].type, e.type) + ";\n\t\t}", {
                type: 3,
                j: {type: 0}
            })
        }

        var au = {},
            iu = (au.equalOp = "eqOp", au.notEqualOp = "neOp", au.lessThanOrEqualOp = "leOp", au.lessThanOp = "ltOp", au.greaterThanOrEqualOp = "geOp", au.greaterThanOp = "gtOp", au);

        function ou(e) {
            return JSON.stringify(e).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029")
        }

        function su(e, t, n, r) {
            var a = tu(e, t, "firstOperand", n, 0);
            return a.isAstAccepted ? (e = tu(e, t, "secondOperand", n, 0)).isAstAccepted ? Ks("\n\tfunction " + t + "(contextItem) {\n\t\t" + a.Ea.join("\n") + "\n\t\t" + e.Ea.join("\n") + "\n\t\treturn " + a.code + " " + r + " " + e.code + ";\n\t}\n\t", {
                type: 3,
                j: {type: 0}
            }) : e : a
        }

        function uu(e) {
            for (var t = [], n = 0; n < arguments.length; ++n) t[n] = arguments[n];
            return t.filter((function (e) {
                return "" !== e
            })).join(" && ")
        }

        function lu(e, t, n, r, a, i) {
            var o = 1 !== n ? "i" + n + " = 0;" : "";
            return Ks("\n\t" + i + "\n\twhile (" + uu(a + n, "i" + n + " < " + a + n + ".length") + ") {\n\t\tconst contextItem" + n + " = " + a + n + "[i" + n + "];\n\t\tif (!(" + (e = uu("contextItem" + n, e, t)) + ")) {\n\t\t\ti" + n + "++;\n\t\t\tcontinue;\n\t\t}\n\t\t" + r + "\n\t}\n\t" + o + "\n\t", {type: 2}, ["let i" + n + " = 0;"])
        }

        function cu(e, t, n, r, a) {
            return Ks("\n\t\t" + a + "\n\t\tif (" + (e = uu("i" + n + " === 0", "contextItem" + n, e, t)) + ") {\n\t\t\t" + r + "\n\t\t}\n\t\t", {type: 2}, ["let i" + n + " = 0;"])
        }

        var hu = {ec: "textTest", Ub: "elementTest", Yb: "nameTest", fc: "Wildcard"}, pu = Object.values(hu);

        function fu(e, t, n) {
            var r = null === t.namespaceURI;
            if (null === t.namespaceURI && "*" !== t.prefix && (t.namespaceURI = n.ga(t.prefix || "") || null, !t.namespaceURI && t.prefix)) throw Error("XPST0081: The prefix " + t.prefix + " could not be resolved.");
            n = t.prefix;
            var a = t.namespaceURI;
            t = t.localName;
            var i = e + ".nodeType\n\t\t&& (" + e + ".nodeType === /*ELEMENT_NODE*/ 1\n\t\t|| " + e + ".nodeType === /*ATTRIBUTE_NODE*/ 2)";
            return Ks("*" === n ? "*" === t ? i : i + " && " + e + ".localName === " + ou(t) : (t = "*" !== t ? i + " && " + e + ".localName === " + ou(t) + " && " : "") + "(" + e + ".namespaceURI || null) === (" + (r = r && !n ? e + ".nodeType\n&& " + e + ".nodeType === /*ELEMENT_NODE*/ 1 ? " + ou(a) + " : null" : ou(a)) + " || null)", {type: 0})
        }

        function du(e, t, n) {
            var r = e[0];
            switch (r) {
                case hu.Ub:
                    return r = (e = Xr(e, "elementName")) && Xr(e, "star"), null === e || r ? t = Ks(t + ".nodeType === /*ELEMENT_NODE*/ 1", {type: 0}) : t = fu(t, e = qr(Xr(e, "QName")), n), t;
                case hu.ec:
                    return Ks(t + ".nodeType === /*TEXT_NODE*/ 3", {type: 0});
                case hu.Yb:
                    return fu(t, qr(e), n);
                case hu.fc:
                    return Xr(e, "star") ? (r = Xr(e, "uri")) ? t = fu(t, {
                        localName: "*",
                        namespaceURI: _r(r),
                        prefix: ""
                    }, n) : (r = Xr(e, "NCName"), t = "star" === Xr(e, "*")[0] ? fu(t, {
                        localName: _r(r),
                        namespaceURI: null,
                        prefix: "*"
                    }, n) : fu(t, {localName: "*", namespaceURI: null, prefix: _r(r)}, n)) : t = fu(t, {
                        localName: "*",
                        namespaceURI: null,
                        prefix: "*"
                    }, n), t;
                default:
                    return zs("Unsupported: the test '" + r + "'.")
            }
        }

        function mu(e, t, n) {
            var r = e[0];
            switch (r) {
                case $s.bc:
                    return r = "", Xr(e, "rootExpr") && (r = "\n\t\tlet documentNode = contextItem;\n\t\twhile (documentNode.nodeType !== /*DOCUMENT_NODE*/9) {\n\t\t\tdocumentNode = domFacade.getParentNode(documentNode);\n\t\t\tif (documentNode === null) {\n\t\t\t\tthrow new Error('XPDY0050: the root node of the context node is not a document node.');\n\t\t\t}\n\t\t}\n\t\tcontextItem = documentNode;\n\t\t"), (e = function (e, t) {
                        if (0 === e.length) return Ks("\n\t\t\tif (!hasReturned) {\n\t\t\t\thasReturned = true;\n\t\t\t\treturn ready(contextItem);\n\t\t\t}\n\t\t\t", {type: 2}, ["let hasReturned = false;"]);
                        for (var n = "", r = [], a = e.length - 1; 0 <= a; a--) {
                            var i = e[a], o = a + 1, s = Xr(i, "predicates");
                            e:{
                                var u = t, l = "", h = [];
                                if (s) {
                                    s = Yr(s, "*");
                                    for (var p = 0; p < s.length; p++) {
                                        var f = "step" + o + "_predicate" + p, d = u.Fb(s[p], f, u);
                                        if (!d.isAstAccepted) {
                                            u = d;
                                            break e
                                        }
                                        if (!(f = Zs(f, "", d.Ma, "contextItem" + o)).isAstAccepted) {
                                            u = f;
                                            break e
                                        }
                                        l = 0 === p ? l + f.code : l + " && " + f.code, h.push(d.code)
                                    }
                                    u = Ks(l, {type: 0}, h)
                                } else u = Ks("", {type: 5}, h)
                            }
                            if (!u.isAstAccepted) return u;
                            if (!(l = Xr(i, "xpathAxis"))) return zs("Unsupported: filter expressions.");
                            if (!(h = Xr(i, pu))) return zs("Unsupported: the test in the '" + i + "' step.");
                            if (n = a === e.length - 1 ? "i" + o + "++;\n\t\t\t\t\t   return ready(contextItem" + o + ");" : n + "\n\t\t\t\t\t   i" + o + "++;", !(h = du(h, "contextItem" + o, t)).isAstAccepted) return h;
                            e:switch (h = h.code, s = u.code, l = _r(l), l) {
                                case"attribute":
                                    o = lu(h, s, o, n, "attributeNodes", "\n\tlet attributeNodes" + o + ";\n\tif (contextItem && contextItem" + (o - 1) + ".nodeType === /*ELEMENT_NODE*/ 1) {\n\t\tattributeNodes" + o + " =  domFacade.getAllAttributes(contextItem" + (o - 1) + ");\n\t}\n\t");
                                    break e;
                                case"child":
                                    o = lu(h, s, o, n, "childNodes", "const childNodes" + o + " = domFacade.getChildNodes(contextItem" + (o - 1) + ");");
                                    break e;
                                case"parent":
                                    o = cu(h, s, o, n, "\n\tconst contextItem" + o + " = domFacade.getParentNode(contextItem" + (o - 1) + ");\n\t");
                                    break e;
                                case"self":
                                    o = cu(h, s, o, n, "const contextItem" + o + " = contextItem" + (o - 1) + ";");
                                    break e;
                                default:
                                    o = zs("Unsupported: the " + l + " axis")
                            }
                            if (!o.isAstAccepted) return o;
                            if (r.push.apply(r, [].concat(c(o.Ea), c(u.Ea))), n = o.code, 0 < Yr(i, "lookup").length) return zs("Unsupported: lookups.")
                        }
                        return Ks("const contextItem0 = contextItem;" + n, {type: 2}, r)
                    }(Yr(e, "stepExpr"), n)).isAstAccepted ? Ks("\n\tfunction " + t + "(contextItem) {\n\t\t" + r + "\n\t\t" + e.Ea.join("\n") + "\n\t\tconst next = () => {\n\t\t\t" + e.code + "\n\t\t\treturn DONE_TOKEN;\n\t\t};\n\t\treturn {\n\t\t\tnext,\n\t\t\t[Symbol.iterator]() { return this; }\n\t\t};\n\t}\n\t", {
                        type: 3,
                        j: {type: 4}
                    }) : e;
                case $s.Rb:
                    return su(e, t, n, "&&");
                case $s.ac:
                    return su(e, t, n, "||");
                case $s.dc:
                    return Ks("const " + t + " = " + (e = ou(e = Xr(e, "value")[1])) + ";", {type: 1});
                case"equalOp":
                case"notEqualOp":
                case"lessThanOrEqualOp":
                case"lessThanOp":
                case"greaterThanOrEqualOp":
                case"greaterThanOp":
                case"eqOp":
                case"neOp":
                case"ltOp":
                case"leOp":
                case"gtOp":
                case"geOp":
                case"isOp":
                case"nodeBeforeOp":
                case"nodeAfterOp":
                    e:{
                        var a = tu(e, t, "firstOperand", n);
                        if (a.isAstAccepted) if ((n = tu(e, t, "secondOperand", n)).isAstAccepted) switch (r) {
                            case"eqOp":
                            case"neOp":
                            case"ltOp":
                            case"leOp":
                            case"gtOp":
                            case"geOp":
                            case"isOp":
                                t = ru(e, r, a, n, t);
                                break e;
                            case"equalOp":
                            case"notEqualOp":
                            case"lessThanOrEqualOp":
                            case"lessThanOp":
                            case"greaterThanOrEqualOp":
                            case"greaterThanOp":
                                Xr(e, "firstOperand");
                                var i = Lr(e, "type");
                                Xr(e, "secondOperand");
                                var o = Lr(e, "type");
                                t = i && o ? 3 === i.g && 3 === o.g ? ru(e, iu[r], a, n, t) : zs("generalCompare with sequences is still in development") : zs("types of compare are not known");
                                break e;
                            default:
                                t = zs("Unsupported compare type")
                        } else t = n; else t = a
                    }
                    return t;
                default:
                    return zs("Unsupported: the base expression '" + r + "'.")
            }
        }

        function vu(e, t, n) {
            var r = Xr(e, "mainModule");
            if (!r) return zs("Unsupported: Can not execute a library module.");
            if (Xr(r, "prolog")) return zs("Unsupported: XQuery.");
            var a = kr(r, ["queryBody", "*"]);
            return n.Fb = mu, !1 === (n = mu(a, "compiledXPathExpression", n)).isAstAccepted ? n : (r = n.Ea ? n.Ea.join("\n") : "", a = Lr(a, "type"), !1 === (t = function (e, t, n) {
                switch (e) {
                    case 9:
                        if (e = (n = u(Js("compiledXPathExpression", t))).next().value, 4 !== n.next().value.type) throw Error("Trying access generated code as an iterator while this is not the case.");
                        return Ks("\n\tconst firstResult = " + e + ".next();\n\tif (!firstResult.done) {\n\t\treturn firstResult.value\n\t}\n\treturn null;\n\t", {type: 2});
                    case 7:
                        return e = (n = u(Js("compiledXPathExpression", t))).next().value, 4 !== n.next().value.type ? Ks("return [];", {type: 2}) : Ks("\n\tconst nodes = [];\n\tfor (const node of " + e + ") {\n\t\tnodes.push(node);\n\t}\n\treturn nodes;\n\t", {type: 2});
                    case 3:
                        return (n = Zs("compiledXPathExpression", "", t)).isAstAccepted ? Ks("return " + n.code + ";", {type: 2}) : n;
                    case 2:
                        return void 0 === n ? n = zs("Full AST wasn't annotated so we cannot correctly emit a string return") : W(n, 1) || W(n, 47) ? n = Ks("return " + nu(e = (t = u(Js("compiledXPathExpression", t))).next().value, (t = t.next().value).type, n) + " || '';", {type: 2}) : n = zs("Not implemented: returning anything but strings and attributes from codegen"), n;
                    default:
                        return zs("Unsupported: the return type '" + e + "'.")
                }
            }(t, n.Ma, a ? a.type : void 0)).isAstAccepted ? t : (t = r + n.code + t.code, n = "\n\treturn (contextItem, domFacade, runtimeLib) => {\n\t\tconst {\n\t\t\tDONE_TOKEN,\n\t\t\tValueType,\n\t\t\tXPDY0002,\n\t\t\tdeterminePredicateTruthValue,\n\t\t\tisSubtypeOf,\n\t\t\tready,\n\t\t\tatomize,\n\t\t} = runtimeLib;", function e(t) {
                var n = Yr(t, "*");
                if ("pathExpr" === t[0]) return !0;
                for (t = u(n), n = t.next(); !n.done; n = t.next()) if (e(n.value)) return !0;
                return !1
            }(e) && (n += '\n\t\tif (!contextItem) {\n\t\t\tthrow XPDY0002("Context is needed to evaluate the given path expression.");\n\t\t}\n\n\t\tif (!contextItem.nodeType) {\n\t\t\tthrow new Error("Context item must be subtype of node().");\n\t\t}\n\t\t'), {
                code: n + (t + "}\n//# sourceURL=generated.js"),
                isAstAccepted: !0
            }))
        }

        var gu = {},
            yu = (gu["http://www.w3.org/2005/XQueryX"] = "xqx", gu["http://www.w3.org/2007/xquery-update-10"] = "xquf", gu);

        function wu(e, t, n) {
            var r = e.stack;
            r && (r.includes(e.message) && (r = r.substr(r.indexOf(e.message) + e.message.length).trim()), (r = r.split("\n")).splice(10), r = (r = r.map((function (e) {
                return e.startsWith("    ") || e.startsWith("\t") ? e : "    " + e
            }))).join("\n")), e = Error.call(this, "Custom XPath function Q{" + n + "}" + t + " raised:\n" + e.message + "\n" + r), this.message = e.message, "stack" in e && (this.stack = e.stack)
        }

        function Au(e, t, n) {
            return 0 === t.g ? e.F() ? null : Ps(e.first(), n).next(0).value : 2 === t.g || 1 === t.g ? e.S().map((function (e) {
                if (W(e.type, 47)) throw Error("Cannot pass attribute nodes to custom functions");
                return Ps(e, n).next(0).value
            })) : Ps(e.first(), n).next(0).value
        }

        function xu(e) {
            var t = Ts(e, "XPath", !1);
            if (t) return t;
            if (Wo(t = Go(e, {ca: !1}), new os(void 0)), null === (t = kr(t, ["mainModule", "queryBody", "*"]))) throw Error("Library modules do not have a specificity");
            t = To(t, {qa: !1, ca: !1});
            var n = Cs("XPath", !1);
            if (Bs[e]) Bs[e][n] = t; else {
                var r = {};
                Bs[e] = (r[n] = t, r)
            }
            return t
        }

        v(wu, Error);
        var bu = new xe;
        return void 0 !== t && (t.compareSpecificity = function (e, t) {
            return dr(xu(e).K, xu(t).K)
        }, t.compileXPathToJavaScript = function (e, t, n) {
            return n = n || {}, t = t || 0, Wo(e = Go(e = Ds(e), {
                ca: "XQuery3.1" === n.language || "XQueryUpdate3.1" === n.language,
                debug: !1
            }), new os(new Fo(new hs((n = {ga: n.namespaceResolver || Rs(null)}).ga, {}, Gs("http://www.w3.org/2005/xpath-functions"))))), vu(e, t, n)
        }, t.domFacade = bu, t.evaluateXPath = Ys, t.evaluateXPathToArray = function (e, t, n, r, a) {
            return Ys(e, t, n, r, Ys.Sb, a)
        }, t.evaluateXPathToAsyncIterator = Vs, t.evaluateXPathToBoolean = function (e, t, n, r, a) {
            return Ys(e, t, n, r, Ys.BOOLEAN_TYPE, a)
        }, t.evaluateXPathToFirstNode = function (e, t, n, r, a) {
            return Ys(e, t, n, r, Ys.Vb, a)
        }, t.evaluateXPathToMap = function (e, t, n, r, a) {
            return Ys(e, t, n, r, Ys.Xb, a)
        }, t.evaluateXPathToNodes = function (e, t, n, r, a) {
            return Ys(e, t, n, r, Ys.Zb, a)
        }, t.evaluateXPathToNumber = function (e, t, n, r, a) {
            return Ys(e, t, n, r, Ys.NUMBER_TYPE, a)
        }, t.evaluateXPathToNumbers = function (e, t, n, r, a) {
            return Ys(e, t, n, r, Ys.$b, a)
        }, t.evaluateXPathToString = function (e, t, n, r, a) {
            return Ys(e, t, n, r, Ys.STRING_TYPE, a)
        }, t.evaluateXPathToStrings = function (e, t, n, r, a) {
            return Ys(e, t, n, r, Ys.cc, a)
        }, t.evaluateUpdatingExpression = function (e, t, n, r, a) {
            var i, o, s, u, l, c, h, p, f, d;
            return function (e) {
                function t(t) {
                    return e.next(t)
                }

                function n(t) {
                    return e.throw(t)
                }

                return new Promise((function (r, a) {
                    !function e(i) {
                        i.done ? r(i.value) : Promise.resolve(i.value).then(t, n).then(e, a)
                    }(e.next())
                }))
            }(new E(new A((function (m) {
                switch (m.h) {
                    case 1:
                        a = a || {};
                        try {
                            u = Ms(e, t, n || null, r || {}, a || {}, {
                                qa: !0,
                                ca: !0,
                                debug: !!a.debug,
                                ob: !!a.disableCache,
                                Ta: !!a.annotateAst
                            }), i = u.zb, o = u.Ab, s = u.ia
                        } catch (t) {
                            jr(e, t)
                        }
                        if (s.I) {
                            m.h = 2;
                            break
                        }
                        l = [];
                        var v = (c = Vs(e, t, n, r, Object.assign(Object.assign({}, a), {language: "XQueryUpdate3.1"}))).next();
                        return m.h = 3, {value: v};
                    case 3:
                        h = m.v;
                    case 4:
                        if (h.done) {
                            m.h = 6;
                            break
                        }
                        return l.push(h.value), v = c.next(), m.h = 7, {value: v};
                    case 7:
                        h = m.v, m.h = 4;
                        break;
                    case 6:
                        return p = {}, m.return(Promise.resolve((p.pendingUpdateList = [], p.xdmValue = l, p)));
                    case 2:
                        try {
                            d = s.o(i, o), f = d.next(0)
                        } catch (t) {
                            jr(e, t)
                        }
                        return m.return(Qs(f.value, e, a.returnType, o))
                }
            }))))
        }, t.evaluateUpdatingExpressionSync = function (e, t, n, r, a) {
            a = a || {};
            try {
                var i = Ms(e, t, n || null, r || {}, a || {}, {
                    qa: !0,
                    ca: !0,
                    debug: !!a.debug,
                    ob: !!a.disableCache,
                    Ta: !!a.annotateAst
                }), o = i.zb, s = i.Ab, u = i.ia
            } catch (t) {
                jr(e, t)
            }
            if (!u.I) return o = {}, (s = {}).pendingUpdateList = [], s.xdmValue = Ys(e, t, n, r, a.j, Object.assign(Object.assign({}, a), (o.language = Ys.hc, o))), s;
            try {
                var l = u.o(o, s).next(0)
            } catch (t) {
                jr(e, t)
            }
            return Qs(l.value, e, a.returnType, s)
        }, t.executeJavaScriptCompiledXPath = function (e, t, n) {
            return n = n || new xe, e()(t, n, Ws)
        }, t.executePendingUpdateList = function (e, t, n, r) {
            t = new Te(t || new xe), r = r ? new Be(r) : Ee, n = n ? n = new bs(n) : null, ir(e = e.map(so), t, n, r)
        }, t.getBucketForSelector = function (e) {
            return xu(e).Y()
        }, t.getBucketsForNode = Ae, t.precompileXPath = function (e) {
            return Promise.resolve(e)
        }, t.registerXQueryModule = function (e, t) {
            if (Zo(t = Go(e, {
                ca: !0,
                debug: (t = void 0 === t ? {debug: !1} : t).debug
            }), new os(void 0)), !(t = Xr(t, "libraryModule"))) throw Error("XQuery module must be declared in a library module.");
            var n = Xr(t, "moduleDecl"), r = Xr(n, "uri"), a = _r(r);
            if (r = _r(n = Xr(n, "prefix")), (n = new Fo(new hs((function () {
                return null
            }), Object.create(null), Gs("http://www.w3.org/2005/xpath-functions")))).o[n.h][r] = a, null !== (t = Xr(t, "prolog"))) {
                try {
                    var i = Qo(t, n)
                } catch (t) {
                    jr(e, t)
                }
                i.La.forEach((function (e) {
                    if (a !== e.namespaceURI) throw Error("XQST0048: Functions and variables declared in a module must reside in the module target namespace.")
                })), Yo(a, i)
            } else Yo(a, {La: [], Va: []});
            return a
        }, t.registerCustomXPathFunction = function (e, t, n, r) {
            var a = (e = function (e) {
                if ("object" == typeof e) return e;
                if (2 !== (e = e.split(":")).length) throw Error("Do not register custom functions in the default function namespace");
                var t = u(e);
                e = t.next().value, t = t.next().value;
                var n = cs[e];
                if (!n) {
                    if (n = "generated_namespace_uri_" + e, cs[e]) throw Error("Prefix already registered: Do not register the same prefix twice.");
                    cs[e] = n
                }
                return {localName: t, namespaceURI: n}
            }(e)).namespaceURI, i = e.localName;
            if (!a) throw hi();
            var o = t.map((function (e) {
                return me(e)
            })), s = me(n);
            ba(a, i, o, s, (function (e, t, n) {
                var u = Array.from(arguments);
                u.splice(0, 3), u = u.map((function (e, n) {
                    return Au(e, o[n], t)
                }));
                var l = {};
                l.currentContext = t.J, l.domFacade = t.h.h, l = l;
                try {
                    var h = r.apply(void 0, [l].concat(c(u)))
                } catch (e) {
                    throw new wu(e, i, a)
                }
                return h && "object" == typeof h && Object.getOwnPropertySymbols(h).includes(Ss) ? se.create(h.Eb) : vt(t.h, h, s)
            }))
        }, t.parseScript = function (e, t, n, r) {
            return r = void 0 === r ? Ee : r, e = Go(e, {
                ca: "XQueryUpdate3.1" === t.language,
                debug: t.debug
            }), t.Ta && Wo(e, new os(void 0)), function e(t, n, r, a) {
                if ("string" == typeof r) return 0 === r.length ? null : n.createTextNode(r);
                if (!Array.isArray(r)) throw new TypeError("JsonML element should be an array or string");
                var i = r[0];
                switch (i) {
                    case"copySource":
                    case"insertAfter":
                    case"insertAsFirst":
                    case"insertAsLast":
                    case"insertBefore":
                    case"insertInto":
                    case"modifyExpr":
                    case"newNameExpr":
                    case"replacementExpr":
                    case"replaceValue":
                    case"returnExpr":
                    case"sourceExpr":
                    case"targetExpr":
                    case"transformCopies":
                    case"transformCopy":
                        a = a || "http://www.w3.org/2005/XQueryX";
                        break;
                    case"deleteExpr":
                    case"insertExpr":
                    case"renameExpr":
                    case"replaceExpr":
                    case"transformExpr":
                        a = "http://www.w3.org/2007/xquery-update-10";
                        break;
                    default:
                        a = "http://www.w3.org/2005/XQueryX"
                }
                i = n.createElementNS(a, yu[a] + ":" + i);
                var o = r[1], s = 1;
                if ("object" == typeof o && !Array.isArray(o)) {
                    for (var u in o) null !== o[u] && ("type" === u ? t.setAttributeNS(i, a, "fontoxpath:" + u, fe(o[u])) : t.setAttributeNS(i, a, yu[a] + ":" + u, o[u]));
                    s = 2
                }
                for (u = s, o = r.length; u < o; ++u) null !== (s = e(t, n, r[u], a)) && t.insertBefore(i, s, null);
                return i
            }(r, n, e, null)
        }, t.profiler = Ls, t.createTypedValueFactory = function (e) {
            return function (t, n) {
                return t = mt(new Te(null === n ? new xe : n), t, me(e)), (n = {})[Ss] = !0, n.Eb = t, n
            }
        }, t.Language = {
            XPATH_3_1_LANGUAGE: "XPath3.1",
            XQUERY_3_1_LANGUAGE: "XQuery3.1",
            XQUERY_UPDATE_3_1_LANGUAGE: "XQueryUpdate3.1"
        }, t.ReturnType = Hs), t
    }.call("undefined" == typeof window ? void 0 : window, Object.freeze({
        __proto__: null,
        compile: function (e, t = {language: "xsd"}) {
            const r = xe(t)(e), a = function (e) {
                const t = new n;
                return e(t), new f(t.program)
            }(e => {
                A(e, r, "xpath" === t.language), e.accept()
            });
            return function (e) {
                const n = "xpath" === t.language ? [-1, ...be(e), -2] : be(e);
                return a.execute(n).success
            }
        }
    })),
    Be = (Ee.compareSpecificity, Ee.compileXPathToJavaScript, Ee.createTypedValueFactory, Ee.domFacade, Ee.evaluateUpdatingExpression, Ee.evaluateUpdatingExpressionSync, Ee.evaluateXPath),
    Ne = (Ee.evaluateXPathToArray, Ee.evaluateXPathToAsyncIterator, Ee.evaluateXPathToBoolean),
    Ce = Ee.evaluateXPathToFirstNode, Te = (Ee.evaluateXPathToMap, Ee.evaluateXPathToNodes),
    Ie = Ee.evaluateXPathToNumber, Oe = (Ee.evaluateXPathToNumbers, Ee.evaluateXPathToString),
    Se = Ee.evaluateXPathToStrings,
    Re = (Ee.executeJavaScriptCompiledXPath, Ee.executePendingUpdateList, Ee.getBucketForSelector, Ee.getBucketsForNode),
    De = (Ee.Language, Ee.parseScript), Ge = (Ee.precompileXPath, Ee.profiler, Ee.registerCustomXPathFunction),
    Me = Ee.registerXQueryModule;
Ee.ReturnType;

class Ue {
    constructor(e) {
        this._onNodeTouched = e
    }

    getAllAttributes(e) {
        return Array.from(e.attributes)
    }

    getAttribute(e, t) {
        return e.getAttribute(t)
    }

    getChildNodes(e, t) {
        return Array.from(e.childNodes).filter(e => !t || Re(e).includes(t))
    }

    getData(e) {
        return e.nodeType === Node.ATTRIBUTE_NODE ? (this._onNodeTouched(e), e.value) : (this._onNodeTouched(e.parentNode), e.data)
    }

    getFirstChild(e, t) {
        const n = Array.from(this.getChildNodes()).filter(e => !t || Re(e).includes(t))[0];
        return n || null
    }

    getLastChild(e, t) {
        const n = e.getChildNodes().filter(e => !t || Re(e).includes(t)), r = n[n.length - 1];
        return r || null
    }

    getNextSibling(e, t) {
        for (let {nextSibling: n} = e; n; n = n.nextSibling) if (Re(n).includes(t)) return n;
        return null
    }

    getParentNode(e) {
        return e.parentNode
    }

    getPreviousSibling(e, t) {
        for (let {previousSibling: n} = e; n; n = n.previousSibling) if (Re(n).includes(t)) return n;
        return null
    }
}

class Fe {
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
        const t = Be("path()", e), n = e.ownerDocument.firstElementChild.getAttribute("id");
        return null !== n && "default" !== n ? `#${n}${Fe.shortenPath(t)}` : Fe.shortenPath(t)
    }

    static shortenPath(e) {
        const t = e.split("/");
        let n = "";
        for (let e = 2; e < t.length; e += 1) {
            const r = t[e];
            if (-1 !== r.indexOf("{}")) {
                n += "/" + r.split("{}")[1]
            } else n += "/" + r
        }
        return n
    }
}

function Pe(e, t, n, r) {
    const a = {};
    return function (i) {
        if (a[i]) return;
        const o = {}, s = [], u = [];
        for (u.push({node: i, processed: !1}); u.length > 0;) {
            const i = u[u.length - 1], {processed: l} = i, {node: c} = i;
            if (l) u.pop(), s.pop(), o[c] = !1, a[c] = !0, t && 0 !== e[c].length || n.push(c); else {
                if (a[c]) {
                    u.pop();
                    continue
                }
                if (o[c]) {
                    if (r) {
                        u.pop();
                        continue
                    }
                    s.push(c), window.dispatchEvent(new CustomEvent("compute-exception", {
                        composed: !0,
                        bubbles: !0,
                        detail: {path: s, message: "cyclic graph"}
                    }))
                }
                o[c] = !0, s.push(c);
                const t = e[c];
                for (let e = t.length - 1; e >= 0; e -= 1) u.push({node: t[e], processed: !1});
                i.processed = !0
            }
        }
    }
}

function He(e) {
    this.nodes = {}, this.outgoingEdges = {}, this.incomingEdges = {}, this.circular = e && !!e.circular
}

He.prototype = {
    size() {
        return Object.keys(this.nodes).length
    }, addNode(e, t) {
        this.hasNode(e) || (this.nodes[e] = 2 === arguments.length ? t : e, this.outgoingEdges[e] = [], this.incomingEdges[e] = [])
    }, removeNode(e) {
        this.hasNode(e) && (delete this.nodes[e], delete this.outgoingEdges[e], delete this.incomingEdges[e], [this.incomingEdges, this.outgoingEdges].forEach(t => {
            Object.keys(t).forEach(n => {
                const r = t[n].indexOf(e);
                r >= 0 && t[n].splice(r, 1)
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
        let n;
        this.hasNode(e) && (n = this.outgoingEdges[e].indexOf(t), n >= 0 && this.outgoingEdges[e].splice(n, 1)), this.hasNode(t) && (n = this.incomingEdges[t].indexOf(e), n >= 0 && this.incomingEdges[t].splice(n, 1))
    }, clone() {
        const e = this, t = new He;
        return Object.keys(e.nodes).forEach(n => {
            t.nodes[n] = e.nodes[n], t.outgoingEdges[n] = e.outgoingEdges[n].slice(0), t.incomingEdges[n] = e.incomingEdges[n].slice(0)
        }), t
    }, directDependenciesOf(e) {
        if (this.hasNode(e)) return this.outgoingEdges[e].slice(0);
        throw new Error("Node does not exist: " + e)
    }, directDependantsOf(e) {
        if (this.hasNode(e)) return this.incomingEdges[e].slice(0);
        throw new Error("Node does not exist: " + e)
    }, dependenciesOf(e, t) {
        if (this.hasNode(e)) {
            const n = [];
            Pe(this.outgoingEdges, t, n, this.circular)(e);
            const r = n.indexOf(e);
            return r >= 0 && n.splice(r, 1), n
        }
        throw new Error("Node does not exist: " + e)
    }, dependantsOf(e, t) {
        if (this.hasNode(e)) {
            const n = [];
            Pe(this.incomingEdges, t, n, this.circular)(e);
            const r = n.indexOf(e);
            return r >= 0 && n.splice(r, 1), n
        }
        throw new Error("Node does not exist: " + e)
    }, entryNodes() {
        const e = this;
        return Object.keys(this.nodes).filter(t => 0 === e.incomingEdges[t].length)
    }, overallOrder(e) {
        const t = this, n = [], r = Object.keys(this.nodes);
        if (0 === r.length) return n;
        if (!this.circular) {
            const e = Pe(this.outgoingEdges, !1, [], this.circular);
            r.forEach(t => {
                e(t)
            })
        }
        const a = Pe(this.outgoingEdges, e, n, this.circular);
        return r.filter(e => 0 === t.incomingEdges[e].length).forEach(e => {
            a(e)
        }), this.circular && r.filter(e => -1 === n.indexOf(e)).forEach(e => a(e)), n
    }
}, He.prototype.directDependentsOf = He.prototype.directDependantsOf, He.prototype.dependentsOf = He.prototype.dependantsOf;

class je {
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
        return je.ACTION_ELEMENTS.includes(e)
    }

    static get UI_ELEMENTS() {
        return ["FX-ALERT", "FX-CONTROL", "FX-BUTTON", "FX-CONTROL", "FX-DIALOG", "FX-FILENAME", "FX-MEDIATYPE", "FX-GROUP", "FX-HINT", "FX-INPUT", "FX-ITEMS", "FX-LABEL", "FX-OUTPUT", "FX-RANGE", "FX-REPEAT", "FX-REPEATITEM", "FX-SWITCH", "FX-SECRET", "FX-SELECT", "FX-SUBMIT", "FX-TEXTAREA", "FX-TRIGGER", "FX-UPLOAD"]
    }

    static isUiElement(e) {
        je.UI_ELEMENTS.includes(e);
        return je.UI_ELEMENTS.includes(e)
    }

    static async refreshChildren(e, t) {
        return new Promise(n => {
            const {children: r} = e;
            r && Array.from(r).forEach(e => {
                je.isUiElement(e.nodeName) && "function" == typeof e.refresh ? e.refresh() : "FX-MODEL" !== e.nodeName.toUpperCase() && je.refreshChildren(e, t)
            }), n("done")
        })
    }

    static isRepeated(e) {
        return null !== e.closest("fx-repeatitem")
    }

    static getRepeatTarget(e, t) {
        return e.closest("fx-repeatitem").querySelector("#" + t)
    }

    static getContentType(e, t) {
        return "urlencoded-post" === t ? "application/x-www-form-urlencoded; charset=UTF-8" : "xml" === e.type ? "application/xml; charset=UTF-8" : "json" === e.type ? "application/json" : null
    }

    static fadeInElement(e) {
        let t = () => (e.getAnimations && e.getAnimations().map(e => e.finish()), t = e.animate({opacity: [0, 1]}, 600), t.finished);
        return t()
    }

    static fadeOutElement(e) {
        let t = () => (e.getAnimations && e.getAnimations().map(e => e.finish()), t = e.animate({opacity: [1, 0]}, 2600), t.finished);
        return t()
    }

    static dispatch(e, t, n) {
        const r = new CustomEvent(t, {composed: !0, bubbles: !0, detail: n});
        e.dispatchEvent(r)
    }
}

je.READONLY_DEFAULT = !1, je.REQUIRED_DEFAULT = !1, je.RELEVANT_DEFAULT = !0, je.CONSTRAINT_DEFAULT = !0, je.TYPE_DEFAULT = "xs:string";
const Xe = "http://www.w3.org/2002/xforms", _e = new Map;

function Le(e, t, n) {
    return _e.has(e) ? _e.get(e).set(t, n) : _e.set(e, new Map)
}

const ke = e => {
    if (!e) return "http://www.w3.org/1999/xhtml"
};

function Ye(e, t) {
    const n = (r = e, a = t, _e.has(r) && _e.get(r).get(a) || null);
    var r, a;
    if (n) return n;
    const i = (new DOMParser).parseFromString("<xml />", "text/xml"), o = De(e, {}, i);
    let s = Se('descendant::xqx:functionCallExpr\n\t\t\t\t[xqx:functionName = "instance"]\n\t\t\t\t/xqx:arguments\n\t\t\t\t/xqx:stringConstantExpr\n\t\t\t\t/xqx:value', o, null, {}, {namespaceResolver: e => "xqx" === e ? "http://www.w3.org/2005/XQueryX" : void 0});
    if (0 === s.length) {
        const n = Ce("ancestor::*[@ref][1]", t);
        if (n) {
            const r = Ye(n.getAttribute("ref"), n);
            return Le(e, t), r
        }
        s = ["default"]
    }
    if (1 === s.length) {
        let n;
        if ("default" === s[0]) {
            const e = Ce("ancestor-or-self::fx-fore", t, null, null, {namespaceResolver: ke});
            n = e && e.querySelector("fx-instance")
        } else n = $e(s[0], t, "fx-instance");
        if (n && n.hasAttribute("xpath-default-namespace")) {
            const r = n.getAttribute("xpath-default-namespace"), a = e => {
                if (!e) return r
            };
            return Le(e, t, a), a
        }
    }
    s.length;
    const u = Oe("ancestor-or-self::*/@xpath-default-namespace[last()]", t) || "", l = function (e) {
        return "" === e ? u : Oe('ancestor-or-self::*/@*[name() = "xmlns:" || $prefix][last()]', t, null, {prefix: e})
    };
    return Le(e, t, l), l
}

function qe(e, t, n) {
    return (t && t.ownerDocument || t) === window.document ? ke : Ye(e, n)
}

function Ve({prefix: e, localName: t}, n) {
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
            return {namespaceURI: Xe, localName: t};
        default:
            return "" === e || "fn" === e ? {
                namespaceURI: "http://www.w3.org/2005/xpath-functions",
                localName: t
            } : "local" === e ? {namespaceURI: "http://www.w3.org/2005/xquery-local-functions", localName: t} : null
    }
}

function Qe(e, t, n, r = {}) {
    const a = qe(e, t, n);
    return Be(e, t, null, r, "xs:anyType", {
        currentContext: {formElement: n, variables: r},
        moduleImports: {xf: Xe},
        functionNameResolver: Ve,
        namespaceResolver: a
    })
}

function Je(e, t, n) {
    const r = qe(e, t, n);
    return Ce(e, t, null, {}, {
        defaultFunctionNamespaceURI: Xe,
        moduleImports: {xf: Xe},
        currentContext: {formElement: n},
        namespaceResolver: r
    })
}

function Ke(e, t, n) {
    const r = qe(e, t, n);
    return Te(e, t, null, {}, {
        currentContext: {formElement: n},
        functionNameResolver: Ve,
        moduleImports: {xf: Xe},
        namespaceResolver: r
    })
}

function ze(e, t, n) {
    const r = qe(e, t, n);
    return Ne(e, t, null, {}, {
        currentContext: {formElement: n},
        functionNameResolver: Ve,
        moduleImports: {xf: Xe},
        namespaceResolver: r
    })
}

function Ze(e, t, n, r = null, a = n) {
    const i = qe(e, t, n);
    return Oe(e, t, r, {}, {
        currentContext: {formElement: n},
        functionNameResolver: Ve,
        moduleImports: {xf: Xe},
        namespaceResolver: i
    })
}

function We(e, t, n, r = null, a = n) {
    const i = qe(e, t, n);
    return Ie(e, t, r, {}, {
        currentContext: {formElement: n},
        functionNameResolver: Ve,
        moduleImports: {xf: Xe},
        namespaceResolver: i
    })
}

function $e(e, t, n = null) {
    const r = Te("outermost(ancestor-or-self::fx-fore[1]/(descendant::xf-fore|descendant::*[@id = $id]))[not(self::fx-fore)]", t, null, {id: e}, {namespaceResolver: ke});
    if (0 === r.length) return null;
    if (1 === r.length && Ne("(ancestor::fx-fore | ancestor::fx-repeat)[last()]/self::fx-fore", r[0], null, null, {namespaceResolver: ke})) {
        const e = r[0];
        return n && e.localName !== n ? null : e
    }
    for (const e of Te("ancestor::fx-repeatitem => reverse()", t, null, null, {namespaceResolver: ke})) {
        const t = r.filter(t => e.contains(t));
        switch (t.length) {
            case 0:
                break;
            case 1: {
                const e = t[0];
                return n && e.localName !== n ? null : e
            }
            default: {
                const e = t.find(e => Te("every $ancestor of ancestor::fx-repeatitem satisfies $ancestor is $ancestor/../child::fx-repeatitem[../@repeat-index]", e, null, {}));
                return e ? n && e.localName !== n ? null : e : null
            }
        }
    }
    return null
}

Ge({namespaceURI: Xe, localName: "log"}, ["xs:string?"], "xs:string?", (e, t) => {
    const {formElement: n} = e.currentContext, r = $e(t, n, "fx-instance");
    if (r) {
        return (new XMLSerializer).serializeToString(r.getDefaultContext())
    }
    return null
}), Ge({namespaceURI: Xe, localName: "logtree"}, ["xs:string?"], "element()?", (e, t) => {
    const {formElement: n} = e.currentContext, r = $e(t, n, "fx-instance");
    if (r) {
        const t = document.createElement("div");
        t.setAttribute("class", "logtree");
        const n = e.currentContext.formElement, a = n.querySelector(".logtree");
        a && a.parentNode.removeChild(a);
        const i = function e(t, n) {
            if (n && n.nodeType === Node.ELEMENT_NODE && n.children) {
                const r = document.createElement("details");
                r.setAttribute("data-path", n.nodeName);
                const a = document.createElement("summary");
                let i, o = " <" + n.nodeName;
                Array.from(n.attributes).forEach(e => {
                    o += ` ${e.nodeName}="${e.nodeValue}"`
                }), n.firstChild && n.firstChild.nodeType === Node.TEXT_NODE && "" !== n.firstChild.data.trim() ? (i = n.firstChild.nodeValue, o += `>${i}</${n.nodeName}>`) : o += ">", a.textContent = o, r.appendChild(a), 0 !== n.childElementCount ? r.setAttribute("open", "open") : a.setAttribute("style", "list-style:none;"), t.appendChild(r), Array.from(n.children).forEach(t => {
                    e(r, t)
                })
            }
        }(t, r.getDefaultContext());
        i && n.appendChild(i)
    }
    return null
});
const et = (e, t) => {
    const n = Ce("ancestor-or-self::fx-fore", e.currentContext.formElement, null, null, {namespaceResolver: ke}),
        r = t ? $e(t, n, "fx-instance") : n.querySelector("fx-instance");
    if (r) {
        return r.getDefaultContext()
    }
    return null
};
Ge({namespaceURI: Xe, localName: "index"}, ["xs:string?"], "xs:integer?", (e, t) => {
    const {formElement: n} = e.currentContext;
    if (null === t) return 1;
    const r = $e(t, n, "fx-repeat");
    return r ? r.getAttribute("index") : 1
}), Ge({namespaceURI: Xe, localName: "instance"}, [], "item()?", e => et(e, null)), Ge({
    namespaceURI: Xe,
    localName: "instance"
}, ["xs:string?"], "item()?", et), Ge({
    namespaceURI: Xe,
    localName: "depends"
}, ["node()*"], "item()?", (e, t) => t[0]), Ge({
    namespaceURI: Xe,
    localName: "event"
}, ["xs:string?"], "item()?", (e, t) => (e.currentContext.variables[t].nodeType, e.currentContext.variables[t])), Me(`\n    module namespace xf="${Xe}";\n\n    declare %public function xf:boolean-from-string($str as xs:string) as xs:boolean {\n        lower-case($str) = "true" or $str = "1"\n    };\n`), Ge({
    namespaceURI: Xe,
    localName: "base64encode"
}, ["xs:string?"], "xs:string?", (e, t) => btoa(t));

class tt extends HTMLElement {
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
        return Je(e, this.getDefaultContext(), t)
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
                t = (new DOMParser).parseFromString("<data></data>", "application/xml"), n = t.firstElementChild;
            for (const r of e) {
                const e = t.createElement(r[0]);
                e.appendChild(t.createTextNode(r[1])), n.appendChild(e)
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
        const e = "" + this.src, t = je.getContentType(this, "get");
        await fetch(e, {method: "GET", mode: "cors", credentials: "include", headers: {"Content-Type": t}}).then(e => {
            const t = e.headers.get("content-type").toLowerCase();
            return t.startsWith("text/plain") ? e.text() : t.startsWith("application/json") ? e.json() : t.startsWith("application/xml") ? e.text().then(e => (new DOMParser).parseFromString(e, "application/xml")) : "done"
        }).then(e => {
            this.instanceData = e
        }).catch(e => {
            throw new Error("failed loading data " + e)
        })
    }

    _getContentType() {
        return "xml" === this.type ? "application/xml" : "json" === this.type ? "application/json" : null
    }

    _useInlineData() {
        if ("xml" === this.type) {
            const e = (new DOMParser).parseFromString(this.innerHTML, "application/xml");
            this.instanceData = e
        } else "json" === this.type && (this.instanceData = JSON.parse(this.textContent))
    }

    _handleResponse() {
        const e = this.shadowRoot.getElementById("loader"),
            t = (new DOMParser).parseFromString(e.lastResponse, "application/xml");
        this.instanceData = t
    }

    _handleError() {
        this.shadowRoot.getElementById("loader")
    }
}

customElements.define("fx-instance", tt);

class nt {
    constructor(e, t, n, r, a, i, o, s, u) {
        this.path = e, this.ref = t, this.constraint = i, this.readonly = n, this.relevant = r, this.required = a, this.type = o, this.node = s, this.bind = u, this.changed = !1, this.alerts = []
    }

    get value() {
        return this.node.nodeType ? this.node.nodeType === Node.ATTRIBUTE_NODE ? this.node.nodeValue : this.node.textContent : this.node
    }

    set value(e) {
        e.nodeType === Node.DOCUMENT_NODE ? this.node.appendChild(e.firstElementChild) : e.nodeType === Node.ELEMENT_NODE ? this.node.appendChild(e) : this.node.nodeType === Node.ATTRIBUTE_NODE ? this.node.nodeValue = e : this.node.textContent = e
    }

    addAlert(e) {
        this.alerts.push(e)
    }

    cleanAlerts() {
        this.alerts = []
    }
}

class rt extends HTMLElement {
    constructor() {
        super(), this.instances = [], this.modelItems = [], this.defaultContext = {}, this.inited = !1, this.modelConstructed = !1, this.attachShadow({mode: "open"})
    }

    get formElement() {
        return this.parentElement
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = "\n            <slot></slot>\n        ", this.addEventListener("model-construct-done", e => {
            this.modelConstructed = !0
        })
    }

    static lazyCreateModelItem(e, t, n) {
        let r, a = {};
        if (null == n) return null;
        a = n.nodeType === n.TEXT_NODE ? n.parentNode : n, n.nodeType ? r = Fe.getPath(n) : (r = null, a = n);
        const i = new nt(r, t, je.READONLY_DEFAULT, je.RELEVANT_DEFAULT, je.REQUIRED_DEFAULT, je.CONSTRAINT_DEFAULT, je.TYPE_DEFAULT, a, this);
        return e.registerModelItem(i), i
    }

    modelConstruct() {
        this.dispatchEvent(new CustomEvent("model-construct", {detail: this}));
        const e = this.querySelectorAll("fx-instance");
        if (e.length > 0) {
            const t = [];
            e.forEach(e => {
                t.push(e.init())
            }), Promise.all(t).then(() => {
                this.instances = Array.from(e), this.updateModel(), this.inited = !0, this.dispatchEvent(new CustomEvent("model-construct-done", {
                    composed: !0,
                    bubbles: !0,
                    detail: {model: this}
                }))
            })
        } else this.dispatchEvent(new CustomEvent("model-construct-done", {
            composed: !0,
            bubbles: !0,
            detail: {model: this}
        }));
        this.inited = !0
    }

    registerModelItem(e) {
        this.modelItems.push(e)
    }

    updateModel() {
        this.rebuild(), this.recalculate(), this.revalidate()
    }

    rebuild() {
        this.mainGraph = new He(!1), this.modelItems = [];
        this.querySelectorAll("fx-model > fx-bind").forEach(e => {
            e.init(this)
        })
    }

    recalculate() {
        this.mainGraph.overallOrder().forEach(e => {
            const t = this.mainGraph.getNodeData(e), n = this.getModelItem(t);
            if (n && e.includes(":")) {
                const t = e.split(":")[1];
                if (t) if ("calculate" === t) {
                    const e = Qe(n.bind[t], n.node, this);
                    n.value = e
                } else if ("constraint" !== t && "type" !== t) {
                    const e = n.bind[t];
                    if (e) {
                        const r = ze(e, n.node, this);
                        n[t] = r
                    }
                }
            }
        })
    }

    revalidate() {
        let e = !0;
        return this.modelItems.forEach(t => {
            const {bind: n} = t;
            if (n && "function" == typeof n.hasAttribute && n.hasAttribute("constraint")) {
                const r = n.getAttribute("constraint");
                if (r) {
                    const a = ze(r, t.node, this);
                    if (t.constraint = a, a || (e = !1), !this.modelConstructed) {
                        const e = n.getAlert();
                        e && t.addAlert(e)
                    }
                }
            }
        }), e
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
        return this.instances[0].instanceData
    }

    getInstance(e) {
        return Array.from(this.instances).find(t => t.id === e)
    }

    evalBinding(e) {
        return this.instances[0].evalXPath(e)
    }
}

function at(e) {
    return e.closest("fx-fore")
}

function it(e, t) {
    const n = e.closest("[ref]");
    if (null !== n) return n.nodeset;
    const r = function (e) {
        return at(e).getModel()
    }(e);
    if (Fe.isAbsolutePath(t)) {
        const e = Fe.getInstanceId(t);
        return r.getInstance(e).getDefaultContext()
    }
    return null !== r.getDefaultInstance() ? r.getDefaultInstance().getDefaultContext() : []
}

function ot(e, t) {
    const n = function (e) {
        return e.nodeType === Node.ATTRIBUTE_NODE ? e.ownerElement : e.parentNode
    }(e), r = n.closest("fx-repeatitem");
    if (r) return r.nodeset;
    if (e.nodeType === Node.ELEMENT_NODE && e.hasAttribute("context")) {
        const r = it(e.parentNode, t);
        return Je(e.getAttribute("context"), r, at(n))
    }
    return it(n, t)
}

customElements.define("fx-model", rt);
const st = e => class extends e {
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
        const e = ot(this, this.ref);
        if (e) if ("" === this.ref) this.nodeset = e; else if (Array.isArray(e)) e.forEach(t => {
            if (Fe.isSelfReference(this.ref)) this.nodeset = e; else {
                const e = Je(this.ref, t, null);
                this.nodeset.push(e)
            }
        }); else {
            this.getOwnerForm();
            e.nodeType ? this.nodeset = Je(this.ref, e, this) : this.nodeset = Qe(this.ref, e, this)
        }
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
            const e = Fe.getInstanceId(this.ref);
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
        return t || rt.lazyCreateModelItem(this.getModel(), this.ref, this.nodeset)
    }

    getValue() {
        if (this.hasAttribute("value")) {
            const e = this.getAttribute("value");
            try {
                return Ze(e, ot(this, e), this.getOwnerForm())
            } catch (e) {
                this.dispatch("error", {message: e})
            }
        }
        return this.textContent ? this.textContent : null
    }

    getInScopeContext() {
        return ot(this, this.ref)
    }

    dispatch(e, t) {
        const n = new CustomEvent(e, {composed: !0, bubbles: !0, detail: t});
        this.dispatchEvent(n)
    }
};

class ut extends (st(HTMLElement)) {
    constructor() {
        super(), this.nodeset = [], this.model = {}, this.contextNode = {}, this.inited = !1
    }

    connectedCallback() {
        this.ref = this.getAttribute("ref"), this.readonly = this.getAttribute("readonly"), this.required = this.getAttribute("required"), this.relevant = this.getAttribute("relevant"), this.type = this.hasAttribute("type") ? this.getAttribute("type") : ut.TYPE_DEFAULT, this.calculate = this.getAttribute("calculate")
    }

    init(e) {
        this.model = e, this.instanceId = this._getInstanceId(), this.bindType = this.getModel().getInstance(this.instanceId).type, "xml" === this.bindType && (this._evalInContext(), this._buildBindGraph(), this._createModelItems()), this._processChildren(e)
    }

    _buildBindGraph() {
        "xml" === this.bindType && this.nodeset.forEach(e => {
            const t = Fe.getPath(e);
            this.calculate && (this.model.mainGraph.addNode(t + ":calculate", e), this.model.mainGraph.addNode(t, e), this.model.mainGraph.addDependency(t, t + ":calculate"));
            const n = this._getReferencesForProperty(this.calculate, e);
            0 !== n.length && this._addDependencies(n, e, t, "calculate");
            const r = this._getReferencesForProperty(this.readonly, e);
            0 !== r.length ? this._addDependencies(r, e, t, "readonly") : this.readonly && this.model.mainGraph.addNode(t + ":readonly", e);
            const a = this._getReferencesForProperty(this.required, e);
            0 !== a.length ? this._addDependencies(a, e, t, "required") : this.required && this.model.mainGraph.addNode(t + ":required", e);
            const i = this._getReferencesForProperty(this.relevant, e);
            0 !== i.length ? this._addDependencies(i, e, t, "relevant") : this.relevant && this.model.mainGraph.addNode(t + ":relevant", e);
            const o = this._getReferencesForProperty(this.constraint, e);
            0 !== o.length ? this._addDependencies(o, e, t, "constraint") : this.constraint && this.model.mainGraph.addNode(t + ":constraint", e)
        })
    }

    _addNode(e, t) {
        this.model.mainGraph.hasNode(e) || this.model.mainGraph.addNode(e, {node: t})
    }

    _addDependencies(e, t, n, r) {
        const a = `${n}:${r}`;
        0 !== e.length ? (this.model.mainGraph.hasNode(a) || this.model.mainGraph.addNode(a, t), e.forEach(e => {
            const t = Fe.getPath(e);
            this.model.mainGraph.hasNode(t) || this.model.mainGraph.addNode(t, e), this.model.mainGraph.addDependency(a, t)
        })) : this.model.mainGraph.addNode(a, t)
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
            if (Fe.isSelfReference(this.ref)) this.nodeset = e; else if (this.ref) {
                Ke(this.ref, t, this.getOwnerForm()).forEach(e => {
                    this.nodeset.push(e)
                })
            }
        }); else {
            "xml" === this.getModel().getInstance(this.instanceId).type ? this.nodeset = Ke(this.ref, e, this.getOwnerForm()) : this.nodeset = this.ref
        }
    }

    _createModelItems() {
        Array.isArray(this.nodeset) ? Array.from(this.nodeset).forEach(e => {
            this._createModelItem(e)
        }) : this._createModelItem(this.nodeset)
    }

    static lazyCreateModelitems(e, t, n) {
        Array.isArray(n) ? Array.from(n).forEach(n => {
            ut.lazyCreateModelItem(e, t, n)
        }) : ut.lazyCreateModelItem(e, t, n)
    }

    _createModelItem(e) {
        if (Fe.isSelfReference(this.ref)) {
            const e = this.parentElement.closest("fx-bind[ref]");
            return void (e && (e.required = this.required))
        }
        const t = e, n = Fe.getPath(e),
            r = new nt(n, this.getBindingExpr(), ut.READONLY_DEFAULT, ut.RELEVANT_DEFAULT, ut.REQUIRED_DEFAULT, ut.CONSTRAINT_DEFAULT, this.type, t, this);
        this.getModel().registerModelItem(r)
    }

    _getReferencesForProperty(e) {
        if (e) {
            const t = new Set, n = new Ue(e => t.add(e));
            return this.nodeset.forEach(t => {
                Ze(e, t, this.getOwnerForm(), n)
            }), Array.from(t.values())
        }
        return []
    }

    _initBooleanModelItemProperty(e, t) {
        return ze(this[e], t, this)
    }

    static shortenPath(e) {
        const t = e.split("/");
        let n = "";
        for (let e = 2; e < t.length; e += 1) {
            const r = t[e];
            if (-1 !== r.indexOf("{}")) {
                n += "/" + r.split("{}")[1]
            } else n += "/" + r
        }
        return n
    }

    _getInstanceId() {
        const e = this.getBindingExpr();
        return e.startsWith("instance(") ? (this.instanceId = Fe.getInstanceId(e), this.instanceId) : this.instanceId ? this.instanceId : "default"
    }
}

ut.READONLY_DEFAULT = !1, ut.REQUIRED_DEFAULT = !1, ut.RELEVANT_DEFAULT = !0, ut.CONSTRAINT_DEFAULT = !0, ut.TYPE_DEFAULT = "xs:string", customElements.define("fx-bind", ut);

/*!
 * Toastify js 1.11.0
 * https://github.com/apvarun/toastify-js
 * @license MIT licensed
 *
 * Copyright (C) 2018 Varun A P
 */
class lt {
    constructor(e) {
        this.defaults = {
            oldestFirst: !0,
            text: "Toastify is awesome!",
            node: void 0,
            duration: 3e3,
            selector: void 0,
            callback: function () {
            },
            destination: void 0,
            newWindow: !1,
            close: !1,
            gravity: "toastify-top",
            positionLeft: !1,
            position: "",
            backgroundColor: "",
            avatar: "",
            className: "",
            stopOnFocus: !0,
            onClick: function () {
            },
            offset: {x: 0, y: 0},
            escapeMarkup: !0,
            style: {background: ""}
        }, this.version = "1.11.0", this.options = {}, this.toastElement = null, this._rootElement = document.body, this._init(e)
    }

    showToast() {
        if (this.toastElement = this._buildToast(), "string" == typeof this.options.selector ? this._rootElement = document.getElementById(this.options.selector) : this.options.selector instanceof HTMLElement || this.options.selector instanceof ShadowRoot ? this._rootElement = this.options.selector : this._rootElement = document.body, !this._rootElement) throw"Root element is not defined";
        return this._rootElement.insertBefore(this.toastElement, this._rootElement.firstChild), this._reposition(), this.options.duration > 0 && (this.toastElement.timeOutValue = window.setTimeout(() => {
            this._removeElement(this.toastElement)
        }, this.options.duration)), this
    }

    hideToast() {
        this.toastElement.timeOutValue && clearTimeout(this.toastElement.timeOutValue), this._removeElement(this.toastElement)
    }

    _init(e) {
        this.options = Object.assign(this.defaults, e), this.options.backgroundColor, this.toastElement = null, this.options.gravity = "bottom" === e.gravity ? "toastify-bottom" : "toastify-top", this.options.stopOnFocus = void 0 === e.stopOnFocus || e.stopOnFocus, this.options.style.background = this.options.style.background || e.backgroundColor
    }

    _buildToast() {
        if (!this.options) throw"Toastify is not initialized";
        let e = document.createElement("div");
        e.className = "toastify on " + this.options.className, e.className += " toastify-" + this.options.position, e.className += " " + this.options.gravity;
        for (const t in this.options.style) e.style[t] = this.options.style[t];
        if (this.options.node && this.options.node.nodeType === Node.ELEMENT_NODE) e.appendChild(this.options.node); else if (this.options.escapeMarkup ? e.innerText = this.options.text : e.innerHTML = this.options.text, "" !== this.options.avatar) {
            let t = document.createElement("img");
            t.src = this.options.avatar, t.className = "toastify-avatar", "left" == this.options.position ? e.appendChild(t) : e.insertAdjacentElement("afterbegin", t)
        }
        if (!0 === this.options.close) {
            let t = document.createElement("span");
            t.innerHTML = "&#10006;", t.className = "toast-close", t.addEventListener("click", e => {
                e.stopPropagation(), this._removeElement(this.toastElement), window.clearTimeout(this.toastElement.timeOutValue)
            });
            const n = window.innerWidth > 0 ? window.innerWidth : screen.width;
            "left" == this.options.position && n > 360 ? e.insertAdjacentElement("afterbegin", t) : e.appendChild(t)
        }
        if (this.options.stopOnFocus && this.options.duration > 0 && (e.addEventListener("mouseover", t => {
            window.clearTimeout(e.timeOutValue)
        }), e.addEventListener("mouseleave", () => {
            e.timeOutValue = window.setTimeout(() => {
                this._removeElement(e)
            }, this.options.duration)
        })), void 0 !== this.options.destination && e.addEventListener("click", e => {
            e.stopPropagation(), !0 === this.options.newWindow ? window.open(this.options.destination, "_blank") : window.location = this.options.destination
        }), "function" == typeof this.options.onClick && void 0 === this.options.destination && e.addEventListener("click", e => {
            e.stopPropagation(), this.options.onClick()
        }), "object" == typeof this.options.offset) {
            const t = this._getAxisOffsetAValue("x", this.options), n = this._getAxisOffsetAValue("y", this.options),
                r = "left" == this.options.position ? t : "-" + t,
                a = "toastify-top" == this.options.gravity ? n : "-" + n;
            e.style.transform = `translate(${r},${a})`
        }
        return e
    }

    _removeElement(e) {
        e.className = e.className.replace(" on", ""), window.setTimeout(() => {
            this.options.node && this.options.node.parentNode && this.options.node.parentNode.removeChild(this.options.node), e.parentNode && e.parentNode.removeChild(e), this.options.callback.call(e), this._reposition()
        }, 400)
    }

    _reposition() {
        let e, t = {top: 15, bottom: 15}, n = {top: 15, bottom: 15}, r = {top: 15, bottom: 15},
            a = this._rootElement.querySelectorAll(".toastify");
        for (let i = 0; i < a.length; i++) {
            e = !0 === a[i].classList.contains("toastify-top") ? "toastify-top" : "toastify-bottom";
            let o = a[i].offsetHeight;
            e = e.substr(9, e.length - 1);
            let s = 15;
            (window.innerWidth > 0 ? window.innerWidth : screen.width) <= 360 ? (a[i].style[e] = r[e] + "px", r[e] += o + s) : !0 === a[i].classList.contains("toastify-left") ? (a[i].style[e] = t[e] + "px", t[e] += o + s) : (a[i].style[e] = n[e] + "px", n[e] += o + s)
        }
    }

    _getAxisOffsetAValue(e, t) {
        return t.offset[e] ? isNaN(t.offset[e]) ? t.offset[e] : t.offset[e] + "px" : "0px"
    }
}

function ct(e) {
    return new lt(e)
}

class ht extends HTMLElement {
    static get properties() {
        return {
            avatar: {type: String},
            backgroundColor: {type: String},
            callback: {type: String},
            classProp: {type: String},
            close: {type: Boolean},
            destination: {type: String},
            duration: {type: Number},
            escapeMarkup: {type: Boolean},
            gravity: {type: String},
            newWindow: {type: Boolean},
            oldestFirst: {type: Boolean},
            position: {type: String},
            selector: {type: String},
            stopOnFocus: {type: Boolean},
            text: {type: String}
        }
    }

    constructor() {
        super(), this.attachShadow({mode: "open"})
    }

    _initVar(e, t) {
        return this.hasAttribute(e) ? this.getAttribute(e) : t
    }

    connectedCallback() {
        this.avatar = this._initVar("avatar", ""), this.backgroundColor = this._initVar("backgroundColor", ""), this.callback = this._initVar("callback", {}), this.classProp = this._initVar("data-class", ""), this.close = "true" === this._initVar("close", !1), this.destination = this._initVar("destination", ""), this.duration = Number(this._initVar("duration", 3e3)), this.escapeMarkup = "true" === this._initVar("escapeMarkup", !0), this.gravity = this._initVar("gravity", "top"), this.newWindow = "true" === this._initVar("newWindow", !1), this.oldestFirst = "true" === this._initVar("oldestFirst", !0), this.position = this._initVar("position", "right"), this.stopOnFocus = this._initVar("stopOnFocus", !0), this.text = this._initVar("text", "");
        this.shadowRoot.innerHTML = `\n        <style>\n            \n        :host{\n            display:none;\n        }\n    \n        </style>\n        ${this.renderHTML}\n    `, this.addEventListener("jinn-toast", e => {
            this.showToast(e.detail.text)
        })
    }

    showToast(e) {
        new ct({
            avatar: this.avatar,
            className: this.classProp,
            close: this.close,
            destination: this.destination,
            duration: this.duration,
            escapeMarkup: this.escapeMarkup,
            gravity: this.gravity,
            newWindow: this.newWindow,
            oldestFirst: this.oldestFirst,
            position: this.position,
            node: this.shadowRoot,
            stopOnFocus: this.stopOnFocus,
            text: e
        }).showToast()
    }

    renderHTML() {
        return "\n      <slot></slot>\n    "
    }
}

window.customElements.define("jinn-toast", ht);

class pt extends HTMLElement {
    static get properties() {
        return {lazyRefresh: {type: Boolean}, model: {type: Object}, ready: {type: Boolean}}
    }

    constructor() {
        super(), this.model = {}, this.addEventListener("model-construct-done", this._handleModelConstructDone), this.addEventListener("message", this._displayMessage), this.addEventListener("error", this._displayError), window.addEventListener("compute-exception", e => {
        }), this.ready = !1, this.storedTemplateExpressionByNode = new Map;
        this.attachShadow({mode: "open"}), this.shadowRoot.innerHTML = '\n            <style>\n                \n            :host {\n                display: none;\n                height:auto;\n                padding:var(--model-element-padding);\n                font-family:Roboto, sans-serif;\n                color:var(--paper-grey-900);\n            }\n            :host ::slotted(fx-model){\n                display:none;\n            }\n            :host(.fx-ready){\n                animation: fadein .4s forwards;\n                display:block;\n            }\n\n            #modalMessage .dialogActions{\n                text-align:center;\n            }\n            .overlay {\n              position: fixed;\n              top: 0;\n              bottom: 0;\n              left: 0;\n              right: 0;\n              background: rgba(0, 0, 0, 0.7);\n              transition: all 500ms;\n              visibility: hidden;\n              opacity: 0;\n              z-index:10;\n            }\n            .overlay.show {\n              visibility: visible;\n              opacity: 1;\n            }\n\n            .popup {\n              margin: 70px auto;\n              background: #fff;\n              border-radius: 5px;\n              width: 30%;\n              position: relative;\n              transition: all 5s ease-in-out;\n                            padding: 20px;\n\n            }\n            .popup h2 {\n              margin-top: 0;\n              width:100%;\n              background:#eee;\n              position:absolute;\n              top:0;\n              right:0;\n              left:0;\n              height:40px;\n             border-radius: 5px;\n\n            }\n            .popup .close {\n                position: absolute;\n                top: 3px;\n                right: 10px;\n                transition: all 200ms;\n                font-size: 30px;\n                font-weight: bold;\n                text-decoration: none;\n                color: #333;\n            }\n            .popup .close:focus{\n                outline:none;\n            }\n\n            .popup .close:hover {\n                color: #06D85F;\n            }\n            #messageContent{\n                margin-top:40px;\n            }\n            @keyframes fadein {\n              0% {\n                  opacity:0;\n              }\n              100% {\n                  opacity:1;\n              }\n            }\n        \n            </style>\n            \n           <jinn-toast id="message" gravity="bottom" position="left"></jinn-toast>\n           <jinn-toast id="error" text="error" duration="-1" data-class="error" close="true" position="left" gravity="bottom"></jinn-toast>\n           <slot></slot>\n           <div id="modalMessage" class="overlay">\n                <div class="popup">\n                   <h2></h2>\n                    <a class="close" href="#"  onclick="event.target.parentNode.parentNode.classList.remove(\'show\')" autofocus>&times;</a>\n                    <div id="messageContent"></div>\n                </div>\n           </div>\n        \n        '
    }

    connectedCallback() {
        if (this.lazyRefresh = this.hasAttribute("refresh-on-view"), this.lazyRefresh) {
            const e = {root: null, rootMargin: "0px", threshold: .3};
            this.intersectionObserver = new IntersectionObserver(this.handleIntersect, e)
        }
        this.shadowRoot.querySelector("slot").addEventListener("slotchange", e => {
            let t = e.target.assignedElements().find(e => "FX-MODEL" === e.nodeName.toUpperCase());
            if (!t) {
                const e = document.createElement("FX-model");
                this.appendChild(e), t = e
            }
            t.inited || t.modelConstruct(), this.model = t
        })
    }

    handleIntersect(e, t) {
        e.forEach(e => {
            const t = e.target;
            e.isIntersecting && (t.classList.add("loaded"), "function" == typeof t.refresh ? t.refresh(t, !0) : je.refreshChildren(t, !0))
        }), e[0].target.getOwnerForm().dispatchEvent(new CustomEvent("refresh-done"))
    }

    evaluateToNodes(e, t) {
        return Ke(e, t, this)
    }

    disconnectedCallback() {
    }

    async refresh(e) {
        je.refreshChildren(this, !0), this._updateTemplateExpressions(), this.dispatchEvent(new CustomEvent("refresh-done"))
    }

    _updateTemplateExpressions() {
        const e = Ke("(descendant-or-self::*/(text(), @*))[matches(.,'\\{.*\\}')] except descendant-or-self::fx-model/descendant-or-self::node()/(., @*)", this, this);
        Array.from(e).forEach(e => {
            if (this.storedTemplateExpressionByNode.has(e)) return;
            const t = this._getTemplateExpression(e);
            this.storedTemplateExpressionByNode.set(e, t)
        });
        for (const e of this.storedTemplateExpressionByNode.keys()) this._processTemplateExpression({
            node: e,
            expr: this.storedTemplateExpressionByNode.get(e)
        })
    }

    _processTemplateExpression(e) {
        const {expr: t} = e, {node: n} = e;
        this.evaluateTemplateExpression(t, n, this)
    }

    evaluateTemplateExpression(e, t) {
        if ("{}" === e) return;
        const n = e.match(/{[^}]*}/g);
        t.nodeType === t.TEXT_NODE ? t.parentNode : t.ownerElement;
        n && n.forEach(n => {
            let r = n.substring(1, n.length - 1);
            const a = ot(t, r);
            if (!a) {
                (t.nodeType === Node.TEXT_NODE || t.nodeType === Node.ATTRIBUTE_NODE) && t.parentNode;
                return
            }
            const i = Fe.getInstanceId(r), o = this.getModel().getInstance(i);
            try {
                const i = Ze(r, a, t, null, o), s = e.replaceAll(n, i);
                if (t.nodeType === Node.ATTRIBUTE_NODE) {
                    t.ownerElement.setAttribute(t.nodeName, s)
                } else t.nodeType === Node.TEXT_NODE && (t.textContent = s);
                s.includes("{") && (r = s.substring(1, s.length), this.evaluateTemplateExpression(s, t))
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
            const t = document.createElement("fx-instance");
            e.appendChild(t);
            const n = document.implementation.createDocument(null, "data", null);
            this._generateInstance(this, n.firstElementChild), t.instanceData = n, e.instances.push(t)
        }
    }

    _generateInstance(e, t) {
        if (e.hasAttribute("ref") && !je.isActionElement(e.nodeName)) {
            const n = e.getAttribute("ref");
            if (n.includes("/")) {
                n.split("/").forEach(n => {
                    t = this._generateNode(t, n, e)
                })
            } else t = this._generateNode(t, n, e)
        }
        if (e.hasChildNodes()) {
            const n = e.children;
            for (let e = 0; e < n.length; e += 1) this._generateInstance(n[e], t)
        }
        return t
    }

    _generateNode(e, t, n) {
        const r = e.ownerDocument.createElement(t);
        return 0 === n.children.length && (r.textContent = n.textContent), e.appendChild(r), e = r
    }

    async _initUI() {
        await this._lazyCreateInstance(), await this.refresh(), this.classList.add("fx-ready"), this.ready = !0, this.dispatchEvent(new CustomEvent("ready", {}))
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
        const {level: t} = e.detail, n = e.detail.message;
        this._showMessage(t, n)
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

customElements.define("fx-fore", pt);

class ft extends (st(HTMLElement)) {
    constructor() {
        super(), this.attachShadow({mode: "open"})
    }

    connectedCallback() {
        this.methods = ["get", "put", "post", "delete", "head", "urlencoded-post"], this.model = this.parentNode, this.hasAttribute("id"), this.id = this.getAttribute("id"), this.instance = this.hasAttribute("instance") ? this.getAttribute("instance") : null, this.method = this.hasAttribute("method") ? this.getAttribute("method") : "get", this.nonrelevant = this.hasAttribute("nonrelevant") ? this.getAttribute("nonrelevant") : "remove", this.replace = this.hasAttribute("replace") ? this.getAttribute("replace") : "all", this.serialization = this.hasAttribute("serialization") ? this.getAttribute("serialization") : "xml", this.hasAttribute("url"), this.url = this.getAttribute("url"), this.targetref = this.hasAttribute("targetref") ? this.getAttribute("targetref") : null, this.mediatype = this.hasAttribute("mediatype") ? this.getAttribute("mediatype") : "application/xml", this.validate = this.getAttribute("validate") ? this.getAttribute("validate") : "true", this.shadowRoot.innerHTML = this.renderHTML()
    }

    renderHTML() {
        return "\n      <slot></slot>\n    "
    }

    async submit() {
        await this.dispatch("submit", {submission: this}), this._submit()
    }

    async _submit() {
        this.evalInContext();
        const e = this.getModel();
        if (e.recalculate(), this.validate) {
            if (!e.revalidate()) return
        }
        await this._serializeAndSend()
    }

    _evaluateAttributeTemplateExpression(e, t) {
        const n = e.match(/{[^}]*}/g);
        return n && n.forEach(n => {
            const r = n.substring(1, n.length - 1), a = Ze(r, ot(t, r), this.getOwnerForm()), i = e.replaceAll(n, a);
            e = i
        }), e
    }

    async _serializeAndSend() {
        const e = this._evaluateAttributeTemplateExpression(this.url, this), t = this.getInstance();
        if ("xml" !== t.type) return;
        let n;
        if ("none" === this.serialization) n = void 0; else {
            const e = this.selectRelevant();
            n = this._serialize(t.type, e)
        }
        if ("get" === this.method.toLowerCase() && (n = void 0), "#echo" === e) {
            let e;
            return e = n ? (new DOMParser).parseFromString(n, "application/xml") : void 0, this._handleResponse(e), void this.dispatch("submit-done", {})
        }
        const r = this._getHeaders();
        if ("urlencoded-post" === this.method && (this.method = "post"), !this.methods.includes(this.method.toLowerCase())) return void this.dispatch("error", {message: "Unknown method " + this.method});
        const a = await fetch(e, {method: this.method, mode: "cors", credentials: "include", headers: r, body: n});
        if (!a.ok || a.status > 400) return void this.dispatch("submit-error", {message: "Error while submitting " + this.id});
        const i = a.headers.get("content-type").toLowerCase();
        if (i.startsWith("text/plain") || i.startsWith("text/html")) {
            const e = await a.text();
            this._handleResponse(e)
        } else if (i.startsWith("application/json")) {
            const e = await a.json();
            this._handleResponse(e)
        } else if (i.startsWith("application/xml")) {
            const e = await a.text(), t = (new DOMParser).parseFromString(e, "application/xml");
            this._handleResponse(t)
        } else {
            const e = await a.blob();
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
        const e = new Headers, t = this.getInstance(), n = je.getContentType(t, this.method);
        e.append("Content-Type", n), e.has("Accept") && e.delete("Accept");
        const r = this.querySelectorAll("fx-header");
        return Array.from(r).forEach(t => {
            const {name: n} = t, r = t.getValue();
            e.append(n, r)
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
        if ("instance" === this.replace) {
            const t = this._getTargetInstance();
            if (!t) throw new Error("target instance not found: " + t);
            if (this.targetref) {
                const n = Qe(this.targetref, t.instanceData.firstElementChild, this), r = e.firstElementChild;
                n.parentNode.replaceChild(r, n)
            } else {
                const n = e;
                t.instanceData = n
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
        const {childNodes: n} = e;
        return Array.from(n).forEach(e => {
            if (this._isRelevant(e)) {
                const n = e.cloneNode(!1);
                t.appendChild(n);
                const {attributes: r} = e;
                return r && Array.from(r).forEach(e => {
                    this._isRelevant(e) ? n.setAttribute(e.nodeName, e.value) : "empty" === this.nonrelevant ? n.setAttribute(e.nodeName, "") : n.removeAttribute(e.nodeName)
                }), this._filterRelevant(e, n)
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

customElements.define("fx-submission", ft);

class dt extends (st(HTMLElement)) {
    constructor() {
        if (super(), this.style.display = "none", this.attachShadow({mode: "open"}), this.shadowRoot.innerHTML = "", !this.hasAttribute("name")) throw new Error('required attribute "name" missing');
        this.name = this.getAttribute("name")
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = ""
    }
}

customElements.define("fx-header", dt);
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const mt = "undefined" != typeof window && null != window.customElements && void 0 !== window.customElements.polyfillWrapFlushCallback,
    vt = `{{lit-${String(Math.random()).slice(2)}}}`, gt = `\x3c!--${vt}--\x3e`, yt = e => -1 !== e.index,
    wt = () => document.createComment(""),
    At = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/,
    xt = new WeakMap, bt = e => "function" == typeof e && xt.has(e), Et = {}, Bt = {};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
class Nt {
    constructor(e, t, n) {
        this.__parts = [], this.template = e, this.processor = t, this.options = n
    }

    update(e) {
        let t = 0;
        for (const n of this.__parts) void 0 !== n && n.setValue(e[t]), t++;
        for (const e of this.__parts) void 0 !== e && e.commit()
    }

    _clone() {
        const e = mt ? this.template.element.content.cloneNode(!0) : document.importNode(this.template.element.content, !0),
            t = [], n = this.template.parts, r = document.createTreeWalker(e, 133, null, !1);
        let a, i = 0, o = 0, s = r.nextNode();
        for (; i < n.length;) if (a = n[i], yt(a)) {
            for (; o < a.index;) o++, "TEMPLATE" === s.nodeName && (t.push(s), r.currentNode = s.content), null === (s = r.nextNode()) && (r.currentNode = t.pop(), s = r.nextNode());
            if ("node" === a.type) {
                const e = this.processor.handleTextExpression(this.options);
                e.insertAfterNode(s.previousSibling), this.__parts.push(e)
            } else this.__parts.push(...this.processor.handleAttributeExpressions(s, a.name, a.strings, this.options));
            i++
        } else this.__parts.push(void 0), i++;
        return mt && (document.adoptNode(e), customElements.upgrade(e)), e
    }
}

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const Ct = window.trustedTypes && trustedTypes.createPolicy("lit-html", {createHTML: e => e}), Tt = ` ${vt} `;

class It {
    constructor(e, t, n, r) {
        this.strings = e, this.values = t, this.type = n, this.processor = r
    }

    getHTML() {
        const e = this.strings.length - 1;
        let t = "", n = !1;
        for (let r = 0; r < e; r++) {
            const e = this.strings[r], a = e.lastIndexOf("\x3c!--");
            n = (a > -1 || n) && -1 === e.indexOf("--\x3e", a + 1);
            const i = At.exec(e);
            t += null === i ? e + (n ? Tt : gt) : e.substr(0, i.index) + i[1] + i[2] + "$lit$" + i[3] + vt
        }
        return t += this.strings[e], t
    }

    getTemplateElement() {
        const e = document.createElement("template");
        let t = this.getHTML();
        return void 0 !== Ct && (t = Ct.createHTML(t)), e.innerHTML = t, e
    }
}

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const Ot = e => null === e || !("object" == typeof e || "function" == typeof e),
    St = e => Array.isArray(e) || !(!e || !e[Symbol.iterator]);

class Rt {
    constructor(e, t, n) {
        this.dirty = !0, this.element = e, this.name = t, this.strings = n, this.parts = [];
        for (let e = 0; e < n.length - 1; e++) this.parts[e] = this._createPart()
    }

    _createPart() {
        return new Dt(this)
    }

    _getValue() {
        const e = this.strings, t = e.length - 1, n = this.parts;
        if (1 === t && "" === e[0] && "" === e[1]) {
            const e = n[0].value;
            if ("symbol" == typeof e) return String(e);
            if ("string" == typeof e || !St(e)) return e
        }
        let r = "";
        for (let a = 0; a < t; a++) {
            r += e[a];
            const t = n[a];
            if (void 0 !== t) {
                const e = t.value;
                if (Ot(e) || !St(e)) r += "string" == typeof e ? e : String(e); else for (const t of e) r += "string" == typeof t ? t : String(t)
            }
        }
        return r += e[t], r
    }

    commit() {
        this.dirty && (this.dirty = !1, this.element.setAttribute(this.name, this._getValue()))
    }
}

class Dt {
    constructor(e) {
        this.value = void 0, this.committer = e
    }

    setValue(e) {
        e === Et || Ot(e) && e === this.value || (this.value = e, bt(e) || (this.committer.dirty = !0))
    }

    commit() {
        for (; bt(this.value);) {
            const e = this.value;
            this.value = Et, e(this)
        }
        this.value !== Et && this.committer.commit()
    }
}

class Gt {
    constructor(e) {
        this.value = void 0, this.__pendingValue = void 0, this.options = e
    }

    appendInto(e) {
        this.startNode = e.appendChild(wt()), this.endNode = e.appendChild(wt())
    }

    insertAfterNode(e) {
        this.startNode = e, this.endNode = e.nextSibling
    }

    appendIntoPart(e) {
        e.__insert(this.startNode = wt()), e.__insert(this.endNode = wt())
    }

    insertAfterPart(e) {
        e.__insert(this.startNode = wt()), this.endNode = e.endNode, e.endNode = this.startNode
    }

    setValue(e) {
        this.__pendingValue = e
    }

    commit() {
        if (null === this.startNode.parentNode) return;
        for (; bt(this.__pendingValue);) {
            const e = this.__pendingValue;
            this.__pendingValue = Et, e(this)
        }
        const e = this.__pendingValue;
        e !== Et && (Ot(e) ? e !== this.value && this.__commitText(e) : e instanceof It ? this.__commitTemplateResult(e) : e instanceof Node ? this.__commitNode(e) : St(e) ? this.__commitIterable(e) : e === Bt ? (this.value = Bt, this.clear()) : this.__commitText(e))
    }

    __insert(e) {
        this.endNode.parentNode.insertBefore(e, this.endNode)
    }

    __commitNode(e) {
        this.value !== e && (this.clear(), this.__insert(e), this.value = e)
    }

    __commitText(e) {
        const t = this.startNode.nextSibling, n = "string" == typeof (e = null == e ? "" : e) ? e : String(e);
        t === this.endNode.previousSibling && 3 === t.nodeType ? t.data = n : this.__commitNode(document.createTextNode(n)), this.value = e
    }

    __commitTemplateResult(e) {
        const t = this.options.templateFactory(e);
        if (this.value instanceof Nt && this.value.template === t) this.value.update(e.values); else {
            const n = new Nt(t, e.processor, this.options), r = n._clone();
            n.update(e.values), this.__commitNode(r), this.value = n
        }
    }

    __commitIterable(e) {
        Array.isArray(this.value) || (this.value = [], this.clear());
        const t = this.value;
        let n, r = 0;
        for (const a of e) n = t[r], void 0 === n && (n = new Gt(this.options), t.push(n), 0 === r ? n.appendIntoPart(this) : n.insertAfterPart(t[r - 1])), n.setValue(a), n.commit(), r++;
        r < t.length && (t.length = r, this.clear(n && n.endNode))
    }

    clear(e = this.startNode) {
        ((e, t, n = null) => {
            for (; t !== n;) {
                const n = t.nextSibling;
                e.removeChild(t), t = n
            }
        })(this.startNode.parentNode, e.nextSibling, this.endNode)
    }
}

class Mt {
    constructor(e, t, n) {
        if (this.value = void 0, this.__pendingValue = void 0, 2 !== n.length || "" !== n[0] || "" !== n[1]) throw new Error("Boolean attributes can only contain a single expression");
        this.element = e, this.name = t, this.strings = n
    }

    setValue(e) {
        this.__pendingValue = e
    }

    commit() {
        for (; bt(this.__pendingValue);) {
            const e = this.__pendingValue;
            this.__pendingValue = Et, e(this)
        }
        if (this.__pendingValue === Et) return;
        const e = !!this.__pendingValue;
        this.value !== e && (e ? this.element.setAttribute(this.name, "") : this.element.removeAttribute(this.name), this.value = e), this.__pendingValue = Et
    }
}

class Ut extends Rt {
    constructor(e, t, n) {
        super(e, t, n), this.single = 2 === n.length && "" === n[0] && "" === n[1]
    }

    _createPart() {
        return new Ft(this)
    }

    _getValue() {
        return this.single ? this.parts[0].value : super._getValue()
    }

    commit() {
        this.dirty && (this.dirty = !1, this.element[this.name] = this._getValue())
    }
}

class Ft extends Dt {
}

let Pt = !1;
(() => {
    try {
        const e = {
            get capture() {
                return Pt = !0, !1
            }
        };
        window.addEventListener("test", e, e), window.removeEventListener("test", e, e)
    } catch (e) {
    }
})();

class Ht {
    constructor(e, t, n) {
        this.value = void 0, this.__pendingValue = void 0, this.element = e, this.eventName = t, this.eventContext = n, this.__boundHandleEvent = e => this.handleEvent(e)
    }

    setValue(e) {
        this.__pendingValue = e
    }

    commit() {
        for (; bt(this.__pendingValue);) {
            const e = this.__pendingValue;
            this.__pendingValue = Et, e(this)
        }
        if (this.__pendingValue === Et) return;
        const e = this.__pendingValue, t = this.value,
            n = null == e || null != t && (e.capture !== t.capture || e.once !== t.once || e.passive !== t.passive),
            r = null != e && (null == t || n);
        n && this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options), r && (this.__options = jt(e), this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options)), this.value = e, this.__pendingValue = Et
    }

    handleEvent(e) {
        "function" == typeof this.value ? this.value.call(this.eventContext || this.element, e) : this.value.handleEvent(e)
    }
}

const jt = e => e && (Pt ? {capture: e.capture, passive: e.passive, once: e.once} : e.capture)
    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */;
const Xt = new class {
    handleAttributeExpressions(e, t, n, r) {
        const a = t[0];
        if ("." === a) {
            return new Ut(e, t.slice(1), n).parts
        }
        if ("@" === a) return [new Ht(e, t.slice(1), r.eventContext)];
        if ("?" === a) return [new Mt(e, t.slice(1), n)];
        return new Rt(e, t, n).parts
    }

    handleTextExpression(e) {
        return new Gt(e)
    }
};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */"undefined" != typeof window && (window.litHtmlVersions || (window.litHtmlVersions = [])).push("1.4.1");
const _t = (e, ...t) => new It(e, t, "html", Xt)
    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */;
void 0 === window.ShadyCSS || window.ShadyCSS.prepareTemplateDom
    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */, window.JSCompiler_renameProperty = (e, t) => e
/**
 @license
 Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at
 http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
 http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
 found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
 part of the polymer project is also subject to an additional IP rights grant
 found at http://polymer.github.io/PATENTS.txt
 */;
const Lt = window.ShadowRoot && (void 0 === window.ShadyCSS || window.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype,
    kt = Symbol();

class Yt {
    constructor(e, t) {
        if (t !== kt) throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
        this.cssText = e
    }

    get styleSheet() {
        return void 0 === this._styleSheet && (Lt ? (this._styleSheet = new CSSStyleSheet, this._styleSheet.replaceSync(this.cssText)) : this._styleSheet = null), this._styleSheet
    }

    toString() {
        return this.cssText
    }
}

const qt = (e, ...t) => {
    const n = t.reduce((t, n, r) => t + (e => {
        if (e instanceof Yt) return e.cssText;
        if ("number" == typeof e) return e;
        throw new Error(`Value passed to 'css' function must be a 'css' function result: ${e}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`)
    })(n) + e[r + 1], e[0]);
    return new Yt(n, kt)
};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
(window.litElementVersions || (window.litElementVersions = [])).push("2.4.0");

class Vt extends (st(HTMLElement)) {
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
            if (this.modelItem = this.getModelItem(), this.modelItem instanceof nt) {
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
            let n = parseFloat(e.style.opacity);
            (n += .1) > 1 || (e.style.opacity = n, requestAnimationFrame(t))
        }()
    }
}

window.customElements.define("fx-abstract-control", Vt);
customElements.define("fx-alert", class extends Vt {
    static get styles() {
        return qt`:host{display:block;height:auto;font-size:.8em;font-weight:400;color:red;display:none}`
    }

    constructor() {
        super(), this.style.display = "none"
    }

    static get properties() {
        return {...super.properties}
    }

    render() {
        return _t`<slot></slot>`
    }

    async updateWidgetValue() {
        this.innerHTML = this.value
    }
});

class Qt extends Vt {
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
        const t = this.getModelItem(), n = this.shadowRoot.getElementById("setvalue");
        n.setValue(t, e), n.actionPerformed()
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
            const e = t.getAttribute("ref"), n = Qe(e, ot(this, e), this), {children: r} = t;
            if (Array.from(r).forEach(e => {
                "template" !== e.nodeName.toLowerCase() && e.parentNode.removeChild(e)
            }), this.template) if (n.length) Array.from(n).forEach(e => {
                const t = this.createEntry();
                this.updateEntry(t, e)
            }); else {
                const e = this.createEntry();
                this.updateEntry(e, n)
            }
        }
        je.refreshChildren(this, e)
    }

    updateEntry(e, t) {
        if ("SELECT" !== this.widget.nodeName) return;
        const n = this._getValueAttribute(e), r = n.value, a = Qe(r.substring(1, r.length - 1), t, e);
        n.value = a, this.value === a && e.setAttribute("selected", "selected");
        const i = e.textContent, o = Ze(i.substring(1, i.length - 1), t, e);
        e.textContent = o
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

window.customElements.define("fx-control", Qt);

class Jt extends (st(HTMLElement)) {
    constructor() {
        super(), this.attachShadow({mode: "open"})
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = "\n            <style>\n                \n        :host {\n            display: block;\n        }\n    \n            </style>\n            \n      <slot></slot>\n    \n    ", this.getOwnerForm().registerLazyElement(this)
    }

    refresh(e) {
        !e && this.hasAttribute("refresh-on-view") || (this.isBound() && (this.evalInContext(), this.modelItem = this.getModelItem()), this._getForm().ready && this.handleModelItemProperties(), je.refreshChildren(this, e))
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

window.customElements.define("fx-container", Jt);
window.customElements.define("fx-group", class extends Jt {
    static get properties() {
        return {...super.properties, collapse: {type: Boolean, reflect: !0}}
    }

    constructor() {
        super(), this.collapse = !1
    }

    render() {
        return _t`<slot></slot>`
    }

    handleModelItemProperties() {
        this.handleRelevant()
    }

    initializeChildren(e) {
        Array.from(e.children).forEach(e => {
            if (je.isUiElement(e.nodeName)) e.init(this.model); else if (0 !== e.children.length) {
                Array.from(e.children).forEach(e => {
                    this.initializeChildren(e)
                })
            }
        })
    }
});
customElements.define("fx-hint", class extends Vt {
    static get styles() {
        return qt`:host{display:block;height:auto;font-size:.8em;font-weight:400;font-style:italic}`
    }

    static get properties() {
        return {...super.properties}
    }

    render() {
        return _t`<slot></slot>`
    }
});
customElements.define("fx-output", class extends Vt {
    static get properties() {
        return {...super.properties, valueAttr: {type: String}}
    }

    constructor() {
        super(), this.attachShadow({mode: "open"}), this.valueAttr = this.hasAttribute("value") ? this.getAttribute("value") : null
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = '\n            <style>\n                \n          :host {\n            display: inline-block;\n          }\n          #widget {\n            display: inline-block;\n          }\n          .label{\n            display: inline-block;\n          }\n        \n            </style>\n            \n            <slot name="label"></slot>\n            <span id="value">\n                <slot></slot>\n            </span>\n        \n        ', this.addEventListener("slotchange", e => {
        })
    }

    async refresh() {
        if (this.valueAttr) return this.value = this.getValue(), void await this.updateWidgetValue();
        this.ref && super.refresh()
    }

    getValue() {
        try {
            const e = ot(this, this.valueAttr);
            return this.hasAttribute("html") ? Qe(this.valueAttr, e, this) : Ze(this.valueAttr, e, this)
        } catch (e) {
            this.dispatch("error", {message: e})
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

class Kt extends (st(HTMLElement)) {
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
        this.modelItem = this.getModel().getModelItem(this.nodeset), this.modelItem && !this.modelItem.relevant ? this.style.display = "none" : this.style.display = this.display, je.refreshChildren(this, e)
    }
}

window.customElements.define("fx-repeatitem", Kt);

class zt extends (st(HTMLElement)) {
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
            const {item: t} = e.detail, n = Array.from(this.children).indexOf(t);
            this.applyIndex(this.children[n]), this.index = n + 1
        }), this.addEventListener("index-changed", e => {
            if (e.stopPropagation(), !e.target === this) return;
            const {index: t} = e.detail;
            this.index = t, this.applyIndex(this.children[t - 1])
        }), document.addEventListener("insert", e => {
            e.detail.insertedNodes;
            this.index = e.detail.position
        }), this.getOwnerForm().lazyRefresh && (this.mutationObserver = new MutationObserver(e => {
            this.refresh(!0)
        })), this.getOwnerForm().registerLazyElement(this);
        this.shadowRoot.innerHTML = '\n            <style>\n                \n      :host{\n        display:none;\n      }\n       .fade-out-bottom {\n          -webkit-animation: fade-out-bottom 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;\n          animation: fade-out-bottom 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;\n      }\n      .fade-out-bottom {\n          -webkit-animation: fade-out-bottom 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;\n          animation: fade-out-bottom 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;\n      }\n   \n            </style>\n            \n          <slot name="header"></slot>\n          <slot></slot>\n        \n        '
    }

    init() {
        this._evalNodeset(), this._initTemplate(), this._initRepeatItems(), this.setAttribute("index", this.index), this.inited = !0
    }

    _evalNodeset() {
        const e = ot(this, this.ref);
        this.mutationObserver && e.nodeName && this.mutationObserver.observe(e, {childList: !0, subtree: !0});
        const t = Qe(this.ref, e, this.getOwnerForm());
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
        this.inited || this.init(), this._evalNodeset();
        const t = this.querySelectorAll(":scope > fx-repeatitem"), n = t.length;
        let r = 1;
        Array.isArray(this.nodeset) && (r = this.nodeset.length);
        const a = r;
        if (a < n) for (let e = n; e > a; e -= 1) {
            const n = t[e - 1];
            n.parentNode.removeChild(n), this.getOwnerForm().unRegisterLazyElement(n)
        }
        if (a > n) for (let e = n + 1; e <= a; e += 1) {
            const t = document.createElement("fx-repeatitem"), n = this._clone();
            t.appendChild(n), this.appendChild(t), t.nodeset = this.nodeset[e - 1], t.index = e
        }
        for (let e = 0; e < n; e += 1) {
            const n = t[e];
            this.getOwnerForm().registerLazyElement(n), n.nodeset !== this.nodeset[e] && (n.nodeset = this.nodeset[e])
        }
        this.getOwnerForm().lazyRefresh && !e || je.refreshChildren(this, e), this.style.display = "block", this.setIndex(this.index)
    }

    _fadeOut(e) {
        e.style.opacity = 1, function t() {
            (e.style.opacity -= .1) < 0 ? e.style.display = "none" : requestAnimationFrame(t)
        }()
    }

    _fadeIn(e) {
        e && (e.style.opacity = 0, e.style.display = this.display, function t() {
            let n = parseFloat(e.style.opacity);
            (n += .1) > 1 || (e.style.opacity = n, requestAnimationFrame(t))
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
            const n = document.createElement("fx-repeatitem");
            n.nodeset = this.nodeset[t], n.index = t + 1;
            const r = this._clone();
            n.appendChild(r), this.appendChild(n), 1 === n.index && this.applyIndex(n)
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

window.customElements.define("fx-repeat", zt);
window.customElements.define("fx-switch", class extends Jt {
    connectedCallback() {
        super.connectedCallback && super.connectedCallback();
        this.shadowRoot.innerHTML = "\n        <style>\n            \n       :host ::slotted(fx-case.selected-case){\n        display: block !important;\n    }\n    \n        </style>\n        \n       <slot></slot>\n    \n    "
    }

    refresh() {
        super.refresh();
        const e = this.querySelectorAll("fx-case");
        if (this.isBound()) Array.from(e).forEach(e => {
            e.getAttribute("name") === this.modelItem.value ? e.classList.add("selected-case") : e.classList.remove("selected-case")
        }); else {
            this.querySelector(".selected-case") || e[0].classList.add("selected-case")
        }
        je.refreshChildren(this)
    }

    toggle(e) {
        const t = this.querySelectorAll("fx-case");
        Array.from(t).forEach(t => {
            e === t ? t.classList.add("selected-case") : t.classList.remove("selected-case")
        })
    }
});
customElements.define("fx-trigger", class extends Vt {
    connectedCallback() {
        this.attachShadow({mode: "open"}), this.ref = this.hasAttribute("ref") ? this.getAttribute("ref") : null;
        this.shadowRoot.innerHTML = `\n                <style>\n                    \n          :host {\n            cursor:pointer;\n          }\n        \n                </style>\n                ${this.renderHTML()}\n        `;
        const e = this.shadowRoot.querySelector("slot");
        e.addEventListener("slotchange", () => {
            const t = e.assignedElements({flatten: !0});
            t[0].setAttribute("tabindex", "0"), t[0].setAttribute("role", "button");
            const n = t[0];
            n.addEventListener("click", e => this.performActions(e)), this.widget = n, "BUTTON" !== n.nodeName && n.addEventListener("keypress", e => {
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
        return null
    }

    handleReadonly() {
        super.handleReadonly(), this.widget.hasAttribute("readonly") ? this.widget.setAttribute("disabled", "disabled") : this.widget.removeAttribute("disabled")
    }

    async performActions(e) {
        const t = this.closest("fx-repeatitem");
        t && t.click();
        (async () => {
            for (let t = 0; t < this.children.length; t += 1) {
                const n = this.children[t];
                "function" == typeof n.execute && await n.execute(e)
            }
        })()
    }
});

class Zt extends HTMLElement {
    constructor() {
        super(), this.attachShadow({mode: "open"})
    }

    connectedCallback() {
        this.hasAttribute("label") && (this.label = this.getAttribute("label")), this.hasAttribute("name") && (this.name = this.getAttribute("name")), this.hasAttribute("selected") && (this.selected = this.getAttribute("selected"));
        const e = `\n           ${this.label ? `<span>${this.label}</span>` : ""}\n           <slot></slot>\n        `;
        this.shadowRoot.innerHTML = `\n            <style>\n                \n            :host {\n                display: none;\n            }\n        \n            </style>\n            ${e}\n    `, this.style.display = "none"
    }
}

window.customElements.define("fx-case", Zt);

async function Wt(e) {
    return new Promise(t => setTimeout(() => t(), e))
}

customElements.define("fx-items", class extends Qt {
    static get properties() {
        return {...super.properties, valueAttr: {type: String}}
    }

    constructor() {
        super(), this.valueAttr = this.hasAttribute("value") ? this.getAttribute("value") : null
    }

    connectedCallback() {
        super.connectedCallback(), this.addEventListener("click", e => {
            const t = this.querySelectorAll("[value]");
            let n;
            "LABEL" === e.target.nodeName && (n = document.getElementById(e.target.getAttribute("for")), n.checked = !n.checked);
            let r = "";
            Array.from(t).forEach(e => {
                e.checked && (r += " " + e.getAttribute("value"))
            }), this.setAttribute("value", r.trim());
            const a = this.parentNode.closest("[ref]");
            if (!a) return;
            const i = a.getModelItem(), o = this.shadowRoot.getElementById("setvalue");
            o.setValue(i, r.trim()), o.actionPerformed()
        })
    }

    getWidget() {
        return this
    }

    async updateWidgetValue() {
        const e = this.parentNode.closest("[ref]");
        e && (this.value = e.value), this.setAttribute("value", this.value)
    }

    updateEntry(e, t) {
        const n = e.querySelector("label");
        n.textContent = t.textContent;
        const r = je.createUUID();
        n.setAttribute("for", r);
        const a = e.querySelector("[value]"), i = a.value, o = Qe(i.substring(1, i.length - 1), t, e),
            s = this.getAttribute("value");
        a.value = o, a.setAttribute("id", r), -1 !== s.indexOf(a.value) && (a.checked = !0)
    }
});

class $t extends (st(HTMLElement)) {
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
        if (e && e.detail && (this.detail = e.detail), this.needsUpdate = !1, this.evalInContext(), this.targetElement && this.targetElement.nodeset && (this.nodeset = this.targetElement.nodeset), !this.ifExpr || ze(this.ifExpr, this.nodeset, this.getOwnerForm())) {
            if (this.whileExpr) {
                const e = async () => {
                    await Wt(this.delay || 0), this.ownerDocument.contains(this) && ze(this.whileExpr, this.nodeset, this.getOwnerForm()) && (this.perform(), await e())
                };
                return await e(), void this.actionPerformed()
            }
            !this.delay || (await Wt(this.delay), this.ownerDocument.contains(this)) ? (this.perform(), this.actionPerformed()) : this.actionPerformed()
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
        this.dispatchEvent(new CustomEvent("action-performed", {composed: !0, bubbles: !0, detail: {}}))
    }
}

window.customElements.define("abstract-action", $t);
window.customElements.define("fx-append", class extends $t {
    static get properties() {
        return {ref: {type: String}, repeat: {type: String}, clear: {type: String}}
    }

    constructor() {
        super(), this.repeat = ""
    }

    connectedCallback() {
        super.connectedCallback(), this.ref = this.getAttribute("ref"), this.repeat = this.getAttribute("repeat")
    }

    perform() {
        super.perform(), this._dataFromTemplate(), this.needsUpdate = !0
    }

    actionPerformed() {
        super.actionPerformed(), this.dispatch()
    }

    _dataFromTemplate() {
        const e = this.getInScopeContext(), t = this.getOwnerForm().querySelector("#" + this.repeat),
            n = t.shadowRoot.querySelector("template"), r = e.ownerDocument.createElement(t.ref),
            a = this._generateInstance(n.content, r);
        e.appendChild(a)
    }

    dispatch() {
        let e;
        e = je.isRepeated(this) ? je.getRepeatTarget(this, this.repeat) : document.getElementById(this.repeat), e.dispatchEvent(new CustomEvent("index-changed", {
            composed: !0,
            bubbles: !0,
            detail: {index: e.nodeset.length}
        }))
    }

    _clear(e) {
        let t = e.firstChild;
        const n = e.attributes;
        for (let e = 0; e < n.length; e += 1) n[e].value = "";
        for (; t;) 1 === t.nodeType && t.hasAttributes() && (t.textContent = ""), this._clear(t), t = t.nextSibling
    }

    _generateInstance(e, t) {
        if (1 === e.nodeType && e.hasAttribute("ref")) {
            const n = e.getAttribute("ref");
            let r;
            "." === n || (n.startsWith("@") ? t.setAttribute(n.substring(1), "") : (r = document.createElement(n), t.appendChild(r), 0 === e.children.length && (r.textContent = e.textContent)))
        }
        if (e.hasChildNodes()) {
            const n = e.children;
            for (let e = 0; e < n.length; e += 1) this._generateInstance(n[e], t)
        }
        return t
    }

    getInstanceId() {
        return this.ref.startsWith("instance(") ? "not implemented" : "default"
    }
});
window.customElements.define("fx-delete", class extends $t {
    constructor() {
        super(), this.repeatId = ""
    }

    perform() {
        if (super.perform(), "" === this.repeatId) {
            const e = this.parentNode.closest("fx-repeatitem"), t = Array.from(e.parentNode.children).indexOf(e) + 1;
            this.model = this.getModel();
            const n = this.parentNode.closest("fx-repeat");
            let r;
            r = Array.isArray(this.nodeset) ? this.nodeset[t - 1] : this.nodeset;
            r.parentNode.removeChild(r), e.parentNode.removeChild(e);
            const {repeatSize: a} = n;
            1 === t || 1 === a ? n.setIndex(1) : t > a ? n.setIndex(a) : n.setIndex(t)
        }
        this.needsUpdate = !0
    }

    actionPerformed() {
        this.getModel().rebuild(), super.actionPerformed()
    }
});
window.customElements.define("fx-insert", class extends $t {
    constructor() {
        super(), this.attachShadow({mode: "open"})
    }

    connectedCallback() {
        super.connectedCallback && super.connectedCallback();
        this.shadowRoot.innerHTML = "\n        <style>\n            \n        :host{\n            display:none;\n        }\n    \n        </style>\n        <slot></slot>\n    ", this.at = Number(this.hasAttribute("at") ? this.getAttribute("at") : 0), this.position = this.hasAttribute("position") ? this.getAttribute("position") : "after", this.origin = this.hasAttribute("origin") ? this.getAttribute("origin") : null, this.keepValues = !!this.hasAttribute("keep-values")
    }

    _cloneOriginSequence(e, t) {
        let n;
        if (this.origin) {
            let t;
            try {
                t = Je(this.origin, e, this.getOwnerForm()), Array.isArray(t) && 0 === t.length && (n = null), n = t.cloneNode(!0)
            } catch (e) {
            }
        } else t && (n = this._cloneTargetSequence(t), n && !this.keepValues && this._clear(n));
        return n
    }

    _getInsertIndex(e, t) {
        return 0 === t.length ? null : this.hasAttribute("at") ? We(this.getAttribute("at"), e, this.getOwnerForm()) : t.length
    }

    perform() {
        const e = ot(this, this.ref), t = Ke(this.ref, e, this.getOwnerForm()), n = this._cloneOriginSequence(e, t);
        if (!n) return;
        let r, a;
        this._getInsertIndex(e, t);
        if (0 === t.length) r = e, e.appendChild(n), a = 1; else {
            if (this.hasAttribute("at") ? (a = We(this.getAttribute("at"), e, this.getOwnerForm()), r = t[a - 1]) : (a = t.length, r = t[t.length - 1]), !r) {
                a = 1, r = t;
                a = Qe("count(preceding::*)", t, this.getOwnerForm()) + 1
            }
            this.position && "before" === this.position && r.parentNode.insertBefore(n, r), this.position && "after" === this.position && (a += 1, r.insertAdjacentElement("afterend", n))
        }
        document.dispatchEvent(new CustomEvent("insert", {
            composed: !0,
            bubbles: !0,
            detail: {insertedNodes: n, position: a}
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
        let n = e.firstChild;
        for (; n;) 1 === n.nodeType && n.hasAttributes() && (n.textContent = ""), this._clear(n), n = n.nextSibling
    }
});
window.customElements.define("fx-message", class extends $t {
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
window.customElements.define("fx-setvalue", class extends $t {
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
        e = null !== this.valueAttr ? Qe(this.valueAttr, this.nodeset, this.getOwnerForm(), this.detail) : "" !== this.textContent ? this.textContent : "";
        const t = this.getModelItem();
        this.setValue(t, e)
    }

    setValue(e, t) {
        const n = e;
        n && n.value !== t && (n.value = t, n.changed = !0, this.needsUpdate = !0)
    }
});
window.customElements.define("fx-send", class extends $t {
    constructor() {
        super(), this.value = ""
    }

    connectedCallback() {
        super.connectedCallback(), this.submission = this.getAttribute("submission")
    }

    perform() {
        super.perform();
        const e = this.getModel().querySelector("#" + this.submission);
        if (null === e) throw this.dispatchEvent(new CustomEvent("error", {
            composed: !0,
            bubbles: !0,
            detail: {message: `fx-submission element with id: '${this.submission}' not found`}
        })), new Error(`submission with id: ${this.submission} not found`);
        e.submit()
    }
});

class en extends $t {
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
            this.innerHTML = "";
            const e = document.createElement("script");
            e.src = this.src, this.appendChild(e)
        } else Array.from(e).forEach(e => {
            e.detail = this.detail, e.execute()
        }), this.dispatchActionPerformed()
    }
}

window.customElements.define("fx-action", en);
window.customElements.define("fx-toggle", class extends en {
    connectedCallback() {
        this.hasAttribute("case") && (this.case = this.getAttribute("case"))
    }

    execute() {
        if (this.case) {
            const e = this.getOwnerForm().querySelector("#" + this.case);
            e.parentNode.toggle(e)
        }
    }
});
window.customElements.define("fx-dispatch", class extends $t {
    constructor() {
        super(), this.name = null, this.targetid = null, this.details = null, this.attachShadow({mode: "open"})
    }

    connectedCallback() {
        if (super.connectedCallback(), this.name = this.getAttribute("name"), !this.name) throw new Error("no event specified for dispatch", this);
        this.targetid = this.hasAttribute("targetid") ? this.getAttribute("targetid") : null
    }

    perform() {
        const e = this.querySelectorAll("fx-property"), t = {};
        if (Array.from(e).forEach(e => {
            const n = e.getAttribute("name"), r = e.getAttribute("value"), a = e.getAttribute("expr");
            if (a) {
                if (r) throw new Error('if "expr" is given there must not be a "value" attribute');
                const e = Qe(a, this.getInScopeContext(), this.getOwnerForm());
                let i = null;
                if (e.nodeName) {
                    i = (new XMLSerializer).serializeToString(e)
                }
                t[n] = i || e
            }
            r && (t[n] = r)
        }), this.targetid) {
            let e;
            if (e = Fe.isRepeated(this) ? $e(this.targetid, this.parentNode, null) : document.getElementById(this.targetid), !e) throw new Error(`targetid ${this.targetid} does not exist in document`);
            e.dispatchEvent(new CustomEvent(this.name, {composed: !0, bubbles: !0, detail: t}))
        } else document.dispatchEvent(new CustomEvent(this.name, {composed: !0, bubbles: !0, detail: t}))
    }
});
window.customElements.define("fx-update", class extends $t {
    perform() {
        this.getModel().updateModel()
    }
});
window.customElements.define("fx-refresh", class extends $t {
    perform() {
        this.getOwnerForm().refresh()
    }
});
window.customElements.define("fx-confirm", class extends en {
    connectedCallback() {
        this.message = this.hasAttribute("message") ? this.getAttribute("message") : null
    }

    perform() {
        window.confirm(this.message) && super.perform()
    }
});

class tn extends (st(HTMLElement)) {
    constructor() {
        super(), this.attachShadow({mode: "open"})
    }

    connectedCallback() {
        this.style.display = "none", this.signature = this.hasAttribute("signature") ? this.getAttribute("signature") : null, this.signature, this.type = this.hasAttribute("type") ? this.getAttribute("type") : null, this.shadowRoot.innerHTML = "<slot></slot>", this.override = this.hasAttribute("override") ? this.getAttribute("override") : "true", this.functionBody = this.innerText;
        const e = this.getAttribute("type") || "text/xpath",
            t = this.signature.match(/(?:(?<prefix>[^:]*):)?(?<localName>[^(]+)\((?<params>(?:\(\)|[^)])*)\)(?: as (?<returnType>.*))?/);
        if (!t) throw new Error(`Function signature ${this.signature} could not be parsed`);
        const {prefix: n, localName: r, params: a, returnType: i} = t.groups, o = "local" === n ? {
            namespaceURI: "http://www.w3.org/2005/xquery-local-functions",
            localName: r
        } : `${n}:${r}`, s = a ? a.split(",").map(e => {
            const t = e.match(/(?<variableName>\$[^\s]+)(?:\sas\s(?<varType>.+))/);
            if (!t) throw new Error(`Param ${e} could not be parsed`);
            const {variableName: n, varType: r} = t.groups;
            return {variableName: n, variableType: r || "item()*"}
        }) : [];
        switch (e) {
            case"text/javascript": {
                const e = new Function("_domFacade", ...s.map(e => e.variableName), "form", this.functionBody);
                Ge(o, s.map(e => e.variableType), i || "item()*", (...t) => e.apply(this.getInScopeContext(), [...t, this.getOwnerForm()]));
                break
            }
            case"text/xpath": {
                const e = (e, ...t) => Qe(this.functionBody, this.getInScopeContext(), this.getOwnerForm(), s.reduce((e, n, r) => (e[n.variableName.replace("$", "")] = t[r], e), {}));
                Ge(o, s.map(e => e.variableType), i || "item()*", e);
                break
            }
            default:
                throw new Error(`Unexpected mimetype ${e} for function`)
        }
    }
}

customElements.define("fx-function", tn);
//# sourceMappingURL=fore-all.js.map
