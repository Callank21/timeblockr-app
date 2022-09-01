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
          medata: async (parent, args, context) => {
            // if (context.user) {
              // const userData = await Task.find({ username: context.user.username });
              const userData = await Task.find({ username: args.username });
//this call will take all the data from a specific user and organize it into a properly structured array. Nulls will go in first, and then all items will be checked for children. All childless tasks will be removed from the list. All tasks will have their task field overwritten with their children. The nulls excluded, all tasks will check if any of the other tasks are their children, at which point they will replace the childless entry of that child task with a populated entry. The nulls will then do the same with the remaining tasks, checking the ids and replacing their unpopulated child tasks with the populated child tasks. This will result in a single object with a giant, populated task field.
              return userData;
            // }
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
            return Task.find().populate('tasks');
          },
        children: async (parent, { _id }) => {
          taskData = [];
            var regex = new RegExp(`,${_id},$`);
            (await Task.find({ path: regex})).forEach(item => taskData.push(item));
          return taskData;
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
            console.log(user);
            const token = signToken(user);
      
            return { token, user };
          },
        updateUser: async(parent, args, context) => {
          if (context.user) {
            const userData = await User.findOneAndUpdate(
              { _id: args._id },
              args,
              { new: true }
            )
              .select('-__v -password');
              return userData;
          }
        },
          createTask: async (parent, args, context) => {
            if (context.user) {
              args._id = new ObjectID();
              const task = await Task.create(args);
              var {_id, path } = task;
              const idList = [_id];
              path.split(',').filter(x => x).forEach(x => idList.push(ObjectID(x)));

                if (task) {
                for(i = 0; i < idList.length; i++) {
                  var {_id} = idList[i];
                  let timeTotal = 0;
                  let taskData = [];
                  taskData.push(await Task.findOne( { _id } ));
                  var regex = new RegExp(`,${_id.toString()},`);
                  (await Task.find({ path: regex})).forEach(item => taskData.push(item));
                  taskData.filter(item => item).forEach(item => timeTotal += item.time);
                  await Task.findOneAndUpdate(
                  { "_id": _id },
                  {
                    $set: {
                      totaltime: timeTotal
                      }
                  });
                } 
              }
              
              await User.findOneAndUpdate(
                { username: task.username },
                {
                  $addToSet: {
                    tasks: task._id,
                  },
                }
              );

              if(path) {
                //make it so when a new task is made that has the path relating to another task as its parent, it is inserted as its child. But also that might not save so that might not be a solution either
              await Task.findOneAndUpdate(
                { "_id": id },
                {
                  $addToSet: {
                    tasks: taskId,
                  },
                }
              );
            }

              return task;
            }
            throw new AuthenticationError();
          },
          updateTask: async (parent, args) => {
            const task = await Task.findOneAndUpdate({ _id: args._id }, args, {
              new: true,
            });

            var {_id, path } = task;
              const idList = [_id];
              path.split(',').filter(x => x).forEach(x => idList.push(ObjectID(x)));

            if (task) {
              for(i = 0; i < idList.length; i++) {
                var {_id} = idList[i];
                let timeTotal = 0;
                let taskData = [];
                taskData.push(await Task.findOne( { _id } ));
                var regex = new RegExp(`,${_id.toString()},`);
                (await Task.find({ path: regex})).forEach(item => taskData.push(item));
                taskData.filter(item => item).forEach(item => timeTotal += item.time);
                await Task.findOneAndUpdate(
                { "_id": _id },
                {
                  $set: {
                    totaltime: timeTotal
                    }
                });
              } 
            }

            if (task) {
              console.log("Task has been updated !");
              return task;
            }
      
            throw new AuthenticationError('No Task found !');
          },
        updateTime: async (parent, {_id}) => {
          var timeTotal = 0;
          let taskData = [];
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