import { Admin, Seller } from "./user";

export type CommunityEventType = "talk" | "workshop" | "tutorial" | "fair";

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  type: CommunityEventType;
  date: string;        // display string e.g. "Mar 15, 2026"
  time: string;        // display string e.g. "10:00 – 12:00"
  location: string;    // venue name or "Online"
  isOnline: boolean;
  organizer: string;
  attendees: number;
  capacity: number;
  tags: string[];
  isFree: boolean;
  price?: number;      // CLP, only when isFree is false
}

export interface CommunityCategory {
  id: number;
  category: string;
  href: string;
  subcategories: CommunitySubCategory[];
}

export interface CommunitySubCategory {
  id: number;
  subCategory: string;
  communityCategoryId: number;
  communityCategory: CommunityCategory;
  href: string;
}

export interface CommunityPost {
  id: number;
  title: string;
  content: string;
  authorId: string;
  images: string[];
  likes: number;
  comments: number;
  createdAt: Date;
  updatedAt: Date;
  author?: Admin;
  communityComments?: CommunityComment[];
}

export interface CommunityComment {
  id: number;
  communityPostId: number;
  sellerId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  communityPost?: CommunityPost;
  seller?: Seller;
}
