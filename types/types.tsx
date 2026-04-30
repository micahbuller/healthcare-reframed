import { MDXRemoteSerializeResult } from "next-mdx-remote/rsc";

export interface GuestLink {
  label: string;
  url: string;
}

export interface Timestamp {
  time: string;
  label: string;
}

export interface BlogPost {
  slug: string;
  content: string | MDXRemoteSerializeResult;
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  externalLink: string;
  date: Date;
  youtubeLink: string;
  spotifyLink: string;
  appleMusicLink: string;
  // New fields
  tags: string[];
  guestName: string;
  guestTitle: string;
  guestBio: string;
  guestLinks: GuestLink[];
  showNotes: string;
  timestamps: Timestamp[];
  peopleMentioned: GuestLink[];
  booksMentioned: GuestLink[];
}
