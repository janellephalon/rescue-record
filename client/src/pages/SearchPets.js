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
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const SearchPets = () => {
  const [searchedPets, setSearchedPets] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [savedPetsIds, setSavedPetsIds] = useState(getSavedPetsIds());
  const [savePet, { error }] = useMutation(SAVE_PET);


  useEffect(() => {
    return () => savePetIds (savedPetsIds);
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await fetch(
        `
        curl -H "grant_type=client_credentials&client_id=mF9caukrfnIetPc2CtiAh2dFIXVoY615NuJU5jKNtwfUT2t1CZ&client_secret=wAzj5j3PWJpybpCtfqobIVMQA3335A6egAucYxcJ" https://api.petfinder.com/v2/animals`
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
        {/* <FontAwesomeIcon icon="fa-solid fa-paw" /> */}
          <h1 className="searchTitle">
            Helping Pets Find Their People</h1>
            <p className="paragraphText">
             Seach through thousands of shelter animals in need of furever homes. 
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
          <div>
      
          <footer>
          <h3>Rescue Pets, Rescuing People</h3>
          <h5>Group 6</h5>
        </footer>
        </div>

        </Container>
      </Jumbotron>

      
      <Container className="split right">
        <h2>
          {searchedPets.length
            ? `Viewing ${searchedPets.length} results:`
            : ""}
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
    </>
  );
};

export default SearchPets;
