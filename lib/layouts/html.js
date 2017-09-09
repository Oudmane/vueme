'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _vuex = require('vuex');

var _vuex2 = _interopRequireDefault(_vuex);

var _vueI18n = require('vue-i18n');

var _vueI18n2 = _interopRequireDefault(_vueI18n);

var _vueServerRenderer = require('vue-server-renderer');

var _application = require('./html/application');

var _application2 = _interopRequireDefault(_application);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vuex2.default);
_vue2.default.use(_vueI18n2.default);

_vue2.default.config.lang = 'en';

var renderer = (0, _vueServerRenderer.createRenderer)({
    template: '<!DOCTYPE html><!--vue-ssr-outlet-->'
}),
    components = {},
    modules = {},
    i18n = {
    en: {}
},
    container = {
    render: function render(h) {
        var _$data = this.$data,
            title = _$data.title,
            base = _$data.base,
            meta = _$data.meta,
            link = _$data.link,
            style = _$data.style,
            script = _$data.script,
            noscript = _$data.noscript,
            lang = _$data.lang,
            dir = _$data.dir;

        return h(
            'html',
            {
                attrs: { lang: lang, dir: dir }
            },
            [h(
                'head',
                null,
                [base.href ? h(
                    'base',
                    {
                        attrs: { href: base.href, target: base.target }
                    },
                    []
                ) : '', meta.map(function (m) {
                    return h(
                        'meta',
                        {
                            attrs: { name: m.name, charset: m.charset, 'http-equiv': m['http-equiv'], content: m.content, property: m.property, scheme: m.scheme }
                        },
                        []
                    );
                }), link.map(function (l) {
                    return h(
                        'link',
                        {
                            attrs: { charset: l.charset, crossorigin: l.crossorigin, href: l.href, hreflang: l.hreflang, media: l.media, rel: l.rel, rev: l.rev, sizes: l.sizes, target: l.target, type: l.type }
                        },
                        []
                    );
                }), style.map(function (s) {
                    return h(
                        'style',
                        {
                            attrs: { media: s.media, scoped: s.scoped, type: s.type || 'text/css' },
                            domProps: {
                                'innerHTML': s.content || ''
                            }
                        },
                        []
                    );
                }), script.map(function (s) {
                    return h(
                        'script',
                        {
                            attrs: { async: s.async, charset: s.charset, defer: s.defer, src: s.src, type: s.type || 'text/javascript' },
                            domProps: {
                                'innerHTML': s.content || ''
                            }
                        },
                        []
                    );
                }), h(
                    'title',
                    null,
                    [title]
                ), noscript.link.length ? h(
                    'noscript',
                    {
                        attrs: { id: 'deferred' }
                    },
                    [noscript.link.map(function (l) {
                        return h(
                            'link',
                            {
                                attrs: { charset: l.charset, crossorigin: l.crossorigin, href: l.href, hreflang: l.hreflang, media: l.media, rel: l.rel, rev: l.rev, sizes: l.sizes, target: l.target, type: l.type }
                            },
                            []
                        );
                    })]
                ) : '']
            ), h(
                'body',
                null,
                [h(
                    'application',
                    {
                        attrs: { id: 'application' }
                    },
                    []
                )]
            )]
        );
    },

    data: function data() {
        return {
            title: '',
            base: {
                href: '',
                target: ''
            },
            meta: [{
                charset: 'UTF-8'
            }, {
                'http-equiv': 'X-UA-Compatible',
                content: 'IE=edge'
            }, {
                'http-equiv': 'content-type',
                content: 'text/html; charset=utf-8'
            }, {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            }],
            link: [
                // {
                //     rel: 'icon',
                //     href: '/favicon.ico'
                // }
            ],
            style: [],
            script: [],
            noscript: {
                link: []
            },
            lang: 'en',
            dir: 'ltr'
        };
    },
    created: function created() {
        var _this = this;

        var state = JSON.parse(JSON.stringify(this.$store.state));
        delete state.html;
        delete state.template;
        this.script.push({
            content: 'window.state=' + JSON.stringify(state)
        });
        this.title = _application2.default.title(this);
        if (this.$store.state.html) Object.keys(this.$store.state.html).forEach(function (key) {
            var data = _this.$store.state.html[key];
            switch (key) {
                case 'meta':
                case 'link':
                case 'style':
                case 'script':
                    if (data.add) data.add.forEach(function (datum) {
                        _this[key].push(datum);
                    });
                    break;
                case 'dir':
                case 'lang':
                    _this[key] = data;
                    break;
            }
        });
    },

    components: {
        application: _extends({}, _application2.default, {
            $components: components,
            $modules: modules
        })
    },
    methods: {
        getComponent: function getComponent(component, task) {

            if (!component) component = this.component;

            if (!task) task = this.task;

            return components[component][task];
        }
    },
    computed: {
        component: function component() {
            return this.$store.state.component || 'error';
        },
        task: function task() {
            return this.$store.state.task || 'default';
        }
    }
};

exports.default = {
    renderer: renderer,
    components: components,
    modules: modules,
    i18n: i18n,
    render: function render(state) {
        return new Promise(function (resolve) {
            renderer.renderToString(new _vue2.default(_extends({
                store: new _vuex2.default.Store({
                    state: state
                }),
                i18n: new _vueI18n2.default({
                    locale: 'en',
                    messages: i18n
                })
            }, container)), function (error, html) {
                resolve(html);
            });
        });
    }
};