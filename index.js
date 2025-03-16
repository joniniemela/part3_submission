require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()
//Express
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
morgan.token('body', function (req) { return JSON.stringify(req.body) })
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Invalid id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json( { error: error.message } )
  }
  next(error)
}

app.get('/info', (request, response, next) => {
  Person.find({}).then((persons) => {
    response.send('Phonebook has info for ' + persons.length + ' people ' + Date())
  }).catch((err) => next(err))
})
app.get('/api/persons', (request, response, next) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  }).catch((err) => next(err))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then((person) => {
    if (person) {
      response.json(person)
    }   else {
      response.status(404).end()
    }
  })
    .catch((err) => next(err))

})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body
  if (!name || !number) {
    return response.status(400).json({
      error: 'Name or number missing'
    })
  }
  const person = new Person({
    name: name,
    number: number.toString(),
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch((err) => next(err))

})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id, {}).then(() => {
    response.status(204).end()
  }).catch (err => next(err))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)
app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
console.log(morgan(':method :url :status :res[content-length] - :response-time ms :body'))