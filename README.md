🌉 FoodBridge - Food Donation Made Simple
"Connecting restaurants with NGOs to reduce food waste and fight hunger through AI-powered smart matching"


🎯 Problem Statement
40% of food produced globally is wasted
828 million people face hunger worldwide
$1 trillion economic loss from food waste annually

FoodBridge solves this by creating a seamless bridge between restaurants with surplus food and NGOs serving communities in need.

✨ Features
For Restaurants 🍽️
Smart Food Listing - Upload food photos with AI recognition
Donation Dashboard - Track all donations and impact metrics
Real-time Status - See when donations are claimed
Impact Tracking - View kg saved, meals donated, and impact score

For NGOs 🤝
Food Discovery - Browse available donations on interactive map
Smart Recommendations - AI suggests relevant donations based on preferences
One-Click Claiming - Simple pickup scheduling
Direct Contact - Connect directly with restaurants

For Admins 👨‍💼
User Management - Verify and manage restaurants/NGOs
Analytics Dashboard - Real-time statistics and trends
Activity Monitoring - Track all platform activity
Donation Oversight - Monitor all donations across the platform

🙏 Acknowledgments

UN Sustainable Development Goals (SDG 2: Zero Hunger, SDG 12: Responsible Consumption)
Food waste statistics from FAO
Inspired by food rescue organizations worldwide🙏 Acknowledgments

UN Sustainable Development Goals (SDG 2: Zero Hunger, SDG 12: Responsible Consumption)
Food waste statistics from FAO
Inspired by food rescue organizations worldwide

🏗️ Tech Stack
Backend
Node.js + Express.js - RESTful API
PostgreSQL - Relational database
JWT - Authentication
Bcrypt - Password hashing
Multer - File uploads

Frontend
React - UI framework
React Router - Navigation
Axios - HTTP client
Leaflet - Interactive maps
CSS3 - Styling

DevOps
Git - Version control
GitHub - Repository hosting

🚀 Quick Start
Prerequisites
Node.js (v18+)
PostgreSQL (v14+)
Git
# 1. Clone the repository
git clone https://github.com/yourusername/foodbridge.git
cd foodbridge
# 2. Setup Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
mkdir uploads
# 3. Setup Database
psql -U postgres
CREATE DATABASE foodbridge;
\c foodbridge
\i models/schema.sql
\q
# 4. Start Backend
npm run dev
# Server runs on http://localhost:5000
# 5. Setup Frontend (optional)
cd ../frontend
npm install
npm start
# App runs on http://localhost:3000

Quick Test
bash# Test the API
curl http://localhost:5000/api/health

# Expected response:
# {"status":"OK","message":"FoodBridge API is running"}

Default Test Accounts
Admin: admin@foodbridge.com
Password:admin123
Restaurant:restaurant@test.com
Passsword:admin123
NGO:NGOngo@test.com
Password:admin123

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

Made with ❤️ for a better, hunger-free world 🌍
