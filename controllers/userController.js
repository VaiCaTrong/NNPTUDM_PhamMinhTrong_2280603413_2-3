const User = require('../models/User');

// Get all users (không lấy những user bị xóa mềm)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ isDeleted: false }).populate('role');
        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách users',
            error: error.message
        });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'ID không hợp lệ'
            });
        }
        
        const user = await User.findById(id).populate('role');
        
        if (!user || user.isDeleted) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy user với ID ${id}`
            });
        }
        
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy user',
            error: error.message
        });
    }
};

// Create user
exports.createUser = async (req, res) => {
    try {
        const { username, password, email, fullName, avatarUrl, role } = req.body;
        
        if (!username || !password || !email) {
            return res.status(400).json({
                success: false,
                message: 'Username, password và email là bắt buộc'
            });
        }
        
        // Nếu không có role, tìm role "user" mặc định
        let userRole = role;
        if (!userRole) {
            const Role = require('../models/Role');
            const defaultRole = await Role.findOne({ name: 'user' });
            if (defaultRole) {
                userRole = defaultRole._id;
            }
        }
        
        const user = new User({
            username,
            password,
            email,
            fullName,
            avatarUrl,
            role: userRole,
            status: true
        });
        
        await user.save();
        await user.populate('role');
        
        res.status(201).json({
            success: true,
            message: 'Tạo user thành công',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo user',
            error: error.message
        });
    }
};

// Update user
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, avatarUrl, role } = req.body;
        
        const user = await User.findByIdAndUpdate(
            id,
            { fullName, avatarUrl, role },
            { new: true, runValidators: true }
        ).populate('role');
        
        if (!user || user.isDeleted) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy user với ID ${id}`
            });
        }
        
        res.json({
            success: true,
            message: 'Cập nhật user thành công',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật user',
            error: error.message
        });
    }
};

// Soft delete user
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        );
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy user với ID ${id}`
            });
        }
        
        res.json({
            success: true,
            message: 'Xóa user thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa user',
            error: error.message
        });
    }
};

// Enable user (POST /enable)
exports.enableUser = async (req, res) => {
    try {
        const { email, username } = req.body;
        
        if (!email || !username) {
            return res.status(400).json({
                success: false,
                message: 'Email và username là bắt buộc'
            });
        }
        
        const user = await User.findOneAndUpdate(
            { email, username, isDeleted: false },
            { status: true },
            { new: true }
        ).populate('role');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy user với email và username này'
            });
        }
        
        res.json({
            success: true,
            message: 'Kích hoạt user thành công',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi kích hoạt user',
            error: error.message
        });
    }
};

// Disable user (POST /disable)
exports.disableUser = async (req, res) => {
    try {
        const { email, username } = req.body;
        
        if (!email || !username) {
            return res.status(400).json({
                success: false,
                message: 'Email và username là bắt buộc'
            });
        }
        
        const user = await User.findOneAndUpdate(
            { email, username, isDeleted: false },
            { status: false },
            { new: true }
        ).populate('role');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy user với email và username này'
            });
        }
        
        res.json({
            success: true,
            message: 'Vô hiệu hóa user thành công',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi vô hiệu hóa user',
            error: error.message
        });
    }
};
