export default {
    extend(component) {

        let render = component.render

        component.render = function(h) {

            return render.bind(this)(h, this.$store.state.state, this.$t.bind(this))

        }

        return component

    }
}