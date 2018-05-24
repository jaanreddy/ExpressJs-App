const express = require("express");
const Joi = require("joi");
const bodyParser = require("body-parser");
const app = express();

const courses = [
    {id:1, name:'NodeJs'},
    {id:2, name:'ExpressJs'},
    {id:3, name:'MongoDB'}
]

//Use bodyparser middleware for read data from body
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Welcome to ExpressJS'));

//Get all the courses
app.get('/api/courses', (req, res) => res.send(courses));

app.get('/api/courses/:id', (req, res) => {
    var course = courses.find(c=>c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('Course not found...');
    res.send(course);
}); 

//path params
//app.get('/api/getUserDetails/:dd/:mm/:yyyy', (req, res) => res.send(req.params));

//query params
app.get('/api/getUserDetails/:dd/:mm/:yyyy', (req, res) => res.send(req.query));

//Add course
app.post('/api/courses', (req, res) => {
    //validate by using Joi
    //const result = validateCourse(req.body.name);
    //Object destructing
    const { error } = validateCourse(req.body); // result.error

    /*if(!req.body.name && req.body.name.length<3){
        //400 Bad request
        res.status(400).send('Name is required and should be min 3 chars');
        return;
    }*/

    if(error) return res.status(400).send(error).details[0].message;
       
    var newCourse = {
        id: courses.length+1,
        name: req.body.name
    }
    courses.push(newCourse)
    res.send(courses);
});

//Update the course
app.put('/api/courses/:id', (req, res)=>{
    //Look up the course
    var course = courses.find(c=>c.id === parseInt(req.params.id));
    //If not existing, return 404
    if(!course) return res.status(404).send('Course not found...');

    //Validate
   //const result = validateCourse(req.body.name);
    //Object destructing
    const { error } = validateCourse(req.body); // result.error
     //If invalid, return 400 - Bad request
    if(error) return res.status(400).send(error.details[0].message);

    //Update the course
    course.name = req.body.name
    //Return updated course
    res.send(course);
});

//Delete the course
app.delete('/api/courses/:id', (req, res) =>{
     //Look up the course
     var course = courses.find(c=>c.id === parseInt(req.params.id));

     //If not existing, return 404
     if(!course) return res.status(404).send('Course not found...');

    //Delete
    var index = courses.indexOf(course);
    courses.splice(index,1);

    //Return the same course
    res.send(course);
});

//validate course
function validateCourse( course ){
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}

//read port from environment variable as PORT
const port = process.env.PORT || 3000;
app.listen(port,() => console.log(`Listening on port ${port}....`));