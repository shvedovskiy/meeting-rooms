import { gql } from 'apollo-boost';

export const GET_USERS_ROOMS = gql`
  {
    users {
      id
      login
      homeFloor
      avatarUrl
    }
    rooms {
      id
      title
      minCapacity
      maxCapacity
      floor
    }
  }
`;
