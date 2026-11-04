// Pet Care Journal System
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');

const homeRoutes = require('./routes/homeRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const petRoutes = require('./routes/petRoutes');
const journalRoutes = require('./routes/journalRoutes');

const app = express();
const PORT = 3000;

app.use(flash());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'secret123',
  resave: false,
  saveUninitialized: true
}));

app.use(homeRoutes);
app.use(authRoutes);
app.use(adminRoutes);
app.use(petRoutes);
app.use(journalRoutes);

app.listen(PORT, () => console.log(`App running on http://localhost:${PORT}`));
