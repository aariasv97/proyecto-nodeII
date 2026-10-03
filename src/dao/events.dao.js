import Event from "../models/Event.js";

export const createEvent = (eventData) => Event.create(eventData);

export const findAllEvents = (filter, options) =>
  Event.find(filter)
    .sort(options.sort)
    .skip(options.skip)
    .limit(options.limit);

export const countEvents = (filter) => Event.countDocuments(filter);

export const findEventById = (id) => Event.findById(id);

export const updateEvent = (id, eventData) =>
  Event.findByIdAndUpdate(id, eventData, {
    new: true,
    runValidators: true
  });
