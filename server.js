// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const Email = require('./models/email');
const dotenv = require('dotenv');

// გარემოს ცვლადების ჩატვირთვა
dotenv.config();

// Express აპლიკაციის შექმნა
const app = express();
const port = 3000;

// Body-parser middleware
app.use(bodyParser.json());

// MongoDB-სთან დაკავშირბა
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Nodemailer ტრანსპორტის კონფიგურაცია
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// იმეილის გაგზავნის API
app.post('/send-email', (req, res) => {
    const { from, to, subject, body } = req.body;

    // Nodemailer-ის პარამეტრები
    const mailOptions = {
        from,
        to,
        subject,
        text: body
    };

    // იმეილის გაგზავნა
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }

        // იმეილის შენახვა MongoDB-ში
        const email = new Email({ from, to, subject, body });
        email.save()
            .then(() => res.status(200).send('Email sent and saved'))
            .catch(err => res.status(500).send(err.toString()));
    });
});

// იმეილების წაკითხვის API
app.get('/emails', (req, res) => {
    Email.find()
        .then(emails => res.status(200).json(emails))
        .catch(err => res.status(500).send(err.toString()));
});

// სერვერის გაშვება
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
