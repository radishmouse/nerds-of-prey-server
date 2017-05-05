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

  type TimeTotal {
    total: String!
  }

  type Query {
    activity(id: Int!): Activity
    activities(tsStart: String, tsEnd: String, tagId: Int): [Activity]
    tag(id: Int!): Tag
    tags: [Tag]
    totalTimeForTag(tsStart: String, tsEnd: String, tagId: Int): TimeTotal
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
    addTagToActivity(tagId: Int!, activityId: Int!): Activity!
    removeTagFromActivity(tagId: Int!, activityId: Int!): Activity!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

module.exports = [typeDefinitions];