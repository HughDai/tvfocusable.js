var __extends = this && this.__extends || function () {
  var p = function (h, a) {
    p = Object.setPrototypeOf || {
      __proto__: []
    }
    instanceof Array && function (b, c) {
      b.__proto__ = c
    } || function (b, c) {
      for (var d in c) c.hasOwnProperty(d) && (b[d] = c[d])
    };
    return p(h, a)
  };
  return function (h, a) {
    function b() {
      this.constructor = h
    }
    p(h, a);
    h.prototype = null === a ? Object.create(a) : (b.prototype = a.prototype, new b)
  }
}();
(function () {
  if ("function" === typeof window.CustomEvent) return !1;
  var p = function (h, a) {
    a = a || {
      bubbles: !1,
      cancelable: !1,
      detail: void 0
    };
    var b = document.createEvent("CustomEvent");
    b.initCustomEvent(h, a.bubbles, a.cancelable, a.detail);
    return b
  };
  p.prototype = window.Event.prototype;
  window.CustomEvent = p
})();
var initData = {
    KEYS: {
      KEY_LEFT: [37, 21],
      KEY_UP: [38, 19],
      KEY_RIGHT: [39, 22],
      KEY_DOWN: [40, 20],
      KEY_ENTER: [13, 23]
    },
    scrollEl: null,
    focusClassName: "focus",
    initDis: 20,
    longPressTime: 500,
    findFocusType: 1,
    distanceToCenter: !1,
    offsetDistance: 50,
    limitingEl: null,
    formAutofocus: !0,
    focusableClassName: "",
    itemAttrname: "focusable",
    scrollSpeedX: 0,
    scrollSpeedY: 0
  },
  eventType = {
    LEFT: "left",
    UP: "up",
    RIGHT: "right",
    DOWN: "down"
  },
  focusdisableAttrname = "focusdisable",
  leftEvent = {
    type: eventType.LEFT,
    event: new CustomEvent(eventType.LEFT, {
      detail: {}
    })
  },
  rightEvent = {
    type: eventType.RIGHT,
    event: new CustomEvent(eventType.RIGHT, {
      detail: {}
    })
  },
  upEvent = {
    type: eventType.UP,
    event: new CustomEvent(eventType.UP, {
      detail: {}
    })
  },
  downEvent = {
    type: eventType.DOWN,
    event: new CustomEvent(eventType.DOWN, {
      detail: {}
    })
  };
