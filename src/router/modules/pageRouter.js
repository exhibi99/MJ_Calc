const withPrefix = (prefix, routes) =>
    routes.map((route) => {
    route.path = prefix + route.path;
    return route;
});

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
            path: "/test",
            name: "test",
            component: () => import("@/views/test.vue"),
        },
    ],
};
export default pageRouter;