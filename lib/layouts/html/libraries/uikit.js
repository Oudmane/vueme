'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var UIkit = void 0,
    UIkitIcons = void 0;

if (typeof window != 'undefined') {

    UIkit = require('uikit/src/js/uikit').default;

    UIkitIcons = require('uikit/dist/js/uikit-icons');

    UIkitIcons(UIkit);
}

exports.default = UIkit;