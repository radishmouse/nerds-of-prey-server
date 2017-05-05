
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

casual.seed(12345);
db.drop();
db.sync({ force: true }).then(() => {
  Promise.all([
    TagModel.create({ name: 'Tesla Drone Project'}),
    TagModel.create({ name: 'studying'}),
    TagModel.create({ name: 'coding'}),
    TagModel.create({ name: 'designing'}),
  ]).then((tags) => {
    _.times(10, () => {
      const t = _.sampleSize(tags, _.random(1, tags.length));
      console.log(tags);
      ActivityModel.create({
        tsStart: (new Date()).getTime(),
        tsEnd: (new Date()).getTime() + 10000,
      }).then(activity => {
        activity.setTags(t);
      });
    });
  })
});

const Activity = db.models.activity;
const Tag = db.models.tag;

module.exports = {
  Activity,
  Tag,
};