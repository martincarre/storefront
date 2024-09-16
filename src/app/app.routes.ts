import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '', 
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import("./home/index/index.component").then(c => c.IndexComponent),
        title: 'Maps Business Searcher',
    },
    {
        path: 'news',
        children: [
            {
                path: 'news-list',
                loadComponent: () => import("./blog/blog-list/blog-list.component").then(c => c.BlogListComponent),
                title: 'News',
            },
            {
                path: ':articleId',
                loadComponent: () => import("./blog/blog-details/blog-details.component").then(c => c.BlogDetailsComponent),
                title: 'Article'
            }
        ]
    },
    {
        path: 'user',
        children: [
            {
                path: 'login',
                loadComponent: () => import("./user/login/login.component").then(c => c.LoginComponent),
                title: 'Login',
            },
            {
                path: 'signup',
                loadComponent: () => import("./user/signup/signup.component").then(c => c.SignupComponent),
                title: 'Signup',
            },
            {
                path: 'settings',
                loadComponent: () => import("./user/user-details/user-details.component").then(c => c.UserDetailsComponent),
            }
        ]
    },
    {
    path: 'pricing',
    loadComponent: () => import("./home/pricing/pricing.component").then(c => c.PricingComponent),
    title: 'Pricing',
    },
];
