import jQuery from 'jquery'
import EventEmitter from 'eventemitter3'

let websocket,
    ajax,
    events = new EventEmitter()

class API {
    static request(options) {
        return new Promise((resolve, reject) => {
            let id = this.generateID()
            if(!options.method)
                options.method = 'GET'
            if(options.method == 'GET' && options.data) {
                if(Object.keys(options.data).length)
                    options.url += '?'+jQuery.param(options.data)
                delete options.data
            }
            events.once(id, resolve)
            if(websocket && websocket.readyState == WebSocket.OPEN)
                websocket.send(JSON.stringify({
                    id,
                    ...options
                }))
            else if(ajax && [XMLHttpRequest.UNSENT, XMLHttpRequest.DONE].indexOf(ajax.readyState) == -1)
                jQuery.when(ajax).done(() => {
                    this.request(options).then(resolve)
                })
            else
                ajax = jQuery.ajax({
                    url: options.url,
                    method: options.method || 'GET',
                    data: options.data || false,
                    cache: false,
                    headers: options.headers || {},
                    dataType: options.dataType || 'json',
                    success(response) {
                        events.emit(id, response)
                    }
                })

        })
    }
    static get(url, data = {}) {
        return this.request({
            method: 'GET',
            url,
            data
        })
    }
    static post(url, data = {}) {
        return this.request({
            method: 'POST',
            url,
            data
        })
    }
    static connect() {
        return new Promise((resolve) => {
            if(WebSocket) {
                websocket = new WebSocket(location.protocol.replace('http', 'ws')+'//'+location.hostname+':'+location.port)
                websocket.onmessage = (message) => {
                    message = JSON.parse(message.data)
                    if(message.request)
                        this.request({
                            ...message.request,
                            id: message.id
                        })
                    else
                        events.emit(message.id, message.response)
                }
                websocket.onopen = () => {
                    events.emit('open')
                }
                events.once('open', resolve)
            } else
                resolve()
        })
    }
    static generateID(length = 16) {
        let text = '',
            possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        for (let i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length))
        return text
    }
    static isInSocket() {
        return websocket && websocket.readyState == WebSocket.OPEN
    }
    static on() {
        return events.on.apply(events, arguments)
    }
    static once() {
        return events.once.apply(events, arguments)
    }
    static emit() {
        return events.emit.apply(events, arguments)
    }
    static remove() {
        return events.removeListener.apply(events, arguments)
    }
}

export default API