import Vue from "vue";
import VueRouter from "vue-router";
import pageRouter from "./modules/pageRouter";
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';

Vue.use(VueRouter);
// Vue.use(ElementUI);

const router = new VueRouter({
    mode:"history",
    routes: [ pageRouter ]
});
export default router;