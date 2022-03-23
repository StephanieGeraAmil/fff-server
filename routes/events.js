import express from 'express';
import {getEvents, createEvents, updateEvent, deleteEvent,deleteAllEvents} from '../controllers/events.js'
const routerEvents = express.Router();
routerEvents.get('/', getEvents);
routerEvents.post('/', createEvents);
routerEvents.patch('/:id', updateEvent);
routerEvents.delete('/',deleteAllEvents);
routerEvents.delete('/:id',deleteEvent);
export default routerEvents;