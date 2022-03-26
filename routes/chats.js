import express from 'express';
import {getChats, createChats, updateChat,getChatsOfUser, deleteChat,deleteAllChats} from '../controllers/chats.js'
const routerChats = express.Router();
routerChats.get('/', getChats);
routerChats.get('/:id', getChatsOfUser);
routerChats.post('/', createChats);
routerChats.patch('/:id', updateChat);
routerChats.delete('/',deleteAllChats);
routerChats.delete('/:id',deleteChat);
export default routerChats;