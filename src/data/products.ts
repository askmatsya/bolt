import { Product } from '../types';

// Fallback products array for when database is unavailable
export const products: Product[] = [];

export const categories = [
  'All',
  'Sarees',
  'Jewelry', 
  'Textiles',
  'Art',
  'Spices',
  'Accessories',
  'Home Decor'
];

export const occasions = [
  'Wedding',
  'Festival',
  'Casual',
  'Formal',
  'Gift',
  'Home Decor'
];

export const priceRanges = [
  { label: 'Under $20', value: [0, 20] },
  { label: '$20 - $100', value: [20, 100] },
  { label: '$100 - $200', value: [100, 200] },
  { label: '$200 - $400', value: [200, 400] },
  { label: 'Above $400', value: [400, 2000] }
];