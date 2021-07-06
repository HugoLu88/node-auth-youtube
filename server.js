const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./model/user') // import the user
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'
const SERVER = 8080
mongoose.connect('mongodb://localhost:27012/login-app-db', { //where loginappdb is the name of the databse. 27017 is the mongoose default
 	useNewUrlParser: true, // parameters
 	useUnifiedTopology: true, // parameters
 	useCreateIndex: true // parameters
 })

const app = express()

app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json()) // middleware to parse a json

app.post('/api/register', async(req, res) => { //request response
	console.log(req.body)
	res.json({status:"OK"})

})








app.listen(SERVER, () => {
	console.log('Server up at ',SERVER )
})
