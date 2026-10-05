import Ticket from "../models/Ticket.js";

export const createTicket = (ticketData) => {
  return Ticket.create(ticketData);
};

export const findTicketsByUser = (userId) => {
  return Ticket.find({ user: userId })
    .populate("event", "title date location");
};

export const findTicketsByEvent = (eventId) => {
  return Ticket.find({ event: eventId })
    .populate("user", "first_name last_name email");
};

export const findActiveTicketByUserAndEvent = (userId, eventId) => {
  return Ticket.findOne({
    user: userId,
    event: eventId,
    status: { $in: ["confirmed", "pending"] },
  });
};

export const findActiveTicketsByEvent = (eventId) => {
  return Ticket.find({
    event: eventId,
    status: { $in: ["confirmed", "pending"] },
  });
};

export const findTicketById = (ticketId) => {
  return Ticket.findById(ticketId);
};

export const cancelTicket = (ticketId) => {
  return Ticket.findByIdAndUpdate(
    ticketId,
    {
      status: "cancelled",
      cancelledAt: new Date(),
    },
    { new: true }
  );
};