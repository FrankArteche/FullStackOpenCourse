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
      {persons.map((person) => {
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

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState({ name: "", number: "" });
  const [inputSearch, setInputSearch] = useState("");

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }, []);

  const addPerson = (e) => {
    e.preventDefault();
    const personObject = {
      name: newName.name,
      number: newName.number,
    };

    let canAddPerson = persons.find((item) => {
      return !areTheseObjectsEqual(item, personObject);
    });

    if (!canAddPerson) {
      alert(`${newName.name} is already added to phonebook`);
      return;
    }

    personService.create(personObject)
      .then((response) => {
        setPersons(persons.concat(response.data));
      });

    setNewName({ name: "", number: "" });
  };

  function areTheseObjectsEqual(first, second) {
    const al = Object.getOwnPropertyNames(first);
    const bl = Object.getOwnPropertyNames(second);

    // Check if the two list of keys are the same
    // length. If they are not, we know the objects
    // are not equal.
    if (al.length !== bl.length) return false;

    // Check that all keys from both objects match
    // are present on both objects.
    const hasAllKeys = al.every((value) => !!bl.find((v) => v === value));

    // If not all the keys match, we know the
    // objects are not equal.
    if (!hasAllKeys) return false;

    // We can now check that the value of each
    // key matches its corresponding key in the
    // other object.
    for (const key of al) if (first[key] !== second[key]) return false;

    // If the object hasn't return yet, at this
    // point we know that the objects are the
    // same
    return true;
  }

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
    
    if (window.confirm(`Do you really want to delete ${personToDelete.name}?`)) {
      personService.deletePerson(personToDelete.id)
    .then(response => {
      setPersons(persons.filter(person => person.id !== personToDelete.id))
    })
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <SearchField handleSearch={handleSearch} inputSearch={inputSearch} />
      <h2>Add a new phone</h2>
      <Form
        handleInputChange={handleInputChange}
        addPerson={addPerson}
        newName={newName}
      />
      <Persons persons={persons} handleDeletePerson={handleDeletePerson}/>
    </div>
  );
};

export default App;
