const Sequelize = require('sequelize');
const casual = require('casual');
const _ = require('lodash');

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

casual.seed(12345);
db.drop();
db.sync({ force: true }).then(() => {

  Promise.all([
    Client.create({ name: 'Apple'}),
    Client.create({ name: 'Google'}),
    Client.create({ name: 'Area 51'}),
  ]).then((clients) => {
    Promise.all([
      Tag.create({ name: 'studying'}),
      Tag.create({ name: 'coding'}),
      Tag.create({ name: 'designing'}),
    ]).then((tags) => {
      // const clients = assoc.slice(4, assoc.length);
      _.times(10, (i) => {
        const t = _.sampleSize(tags, _.random(1, tags.length));
        const c = _.sampleSize(clients, _.random(1, clients.length));
        Activity.create({
          tsStart: (new Date()).getTime(),
          tsEnd: (new Date()).getTime() + 10000,
          isBillable: i % 2 == 0,
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