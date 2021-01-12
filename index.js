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
    listenAttr: 'unsaved-listen'
}

/**
 *  Vue Component
 */

const UnsavedChangesComponent = Vue.component('UnsavedChanges',{
    name: "UnsavedChanges",

    render() {
        return this.$slots.default
    },
    mounted() {
        this.addVueListeners(this.$children)
    },
    methods: {
        addVueListeners(nodes) {

            nodes.forEach((item) => {

                if (Object.keys(item.$attrs).indexOf(pluginOptions.listenAttr) > -1) {
                    item.$on('input', (e) => {
                        this[pluginOptions.globalProperty].dirty(true)
                        this.$emit('change-detected',true)
                    })
                }    
                
                // keep going down the node list?
                if (Object.keys(item.$children).length > 0 ) {
                    this.addVueListeners(item.$children);
                }

            })
        }
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
            dirty(val=null) {
                if (val !== null) {
                    // console.log('currently: '+this.isDirty)
                    // console.log('updating val to: '+val)
                    this.isDirty = val
                    // console.log('new val: ' + this.isDirty)
                } else {
                    return this.isDirty
                }
            },
            routerLogic(next) {
                if (this.$unsaved.dirty()) {
                    if (window.confirm ('There are unsaved changes. Are you sure you want to leave?')) {
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
