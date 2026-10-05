import {
  createTicket,
  getMyTickets,
  getEventTickets,
  cancelTicket,
} from "../services/tickets.service.js";

export const createTicketController = async (req, res, next) => {
  try {
    const { eid } = req.params;
    const { quantity } = req.body;

    const ticket = await createTicket(req.user.id, eid, quantity);

    res.status(201).json({
      status: "success",
      message: "Inscripción realizada correctamente",
      payload: ticket,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyTicketsController = async (req, res, next) => {
  try {
    const tickets = await getMyTickets(req.user.id);

    res.status(200).json({
      status: "success",
      payload: tickets,
    });
  } catch (error) {
    next(error);
  }
};

export const getEventTicketsController = async (req, res, next) => {
  try {
    const { eid } = req.params;

    
    const tickets = await getEventTickets(
      eid,
      req.user.id,
     req.user.role
    );

    res.status(200).json({
      status: "success",
      payload: tickets,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelTicketController = async (req, res, next) => {
  try {
    const { tid } = req.params;

    const isAdmin = req.user.role === "admin";

    const ticket = await cancelTicket(
      tid,
      req.user.id,
      isAdmin
    );

    res.status(200).json({
      status: "success",
      message: "Ticket cancelado correctamente",
      payload: ticket,
    });
  } catch (error) {
    next(error);
  }
};