import { inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { FirebaseService } from '../shared/firebase.service';
import { BlogThumbnail } from './blog-list/blog-thumbnail.interface';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private firebaseService = inject<FirebaseService>(FirebaseService);
  private mockBlogThumbnails = signal([
    {
      title: "Exploring the Future of AI: Trends and Predictions",
      description: "A comprehensive look into the upcoming trends in artificial intelligence and how it will shape the world in the next decade.",
      date: new Date(2024, 8, 12),
      imageUrl: "https://example.com/images/ai-future.jpg",
      id: "1",
      author: "Jane Doe"
    },
    {
      title: "Mastering Angular: Best Practices for 2024",
      description: "Learn the best practices to improve your Angular applications in 2024. Stay updated with the latest tips and techniques.",
      date: new Date(2024, 7, 24),
      imageUrl: "https://example.com/images/angular-tips.jpg",
      id: "2",
      author: "John Smith"
    },
    {
      title: "Building Secure Web Applications: A Comprehensive Guide",
      description: "This guide covers the essential steps and techniques to secure your web applications from common vulnerabilities.",
      date: new Date(2024, 6, 14),
      imageUrl: "https://example.com/images/web-security.jpg",
      id: "3",
      author: "Alice Johnson"
    },
    {
      title: "Quantum Computing: Where Are We Now?",
      description: "A deep dive into the current state of quantum computing and its potential impact on industries worldwide.",
      date: new Date(2024, 8, 5),
      imageUrl: "https://example.com/images/quantum-computing.jpg",
      id: "4",
      author: "Bob Brown"
    },
    {
      title: "How to Use Firebase with Angular for Scalable Web Apps",
      description: "A step-by-step tutorial on integrating Firebase with Angular for building scalable and real-time web applications.",
      date: new Date(2024, 7, 2),
      imageUrl: "https://example.com/images/firebase-angular.jpg",
      id: "5",
      author: "Jane Doe"
    },
    {
      title: "The Rise of Server-Side Rendering: Angular and Beyond",
      description: "Explore the benefits and use cases of server-side rendering (SSR) in modern web development, focusing on Angular.",
      date: new Date(2024, 8, 1),
      imageUrl: "https://example.com/images/ssr-angular.jpg",
      id: "6",
      author: "John Smith"
    },
    {
      title: "Neuroscience and AI: Merging Two Powerful Disciplines",
      description: "Discover how advancements in neuroscience are influencing the development of artificial intelligence.",
      date: new Date(2024, 6, 18),
      imageUrl: "https://example.com/images/neuroscience-ai.jpg",
      id: "7",
      author: "Alice Johnson"
    },
    {
      title: "The Importance of UX/UI in Quantum Computing Applications",
      description: "Learn why user experience and interface design are becoming critical in the development of quantum computing applications.",
      date: new Date(2024, 5, 22),
      imageUrl: "https://example.com/images/ux-quantum-computing.jpg",
      id: "8",
      author: "Bob Brown"
    },
    {
      title: "Achieving Full Stack Mastery with Angular and Node.js",
      description: "A complete guide for developers looking to master full stack development using Angular on the frontend and Node.js on the backend.",
      date: new Date(2024, 6, 3),
      imageUrl: "https://example.com/images/angular-node.jpg",
      id: "9",
      author: "Jane Doe"
    },
    {
      title: "The Ethics of Artificial Intelligence: What You Should Know",
      description: "A critical analysis of the ethical concerns surrounding AI development and implementation in various industries.",
      date: new Date(2024, 5, 15),
      imageUrl: "https://example.com/images/ai-ethics.jpg",
      id: "10",
      author: "John Smith"
    }
  ]);
  blogList = this.mockBlogThumbnails.asReadonly();

}
