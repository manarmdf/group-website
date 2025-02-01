overview
the project is a vision board website designed to help users set, track,
and reflect on their yearly goals in an organized and visually engaging way. Users can add goals for each month,
create vision boards to represent their aspirations, and monitor their progress over time.



Setup

Follow these steps to install, configure, and run the project locally.

Prerequisites

Before running the project, make sure you have the following installed:

Node.js (LTS version recommended)
MongoDB (or use MongoDB Atlas for cloud storage)
Git (for cloning the repository)
A code editor like VS Code
Installation Steps

1. Clone the Repository
Open a terminal and run:

git clone https://github.com/your-username/your-repository.git
cd your-repository
2. Install Dependencies
Run the following command inside the project folder:

npm install
Configuration

3. Set Up Environment Variables
Create a .env file in the root directory.
Add the following variables:
MONGODB_URI=your-mongodb-connection-string
PORT=3000
Replace your-mongodb-connection-string with your actual database connection string.
Running the Project

4. Start the Application
Run the following command:

npm start
Or, if you're using nodemon (for automatic server restarts):

npm run dev
5. Access the Website
Once the server is running, open your browser and visit:

http://localhost:3000
Additional Notes

If using MongoDB locally, make sure your database server is running before starting the project:
mongod
If using MongoDB Atlas, ensure your IP is whitelisted in the Network Access settings.
If you face any issues, check the logs in the terminal for error messages


Technologies used Node.js, Express, MongoDB, EJS, HTML, CSS).


Future Work
* User authentication (login/signup)
* Dark mode or Ul improvements

  Resources

* MongoDB - MongoDB Documentation
* Bootstrap - Bootstrap Documentation
* EJS (Embedded JavaScript) - EJS
