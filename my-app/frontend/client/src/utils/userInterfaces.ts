export interface userObj {
  status: string;
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface UserState {
  currentUser: userObj | null;
  error: string;
  loading: boolean;
}

export interface UserObjState {
  user: {
    currentUser: userObj | null;
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
