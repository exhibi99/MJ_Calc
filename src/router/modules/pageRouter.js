const pageRouter = {
    path: "/",
    name: "layout",
    redirect: "/main",
    component: () => import("@/layout/index.vue"),
    children: [
        {
            path: "/main",
            name: "main",
            component: () => import("@/views/main.vue"),
        },
        {
            path: "/info",
            name: "info",
            component: () => import("@/views/information.vue"),
        },
        {
            path: "/sketch",
            name: "sketch",
            component: () => import("@/views/sketch.vue"),
        },
    ],
};
export default pageRouter;