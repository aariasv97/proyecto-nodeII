import Event from "../models/Event.js";

class EventDAO {
  create(eventData) {
    return Event.create(eventData);
  }

  findAll(filter, options) {
    return Event.find(filter)
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit);
  }

  count(filter) {
    return Event.countDocuments(filter);
  }

  findById(id) {
    return Event.findById(id);
  }

  update(id, eventData) {
    return Event.findByIdAndUpdate(id, eventData, {
      new: true,
      runValidators: true
    });
  }
}

export default new EventDAO();
