const typeDefinitions = `
  type Activity {
    id: Int!
    isBillable: Boolean!
    tsStart: String!
    tsEnd: String!
    tags: [Tag]
    clients: [Client]
  }

  type Tag {
    id: Int!
    name: String!
    activities: [Activity]
  }

  type Client {
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
    activities(isBillable: Boolean, tsStart: String, tsEnd: String, tagId: Int, clientId: Int): [Activity]
    tag(id: Int!): Tag
    tags: [Tag]
    client(id: Int!): Client
    clients: [Client]
    totalTime(tsStart: String, tsEnd: String, tagId: Int, clientId: Int, isBillable: Boolean): TimeTotal
    totalTimeForDays(howMany: Int, clientId: Int, isBillable: Boolean=true): TimeTotalArray
  }

  type Mutation {
    addActivity(
      tsStart: String!,
      tsEnd: String!,
      clientId: Int,
      tags: [Int],
    ): Activity!
    addTag(
      name: String!,
      activities: [Int]
    ): Tag!
    addClient(
      name: String!,
      activities: [Int]
    ): Client!
    addTagToActivity(tagId: Int!, activityId: Int!): Activity!
    addClientToActivity(clientId: Int!, activityId: Int!): Activity!
    removeTagFromActivity(tagId: Int!, activityId: Int!): Activity!
    removeClientFromActivity(clientId: Int!, activityId: Int!): Activity!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

module.exports = [typeDefinitions];