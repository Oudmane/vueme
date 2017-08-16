import Vue from 'vue'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import {
    createRenderer
} from 'vue-server-renderer'
import application from './html/application'

Vue.use(Vuex)
Vue.use(VueI18n)

Vue.config.lang = 'en'

const renderer = createRenderer({
        template: '<!DOCTYPE html><!--vue-ssr-outlet-->'
    }),
    components = {},
    modules = {},
    i18n = {
        en: {}
    },
    container = {
        render(h) {
            let {title, base, meta, link, style, script, noscript, lang, dir} = this.$data
            return (
                <html lang={lang} dir={dir}>
                    <head>
                        {
                            base.href ?
                                <base href={base.href} target={base.target} />
                                : ''
                        }
                        {meta.map(m => {
                            return <meta name={m.name} charset={m.charset} http-equiv={m['http-equiv']} content={m.content} property={m.property} scheme={m.scheme} />
                        })}
                        {link.map(l => {
                            return <link charset={l.charset} crossorigin={l.crossorigin} href={l.href} hreflang={l.hreflang} media={l.media} rel={l.rel} rev={l.rev} sizes={l.sizes} target={l.target} type={l.type} />
                        })}
                        {style.map(s => {
                            return <style media={s.media} scoped={s.scoped} type={s.type || 'text/css'} domPropsInnerHTML={s.content || ''}></style>
                        })}
                        {script.map(s => {
                            return <script async={s.async} charset={s.charset} defer={s.defer} src={s.src} type={s.type || 'text/javascript'} domPropsInnerHTML={s.content || ''}></script>
                        })}
                        <title>{title}</title>
                        {
                            (noscript.link.length) ?
                                <noscript id="deferred">
                                    {noscript.link.map(l => {
                                        return <link charset={l.charset} crossorigin={l.crossorigin} href={l.href} hreflang={l.hreflang} media={l.media} rel={l.rel} rev={l.rev} sizes={l.sizes} target={l.target} type={l.type} />
                                    })}
                                </noscript>
                                : ''
                        }
                    </head>
                    <body>
                        <application id="application"></application>
                    </body>
                </html>
            )
        },
        data: () => {
            return {
                title: '',
                base: {
                    href: '',
                    target: ''
                },
                meta: [
                    {
                        charset: 'UTF-8'
                    },
                    {
                        'http-equiv': 'X-UA-Compatible',
                        content: 'IE=edge'
                    },
                    {
                        'http-equiv': 'content-type',
                        content: 'text/html; charset=utf-8'
                    },
                    {
                        name: 'viewport',
                        content: 'width=device-width, initial-scale=1'
                    }
                ],
                link: [
                    // {
                    //     rel: 'icon',
                    //     href: '/favicon.ico'
                    // }
                ],
                style: [

                ],
                script: [

                ],
                noscript: {
                    link: [

                    ]
                },
                lang: 'en',
                dir: 'ltr'
            }
        },
        created() {
            let state = JSON.parse(JSON.stringify(this.$store.state))
            delete state.html
            delete state.template
            this.script.push({
                content: 'window.state='+JSON.stringify(state)
            })
            this.title = application.title(this)
            if(this.$store.state.html)
                Object.keys(this.$store.state.html).forEach(key => {
                    let data = this.$store.state.html[key]
                    switch(key) {
                        case 'meta':
                        case 'link':
                        case 'style':
                        case 'script':
                            if(data.add)
                                data.add.forEach(datum => {
                                    this[key].push(datum)
                                })
                            break
                    }
                })
        },
        components: {
            application: {
                ...application,
                $components: components,
                $modules: modules
            }
        },
        methods: {
            getComponent(component, task) {

                if(!component)
                    component = this.component

                if(!task)
                    task = this.task

                return components[component][task]
            }
        },
        computed: {
            component() {
                return this.$store.state.component || 'error'
            },
            task() {
                return this.$store.state.task || 'default'
            }
        }
    }

export default {
    renderer,
    components,
    modules,
    i18n,
    render(state) {
        return new Promise(resolve => {
            renderer.renderToString(
                new Vue({
                    store: new Vuex.Store({
                        state
                    }),
                    i18n: new VueI18n({
                        locale: 'en',
                        messages: i18n
                    }),
                    ...container
                }),
                (error, html) => {
                    resolve(html)
                }
            )
        })
    }
}