import API from './API'
import jQuery from 'jquery'
import FormSerializer from 'form-serializer'
import EventEmitter from 'eventemitter3'

const classes = () => {
        return {
            'header-mobile': [
                'tm-header-mobile',
                'uk-hidden@m'
            ],
            'toolbar': [
                'tm-toolbar',
                'uk-visible@m'
            ],
            'toolbar.container': [
                'uk-container',
                'uk-flex',
                'uk-flex-middle'
                // 'uk-container-expand'
            ],
            'toolbar-left': [
                'uk-grid-medium',
                'uk-child-width-auto',
                'uk-flex-middle'
            ],
            'toolbar-right': [
                'uk-grid-medium',
                'uk-child-width-auto',
                'uk-flex-middle'
            ],
            'header': [
                'tm-header',
                'uk-visible@m'
            ],
            'header.container': [
                'uk-navbar-container'
            ],
            'main': [
                'tm-main',
                'uk-section',
                'uk-section-default'
            ],
            'main.container': [
                'uk-container'
            ],
            'main.grid': [
                'uk-grid'
            ]
        }
    },
    title = (instance) => {
        let title = '',
            separator = '-',
            tail = '',
            beforeload = instance.getComponent('system', 'beforeload')

        if(instance.getComponent().title)
            title = instance.getComponent().title(instance, instance.$store.state)

        if(beforeload && beforeload.title && beforeload.title.tail)
            tail = beforeload.title.tail(instance, instance.$store.state)

        return title + (tail ? ` ${separator} ` + tail : '')
    },
    events = new EventEmitter()

