const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.static('dist'))
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
morgan.token('body', function (req, res) { return JSON.stringify(req.body); });

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

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

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

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Name or number missing'
        });
    } else if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'Name must be unique'
        })
    }

    const person = {
        id: getRandomInt(50000).toString(),
        name: body.name,
        number: body.number.toString(),
    }
    persons = persons.concat(person);
    response.json(person);
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
console.log(morgan(':method :url :status :res[content-length] - :response-time ms :body'))