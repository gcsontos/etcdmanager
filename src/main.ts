import Vue from 'vue';
import Vuetify from 'vuetify';
import Vuelidate from 'vuelidate';
import vueLocalStorage from 'vue-localstorage';
import { ValidationError } from './lib/validation-error.class';
import App from './components/app.vue';
import router from './router';
import store from './store';
import { i18n } from './i18n';

import PurgeDialog from './components/purge.dialog.vue';
import 'vuetify/dist/vuetify.min.css';
import NoSelectionDialog from './components/no-selection.dialog.vue';
import DeleteDialog from './components/delete.dialog.vue';
import SaveAsDialog from './components/save-as.dialog.vue';
import MessageDialog from './components/message.dialog.vue';

Vue.config.productionTip = false;
Vue.config.devtools = true;

Vue.use(vueLocalStorage, {
    name: 'ls',
    bind: true,
});

Vue.use(Vuetify, {
    lang: {
        t: (key, ...params) => i18n.t(key, params),
    },
});
Vue.use(Vuelidate);

Vue.component('no-selection-dialog', NoSelectionDialog);
Vue.component('purge-dialog', PurgeDialog);
Vue.component('delete-dialog', DeleteDialog);
Vue.component('save-as-dialog', SaveAsDialog);
Vue.component('message-dialog', MessageDialog);

// @ts-ignore
Vue.config.errorHandler = function (err: any, vm: Vue, info: any) {
    if (!(err instanceof ValidationError)) {
        console.log(`Error: ${err}\nInfo: ${info}`);
    }
};

new Vue({
    i18n,
    router,
    store,
    validations: {},
    render: (h) =>
        //  @ts-ignore
        h(App),
    mounted() {
        if (this.$route.path !== '/') {
            this.$router.push('/');
        }
    },
}).$mount('#app');
