import express from 'express';
import {getUsers, createUsers, updateUser, deleteUser, getUsersByEmail} from '../controllers/users.js'
const routerUsers = express.Router();
routerUsers.get('/', getUsers);
routerUsers.get('/:email', getUsersByEmail);
routerUsers.post('/', createUsers);
routerUsers.patch('/:id', updateUser);
routerUsers.delete('/:id',deleteUser);
export default routerUsers;