export type User = {
  full_name: string;
  email: string;
  role: "user" | "admin";
  profileCompleted: boolean;
  credits: number;
  _id: string;
  createdAt: string;
  lastLogin: string;
  phone: string | null;
  address: string | null;
};

export type IFeed = {
  _id: string;
  title: string;
  link: string;
  source: string;
  subreddit?: string;
};

export type IPost = {
  title: string;
  link: string;
  source: string;
  action: "saved" | "reported";
};

export enum NotificationType {
  REGISTER = "register",
  POST_SAVE = "save",
  POST_REPORT = "report",
  POST_SHARE = "share",
  LOGIN = "login",
  PROFILE_COMPLETE = "profile_complete",
  FEED_INTERACTION = "feed_interaction",
  PASSWORD_CHANGED = "password_changed",
  PROFILE_UPDATED = "profile_updated",
  CREDITS_REDEEMED = "credits_redeemed",
  CREDITS_ADDED = "credits_added",
}

export interface INotification {
  type: NotificationType;
  message: string;
  timestamp: string;
  postId?: string | null;
  extraInfo?: string | null;
}

// Define the RecentActivity type
export interface IRecentActivity {
  _id: string;
  userId: string;
  type: NotificationType;
  message: string;
  timestamp: string;
  postId: string | null;
  extraInfo: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

