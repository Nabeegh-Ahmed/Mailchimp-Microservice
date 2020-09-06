const express = require('express');
const session = require('express-session');

const app = express();

app.use(session({
    secret: 'Its_not_the_devil_you_should_fear_its_yourself',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true }
}))

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', require('./routes/mailchimp.js'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
