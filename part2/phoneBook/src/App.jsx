import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-1234567" },
  ]);
  const [newName, setNewName] = useState({ name: "", number: "" });

  const addPerson = (e) => {
    e.preventDefault();
    const personObject = {
      name: newName.name,
      number: newName.number,
    };

    let canAddPerson = persons.find((item) => {
      return areTheseObjectsEqual(item, personObject);
    });

    if (canAddPerson) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    setPersons(persons.concat(personObject));
    setNewName("");
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

  return (
    <div>
      <h2>Phonebook</h2>
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
      <h2>Numbers</h2>
      {persons.map((person) => {
        return (
          <>
            <div>
              <h4>{person.name} {person.number}</h4>
            </div>
          </>
        );
      })}
    </div>
  );
};

export default App;