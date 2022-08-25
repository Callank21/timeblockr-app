const { Schema, model } = require('mongoose');
// const User = require('./User');

const taskSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    time: {
      type: Number
    },
    totaltime: {
      type: Number
    },
    username: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        default: null
    }
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const Task = model('Task', taskSchema);

module.exports = Task;
