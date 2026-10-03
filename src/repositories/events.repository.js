import {
  createEvent,
  findAllEvents,
  countEvents,
  findEventById,
  updateEvent
} from "../dao/events.dao.js";

export const saveEvent = (eventData) => createEvent(eventData);

export const getAllEvents = (filter, options) =>
  findAllEvents(filter, options);

export const getTotalEvents = (filter) => countEvents(filter);

export const getEventById = (id) => findEventById(id);

export const updateEventById = (id, eventData) =>
  updateEvent(id, eventData);
