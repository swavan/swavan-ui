import Vue  from 'vue';
import VueRouter from "vue-router";
import host from "../components/host";
import rules from '../components/rules'
import settings from '../components/settings';
import about from '../components/about';

Vue.use(VueRouter)

const routes = [
  { path: "/", name: "/", component: rules },
  { path: "/swavan-host", name: "swavan-host", component: host },
  { path: "/swavan-rules", name: "swavan-rules", component: rules },
  { path: "/swavan-settings", name: "swavan-settings", component: settings },
  { path: "/swavan-about", name: "swavan-about", component: about },
  { path: '*', redirect: '/' }
]

const router = new VueRouter({
    mode: "history",
    routes
})

export default router;