const { prisma } = require("../config/prismaConfig");

async function getAllPostByUserId(userId) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        category: true,
        likeCount: true,
        is_revoked: true,
      },
    });

    if (!posts) {
      throw new Error("No posts found for the given ID");
    }

    return posts;
  } catch (error) {
    console.log(`[Post Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
}

async function getPostByPostId(id) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    return post;
  } catch (error) {
    console.log(`[Post Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
}

async function existedPostByTitleAndUserIdAndIsNotRevoked(title, userId) {
  try {
    const post = await prisma.post.findFirst({
      where: { title, authorId: userId, is_revoked: false },
    });

    return !!post;
  } catch (error) {
    console.log(`[Post Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
}

async function createPost(title, content, category, userId) {
  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        category,
        authorId: userId,
      },
    });

    return post;
  } catch (error) {
    console.log(`[Post Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
}

module.exports = {
  getAllPostByUserId,
  getPostByPostId,
  existedPostByTitleAndUserIdAndIsNotRevoked,
  createPost,
};
