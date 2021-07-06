const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true }
	},
	{ collection: 'users' }
) // this simply specifies the nature of the Mongo DB

const model = mongoose.model('UserSchema', UserSchema)

module.exports = model
