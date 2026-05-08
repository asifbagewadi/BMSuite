import prisma from '$lib/prisma';
import { fail, redirect } from '@sveltejs/kit';
import { validatePhoneNumber, formatPhoneForStorage } from '$lib/utils/phone.js';

export async function load({ params, locals }) {
  const org = locals.org;
  const user = locals.user;

  const contact = await prisma.contact.findUnique({
    where: { id: params.contactId, organizationId: org.id }
  });
  if (!contact) {
    return fail(404, { message: 'Contact not found' });
  }
  // Get related account info
  const accountRel = await prisma.accountContactRelationship.findFirst({
    where: { contactId: params.contactId },
    include: { account: true }
  });

  // Load all accounts in the org for the dropdown
  const accounts = await prisma.account.findMany({
    where: { organizationId: org.id, isDeleted: false },
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  });

  return {
    contact,
    account: accountRel?.account || null,
    accountRelId: accountRel?.id || null,
    isPrimary: accountRel?.isPrimary || false,
    role: accountRel?.role || '',
    accounts
  };
}

export const actions = {
  default: async ({ request, params, locals }) => {
    const org = locals.org;
    const user = locals.user;

    const formData = await request.formData();
    const firstName = formData.get('firstName')?.toString().trim();
    const lastName = formData.get('lastName')?.toString().trim();
    const email = formData.get('email')?.toString().trim() || null;
    const phone = formData.get('phone')?.toString().trim() || null;
    const title = formData.get('title')?.toString().trim() || null;
    const department = formData.get('department')?.toString().trim() || null;
    const street = formData.get('street')?.toString().trim() || null;
    const city = formData.get('city')?.toString().trim() || null;
    const state = formData.get('state')?.toString().trim() || null;
    const postalCode = formData.get('postalCode')?.toString().trim() || null;
    const country = formData.get('country')?.toString().trim() || null;
    const description = formData.get('description')?.toString().trim() || null;
    const newAccountId = formData.get('accountId')?.toString() || null;

    if (!firstName || !lastName) {
      return fail(400, { message: 'First and last name are required.' });
    }

    if (!newAccountId) {
      return fail(400, { message: 'Account is required.' });
    }

    // Validate phone number if provided
    let formattedPhone = null;
    if (phone && phone.length > 0) {
      const phoneValidation = validatePhoneNumber(phone);
      if (!phoneValidation.isValid) {
        return fail(400, { message: phoneValidation.error || 'Please enter a valid phone number' });
      }
      formattedPhone = formatPhoneForStorage(phone);
    }

    const contact = await prisma.contact.findUnique({
      where: { id: params.contactId, organizationId: org.id }
    });
    if (!contact) {
      return fail(404, { message: 'Contact not found' });
    }

    // Update contact fields
    await prisma.contact.update({
      where: { id: params.contactId },
      data: { 
        firstName, 
        lastName, 
        email, 
        phone: formattedPhone, 
        title, 
        department,
        street,
        city,
        state,
        postalCode,
        country,
        description 
      }
    });

    // Handle account relationship change
    const existingRel = await prisma.accountContactRelationship.findFirst({
      where: { contactId: params.contactId }
    });

    if (newAccountId) {
      // Validate the account belongs to the org
      const accountExists = await prisma.account.findFirst({
        where: { id: newAccountId, organizationId: org.id, isDeleted: false }
      });
      if (!accountExists) {
        return fail(400, { message: 'Selected account not found.' });
      }

      if (existingRel) {
        if (existingRel.accountId !== newAccountId) {
          // Account changed — update the relationship
          await prisma.accountContactRelationship.update({
            where: { id: existingRel.id },
            data: { accountId: newAccountId }
          });
        }
        // Same account — no change needed
      } else {
        // No existing relationship — create one
        await prisma.accountContactRelationship.create({
          data: {
            accountId: newAccountId,
            contactId: params.contactId,
            isPrimary: false,
            role: null
          }
        });
      }
    } else if (existingRel) {
      // Account cleared — remove the relationship
      await prisma.accountContactRelationship.delete({
        where: { id: existingRel.id }
      });
    }

    return { success: true };
  }
};
