import { useState, useEffect } from 'react';
import personService from "./services/persons";
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [term, setTerm] = useState('');
  const [notificationMessage, setNotificationMessage] = useState({ message: null, type: null });

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      })
      .catch(err => {
        console.log("Error", err);
      })
  }, [])

  const showNotification = (message, type) => {
    setNotificationMessage({ message, type })
    setTimeout(() => {
      setNotificationMessage({ message: null, type: null })
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault();

    const newPerson = {
      name: newName,
      number: newNumber,
      id: String(persons.length + 1),
    };

    const person = persons.find(p => p.name === newPerson.name);

    if (person) {
      const changedPerson = { ...person, number: newPerson.number };

      if (confirm(`${newPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
        personService
          .update(person.id, changedPerson)
          .then(returnedPerson => {
            showNotification(`Updated ${newPerson.name}.`, "success")
            setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson));
            setNewName('');
            setNewNumber('');
          })
          .catch(err => {
            showNotification(`Information of ${newPerson.name} has already been removed from server`, "error");
            console.log("Error", err);
          })
      } else {
        setNewName('');
        setNewNumber('');
      }

    } else {
      personService
        .create(newPerson)
        .then(returnedPerson => {
          showNotification(`Added ${newPerson.name}.`, "success");
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
        })
        .catch(err => {
          console.log("Error", err);
        })
    }
  }

  const deletePerson = (id) => {
    const person = persons.find(person => person.id === id);

    if (confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
        .then(removedPerson => {
          showNotification(`${removedPerson.name} has been deleted.`, "success")
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(err => {
          console.log("Error", err);
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleFilterChange = (event) => {
    setTerm(event.target.value);
  }


  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(term.toLowerCase()));

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage.message} type={notificationMessage.type} />
      <Filter term={term} handleFilterChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} deletePerson={deletePerson} />
    </div>
  )
}

export default App