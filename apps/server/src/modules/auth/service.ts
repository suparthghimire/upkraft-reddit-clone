import type { LoginInput, SignupInput } from '@reddit-clone/shared';
import { dbInstance } from '../../db/connection.js';
import { usersTable } from '../../db/schemas/index.js';
import { eq } from 'drizzle-orm';
import { CustomError } from '../../http/error/customError.js';
import bcrypt from 'bcrypt';
import { createJWTToken } from '../token/service.js';
import { E_NODE_ENV_ENUM, env } from '../../lib/env.schema.js';
import type { Response } from 'express';
import {
  AUTH_ACCESS_TOKEN_COOKIE_NAME,
  AUTH_ACCESS_TOKEN_EXPIRES_DAYS,
} from '../../lib/constants/auth.constants.js';

export async function login(res: Response, body: LoginInput) {
  const { email, password } = body;

  const users = await dbInstance
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  const user = users.at(0);

  if (!user) throw new CustomError('Invalid email or password', 401);

  const comparePasswordMatch = await bcrypt.compare(password, user.password);

  if (!comparePasswordMatch) throw new CustomError('Invalid email or password', 401);

  const accessToken = createJWTToken({
    payload: { userId: user.id },
    secret: env.ACCESS_TOKEN_SECRET,
    opts: {
      expiresIn: `${AUTH_ACCESS_TOKEN_EXPIRES_DAYS}d`, //
    },
  });

  res.cookie(AUTH_ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    maxAge: AUTH_ACCESS_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000, // Expiration time in milliseconds (e.g., 900,000 ms = 15 minutes)
    httpOnly: true, // Prevents client-side scripts from reading the cookie (protects against XSS)
    secure: env.NODE_ENV !== E_NODE_ENV_ENUM.local, // Ensures the cookie is only sent over encrypted HTTPS connections
    sameSite: env.NODE_ENV === E_NODE_ENV_ENUM.local ? 'lax' : 'strict', // Controls cross-site behavior to mitigate CSRF attacks
  });
}

export async function signup(body: SignupInput) {
  const { confirmPassword, ...userData } = body;

  // Find user with same email
  const userWithEmainExists = await dbInstance
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, body.email));

  if (userWithEmainExists.length > 0)
    throw new CustomError('User with this email already exists', 409);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(body.password, salt);

  return dbInstance.insert(usersTable).values({ ...userData, password: hashedPassword });
}
