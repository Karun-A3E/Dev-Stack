# SP Games

Project Overview:
SP_games is an exciting full stack project that brings together the power of React and MySQL to create a dynamic gaming platform. This project aims to provide gamers with a user-friendly interface to discover, explore, and engage with their favorite games.

Key Features:

1. Game Library: Browse through an extensive collection of games with detailed information, including title, description, release year, and average rating.
2. Platform and Price Tracking: Stay informed about game availability on various platforms and their corresponding prices.
3. Bookmark and Rating: Users can bookmark their favorite games and rate them based on their gaming experience.
4. Category Sorting: Explore games categorized into different genres for easy navigation.
5. Profile Picture Upload: Personalize your gaming profile by uploading your preferred profile picture.

Tech Stack:
1. Frontend: React.js, Material-UI
2. Backend: Node.js, Express.js
3. Database: MySQL, Redis


Getting Started : 
Clone this repository to your local machine.
Install dependencies using `npm install`.
Set up the MySQL database with appropriate configurations, by runing `npm run project -- localhost MYSQL_username MYSQL_passwd`
Start the development server using npm start.

<!-- Project Details -->

1. Backed : This folder is going to be used to contain the Backend Logic Of this Project
  1.1 Backend is going to contain the SQL database logic and API
  1.2 Runs on http://localhost:8081
2. frontend_sp_games : This folder is going to be used to contain the Frontend Logic
  1.1 frontend is going to be using React and MUI
  1.2 Runs on http://localhost:3000


# Backend Side

For the Backend side, we are using the Express JS, MYsql and Redis as Tech Stack.

#### Packages Involved are : 
  - express (for creating a webserver)
  - mysql (to connect with our sql db )
  - bodyparser(To parse request bodies in JSON format.)
  - cors (Cross Origin Resource Sharing To allow cross origin requests from other domains).
  - axios (To perform requests IF required)
  - cookie-parser (To store data in the form of cookies)
  - jsonwebtoken (To sign Tokens for authenticity)
  - multer (To perform photo uploads)
  - redis (To enable connection to a Redis Server)
  - xlsx (To read Excel Sheets for Database Initialization)

#### Folder Directory
  - auth
    - secretKey.js : This contains the keys involved for Keys
    - verifyToken.js : This contains the Verification of Tokens
  - controller
    - App.js : This will contain all the API Endpoints
  - models
    - configurations : This will contain the Config for the Backend
        - databaseconfig.js : This will contain the Database Configurations for the Connection
        - redisconfig.js : This will contain the Reids Connection for the Redis Database
        - rules.json : This contains certain Filter Rules, but it can contain anything for Website Rules that have to be enforced on the Backend itself
        - template.js : This contains the templates used to parse data over to the MYsql
    - Endpoints : The file that contains all the Endpoint Methods
        - bookmarks_view.js
        - category_platforms.js
        - gamesEndpoints.js
        - orders_payments.js
        - reviews.js
        - rules.js
        - Shop.js
        - usrendpoints.js
    - misc : This file contains certain misc functionalities
  - node_modules  : This contains the Node Modules
  - public : This Directory contains Images, but it can contain server-side-rendering files like server-status or whatsoever
  - SQL : COntains the SQL Files related to the Project
      - SQL_seed : Contains the SQL Seed for the Project
        - db_init.js : Contains the DB Initialization for running the SQL Scripts into SQL
        - db_seed.js : Contains the Logic for extracting teh Seed Value from excel and writing to sql_seed.sql
        - SQL_data.xlsx : Contains the Excel data for the Database
        - sql_seed.sql : Contains the Seed Values that is given by the db_seed.js
      - sql_init.sql : The SQL Script for preparing the Tables
      - sql_views.sql : The SQL Script for preparing the Views for the Database
  - package-lock.json
  - package.json
  - server.js : The Logic that will run the Server itself

### API Endpoints

