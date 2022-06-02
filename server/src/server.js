const http = require('http');
const app = require('./app');
const { mongoConnect } = require('./services/mongo');
const helmet = require('helmet');
require('dotenv').config();

mongoConnect();
app.use(helmet());
const server = http.createServer(app);
const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
