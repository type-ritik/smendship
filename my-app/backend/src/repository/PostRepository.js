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

module.exports = { getAllPostByUserId };
