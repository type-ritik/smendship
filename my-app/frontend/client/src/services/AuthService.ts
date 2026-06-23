import { gql } from "@apollo/client";

export const LOGIN_NOW = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        name
        email
      }
      token
    }
  }
`;

export const SIGNUP_NOW = gql`
  mutation Signup($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      status
      message
    }
  }
`;

export const OTP_VERIFICATION = gql`
  mutation VerifyAccount($email: String!, $OTP: String!) {
    verifyAccount(email: $email, OTP: $OTP) {
      status
      message
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export const ALTER_PROFILE_DATA = gql`
  mutation Updateprofile($input: UpdateUserInput) {
    updateprofile(input: $input) {
      message
      status
      user {
        id
        name
        email
      }
      lastUpdated
    }
  }
`;
