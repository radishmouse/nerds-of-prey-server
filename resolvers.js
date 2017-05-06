const {
  Activity,
  Tag,
  Client,
} = require('./connectors');

const {getBoundingTimestamps} = require('./utils');

const activity = (_, args) => Activity.find({ where: args });

const activities = (_, {
  tsStart,
  tsEnd,
  tagId,
  isBillable,
  clientId,
}) => {
  let filter = {
    where: {},
    include: [],
  }
  if (typeof isBillable !== 'undefined') {
    filter.where = Object.assign({}, filter.where, {
      isBillable,
    });
  }

  if (tsStart && tsEnd) {
    filter.where = Object.assign({}, filter.where, {
      tsStart: {
        $gte: tsStart
      },
      tsEnd: {
        $lte: tsEnd
      }
    });
  }
  if (tagId) {
    filter.include = filter.include.concat( 
      [{
        model: Tag,
        where: {
          id: tagId
        }
      }]
    );
  }
  if (clientId) {
    filter.include = filter.include.concat( 
      [{
        model: Client,
        where: {
          id: clientId
        }
      }]
    );
  }


  return Activity.findAll(filter);
};

const tag = (_, args) => Tag.find({ where: args });

const tags = (_, args) => Tag.findAll({});

const client = (_, args) => Client.find({ where: args });

const clients = (_, args) => Client.findAll({});

const addActivity = (_, activity) => {
  return Activity.create(activity).then((a) => {
    if (activity.tags) {
      a.setTags(activity.tags);
    }
    if (activity.clientId) {
      a.setClients([activity.clientId]);
    }
    return Object.assign({}, activity, {id: a.id});
  })
};

// probably not necessary to be able to create a tag
// with activities already set, but whatevs.
const addTag = (_, tag) => {
  return Tag.create(tag).then((t) => {
    if (tag.activities) {
      t.setActivities(tag.activities);
    }
    return Object.assign({}, tag, {id: t.id});
  })
};

// YAK: change this to a call to .update
const addTagToActivity = (_, args) => {
  return Promise.all([
    Activity.findById(args.activityId),
    Tag.findById(args.tagId),
  ]).then(([a, t]) => {
    a.addTag(t);
    return a;
  });
};
// YAK: change this to a call to .update
const removeTagFromActivity = (_, args) => {
  return Promise.all([
    Activity.findById(args.activityId),
    Tag.findById(args.tagId),
  ]).then(([a, t]) => {
    a.removeTag(t);
    return a;
  });
};

// probably not necessary to be able to create a tag
// with activities already set, but whatevs.
const addClient = (_, client) => {
  return Client.create(client).then((c) => {
    if (client.activities) {
      c.setActivities(client.activities);
    }
    return Object.assign({}, client, {id: c.id});
  })
};

// YAK: change this to a call to .update
const addClientToActivity = (_, args) => {
  return Promise.all([
    Activity.findById(args.activityId),
    Client.findById(args.clientId),
  ]).then(([a, c]) => {
    a.addClient(c);
    return a;
  });
};
// YAK: change this to a call to .update
const removeClientFromActivity = (_, args) => {
  return Promise.all([
    Activity.findById(args.activityId),
    Client.findById(args.clientId),
  ]).then(([a, c]) => {
    a.removeClient(c);
    return a;
  });
};

const totalTime = (_, args) => {
  return activities(null, args).then((results) => {
    const val = results.reduce((total, {tsStart, tsEnd}) => (
      total + (parseInt(tsEnd, 10) - parseInt(tsStart, 10))
    ), 0);
    // Not necessary to return a promise:
    // return new Promise((resolve, reject) => resolve(val));

    // Just return a correctly shaped object:
    return {
      total: val
    };
  })
};

const totalTimeForDays = (_, args) => {
  // should return an array of totals.
  const {howMany, isBillable, clientId} = args;
  const timestampArray = getBoundingTimestamps(howMany);


  return Promise.all(timestampArray.map(([tsStart, tsEnd]) => {
    return totalTime(null, {
      tsStart,
      tsEnd,
      // isBillable,
      clientId,
    });
  })).then((vals) => {
    return {
      totals: (vals.map((val) => val.total)).reverse()
    };
  })
};

const resolvers = {
  Query: {
    activity,
    activities,
    tag,
    tags,
    client,
    clients,
    totalTime,
    totalTimeForDays,
  },

  Mutation: {
    addActivity,
    addTag,
    addTagToActivity,
    removeTagFromActivity,
    addClient,
    addClientToActivity,
    removeClientFromActivity,
  },

  Activity: {
    tags(activity) {
      return activity.getTags();
    },
    clients(activity) {
      return activity.getClients();
    }
  },
  Tag: {
    activities(tag) {
      return tag.getActivities();
    }
  },
  Client: {
    activities(client) {
      return client.getActivities();
    }
  }
}

module.exports = resolvers;