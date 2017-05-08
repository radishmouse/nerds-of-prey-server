const Sequelize = require('sequelize');
const casual = require('casual');
const _ = require('lodash');
const moment = require('moment');

const db = new Sequelize('peak', null, null, {
  host: 'localhost',
  dialect: 'postgres',
});

const ActivityTags = db.define('activitytags', {});
const ActivityClients = db.define('activityclients', {});

const ActivityModel = db.define('activity', {
  tsStart: { type: Sequelize.BIGINT },
  tsEnd: { type: Sequelize.BIGINT },
  isBillable: { type: Sequelize.BOOLEAN },
});

const TagModel = db.define('tag', {
  name: { type: Sequelize.STRING },
});

const ClientModel = db.define('client', {
  name: { type: Sequelize.STRING },
});

ActivityModel.belongsToMany(TagModel, { through: ActivityTags });
TagModel.belongsToMany(ActivityModel, { through: ActivityTags });

ActivityModel.belongsToMany(ClientModel, { through: ActivityClients });
ClientModel.belongsToMany(ActivityModel, { through: ActivityClients });

const Activity = db.models.activity;
const Tag = db.models.tag;
const Client = db.models.client;

function getRandomInt(min=0, max=60) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

const randomDaysAgo = () => (
  _.sample([0, 1, 2, 3, 4, 5, 6, 7])
)

const randomHourOfDay = () => getRandomInt(7, 20);
const randomMinutes = () => getRandomInt(0, 60);
const randomDurationMinutes = () => getRandomInt(0, 30);
const randomDurationMS = () => randomDurationMinutes() * 60 * 1000;

const genRandomStartTime = () => {
  let time = moment();
  time.subtract(randomDaysAgo(), 'd');
  time.hour(randomHourOfDay());
  time.minutes(randomMinutes());
  return time;
}


casual.seed(12345);
db.drop();
db.sync({ force: true }).then(() => {

  Promise.all([
    Client.create({ name: 'humrun'}),
    Client.create({ name: 'rollins'}),
    Client.create({ name: 'apple gsx'}),
    Client.create({ name: 'bmw'}),
    Client.create({ name: 'turner'}),
    Client.create({ name: 'ge'}),
    Client.create({ name: 'home depot'}),
    Client.create({ name: 'collosseum'}),
  ]).then((clients) => {
    Promise.all([
      Tag.create({ name: 'reading'}),
      Tag.create({ name: 'coding'}),
      Tag.create({ name: 'meeting'}),
      Tag.create({ name: 'designing'}),
      Tag.create({ name: 'pairing'}),
      Tag.create({ name: 'meditating'}),
    ]).then((tags) => {
      // const clients = assoc.slice(4, assoc.length);
      _.times(getRandomInt(10, 30), (i) => {
        const t = _.sample(tags);
        const c = _.sample(clients);
        const start = genRandomStartTime().valueOf();
        Activity.create({
          tsStart: start,
          tsEnd: start + randomDurationMS(),
          isBillable: _.sample([true, false]),
        }).then(activity => {
          activity.setTags(t);
          activity.setClients(c);
        });
      });
    })
  });
});

module.exports = {
  Activity,
  Tag,
  Client,
};