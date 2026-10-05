import { NextRequest, NextResponse } from 'next/server';
import { checkLogin } from './lib/api/auth.api';
import { cookies } from 'next/headers';
import { APP_ROUTES } from './lib/app-routes';

const protectedOnlyRoutePrefixes = ['/urd'];
const publicOnlyRoutePrefixes = ['/auth'];
const commonRoutePrefixes = ['/post'];

function checkRoutePrefix(args: { path: string; prefixes: string[] }) {
  return args.prefixes.some((prefix) => args.path.startsWith(prefix));
}

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const currentPathName = request.nextUrl.pathname;

  // If user is trying to access common routes, allow them
  // SInce all routes start with /, this will match all routes and allow them through
  if (currentPathName === '/') return NextResponse.next();

  if (checkRoutePrefix({ path: currentPathName, prefixes: commonRoutePrefixes }))
    return NextResponse.next();

  const isProtectedOnlyRoute = checkRoutePrefix({
    path: currentPathName,
    prefixes: protectedOnlyRoutePrefixes,
  });
  const isPublicOnlyRoute = checkRoutePrefix({
    path: currentPathName,
    prefixes: publicOnlyRoutePrefixes,
  });

  try {
    const cookieStore = await cookies();

    const cookieHeader = cookieStore.get('upkraft_reddit_access_token');

    if (!cookieHeader) throw new Error('Unauthorized');

    await checkLogin({ accessToken: cookieHeader.value });

    if (isPublicOnlyRoute) return NextResponse.redirect(new URL(APP_ROUTES.DASHBOARD, request.url));

    // if we are on public only route path, we might want to redirect logged-in users away from it
    if (isProtectedOnlyRoute) return NextResponse.next();

    throw new Error('Cannot access');
  } catch (err) {
    console.log('FAILED VERIFY LOGIN', err);
    if (isPublicOnlyRoute) return NextResponse.next();

    return NextResponse.redirect(new URL(APP_ROUTES.AUTH.LOGIN, request.url));
  }
}

export const config = {
  matcher: [
    // Exclude API routes, static files, image optimizations, and .png files
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
};
