export class BlogArticleBase {
    title: string;
    description: string;
    date: Date;
    thumbnailImage: {
        imageUrl: string;
        alt?: string;
    };
    id: string;
    author: string;

    constructor(
        options: {
            title: string;
            description: string;
            date: Date;
            thumbnailImage: { imageUrl: string; alt?: string };
            id: string;
            author: string;
        }
    ) {
        this.title = options.title;
        this.description = options.description;
        this.date = options.date;
        this.thumbnailImage = options.thumbnailImage;
        this.id = options.id;
        this.author = options.author;
    }

    getFormattedDate(): string {
        return this.date.toLocaleDateString();
    }
}