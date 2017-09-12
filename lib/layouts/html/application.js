'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _API = require('./API');

var _API2 = _interopRequireDefault(_API);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _formSerializer = require('form-serializer');

var _formSerializer2 = _interopRequireDefault(_formSerializer);

var _eventemitter = require('eventemitter3');

var _eventemitter2 = _interopRequireDefault(_eventemitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _classes = function _classes() {
    return {
        'header-mobile': ['tm-header-mobile', 'uk-hidden@m'],
        'toolbar': ['tm-toolbar', 'uk-visible@m'],
        'toolbar.container': ['uk-container', 'uk-flex', 'uk-flex-middle'
        // 'uk-container-expand'
        ],
        'toolbar-left': ['uk-grid-medium', 'uk-child-width-auto', 'uk-flex-middle'],
        'toolbar-right': ['uk-grid-medium', 'uk-child-width-auto', 'uk-flex-middle'],
        'header': ['tm-header', 'uk-visible@m'],
        'header.container': ['uk-navbar-container'],
        'main': ['tm-main', 'uk-section', 'uk-section-default'],
        'main.container': ['uk-container'],
        'main.grid': ['uk-grid']
    };
},
    title = function title(instance) {
    var title = '',
        separator = '-',
        tail = '',
        beforeload = instance.getComponent('system', 'beforeload');

    if (instance.getComponent().title) title = instance.getComponent().title(instance, instance.$store.state);

    if (beforeload && beforeload.title && beforeload.title.tail) tail = beforeload.title.tail(instance, instance.$store.state);

    return title + (tail ? ' ' + separator + ' ' + tail : '');
},
    events = new _eventemitter2.default();

exports.default = {
    name: 'application',
    title: title,
    data: function data() {
        return {
            busy: true
        };
    },
    render: function render(h) {
        var classes = this.classes,
            position = this.position,
            busy = this.busy,
            component = this.component,
            task = this.task;

        return h(
            'div',
            { 'class': 'uk-offcanvas-content', attrs: { component: component, task: task }
            },
            [h(
                'div',
                { 'class': classes['header-mobile'] },
                [h(
                    'nav',
                    { 'class': 'uk-navbar-container', attrs: { 'uk-navbar': '' }
                    },
                    [h(
                        'div',
                        { 'class': 'uk-navbar-left' },
                        [position('mobile-navbar-left', h)]
                    ), h(
                        'div',
                        { 'class': 'uk-navbar-center' },
                        [position('mobile-navbar-center', h)]
                    ), h(
                        'div',
                        { 'class': 'uk-navbar-right' },
                        [position('mobile-navbar-right', h)]
                    )]
                )]
            ), h(
                'div',
                { 'class': classes['toolbar'] },
                [h(
                    'div',
                    { 'class': classes['toolbar.container'] },
                    [h(
                        'div',
                        null,
                        [h(
                            'div',
                            { 'class': classes['toolbar-left'], attrs: { 'uk-grid': 'margin: uk-margin-small-top' }
                            },
                            [position('toolbar-left', h)]
                        )]
                    ), h(
                        'div',
                        { 'class': 'uk-margin-auto-left' },
                        [h(
                            'div',
                            { 'class': classes['toolbar-right'], attrs: { 'uk-grid': 'margin: uk-margin-small-top' }
                            },
                            [position('toolbar-right', h)]
                        )]
                    )]
                )]
            ), h(
                'div',
                { 'class': classes['header'], attrs: { 'uk-header': '' }
                },
                [h(
                    'div',
                    { 'class': classes['header.container'] },
                    [h(
                        'div',
                        { 'class': 'uk-container' },
                        [h(
                            'nav',
                            { 'class': 'uk-navbar', attrs: { 'uk-navbar': '' }
                            },
                            [h(
                                'div',
                                { 'class': 'uk-navbar-left' },
                                [position('navbar-left', h)]
                            ), h(
                                'div',
                                { 'class': 'uk-navbar-center' },
                                [position('navbar-center', h)]
                            ), h(
                                'div',
                                { 'class': 'uk-navbar-right' },
                                [position('navbar-right', h)]
                            )]
                        )]
                    )]
                )]
            ), position('section-top', h), function () {
                var component = position('component', h);
                return component ? h(
                    'div',
                    { 'class': classes['main'], attrs: { 'uk-height-viewport': 'expand: true' }
                    },
                    [h(
                        'div',
                        { 'class': classes['main.container'] },
                        [h(
                            'div',
                            { 'class': classes['main.grid'], attrs: { 'uk-grid': '' }
                            },
                            [h(
                                'div',
                                { 'class': 'uk-width-expand@m' },
                                [position('component', h)]
                            )]
                        )]
                    )]
                ) : '';
            }(), position('section-bottom', h), h(
                'div',
                { 'class': classes['footer'] },
                [position('footer', h)]
            ), h(
                'div',
                { 'class': 'uk-position-fixed uk-position-bottom-right uk-overlay', domProps: {
                        'hidden': !busy
                    }
                },
                [h(
                    'div',
                    {
                        attrs: { 'uk-spinner': '' }
                    },
                    []
                )]
            )]
        );
    },
    created: function created() {
        events.emit('created');
    },
    mounted: function mounted() {
        var _this = this;

        _jquery2.default.fn.URI = function () {
            switch (this.prop('tagName')) {
                case 'A':
                    return this[0].href.replace(location.origin, '');
                    break;
                case 'FORM':
                    return this[0].action.replace(location.origin, '');
                    break;
                default:
                    return (0, _jquery2.default)(this).attr('href');
                    break;
            }
        };
        _jquery2.default.expr[':'].external = function (a) {
            var href = (0, _jquery2.default)(a).URI();
            return href !== undefined && href.search(/^(\w+:)?\/\//) !== -1;
        };
        _jquery2.default.expr[':'].internal = function (a) {
            return (0, _jquery2.default)(a).URI() !== undefined && !_jquery2.default.expr[':'].external(a);
        };
        window.onpopstate = function (_ref) {
            var state = _ref.state;

            _this.request(state, false);
        };
        history.replaceState({ url: location.pathname + location.search }, '', location.pathname + location.search);
        (0, _jquery2.default)(function ($) {
            $('body').on('click', '[href]:not([noj],[href*="#"]):internal', function (_ref2) {
                var currentTarget = _ref2.currentTarget,
                    ctrlKey = _ref2.ctrlKey,
                    altKey = _ref2.altKey,
                    shiftKey = _ref2.shiftKey,
                    metaKey = _ref2.metaKey;

                if (ctrlKey || altKey || shiftKey || metaKey && !ctrlKey) return true;
                _this.request({
                    url: $(currentTarget).URI()
                });
                return false;
            });
            $('body').on('submit', '[action]:not([noj]):internal', function (_ref3) {
                var currentTarget = _ref3.currentTarget,
                    ctrlKey = _ref3.ctrlKey,
                    altKey = _ref3.altKey,
                    shiftKey = _ref3.shiftKey,
                    metaKey = _ref3.metaKey;

                if (ctrlKey || altKey || shiftKey || metaKey && !ctrlKey) return true;
                _this.request({
                    url: $(currentTarget).URI(),
                    method: $(currentTarget).attr('method'),
                    data: $(currentTarget).serializeObject()
                }, false);
                return false;
            });
        });
        _API2.default.connect().then(function () {
            _this.busy = false;
        });
        events.emit('mounted');
        this.$nextTick(function () {
            _this.render();
        });
    },

    methods: {
        render: function render() {
            events.emit('render');
        },
        position: function position(_position, _h) {
            var _this2 = this;

            var render = '';
            switch (_position) {
                case 'component':
                    var component = this.getComponent();

                    if (component.render || component.template) render = _h(component);
                    break;
                default:
                    if (this.$store.state.modules[_position]) {
                        render = this.$store.state.modules[_position].map(function (module) {
                            return _h(_this2.getModule(module.name), { props: { data: module.data }, ref: _position + '.' + module.name });
                        });
                    }
                    break;
            }
            return render;
        },
        getComponent: function getComponent(component, task) {

            if (!component) component = this.component;

            if (!task) task = this.task;

            if (this.$options.$components[component]) if (this.$options.$components[component][task]) return this.$options.$components[component][task];

            return null;
        },
        getModule: function getModule(module) {
            return this.$options.$modules[module] || null;
        },
        request: function request(state) {
            var _this3 = this;

            var push = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            this.busy = true;
            _API2.default.request(state).then(function (response) {
                _this3.$store.replaceState(response);
                _this3.$nextTick(function () {

                    document.title = title(_this3);

                    if (push) history.pushState(state, document.title, response.uri || state.url);else history.replaceState(state, document.title, response.uri || state.url);

                    _this3.busy = false;
                });
            });
        },
        reload: function reload() {
            return this.request(history.state, false);
        }
    },
    computed: {
        classes: function classes() {
            var Classes = _classes(),
                componentClasses = this.getComponent().classes ? this.getComponent().classes(this, this.$store.state) : {},
                apply = function apply(classes, changes) {
                if (Object.keys(changes).length) {
                    var _loop = function _loop(position) {
                        if (changes[position].set) {
                            classes[position] = changes[position].set;
                        } else {
                            if (changes[position].append) {
                                classes[position] = classes[position].concat(changes[position].append);
                            }
                            if (changes[position].prepend) {
                                classes[position] = changes[position].prepend.concat(classes[position]);
                            }
                            if (changes[position].remove) {
                                changes[position].remove.forEach(function (className) {
                                    var index = classes[position].indexOf(className);
                                    if (index != -1) classes[position].splice(index, 1);
                                });
                            }
                        }
                    };

                    for (var position in changes) {
                        _loop(position);
                    }
                }
            };
            if (this.$options.$components.system && this.$options.$components.system.beforeload && this.$options.$components.system.beforeload.classes) apply(Classes, this.$options.$components.system.beforeload.classes(this, this.$store.state));
            apply(Classes, componentClasses);
            if (this.$options.$components.system && this.$options.$components.system.afterload && this.$options.$components.system.afterload.classes) apply(Classes, this.$options.$components.system.afterload.classes(this, this.$store.state));
            return Classes;
        },
        component: function component() {
            return this.$store.state.component || 'error';
        },
        task: function task() {
            return this.$store.state.task || 'default';
        }
    },
    on: function on() {
        return events.on.apply(events, arguments);
    },
    once: function once() {
        return events.once.apply(events, arguments);
    },
    emit: function emit() {
        return events.emit.apply(events, arguments);
    },
    remove: function remove() {
        return events.removeListener.apply(events, arguments);
    }
};