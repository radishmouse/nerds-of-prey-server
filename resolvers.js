// const resolveFunctions = {
//   RootQuery: {
//     president(_, { name }, ctx) {
//       const president = new ctx.constructor.President();
//       return president.findPresident(name);
//     },
//   },
// };

// module.exports = resolveFunctions;

const resolvers = {
  Query: {
    activity(root, args) {
      return {
        id: 1,
        tsStart: 100,
        tsEnd: 200
      };
    }
  }
}

module.exports = resolvers;