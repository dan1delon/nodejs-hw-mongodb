import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getAllContactsController = async (req, res, next) => {
  try {
    const contacts = await getAllContacts();

    res.status(200).json({
      status: '200',
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    return res.status(404).json({
      status: '404',
      message: 'Contact not found',
      data: null,
    });
  }

  res.status(200).json({
    status: 'success',
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const newContact = req.body;
  const createdContact = await createContact(newContact);

  res.status(201).json({
    status: 'success',
    message: 'Successfully created contact!',
    data: createdContact,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const patch = req.body;
  const result = await updateContact(contactId, patch);

  if (!result || !contactId) {
    return res.status(404).json({
      status: '404',
      message: 'Contact not found',
      data: null,
    });
  }

  res.status(200).json({
    status: '200',
    message: 'Successfully patched a contact!',
    data: result,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await deleteContact(contactId);

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send();
};
