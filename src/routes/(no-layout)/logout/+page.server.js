import { error, redirect } from '@sveltejs/kit';
// export const ssr = true

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, cookies }) {
  const cookieOptions = { path: '/', secure: false };
  
  if (await cookies.get('session')) {
    await cookies.delete('session', cookieOptions);
  }
  
  if (locals.user) {
    delete locals.user;
    await cookies.delete('session', cookieOptions);
    await cookies.delete('org', cookieOptions);
  }
  
  throw redirect(303, '/login');
}
