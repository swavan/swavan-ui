import Vue  from 'vue';
import VueRouter from "vue-router";
import host from "../components/host";
import rules from '../components/rules'
import settings from '../components/settings';

Vue.use(VueRouter)

const routes = [
  { path: "/", name: "/", component: rules },
  { path: "/host", name: "host", component: host },
  { path: "/rules", name: "rules", component: rules },
  { path: "/settings", name: "settings", component: settings },
  { path: '*', redirect: '/' }
]

const router = new VueRouter({
    mode: "history",
    routes
})

export default router;