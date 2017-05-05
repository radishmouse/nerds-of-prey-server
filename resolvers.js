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


const resolvers = {
  Query: {
    activity,
    activities,
    tag,
    tags
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