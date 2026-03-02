# API Users & Roles Documentation

## 📋 Cài đặt

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình MongoDB
Tạo file `.env`:
```
MONGODB_URI=mongodb://localhost:27017/products-management
PORT=3000
NODE_ENV=development
```

### 3. Chạy server
```bash
npm start
```

---

## 👥 Users API

### 1. Get All Users
```
GET /api/users
```
**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [...]
}
```

### 2. Get User by ID
```
GET /api/users/:id
```

### 3. Create User
```
POST /api/users
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123",
  "email": "john@example.com",
  "fullName": "John Doe",
  "avatarUrl": "https://...",
  "role": "roleId"
}
```

### 4. Update User
```
PUT /api/users/:id
Content-Type: application/json

{
  "fullName": "John Updated",
  "avatarUrl": "https://...",
  "role": "roleId"
}
```

### 5. Delete User (Soft Delete)
```
DELETE /api/users/:id
```

### 6. Enable User
```
POST /api/users/enable
Content-Type: application/json

{
  "email": "john@example.com",
  "username": "john_doe"
}
```
**Chuyển status thành true**

### 7. Disable User
```
POST /api/users/disable
Content-Type: application/json

{
  "email": "john@example.com",
  "username": "john_doe"
}
```
**Chuyển status thành false**

---

## 🔐 Roles API

### 1. Get All Roles
```
GET /api/roles
```

### 2. Get Role by ID
```
GET /api/roles/:id
```

### 3. Create Role
```
POST /api/roles
Content-Type: application/json

{
  "name": "Admin",
  "description": "Administrator role"
}
```

### 4. Update Role
```
PUT /api/roles/:id
Content-Type: application/json

{
  "name": "Admin",
  "description": "Updated description"
}
```

### 5. Delete Role
```
DELETE /api/roles/:id
```

---

## 📊 User Schema

```javascript
{
  username: String (unique, required),
  password: String (required, hashed),
  email: String (unique, required),
  fullName: String (default: ""),
  avatarUrl: String (default: "https://i.sstatic.net/l60Hf.png"),
  status: Boolean (default: false),
  role: ObjectID (ref: Role),
  loginCount: Number (default: 0, min: 0),
  isDeleted: Boolean (default: false) - Soft delete,
  timestamp: Date (default: now)
}
```

## 📊 Role Schema

```javascript
{
  name: String (unique, required),
  description: String (default: ""),
  timestamp: Date (default: now)
}
```

---

## 🔑 Tính năng chính

✅ **CRUD Operations:**
- Get all (không lấy user bị xóa mềm)
- Get by ID
- Create
- Update
- Delete (soft delete)

✅ **Enable/Disable:**
- POST /api/users/enable - Kích hoạt user
- POST /api/users/disable - Vô hiệu hóa user

✅ **Security:**
- Password hashing với bcryptjs
- Email validation
- Unique constraints

✅ **Soft Delete:**
- User không bị xóa vĩnh viễn
- Chỉ đánh dấu isDeleted = true
