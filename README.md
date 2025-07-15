# 📦 Ghala Simulation System

This project simulates how **Ghala** handles merchant payment configuration and customer order processing via WhatsApp commerce. It includes full-stack features: authentication, order management, simulated payments, and a responsive admin interface.

## 🚀 Features

- **Authentication**
  - Merchant register/login using secure JWT tokens
  - Password hashing with bcrypt

- **Merchant Profile**
  - Stores name, email, encrypted password
  - Configurable payment method: `mobile`, `card`, `bank`
  - Optional commission rate per merchant

- **Orders**
  - Merchants can place mock orders (name, phone, items, total)
  - Payment status: `pending`, `paid`, `failed`
  - Orders link to merchant and update automatically

- **Payment Simulation**
  - Orders simulate payment confirmation with a delay (5 seconds)
  - Random 80% success rate handled asynchronously

- **Admin Dashboard UI**
  - Login interface for merchants
  - Merchant Settings: Form to input payment method + config
  - Orders Page: List orders and current status
  - Sidebar with active tab highlighting and collapsible layout


## 🧱 Tech Stack

| Layer      | Tools                                      |
|------------|--------------------------------------------|
| Frontend   | React, Tailwind CSS                        |
| Backend    | Node.js, Express, Mongoose                 |
| Database   | MongoDB Atlas                              |
| Auth       | JWT, bcrypt.js                             |
| Async Jobs | `setTimeout` in PaymentService.js          |

## 🛠 Setup Instructions
1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/ghala-simulation.git
   cd ghala-simulation/backen
2. **Install dependencies**
```bash
npm install
```
3.**Set up environment variables**

Create a .env file in the backend/ directory with the following:
env

MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
PORT=5000

4.**Start the backend server**
```bash
Copy
Edit
npm run dev
```
5.**Set up the frontend**

Open a new terminal and run:
```bash
 cd ../frontend
 npm install
 npm run dev
```
6.Access the application

📂 Project Structure

ghala-simulation/
├── backend/
│   ├── models/
│   │   ├── Merchant.js
│   │   ├── Order.js
│   │   └── PaymentMethod.js
│   ├── routes/
│   │   ├── merchants.js
│   │   ├── orders.js
│   │   └── payments.js
│   ├── services/
│   │   └── PaymentService.js
│   ├── middleware/
│   │   └── auth.js
│   ├── app.js
│   ├── server.js
│   └── seed.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── README.md

🧪 Simulating Payment
- When an order is created, simulatePaymentConfirmation(orderId) triggers payment simulation.
- Status changes from pending to paid or failed after 5 seconds.
Manual trigger via authenticated request:
POST /api/orders/:id/confirm-payment
Authorization: Bearer <your_jwt_token>


🧠 Architecture + Thinking

🔹 Supporting Multiple Merchants with Unique Configs
Each merchant is stored with a unique record in the database containing their profile and paymentMethod object. Token-based auth ensures merchants access only their own data, enabling secure multi-tenant support.

🔹 Extending Commission Rates
Each merchant model includes a commissionRate field that can be used to calculate dynamic fees during order processing or payout summaries. This allows Ghala to customize revenue logic per merchant.

🔹 Scaling to 10,000+ Merchants
To support thousands of merchants:
- Use indexed fields (e.g. merchantId) for fast queries
- Paginate responses for UI and API endpoints
- Use background queues (BullMQ, Celery) for async tasks
- Optimize with MongoDB Atlas or sharded databases
- Cache frequent reads (e.g. configs) using Redis


🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

📄 License
MIT License © 2025
