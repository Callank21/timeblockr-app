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
            taskData.push(Task.findOne( { _id } ));
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
        updateTime: async (parent, args) => {
          var timeTotal = 0;
          taskData = [];
            // taskData.push(Task.findOne( { args._id } ));
          var regex = new RegExp(`,${args._id},`);
            // (await Task.find({ path: regex})).forEach(item => taskData.push(item));
          var value = (await Task.find({ path: regex})).filter(item => item.time).forEach(item => timeTotal += item.time);
            console.log(value);
            console.log(timeTotal);
            return timeTotal;
        }
    }
};



module.exports = resolvers;