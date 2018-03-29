import Vue from 'vue';
import $ from 'jquery'//引入elementui
import ElementUI from 'element-ui'//引入elementui
import 'element-ui/lib/theme-chalk/index.css'//引入elementui
import {router} from './router/index';
import {appRouter} from './router/router';
import store from './store';
import App from './app.vue';
import '@/locale';
import VueI18n from 'vue-i18n';
import util from '@/libs/util';

//ol

Vue.use(VueI18n);
Vue.use(ElementUI);
Vue.prototype.util = util
new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted () {
        this.currentPageName = this.$route.name;
        // 显示打开的页面的列表
        this.$store.commit('setOpenedList');
        this.$store.commit('initCachepage');
        // 权限菜单过滤相关
        this.$store.commit('updateMenulist');
    },
    created () {
        let tagsList = [];
        appRouter.map((item) => {
            if (item.children.length <= 1) {
                tagsList.push(item.children[0]);
            } else {
                tagsList.push(...item.children);
            }
        });
        this.$store.commit('setTagsList', tagsList);
    }
});
