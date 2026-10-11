import { sendTicketConfirmationEmail } from "./email.service.js";
import TicketRepository from "../repositories/tickets.repository.js";
import EventRepository from "../repositories/events.repository.js";
import UserRepository from "../repositories/users.repository.js";

const createError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export const createTicket = async (userId, eventId, quantity) => {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw createError("La cantidad debe ser un número entero mayor a 0", 400);
  }

  const event = await EventRepository.findById(eventId);

  if (!event) {
    throw createError("Evento no encontrado", 404);
  }

  if (event.status === "cancelled") {
    throw createError("El evento está cancelado", 400);
  }

  if (new Date(event.date) <= new Date()) {
    throw createError("El evento ya ha finalizado", 400);
  }

  if (event.status !== "published") {
    throw createError("El evento no está publicado", 400);
  }

  const existingTicket = await TicketRepository.findActiveByUserAndEvent(
    userId,
    eventId
  );

  if (existingTicket) {
    throw createError(
      "El usuario ya tiene una inscripción activa para este evento",
      409
    );
  }

  const activeTickets = await TicketRepository.findActiveByEvent(eventId);

  const occupiedSeats = activeTickets.reduce(
    (total, ticket) => total + ticket.quantity,
    0
  );

  if (occupiedSeats + quantity > event.capacity) {
    throw createError("No hay cupos suficientes para esta inscripción", 400);
  }

  const user = await UserRepository.findById(userId);

  if (!user) {
    throw createError("Usuario no encontrado", 404);
  }

  const reservationCode = `RES-${Date.now()}-${Math.floor(
    Math.random() * 10000
  )}`;

  const ticket = await TicketRepository.create({
    user: userId,
    event: eventId,
    status: "confirmed",
    quantity,
    reservationCode
  });

  await sendTicketConfirmationEmail({
    email: user.email,
    reservationCode: ticket.reservationCode,
    eventTitle: event.title,
    quantity: ticket.quantity
  });

  return ticket;
};

export const getMyTickets = async (userId) => {
  return TicketRepository.findByUser(userId);
};

export const getEventTickets = async (eventId, userId, userRole) => {
  const event = await EventRepository.findById(eventId);

  if (!event) {
    throw createError("Evento no encontrado", 404);
  }

  if (userRole !== "admin") {
    if (userRole !== "organizer") {
      throw createError(
        "No tienes permiso para consultar los tickets de este evento",
        403
      );
    }

    if (event.organizer.toString() !== userId.toString()) {
      throw createError(
        "No tienes permiso para consultar los tickets de este evento",
        403
      );
    }
  }

  return TicketRepository.findByEvent(eventId);
};

export const cancelTicket = async (ticketId, userId, isAdmin) => {
  const ticket = await TicketRepository.findById(ticketId);

  if (!ticket) {
    throw createError("Ticket no encontrado", 404);
  }

  if (!isAdmin && ticket.user.toString() !== userId.toString()) {
    throw createError("No tienes permiso para cancelar este ticket", 403);
  }

  if (ticket.status === "cancelled") {
    throw createError("El ticket ya está cancelado", 400);
  }

  return TicketRepository.cancel(ticketId);
};