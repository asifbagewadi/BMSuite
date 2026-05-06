import prisma from '$lib/prisma';
import { redirect } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { env } from '$env/dynamic/private';

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

  return {
    googleClientId: env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || ''
  };
}

export const actions = {
  emailLogin: async ({ request, cookies }) => {
    const formData = await request.formData();

    const email = String(formData.get('email'));
    const password = String(formData.get('password'));

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
        session_id,
        lastLogin: new Date()
      }
    });

    cookies.set('session', session_id, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // In production, this can be automatically detected or enforced
      maxAge: 60 * 60 * 24 * 7
    });

    throw redirect(303, '/app');
  },

  googleLogin: async ({ request, cookies }) => {
    const formData = await request.formData();
    const token = formData.get('credential');
    
    if (!token) return { error: 'No Google token provided' };

    try {
      const clientId = env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
      if (!clientId) {
        return { error: 'Server configured incorrectly (Missing Client ID)' };
      }
      
      const client = new OAuth2Client(clientId);
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: clientId
      });
      const payload = ticket.getPayload();
      
      if (!payload || !payload.email) {
        return { error: 'Invalid Google token' };
      }

      let user = await prisma.user.upsert({
        where: { email: payload.email },
        update: { 
          profilePhoto: payload.picture,
          lastLogin: new Date(),
          ...(payload.name && { name: payload.name })
        },
        create: {
          email: payload.email,
          name: payload.name || `${payload.given_name || ''} ${payload.family_name || ''}`.trim(),
          profilePhoto: payload.picture,
          user_id: payload.sub,
          lastLogin: new Date()
        }
      });

      const session_id = uuidv4();
      await prisma.user.update({
        where: { id: user.id },
        data: { session_id }
      });

      cookies.set('session', session_id, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 60 * 60 * 24 * 7
      });

      throw redirect(303, '/app');
    } catch (error) {
      if (error instanceof Response) throw error; 
      console.error('Google login error:', error);
      return { error: 'Authentication failed' };
    }
  }
};
