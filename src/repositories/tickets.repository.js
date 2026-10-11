import TicketDAO from "../dao/tickets.dao.js";

class TicketRepository {
  create(ticketData) {
    return TicketDAO.create(ticketData);
  }

  findByUser(userId) {
    return TicketDAO.findByUser(userId);
  }

  findByEvent(eventId) {
    return TicketDAO.findByEvent(eventId);
  }

  findActiveByUserAndEvent(userId, eventId) {
    return TicketDAO.findActiveByUserAndEvent(userId, eventId);
  }

  findActiveByEvent(eventId) {
    return TicketDAO.findActiveByEvent(eventId);
  }

  findById(ticketId) {
    return TicketDAO.findById(ticketId);
  }

  cancel(ticketId) {
    return TicketDAO.cancel(ticketId);
  }
}

export default new TicketRepository();