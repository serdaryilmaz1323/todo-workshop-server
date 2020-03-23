import { logger } from './middleware/logger.middleware';
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { config } from './config';
import { connect } from 'mongoose';
import { HttpError } from './util/HttpError';
import routes from './router/routes';

const app = express();

// middleware
app.use(bodyParser.json());
app.use(logger);

// routes
app.use('/', routes);

// Hic bir route calismamissa 404 gonder
app.use((_: Request, __: Response, next: NextFunction) => {
  const error = new HttpError('Could not find this route', 404);
  next(error);
});

// Errors
app.use((error: HttpError, _: Request, res: Response, next: NextFunction) => {
  console.log('Error : ' + error.message);

  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ errorMessage: error.message || 'An unknown error occurred !' });
});

connect(config.mongoURL, {
  bufferCommands: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  autoIndex: false
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
