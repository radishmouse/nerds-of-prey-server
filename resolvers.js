const {
  Activity,
  Tag,
} = require('./connectors');


const activity = (_, args) => Activity.find({ where: args});
const activities = (_, args) => {
  if (args.tsStart && args.tsEnd) {
    return Activity.findAll({
      where: {
        tsStart: {
          $gte: args.tsStart
        },
        tsEnd: {
          $lte: args.tsEnd
        }
      }
    });
  }
  return Activity.findAll({});
};
const tag = (_, args) => Tag.find({ where: args});
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

const addTagToActivity = (_, args) => {
  return Promise.all([
    Activity.findById(args.activityId),
    Tag.findById(args.tagId),
  ]).then(([a, t]) => {
    a.addTag(t);
    return a;
  });

};
const removeTagFromActivity = (_, args) => {
  return Promise.all([
    Activity.findById(args.activityId),
    Tag.findById(args.tagId),
  ]).then(([a, t]) => {
    a.removeTag(t);
    return a;
  });
  
};

const resolvers = {
  Query: {
    activity,
    activities,
    tag,
    tags,
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