import EventDAO from "../dao/events.dao.js";

class EventRepository {
  create(eventData) {
    return EventDAO.create(eventData);
  }

  findAll(filter, options) {
    return EventDAO.findAll(filter, options);
  }

  count(filter) {
    return EventDAO.count(filter);
  }

  findById(id) {
    return EventDAO.findById(id);
  }

  update(id, eventData) {
    return EventDAO.update(id, eventData);
  }
}

export default new EventRepository();
