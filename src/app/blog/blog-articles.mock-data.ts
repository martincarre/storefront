import { BlogArticle } from "./blog-details/blog-article.class";

export const MOCKBLOGARTICLES: BlogArticle[] = [
    new BlogArticle({
      title: "Exploring Angular Signals: A New Way to Reactivity",
      subtitle: 'A cool new tool',
      description: "A comprehensive look into Angular's latest feature - Signals",
      date: new Date("2023-09-01"),
      thumbnailImage: { imageUrl: "https://example.com/angular-signals-thumbnailImage.jpg", alt: "Angular Signals" },
      id: "1",
      author: "John Doe",
      sections: [
        {
          title: "Introduction to Signals",
          content: "Signals in Angular provide a fresh approach to handling reactivity. They simplify state management and enhance performance by reducing unnecessary recalculations."
        },
        {
          title: "Why Signals Matter",
          content: "Signals help developers manage complex state without the need for more traditional techniques like Observables or state management libraries, making code more intuitive and easier to maintain."
        }
      ]
    }),
    new BlogArticle({
      title: "Boosting Performance with Firebase Caching Strategies",
      subtitle: 'A guide to optimizing performance',
      description: "Best practices to leverage caching in Firebase applications",
      date: new Date("2023-08-15"),
      thumbnailImage: { imageUrl: "https://example.com/firebase-caching-thumbnailImage.jpg", alt: "Firebase Caching" },
      id: "2",
      author: "Jane Smith",
      sections: [
        {
          title: "Introduction to Firebase Caching",
          content: "Caching is essential for improving the performance of Firebase applications, particularly when dealing with high-frequency database calls or large datasets."
        },
        {
          title: "Implementing Effective Caching",
          content: "Firebase offers several built-in options for caching data locally, which can be configured to suit the specific needs of your application. This guide explains how to optimize these settings."
        }
      ]
    }),
    new BlogArticle({
      title: "Understanding the Intersection of AI and Web Development",
      subtitle: 'A look into the future',
      description: "How AI is transforming the web development landscape",
      date: new Date("2023-07-20"),
      thumbnailImage: { imageUrl: "thumb-test.jpg", alt: "AI in Web Development" },
      id: "3",
      author: "Emily Johnson",
      sections: [
        {
          title: "AI in Web Design",
          content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          illustration: {
            imageUrl: "blog-test.jpg",
            alt: "Test1"
          },
          divider: true
        },
        {
          illustration: {
            imageUrl: "blog-test.jpg",
            alt: "Test"
          },
          title: "AI-Driven Development",
          content: "Developers are leveraging AI to assist with code generation, testing, and even predicting bugs before they happen, significantly speeding up the development process."
        }
      ]
    }),
    new BlogArticle({
      title: "Top 5 Strategies to Improve Angular SEO",
      subtitle: 'Boost your app visibility',
      description: "Boost your Angular app's visibility with these SEO tips",
      date: new Date("2023-07-01"),
      thumbnailImage: { imageUrl: "https://example.com/angular-seo-thumbnailImage.jpg", alt: "Angular SEO" },
      id: "4",
      author: "Michael Brown",
      sections: [
        {
          title: "SEO Best Practices for Angular",
          content: "Ensuring your Angular app is SEO-friendly can greatly enhance its discoverability. Use tools like Angular Universal for server-side rendering to improve your app's indexing."
        },
        {
          title: "Optimizing Page Load Speed",
          content: "Page load speed is a critical SEO factor. Techniques like lazy loading, pre-rendering, and caching can significantly improve load times and boost search engine rankings."
        }
      ]
    }),
    new BlogArticle({
      title: "The Future of Web Applications: Serverless Architecture",
      subtitle: 'A modern approach',
      description: "Why serverless architecture is gaining traction",
      date: new Date("2023-06-25"),
      thumbnailImage: { imageUrl: "https://example.com/serverless-thumbnailImage.jpg", alt: "Serverless Architecture" },
      id: "5",
      author: "Sarah Green",
      sections: [
        {
          title: "What is Serverless Architecture?",
          content: "Serverless architecture enables developers to focus solely on building applications without worrying about the underlying infrastructure, as servers are managed by cloud providers."
        },
        {
          title: "Benefits of Going Serverless",
          content: "Going serverless allows for automatic scaling, reduced operational costs, and faster development times, making it a compelling choice for modern web applications."
        }
      ]
    }),
    new BlogArticle({
      title: "Building Scalable Web Applications with Firebase Functions",
      subtitle: 'A guide to scalability',
      description: "An in-depth guide to leveraging Firebase Functions for scalability",
      date: new Date("2023-06-15"),
      thumbnailImage: { imageUrl: "https://example.com/firebase-functions-thumbnailImage.jpg", alt: "Firebase Functions" },
      id: "6",
      author: "David Wilson",
      sections: [
        {
          title: "Introduction to Firebase Functions",
          content: "Firebase Functions provide a serverless backend solution that enables developers to write custom logic that automatically scales based on demand."
        },
        {
          title: "Scaling with Firebase Functions",
          content: "By offloading backend tasks to Firebase Functions, you can build highly scalable applications without worrying about server management or infrastructure scaling."
        }
      ]
    }),
    new BlogArticle({
      title: "Introduction to Progressive Web Apps (PWAs)",
      subtitle: 'The future of mobile development',
      description: "Why PWAs are revolutionizing mobile development",
      date: new Date("2023-05-05"),
      thumbnailImage: { imageUrl: "https://example.com/pwa-thumbnailImage.jpg", alt: "Progressive Web Apps" },
      id: "7",
      author: "Laura Davis",
      sections: [
        {
          title: "What are PWAs?",
          content: "Progressive Web Apps are web applications that offer native-like performance and capabilities, including offline access, push notifications, and faster load times."
        },
        {
          title: "The Advantages of PWAs",
          content: "PWAs provide a seamless user experience across devices and can reduce the need for multiple platform-specific applications, making them cost-effective and easier to maintain."
        }
      ]
    }),
    new BlogArticle({
      title: "Mastering TypeScript for Angular Development",
      subtitle: 'A developer\'s guide',
      description: "A guide to understanding and using TypeScript effectively",
      date: new Date("2023-04-15"),
      thumbnailImage: { imageUrl: "https://example.com/typescript-thumbnailImage.jpg", alt: "TypeScript for Angular" },
      id: "8",
      author: "Tom Lee",
      sections: [
        {
          title: "Why TypeScript Matters",
          content: "TypeScript offers type safety, which helps developers avoid errors early in development. It also integrates seamlessly with Angular, making it a critical tool for modern Angular development."
        },
        {
          title: "Advanced TypeScript Features",
          content: "Understanding advanced TypeScript features like decorators, generics, and union types can take your Angular development to the next level."
        }
      ]
    }),
    new BlogArticle({
      title: "Leveraging Firebase Authentication for Seamless User Management",
      subtitle: 'A deep dive into Firebase Auth', 
      description: "A deep dive into Firebase Auth and its benefits",
      date: new Date("2023-03-20"),
      thumbnailImage: { imageUrl: "https://example.com/firebase-auth-thumbnailImage.jpg", alt: "Firebase Authentication" },
      id: "9",
      author: "Chris White",
      sections: [
        {
          title: "Introduction to Firebase Authentication",
          content: "Firebase Authentication simplifies the process of managing user identities, whether through email/password, social logins, or phone number authentication."
        },
        {
          title: "Implementing Firebase Auth",
          content: "This guide walks through implementing Firebase Authentication in your Angular app and offers tips for managing user sessions, roles, and more."
        }
      ]
    }),
    new BlogArticle({
      title: "Building Modern E-commerce with Angular and Firebase",
      subtitle: 'A guide to e-commerce',
      description: "Best practices for creating scalable e-commerce platforms",
      date: new Date("2023-03-05"),
      thumbnailImage: { imageUrl: "https://example.com/ecommerce-thumbnailImage.jpg", alt: "Angular and Firebase" },
      id: "10",
      author: "Alex Thompson",
      sections: [
        {
          title: "Why Angular and Firebase?",
          content: "Angular and Firebase together provide a powerful stack for building modern, scalable e-commerce applications. Firebase offers real-time data handling and authentication, while Angular provides a solid frontend framework."
        },
        {
          title: "Key Features for E-commerce",
          content: "Learn how to implement essential e-commerce features like user authentication, shopping carts, and real-time order tracking with Angular and Firebase."
        }
      ]
    })
  ];