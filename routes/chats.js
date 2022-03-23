import express from 'express';
import {getChats, createChats, updateChat,getChatsFromUser, deleteChat,deleteAllChats} from '../controllers/chats.js'
const routerChats = express.Router();
routerChats.get('/', getChats);
routerChats.get('/:id', getChatsFromUser);
routerChats.post('/', createChats);
routerChats.patch('/:id', updateChat);
routerChats.delete('/',deleteAllChats);
routerChats.delete('/:id',deleteChat);
export default routerChats;