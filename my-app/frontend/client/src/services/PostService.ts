import { gql, useMutation, useQuery } from "@apollo/client";

const CREATE_POST = gql`
  mutation Createpost($title: String!, $content: String!, $category: String!) {
    createpost(title: $title, content: $content, category: $category) {
      post {
        id
      }
      message
    }
  }
`;

export const useCreatePost = () => {
  const [createpost, { loading, data, error }] = useMutation(CREATE_POST);
  return { createpost, loading, data, error };
};


const GET_POSTS = gql`
  query GetPosts {
    getPosts {
      id
      title
      content
      author {
        id
        name
      }
    }
  }
`;

export const useGetPost = () => {
  const {loading, data, error} = useQuery(GET_POSTS);
  return {loading, data, error};
}

