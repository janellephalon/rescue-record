// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create our typeDefs
const typeDefs = gql`

  type User {
    _id: ID!
    username: String
    email: String
    petCount: Int
    savedPets: [Pet]
  }

  type Pet {
    petId: String!
    type: [String]
    breed: String
    status: String
    image: String
    link: String 
  }

  input PetInput {
    type: [String]
    breed: String
    status: String
    image: String
    link: String
}

  type Auth {
      token: ID!
      user: User
  }
  
  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    savePet(petData: PetInput): User
    removePet(petId: ID!): User
  }
`;

// export the typeDefs
module.exports = typeDefs;