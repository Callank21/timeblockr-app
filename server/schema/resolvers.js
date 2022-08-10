const { AuthenticationError } = require('apollo-server-express');
const { User, Task } = require('../models');
const { signToken } = require('../utils/auth');
var mongoose = require('mongoose');
var ObjectID = require('bson').ObjectID;

const resolvers = {
    Query:  {
        me: async (parent, args, context) => {
            if (context.user) {
              const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password')
                .populate('tasks');
      
              return userData;
            }
            throw new AuthenticationError('Not logged in');
          },
        user: async (parent, { username }) => {
            return User.findOne({ username })
              .select('-__v -password')
              .populate('tasks');
          },
        users: async () => {
            return User.find().select('-__v -password').populate('tasks');
          },
        task: async (parent, { _id }) => {
            taskData = [];
            taskData.push(await Task.findOne( { _id } ));
            var regex = new RegExp(`,${_id},`);
            (await Task.find({ path: regex})).forEach(item => taskData.push(item));

            return taskData;
          },
        tasks: async () => {
            return Task.find();
          }
    },

    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
      
            if (!user) {
              throw new AuthenticationError('Incorrect credentials');
            }
      
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
              throw new AuthenticationError('Incorrect credentials!');
            }
      
            const token = signToken(user);
            return { token, user };
          },
        createUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
      
            return { token, user };
          },
          createTask: async (parent, args, context) => {
            // if (context.user) {
              args._id = new ObjectID();
              const task = await Task.create(args);

              await User.findOneAndUpdate(
                { username: task.username },
                {
                  $addToSet: {
                    tasks: task._id,
                  },
                }
              );
              // await User.findByIdAndUpdate(
              //   { _id: context.user._id },
              //   { $push: { tasks: task._id } },
              //   { new: true }
              // );
              return task;
            // }
            // throw new AuthenticationError();
          },
        updateTime: async (parent, {_id}) => {
          var timeTotal = 0;
          var taskData = [];
          taskData.push(await Task.findOne( { _id } ));
          var regex = new RegExp(`,${_id},`);
          (await Task.find({ path: regex})).forEach(item => taskData.push(item));
          taskData.filter(item => item).forEach(item =>  timeTotal += item.time);
          return Task.findOneAndUpdate(
            { "_id": _id },
            {
              $set: {
                totaltime: timeTotal
            }
        });
            // return timeTotal;
        }
    }
};



module.exports = resolvers;