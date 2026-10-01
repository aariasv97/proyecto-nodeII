import Event from "../models/Event.js";

export const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ published: true });

    res.status(200).json({
      status: "success",
      payload: events
    });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const event = await Event.create({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      owner: req.user._id
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
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        status: "error",
        message: "Evento no encontrado"
      });
    }

    const isOwner = event.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        status: "error",
        message: "No tenés permisos para modificar este evento"
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        published: req.body.published
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: "success",
      payload: updatedEvent
    });
  } catch (error) {
    next(error);
  }
};
