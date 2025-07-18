⚛️ React + Vite Frontend — README
This is the frontend for the project, built using React, Vite, and an Axios client instance. Authentication is handled using cookies (via Laravel Sanctum), and all API requests go through a central Axios instance.

📁 Project Structure
bash
نسخ
تحرير
frontend/
│
├── src/
│   ├── api/           # Axios client instance lives here
│   ├── pages/         # Pages or views
│   ├── components/    # Reusable components
│   ├── App.jsx
│   └── main.jsx
│
├── public/
├── .env
├── package.json
└── vite.config.js
⚙️ Setup Instructions
1. Install Dependencies
bash
cd frontend
npm install
2. Environment Variables
Create a .env file:

env
نسخ
تحرير
VITE_API_URL=https://api.yourdomain.com
Ensure this domain matches the backend Laravel domain (e.g., https://api.example.com) and is CORS-allowed.

3. Axios Client (src/api/client.js)
All API calls are made through a custom Axios instance that:

Uses withCredentials: true to send cookies

Includes base URL from .env

Can auto-attach CSRF tokens from Sanctum

js
نسخ
تحرير
// src/api/client.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
  withCredentials: true,
});
5. Development Server
bash
npm run dev
The app runs on http://localhost:5173

6. Build for Production
bash
npm run build
Deploy the contents of the dist/ folder to your static hosting or server.

🔐 Auth & Security Notes
Authentication is cookie-based, not token-based

Axios must include withCredentials: true

Backend must:

Enable CORS for your frontend domain

Expose /sanctum/csrf-cookie for CSRF token retrieval

Use HTTPS in production

🧪 Test Your Integration
Try these endpoints using the frontend:

Method	Endpoint	Description
POST	/login	Login via Sanctum
GET	/services	Get list of services
POST	/orders	Create an order
GET	/wallet/balance	Check user balance
POST	/logout	Log out user

👨‍💻 Developer
Name: [Eslam Awod]

Email: [eeslamawood@email.com]

WhatsApp: [01110215455]

Deployment Support: Available on request

#   w h o l e s a l e - f r o n t - r e a c t  
 