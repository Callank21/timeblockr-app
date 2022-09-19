import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
      tasks {
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
  }
`;

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      tasks {
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
  }
`;

export const QUERY_USERS = gql`
{
  users {
    _id
      username
      email
      tasks {
        _id
        title
        description
        time
        totaltime
        username
        path
        don
      }
  }
}
`;

export const QUERY_TASK = gql`
query task($id: ID!) {
  task (_id: $id){
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