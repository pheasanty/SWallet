# SWallet - Digital Wallet API

A comprehensive digital wallet system built with NestJS and TypeORM, supporting multiple blockchain networks.

## 🚀 Quick Deploy on Render

### Option 1: Using render.yaml (Recommended)
1. Push your code to GitHub
2. Connect your repository to Render
3. Render will automatically detect the `render.yaml` file and configure everything

### Option 2: Manual Setup
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the following settings:

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npm run start:prod
```

**Environment Variables:**
- `NODE_ENV=production`
- `DATABASE_URL` (automatically provided by Render PostgreSQL)
- `PORT=10000`

### Database Setup
1. Create a PostgreSQL database on Render
2. The `DATABASE_URL` will be automatically provided
3. Migrations will run automatically on deployment

## 🏗️ Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- npm or yarn

### Installation
```bash
npm install
```

### Environment Setup
Create a `.env` file:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=swallet
NODE_ENV=development
```

### Database Migration
```bash
npm run migration:run
```

### Start Development Server
```bash
npm run start:dev
```

## 📊 API Endpoints

- `GET/POST/PUT/DELETE /users` - User management
- `GET/POST/PUT/DELETE /wallets` - Wallet operations
- `GET/POST/PUT/DELETE /transactions` - Transaction processing
- `GET/POST/PUT/DELETE /tokens` - Token management
- `GET/POST /audit` - Audit logging
- `GET/POST/PUT/DELETE /sessions` - Session management
- `GET/POST/PUT/DELETE /networks` - Network configuration

## 🛠️ Available Scripts

- `npm run start:dev` - Start development server
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run migration:run` - Run database migrations
- `npm run migration:generate` - Generate new migration
- `npm run migration:revert` - Revert last migration

## 🏛️ Architecture

- **Backend**: NestJS + TypeScript
- **Database**: PostgreSQL with TypeORM
- **Architecture**: Modular with separation of concerns
- **Migration**: TypeORM migrations for database versioning

## 📁 Project Structure

```
src/
├── app/                 # Main application module
├── config/              # Configuration files
├── database/            # Database configuration
├── entities/            # TypeORM entities
├── services/            # Business logic services
├── modules/             # Feature modules
└── migrations/          # Database migrations
```

## 🔧 Troubleshooting

### Database Connection Issues
- Ensure `DATABASE_URL` is set correctly in Render
- Check that PostgreSQL service is running
- Verify network connectivity

### Build Issues
- Ensure all dependencies are installed
- Check TypeScript compilation errors
- Verify environment variables

## 📝 License

ISC License