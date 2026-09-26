# DS Pharma Backend

Backend API for DS Pharma application with integrated Marg ERP API support.

## 🏗️ Architecture

This backend serves as a middleware between your frontend and the Marg ERP API, with complete separation of concerns.

![Architecture Diagram](C:/Users/VAIS-DT8-1/.gemini/antigravity/brain/4ced2e99-b75f-475b-aed7-e938eb63ce5e/marg_architecture_diagram_1769667465142.png)

### Flow

```
Frontend → Backend API → Marg Service → Marg ERP API
```

## 📁 Project Structure

```
src/
├── modules/
│   ├── auth/              # Authentication
│   ├── marg/              # 🔒 Isolated Marg API integration
│   │   ├── marg.service.js
│   │   ├── marg.controller.js
│   │   ├── marg.route.js
│   │   └── marg.examples.js
│   └── mastersync/        # 📡 Frontend-facing API
│       ├── masterSync.service.js
│       ├── masterSync.controller.js
│       └── masterSync.route.js
├── middlewares/
├── utils/
├── config/
├── app.js
└── index.js
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your Marg API credentials
```

### 3. Start Server

```bash
# Development
npm run dev

# Production
npm start
```

## 📡 API Endpoints

### Master Sync (For Frontend)

```
POST   /api/v1/master-sync              # Sync all master data
POST   /api/v1/master-sync/products     # Sync products only
POST   /api/v1/master-sync/customers    # Sync customers only
POST   /api/v1/master-sync/suppliers    # Sync suppliers only
GET    /api/v1/master-sync/products/:id # Get specific product
```

### Marg API (Optional Direct Access)

```
GET    /api/v1/marg/test                # Test Marg connection
GET    /api/v1/marg/products            # Fetch from Marg directly
GET    /api/v1/marg/customers           # Fetch from Marg directly
GET    /api/v1/marg/suppliers           # Fetch from Marg directly
```

### Authentication

```
POST   /api/v1/auth/login               # User login
POST   /api/v1/auth/register            # User registration
```

## 🔧 Configuration

Required environment variables in `.env`:

```env
# Marg API
MARG_API_BASE_URL=http://your-marg-api-url
MARG_API_KEY=your_api_key
MARG_SECRET_KEY=your_secret_key

# Database
MONGODB_URI=mongodb://localhost:27017/ds_pharma

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=7d

# Server
PORT=3000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:5173
```

## 📚 Documentation

- **[SETUP_COMPLETE.md](./SETUP_COMPLETE.md)** - Setup summary and overview
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detailed architecture documentation
- **[QUICKSTART.md](./QUICKSTART.md)** - Quick start guide with examples
- **[marg.examples.js](./src/modules/marg/marg.examples.js)** - Code examples

## 💡 Usage Example

### Frontend Integration

```javascript
// Sync all master data
const syncData = async () => {
  const response = await fetch("http://localhost:3000/api/v1/master-sync", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (result.success) {
    console.log("Products:", result.data.products);
    console.log("Customers:", result.data.customers);
    console.log("Suppliers:", result.data.suppliers);
  }
};
```

### Backend Module Integration

```javascript
// Use Marg service in any module
import margService from "../marg/marg.service.js";

const products = await margService.fetchProducts();
const customers = await margService.fetchCustomers();
```

## 🎯 Key Features

- ✅ **Isolated Marg Integration** - Marg API code is completely separate
- ✅ **Clean Architecture** - Clear separation of concerns
- ✅ **Reusable Service** - Use Marg service anywhere in your backend
- ✅ **Data Transformation** - Automatic conversion between Marg and your app format
- ✅ **Error Handling** - Comprehensive error handling and logging
- ✅ **Authentication** - JWT-based authentication
- ✅ **CORS Support** - Configured for frontend integration

## 🔒 Security

- All endpoints protected with authentication middleware
- Marg API credentials stored in environment variables
- Encryption/decryption handled securely
- CORS configured for specific origins

## 🛠️ Development

### Project Scripts

```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm test         # Run tests (to be implemented)
```

### Adding New Features

