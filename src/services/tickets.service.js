import { sendTicketConfirmationEmail } from "./email.service.js";

import {
  saveTicket,
  getTicketsByUser,
  getTicketsByEvent,
  getActiveTicketByUserAndEvent,
  getActiveTicketsByEvent,
  getTicketById,
  cancelTicketById,
} from "../repositories/tickets.repository.js";

import { getEventById } from "../repositories/events.repository.js";
import { getUserById } from "../repositories/users.repository.js";

const createError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export const createTicket = async (userId, eventId, quantity) => {
  // 1. Validar quantity
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw createError("La cantidad debe ser un número entero mayor a 0", 400);
  }

  // 2. Buscar evento
  const event = await getEventById(eventId);

  if (!event) {
    throw createError("Evento no encontrado", 404);
  }

 // 3. Validar que el evento no esté cancelado
  if (event.status === "cancelled") {
  throw createError("El evento está cancelado", 400);
  }

  // 4. Validar que el evento no haya finalizado
  if (new Date(event.date) <= new Date()) {
    throw createError("El evento ya ha finalizado", 400);
  }

    // 5. Validar estado del evento
  if (event.status !== "published") {
    throw createError("El evento no está publicado", 400);
  }

  // 6. Verificar inscripción activa duplicada
  const existingTicket = await getActiveTicketByUserAndEvent(
    userId,
    eventId
  );

  if (existingTicket) {
    throw createError(
      "El usuario ya tiene una inscripción activa para este evento",
      409
    );
  }

  // 7. Obtener tickets activos del evento
  const activeTickets = await getActiveTicketsByEvent(eventId);

  // 8. Calcular cupos ocupados
  const occupiedSeats = activeTickets.reduce(
    (total, ticket) => total + ticket.quantity,
    0
  );

  // 9. Verificar capacidad
  if (occupiedSeats + quantity > event.capacity) {
    throw createError("No hay cupos suficientes para esta inscripción", 400);
  }

  // 10. Buscar usuario
  const user = await getUserById(userId);

  if (!user) {
    throw createError("Usuario no encontrado", 404);
  }

  // 11. Generar código de reserva
  const reservationCode = `RES-${Date.now()}-${Math.floor(
    Math.random() * 10000
  )}`;

  // 12. Crear ticket
  const ticket = await saveTicket({
    user: userId,
    event: eventId,
    status: "confirmed",
    quantity,
    reservationCode,
  });

  // 13. Enviar email de confirmación
  await sendTicketConfirmationEmail({
    email: user.email,
    reservationCode: ticket.reservationCode,
    eventTitle: event.title,
    quantity: ticket.quantity,
  });

  return ticket;
};

export const getMyTickets = async (userId) => {
  return getTicketsByUser(userId);
};


export const getEventTickets = async (eventId, userId, userRole) => {
  const event = await getEventById(eventId);

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

  return getTicketsByEvent(eventId);
};

export const cancelTicket = async (ticketId, userId, isAdmin) => {
  const ticket = await getTicketById(ticketId);

  if (!ticket) {
    throw createError("Ticket no encontrado", 404);
  }

  if (!isAdmin && ticket.user.toString() !== userId.toString()) {
    throw createError("No tienes permiso para cancelar este ticket", 403);
  }

  if (ticket.status === "cancelled") {
    throw createError("El ticket ya está cancelado", 400);
  }

  return cancelTicketById(ticketId);
};