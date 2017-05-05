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
    id: Int
    tsStart: String
    tsEnd: String
    tags: [Tag]
  }

  type Tag {
    id: Int
    name: String
    activities: [Activity]
  }

  type Query {
    activity(id: Int): Activity
    tag(id: Int): Tag
  }

  schema {
    query: Query
  }
`;

module.exports = [typeDefinitions];