
export enum UserRole {
  USER = 'user',
  OWNER = 'owner',
  COOWNER = 'coowner'
}

export enum PlanType {
  FREE = 'Free',
  PRO = 'Pro'
}

export enum BadgeType {
  OWNER = 'Green Tick',
  PAID_PRO = 'Gold Tick',
  GRANTED_PRO = 'White Tick',
  FREE_VERIFIED = 'Blue Tick'
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  plan: PlanType;
  badge: BadgeType;
  createdAt: string;
}

export interface GroundingLink {
  uri: string;
  title: string;
}

export interface MessagePart {
  text?: string;
  inlineData?: { data: string; mimeType: string };
  groundingLinks?: GroundingLink[];
  thinking?: string;
}

export interface Message {
  role: 'user' | 'model';
  parts: MessagePart[];
  timestamp: Date;
}

export interface AIResponse {
  modelName: string;
  content: string;
  loading: boolean;
  error?: string;
}

export interface HistoryItem {
  id: string;
  prompt: string;
  responses: { modelName: string; content: string }[];
  timestamp: string;
  isImage?: boolean;
  imageUrl?: string | null;
}
