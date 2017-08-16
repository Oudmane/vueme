let UIkit, UIkitIcons;

if(typeof window != 'undefined') {

    UIkit = require('uikit/src/js/uikit').default

    UIkitIcons = require('uikit/dist/js/uikit-icons')

    UIkitIcons(UIkit)

}

export default UIkit