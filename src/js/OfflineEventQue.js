'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OfflineEventQue = function () {
  function OfflineEventQue(id, callback) {
    _classCallCheck(this, OfflineEventQue);

    this.callback = callback;
    this.key = 'OfflineEventQue-' + id;
    this.getQue = this.getQue.bind(this);
    this.pushQue = this.pushQue.bind(this);
    this.executeQue = this.executeQue.bind(this);

    localStorage.setItem(this.key, '[]');
    window.addEventListener('online', this.executeQue);

    if (window.navigator && window.navigator.onLine) {
      this.executeQue();
    }
  }

  _createClass(OfflineEventQue, [{
    key: 'getQue',
    value: function getQue() {
      var queString = localStorage.getItem(this.key);
      return JSON.parse(queString);
    }
  }, {
    key: 'pushQue',
    value: function pushQue(args) {
      var que = this.getQue();
      var newQue = [].concat(_toConsumableArray(que), [args]);
      localStorage.setItem(this.key, JSON.stringify(newQue));
      return null;
    }
  }, {
    key: 'executeQue',
    value: function executeQue() {
      var _this = this;

      if (localStorage.getItem(this.key)) {
        var que = this.getQue();
        que.forEach(function (val) {
          _this.callback;console.log(val, _this.callback);
        });
        localStorage.setItem(this.key, '[]');
        return true;
      }

      return false;
    }
  }, {
    key: 'event',
    value: function event() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (window.navigator && !window.navigator.onLine) {
        this.pushQue(args);
        return false;
      }

      this.callback.apply(this, args);
      return true;
    }
  }]);

  return OfflineEventQue;
}();