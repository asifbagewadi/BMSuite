import prisma from '$lib/prisma'
import { fail, redirect } from '@sveltejs/kit';
import { UserRole } from '@prisma/client';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals }) {
    const org_id = locals.org.id; // Changed from params.org_id
    const user = locals.user;

    // Check if user is admin of the organization
    const userOrg = await prisma.userOrganization.findFirst({
        where: {
            userId: user.id,
            organizationId: org_id,
            role: 'ADMIN'
        }
    });
    console.log('User Organization:', userOrg);
    if (!userOrg) {
        return {
            error: {
                name: 'You do not have permission to access this organization'
            }
        };
    }
    // Fetch organization details
    const organization = await prisma.organization.findUnique({
        where: {
            id: org_id // Changed from params.org_id
        }
    });

    // fetch all users in the organization
    const users = await prisma.userOrganization.findMany({
        where: {
            organizationId: org_id
        },
        include: {
            user: true
        }
    });
    // Pass logged-in user id to page for UI logic
    return { organization, users, user: { id: user.id } };
};

/** @type {import('./$types').Actions} */
export const actions = {
    update: async ({ request, params, locals }) => {
        const org_id = locals.org.id; // Changed from params.org_id
        const user = locals.user;

        // Only ADMIN can update
        const userOrg = await prisma.userOrganization.findFirst({
            where: {
                userId: user.id,
                organizationId: org_id,
                role: 'ADMIN'
            }
        });
        if (!userOrg) return fail(403, { error: 'Forbidden' });

        const formData = await request.formData();
        const name = formData.get('name')?.toString().trim();
        const domain = formData.get('domain')?.toString().trim();
        const description = formData.get('description')?.toString().trim();

        if (!name) return fail(400, { error: 'Name is required' });

        try {
            await prisma.organization.update({
                where: { id: org_id },
                data: {
                    name,
                    domain,
                    description
                }
            });
            // Update locals for the current request so layout reloads with new name
            if (name) {
                if (locals.org) {
                    locals.org.name = name;
                }
                locals.org_name = name;
            }
            return { success: true, message: 'Organization details updated successfully' };
        } catch (err) {
            return fail(500, { error: 'Failed to update organization' });
        }
    },

    add_user: async ({ request, params, locals }) => {
        const org_id = locals.org.id; // Changed from params.org_id
        const user = locals.user;

        // Only ADMIN can add
        const userOrg = await prisma.userOrganization.findFirst({
            where: {
                userId: user.id,
                organizationId: org_id,
                role: 'ADMIN'
            }
        });
        if (!userOrg) return fail(403, { error: 'Forbidden' });

        const formData = await request.formData();
        const email = formData.get('email')?.toString().trim().toLowerCase();
        const roleString = formData.get('role')?.toString();
        const role = /** @type {UserRole} */ (roleString);
        if (!email || !role) return fail(400, { error: 'Email and role are required' });

        // Find user by email or create them if they do not exist
        let foundUser = await prisma.user.findUnique({ where: { email } });
        if (!foundUser) {
            // Set a default temporary password for new users
            const bcrypt = await import('bcrypt');
            const defaultPassword = 'Welcome@123';
            const hashedPassword = await bcrypt.hash(defaultPassword, 10);
            
            foundUser = await prisma.user.create({
                data: {
                    email,
                    user_id: crypto.randomUUID(),
                    name: email.split('@')[0], // Generic fallback name
                    password: hashedPassword
                }
            });
        }

        // Check if already in org
        const already = await prisma.userOrganization.findFirst({
            where: { userId: foundUser.id, organizationId: org_id }
        });
        if (already) return fail(400, { error: 'User already present' });

        // Add user to org
        await prisma.userOrganization.create({
            data: {
                userId: foundUser.id,
                organizationId: org_id,
                role
            }
        });
        return { success: true, message: 'User successfully added to the organization' };
    },

    edit_role: async ({ request, params, locals }) => {
        const org_id = locals.org.id; // Changed from params.org_id
        const user = locals.user;

        // Only ADMIN can edit
        const userOrg = await prisma.userOrganization.findFirst({
            where: {
                userId: user.id,
                organizationId: org_id,
                role: 'ADMIN'
            }
        });
        if (!userOrg) return fail(403, { error: 'Forbidden' });

        const formData = await request.formData();
        const user_id = formData.get('user_id')?.toString();
        const roleString = formData.get('role')?.toString();
        const role = /** @type {UserRole} */ (roleString);
        if (!user_id || !role) return fail(400, { error: 'User and role are required' });

        // Don't allow editing own role (prevent lockout)
        if (user_id === user.id) return fail(400, { error: 'You cannot change your own role' });

        // Don't allow editing role of the only remaining admin
        if (role !== 'ADMIN') {
            // Count number of admins in org
            const adminCount = await prisma.userOrganization.count({
                where: {
                    organizationId: org_id,
                    role: 'ADMIN'
                }
            });
            // If target user is admin and only one admin left, prevent demotion
            const target = await prisma.userOrganization.findUnique({
                where: { userId_organizationId: { userId: user_id, organizationId: org_id } }
            });
            if (target && target.role === 'ADMIN' && adminCount === 1) {
                return fail(400, { error: 'Organization must have at least one admin' });
            }
        }

        await prisma.userOrganization.update({
            where: { userId_organizationId: { userId: user_id, organizationId: org_id } },
            data: { role }
        });
        return { success: true, message: 'User role updated successfully' };
    },

    remove_user: async ({ request, params, locals }) => {
        const org_id = locals.org.id; // Changed from params.org_id
        const user = locals.user;

        // Only ADMIN can remove
        const userOrg = await prisma.userOrganization.findFirst({
            where: {
                userId: user.id,
                organizationId: org_id,
                role: 'ADMIN'
            }
        });
        if (!userOrg) return fail(403, { error: 'Forbidden' });

        const formData = await request.formData();
        const user_id = formData.get('user_id')?.toString();
        if (!user_id) return fail(400, { error: 'User is required' });

        // Don't allow removing self (prevent lockout)
        if (user_id === user.id) return fail(400, { error: 'You cannot remove yourself' });

        // Don't allow removing the only remaining admin
        const target = await prisma.userOrganization.findUnique({
            where: { userId_organizationId: { userId: user_id, organizationId: org_id } }
        });
        if (target && target.role === 'ADMIN') {
            const adminCount = await prisma.userOrganization.count({
                where: {
                    organizationId: org_id,
                    role: 'ADMIN'
                }
            });
            if (adminCount === 1) {
                return fail(400, { error: 'Organization must have at least one admin' });
            }
        }

        await prisma.userOrganization.delete({
            where: { userId_organizationId: { userId: user_id, organizationId: org_id } }
        });
        return { success: true, message: 'User removed from organization successfully' };
    },
    reset_password: async ({ request, locals }) => {
        const org_id = locals.org.id;
        const user = locals.user;

        // Only ADMIN can reset passwords
        const userOrg = await prisma.userOrganization.findFirst({
            where: {
                userId: user.id,
                organizationId: org_id,
                role: 'ADMIN'
            }
        });
        if (!userOrg) return fail(403, { error: 'Forbidden' });

        const formData = await request.formData();
        const user_id = formData.get('user_id')?.toString();
        const password = formData.get('password')?.toString();

        if (!user_id || !password) return fail(400, { error: 'User and password are required' });
        
        // Prevent self-reset via this administrative action
        if (user_id === user.id) return fail(400, { error: 'Please use your Profile page to change your own password' });

        if (password.length < 6) return fail(400, { error: 'Password must be at least 6 characters' });

        try {
            const bcrypt = await import('bcrypt');
            const hashedPassword = await bcrypt.hash(password, 10);

            await prisma.user.update({
                where: { id: user_id },
                data: { password: hashedPassword }
            });

            return { success: true, message: 'Password reset successfully' };
        } catch (err) {
            console.error('Reset password error:', err);
            return fail(500, { error: 'Failed to reset password' });
        }
    }
};
