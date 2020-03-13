const express = require('express');
const app = express();

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

app.get('/api/courses/:id', (req, res) => {
  console.log(typeof req.params.id);
  const course = courses.find((item) => item.id === parseInt(req.params.id));
  console.log(course);
  if (!course) return res.status(404).send(`The course id ${req.params.id} is not found.`);
  res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(3000, () => { console.log(`start on port ${port}...`); });
