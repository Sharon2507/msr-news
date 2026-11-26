export type Category =
  | 'Home'
  | 'Latest News'
  | 'Politics'
  | 'Sports'
  | 'Finance'
  | 'Business'
  | 'Education'
  | 'Health'
  | 'Entertainment'
  | 'Cinema'
  | 'Technology'
  | 'Local News'
  | 'District News'
  | 'Headlines';

export type Language = 'en' | 'te' | 'hi';

export type ArticleStatus = 'published' | 'pending' | 'rejected' | 'draft';

export interface Article {
  id: string;
  headline: string;
  summary: string;
  content: string;
  category: Exclude<Category, 'Home' | 'Latest News' | 'Headlines'>;
  reporter: string;
  date: string; // ISO date
  location: string;
  district: string;
  image: string;
  breaking?: boolean;
  featured?: boolean;
  status: ArticleStatus;
}

export const DISTRICTS = [
  'Hyderabad',
  'Warangal',
  'Nizamabad',
  'Karimnagar',
  'Khammam',
  'Ranga Reddy',
  'Medak',
  'Mahabubnagar',
  'Adilabad',
  'Nalgonda',
];

export const LOCATIONS = ['Telangana', 'Andhra Pradesh', 'National', 'South India', 'World'];

export const CATEGORIES: Category[] = [
  'Home',
  'Latest News',
  'Politics',
  'Sports',
  'Finance',
  'Business',
  'Education',
  'Health',
  'Entertainment',
  'Cinema',
  'Technology',
  'Local News',
  'District News',
  'Headlines',
];
