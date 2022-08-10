const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const apiRoutes = require('./routes/apiRoutes');

// root Directory path
const rootDir = require('./utils/path');

//------------------------------------------------------------------------------

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

// parse the request's body to use as 'req.x'
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// define static-public directory for server
app.use(express.static(path.join(__dirname, 'public')));

// 'localhost:3000/api...'
app.use('/api', apiRoutes);

app.use('/', (req, res, next) => {
  console.log('Có request vào Server.');
  res.status(404).sendFile(path.join(rootDir, 'views', '404.html'));
});

app.listen(8000);
