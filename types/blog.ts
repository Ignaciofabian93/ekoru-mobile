import { BlogCategory } from "./enums";
import { Admin } from "./user";

export type BlogPost = {
  id: number;
  title: string;
  content: string;
  authorId: string;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  category: BlogCategory;
  author: Admin;
  likes: number;
  dislikes: number;
};

export type BlogCategories = {
  id: number;
  name: string;
  icon: string;
  description: string;
  href: string;
};
