import prisma from '$lib/prisma';
import { redirect } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

/** @type {import('@sveltejs/kit').ServerLoad} */
export async function load({ cookies }) {
  const sessionId = cookies.get('session');

  if (sessionId) {
    const user = await prisma.user.findUnique({
      where: { session_id: sessionId }
    });

    if (user) {
      throw redirect(303, '/app');
    }
  }

  return {};
}

export const actions = {
  emailLogin: async ({ request, cookies }) => {
    const formData = await request.formData();

    const email = formData.get('email');
    const password = formData.get('password');

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.password) {
      return { error: 'Invalid credentials' };
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return { error: 'Invalid credentials' };
    }

    const session_id = uuidv4();

    await prisma.user.update({
      where: { email },
      data: {
        session_id: session_id,
        lastLogin: new Date()
      }
    });

    cookies.set('session', session_id, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 60 * 60 * 24 * 7
    });

    throw redirect(303, '/app');
  }
};