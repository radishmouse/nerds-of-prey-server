const typeDefinitions = `
  type Activity {
    id: Int!
    isBillable: Boolean!
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

  type TimeTotalArray {
    totals: [String]!
  }

  type Query {
    activity(id: Int!): Activity
    activities(isBillable: Boolean, tsStart: String, tsEnd: String, tagId: Int): [Activity]
    tag(id: Int!): Tag
    tags: [Tag]
    totalTime(tsStart: String, tsEnd: String, tagId: Int, isBillable: Boolean): TimeTotal
    totalTimeForDays(howMany: Int, isBillable: Boolean=true): TimeTotalArray
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