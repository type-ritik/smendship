import { gql, useLazyQuery } from "@apollo/client";

const USER_FIELDS = `
  id
  name
  email
`;

// Backend: Query.loginUpUser -> UserAuthPayload { user, token }
// NOTE: it's a Query on the backend, so use useLazyQuery (not useMutation) on the frontend.
export const LOGIN_NOW = gql`
  mutation LoginUpUser($email: String!, $password: String!) {
    loginUpUser(email: $email, password: $password) {
      user {
        ${USER_FIELDS}
      }
      token
    }
  }
`;

// Backend: Mutation.signUpUser(input: SignupInput) -> UserOTPPayload { status }
export const SIGNUP_NOW = gql`
  mutation SignUpUser($input: SignupInput!) {
    signUpUser(input: $input) {
      status
    }
  }
`;

// Backend: Query.requestForPasswordReset -> UserOTPPayload { status }
export const REQUEST_PASSWORD_RESET = gql`
  query RequestForPasswordReset {
    requestForPasswordReset {
      status
    }
  }
`;

// Backend: Mutation.resetPassword(userId, password) -> UserOTPPayload { status }
export const RESET_USER_PASSWORD = gql`
  mutation ResetPassword($userId: String, $password: String!) {
    resetPassword(userId: $userId, password: $password) {
      status
    }
  }
`;

// Backend: Mutation.codeVerification(email, OTP) -> UserAuthPayload
export const OTP_VERIFICATION = gql`
  mutation CodeVerification($email: String!, $OTP: String!) {
    codeVerification(email: $email, OTP: $OTP) {
      token
      user {
        ${USER_FIELDS}
      }
    }
  }
`;

// Backend: Mutation.githubAuth(gitToken)
export const GITHUB_AUTH_TOKEN_EXCHANGE = gql`
  mutation GithubAuth($gitToken: String!) {
    githubAuth(gitToken: $gitToken) {
      token
      user {
        ${USER_FIELDS}
      }
    }
  }
`;

// Backend: Mutation.googleAuth(googleToken)
export const GOOGLE_AUTH_TOKEN_EXCHANGE = gql`
  mutation GoogleAuth($googleToken: String!) {
    googleAuth(googleToken: $googleToken) {
      token
      user {
        ${USER_FIELDS}
      }
    }
  }
`;

// Backend: Mutation.updateProfile(input: ProfileInput) -> ProfilePayload { name, email }
export const ALTER_PROFILE_DATA = gql`
  mutation UpdateProfile($input: ProfileInput) {
    updateProfile(input: $input) {
      name
      email
    }
  }
`;

// Backend: Query.getAllUserData -> User
export const GET_ALL_USER_DATA = gql`
  query GetAllUserData {
    getAllUserData {
      ${USER_FIELDS}
      createdAt
    }
  }
`;

export const usePasswordResetRequest = () => {
  const [requestPasswordReset, { loading, error }] = useLazyQuery(
    REQUEST_PASSWORD_RESET,
  );
  return { requestPasswordReset, loading, error };
};
