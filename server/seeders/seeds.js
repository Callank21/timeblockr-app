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

  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log('all done!');
  process.exit(0);
});
