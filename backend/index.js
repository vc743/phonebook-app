const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

morgan.token("type", function (request, response) {
  return JSON.stringify(request.body);
});

app.use(cors());
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :type")
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  const person = persons.find((p) => p.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

const generateId = () => {
  return Math.floor(Math.random() * 30000) + 1;
};

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;
  const nameExists = persons.find((p) => p.name === name);

  if (!name || !number) {
    return response.status(400).json({
      error: `${!name ? "name" : "number"} is missing.`,
    });
  }

  if (nameExists) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }
  const person = {
    id: generateId(),
    name: name,
    number: number,
  };

  persons = persons.concat(person);

  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.get("/info", (request, response) => {
  const currentDate = new Date();
  response.send(
    `<p>Phonebook has info for ${persons.length} ${
      persons.length === 1 ? "person" : "people"
    }</p>
    <p>${currentDate}</p>`
  );
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
