export const getSavedPetsIds = () => {
  const savedPetsIds = localStorage.getItem("saved_pets")
    ? JSON.parse(localStorage.getItem("saved_pets"))
    : [];

  return savedPetsIds;
};

export const savePetIds = (petIdArr) => {
  if (petIdArr.length) {
    localStorage.setItem("saved_pets", JSON.stringify(petIdArr));
  } else {
    localStorage.removeItem("saved_pets");
  }
};

export const removePetId = (petId) => {
  const savedPetsIds = localStorage.getItem("saved_pets")
    ? JSON.parse(localStorage.getItem("saved_pets"))
    : null;

  if (!savedPetsIds) {
    return false;
  }

  const updatedSavedPetsIds = savedPetsIds?.filter(
    (savedPetsId) => savedPetsId !== petId
  );
  localStorage.setItem("saved_pets", JSON.stringify(updatedSavedPetsIds));

  return true;
};
