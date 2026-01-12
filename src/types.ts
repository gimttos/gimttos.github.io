export interface ScriptItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string; // Short summary used for meta description or header
  author?: string; // Author name (e.g. 'O' or 'R')
  content?: {
    introduction: string;
    usage?: {
      description: string;
      images?: string[];
    };
    guideSteps?: { title: string; text: string; link?: string }[];
  };
  code: string; // The actual script content (primary)
  additionalCodeBlocks?: { title: string; code: string }[]; // Optional: For posts needing multiple scripts (e.g. API + UserScript)
  version?: string;
  updatedAt?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  type: 'guide' | 'script';
}