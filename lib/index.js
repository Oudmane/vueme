'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _accepts = require('accepts');

var _accepts2 = _interopRequireDefault(_accepts);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var layouts = {},
    layoutsDir = _path2.default.join(__dirname, './layouts');

_fs2.default.readdirSync(layoutsDir).forEach(function (layout) {
    if (layout = layout.match(/(.*)\.js/)) {
        layout = layout[1];
        layouts[layout] = require(_path2.default.join(layoutsDir, layout + '.js')).default;
    }
});

var Template = function () {
    function Template() {
        _classCallCheck(this, Template);
    }

    _createClass(Template, null, [{
        key: 'render',
        value: function render(_ref, application) {
            var body = _ref.body,
                _ref$status = _ref.status,
                status = _ref$status === undefined ? 200 : _ref$status,
                _ref$headers = _ref.headers,
                headers = _ref$headers === undefined ? {} : _ref$headers;

            return new Promise(function (resolve, reject) {

                if ([30, 302].includes(status)) {
                    if (application.socket) resolve({
                        body: {},
                        redirect: {
                            url: headers.location
                        }
                    });else resolve({
                        status: status,
                        headers: headers,
                        body: ''
                    });
                } else if (application.socket) resolve({ body: body });else if (body.constructor.name == 'Object') switch ((0, _accepts2.default)(application.http.request).type(['html', 'json'])) {
                    case 'html':
                        var layout = layouts['html'];
                        if (layout.render) layout.render(body).then(function (body) {
                            resolve({
                                status: status || 200,
                                headers: headers,
                                body: body
                            });
                        });else resolve({
                            status: 200,
                            headers: headers,
                            body: JSON.stringify(body, null, 4)
                        });
                        break;
                    default:

                        ['template', 'html'].forEach(function (key) {
                            if (body[key]) delete body[key];
                        });

                        resolve({
                            status: 200,
                            headers: _extends({}, headers, {
                                'Content-Type': 'application/json; charset=UTF-8'
                            }),
                            body: JSON.stringify(body, null, 4)
                        });
                        break;
                } else resolve({
                    status: status || 200,
                    headers: headers,
                    body: body
                });
            });
        }
    }, {
        key: 'loadComponents',
        value: function loadComponents(componentsDir) {
            return new Promise(function (done) {
                Object.keys(layouts).forEach(function (layout) {
                    _fs2.default.readdirSync(componentsDir).forEach(function (component) {
                        var componentDir = _path2.default.join(componentsDir, component);
                        if (_fs2.default.statSync(componentDir).isDirectory()) {
                            var controllerFile = _path2.default.join(componentDir, 'vue', layout + '.js'),
                                tasksDir = _path2.default.join(componentDir, 'tasks');
                            if (_fs2.default.existsSync(controllerFile)) {
                                if (!layouts[layout].components[component]) layouts[layout].components[component] = {};
                                layouts[layout].components[component]['default'] = require(controllerFile).default;
                            }if (_fs2.default.existsSync(tasksDir)) _fs2.default.readdirSync(tasksDir).forEach(function (task) {
                                var taskDir = _path2.default.join(tasksDir, task);
                                if (_fs2.default.statSync(componentDir).isDirectory()) {
                                    var taskFile = _path2.default.join(taskDir, 'vue', layout + '.js');
                                    if (_fs2.default.existsSync(taskFile)) {
                                        if (!layouts[layout].components[component]) layouts[layout].components[component] = {};
                                        layouts[layout].components[component][task] = require(taskFile).default;
                                    }
                                }
                            });
                        }
                    });
                });
                done(layouts);
            });
        }
    }, {
        key: 'loadModules',
        value: function loadModules(modulesDir) {
            return new Promise(function (done) {
                Object.keys(layouts).forEach(function (layout) {
                    _fs2.default.readdirSync(modulesDir).forEach(function (module) {
                        var moduleDir = _path2.default.join(modulesDir, module);
                        if (_fs2.default.statSync(moduleDir).isDirectory()) {
                            var moduleFile = _path2.default.join(moduleDir, 'vue', layout + '.js');
                            if (_fs2.default.existsSync(moduleFile)) layouts[layout].modules[module] = require(moduleFile).default;
                        }
                    });
                });
                done(layouts);
            });
        }
    }, {
        key: 'loadLocales',
        value: function loadLocales(componentsDir) {
            var modulesDir = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

            return new Promise(function (done) {
                Object.keys(layouts).forEach(function (layout) {
                    _fs2.default.readdirSync(componentsDir).forEach(function (component) {
                        var componentDir = _path2.default.join(componentsDir, component);
                        if (_fs2.default.statSync(componentDir).isDirectory()) {
                            var componentFile = _path2.default.join(componentDir, 'locale', 'source.js');
                            if (_fs2.default.existsSync(componentFile)) layouts[layout].i18n.en[component] = require(componentFile).default;
                        }
                    });
                });
                done(layouts);
            });
        }
    }]);

    return Template;
}();

exports.default = Template;