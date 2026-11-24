export type Category = 'Mother Care' | 'Baby Care' | 'Baby Skincare' | 'Mother Skincare' | 'Nutrition' | 'Feeding Essentials' | 'Hygiene' | 'Gift Collections';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  mrp?: number;
  rating: number;
  reviews: number;
  image: any;
  badge?: string;
  description: string;
  ingredients: string;
  size: string;
}

const mother = require('../assets/images/04.jpg');
const baby = require('../assets/images/05.jpg');
const family = require('../assets/images/01.jpg');
const food = require('../assets/images/nutrition_hero.png');
const care = require('../assets/images/care_ritual_4.jpg');

export const categories: { name: Category; icon: string; image: any }[] = [
  { name: 'Mother Care', icon: '✿', image: mother }, { name: 'Baby Care', icon: '◌', image: baby },
  { name: 'Baby Skincare', icon: '♧', image: care }, { name: 'Mother Skincare', icon: '✦', image: mother },
  { name: 'Nutrition', icon: '◒', image: food }, { name: 'Feeding Essentials', icon: '◔', image: baby },
  { name: 'Hygiene', icon: '◈', image: care }, { name: 'Gift Collections', icon: '♡', image: family },
];

export const products: Product[] = [
  { id: 'calm-oil', name: 'Nourishing Baby Massage Oil', brand: 'Appuge Rituals', category: 'Baby Skincare', price: 649, mrp: 799, rating: 4.8, reviews: 126, image: care, badge: 'Bestseller', size: '100 ml', description: 'A light, comforting daily massage oil for delicate newborn skin.', ingredients: 'Cold-pressed coconut, almond and sesame oils.' },
  { id: 'recovery-tea', name: 'Postpartum Recovery Tea', brand: 'Appuge Kitchen', category: 'Nutrition', price: 529, rating: 4.9, reviews: 89, image: food, badge: 'New', size: '20 sachets', description: 'A warming daily blend created for the gentle postpartum season.', ingredients: 'Ajwain, ginger, fennel and moringa.' },
  { id: 'wash', name: 'Tear-Free Baby Wash', brand: 'Little Rituals', category: 'Baby Care', price: 399, mrp: 475, rating: 4.7, reviews: 214, image: baby, size: '200 ml', description: 'A pH-balanced wash made for tiny hands, hair and skin.', ingredients: 'Oat extract, calendula and plant glycerin.' },
  { id: 'nursing', name: 'Soft Nursing Essentials Set', brand: 'Appuge Edit', category: 'Feeding Essentials', price: 1299, mrp: 1499, rating: 4.6, reviews: 64, image: family, badge: 'Popular', size: 'Set of 3', description: 'Thoughtful feeding essentials for comfortable everyday nursing.', ingredients: 'Organic cotton and food-safe silicone.' },
  { id: 'body-butter', name: 'Restoring Body Butter', brand: 'Appuge Rituals', category: 'Mother Skincare', price: 749, rating: 4.8, reviews: 72, image: mother, size: '150 g', description: 'A rich botanical butter for dry, changing skin.', ingredients: 'Shea butter, kokum butter and rosehip oil.' },
  { id: 'newborn-kit', name: 'Newborn First Days Kit', brand: 'Appuge Edit', category: 'Gift Collections', price: 1899, mrp: 2199, rating: 4.9, reviews: 51, image: baby, badge: 'Gift-ready', size: '6 essentials', description: 'A considered welcome gift for a new little beginning.', ingredients: 'Curated newborn bath and comfort essentials.' },
];
