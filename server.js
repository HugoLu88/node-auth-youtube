const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./model/user') // import the user
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const mongousr = "HugoLu88"
const mongopw = 'Ilovemongo1'
const mongourl = 'mongodb://localhost:27017/login-db'

const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'
const SERVER = 9999
mongoose.connect(mongourl ,{ //where loginappdb is the name of the databse. 27017 is the mongoose default
  	useNewUrlParser: true, // parameters
  	useUnifiedTopology: true, // parameters
  	useCreateIndex: true // parameters
  })

const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', mongourl)
})

db.on('error', err => {
  console.error('connection error:', err)
})

const app = express()

app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json()) // middleware to parse a json



app.post('/api/change-password', async (req, res) => {
	const { token, newpassword: plainTextPassword } = req.body

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	try {
		const user = jwt.verify(token, JWT_SECRET)

		const _id = user.id

		const password = await bcrypt.hash(plainTextPassword, 10)

		await User.updateOne(
			{ _id },
			{
				$set: { password }
			}
		)
		res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: ';))' })
	}
})


app.post('/api/login', async (req, res) => {
	const { username, password } = req.body
	const user = await User.findOne({ username }).lean()

	if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}

	if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful

		const token = jwt.sign(
			{
				id: user._id,
				username: user.username
			},
			JWT_SECRET
		)

		return res.json({ status: 'ok', data: token })
	}

	res.json({ status: 'error', error: 'Invalid username/password' })
})


app.post('/api/register', async(req, res) => { //request response
	console.log(req.body)
	const {username, password: plaintextpword} = req.body // this is destructuring; taking usernmae and password from the req.body


	if (!username || typeof username  !== 'string'){
		return res.json({status:"error", error: 'invalid format'})
	}
	if (!plaintextpword || typeof plaintextpword  !== 'string'){
		return res.json({status:"error", error: 'invalid format of pw'})
	}
	if (plaintextpword.length<10){
		return res.json({status:"error", error: 'pw too short'})
	}
	
	//console.log(await bcrypt.hash(plaintextpword,10))
	const password = await bcrypt.hash(plaintextpword,10)
	try{
		const response = await User.create({
			username,
			password
		})
		console.log("user created")
		console.log(response)

	} catch(error) {
		console.log(error.message)
		if (error.code === 11000) {
			console.log("Duplicate key")
			return res.json({status:"error", error:"duplicate username"})
		}
		throw error
		
	}

	
	res.json({status:"OK"})

})



app.listen(SERVER, () => {
	console.log('Server up at ',SERVER )
})
