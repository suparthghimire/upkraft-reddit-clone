import { saveEmbedding } from '../../modules/qdrant/services.js';
import { dbInstance } from '../connection.js';
import { postsTable, usersTable } from '../schemas/index.js';
import { postsSeedData, userSeedData } from './seed_data.js';
import { fileURLToPath } from 'node:url';

async function seedUser(): Promise<number> {
  const [createdUser] = await dbInstance
    .insert(usersTable)
    .values({
      email: userSeedData.email,
      password: userSeedData.password,
      name: userSeedData.name,
    })
    .returning({ id: usersTable.id });

  if (!createdUser) {
    throw new Error('User insert did not return a created user.');
  }

  return createdUser.id;
}

async function seedPosts(userId: number) {
  return dbInstance
    .insert(postsTable)
    .values(
      postsSeedData.map((post) => ({
        title: post.title,
        content: post.content,
        user_id: userId,
        slug: crypto.randomUUID(),
      })),
    )
    .returning({ id: postsTable.id, title: postsTable.title, content: postsTable.content });
}

async function seedEmbeddings(posts: { postId: number; title: string; description: string }[]) {
  for (const post of posts) {
    await saveEmbedding(post);
  }

  return posts.length;
}

async function seedData() {
  const seededUserId = await seedUser();
  const seededPosts = await seedPosts(seededUserId);
  const seededEmbeddings = await seedEmbeddings(
    seededPosts.map((post) => ({
      postId: post.id,
      title: post.title,
      description: post.content,
    })),
  );

  return {
    userSeeded: 1,
    postsSeeded: seededPosts.length,
    embeddingsSeeded: seededEmbeddings,
  };
}

// Dnt run if this is imported
const isMain = process.argv[1] === fileURLToPath(import.meta.url);

if (!isMain) {
  process.exit(0);
}
seedData()
  .then((data) => {
    console.log(`Seed data inserted successfully. ${JSON.stringify(data)}`);
  })
  .catch((error) => {
    console.error('Error inserting seed data:', error);
  })
  .finally(() => {
    process.exit(0);
  });
