export interface userObj {
  id: string;
  name: string;
  email: string;
  token: string;
}

export interface UserState {
  currentUser: userObj | null;
  error: string;
  loading: boolean;
}

export interface UserObjState {
  user: {
    currentUser: {
      user: userObj;
    } | null;
  };
}

export interface InvitationRequestInterface {
  id: number;
  user: {
    id: number;
    name: string;
  };
  createdAt: string;
}