export default {
    name: 'application',
    title,
    data() {
        return {
            busy: true
        }
    },
    render(h) {
        let {classes, position, busy, component, task} = this
        return (
            <div class="uk-offcanvas-content" component={component} task={task}>
                <div class={classes['header-mobile']}>
                    <nav class="uk-navbar-container" uk-navbar="">
                        <div class="uk-navbar-left">
                            {position('mobile-navbar-left', h)}
                        </div>
                        <div class="uk-navbar-center">
                            {position('mobile-navbar-center', h)}
                        </div>
                        <div class="uk-navbar-right">
                            {position('mobile-navbar-right', h)}
                        </div>
                    </nav>
                </div>
                <div class={classes['toolbar']}>
                    <div class={classes['toolbar.container']}>
                        <div>
                            <div class={classes['toolbar-left']} uk-grid="margin: uk-margin-small-top">
                                {position('toolbar-left', h)}
                            </div>
                        </div>
                        <div class="uk-margin-auto-left">
                            <div class={classes['toolbar-right']} uk-grid="margin: uk-margin-small-top">
                                {position('toolbar-right', h)}
                            </div>
                        </div>
                    </div>
                </div>
                <div class={classes['header']} uk-header="">
                    <div class={classes['header.container']}>
                        <div class="uk-container">
                            <nav class="uk-navbar" uk-navbar="">
                                <div class="uk-navbar-left">
                                    {position('navbar-left', h)}
                                </div>
                                <div class="uk-navbar-center">
                                    {position('navbar-center', h)}
                                </div>
                                <div class="uk-navbar-right">
                                    {position('navbar-right', h)}
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
                {position('section-top', h)}
                {(() => {
                    let component = position(`component`, h)
                    return component ?
                        <div class={classes['main']} uk-height-viewport="expand: true">
                            <div class={classes['main.container']}>
                                <div class={classes['main.grid']} uk-grid="">
                                    <div class="uk-width-expand@m">
                                        {position(`component`, h)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        : ''
                })()}
                {position('section-bottom', h)}
                <div class={classes['footer']}>
                    {position('footer', h)}
                </div>
                <div class="uk-position-fixed uk-position-bottom-right uk-overlay" domPropsHidden={!busy}>
                    <div uk-spinner=""></div>
                </div>
            </div>
        )
    },
    created() {
        events.emit('created', this)
    },
    mounted() {
        jQuery.fn.URI = function () {
            switch(this.prop('tagName')) {
                case 'A':
                    return this[0].href.replace(location.origin, '')
                    break
                case 'FORM':
                    return this[0].action.replace(location.origin, '')
                    break
                default:
                    return jQuery(this).attr('href')
                    break
            }
        }
        jQuery.expr[':'].external = (a) => {
            let href = jQuery(a).URI()
            return href !== undefined && href.search(/^(\w+:)?\/\//) !== -1
        }
        jQuery.expr[':'].internal = (a) => {
            return jQuery(a).URI() !== undefined && !jQuery.expr[':'].external(a)
        }
        window.onpopstate = ({state}) => {
            this.request(state, false)
        }
        history.replaceState({url:location.pathname+location.search}, '', location.pathname+location.search)
        jQuery($ => {
            $('body').on('click', '[href]:not([noj],[href*="#"]):internal', ({currentTarget, ctrlKey, altKey, shiftKey, metaKey}) => {
                if(ctrlKey || altKey || shiftKey || (metaKey && !ctrlKey))
                    return true
                this.request({
                    url: $(currentTarget).URI()
                })
                return false
            })
            $('body').on('submit', '[action]:not([noj]):internal', ({currentTarget, ctrlKey, altKey, shiftKey, metaKey}) => {
                if(ctrlKey || altKey || shiftKey || (metaKey && !ctrlKey))
                    return true
                this.request({
                    url: $(currentTarget).URI(),
                    method: $(currentTarget).attr('method'),
                    data: $(currentTarget).serializeObject()
                }, false)
                return false
            })
        })
        API.connect().then(() => {
            this.busy = false
        })
        events.emit('mounted', this)
        this.$nextTick(() => {
            this.render()
        })
    },
    methods: {
        render() {
            events.emit('render', this)
        },
        position(position, _h) {
            let render = ''
            switch (position) {
                case 'component':
                    let component = this.getComponent()

                    if(component.render || component.template)
                        render = _h(component)
                    break
                default:
                    if(this.$store.state.modules[position]) {
                        render = this.$store.state.modules[position].map(module => {
                            return _h(this.getModule(module.name), {props: {data: module.data}, ref: `${position}.${module.name}`})
                        })
                    }
                    break
            }
            return render
        },
        getComponent(component, task) {

            if(!component)
                component = this.component

            if(!task)
                task = this.task

            if(this.$options.$components[component])

                if(this.$options.$components[component][task])

                    return this.$options.$components[component][task]

            return null
        },
        getModule(module) {
            return this.$options.$modules[module] || null
        },
        request(state, push = true) {
            this.busy = true
            API.request(state).then(response => {
                this.$store.replaceState(response)
                this.$nextTick(() => {

                    this.updateTitle()

                    if(push)
                        history.pushState(state, document.title, response.uri || state.url)

                    else
                        history.replaceState(state, document.title, response.uri || state.url)

                    this.busy = false

                })
            })
        },
        updateTitle() {
            document.title = title(this)
        },
        reload() {
            return this.request(history.state, false)
        }
    },
    computed: {
        classes() {
            let Classes = classes(),
                componentClasses = this.getComponent().classes ? this.getComponent().classes(this, this.$store.state) : {},
                apply = (classes, changes) => {
                    if(Object.keys(changes).length) {
                        for (let position in changes) {
                            if (changes[position].set) {
                                classes[position] = changes[position].set
                            } else {
                                if (changes[position].append) {
                                    classes[position] = classes[position].concat(changes[position].append)
                                }
                                if (changes[position].prepend) {
                                    classes[position] = changes[position].prepend.concat(classes[position])
                                }
                                if (changes[position].remove) {
                                    changes[position].remove.forEach((className) => {
                                        let index = classes[position].indexOf(className)
                                        if (index != -1)
                                            classes[position].splice(index, 1)
                                    })
                                }
                            }
                        }
                    }
                }
            if(this.$options.$components.system && this.$options.$components.system.beforeload && this.$options.$components.system.beforeload.classes)
                apply(Classes, this.$options.$components.system.beforeload.classes(this, this.$store.state))
            apply(Classes, componentClasses)
            if(this.$options.$components.system && this.$options.$components.system.afterload && this.$options.$components.system.afterload.classes)
                apply(Classes, this.$options.$components.system.afterload.classes(this, this.$store.state))
            return Classes
        },
        component() {
            return this.$store.state.component || 'error'
        },
        task() {
            return this.$store.state.task || 'default'
        }
    },
    on() {
        return events.on.apply(events, arguments)
    },
    once() {
        return events.once.apply(events, arguments)
    },
    emit() {
        return events.emit.apply(events, arguments)
    },
    remove() {
        return events.removeListener.apply(events, arguments)
    }
}