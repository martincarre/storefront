export interface BlogArticle {
    title: string;
    description: string;
    subtitle: string;
    sections: Section[];
    date: Date;
    thumbnailImage: { imageUrl: string; alt?: string };
    id: string;
    author: string;
    published: boolean;
}


// Section and supporting interfaces (or classes if they also need methods/behavior)
export interface Section {
  title?: string | null;
  content?: string | null;
  illustration?: {
    imageUrl: string;
    alt?: string;
  } | null;
  divider?: boolean | null;
  callToAction?: CallToAction | null;
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