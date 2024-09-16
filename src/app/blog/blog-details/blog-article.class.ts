import { BlogArticleBase } from "../blog-list/blog-thumbnail/blog-article-base.class";

export class BlogArticle extends BlogArticleBase {
  subtitle: string;
  sections: Section[];

  constructor(options: {
    title: string;
    description: string;
    subtitle: string;
    sections: Section[];
    date: Date;
    thumbnailImage: { imageUrl: string; alt?: string };
    id: string;
    author: string;
  }) {
    super({
      title: options.title,
      description: options.description, // Using subtitle for description in the base class
      date: options.date,
      thumbnailImage: options.thumbnailImage,
      id: options.id,
      author: options.author,
    });
    
    this.subtitle = options.subtitle;
    this.sections = options.sections;
  }

  // Method to summarize the content (example behavior)
  getSummary(): string {
    return `${this.subtitle} - Read more...`;
  }
}

// Section and supporting interfaces (or classes if they also need methods/behavior)
export interface Section {
  title?: string;
  content?: string;
  illustration?: {
    imageUrl: string;
    alt?: string;
  };
  divider?: boolean;
  callToAction?: CallToAction;
}

export interface CallToAction {
  content: string;
  backgroundColor: string;
  buttons: ActionButton[];
}

export interface ActionButton {
  text: string;
  link: string;
  icon?: string;
  color?: string;
}