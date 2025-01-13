import { useState, useEffect } from "react";
import personService from "./services/persons";

const SearchField = ({ handleSearch, inputSearch }) => {
  return (
    <div>
      filter shown with <input onChange={handleSearch} value={inputSearch} />
    </div>
  );
};

const Form = ({ addPerson, newName, handleInputChange }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name:{" "}
        <input
          value={newName.name}
          onChange={(e) => handleInputChange(e, "name")}
        />
      </div>
      <div>
        number:{" "}
        <input
          value={newName.number}
          onChange={(e) => handleInputChange(e, "number")}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ persons, handleDeletePerson }) => {
  return (
    <>
      <h2>Numbers</h2>
      {persons?.map((person) => {
        return (
          <div key={person.id}>
            <h4>
              {person.name} {person.number}
            </h4>
            <button onClick={(e) => handleDeletePerson(person)}>delete</button>
          </div>
        );
      })}
    </>
  );
};

const Notification = ({ message, showMessage }) => {
  if (message === null) {
    return null;
  }

  return (
    <>
      {showMessage && message.type == "success" && <div className="successMessage">{message.content}</div>}
      {showMessage && message.type == "error" && <div className="errorMessage">{message.content}</div>}
    </>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState({ name: "", number: "" });
  const [inputSearch, setInputSearch] = useState("");
  const [message, setMessage] = useState({
    content: "",
    type: "",
  });
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const addPerson = (e) => {
    e.preventDefault();
    const personObject = {
      name: newName.name,
      number: newName.number,
    };

    const existingPerson = persons.find(
      (item) => item.name === personObject.name
    );

    if (existingPerson) {
      handleUpdatePerson(existingPerson);
      return;
    }

    personService.create(personObject).then((response) => {
      setPersons(persons.concat(response));
      setMessage({
        ...message,
        content: `Added ${response.name}`,
        type: "success",
      });
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    }).catch((error) => {
      console.log(error.response.data.error)
      setMessage({
        ...message,
        content: `Validations failed`,
        type: "error",
      });
    })

    setNewName({ name: "", number: "" });
  };

  const handleInputChange = (e, input) => {
    console.log(e, input);

    setNewName({ ...newName, [input]: e.target.value });
  };

  const handleSearch = (e) => {
    setInputSearch(e.target.value);

    const filteredPersons = persons.filter((person) => {
      return person.name.toLowerCase().includes(e.target.value.toLowerCase());
    });

    setPersons(filteredPersons);
  };

  const handleDeletePerson = (personToDelete) => {
    if (
      window.confirm(`Do you really want to delete ${personToDelete.name}?`)
    ) {
      personService
        .deletePerson(personToDelete.id)
        .then((response) => {
          setPersons(
            persons.filter((person) => person.id !== personToDelete.id)
          );
        })
        .catch((error) => {
          setMessage({
            ...message,
            content: `Information of ${personToDelete.name} has already been removed from the server`,
            type: "error",
          });
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false);
          }, 3000);
        });
    }
  };

  const handleUpdatePerson = (personToUpdate) => {
    if (
      window.confirm(
        `${personToUpdate.name} is already added to phonebook, replace the old number with a new one?`
      )
    ) {
      personService
        .update(personToUpdate.id, {
          ...personToUpdate,
          number: newName.number,
        })
        .then((response) => {
          setPersons(
            persons.map((person) =>
              person.id !== personToUpdate.id ? person : response
            )
          );
          setMessage({
            ...message,
            content: `Updated ${response.name}`,
            type: "success",
          });
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false);
          }, 3000);
        });
    }
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} showMessage={showMessage} />

      <SearchField handleSearch={handleSearch} inputSearch={inputSearch} />
      <h1>Add a new phone</h1>
      <Form
        handleInputChange={handleInputChange}
        addPerson={addPerson}
        newName={newName}
      />
      <Persons persons={persons} handleDeletePerson={handleDeletePerson} />
    </div>
  );
};

export default App;
