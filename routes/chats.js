import express from 'express';
import {getChats, createChats, updateChat, deleteChat} from '../controllers/chats.js'
const routerChats = express.Router();
routerChats.get('/', getChats);
routerChats.post('/', createChats);
routerChats.patch('/:id', updateChat);
routerChats.delete('/:id',deleteChat);
export default routerChats;