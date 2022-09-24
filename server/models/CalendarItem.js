const { Schema, model } = require('mongoose');

const calendarItemSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId
    },
    calendarId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
        type: String,
        required: true,
      },
    start: {
        type: String,
        required: true,
      },
    end: {
        type: String,
        required: true,
      },
    state: {
        type: String
    }
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const CalendarItem = model('CalendarItem', calendarItemSchema);

module.exports = CalendarItem;