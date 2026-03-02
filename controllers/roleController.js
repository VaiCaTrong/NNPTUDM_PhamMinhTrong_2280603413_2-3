const Role = require('../models/Role');

// Get all roles
exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.json({
            success: true,
            count: roles.length,
            data: roles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách roles',
            error: error.message
        });
    }
};

// Get role by ID
exports.getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'ID không hợp lệ'
            });
        }
        
        const role = await Role.findById(id);
        
        if (!role) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy role với ID ${id}`
            });
        }
        
        res.json({
            success: true,
            data: role
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy role',
            error: error.message
        });
    }
};

// Create role
exports.createRole = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Tên role là bắt buộc'
            });
        }
        
        const role = new Role({
            name,
            description
        });
        
        await role.save();
        
        res.status(201).json({
            success: true,
            message: 'Tạo role thành công',
            data: role
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo role',
            error: error.message
        });
    }
};

// Update role
exports.updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        
        const role = await Role.findByIdAndUpdate(
            id,
            { name, description },
            { new: true, runValidators: true }
        );
        
        if (!role) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy role với ID ${id}`
            });
        }
        
        res.json({
            success: true,
            message: 'Cập nhật role thành công',
            data: role
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật role',
            error: error.message
        });
    }
};

// Soft delete role
exports.deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        
        const role = await Role.findByIdAndDelete(id);
        
        if (!role) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy role với ID ${id}`
            });
        }
        
        res.json({
            success: true,
            message: 'Xóa role thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa role',
            error: error.message
        });
    }
};
