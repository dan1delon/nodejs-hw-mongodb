import { getAllContacts, getContactById } from '../services/contacts';

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

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    next(new Error('Student not found'));
    return;
  }

  res.status(200).json({
    status: 'success',
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};
