import UIkit from './libraries/uikit'
import Vue from 'vue'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import application from './application'

Vue.use(Vuex)
Vue.use(VueI18n)

export default class Application {
    constructor(vue, options = {}) {
        return new Vue({
            el: '#application',
            store: new Vuex.Store({
                state: window.state,
                ...(options.store || {})
            }),
            i18n: new VueI18n({
                locale: 'en',
                messages: {},
                ...(options.i18n || {})
            }),
            ...application,
            ...vue
        })
    }
}