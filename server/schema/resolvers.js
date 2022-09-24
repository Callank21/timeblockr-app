const { AuthenticationError } = require('apollo-server-express');
const { User, Task, CalendarItem } = require('../models');
const { signToken } = require('../utils/auth');
var mongoose = require('mongoose');
var ObjectID = require('bson').ObjectID;

const resolvers = {
    Query:  {
        me: async (parent, args, context) => {
            if (context.user) {
              const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password')
                .populate('tasks')
                .populate('calendaritems');
      
              return userData;
            }
            throw new AuthenticationError('Not logged in');
          },
        user: async (parent, { username }) => {
            return User.findOne({ username })
              .select('-__v -password')
              .populate('tasks').populate('calendaritems');
          },
        users: async () => {
            return User.find().select('-__v -password').populate('tasks').populate('calendaritems');
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
          },
        calendaritem: async (parent, { _id }) => {
          return CalendarItem.findOne({ _id });
        },
        calendaritems: async () => {
          return CalendarItem.find();
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
              if (path) {
              path.split(',').filter(x => x).forEach(x => idList.push(ObjectID(x)));
            }
                if (task) {
                for(i = 0; i < idList.length; i++) {
                  var {_id} = idList[i];
                  let timeTotal = 0;
                  let taskData = [];
                  taskData.push(await Task.findOne( { _id } ));
                  var regex = new RegExp(`,${_id.toString()},`);
                  (await Task.find({ path: regex})).forEach(item => taskData.push(item));
                  taskData.filter(item => item.done === false).forEach(item => timeTotal += item.time);
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
            
            var {_id, path, done } = task;
            if (done) {
              let regex = new RegExp(`,${_id.toString()},`);
              let doneChain = [];
              (await Task.find({ path: regex})).forEach(item => doneChain.push(item));
              if (doneChain.length > 0) {
                for(var j = 0; j < doneChain.length; j++) {
                  let {_id} = doneChain[j];
                  await Task.findOneAndUpdate(
                    { "_id": _id },
                    {
                      $set: {
                        done: true
                        }
                    });
                }
              }
            };

              const idList = [_id];
              if (path) {
              path.split(',').filter(x => x).forEach(x => idList.push(ObjectID(x)));
            }
            if (task) {
              for(i = 0; i < idList.length; i++) {
                var {_id} = idList[i];
                let timeTotal = 0;
                let taskData = [];
                taskData.push(await Task.findOne( { _id } ));
                let regex = new RegExp(`,${_id.toString()},`);
                (await Task.find({ path: regex})).forEach(item => taskData.push(item));
                taskData.filter(item => item.done === false).forEach(item => timeTotal += item.time);
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
              return task;
            }
      
            throw new AuthenticationError('No Task found !');
          },
        deleteTask: async (parent, { _id }) => {
          const task = await Task.findOne({ _id });
          if (task) {
          var { path } = task;
          var regex = new RegExp(`,${_id.toString()},`);
          const children = await Task.find({ path: regex});
          if(children.length > 0) {
            var deleteList = children.map(x => x._id);
            deleteList.push(ObjectID(_id));
            await Task.deleteMany(
              {_id: {$in: deleteList}}
            );
          } else {
          await Task.deleteOne({ _id });
        }
        if (path) {
          const idList = path.split(',').filter(x => x).map(x => ObjectID(x));
          for(i = 0; i < idList.length; i++) {
            var {_id} = idList[i];
            let timeTotal = 0;
            let taskData = [];
            taskData.push(await Task.findOne( { _id } ));
            var regex = new RegExp(`,${_id.toString()},`);
            (await Task.find({ path: regex})).forEach(item => taskData.push(item));
            taskData.filter(item => item.done === false).forEach(item => timeTotal += item.time);
            await Task.findOneAndUpdate(
            { "_id": _id },
            {
              $set: {
                totaltime: timeTotal
                }
            });
          }
        }
        return console.log('Task and children has been removed !');
        }
          
        throw new AuthenticationError('No Calendar Item found !');
        },
        createCalendarItem: async (parent, args, context) => {
          if (context.user) {
            args._id = new ObjectID();
            const calendarItem = await CalendarItem.create(args);
            await User.findOneAndUpdate(
              { "_id": context.user._id },
              {
                $addToSet: {
                  calendaritems: calendarItem._id,
                },
              }
            );
            
            return calendarItem;
          }
          throw new AuthenticationError();
        },
        updateCalendarItem: async (parent, args) => {
          const calendarItem = await CalendarItem.findOneAndUpdate({ _id: args._id }, args, {
            new: true,
          });
    
          if (calendarItem) {
            return console.log('Calendar Item has been updated !');
          }
    
          throw new AuthenticationError('No Calendar Item found !');
        },
        deleteCalendarItem: async (parent, { _id }) => {
          const calendarItem = await CalendarItem.findOne({ _id });
    
          if (calendarItem) {
            await calendarItem.deleteOne({ _id });
    
            return console.log('Calendar Item has been removed !');
          }
          throw new AuthenticationError('No Calendar Item found !');
        },
    }
};



module.exports = resolvers;