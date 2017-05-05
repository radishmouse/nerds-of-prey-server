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

const resolvers = {
  Query: {
    activity(_, args) {
      return Activity.find();
    }
  }
}

module.exports = resolvers;