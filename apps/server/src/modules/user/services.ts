import type { LanguageModelUsage } from 'ai';
import { dbInstance } from '../../db/connection.js';
import { aiUsageTable } from '../../db/schemas/index.js';
import { CustomError } from '../../http/error/customError.js';

export function userColumns() {
  return {
    name: true,
    id: true,
    email: true,
    created_at: true,
    updated_at: true,
  } as const;
}

export async function getUserById(userId: number) {
  const user = await dbInstance.query.usersTable.findFirst({
    where: {
      id: userId,
    },
    columns: userColumns(),
    with: {
      votes: true,
    },
  });

  if (!user) throw new CustomError('User not found', 404);

  return user;
}

export async function getOrCreateAIUsage(userId: number, usage: LanguageModelUsage) {
  await dbInstance
    .insert(aiUsageTable)
    .values({
      usageJSON: usage,
      user_id: userId,
    })
    .onConflictDoUpdate({
      target: aiUsageTable.user_id,
      set: {
        usageJSON: usage,
      },
    });
}
