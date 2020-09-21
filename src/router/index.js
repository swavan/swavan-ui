import Vue  from 'vue';
import VueRouter from "vue-router";

Vue.use(VueRouter)

function lazyLoad(view){
  return() => import(`../components/${view}.vue`)
}

const routes = [
  { path: "/", name: "/", component: lazyLoad("rules") },
  { path: "/swavan-host", name: "swavan-host", component: lazyLoad("host") },
  { path: "/swavan-rules", name: "swavan-rules", component: lazyLoad("rules") },
  { path: "/swavan-settings", name: "swavan-settings", component: lazyLoad("settings") },
  { path: "/swavan-about", name: "swavan-about", component: lazyLoad("about") },
  { path: '*', redirect: '/' }
]

const router = new VueRouter({
    mode: "hash",
    routes
})

export default router;