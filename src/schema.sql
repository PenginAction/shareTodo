# ------------------------------------------------------
# THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
# ------------------------------------------------------

type Task {
  id: Int!
  name: String!
  dueDate: String!
  status: String!
  description: String
}

type Query {
  getTasks: [Task]!
}

type Mutation {
  createTask(name: String!, dueDate: String!, description: String): Task!
}