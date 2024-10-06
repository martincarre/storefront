import { Routes } from '@angular/router';
import { BlogListComponent } from './blog/blog-list/blog-list.component';
import { BlogDetailsComponent } from './blog/blog-details/blog-details.component';
import { BlogpostNewComponent } from './blog/blogpost-new/blogpost-new.component';

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
    // Avoid lazy loading for the blog module to keep the blog list and details components in the initial bundle for SEO
    {
        path: 'news',
        children: [
            {
                path: 'news-list',
                component: BlogListComponent,
                title: 'News',
                // resolve: {
                //     articles: () => inject(BlogService).getBlogPosts()
                // }
            },
            {
                path: 'article/:articleId',
                component: BlogDetailsComponent,
                title: 'Article'
            },
            {
                path: 'new-article',
                component: BlogpostNewComponent,
                title: 'New Article',
            },
            {
                path: 'new-article/:articleId',
                component: BlogpostNewComponent,
                title: 'Edit Article',
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
