import { ContactsCollection } from '../db/models/contacts.js';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  return contacts;
};

export const getContactById = async (id) => {
  const contact = await ContactsCollection.findById(id);
  return contact;
};

export const createContact = async (newContact) => {
  const createdContact = await ContactsCollection.create(newContact);
  return createdContact;
};

export const updateContact = async (contactId, payload, options = {}) => {
  const updatedContact = await ContactsCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    { new: true, includeResultMetadata: true, ...options },
  );

  if (!updatedContact || !updatedContact.value) return null;

  return updatedContact.value;
};

export const deleteContact = async (contactId) => {
  const deletedContact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
  });

  return deletedContact;
};
