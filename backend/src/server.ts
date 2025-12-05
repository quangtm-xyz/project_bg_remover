import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL || '',
    /\.vercel\.app$/,
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: 'Too many requests, please try again later.'
});

app.use('/api/', limiter);

// Multer setup
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
  }
});

// Health check
app.get('/', (req: Request, res: Response) => {
  res.json({ status: 'OK' });
});

// Background removal endpoint - remove.bg API
app.post('/api/remove-bg', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const REMOVEBG_API_KEY = process.env.REMOVEBG_API_KEY || 'x1qW6tB1HhvQ9J4Z8uiojec1';

    // Create form data
    const formData = new FormData();
    formData.append('image_file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });
    formData.append('size', 'auto');

    // Call remove.bg API
    const response = await axios.post(
      'https://api.remove.bg/v1.0/removebg',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'X-Api-Key': REMOVEBG_API_KEY
        },
        responseType: 'arraybuffer',
        timeout: 30000,
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      }
    );

    // Return PNG image
    res.set('Content-Type', 'image/png');
    res.set('Content-Disposition', `attachment; filename="removed-bg-${Date.now()}.png"`);
    res.send(Buffer.from(response.data));

  } catch (error: any) {
    console.error('Remove.bg error:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data?.toString());
      return res.status(error.response.status).json({
        error: 'Background removal failed',
        details: error.response.data?.toString() || error.message
      });
    }
    
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: err.message || 'Internal server error' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api/remove-bg`);
});
