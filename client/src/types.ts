export type User = {
  full_name: string;
  email: string;
  role: "user" | "admin";
  profileCompleted: boolean;
  credits: number;
  _id: number;
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
