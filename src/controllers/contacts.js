import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { env } from '../utils/env.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getAllContactsController = async (req, res, next) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);
    const userId = req.user._id;

    const contacts = await getAllContacts({
      userId,
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
    });

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
  const userId = req.user._id;
  const contact = await getContactById(userId, contactId);

  if (!contact) {
    return res.status(404).json({
      status: '404',
      message: 'Contact not found',
      data: null,
    });
  }

  res.status(200).json({
    status: '200',
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const newContact = req.body;
  newContact.userId = req.user._id;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const createdContact = await createContact({
    ...newContact,
    photo: photoUrl,
  });

  res.status(201).json({
    status: '201',
    message: 'Successfully created contact!',
    data: createdContact,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const photo = req.file;
  const userId = req.user._id;

  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const patch = req.body;

  const result = await updateContact(contactId, userId, {
    ...patch,
    photo: photoUrl,
  });

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
  const userId = req.user._id;
  const result = await deleteContact(userId, contactId);

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send();
};
