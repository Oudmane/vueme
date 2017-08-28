'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _eventemitter = require('eventemitter3');

var _eventemitter2 = _interopRequireDefault(_eventemitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var websocket = void 0,
    ajax = void 0,
    events = new _eventemitter2.default();

var API = function () {
    function API() {
        _classCallCheck(this, API);
    }

    _createClass(API, null, [{
        key: 'request',
        value: function request(options) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                var id = _this.generateID();
                if (!options.method) options.method = 'GET';
                if (options.method == 'GET' && options.data) {
                    if (Object.keys(options.data).length) options.url += '?' + _jquery2.default.param(options.data);
                    delete options.data;
                }
                events.once(id, resolve);
                if (websocket && websocket.readyState == WebSocket.OPEN) websocket.send(JSON.stringify(_extends({
                    id: id
                }, options)));else if (ajax && [XMLHttpRequest.UNSENT, XMLHttpRequest.DONE].indexOf(ajax.readyState) == -1) _jquery2.default.when(ajax).done(function () {
                    _this.request(options).then(resolve);
                });else ajax = _jquery2.default.ajax({
                    url: options.url,
                    method: options.method || 'GET',
                    data: options.data || false,
                    cache: false,
                    headers: options.headers || {},
                    dataType: options.dataType || 'json',
                    success: function success(response) {
                        events.emit(id, response);
                    }
                });
            });
        }
    }, {
        key: 'get',
        value: function get(url) {
            var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            return this.request({
                method: 'GET',
                url: url,
                data: data
            });
        }
    }, {
        key: 'post',
        value: function post(url) {
            var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            return this.request({
                method: 'POST',
                url: url,
                data: data
            });
        }
    }, {
        key: 'connect',
        value: function connect() {
            var _this2 = this;

            return new Promise(function (resolve) {
                if (WebSocket) {
                    websocket = new WebSocket(location.protocol.replace('http', 'ws') + '//' + location.hostname + ':' + location.port);
                    websocket.onmessage = function (message) {
                        message = JSON.parse(message.data);
                        if (message.request) _this2.request(_extends({}, message.request, {
                            id: message.id
                        }));else events.emit(message.id, message.response);
                    };
                    websocket.onopen = function () {
                        events.emit('open');
                    };
                    events.once('open', resolve);
                } else resolve();
            });
        }
    }, {
        key: 'generateID',
        value: function generateID() {
            var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;

            var text = '',
                possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (var i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }return text;
        }
    }, {
        key: 'isInSocket',
        value: function isInSocket() {
            return websocket && websocket.readyState == WebSocket.OPEN;
        }
    }, {
        key: 'on',
        value: function on() {
            return events.on.apply(events, arguments);
        }
    }, {
        key: 'once',
        value: function once() {
            return events.once.apply(events, arguments);
        }
    }, {
        key: 'emit',
        value: function emit() {
            return events.emit.apply(events, arguments);
        }
    }, {
        key: 'remove',
        value: function remove() {
            return events.removeListener.apply(events, arguments);
        }
    }]);

    return API;
}();

exports.default = API;