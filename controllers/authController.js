const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Tạo JWT token
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role ? user.role : 'user'
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

// Đăng ký user
exports.register = async (req, res) => {
    try {
        const { username, password, email, fullName } = req.body;
        
        // Validate input
        if (!username || !password || !email) {
            return res.status(400).json({
                success: false,
                message: 'Username, password và email là bắt buộc'
            });
        }
        
        // Kiểm tra user đã tồn tại
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });
        
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username hoặc email đã tồn tại'
            });
        }
        
        // Tìm role "user" mặc định
        const Role = require('../models/Role');
        const userRole = await Role.findOne({ name: 'user' });
        
        // Tạo user mới
        const user = new User({
            username,
            password,
            email,
            fullName,
            status: true,
            role: userRole ? userRole._id : null
        });
        
        await user.save();
        
        // Tạo token
        const token = generateToken(user);
        
        res.status(201).json({
            success: true,
            message: 'Đăng ký thành công',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: 'user'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi đăng ký',
            error: error.message
        });
    }
};

// Đăng nhập user
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username và password là bắt buộc'
            });
        }
        
        // Kiểm tra admin cố định
        if (username === process.env.ADMIN_USERNAME && 
            password === process.env.ADMIN_PASSWORD) {
            
            const token = jwt.sign(
                {
                    id: 'admin',
                    username: process.env.ADMIN_USERNAME,
                    email: process.env.ADMIN_EMAIL,
                    role: 'admin'
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE }
            );
            
            return res.json({
                success: true,
                message: 'Đăng nhập admin thành công',
                token,
                user: {
                    id: 'admin',
                    username: process.env.ADMIN_USERNAME,
                    email: process.env.ADMIN_EMAIL,
                    role: 'admin'
                }
            });
        }
        
        // Tìm user trong database
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Username hoặc password không đúng'
            });
        }
        
        // Kiểm tra user bị xóa
        if (user.isDeleted) {
            return res.status(401).json({
                success: false,
                message: 'Tài khoản này đã bị xóa'
            });
        }
        
        // Kiểm tra user bị vô hiệu hóa
        if (!user.status) {
            return res.status(401).json({
                success: false,
                message: 'Tài khoản này đã bị vô hiệu hóa'
            });
        }
        
        // So sánh password
        const isPasswordValid = await user.comparePassword(password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Username hoặc password không đúng'
            });
        }
        
        // Tăng login count
        user.loginCount += 1;
        await user.save();
        
        // Tạo token
        const token = generateToken(user);
        
        res.json({
            success: true,
            message: 'Đăng nhập thành công',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                loginCount: user.loginCount
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi đăng nhập',
            error: error.message
        });
    }
};

// Lấy thông tin user hiện tại
exports.getCurrentUser = async (req, res) => {
    try {
        if (req.user.id === 'admin') {
            return res.json({
                success: true,
                user: {
                    id: 'admin',
                    username: process.env.ADMIN_USERNAME,
                    email: process.env.ADMIN_EMAIL,
                    role: 'admin'
                }
            });
        }
        
        const user = await User.findById(req.user.id).populate('role');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy user'
            });
        }
        
        res.json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                loginCount: user.loginCount
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin user',
            error: error.message
        });
    }
};

// Đăng xuất
exports.logout = (req, res) => {
    res.json({
        success: true,
        message: 'Đăng xuất thành công'
    });
};
