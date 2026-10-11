import Ticket from "../models/Ticket.js";

class TicketDAO {
  create(ticketData) {
    return Ticket.create(ticketData);
  }

  findByUser(userId) {
    return Ticket.find({ user: userId })
      .populate("event", "title date location");
  }

  findByEvent(eventId) {
    return Ticket.find({ event: eventId })
      .populate("user", "first_name last_name email");
  }

  findActiveByUserAndEvent(userId, eventId) {
    return Ticket.findOne({
      user: userId,
      event: eventId,
      status: { $in: ["confirmed", "pending"] }
    });
  }

  findActiveByEvent(eventId) {
    return Ticket.find({
      event: eventId,
      status: { $in: ["confirmed", "pending"] }
    });
  }

  findById(ticketId) {
    return Ticket.findById(ticketId);
  }

  cancel(ticketId) {
    return Ticket.findByIdAndUpdate(
      ticketId,
      {
        status: "cancelled",
        cancelledAt: new Date()
      },
      { new: true }
    );
  }
}

export default new TicketDAO();