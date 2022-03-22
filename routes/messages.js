import express from 'express';
import {getMessages, createMessages, updateMessage, deleteMessage, getMessagesFromChat} from '../controllers/messages.js'
const routerMessages = express.Router();
routerMessages.get('/', getMessages);
routerMessages.get('/:id', getMessagesFromChat);
routerMessages.post('/', createMessages);
routerMessages.patch('/:id', updateMessage);
routerMessages.delete('/:id',deleteMessage);
export default routerMessages;