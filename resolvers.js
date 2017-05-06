const {
  Activity,
  Tag,
} = require('./connectors');

const {getBoundingTimestamps} = require('./utils');

const activity = (_, args) => Activity.find({ where: args });

const activities = (_, {
  tsStart,
  tsEnd,
  tagId,
  isBillable,
}) => {
  let whereClause = {
    where: {
      isBillable,
    }
  };

  if (tsStart && tsEnd) {
    whereClause = Object.assign({}, whereClause, {
      where: {
        tsStart: {
          $gte: tsStart
        },
        tsEnd: {
          $lte: tsEnd
        }
      }
    });
  }
  if (tagId) {
    whereClause = Object.assign({}, whereClause, {
      include: [{
        model: Tag,
        where: {
          id: tagId
        }
      }]
    });
  }

  return Activity.findAll(whereClause);
};

const tag = (_, args) => Tag.find({ where: args });

const tags = (_, args) => Tag.findAll({});

const addActivity = (_, activity) => {
  return Activity.create(activity).then((a) => {
    if (activity.tags) {
      a.setTags(activity.tags);
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
  const {howMany} = args;
  const timestampArray = getBoundingTimestamps(howMany);

  return Promise.all(timestampArray.map(([tsStart, tsEnd]) => {
    return totalTime(null, {
      tsStart,
      tsEnd
    });
  })).then((vals) => {
    return {
      totals: vals.map((val) => val.total)
    };
  })
};

const resolvers = {
  Query: {
    activity,
    activities,
    tag,
    tags,
    totalTime,
    totalTimeForDays,
  },

  Mutation: {
    addActivity,
    addTag,
    addTagToActivity,
    removeTagFromActivity,
  },

  Activity: {
    tags(activity) {
      return activity.getTags();
    }
  },
  Tag: {
    activities(tag) {
      return tag.getActivities();
    }
  }
}

module.exports = resolvers;