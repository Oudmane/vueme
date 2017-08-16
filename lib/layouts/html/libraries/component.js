"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    extend: function extend(component) {

        var render = component.render;

        component.render = function (h) {

            return render.bind(this)(h, this.$store.state.state, this.$t.bind(this));
        };

        return component;
    }
};