document.addEventListener("readystatechange", function () {
  "complete" == document.readyState && (leftEvent = {
    type: eventType.LEFT,
    event: new CustomEvent(eventType.LEFT, {
      detail: {}
    })
  }, rightEvent = {
    type: eventType.RIGHT,
    event: new CustomEvent(eventType.RIGHT, {
      detail: {}
    })
  }, upEvent = {
    type: eventType.UP,
    event: new CustomEvent(eventType.UP, {
      detail: {}
    })
  }, downEvent = {
    type: eventType.DOWN,
    event: new CustomEvent(eventType.DOWN, {
      detail: {}
    })
  })
}, !1);
var FocusData = function () {
    return function () {
      this._KEYS = initData.KEYS;
      this._scrollEl = initData.scrollEl;
      this._itemAttrname = initData.itemAttrname;
      this._focusClassName = initData.focusClassName;
      this._initDis = initData.initDis;
      this._findFocusType = initData.findFocusType;
      this._offsetDistance = initData.offsetDistance;
      this._longPressTime = initData.longPressTime;
      this._limitingEl = initData.limitingEl;
      this._distanceToCenter = initData.distanceToCenter;
      this._formAutofocus = initData.formAutofocus;
      this._focusableClassName =
        initData.focusableClassName;
      this._scrollSpeedX = initData.scrollSpeedX;
      this._scrollSpeedY = initData.scrollSpeedY;
      this._smoothTime = 200;
      this._spacingTime = 20;
      this.eventDisabled = "";
      this.focusOriginalEl = this.focusOriginalSize = this.lastOpt = this.scrollTimer = null;
      this.focusedAttrname = "focused";
      this.eventdata = eventType;
      this.leftEvent = leftEvent;
      this.rightEvent = rightEvent;
      this.upEvent = upEvent;
      this.downEvent = downEvent
    }
  }(),
  FocusUtils = function (p) {
    function h() {
      var a = null !== p && p.apply(this, arguments) || this;
      a.hasClass =
        function (b, c) {
          return b.classList.contains(c)
        };
      a.toggleClass = function (b, c) {
        return b.classList.toggle(c)
      };
      a.parentfocusables = function (b, c) {
        if (!(b instanceof HTMLElement || b instanceof HTMLCanvasElement)) return console.warn("receive only HTMLElement/HTMLCanvasElement");
        null !== b.parentElement.getAttribute("" + a._itemAttrname) && (c = b.parentElement, b.removeAttribute("" + a._itemAttrname));
        return "none" === window.getComputedStyle(b.parentElement).display ? null : "BODY" !== b.parentElement.nodeName ? a.parentfocusables(b.parentElement,
          c) : c
      };
      a.removeOneClassName = function (b, c) {
        b && a.hasClass(b, c) && a.toggleClass(b, c)
      };
      a.getElementByPath = function (b) {
        return document.evaluate(b, document).iterateNext()
      };
      a.getElementsByPath = function (b) {
        b = document.evaluate(b, document, null, XPathResult.ANY_TYPE, null);
        var c = [],
          d = b.iterateNext();
        for (d && c.push(d); d;)(d = b.iterateNext()) && c.push(d);
        return c
      };
      a.readXPath = function (b) {
        if ("" !== b.id) return "\/\/*[@id=" + b.id + "]";
        if (b == document.body) return "/html/" + b.tagName.toLowerCase();
        for (var c = 1, d = b.parentNode.childNodes,
            e = 0, m = d.length; e < m; e++) {
          var k = d[e];
          if (k == b) {
            if (b.parentNode) return a.readXPath(b.parentNode) + "/" + b.tagName.toLowerCase() + "[" + c + "]"
          } else 1 == k.nodeType && k.tagName == b.tagName && c++
        }
      };
      a.addClassName = function (b, c) {
        b && a.toggleClass(b, c)
      };
      a.addAttrName = function (b, c) {
        a.focusOriginalEl !== b && (a.focusOriginalSize = b.getBoundingClientRect(), a.focusOriginalEl = b);
        var d = document.querySelector("[" + a.focusedAttrname + "]");
        d && (d.removeAttribute(c), d.dispatchEvent(new CustomEvent("onBlur", {
          detail: {
            el: d
          }
        })), d.dispatchEvent(new CustomEvent("on-blur", {
          detail: {
            el: d
          }
        })), a.removeOneClassName(d, a._focusClassName), a._formAutofocus && ("INPUT" === d.tagName.toLocaleUpperCase() || "SELECT" === d.tagName.toLocaleUpperCase() || "TEXTAREA" === d.tagName.toLocaleUpperCase()) && d.blur());
        b.setAttribute(c, "");
        c === a.focusedAttrname && (a.addClassName(b, a._focusClassName), b.dispatchEvent(new CustomEvent("onFocus", {
          detail: {
            el: b
          }
        })), b.dispatchEvent(new CustomEvent("on-focus", {
          detail: {
            el: b
          }
        })))
      };
      a.inNode = function (b, c) {
        return c !== b && c.contains(b)
      };
      a.preventDefault = function (b) {
        b =
          b || window.event;
        b.preventDefault && b.preventDefault();
        b.returnValue = !1
      };
      a.onEvent = function (b, c, d) {
        return b.dispatchEvent(new CustomEvent(c, {
          detail: d
        }))
      };
      a.offEvent = function (b, c, d, e) {
        void 0 === e && (e = !1);
        return b.removeEventListener(c, d, e)
      };
      return a
    }
    __extends(h, p);
    h.prototype.Scroll2 = function (a) {
      var b = this;
      if (!a.time) return a.setNumFn && a.setNumFn(a.number), a.number;
      null != this.scrollTimer && (clearInterval(this.scrollTimer), this.lastOpt.setNumFn && this.lastOpt.setNumFn(this.lastOpt.number));
      this.lastOpt =
        a;
      var c = a.time / this._spacingTime;
      c = 1 > c ? 1 : c;
      var d = 0;
      a.getNumFn && (d = a.getNumFn());
      var e = (a.number - d) / c;
      this.scrollTimer = setInterval(function () {
        0 < c ? (c--, b.Scroll2({
          number: d += e,
          getNumFn: a.getNumFn,
          setNumFn: a.setNumFn
        })) : (clearInterval(b.scrollTimer), b.scrollTimer = null, b.lastOpt = null)
      }, this._spacingTime)
    };
    return h
  }(FocusData),
  FocusCore = function (p) {
    function h() {
      var a = null !== p && p.apply(this, arguments) || this;
      a.timedifX = 0;
      a.timedifY = 0;
      a.keyEvent = function (b, c) {
        a.eventDisabled = "event";
        if (c) {
          if (0 < a._scrollSpeedX ||
            0 < a._scrollSpeedY)
            if (b.event.type === eventType.LEFT || b.event.type === eventType.RIGHT) {
              var d = Date.now();
              if (d - a.timedifX < a._scrollSpeedX) return;
              a.timedifX = d
            } else if (b.event.type === eventType.UP || b.event.type === eventType.DOWN) {
            d = Date.now();
            if (d - a.timedifY < a._scrollSpeedY) return;
            a.timedifY = d
          }
          c.dispatchEvent(new CustomEvent(b.type, {
            detail: {}
          }))
        }
        "eventSkip" === a.eventDisabled ? a.eventDisabled = "" : a.setFocus(b.type)
      };
      a.setFocus = function (b) {
        var c = a.getNextFocusElement(b);
        if (null !== c && (c = a.parentfocusables(c, c),
            null !== c)) {
          for (var d = c.querySelectorAll("[" + a._itemAttrname + "]"), e = 0; e < d.length; e++) d[e].removeAttribute("" + a._itemAttrname);
          c && (a.addAttrName(c, a.focusedAttrname), a._formAutofocus && "SELECT" === c.tagName.toLocaleUpperCase() && c.focus());
          a.doScroll(c, !0, b)
        }
      };
      a.scrollFn = function (b, c, d) {
        void 0 === d && (d = !0);
        a.Scroll2({
          number: b,
          time: d ? a._smoothTime : 0,
          getNumFn: function () {
            if ("scrollTop" === c) return a._scrollEl ? a._scrollEl.scrollTop : document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset;
            if ("scrollLeft" === c) return a._scrollEl ? a._scrollEl.scrollLeft : document.body.scrollLeft || document.documentElement.scrollLeft || window.pageXOffset
          },
          setNumFn: function (e) {
            "scrollTop" === c && (a._scrollEl ? a._scrollEl.scrollTop = e : document.body.scrollTop = document.documentElement.scrollTop = e);
            "scrollLeft" === c && (a._scrollEl ? a._scrollEl.scrollLeft = e : document.body.scrollLeft = document.documentElement.scrollLeft = e)
          }
        })
      };
      a.doScroll = function (b, c, d) {
        void 0 === c && (c = !0);
        b = b && b.length && b[0] || b;
        if ((!a._scrollEl || a.inNode(b,
            a._scrollEl)) && b) {
          b = b.getBoundingClientRect();
          if (a._scrollEl) {
            var e = a._scrollEl.scrollTop;
            var m = a._scrollEl.scrollLeft;
            var k = a._scrollEl.getBoundingClientRect();
            var w = k.height;
            var g = k.width;
            var q = b.left - k.left;
            k = b.top - k.top
          } else e = document.body.scrollTop || document.documentElement.scrollTop || window.pageXOffset, m = document.body.scrollLeft || document.documentElement.scrollLeft || window.pageYOffset, g = document.documentElement.clientWidth || document.body.clientWidth, w = document.documentElement.clientHeight ||
            document.body.clientHeight, q = b.left, k = b.top;
          var l = g / 2,
            u = w / 2,
            v = q + b.width / 2,
            x = k + b.height / 2;
          a._distanceToCenter ? "down" === d || "up" === d ? a.scrollFn(x + e - u, "scrollTop", c) : "left" === d || "right" === d ? a.scrollFn(v + m - l, "scrollLeft", c) : b.top > b.left ? (a.scrollFn(v + m - l, "scrollLeft", c), a.scrollFn(x + e - u, "scrollTop", c)) : (a.scrollFn(x + e - u, "scrollTop", c), a.scrollFn(v + m - l, "scrollLeft", c)) : (d = k + b.height, d > w && (d = d - w + e + a._offsetDistance, a.scrollFn(d, "scrollTop", c)), 0 > k && (d = k + e - a._offsetDistance, a.scrollFn(d, "scrollTop", c)), d =
            q + b.width, d > g && (d = d - g + m + a._offsetDistance, a.scrollFn(d, "scrollLeft", c)), 0 > q && (d = q + m - a._offsetDistance, a.scrollFn(d, "scrollLeft", c)))
        }
      };
      a.calLineEl = function (b, c, d, e, m, k, w) {
        if (1 === k) return !1;
        k = 0;
        if (b === a.eventdata.UP || b === a.eventdata.DOWN) k = c;
        else if (b === a.eventdata.RIGHT || b === a.eventdata.LEFT) k = d;
        k <= w && (b = Math.min(c + d, e.dis), b != e.dis && (e.dis = b, e.el = m));
        return e
      };
      a.getNextFocusElement = function (b) {
        var c = document.querySelectorAll("[" + a._itemAttrname + "]:not([" + focusdisableAttrname + "]):not([" + a.focusedAttrname +
            "])"),
          d = document.querySelectorAll("[" + a.focusedAttrname + "]:not([" + focusdisableAttrname + "]):not(svg)");
        if (!c || !c.length) return null;
        var e = null,
          m = Number.MAX_VALUE,
          k = Number.MAX_VALUE,
          w = {
            el: null,
            dis: Number.MAX_VALUE,
            absDis: Number.MAX_VALUE
          };
        if (d.length) d = d[d.length - 1];
        else return d = c[0];
        var g = d.getBoundingClientRect(),
          q = (g.width - d.offsetWidth || 0) / 2,
          l = (g.height - d.offsetHeight || 0) / 2,
          u = 0,
          v = 0,
          x = 0,
          z = 0,
          t = [g.top + l, g.right - q, g.bottom - l, g.left + q];
        b === a.eventdata.UP && (u = g.left + g.width / 2, v = Math.round(g.bottom - l),
          x = g.left + q, z = g.left + g.width - q);
        b === a.eventdata.RIGHT && (v = g.top + g.height / 2, u = Math.round(g.left + q), x = g.top + l, z = g.top + g.height - l);
        b === a.eventdata.DOWN && (u = g.left + g.width / 2, v = Math.round(g.top + l), x = g.left + q, z = g.left + g.width - q);
        b === a.eventdata.LEFT && (v = g.top + g.height / 2, u = Math.round(g.right - q), x = g.top + l, z = g.top + g.height - l);
        g = !1;
        for (q = 0; q < c.length; q++) {
          l = c[q];
          var f = l.getBoundingClientRect(),
            y = 0,
            r = 0,
            n = 0,
            A = 0;
          if (d !== l)
            if (l instanceof SVGElement) console.warn("Setting focusable on SVG is not supported. You can place the SVG tag in a HTML element and set the focusable attribute to that!");
            else {
              if (b === a.eventdata.UP) {
                r = f.top + f.height;
                if ((f.right < t[3] || f.left > t[1]) && f.bottom > t[0]) continue;
                if (Math.round(r) >= v) continue;
                y = f.left + f.width / 2;
                n = f.left;
                A = f.left + f.width
              } else if (b === a.eventdata.RIGHT) {
                y = f.left;
                if ((f.bottom < t[0] || f.top > t[2]) && f.left < t[1]) continue;
                if (Math.round(y) <= u) continue;
                r = f.top + f.height / 2;
                n = f.top;
                A = f.top + f.height
              } else if (b === a.eventdata.DOWN) {
                r = f.top;
                if ((f.right < t[3] || f.left > t[1]) && f.top < t[2]) continue;
                if (Math.round(r) <= v) continue;
                y = f.left + f.width / 2;
                n = f.left;
                A = f.left + f.width
              } else if (b ===
                a.eventdata.LEFT) {
                y = f.left + f.width;
                if ((f.bottom < t[0] || f.top > t[2]) && f.right > t[3]) continue;
                if (Math.round(y) >= u) continue;
                r = f.top + f.height / 2;
                n = f.top;
                A = f.top + f.height
              }
              f = Math.abs(u - y);
              r = Math.abs(v - r);
              a.calLineEl(b, f, r, w, l, a._findFocusType, a._initDis);
              if (x <= A && z >= n) {
                g = !0;
                n = 0;
                if (b === a.eventdata.UP || b === a.eventdata.DOWN) n = r;
                else if (b === a.eventdata.RIGHT || b === a.eventdata.LEFT) n = f;
                k === n ? (n = Math.min(Math.sqrt(f * f + r * r), m), n != m && (m = n, e = l)) : (n = Math.min(k, n), n != k && (k = n, m = Math.min(Math.sqrt(f * f + r * r), m), e = l))
              } else g ||
                (n = Math.min(Math.sqrt(f * f + r * r), m), n != m && (m = n, e = l))
            }
        }
        return 1 === a._findFocusType ? e : w.el || e
      };
      return a
    }
    __extends(h, p);
    return h
  }(FocusUtils),
  timerNum = 0,
  timer = null,
  timerFirst = 0,
  FocusAble = function (p) {
    function h() {
      var a = null !== p && p.apply(this, arguments) || this;
      a.focusKeyUpEvent = function (b) {
        var c = window.event ? window.event.keyCode : b.which,
          d = document.querySelectorAll("[" + a._itemAttrname + "]");
        0 < a._scrollSpeedX && (a.timedifX = 0);
        0 < a._scrollSpeedY && (a.timedifY = 0);
        if (d.length) {
          var e = document.querySelectorAll("[" +
            a.focusedAttrname + "]");
          d = e.length ? e[e.length - 1] : d[0]; - 1 !== a._KEYS.KEY_ENTER.indexOf(c) && (clearTimeout(timer), 0 === timerNum && (a.preventDefault(b), d.click(), a._formAutofocus && ("INPUT" === d.tagName.toLocaleUpperCase() || "TEXTAREA" === d.tagName.toLocaleUpperCase()) && d.focus(), timerNum = 0))
        }
        timerNum = timerFirst = 0
      };
      a.focusKeyDownEvent = function (b) {
        var c = window.event ? window.event.keyCode : b.which;
        if (document.querySelectorAll("[" + a._itemAttrname + "]").length) {
          var d = document.querySelectorAll("[" + a.focusedAttrname +
              "]"),
            e = d.length ? d[d.length - 1] : null; - 1 !== a._KEYS.KEY_ENTER.indexOf(c) ? 0 === timerFirst && (timerFirst = 1, timer = setTimeout(function () {
            timerNum++;
            e.dispatchEvent(new CustomEvent("longPress", {
              detail: {
                el: e
              }
            }));
            e.dispatchEvent(new CustomEvent("long-press", {
              detail: {
                el: e
              }
            }));
            clearTimeout(timer)
          }, a._longPressTime)) : -1 !== a._KEYS.KEY_LEFT.indexOf(c) ? (a.preventDefault(b), a.keyEvent(a.leftEvent, e)) : -1 !== a._KEYS.KEY_UP.indexOf(c) ? (a.preventDefault(b), a.keyEvent(a.upEvent, e)) : -1 !== a._KEYS.KEY_DOWN.indexOf(c) ? (a.preventDefault(b),
            a.keyEvent(a.downEvent, e)) : -1 !== a._KEYS.KEY_RIGHT.indexOf(c) && (a.preventDefault(b), a.keyEvent(a.rightEvent, e))
        }
      };
      a.init = function (b) {
        a._focusClassName = b.focusClassName || a._focusClassName;
        a._initDis = b.initDis || a._initDis;
        a._findFocusType = void 0 === b.findFocusType ? a._findFocusType : b.findFocusType;
        a._KEYS.KEY_UP = b.KEYS && b.KEYS.KEY_UP || a._KEYS.KEY_UP;
        a._KEYS.KEY_RIGHT = b.KEYS && b.KEYS.KEY_RIGHT || a._KEYS.KEY_RIGHT;
        a._KEYS.KEY_DOWN = b.KEYS && b.KEYS.KEY_DOWN || a._KEYS.KEY_DOWN;
        a._KEYS.KEY_LEFT = b.KEYS && b.KEYS.KEY_LEFT ||
          a._KEYS.KEY_LEFT;
        a._KEYS.KEY_ENTER = b.KEYS && b.KEYS.KEY_ENTER || a._KEYS.KEY_ENTER;
        a._offsetDistance = void 0 === b.offsetDistance ? a._offsetDistance : b.offsetDistance;
        a._longPressTime = void 0 === b.longPressTime ? a._longPressTime : b.longPressTime;
        a._distanceToCenter = void 0 === b.distanceToCenter ? a._distanceToCenter : b.distanceToCenter;
        a._formAutofocus = void 0 === b.formAutofocus ? a._formAutofocus : b.formAutofocus;
        a._focusableClassName = void 0 === b.focusableClassName ? a._focusableClassName : b.focusableClassName;
        a._itemAttrname =
          void 0 === b.itemAttrname ? a._itemAttrname : b.itemAttrname;
        0 < b.scrollSpeed && (a._scrollSpeedX = b.scrollSpeed, a._scrollSpeedY = b.scrollSpeed);
        a._scrollSpeedX = void 0 === b.scrollSpeedX ? a._scrollSpeedX : b.scrollSpeedX;
        a._scrollSpeedY = void 0 === b.scrollSpeedY ? a._scrollSpeedY : b.scrollSpeedY;
        a.setFocusableAttr()
      };
      a.setFocusableAttr = function () {
        if (a._focusableClassName)
          for (var b = document.getElementsByClassName(a._focusableClassName) || [], c = 0; c < b.length; c++) {
            var d = b[c];
            d.setAttribute("" + a._itemAttrname, ""); - 1 !== (d.getAttribute("class") ||
              "").split(" ").indexOf(a.focusClassName) && d.setAttribute("" + a.focusedAttrname, "")
          }
      };
      a.requestFocus = function (b, c) {
        void 0 === c && (c = !0);
        a.eventDisabled = a.eventDisabled ? "eventSkip" : "initSkip";
        b = b && b.length && b[0] || b;
        if (!b) throw Error("Element not found!");
        b = b.$el || b;
        if (b.hasAttribute("" + a._itemAttrname)) {
          if (null !== b.getAttribute(a.focusedAttrname)) return !1;
          for (var d = document.getElementsByClassName(a._focusClassName), e = 0; e < d.length; e++) a.removeOneClassName(d[e], a._focusClassName);
          a.addAttrName(b, a.focusedAttrname);
          "initSkip" === a.eventDisabled ? c ? a.doScroll(b, c) : setTimeout(function () {
            a.doScroll(b, c)
          }, 100) : a.doScroll(b, c)
        }
      };
      a.getElementByPath = a.getElementByPath;
      a.setfocusdisableAttrname = function (b) {
        if (null !== b) {
          for (var c = document.querySelectorAll("[" + a._itemAttrname + "]"), d = 0; d < c.length; d++) {
            var e = c[d];
            e.setAttribute("" + focusdisableAttrname, "");
            e.removeAttribute("" + a._itemAttrname)
          }
          b = b.querySelectorAll("[" + focusdisableAttrname + "]")
        } else {
          c = document.querySelectorAll("[" + a._itemAttrname + "]");
          for (d = 0; d < c.length; d++) e =
            c[d], e.removeAttribute("" + focusdisableAttrname);
          b = document.querySelectorAll("[" + focusdisableAttrname + "]")
        }
        for (d = 0; d < b.length; d++) e = b[d], e.setAttribute("" + a._itemAttrname, ""), e.removeAttribute("" + focusdisableAttrname)
      };
      a.reset = function () {
        a._KEYS = initData.KEYS;
        a._scrollEl = initData.scrollEl;
        a._focusClassName = initData.focusClassName;
        a._initDis = initData.initDis;
        a._findFocusType = initData.findFocusType;
        a._offsetDistance = initData.offsetDistance;
        a._longPressTime = initData.longPressTime;
        a._distanceToCenter =
          initData.distanceToCenter;
        a._limitingEl = initData.limitingEl;
        a._formAutofocus = initData.formAutofocus
      };
      a.resetFocusClassName = function () {
        a._focusClassName = initData.focusClassName
      };
      a.resetInitDis = function () {
        a._initDis = initData.initDis
      };
      a.resetFindFocusType = function () {
        a._findFocusType = initData.findFocusType
      };
      a.resetKEYS = function () {
        a._KEYS = initData.KEYS
      };
      a.resetTheDis = function () {
        a._offsetDistance = initData.offsetDistance
      };
      a.resetOffsetDistance = function () {
        a._offsetDistance = initData.offsetDistance
      };
      a.resetLongPressTime =
        function () {
          a._longPressTime = initData.longPressTime
        };
      a.resetDistanceToCenter = function () {
        a._distanceToCenter = initData.distanceToCenter
      };
      a.resetFormAutofocus = function () {
        a._formAutofocus = initData.formAutofocus
      };
      a.resetFocusableClassName = function () {
        a._focusableClassName = initData.focusableClassName
      };
      a.resetItemAttrname = function () {
        a._itemAttrname = initData.itemAttrname
      };
      a.resetScrollSpeed = function () {
        a._scrollSpeedX = initData.scrollSpeedX;
        a._scrollSpeedY = initData.scrollSpeedY
      };
      a.resetScrollSpeedX = function () {
        a._scrollSpeedX =
          initData.scrollSpeedX
      };
      a.resetScrollSpeedY = function () {
        a._scrollSpeedY = initData.scrollSpeedY
      };
      a.resetLimitingEl = function () {
        a._limitingEl = initData.limitingEl
      };
      a.resetScrollEl = function () {
        a._scrollEl = initData.scrollEl
      };
      a.setScrollEl = function (b) {
        a._scrollEl = b || a._scrollEl
      };
      return a
    }
    __extends(h, p);
    Object.defineProperty(h.prototype, "focusClassName", {
      get: function () {
        return this._focusClassName
      },
      set: function (a) {
        this._focusClassName = a
      },
      enumerable: !0,
      configurable: !0
    });
    Object.defineProperty(h.prototype, "initDis", {
      get: function () {
        return this._initDis
      },
      set: function (a) {
        this._initDis = a
      },
      enumerable: !0,
      configurable: !0
    });
    Object.defineProperty(h.prototype, "findFocusType", {
      get: function () {
        return this._findFocusType
      },
      set: function (a) {
        this._findFocusType = a
      },
      enumerable: !0,
      configurable: !0
    });
    Object.defineProperty(h.prototype, "KEYS", {
      get: function () {
        return this._KEYS
      },
      set: function (a) {
        this._KEYS = a
      },
      enumerable: !0,
      configurable: !0
    });
    Object.defineProperty(h.prototype, "offsetDistance", {
      get: function () {
        return this._offsetDistance
      },
      set: function (a) {
        this._offsetDistance = a
      },
      enumerable: !0,
      configurable: !0
    });
    Object.defineProperty(h.prototype, "longPressTime", {
      get: function () {
        return this._longPressTime
      },
      set: function (a) {
        this._longPressTime = a
      },
      enumerable: !0,
      configurable: !0
    });
    Object.defineProperty(h.prototype, "distanceToCenter", {
      get: function () {
        return this._distanceToCenter
      },
      set: function (a) {
        this._distanceToCenter = a
      },
      enumerable: !0,
      configurable: !0
    });
    Object.defineProperty(h.prototype, "formAutofocus", {
      get: function () {
        return this._formAutofocus
      },
      set: function (a) {
        this._formAutofocus = a
      },
      enumerable: !0,
      configurable: !0
    });
    Object.defineProperty(h.prototype, "focusableClassName", {
      get: function () {
        return this._focusableClassName
      },
      set: function (a) {
        this._focusableClassName = a;
        this.setFocusableAttr()
      },
      enumerable: !0,
      configurable: !0
    });
    Object.defineProperty(h.prototype, "itemAttrname", {
      get: function () {
        return this._itemAttrname
      },
      set: function (a) {
        this._itemAttrname = a
      },
      enumerable: !0,
      configurable: !0
    });
    Object.defineProperty(h.prototype, "scrollSpeed", {
      set: function (a) {
        0 <
          a && (this._scrollSpeedY = this._scrollSpeedX = a)
      },
      enumerable: !0,
      configurable: !0
    });
    Object.defineProperty(h.prototype, "scrollSpeedX", {
      get: function () {
        return this._scrollSpeedX
      },
      set: function (a) {
        this._scrollSpeedX = a
      },
      enumerable: !0,
      configurable: !0
    });
    Object.defineProperty(h.prototype, "scrollSpeedY", {
      get: function () {
        return this._scrollSpeedY
      },
      set: function (a) {
        this._scrollSpeedY = a
      },
      enumerable: !0,
      configurable: !0
    });
    Object.defineProperty(h.prototype, "limitingEl", {
      get: function () {
        this.setfocusdisableAttrname(this._limitingEl);
        return this._limitingEl
      },
      set: function (a) {
        this.setfocusdisableAttrname(a);
        this._limitingEl = a
      },
      enumerable: !0,
      configurable: !0
    });
    Object.defineProperty(h.prototype, "scrollEl", {
      get: function () {
        return this._scrollEl
      },
      set: function (a) {
        this._scrollEl = a
      },
      enumerable: !0,
      configurable: !0
    });
    Object.defineProperty(h.prototype, "smoothTime", {
      get: function () {
        return this._smoothTime && 10 > this._smoothTime ? 0 : this._smoothTime
      },
      set: function (a) {
        this._smoothTime = a && 10 > a ? 0 : a
      },
      enumerable: !0,
      configurable: !0
    });
    Object.defineProperty(h.prototype,
      "spacingTime", {
        get: function () {
          return this._spacingTime
        },
        set: function (a) {
          this._spacingTime = a
        },
        enumerable: !0,
        configurable: !0
      });
    return h
  }(FocusCore);
window.tvCore = new FocusAble;
document.removeEventListener("keydown", window.tvCore.focusKeyDownEvent, !1);
document.addEventListener("keydown", window.tvCore.focusKeyDownEvent);
document.removeEventListener("keyup", window.tvCore.focusKeyUpEvent, !1);
document.addEventListener("keyup", window.tvCore.focusKeyUpEvent);