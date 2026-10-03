import {
  createEventService,
  getEventsService,
  getEventByIdService,
  updateEventService,
  updateEventStatusService
} from "../services/events.service.js";

export const getEvents = async (req, res, next) => {
  try {
    const result = await getEventsService(req.query);

    res.status(200).json({
      status: "success",
      ...result
    });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req, res, next) => {
  try {
    const event = await getEventByIdService(req.params.id);

    res.status(200).json({
      status: "success",
      payload: event
    });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const event = await createEventService({
      ...req.body,
      organizer: req.user._id
    });

    res.status(201).json({
      status: "success",
      payload: event
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const event = await updateEventService(
      req.params.id,
      req.user,
      req.body
    );

    res.status(200).json({
      status: "success",
      payload: event
    });
  } catch (error) {
    next(error);
  }
};

export const updateEventStatus = async (req, res, next) => {
  try {
    const event = await updateEventStatusService(
      req.params.id,
      req.user,
      req.body.status
    );

    res.status(200).json({
      status: "success",
      payload: event
    });
  } catch (error) {
    next(error);
  }
};
