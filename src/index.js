import path from 'path'
import fs from 'fs'
import httpAccepts from 'accepts'

let layouts = {},
    layoutsDir = path.join(__dirname, './layouts')

fs.readdirSync(layoutsDir).forEach(layout => {
    if(layout = layout.match(/(.*)\.js/)) {
        layout = layout[1]
        layouts[layout] = require(path.join(layoutsDir, `${layout}.js`)).default
    }
})

class Template {
    static render({body, status = 200, headers = {}}, application) {
        return new Promise((resolve, reject) => {

            if([301, 302].includes(status))
                if(application.socket)
                    resolve({
                        body: {},
                        redirect: {
                            url: headers.location
                        }
                    })

                else
                    resolve({
                        status,
                        headers,
                        body: ''
                    })

            else

            if(application.socket)
                resolve({body})

            else if(body.constructor.name == 'Object')
                switch(httpAccepts(application.http.request).type(['html', 'json'])) {
                    case 'html':
                        let layout = layouts['html']
                        if(layout.render)
                            layout.render(body).then(body => {
                                resolve({
                                    status: status || 200,
                                    headers,
                                    body
                                })
                            })
                        else
                            resolve({
                                status: 200,
                                headers,
                                body: JSON.stringify(body, null, 4)
                            })
                        break
                    default:

                        ['template', 'html'].forEach(key => {
                            if(body[key])
                                delete body[key]
                        })

                        resolve({
                            status: 200,
                            headers: {
                                ...headers,
                                'Content-Type': 'application/json; charset=UTF-8'
                            },
                            body: JSON.stringify(body, null, 4)
                        })
                        break
                }

            else
                resolve({
                    status: status || 200,
                    headers,
                    body
                })

        })
    }
    static loadComponents(componentsDir) {
        return new Promise(done => {
            Object.keys(layouts).forEach(layout => {
                fs.readdirSync(componentsDir).forEach(component => {
                    let componentDir = path.join(componentsDir, component)
                    if(fs.statSync(componentDir).isDirectory()) {
                        let controllerFile = path.join(componentDir, 'vue', `${layout}.js`),
                            tasksDir = path.join(componentDir, 'tasks')
                        if(fs.existsSync(controllerFile)) {
                            if(!layouts[layout].components[component])
                                layouts[layout].components[component] = {}
                            layouts[layout].components[component]['default'] = require(controllerFile).default
                        } if(fs.existsSync(tasksDir))
                            fs.readdirSync(tasksDir).forEach(task => {
                                let taskDir = path.join(tasksDir, task)
                                if(fs.statSync(componentDir).isDirectory()) {
                                    let taskFile = path.join(taskDir,  'vue', `${layout}.js`)
                                    if(fs.existsSync(taskFile)) {
                                        if(!layouts[layout].components[component])
                                            layouts[layout].components[component] = {}
                                        layouts[layout].components[component][task] = require(taskFile).default
                                    }
                                }
                            })
                    }
                })
            })
            done(layouts)
        })
    }
    static loadModules(modulesDir) {
        return new Promise(done => {
            Object.keys(layouts).forEach(layout => {
                fs.readdirSync(modulesDir).forEach(module => {
                    let moduleDir = path.join(modulesDir, module)
                    if(fs.statSync(moduleDir).isDirectory()) {
                        let moduleFile = path.join(moduleDir, 'vue', `${layout}.js`)
                        if(fs.existsSync(moduleFile))
                            layouts[layout].modules[module] = require(moduleFile).default
                    }
                })
            })
            done(layouts)
        })
    }
    static loadLocales(componentsDir, modulesDir = '') {
        return new Promise(done => {
            Object.keys(layouts).forEach(layout => {
                fs.readdirSync(componentsDir).forEach(component => {
                    let componentDir = path.join(componentsDir, component)
                    if(fs.statSync(componentDir).isDirectory()) {
                        let componentFile = path.join(componentDir, 'locale', `source.js`)
                        if(fs.existsSync(componentFile))
                            layouts[layout].i18n.en[component] = require(componentFile).default
                    }
                })
            })
            done(layouts)
        })
    }
}

export default Template