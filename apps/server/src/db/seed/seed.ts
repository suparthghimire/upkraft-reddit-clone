import { signup } from '../../modules/auth/service.js';
import { createPost } from '../../modules/post/service.js';
import { postsSeedData, userSeedData } from './seed-data.js';

async function seedPosts(userId: number) {
  return await Promise.all(
    postsSeedData.map((post) =>
      createPost({
        userId,
        post: {
          content: post.content,
          title: post.title,
        },
      }),
    ),
  );
}

async function seedUser() {
  const [row] = await signup({
    name: userSeedData.name,
    email: userSeedData.email,
    confirmPassword: userSeedData.password,
    password: userSeedData.password,
  });

  if (!row) throw new Error('User seed failed');

  return row.id;
}

async function main() {
  const userId = await seedUser();
  await seedPosts(userId);
}

main()
  .then(() => {
    console.log('Seeding completed successfully.');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
