import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation createUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
      }
    }
  }
`;

export const CREATE_TASK = gql`
  mutation createTask(
    $title: String!
    $description: String
    $time: Int
    $totaltime: Int
    $username: String!
    $path: String
    $done: Boolean
  ) {
    createTask(
      title: $title
      description: $description
      time: $time
      totaltime: $totaltime
      username: $username
      path: $path
      done: $done
    ) {
      _id
      title
      description
      time
      totaltime
      username
      path
      done
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation updateTask(
    $id: ID!
    $title: String!
    $description: String
    $time: Int
    $totaltime: Int
    $username: String!
    $path: String
    $done: Boolean
  ) {
    updateTask(
      _id: $id
      title: $title
      description: $description
      time: $time
      totaltime: $totaltime
      username: $username
      path: $path
      done: $done
    ) {
      _id
      title
      description
      time
      totaltime
      username
      path
      done
    }
  }
`;

export const DELETE_TASK = gql`
  mutation deleteTask($id: ID!) {
    deleteTask(_id: $id) {
      _id
      title
      description
      time
      totaltime
      username
      path
      done
    }
  }
`;

export const CREATE_CALENDARITEM = gql`
  mutation createCalendarItem(
    $calendarId: String!
    $title: String! 
    $category: String! 
    $start: String!
    $end: String!
    $state: String!
  ) {
    createCalendarItem(
      calendarId: $calendarId
      title: $title
      category: $category
      start: $start
      end: $end
      state: $state
    ) {
      calendarId
      title
      category
      start
      end
      state
    }
  }
`;

export const UPDATE_CALENDARITEM = gql`
  mutation updateCalendarItem(
    $id: ID!
    $calendarId: String!
    $title: String!
    $category: String!
    $start: String!
    $end: String!
    $state: String!
  ) {
    updateTask(
      _id: $id
      calendarId: $calendarId
      title: $title
      category: $category
      start: $start
      end: $end
      state: $state
    ) {
      _id
      calendarId
      title
      category
      start
      end
      state
    }
  }
`;

export const DELETE_CALENDARITEM = gql`
  mutation deleteCalendarItem($id: ID!) {
    deleteCalendarItem(_id: $id) {
      _id
      calendarId
      title
      category
      start
      end
      state
    }
  }
`;