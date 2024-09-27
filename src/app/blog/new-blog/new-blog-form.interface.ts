import { CallToAction } from "../blog-details/blog-article.interface";

export interface NewBlogForm {
    id: string,
    title: string;
    subtitle: string;
    description: string;
    url: string;
    tags: string[];
    sections: FormSectionNewArticle[];
    thumbnailImage: {
        imageUrl: string;
        file: File;
        alt: string;
    };
}

export interface FormSectionNewArticle {
    title?: string;
    content: string; // Minimum required to have a section.
    divider?: boolean;
    illustration?: {
        imageUrl: string;
        file: File;
        alt: string
    };
    callToAction?: CallToAction;
}