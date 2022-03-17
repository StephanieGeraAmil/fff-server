import express from 'express';
import {getMessages, createMessages, updateMessage, deleteMessage} from '../controllers/messages.js'
const routerMessages = express.Router();
routerMessages.get('/', getMessages);
routerMessages.post('/', createMessages);
routerMessages.patch('/:id', updateMessage);
routerMessages.delete('/:id',deleteMessage);
export default routerMessages;