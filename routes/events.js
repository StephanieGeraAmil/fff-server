import express from 'express';
import {getEvents, getEventsOfUser,createEvents, updateEvent, deleteEvent,deleteAllEvents} from '../controllers/events.js'
const routerEvents = express.Router();
routerEvents.get('/', getEvents);
routerEvents.get('/:id', getEventsOfUser);
routerEvents.post('/', createEvents);
routerEvents.patch('/:id', updateEvent);
routerEvents.delete('/',deleteAllEvents);
routerEvents.delete('/:id',deleteEvent);
export default routerEvents;