Refer to the api_documentation.yaml or the API_docu for Markdown
### Front End React Compnents
│   App.css
│   App.js
│   index.css
│   index.js
│
├───components
│   │   Authenticate.jsx : Login and Sign Up page
│   │   Footer.jsx : Footer of the Page 
│   │   index.jsx : Central Exports for Common Components
│   │   Navbar.jsx : Navbar 
│   │   Sidebar.jsx : Sidebar
│   │   UserProfile.jsx : User Card
│   │
│   ├───Admin
│   │       CategoryInfo.jsx : Category DB
│   │       GameInfo.jsx : Game DB
│   │       PlatformInfo.jsx : Platform DB
│   │       TableInfo.jsx : The table Component that renders the table
│   │       UsersInfo.jsx : User DB
│   │
│   ├───Cards
│   │       Button.jsx : Custom Button 
│   │       Cart.jsx : Cart Profile
│   │       ListOrdersStatus.jsx : Order Status Table for User Settings Page
│   │       MessageCards.jsx : Game Cards
│   │       ProductCard.jsx : Merch Product Card
│   │       ReviewCard.jsx : Review Rendering Card
│   │       ReviewDynamic.jsx 
│   │
│   ├───defaultMulti-Components
│   │   │   AccountSettings.jsx : Account Settings
│   │   │   CarouselCard.jsx : Carousel Card 
│   │   │   HomepageShop.jsx 
│   │   │   InfoCard.jsx
│   │   │   OrderDetails.jsx
│   │   │   ProfilePicUpload.jsx
│   │   │   UserForm.jsx
│   │   │   UserSettings.jsx
│   │   │
│   │   └───CreditCard
│   │           CreateCard.jsx : New Card Form
│   │           GooglePay.jsx : GOogle SVG
│   │           MasterCard.jsx : Mastercard SBG
│   │           Paypal.jsx : Paypal SVG
│   │           svgCreditCard.css : Stlyes
│   │           Visa.jsx : VISA SVG
│   │
│   └───Forms
│           AddPayment.jsx
│           AddReview.jsx
│           CategoryInfo.jsx
│           GameInfoForm.jsx
│           PlatformEdit.jsx
│           RatingWithText.jsx
│           UserConfirmBox.jsx
│
├───configurations
│       axios.js : Axios Interceptors
│       MemberRules.js  : Member Rules like Navbar
│       mics.js 
│       PrivateWrapper.jsx : Wrapper to imlpement auth
│       styles.css 
│       website_rules.js : Contains rules that can be edited
│
├───contexts
│       ContextProvider.js
│
└───pages
    │   Auth.jsx : Login and Sign Up
    │   index.jsx
    │   Overview.jsx
    │   Search.jsx
    │
    ├───AdminPages
    │       DataOverview.jsx
    │       Search.jsx
    │
    ├───charts
    │       Area.jsx
    │       Line.jsx
    │       Pie.jsx
    │
    ├───dynamic_links
    │       GameShow.jsx
    │       ProductShow.jsx
    │
    └───MemberPages
            Checkout.jsx
            Settings.jsx

#### React Components
Based on the provided directory tree, here is an overview that discusses the components used in a React project:

1. **App.js and index.js:**
   These are the main entry points of the React application. `index.js` is the entry point where React is initialized and the root component, `App.js`, is rendered.

2. **components:**
   This directory contains various reusable components that are used throughout the application. Some of the notable components are:
   - `Authenticate.jsx`: A component responsible for authentication and user login.
   - `Footer.jsx`: A component representing the application footer.
   - `Navbar.jsx`: A component displaying the navigation bar.
   - `Sidebar.jsx`: A component showing a sidebar menu.
   - `UserProfile.jsx`: A component displaying user profile information.

3. **components/Admin:**
   This directory contains components related to the admin dashboard or functionalities. Some of the components are `CategoryInfo.jsx`, `GameInfo.jsx`, `PlatformInfo.jsx`, `TableInfo.jsx`, and `UsersInfo.jsx`. These components might be responsible for displaying information and data related to various entities in the application.

4. **components/Cards:**
   This directory contains components related to cards and card-like UI elements. Some of the components are `Button.jsx`, `Cart.jsx`, `ListOrdersStatus.jsx`, `ProductCard.jsx`, `ReviewCard.jsx`, and `ReviewDynamic.jsx`. These components likely represent different types of cards used throughout the application, such as product cards, review cards, etc.

5. **components/defaultMulti-Components:**
   This directory contains multi-purpose components that can be reused in different parts of the application. For example, `HomepageShop.jsx` might be a component for displaying a shop section on the homepage.

6. **components/defaultMulti-Components/CreditCard:**
   This sub-directory contains components related to credit card payment methods. The components like `CreateCard.jsx`, `GooglePay.jsx`, `MasterCard.jsx`, `Paypal.jsx`, and `Visa.jsx` might represent different payment options.

7. **components/extras:**
   This directory contains additional components that might provide extra functionalities or visual elements. For instance, `ImageWithTitle.jsx` and `ProgressBar.jsx` could be extra UI elements used throughout the application.

8. **components/Forms:**
   This directory contains components related to various forms used in the application. Examples include `AddPayment.jsx`, `AddReview.jsx`, `CategoryInfo.jsx`, `GameInfoForm.jsx`, etc.

9. **configurations:**
   This directory contains various configuration files and helper functions for the application. For example, `axios.js`  contain configurations for intercepting and making HTTP requests using Axios, and `ContextProvider.js` might provide context to the application.

10. **contexts:**
    This directory contains context-related files. `ContextProvider.js` is likely the provider for application-wide contexts.

11. **pages:**
    This directory contains different pages or views of the application. Some of the notable pages are:
    - `Auth.jsx`: A page related to authentication.
    - `Overview.jsx`: An overview page that might show a summary of data or a dashboard.
    - `Search.jsx`: A page for searching.
    - `Shop.jsx`: A page representing the main shop or store section.

12. **pages/AdminPages:**
    This directory contains pages specific to the admin dashboard or settings. For example, `DataOverview.jsx` might show an overview of data.

13. **pages/charts:**
    This directory contains pages related to various charts used in the application, such as `Area.jsx`, `BarGraph.jsx`, `Financials.jsx`, `Line.jsx`, and `Pie.jsx`.

14. **pages/dynamic_links:**
    This directory contains pages that dynamically display links for games and products. For example, `GameShow.jsx` and `ProductShow.jsx` might represent dynamic links to specific games or products.

15. **pages/MemberPages:**
    This directory contains pages specific to the member area. For instance, `Checkout.jsx` and `Settings.jsx` might represent the checkout and settings pages for members, respectively.

