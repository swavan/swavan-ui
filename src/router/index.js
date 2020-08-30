import Vue  from 'vue';
import VueRouter from "vue-router";


Vue.use(VueRouter)

const routes = [
 //  { path: "/home", name: "Home", component: Home },
]

const router = new VueRouter({
    mode: "history",
    routes
})

export default router;