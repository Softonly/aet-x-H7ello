import express, { Request, Response } from 'express';
import axios from 'axios';
import expressWs from 'express-ws';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import next from 'next';
import { JsonRpcProvider } from 'ethers';
import Web3 from 'web3';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { ClerkMiddlewareOptions } from '@clerk/clerk-sdk-node';
import { db } from './src/db/db';
import { productsTable } from './src/db/schema';

// dotenv yapılandırması
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Clerk yapılandırması
const clerkMiddleware = ClerkExpressWithAuth({
  secretKey: process.env.CLERK_SECRET_KEY,
} as unknown as ClerkMiddlewareOptions);

// Next.js ve Express yapılandırması
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const wsInstance = expressWs(express());
const server = wsInstance.app;

const PORT = process.env.PORT || 3000;
const ethereumProviderUrl = process.env.API_INFURA_URL || 'https://mainnet.infura.io/v3/api';
const loadRemoteIndexUrl = process.env.MAIN_SERVER_LOAD_REMOTE_INDEX_URL || '';
const provider = new JsonRpcProvider(ethereumProviderUrl);
const web3 = new Web3(ethereumProviderUrl);

// Middleware'ler
server.use(express.static(path.join(__dirname, 'public')));
server.use(express.json());

// Güvenlik başlıkları
server.use((req, res, next) => {
  res.set({
    'Cache-Control': 'public, max-age=0, must-revalidate',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  });
  next();
});

// CORS yönetimi
server.use((req: Request, res: Response, next: Function) => {
  const origin = req.headers.origin as string | undefined;
  const allowedOrigins = [
    'http://localhost:3000',
    'https://aet-x-h7ello.vercel.app',
    'https://datafortress.website',
    'https://www.datafortress.website',
    'https://clerk.datafortress.webiste',
    'https://datafortress.shop',
    'https://aet-x-h7ello-git-origin-webs-projects-4ddef413.vercel.app',
    'https://www.datafortress.shop',
    'https://clerk.datafortress.shop',
    'https://clerk.datafortress.shop/npm/@clerk/clerk-js@5/dist/clerk.browser.js',
    'https://clerk.datafortress.website/npm/@clerk/clerk-js@5/dist/clerk.browser.js'
  ];

  if (origin && (allowedOrigins.includes(origin) || origin.endsWith('.datafortress.shop'))) {
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Access-Control-Allow-Credentials', 'true');
  }

  res.set({
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, x-api-key, Authorization'
  });

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// Korumalı rotalar için Clerk middleware'i
const protectedRoutes = ['/api/products', '/web3-info'];
server.use(protectedRoutes, clerkMiddleware);

// WebSocket rotası
server.ws('/web3', (ws, req) => {
  console.log(`Client connected: ${req.socket.remoteAddress}`);

  ws.on('message', async () => {
    try {
      const accounts = await provider.listAccounts();
      ws.send(JSON.stringify({ accounts }));
    } catch (error) {
      console.error('WebSocket error:', error);
      ws.send(JSON.stringify({ error: 'Web3 interaction failed' }));
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// API rotaları
server.get('/api/products', async (req: Request, res: Response) => {
  try {
    const products = await db.select().from(productsTable).all();
    res.status(200).json(products);
  } catch (error) {
    console.error('Ürünler alınırken hata:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

server.get('/web3-info', async (req: Request, res: Response) => {
  try {
    const accounts = await provider.listAccounts();
    res.json({ accounts });
  } catch (error) {
    console.error('Web3 error:', error);
    res.status(500).json({ error: 'Web3 interaction failed' });
  }
});

// Statik dosya ve uzak dizin rotaları
server.get('/get-file/:fileName', async (req: Request, res: Response) => {
  const fileName = req.params.fileName;
  if (!fileName) {
    return res.status(400).json({ error: 'File name required' });
  }

  try {
    const filePath = path.join(__dirname, 'public', fileName);
    const fileContent = await fs.promises.readFile(filePath, 'utf8');
    res.send(fileContent);
  } catch (error) {
    res.status(404).redirect('/cli-error/not-found');
  }
});

server.get('/load-remote-index', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(loadRemoteIndexUrl);
    res.set('Content-Type', response.headers['content-type']);
    res.send(response.data);
  } catch (error) {
    res.status(404).redirect('/cli-error/not-found');
  }
});

// Next.js handler
server.all('*', (req, res) => handle(req, res));

// Error handling middleware
server.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Sunucuyu başlatma
app.prepare()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error starting server:', err);
    process.exit(1);
  });
