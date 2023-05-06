import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/newpost',
            name: 'newpost',
            component: () => import("../views/NewPostView.vue"),
        }
    ],
});