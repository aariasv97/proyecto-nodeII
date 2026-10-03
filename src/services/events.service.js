import {
  saveEvent,
  getAllEvents,
  getTotalEvents,
  getEventById,
  updateEventById
} from "../repositories/events.repository.js";

const createError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export const createEventService = async (eventData) => {
  if (new Date(eventData.date) < new Date()) {
    throw createError("La fecha del evento no puede estar en el pasado", 400);
  }

  if (eventData.capacity <= 0) {
    throw createError("La capacidad debe ser mayor a 0", 400);
  }

  if (eventData.price < 0) {
    throw createError("El precio no puede ser negativo", 400);
  }

  return saveEvent(eventData);
};

export const getEventsService = async ({
  status,
  category,
  location,
  dateFrom,
  dateTo,
  page = 1,
  limit = 10,
  sort = "date"
}) => {
  const filter = {};

  if (status) filter.status = status;
  if (category) filter.category = category;
  if (location) filter.location = location;

  if (dateFrom || dateTo) {
    filter.date = {};

    if (dateFrom) filter.date.$gte = new Date(dateFrom);
    if (dateTo) filter.date.$lte = new Date(dateTo);
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const [data, total] = await Promise.all([
    getAllEvents(filter, {
      sort,
      skip,
      limit: limitNumber
    }),
    getTotalEvents(filter)
  ]);

  return {
    data,
    page: pageNumber,
    limit: limitNumber,
    total,
    totalPages: Math.ceil(total / limitNumber)
  };
};

export const getEventByIdService = async (id) => {
  const event = await getEventById(id);

  if (!event) {
    throw createError("Evento no encontrado", 404);
  }

  return event;
};

export const updateEventService = async (id, user, eventData) => {
  const event = await getEventById(id);

  if (!event) {
    throw createError("Evento no encontrado", 404);
  }

  if (event.status === "cancelled") {
    throw createError("Los eventos cancelados no pueden modificarse", 400);
  }

  const isAdmin = user.role === "admin";
  const isOwner = event.organizer.toString() === user._id.toString();

  if (!isAdmin && !isOwner) {
    throw createError("No tienes permiso para modificar este evento", 403);
  }

  if (eventData.date && new Date(eventData.date) < new Date()) {
    throw createError("La fecha del evento no puede estar en el pasado", 400);
  }

  if (eventData.capacity !== undefined && eventData.capacity <= 0) {
    throw createError("La capacidad debe ser mayor a 0", 400);
  }

  if (eventData.price !== undefined && eventData.price < 0) {
    throw createError("El precio no puede ser negativo", 400);
  }

  return updateEventById(id, eventData);
};

export const updateEventStatusService = async (id, user, status) => {
  const event = await getEventById(id);

  if (!event) {
    throw createError("Evento no encontrado", 404);
  }

  if (event.status === "cancelled") {
    throw createError("Un evento cancelado no puede cambiar de estado", 400);
  }

  const isAdmin = user.role === "admin";
  const isOwner = event.organizer.toString() === user._id.toString();

  if (!isAdmin && !isOwner) {
    throw createError("No tienes permiso para modificar este evento", 403);
  }

  if (status === "published") {
    if (new Date(event.date) <= new Date()) {
      throw createError(
        "No se puede publicar un evento cuya fecha ya pasó",
        400
      );
    }
  }

  return updateEventById(id, { status });
};
