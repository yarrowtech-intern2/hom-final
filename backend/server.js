// import 'dotenv/config';
// import express from 'express';
// import helmet from 'helmet';
// import cors from 'cors';
// import morgan from 'morgan';
// import rateLimit from 'express-rate-limit';
// import { connectDB } from './config/db.js';
// import contactRoutes from './routes/contact.routes.js';
// import emailRoutes from './routes/email.routes.js';

// const app = express();

// // Security & parsing
// app.use(helmet({ crossOriginResourcePolicy: false }));
// app.use(express.json({ limit: '1mb' }));
// app.use(express.urlencoded({ extended: false }));
// app.use('/api/email', emailRoutes);

// // CORS — allow your frontend
// app.use(
//   cors({
//     origin: process.env.CLIENT_ORIGIN?.split(',') || '*',
//     credentials: true
//   })
// );

// // Logging
// if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// // Global rate limit (defense-in-depth)
// app.use(
//   rateLimit({
//     windowMs: 60 * 1000,
//     max: 120,
//     standardHeaders: true,
//     legacyHeaders: false
//   })
// );

// // Routes
// app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date() }));
// app.use('/api/contact', contactRoutes);

// // Errors (last)
// import { notFound, errorHandler } from './middleware/errorHandler.js';
// app.use(notFound);
// app.use(errorHandler);

// // Start
// const port = process.env.PORT || 5000;
// connectDB()
//   .then(() => {
//     app.listen(port, () => console.log(`API running on :${port}`));
//   })
//   .catch((e) => {
//     console.error('DB connection failed:', e);
//     process.exit(1);
//   });
















// server.js
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import contactRoutes from './routes/contact.routes.js';
import emailRoutes from './routes/email.routes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();



// 🛡 Security
app.use(helmet({ crossOriginResourcePolicy: false }));

// ✅ CORS — must come before routes
// app.use(
//   cors({
//     // origin: process.env.CLIENT_ORIGIN?.split(',') || ['http://localhost:5173', "https://house-of-musa-gixs.onrender.com"],
//     origin: process.env.CLIENT_ORIGIN
//   ? process.env.CLIENT_ORIGIN.split(',')
//   : [
//      'http://localhost:5173',
//      'https://house-of-musa-gixs.onrender.com'
//     ],

//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );



app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        'http://localhost:5173',
        'https://house-of-musa-gixs.onrender.com',
      ];

      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('❌ Blocked by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);



// app.options("*", cors());
// app.options(cors()); 
// app.options('/*', cors());




// Parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

// Logging
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// Rate limit
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// ✅ Routes
app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date() }));
app.use('/api/email', emailRoutes);
app.use('/api/contact', contactRoutes);

// 🧱 Error handling (always last)
app.use(notFound);
app.use(errorHandler);

// Start
const port = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(port, () => console.log(`API running on :${port}`));
});

