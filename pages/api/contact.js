import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  console.log("API route called", req.body);
  if(req.method === "POST") {
    const { email, message } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    try {
      await transporter.sendMail({
        from: email,
        to: process.env.EMAIL_ADDRESS,
        subject: `New Message from ${email}`,
        text: message,
      });

      res.status(200).send('Message sent successfully');
    }
    catch (error) {
      console.error("Error sending message:", error);
      res.status(500).send(`Error sending message: ${error.message}`);
    }
  }
  else {
    res.status(404).send('Method not allowed');
  }
};