1. **Add new Marg endpoint**: Edit `src/modules/marg/marg.service.js`
2. **Add new frontend endpoint**: Edit `src/modules/mastersync/`
3. **Add new module**: Create new folder in `src/modules/`

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **axios** - HTTP client for Marg API
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **cors** - CORS middleware
- **dotenv** - Environment variables
- **cookie-parser** - Cookie parsing
- **crypto-js** - Encryption/decryption
- **pako** - Compression/decompression

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

ISC

## 🆘 Support

For issues or questions:

1. Check the documentation files
2. Review `marg.examples.js` for usage patterns
3. Check Marg ERP API documentation

---
# ------------------------------------------ DEVELOPEMENT ------------------------------------------
# MONGO_URI=mongodb://vaisdt06:vaisdt06@ac-n0z6qnj-shard-00-00.k7etnh3.mongodb.net:27017,ac-n0z6qnj-shard-00-01.k7etnh3.mongodb.net:27017,ac-n0z6qnj-shard-00-02.k7etnh3.mongodb.net:27017/?ssl=true&replicaSet=atlas-11wy6v-shard-0&authSource=admin&appName=Cluster0/DSPharma
# MONGO_URI=mongodb://localhost:27017/DSPharma
# PORT=8080
# JWT_SECRET=e991764d333fabaac43b351fada68b85c0c5200ad9156ce2
# JWT_EXPIRES_IN=1d
# VITE_MARG_API_BASE_URL=https://corporate.margerp.com/api/eOnlineData
# VITE_COMPANY_CODE=DSPHARMA3
# VITE_MARG_ID=423875
# VITE_DECRYPTION_KEY=N9JB7B4H0QHV
# VAIS_BUCKET_API_KEY=fup_232a28a4_de6f29b910ac06959d690901f3221b97301657e6b2459173eae6562244022e42
# VAIS_BUCKET_FOLDER_ID=697b4c400829419d7080fe7c
# BACKEND_URL=http://192.168.0.123:5000
# DEFAULT_PRODUCT_IMAGE_URL=https://jetsonpharma.com/wp-content/uploads/2023/05/medicine-placeholder-300x300.png
# NODE_ENV=dev
# EMAIL_USER=vaisdt81@gmail.com
# EMAIL_PASSWORD=bamz lxml mzhy rmmd
# ADMIN_ID=0b188583-9796-40e5-a332-2c2d572e7f85
# ADMIN_USER_ID=DSPHARMA
# ADMIN_PASSWORD=DSPHARMA@2026
# PHONEPE_CLIENT_ID=
# PHONEPE_CLIENT_VERSION=
# PHONEPE_CLIENT_SECRET=
# PHONEPE_ENV=SANDBOX
# ECOM_SALESMAN_ID=301245
# HOSTINGER_EMAIL=helpdesk@dspharma.online
# HOSTINGER_PASSWORD=Dspharma@2026

# ------------------------------------------ DEPLOYMENT ------------------------------------------
MONGO_URI=mongodb://localhost:27017/DSPharma
PORT=8081
JWT_SECRET=e991764d333fabaac43b351fada68b85c0c5200ad9156ce2
JWT_EXPIRES_IN=1d
VITE_MARG_API_BASE_URL=https://corporate.margerp.com/api/eOnlineData
VITE_COMPANY_CODE=DSPHARMA3
VITE_MARG_ID=423875
VITE_DECRYPTION_KEY=N9JB7B4H0QHV
VAIS_BUCKET_API_KEY=fup_232a28a4_de6f29b910ac06959d690901f3221b97301657e6b2459173eae6562244022e42
VAIS_BUCKET_FOLDER_ID=697b4c400829419d7080fe7c
BACKEND_URL=https://server2.vais.co.in/dsecom
NODE_ENV=production
EMAIL_USER=vaisdt81@gmail.com
EMAIL_PASSWORD=bamz lxml mzhy rmmd
ADMIN_ID=0b188583-9796-40e5-a332-2c2d572e7f85
ADMIN_USER_ID=DSPHARMA
ADMIN_PASSWORD=DSPHARMA@2026
PHONEPE_CLIENT_ID=
PHONEPE_CLIENT_VERSION=
PHONEPE_CLIENT_SECRET=
PHONEPE_ENV=PRODUCTION
ECOM_SALESMAN_ID=301245
HOSTINGER_EMAIL=helpdesk@dspharma.online
HOSTINGER_PASSWORD=Dspharma@2026
**Built with ❤️ for DS Pharma**
