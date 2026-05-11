
import { createWebHashHistory } from "vue-router";
import App from "./App.vue";
import HelloWorld from "./components/HelloWorld.vue";
import popa from "./components/popa.vue";
const routes = [
    {path: '/', component: App, name: 'main'},
    {path: '/colorInfo', component: HelloWorld, name: 'colorInfo'},
    {path: '/color', component: popa, name: 'color'}
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
})