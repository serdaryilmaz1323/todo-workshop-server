import express from 'express';
import bodyParser from 'body-parser';
import { config } from './config';
import { connect } from 'mongoose';
import router from './routes';
import { logger } from './middlewares/logger.middleware';
import { handleError, handleRouteError } from './middlewares/error.middleware';
import { corsCredential } from './middlewares/cors.middleware';

const app = express();

//cors configuration
app.use(corsCredential);

// middleware
app.use(bodyParser.json());
app.use(logger);

// routes
app.use(router);

// Errors
app.use(handleRouteError);
app.use(handleError);

connect(config.mongoURL, {
  bufferCommands: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  autoIndex: false,
})
  .then(() => {
    const PORT = config.port || 3001;
    app.listen(PORT, err => {
      if (err) return console.error(err);
      return console.log(`Server is listening on ${PORT}`);
    });
  })
  .catch(err => {
    console.log('Database connection failed:', err);
  });
