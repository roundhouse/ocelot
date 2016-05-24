var App, MobileCheck, WaveControls,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

MobileCheck = (function() {
  function MobileCheck() {
    this.Windows = bind(this.Windows, this);
    this.Opera = bind(this.Opera, this);
    this.iOS = bind(this.iOS, this);
    this.BlackBerry = bind(this.BlackBerry, this);
    this.Android = bind(this.Android, this);
    console.log("MobileCheck");
    this.isMobile = this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows();
    return this.isMobile;
  }

  MobileCheck.prototype.Android = function() {
    return navigator.userAgent.match(/Android/i);
  };

  MobileCheck.prototype.BlackBerry = function() {
    return navigator.userAgent.match(/BlackBerry/i);
  };

  MobileCheck.prototype.iOS = function() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  };

  MobileCheck.prototype.Opera = function() {
    return navigator.userAgent.match(/Opera Mini/i);
  };

  MobileCheck.prototype.Windows = function() {
    return navigator.userAgent.match(/IEMobile/i);
  };

  return MobileCheck;

})();

App = (function() {
  function App() {
    this.randoColor = bind(this.randoColor, this);
    this.rbgColor = bind(this.rbgColor, this);
    this.modifyColor = bind(this.modifyColor, this);
    this.animate = bind(this.animate, this);
    this.Lissajou = bind(this.Lissajou, this);
    this.desktopControls = bind(this.desktopControls, this);
    this.touchControls = bind(this.touchControls, this);
    this.init = bind(this.init, this);
    this.createVars = bind(this.createVars, this);
    this.createVars();
    this.init();
  }

  App.prototype.createVars = function() {
    this.curve = document.getElementById("curve");
    this.curve;
    this.alpha = 1;
    this.beta = 1;
    this.phi = 0;
    this.dphi = Math.PI / 120;
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.resizeTimer;
    this.paused = false;
    this.colorCount = 0;
    this.strokeWeight = 2;
    this.mouseDown = false;
    this.colorCounter = 0;
    this.colorspeed = 1;
    this.blur = 0;
    this.rbg = ["#C00404", "#0594F2", "#3FA61E"];
    this.mobile = new MobileCheck();
    this.controls = new WaveControls();
    return window.addEventListener("resize", (function(_this) {
      return function() {
        _this.w = window.innerWidth;
        return _this.h = window.innerHeight;
      };
    })(this));
  };

  App.prototype.init = function() {
    if (this.mobile.isMobile !== null) {
      this.mobile = true;
      this.controls.hide();
      this.touchControls();
    } else {
      this.mobile = false;
      this.desktopControls();
    }
    return this.tick = setInterval(this.animate, 4);
  };

  App.prototype.touchControls = function() {
    this.touchX;
    this.touchY;
    this.mobile_force = document.getElementById("mobile_force");
    return window.addEventListener("touchmove", (function(_this) {
      return function(evt) {
        var a, b, newStroke;
        b = Math.round(((_this.w / 2) - evt.changedTouches[0].clientX) * 0.1);
        a = Math.round(((_this.h / 2) - evt.changedTouches[0].clientY) * 0.1);
        if (a === 0) {
          a = 1;
        }
        if (b === 0) {
          b = 1;
        }
        _this.beta = b;
        _this.alpha = a;
        newStroke = Math.round((1 - evt.changedTouches[0].force) * 2);
        _this.curve.setAttributeNS(null, "stroke-width", newStroke);
        return _this.mobile_force.innerHTML = newStroke;
      };
    })(this));
  };

  App.prototype.desktopControls = function() {
    window.addEventListener("mousemove", (function(_this) {
      return function(evt) {
        var a, b;
        if (_this.paused === false && evt.shiftKey) {
          _this.beta = Math.round((evt.pageX - (_this.w / 2)) / 10);
          return _this.alpha = Math.round((evt.pageY - (_this.h / 2)) / 10);
        } else if (_this.paused === false && _this.mouseDown) {
          b = Math.round(evt.movementX);
          a = Math.round(evt.movementY);
          if (a === 0) {
            a = 1;
          }
          if (b === 0) {
            b = 1;
          }
          _this.beta = b;
          return _this.alpha = a;
        }
      };
    })(this));
    window.addEventListener("mousedown", (function(_this) {
      return function(evt) {
        return _this.mouseDown = true;
      };
    })(this));
    window.addEventListener("mouseup", (function(_this) {
      return function(evt) {
        return _this.mouseDown = false;
      };
    })(this));
    return window.addEventListener("keydown", (function(_this) {
      return function(evt) {
        if (evt.keyCode === 32) {
          if (_this.paused === false) {
            _this.paused = true;
            _this.controls.openWindow();
          } else {
            _this.paused = false;
            _this.controls.closeWindow();
          }
        }
        if (evt.keyCode === 37) {
          _this.beta--;
        }
        if (evt.keyCode === 39) {
          _this.beta++;
        }
        if (evt.keyCode === 38) {
          _this.alpha++;
        }
        if (evt.keyCode === 40) {
          _this.alpha--;
        }
        if (evt.keyCode === 79) {
          _this.colorspeed = _this.colorspeed - 5;
          if (_this.colorspeed < 1) {
            _this.colorspeed = 1;
          }
        }
        if (evt.keyCode === 80) {
          _this.colorspeed = _this.colorspeed + 5;
          console.log(_this.colorspeed);
        }
        if (evt.keyCode === 219) {
          _this.strokeWeight--;
          if (_this.strokeWeight < 1) {
            _this.strokeWeight = 1;
          }
          _this.curve.setAttributeNS(null, "stroke-width", _this.strokeWeight);
        }
        if (evt.keyCode === 221) {
          _this.strokeWeight++;
          return _this.curve.setAttributeNS(null, "stroke-width", _this.strokeWeight);
        }
      };
    })(this));
  };

  App.prototype.Lissajou = function(a, b, phi) {
    var dt, max, str, x;
    if (this.mobile === false) {
      this.controls.updateWaveData(a, b, phi, this.w, this.h, this.strokeWeight, this.colorspeed);
    }
    dt = Math.PI / (this.w / 2);
    str = "M";
    max = 2 * Math.PI;
    x = 0;
    while (x <= max) {
      str += ((this.w / 2) + (((this.w / 2) - 100) * Math.sin(a * x))) + " " + ((this.h / 2) + (((this.h / 2) - 50) * Math.cos(b * x + phi))) + " ";
      x += dt;
    }
    return this.curve.setAttributeNS(null, "d", str);
  };

  App.prototype.animate = function() {
    if (this.paused === false) {
      this.Lissajou(this.alpha, this.beta, this.phi);
      this.phi += this.dphi;
      this.phi %= 2.0 * Math.PI;
      return this.modifyColor();
    }
  };

  App.prototype.modifyColor = function() {
    return this.curve.setAttributeNS(null, "stroke", this.rbgColor());
  };

  App.prototype.rbgColor = function() {
    this.colorCounter++;
    if (this.colorspeed < this.colorCounter) {
      this.colorCounter = 0;
      this.colorCount += 1;
      if (this.colorCount > this.rbg.length - 1) {
        this.colorCount = 0;
      }
    }
    return this.rbg[this.colorCount];
  };

  App.prototype.randoColor = function() {
    var r;
    r = Math.random() * 16777215.;
    return "#" + Math.floor(r).toString(16);
  };

  return App;

})();

