import { env } from '$env/dynamic/private';
import prisma from '$lib/prisma'
import { redirect, fail } from '@sveltejs/kit';

export async function load({ cookies, locals }) {
    const user = locals.user;
    
    if (!user) {
        return { orgs: [] };
    }
    
    // Fetch organizations associated with this user
    const userOrgs = await prisma.userOrganization.findMany({
        where: {
            userId: user.id
        },
        include: {
            organization: true
        }
    });
    
    // Extract the organization data
    const orgs = userOrgs.map(userOrg => ({
        id: userOrg.organization.id,
        name: userOrg.organization.name,
        logo: userOrg.organization.logo,
        role: userOrg.role
    }));
    
    return { orgs };
}

export const actions = {
    select: async ({ request, cookies, locals }) => {
        const user = locals.user;
        if (!user) {
            throw redirect(303, '/login');
        }

        const formData = await request.formData();
        const orgId = formData.get('orgId')?.toString();
        const orgName = formData.get('orgName')?.toString();

        if (!orgId) {
            return fail(400, { error: 'Organization ID is required' });
        }

        // Verify user belongs to this org
        const userOrg = await prisma.userOrganization.findFirst({
            where: {
                userId: user.id,
                organizationId: orgId
            }
        });

        if (!userOrg) {
            return fail(403, { error: 'Access denied' });
        }

        // Set cookies securely on the server
        cookies.set('org', orgId, {
            path: '/',
            httpOnly: false, // Set to false so client can still read it if needed, but server-side is primary
            secure: false,   // Support LAN deployment
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30 // 30 days
        });

        if (orgName) {
            cookies.set('org_name', orgName, {
                path: '/',
                httpOnly: false,
                secure: false,
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 30
            });
        }

        throw redirect(303, '/app');
    }
};
