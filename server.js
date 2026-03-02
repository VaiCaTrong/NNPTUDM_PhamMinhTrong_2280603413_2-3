const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/products-management')
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.log('❌ MongoDB connection error:', err));

// Import routes
const indexRouter = require('./routes/index');
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const usersRouter = require('./routes/users');
const usersApiRouter = require('./routes/users-api');
const rolesApiRouter = require('./routes/roles-api');
const authRouter = require('./routes/auth');

// Use routes
app.use('/', indexRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/users', usersRouter);
app.use('/api/users', usersApiRouter);
app.use('/api/roles', rolesApiRouter);
app.use('/api/auth', authRouter);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Route không tồn tại'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra trên server',
        error: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🚀 Server đang chạy tại:                           ║
║   📍 http://localhost:${PORT}                           ║
║                                                       ║
║   📱 Giao diện web:                                  ║
║   🌐 http://localhost:${PORT}/index.html                ║
║                                                       ║
║   🔌 API Endpoints:                                  ║
║   • POST /api/auth/register                          ║
║   • POST /api/auth/login                             ║
║   • GET  /api/auth/me                                ║
║   • POST /api/auth/logout                            ║
║   • GET  /api/users                                  ║
║   • GET  /api/users/:id                              ║
║   • POST /api/users                                  ║
║   • PUT  /api/users/:id                              ║
║   • DELETE /api/users/:id                            ║
║   • POST /api/users/enable                           ║
║   • POST /api/users/disable                          ║
║   • GET  /api/roles                                  ║
║   • GET  /api/roles/:id                              ║
║   • POST /api/roles                                  ║
║   • PUT  /api/roles/:id                              ║
║   • DELETE /api/roles/:id                            ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
    `);
});

module.exports = app;
