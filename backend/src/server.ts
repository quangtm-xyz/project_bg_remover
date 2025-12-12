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

// Trust proxy - Required for Render and other platforms behind reverse proxy
// This allows express-rate-limit to correctly identify users via X-Forwarded-For header
app.set('trust proxy', 1);

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://www.craftbg.click',
    'https://craftbg.click',
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
  const startTime = Date.now();

  try {
    if (!req.file) {
      console.error('❌ No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const REMOVEBG_API_KEY = process.env.REMOVEBG_API_KEY || 'x1qW6tB1HhvQ9J4Z8uiojec1';

    console.log('📤 Processing image:', {
      filename: req.file.originalname,
      size: `${(req.file.size / 1024).toFixed(2)} KB`,
      mimetype: req.file.mimetype,
      apiKeyLength: REMOVEBG_API_KEY.length,
      timestamp: new Date().toISOString()
    });

    // Create form data
    const formData = new FormData();
    formData.append('image_file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });
    formData.append('size', 'auto');

    console.log('🔄 Calling remove.bg API...');

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

    const processingTime = Date.now() - startTime;
    console.log(`✅ Success! Processing time: ${processingTime}ms`);

    // Check API credits from response headers
    if (response.headers['x-credits-charged']) {
      console.log('💳 Credits charged:', response.headers['x-credits-charged']);
    }
    if (response.headers['x-ratelimit-remaining']) {
      console.log('📊 Rate limit remaining:', response.headers['x-ratelimit-remaining']);
    }

    // Return PNG image
    res.set('Content-Type', 'image/png');
    res.set('Content-Disposition', `attachment; filename="removed-bg-${Date.now()}.png"`);
    res.send(Buffer.from(response.data));

  } catch (error: any) {
    const processingTime = Date.now() - startTime;
    console.error(`❌ Error after ${processingTime}ms:`, error.message);

    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;

      console.error('📛 API Response Error:', {
        status,
        statusText: error.response.statusText,
        headers: error.response.headers,
        data: errorData?.toString()
      });

      // Handle specific error codes
      let errorMessage = 'Background removal failed';

      if (status === 400) {
        errorMessage = 'Invalid image format or corrupted file';
      } else if (status === 402) {
        errorMessage = 'API quota exceeded. Please try again later';
        console.error('💰 QUOTA EXCEEDED - Need to check remove.bg account');
      } else if (status === 403) {
        errorMessage = 'Invalid API key';
        console.error('🔑 INVALID API KEY - Check REMOVEBG_API_KEY env variable');
      } else if (status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again in a few minutes';
      }

      return res.status(status).json({
        error: errorMessage,
        details: errorData?.toString() || error.message
      });
    }

    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ Request timeout after 30s');
      return res.status(504).json({
        error: 'Request timeout',
        message: 'The image processing took too long. Please try with a smaller image.'
      });
    }

    console.error('🔥 Unexpected error:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });

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
