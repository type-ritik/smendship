// Matches backend UserAuthPayload { user, token }.
// `status` and `message` were removed: the backend never returns them.
export interface userObj {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    createdAt?: string;
  };
}

export interface UserState {
  currentUser: userObj | null;
  error: string;
  loading: boolean;
}

export interface UserObjState {
  user: UserState;
}

export type user_status = "online" | "offline";

// UI shape used by RequestCard / network pages. The invitation hooks map the
// backend's FriendRequestPayload / FriendshipPayload into this.
// `status` is optional: the backend User type has no online/offline field yet.
export interface InvitationRequestInterface {
  id: string;
  sender: {
    id: string;
    name: string;
    status?: user_status;
  } | null;
  receiver: {
    id: string;
    name: string;
    status?: user_status;
  } | null;
  followers: {
    id: string;
    name: string;
    status?: user_status;
  } | null;
  followings: {
    id: string;
    name: string;
    status?: user_status;
  } | null;
  createdAt: string;
}
