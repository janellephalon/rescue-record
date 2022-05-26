import React, { useState, useEffect } from "react";
import {
  Jumbotron,
  Container,
  Col,
  Form,
  Button,
  Card,
  CardColumns,
} from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { SAVE_PET } from "../utils/mutations";
import Auth from "../utils/auth";
import { getSavedPetsIds, savePetIds } from "../utils/localStorage";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const SearchPets = () => {
  // create state for holding returned google api data
  const [searchedPets, setSearchedPets] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState("");

  // create state to hold saved bookId values
  const [savedPetsIds, setSavedPetsIds] = useState(getSavedPetsIds());
  const [savePet, { error }] = useMutation(SAVE_PET);

  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  useEffect(() => {
    return () => savePetIds (savedPetsIds);
  });

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await fetch(
        `https://api.petfinder.com/v2`
      );

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const { items } = await response.json();

      const petData = items.map((pet) => ({
        petId: pet.id,
        type: pet.petInfo.type || ["No pet to display"],
        breed: pet.petInfo.breed,
        petStatus: pet.petInfo.status,
        image: pet.petInfo.imageLinks?.thumbnail || "",
      }));

      setSearchedPets(petData);
      setSearchInput("");
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a book to our database
  const handleSavePet = async (petId) => {
    // find the book in `searchedBooks` state by the matching id
    const petToSave = searchedPets.find((pet) => pet.petId === petId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await savePet({
        variables: { petData: { ...petToSave } },
      });
      console.log(savedPetsIds);
      setSavedPetsIds([...savedPetsIds, petToSave.petId]);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Jumbotron fluid className="text-light searchBackground split left">
        <Container className="">
        <FontAwesomeIcon icon="fa-solid fa-paw" />
          <h1 className="searchTitle">
            Where Pets Find Their People</h1>
            <p>
            
            </p>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  className="inputText"
                  placeholder="Search"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" className="searchButton" size="lg">
                  Enter
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <div className="split right"></div>
      </Container>

      <Container className="petBody">
        <h2>
          {searchedPets.length
            ? `Viewing ${searchedPets.length} results:`
            : "Find your next friend"}
        </h2>
        <CardColumns>
          {searchedPets.map((pet) => {
            return (
              <Card key={pet.petId} border="dark">
                {pet.image ? (
                  <Card.Img
                    src={pet.image}
                    alt={`Your next ${pet.type}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{pet.type}</Card.Title>
                  <p className="small">Breed: {pet.breed}</p>
                  <Card.Text>{pet.status}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedPetsIds?.some(
                        (savedId) => savedId === pet.petId
                      )}
                      className="btn-block btn-info"
                      onClick={() => handleSavePet(pet.petId)}
                    >
                      {savedPetsIds?.some((savedId) => savedId === pet.petId)
                        ? "Pet Already Saved!"
                        : "Save This Pet!"}
                    </Button>
                  )}
                  {error && (
                    <span className="ml-2">Something went wrong...</span>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>

      <Container>
        <footer>
        <h3>React Portfolio</h3>
    <br></br>
    <h4>Janelle Phalon</h4>
        </footer>
      </Container>
    </>
  );
};

export default SearchPets;
