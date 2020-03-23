import cors, { CorsOptions } from 'cors';

const whitelist = ['http://localhost:3001'];
const corsOptions: CorsOptions = {
  origin: function(origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS:${origin}`));
    }
  },
};

export const corsCredential = cors(corsOptions);
