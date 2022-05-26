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

// export const LeftFooter = gql`
//   height: 100px;
//   background-color: #f8f1e7;
//   display: flex;
//   flex-direction: column;
//   align-items: flex-start;
//   justify-content: center;
//   padding: 0 20px;

//   & > p {
//     margin: 0;
//     font-size: 18px;
//     line-height: 2rem;
//     font-weight: 700;
//   }

//   & > small {
//     font-size: 12px;
//   }
// `;
