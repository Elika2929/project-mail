// models/email.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Email სქემა
const emailSchema = new Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

// Email მოდელი
const Email = mongoose.model('Email', emailSchema);

module.exports = Email;
