const taskSeeds = require('./taskSeed.json');
const userSeeds = require('./userSeed.json');
const db = require('../config/connection');
const { User, Task } = require('../models');

db.once('open', async () => {
  try {
    await Task.deleteMany({});
    await User.deleteMany({});

    await User.insertMany(userSeeds);

    for (let i = 0; i < taskSeeds.length; i++) {
      const { _id, username, path  } = await Task.create(taskSeeds[i]);
      console.log(path);
      await User.findOneAndUpdate(
        { username: username },
        {
          $addToSet: {
            tasks: _id,
          },
        }
      );
    }
    // var retrievedTasks = await Task.find();
    // // console.log(retrievedTasks);
    // for (let i = 0; i < retrievedTasks.length; i++) {
    //   var id = retrievedTasks[i]._id;
    //   var regex = new RegExp(`,${id},`);
    //   var taskData = [];
    //   (await Task.find({ path: regex})).forEach(item => taskData.push(item));
    //   for(let i = 0; i < taskData.length; i++) {
    //     var taskId = taskData[i]._id;
    //   await Task.findOneAndUpdate(
    //     { "_id": id },
    //     {
    //       $addToSet: {
    //         tasks: taskId,
    //       },
    //     }
    //   );
    // }
    // }

  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log('all done!');
  process.exit(0);
});
