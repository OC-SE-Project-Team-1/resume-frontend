import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: "/",
      name: "home",
      component: () => import("./views/Home.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("./views/SignUp.vue"),
    },
    {
      path: "/account",
      name: "account",
      component: () => import("./views/Account.vue"),
    },
    {
      path: "/createstory",
      name: "createstory",
      component: () => import("./views/CreateStory.vue"),
    },
    {
      path: "/library",
      name: "library",
      component: () => import("./views/Library.vue"),
    },
    {
      path: "/library/view",
      name: "view",
      component: () => import("./views/View.vue"),
    },
    {
      path: "/library/view/edit",
      name: "edit",
      component: () => import("./views/EditStory.vue"),
    },
    {
      path: "/library/view/extend",
      name: "extend",
      component: () => import("./views/ExtendStory.vue"),
    },
    {
      path: "/createResume/selectTemplate",
      name: "selectTemplate",
      component: () => import("./views/SelectTemplate.vue"),
    },
    {
      path: "/createResume/inputInfo",
      name: "inputInfo",
      component: () => import("./views/CreateResumeInputInfo.vue"),
    }
  ],
});

export default router;
