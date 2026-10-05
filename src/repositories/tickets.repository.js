import {
  createTicket,
  findTicketsByUser,
  findTicketsByEvent,
  findActiveTicketByUserAndEvent,
  findActiveTicketsByEvent,
  findTicketById,
  cancelTicket,
} from "../dao/tickets.dao.js";

export const saveTicket = (ticketData) => {
  return createTicket(ticketData);
};

export const getTicketsByUser = (userId) => {
  return findTicketsByUser(userId);
};

export const getTicketsByEvent = (eventId) => {
  return findTicketsByEvent(eventId);
};

export const getActiveTicketByUserAndEvent = (userId, eventId) => {
  return findActiveTicketByUserAndEvent(userId, eventId);
};

export const getActiveTicketsByEvent = (eventId) => {
  return findActiveTicketsByEvent(eventId);
};

export const getTicketById = (ticketId) => {
  return findTicketById(ticketId);
};

export const cancelTicketById = (ticketId) => {
  return cancelTicket(ticketId);
};