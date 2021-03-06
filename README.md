# vue-unsaved-changes

### Intro 
Bootstraps an unsaved change listener into your Vue 2 forms using both the native `window.onbeforeunload` method and vue-router's `beforeRouteLeave` hook

### Install

Install using NPM

```npm i git+https://github.com/hackerESQ/vue-unsaved-changes.git```


Add the following where you initialize Vue (main.js, app.js, etc):

```
import { UnsavedChangesPlugin } from 'vue-unsaved-changes';

Vue.use(UnsavedChangesPlugin);
```

### Use
Wrap your form in the `<unsaved-changes>` component. 

Add the `unsaved-listen` directive to form elements (text fields, selects, checkboxes, etc...)

Add the `$unsaved` middleware to `beforeRouteLeave` vue-router hook:

```
beforeRouteLeave (to, from, next) {
    this.$unsaved.middleware(next)
},
```

Now when you make changes to your form, and try to navigate away, you will be prompted to confirm navigation.

To clear the `dirty` form state, you can call the `$unsaved.dirty(false)` method with false as the first parameter, e.g:

```
save() {
    
    // save to database...
    
    // clear "dirty" state
    this.$unsaved.dirty(false)
}
```

### Example


```
<template>
    <unsaved-changes>
    
        <v-switch 
            label="Switch Label"
            v-model="switch"
            unsaved-listen
        />
        
        <v-btn @click="save">Submit</v-btn>

    </unsaved-changes>
</template>
<script>
    export default {
        methods: {
            save() {
                // save to database...
                // then... clear "dirty" state
                this.$unsaved.dirty(false)
            }
        },
        beforeRouteLeave (to, from, next) {
            this.$unsaved.middleware(next)
        },
    }
</script>

```


### Special cases
You can also listen to a custom method by setting a custom event on the `unsaved-listen` directive:

```
<v-switch unsaved-listen="change"/>
```
  
  