window.onload = (function(_this) {
  return function() {
    var _app;
    return _app = new App();
  };
})(this);

WaveControls = (function() {
  function WaveControls() {
    this.updateWaveData = bind(this.updateWaveData, this);
    this.closeWindow = bind(this.closeWindow, this);
    this.openWindow = bind(this.openWindow, this);
    this.hide = bind(this.hide, this);
    console.log("new contols");
    this.controlWindow = document.getElementById("controls");
    this.instructs = document.getElementById("instruct");
    this.aTxt = document.getElementById("alpha_value");
    this.bTxt = document.getElementById("beta_value");
    this.pTxt = document.getElementById("phi_value");
    this.lTxt = document.getElementById("length_value");
    this.hTxt = document.getElementById("height_value");
    this.sTxt = document.getElementById("stroke_value");
    this.cTxt = document.getElementById("color_value");
    this.eTxt = document.getElementById("equation_value");
  }

  WaveControls.prototype.hide = function() {
    this.instructs.className = "hidden";
    return this.controlWindow.className = "hidden";
  };

  WaveControls.prototype.openWindow = function() {
    return this.controlWindow.className = "open";
  };

  WaveControls.prototype.closeWindow = function() {
    return this.controlWindow.className = "";
  };

  WaveControls.prototype.updateWaveData = function(a, b, p, l, h, s, c) {
    this.aTxt.innerHTML = a;
    this.bTxt.innerHTML = b;
    this.pTxt.innerHTML = p.toFixed(3);
    this.lTxt.innerHTML = l + "px";
    this.hTxt.innerHTML = h + "px";
    this.sTxt.innerHTML = s + "px";
    this.cTxt.innerHTML = c + "ms";
    return this.eTxt.innerHTML = "f(t)=sin(" + a + "t) + cos(" + b + "t + " + (p.toFixed(1)) + " &Pi;)";
  };

  return WaveControls;

})();
