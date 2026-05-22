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

export interface UserSelector {
  user: UserState;
}
