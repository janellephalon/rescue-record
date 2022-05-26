import gql from "graphql-tag";

export const GET_ME = gql`
  {
    me {
      _id
      username
      email
      savedPets {
        petId
        type
        image
        breed
        status
        link
      }
    }
  }
`;
