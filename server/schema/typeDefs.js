const { gql } = require('apollo-server-express');

const typeDefs = gql `
    type User {
        _id: ID
        username: String
        email: String
        password: String
        tasks: [Task]
        friends: [User]
    }

    type Task {
        _id: ID
        title: String
        description: String
        time: Int
        totaltime: Int
        username: String
        path: String
        done: Boolean
    }

    type Auth {
        token: ID!
        user: User
    }

# Queries
    type Query {
        me: User
        medata(username: String!): [Task]
        user(username: String!): User
        users: [User]
        task(_id: ID!): [Task]
        tasks: [Task]
        children(_id: ID!): [Task]
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
        updateUser(_id: ID!, username: String, email: String, password: String): User
        createTask(
            title: String!
            description: String
            time: Int
            totaltime: Int
            username: String!
            path: String
            done: Boolean
            ): Task
        updateTask(
            _id: ID!
            title: String
            description: String
            time: Int
            totaltime: Int
            username: String
            path: String
            done: Boolean
            ): Task
        deleteTask(_id: ID!): Task
        updateTime(
            _id: ID!
        ): Task
    }
`;

module.exports = typeDefs;