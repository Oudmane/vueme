'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _uikit = require('./libraries/uikit');

var _uikit2 = _interopRequireDefault(_uikit);

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _vuex = require('vuex');

var _vuex2 = _interopRequireDefault(_vuex);

var _vueI18n = require('vue-i18n');

var _vueI18n2 = _interopRequireDefault(_vueI18n);

var _application = require('./application');

var _application2 = _interopRequireDefault(_application);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_vue2.default.use(_vuex2.default);
_vue2.default.use(_vueI18n2.default);

var Application = function Application(vue) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Application);

    return new _vue2.default(_extends({
        el: '#application',
        store: new _vuex2.default.Store(_extends({
            state: window.state
        }, options.store || {})),
        i18n: new _vueI18n2.default(_extends({
            locale: 'en',
            messages: {}
        }, options.i18n || {}))
    }, _application2.default, vue));
};

exports.default = Application;