/**
 *  External Modules
 */

import Vue from "vue";

/**
 *  Vue Instance Definition
 */

let instance;

export const getInstance = () => instance;

/**
 *  Plugin Options
 */

const pluginOptions = {
    globalProperty: '$unsaved',
    listenAttr: 'unsaved-listen',
    conditionalAttr: 'unsaved-if',
}

/**
 *  Vue Component
 */

const UnsavedChangesComponent = Vue.component('UnsavedChanges', {
    name: "UnsavedChanges",

    render() {
        return this.$slots.default
    },
    mounted() {
        this.addVueListeners(this.$children)
    },
    methods: {
        addVueListeners(nodes) {
            // iterate through each node
            nodes.forEach((item) => {

                // add listener if it has the listener attr
                if (Object.keys(item.$attrs).indexOf(pluginOptions.listenAttr) > -1) {

                    // reads custom event, if defined on the unsaved-listen attr
                    let event = 'input'
                    if (!!item.$attrs[pluginOptions.listenAttr]) {
                        event = item.$attrs[pluginOptions.listenAttr]
                    }

                    // attaches listener
                    item.$on(event, (e) => {
                        // check if a conditional has been added
                        if (Object.keys(this.$attrs).includes(pluginOptions.conditionalAttr) && !!this.$attrs[pluginOptions.conditionalAttr]) {
                            // set dirty and emit event
                            this[pluginOptions.globalProperty].dirty(true)
                            this.$emit('change-detected', e)
                        }
                    })
                }

                // keep going down the node list?
                if (Object.keys(item.$children).length > 0) {
                    this.addVueListeners(item.$children);
                }

            })
        }
    },
    beforeDestroy() {
        // clean up
        this[pluginOptions.globalProperty].dirty(false)
    }
})

/**
 *  Vue Instance Initialization
 */

export const UnsavedChanges = () => {
    if (instance) return instance;

    instance = new Vue({
        data() {
            return {
                isDirty: false,
            };
        },
        render() {
            return this.$slots.default
        },
        components: {
            UnsavedChanges: UnsavedChangesComponent
        },
        methods: {
            dirty(val = null) {
                if (val !== null) {
                    this.isDirty = val

                    // set native navigation middelware
                    window.onbeforeunload = () => {
                        return this.isDirty || null;
                    };
                } else {
                    return this.isDirty
                }
            },
            middleware(next) {
                // set vue router navigation middleware             
                if (this[pluginOptions.globalProperty].dirty()) {
                    if (window.confirm('There are unsaved changes. Are you sure you want to leave?')) {
                        this.isDirty = false
                        return next()
                    }
                    return next(false)
                }
                return next()
            }
        }
    });

    return instance;
};

/**
 *  Vue Plugin Definition
 */

export const UnsavedChangesPlugin = {
    install(Vue, options) {
        Vue.prototype[pluginOptions.globalProperty] = UnsavedChanges(options);
    },
};
