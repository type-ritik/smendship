import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import { UserRepository } from "../repositories/UserRepository";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: adapter,
});

const userRepository = new UserRepository(prisma);

describe("User repository integration tests", () => {
  beforeEach(async () => {
    await prisma.message.deleteMany({});
    await prisma.participant.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.friendship.deleteMany({});
    await prisma.friendRequest.deleteMany({});
    await prisma.notification.deleteMany({});
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should successfully persist and return a new user", async () => {
    const testDate = new Date();
    const userData = [
      {
        name: "Dev",
        email: "dev@test.com",
        password: "hashed_abc123",
        codeExpiry: testDate,
        verificationCode: "23982",
      },
      {
        name: "Rohan",
        email: "ikotech@gfx.com",
        password: "hashing@123",
        codeExpiry: testDate,
        verificationCode: "93832",
      },
      {
        name: "Mac",
        email: "mac@gmail.com",
        password: "mac@123",
        codeExpiry: testDate,
        verificationCode: "82332",
      },
      {
        name: "John",
        email: "john@gmail.com",
        password: "john@123",
        codeExpiry: testDate,
        verificationCode: "81282",
      },
    ];

    const promises = userData.map(async (user) => {
      return await userRepository.create(user);
    });

    const createdUsers = await Promise.all(promises);

    expect(createdUsers[0].id).toBeDefined();
    expect(createdUsers[0].email).toBe("dev@test.com");
  });

  it("should fail when creating a user with a duplicate email", async () => {
    const testDate = new Date();
    const userData = {
      name: "Rohan",
      email: "dev@test.com",
      password: "hashed_abc123",
      codeExpiry: testDate,
      verificationCode: "23982",
    };

    await userRepository.create(userData);
    await expect(userRepository.create(userData)).rejects.toThrow();
  });

  it("should update user name and email", async () => {
    // 1. Arrange: Seed a fresh user for this specific test
    const testDate = new Date();
    const existingUser = await userRepository.create({
      name: "Initial Name",
      email: "initial@test.com",
      password: "secure_password",
      codeExpiry: testDate,
      verificationCode: "00000",
    });

    const updatePayload = {
      id: existingUser.id, // Use the fresh database ID
      name: "Network",
      email: "network@gmail.com",
    };

    // 2. Act
    const updatedUser = await userRepository.update(updatePayload);

    // 3. Assert
    expect(updatedUser.email).toBe("network@gmail.com");
    expect(updatedUser.name).toBe("Network");
  });
});
