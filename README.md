<<<<<<< HEAD
# JobHunt Backend

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=8000
   SECRET_KEY=your-secret-key-here
   MONGO_URI=your-mongodb-connection-string
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   ```

3. **Start the Server**
   ```bash
   npm start
   ```

## API Endpoints

- **User Routes**: `/api/v1/user`
- **Job Routes**: `/api/v1/job`
- **Company Routes**: `/api/v1/company`
- **Application Routes**: `/api/v1/application`

## Notes

- The server runs on port 8000 by default
- Make sure MongoDB is running and accessible
- Cloudinary is required for file uploads 
=======
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
>>>>>>> 6c220abc9ad3f8e9bf993aaa8b355ed620ce7b4b
