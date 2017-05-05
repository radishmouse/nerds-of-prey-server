
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

const ActivityModel = db.define('activity', {
  tsStart: { type: Sequelize.BIGINT },
  tsEnd: { type: Sequelize.BIGINT },
});

const TagModel = db.define('tag', {
  name: { type: Sequelize.STRING },
});

ActivityModel.hasMany(TagModel);

casual.seed(12345);
db.sync({ force: true }).then(() => {
  _.times(10, () => {
    return ActivityModel.create({
      tsStart: (new Date()).getTime(),
      tsEnd: (new Date()).getTime() + 10000,
    }).then((activity) => {
      return activity.createTag({
        name: casual.word
      });
    });
  });
});

const Activity = db.models.activity;
const Tag = db.models.tag;

module.exports = {
  Activity,
  Tag,
};