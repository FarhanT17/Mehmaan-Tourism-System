Mehmaan – Tourism System 🧳🗺️
Mehmaan is a user-friendly tourism platform built with React Native that connects tourists with local service providers. Designed as a final year project, Mehmaan aims to streamline and enhance the travel experience by enabling seamless communication and booking between travelers and tourism-related services.

📱 Features
🧭 Explore Destinations – Tourists can browse and discover popular travel spots with detailed information.

🤝 Connect with Service Providers – Enables direct interaction with hotels, tour guides, and transport services.

🔐 User Authentication – Secure login and registration with Firebase Authentication.

💬 Real-Time Messaging – Built-in chat system for seamless communication.

📆 Booking Management – Tourists can view and manage their bookings in-app.

📲 Cross-Platform – Developed using React Native for both Android and iOS compatibility.

🔧 Tech Stack
Technology	Usage
React Native	Frontend mobile application
Firebase	Backend services, including auth & DB
Firestore	Real-time database for storing data
Firebase Auth	User registration and login
CSS	Styling and UI design
🏗️ Architecture Overview
scss
Copy
Edit
React Native App
│
├── Firebase Auth (User Management)
├── Firestore (Tourist, Service Provider, Booking Data)
└── UI (React Native + CSS)
🚀 Getting Started
Clone the Repository

bash
Copy
Edit
git clone https://github.com/yourusername/mehmaan-tourism-app.git
cd mehmaan-tourism-app
Install Dependencies

bash
Copy
Edit
npm install
Set Up Firebase

Create a Firebase project.

Enable Firestore and Firebase Authentication (Email/Password).

Replace firebaseConfig in the project with your credentials.

Run the App

bash
Copy
Edit
npx react-native run-android
# or
npx react-native run-ios
📸 Screenshots


📚 Learnings & Challenges
Gained hands-on experience with cross-platform mobile development using React Native.

Integrated Firebase services for authentication and real-time data.

Learned how to design user-centric interfaces and manage complex app state.

📌 Future Improvements
Add payment gateway integration.

Implement push notifications.

Add multilingual support and offline mode.

👨‍💻 Author
Farhan Tariq
Email: farhantariq5251@gmail.com
