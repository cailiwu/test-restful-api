const express = require('express');
const Joi = require('joi');
// see https://github.com/hapijs/joi/blob/v14.3.1/API.md#validatevalue-schema-options-callback
const logger = require('./logger');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
// Configuration
console.log(`App name is ${config.get('name')}`);
console.log(`Mail serve is ${config.get('mail.host')}`);
const app = express();
app.use(express.json()); // req.body
// use body x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); // Middleware function is parsing incoming request url encoded payloads.
app.use(express.static('static')); // static assests
// Create customer logger middleware
app.use(logger);
// Create Third party middelware https://expressjs.com/en/resources/middleware.html
app.use(helmet());

console.log(`ENV:${app.get('env')}`);
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  console.log('Morgan enabled...');
}

const courses = [
  {
    id: 1,
    name: 'Chinese'
  },
  {
    id: 2,
    name: 'English'
  },
  {
    id: 3,
    name: 'History'
  }
];
// GET all courses
app.get('/api/course', (req, res) => {
  res.send(courses);
});
// Get courses by id
app.get('/api/courses/:id', (req, res) => {
  console.log(typeof req.params.id);
  const course = courses.find((item) => item.id === parseInt(req.params.id));
  console.log(course);
  if (!course) return res.status(404).send(`The course id ${req.params.id} is not found.`);
  res.send(course);
});

// Put courses by id
app.put('/api/courses/:id', (req, res) => {
  // console.log(req);
  const courseId = req.params.id;
  const course = courses.find((item) => item.id === parseInt(courseId));
  if (!course) return res.status(400).send('The course ID is not found.');

  const { error } = validateCourse(req.body);
  console.log(error);
  if (error) return res.status(400).send(error.details[0].message);

  course.name = req.body.name;
  res.send(course);
});
// Delete course by id
app.delete('/api/courses/:id', (req, res) => {
  const courseId = req.params.id;
  const course = courses.find((item) => item.id === parseInt(courseId));
  if (!course) return res.status(400).send('The course ID is not found.');

  const courseIndex = courses.indexOf(course);
  courses.splice(courseIndex, 1);
  res.send(course);
});

// Post course
app.post('/api/courses', (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
});

function validateCourse (course) {
  const schema = {
    name: Joi.string().min(3).required()
  };
  return Joi.validate(course, schema);
}
const port = process.env.PORT || 3000;
app.listen(3000, () => { console.log(`start on port ${port}...`); });
