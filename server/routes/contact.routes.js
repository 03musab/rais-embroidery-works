const express = require("express");
const router = express.Router();
const supabase = require('../supabase');
const nodemailer = require('nodemailer');

// Create transporter outside the request handler to allow connection pooling
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  logger: true,
  debug: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please provide name, email, and message.' });
    }

    const { error } = await supabase
      .from('contacts')
      .insert([{ name, email, message }]);

    if (error) throw error;

    // Send response immediately to prevent waiting for email
    res.status(200).json({ message: 'Message received successfully!' });

    // Send email in background without awaiting
    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: '03.musab.1@gmail.com',
      subject: `New Contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      replyTo: email
    }).catch(err => console.error('Email sending failed:', err));
    
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Server Error' });
    }
  }
});

module.exports = router;
