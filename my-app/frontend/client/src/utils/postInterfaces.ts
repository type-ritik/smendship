import type { userObj } from "./userInterfaces";

export interface postObj {
  id: string;
  content: string;
  title: string;
  author: userObj;
}

export interface postState {
  getPosts: postObj[] | null;
}
