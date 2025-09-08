export interface CreatorProfile {
  id: string;
  name: string;
  handle: string;
  avatar?: string;
  coverImage?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  verified: boolean;
  category?: string;
  bio?: string;
  location?: string;
  joinDate?: string; // human readable for now
}
