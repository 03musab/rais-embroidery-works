const express = require("express");
const router = express.Router();
const supabase = require('../supabase');
const nodemailer = require('nodemailer');

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

    // Send Email Notification
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: '03.musab.1@gmail.com',
      subject: `New Contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      replyTo: email
    });

    res.status(200).json({ message: 'Message received successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
