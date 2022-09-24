const { gql } = require('apollo-server-express');

const typeDefs = gql `
    type User {
        _id: ID
        username: String
        email: String
        password: String
        tasks: [Task]
        calendaritems: [CalendarItem]
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

    type CalendarItem {
        _id: ID
        calendarId: String
        title: String
        category: String
        start: String
        end: String
        state: String
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
        calendaritem(_id: ID!): CalendarItem
        calendaritems: [CalendarItem]
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
        createCalendarItem(
            calendarId: String!
            title: String!
            category: String!
            start: String!
            end: String!
            state: String!
            ): CalendarItem
        updateCalendarItem(
            _id: ID!
            calendarId: String!
            title: String!
            category: String!
            start: String!
            end: String!
            state: String!
            ): CalendarItem
        deleteCalendarItem(_id: ID!): CalendarItem
    }
`;

module.exports = typeDefs;