import express from 'express';
import {getEvents, createEvents, updateEvent, deleteEvent} from '../controllers/events.js'
const routerEvents = express.Router();
routerEvents.get('/', getEvents);
routerEvents.post('/', createEvents);
routerEvents.patch('/:id', updateEvent);
routerEvents.delete('/:id',deleteEvent);
export default routerEvents;