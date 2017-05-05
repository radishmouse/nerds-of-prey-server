// const typeDefinitions = `
// type President {
//   name: String
//   party: String
//   term: String
// }
// type RootQuery {
//   president(name: String, party: String, term: String): President
// }
// schema {
//   query: RootQuery
// }
// `;

// module.exports = [typeDefinitions];

const typeDefinitions = `
  type Activity {
    id: Int!
    tsStart: String!
    tsEnd: String!
    tags: [Tag]
  }

  type Tag {
    id: Int!
    name: String!
    activities: [Activity]
  }

  type Query {
    activities: [Activity]
    activity(id: Int!): Activity
    tags: [Tag]
    tag(id: Int!): Tag
  }

  type Mutation {
    addActivity(
      tsStart: String!,
      tsEnd: String!,
      tags: [Int]
    ): Activity!
    addTag(
      name: String!,
      activities: [Int]
    ): Tag!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

module.exports = [typeDefinitions];