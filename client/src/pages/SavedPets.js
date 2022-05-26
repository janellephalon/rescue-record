import React from "react";
import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button,
} from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import { REMOVE_PET } from "../utils/mutations";
import { removePetId } from "../utils/localStorage";
import Auth from "../utils/auth";

const SavedPets = () => {
  const { loading, data } = useQuery(GET_ME);
  const [removePet, { error }] = useMutation(REMOVE_PET);

  const userData = data?.me || {};

  // create function that accepts the book's _id value as param and deletes the book from the database
  const handleDeletePet = async (petId) => {
    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removePet({
        variables: { petId },
      });

      // upon success, remove book's id from localStorage
      removePetId(petId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className="savedPetsBody">
        <Container>
          <h1>{userData.username}'s saved rescue pets</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedPets?.length
            ? `Viewing ${userData.savedPets.length} saved ${
                userData.savedPets.length === 1 ? "pet" : "pets"
              }:`
            : "You have no saved pets!"}
        </h2>
        <CardColumns>
          {userData.savedPets?.map((pet) => {
            return (
              <Card key={pet.Id} border="dark">
                {pet.image ? (
                  <Card.Img
                    src={pet.image}
                    alt={` ${pet.type}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{pet.type}</Card.Title>
                  <p className="small">Breed: {pet.breed}</p>
                  <Card.Text>{pet.status}</Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeletePet(pet.petId)}
                  >
                    Remove this Friend!
                  </Button>
                  {error && (
                    <span className="ml-2">Something went wrong...</span>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedPets;
