const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

const makeANiceEmail = text => `
    <div style="border 1px solid blue; padding: 20px;">
        <h2>Hello There!</h2>
        <p>${text}</p>
        <p>GK App</p>
    </div>
`;

exports.transport = transport;
exports.makeANiceEmail = makeANiceEmail;
