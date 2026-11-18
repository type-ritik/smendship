import { gql, useMutation, useQuery, useLazyQuery } from "@apollo/client";

// Backend: Mutation.createPost(input: PostInput) -> Post   (authorId comes from the token)
export const CREATE_POST = gql`
  mutation CreatePost($input: PostInput!) {
    createPost(input: $input) {
      id
      title
      content
      createdAt
    }
  }
`;

// Backend: there is NO `getPosts`. Closest is getPostsByUserId(userId) -> [Post]
export const GET_POSTS = gql`
  query GetPostsByUserId($userId: String!) {
    getPostsByUserId(userId: $userId) {
      id
      title
      content
      createdAt
      author {
        id
        name
      }
    }
  }
`;

// Backend: Query.getPostByPostId(postId) -> Post
export const GET_POST_BY_ID = gql`
  query GetPostByPostId($postId: String!) {
    getPostByPostId(postId: $postId) {
      id
      title
      content
      createdAt
      author {
        id
        name
      }
    }
  }
`;

// Backend: Query.searchPost(text) -> Post
export const SEARCH_POST = gql`
  query SearchPost($text: String!) {
    searchPost(text: $text) {
      id
      title
      content
    }
  }
`;

/** Usage: createPost({ variables: { input: { title, content, category } } }) */
export const useCreatePost = () => {
  const [createPost, { loading, data, error }] = useMutation(CREATE_POST);
  return { createPost, loading, data, error };
};

export const useGetPost = (userId: string) => {
  const { loading, data, error } = useQuery(GET_POSTS, {
    variables: { userId },
    skip: !userId,
  });
  return { loading, data, error };
};

export const useGetPostById = () => {
  const [loadPost, { loading, data, error }] = useLazyQuery(GET_POST_BY_ID);
  return { loadPost, loading, data, error };
};

export const useSearchPost = () => {
  const [searchPost, { loading, data, error }] = useLazyQuery(SEARCH_POST);
  return { searchPost, loading, data, error };
};
