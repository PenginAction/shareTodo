# ------------------------------------------------------
# THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
# ------------------------------------------------------

type Task {
  id: Int!
  name: String!
  dueDate: String!
  status: String!
  description: String
  createdAt: DateTime!
  updatedAt: DateTime!
}

"""
A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format.
"""
scalar DateTime

type Query {
  getTasks: [Task]!
}

type Mutation {
  createTask(createTaskInput: CreateTaskInput!): Task!
}

input CreateTaskInput {
  name: String!
  dueDate: String!
  description: String
}