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

// Background removal endpoint - Custom CraftBG API
app.post('/api/remove-bg', upload.single('file'), async (req: Request, res: Response) => {
  const startTime = Date.now();

  try {
    if (!req.file) {
      console.error('❌ No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const CRAFTBG_API_URL = process.env.CRAFTBG_API_URL || 'https://craftbg-removebg-api.onrender.com';
    const CRAFTBG_API_KEY = process.env.CRAFTBG_API_KEY || 'craftbg_test_2025_super_secret';

    console.log('📤 Processing image:', {
      filename: req.file.originalname,
      size: `${(req.file.size / 1024).toFixed(2)} KB`,
      mimetype: req.file.mimetype,
      apiUrl: CRAFTBG_API_URL,
      timestamp: new Date().toISOString()
    });

    // Create form data for custom API
    const formData = new FormData();
    formData.append('image', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    console.log('🔄 Calling CraftBG API...');

    // Call custom CraftBG API
    const response = await axios.post(
      `${CRAFTBG_API_URL}/api/remove-background`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'x-api-key': CRAFTBG_API_KEY
        },
        responseType: 'arraybuffer',
        timeout: 60000,
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      }
    );

    const processingTime = Date.now() - startTime;
    console.log(`✅ Success! Processing time: ${processingTime}ms`);

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
      } else if (status === 500) {
        errorMessage = 'AI processing error. Please try again';
        console.error('🤖 AI API ERROR - Check craftbg-removebg-api logs');
      } else if (status === 503) {
        errorMessage = 'Service temporarily unavailable. Please try again in a moment';
        console.error('⚠️ SERVICE UNAVAILABLE - API may be starting up');
      }

      return res.status(status).json({
        error: errorMessage,
        details: errorData?.toString() || error.message
      });
    }

    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ Request timeout after 60s');
      return res.status(504).json({
        error: 'Request timeout',
        message: 'The AI processing took too long. Please try with a smaller image.'
      });
    }

    if (error.code === 'ECONNREFUSED') {
      console.error('🔌 CONNECTION REFUSED - CraftBG API may be down');
      return res.status(503).json({
        error: 'Service unavailable',
        message: 'Unable to connect to background removal service. Please try again later.'
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
