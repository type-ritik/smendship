export interface postObj {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    name: string;
  } | null;
}

// Shape of the data returned by the GET_POSTS query (getPostsByUserId).
export interface postState {
  getPostsByUserId: postObj[] | null;
}
