// const resolveFunctions = {
//   RootQuery: {
//     president(_, { name }, ctx) {
//       const president = new ctx.constructor.President();
//       return president.findPresident(name);
//     },
//   },
// };

// module.exports = resolveFunctions;

const {
  Activity,
  Tag,
} = require('./connectors');


const activity = (_, args) => Activity.find({ where: args});
const activities = (_, args) => Activity.findAll({});
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

const addTag = (_, tag) => {
  return Tag.create(tag).then((t) => {
    if (tag.activities) {
      t.setActivities(tag.activities);
    }
    return Object.assign({}, tag, {id: t.id});
  })
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