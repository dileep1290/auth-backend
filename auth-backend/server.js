const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 5000;

// Middleware for handling POST requests to /login
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom route to handle login
server.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = router.db.get('users').value();
  
  // Check if the user exists in the database
  const user = users.find(user => user.email === email && user.password === password);
  
  if (user) {
    res.status(200).json({ message: 'Login successful', user });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

// Custom route to handle sign-up
server.post('/signup', (req, res) => {
  const { email, password } = req.body;
  const users = router.db.get('users').value();
  
  // Check if the email is already in use
  const userExists = users.find(user => user.email === email);
  
  if (userExists) {
    res.status(409).json({ message: 'User already exists' });
  } else {
    // Add the new user to the database
    const newUser = { email, password };
    router.db.get('users').push(newUser).write();
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  }
});

server.use(router);
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
