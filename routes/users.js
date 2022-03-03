import express from 'express';
import {getUsers, createUsers, updateUser, deleteUser} from '../controllers/users.js'
const routerUsers = express.Router();
routerUsers.get('/', getUsers);
routerUsers.post('/', createUsers);
routerUsers.patch('/:id', updateUser);
routerUsers.delete('/:id',deleteUser);
export default routerUsers;