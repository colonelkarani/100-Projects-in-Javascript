// Import dependencies
const express = require('express');               // Express web framework
const session = require('express-session');       // To manage user sessions (cookies)
const passport = require('passport');             // Passport authentication middleware
const LocalStrategy = require('passport-local').Strategy;  // Local username-password strategy
const bcrypt = require('bcryptjs');                // For password hashing
const mongoose = require('mongoose');              // MongoDB ODM for user data

// Connect to MongoDB (replace with your connection string)
mongoose.connect('mongodb://localhost:27017/passport_local_example', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error", err));

// Define User schema and model
const UserSchema = new mongoose.Schema({
  username: String,       // username field
  password: String        // password field (hashed)
});

// Method to compare input password with hashed password stored in DB
UserSchema.methods.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);

// Create express app
const app = express();

// Middleware to parse urlencoded bodies (from HTML forms)
app.use(express.urlencoded({ extended: false }));

// Configure session middleware — required for Passport to track login sessions
app.use(session({
  secret: 'yourSecretKey',    // session encryption key (put in env variable in production)
  resave: false,              // don't save session if unmodified
  saveUninitialized: false    // don't create session until something stored
}));

// Initialize Passport and restore authentication state, if any, from session
app.use(passport.initialize());
app.use(passport.session());

// Define Passport Local Strategy for username/password login
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    // Find user by username
    const user = await User.findOne({ username: username });
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' }); // not found user
    }
    // Check password validity
    const valid = await user.isValidPassword(password);
    if (!valid) {
      return done(null, false, { message: 'Incorrect password.' }); // invalid password
    }
    // Success: return user object
    return done(null, user);
  } catch (err) {
    // Error during DB call etc.
    return done(err);
  }
}));

// Serialize user ID to save in session cookie
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user by ID retrieved from session cookie
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Middleware to protect routes - ensure user is logged in
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');  // if not authenticated redirect to login
}

// Routes

// Show simple login form (GET /login)
app.get('/login', (req, res) => {
  res.send(`
    <h1>Login</h1>
    <form action="/login" method="post">
      Username: <input name="username" type="text" /><br/>
      Password: <input name="password" type="password" /><br/>
      <button type="submit">Log In</button>
    </form>
  `);
});

// Handle login (POST /login) via Passport middleware
app.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',    // redirect if login successful
  failureRedirect: '/login'          // redirect if login fails
}));

// Show registration form (GET /register)
app.get('/register', (req, res) => {
  res.send(`
    <h1>Register</h1>
    <form action="/register" method="post">
      Username: <input name="username" type="text" required/><br/>
      Password: <input name="password" type="password" required/><br/>
      <button type="submit">Register</button>
    </form>
  `);
});

// Handle registration (POST /register)
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Check if user exists already
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.send('User already exists. Please choose a different username.');
    }
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user and save to DB
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.redirect('/login');  // redirect to login page after registering
  } catch (err) {
    console.error(err);
    res.send('Error occurred during registration.');
  }
});

// Protected dashboard page, login required
app.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.send(`<h1>Dashboard</h1><p>Welcome, ${req.user.username}!</p><a href="/logout">Logout</a>`);
});

// Logout route to destroy session and logout
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/login');
  });
});

// Start Express server on port 3000
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
