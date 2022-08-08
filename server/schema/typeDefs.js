const { gql } = require('apollo-server-express');

const typeDefs = gql `
    type User {
        username: String
        email: String
        password: String
        tasks: [Task]
    }

    type Task {
        _id: ID
        title: String
        desc: String
        time: Int
        username: String
        path: String
    }

    type Auth {
        token: ID!
        user: User
    }

# Queries
    type Query {
        me: User
        user(username: String!): User
        users: [User]
        task(_id: ID!): [Task]
        taskchild(_id: ID!): [Task]
        tasks: [Task]
    }

# Mutations
    type Mutation {
        login(
            email: String!
            password: String!
            ): Auth
        createUser(
            username: String!
            email: String!
            password: String!
            ): Auth
        createTask(
            title: String!
            desc: String
            time: Int
            username: String!
            path: String!
            ): Task
        updateTime(
            _id: ID!
        ): Int
    }
`;

module.exports = typeDefs;