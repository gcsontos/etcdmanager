import VueI18n from 'vue-i18n';
import Vue from 'vue';
import lang from './en';

Vue.use(VueI18n);

export const i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: lang,
});

export const loadedLang = ['en'];
