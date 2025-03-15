const express = require('express');
const app = express();

app.use(express.json());

let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: "2",
        name: "Joni N.",
        number: "085049830",
    },
    {
        id: "3",
        name: "John Smith",
        number: "84324242",
    },
    {
        id: "4",
        name: "Erkki Esimerkki",
        number: "04324242376",
    }
]

app.get('/', (request, response) => {
    response.send('<h1>API TOIMII :)</h1>')
})

app.get('/info', (request, response) => {
    response.send('Phonebook has info for ' + persons.length + ' people <p>' + Date() + '</p>')
})
app.get('/api/persons', (request, response) => {
    response.json(persons);
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find(person => person.id === id);
    if (person) {
        response.json(person);
    }   else {
        response.status(404).end();
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
})

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);