
// const PresidentModel = require('./model');

// class President {
//   constructor() {
//     this.findPresident = (name) => {
//       const person = PresidentModel.findOne({ name }, (error, data) => {
//         return data;
//       });
//       return person;
//     };
//   }
// }

// module.exports = { President };

const Sequelize = require('sequelize');
const casual = require('casual');
const _ = require('lodash');

const db = new Sequelize('focus', null, null, {
  host: 'localhost',
  dialect: 'postgres',
});

const ActivityTags = db.define('activitytags', {});

const ActivityModel = db.define('activity', {
  tsStart: { type: Sequelize.BIGINT },
  tsEnd: { type: Sequelize.BIGINT },
});

const TagModel = db.define('tag', {
  name: { type: Sequelize.STRING },
});

ActivityModel.belongsToMany(TagModel, { through: ActivityTags });
TagModel.belongsToMany(ActivityModel, { through: ActivityTags });

const Activity = db.models.activity;
const Tag = db.models.tag;

casual.seed(12345);
db.drop();
db.sync({ force: true }).then(() => {
  Promise.all([
    Tag.create({ name: 'Tesla Drone Project'}),
    Tag.create({ name: 'studying'}),
    Tag.create({ name: 'coding'}),
    Tag.create({ name: 'designing'}),
  ]).then((tags) => {
    _.times(10, () => {
      const t = _.sampleSize(tags, _.random(1, tags.length));
      console.log(tags);
      Activity.create({
        tsStart: (new Date()).getTime(),
        tsEnd: (new Date()).getTime() + 10000,
      }).then(activity => {
        activity.setTags(t);
      });
    });
  })
});

module.exports = {
  Activity,
  Tag,
};