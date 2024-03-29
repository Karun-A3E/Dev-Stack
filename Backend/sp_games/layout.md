The following contains the directory Listing for the Project

|   
+---endpoints.md
|
+--layout.md
|   
+---package-lock.json
|   
+---package.json
|   
+---readme.md
|   
+---server.js
|   
+---controller
|       app.js
|       
+---models
|       databaseconfig.js
|       template.js
|       UserDB.js
|       validation.js
|       
+---node_modules
|
|           
\---sql
      sql_init.sql
      sql_procedure.sql
      sql_seed.sql
      sql_trigger.sql
      views.sql

# Folder Layout

The above shows the folder layout for the project, and the following will contain the explaination, the need for the folders and files
|
+---endpoints.md : This markdown file contains the endpoints information that was provided in the assigment brief
|
+---layout.md : This markdown file contains the layouts of the folder and sql database
|
+---package-lock.json : This file contains the package lock information for the project
|
+---package.json : This file contains the package information for the project
|
+---readme.md : This markdown file contains the readme information for the project
|
+---server.js : This file contains the server information for the project
|
+---controller : This folder contains the API Routing that is imported over to the server.js
|
+---models : This folder contains the Model Files that are imported over to the server.js
|       |
|       +--databaseconfig.js : This js file contains the database login credintials in a object
|       |
|       +--template.js : This JS file contains the object that is going to be used to pass the sql commands and values over to the databse 
|       |
|       +--UserDB.js : This JS file will call the template.js object and pass in the values 
|       |
|       +--validation.js : This JS file will contain certain validation properties that are called in some instances
|
|  
|
+---sql : This folder contains the SQL Statements that are required for the set-up of the sql Database; the following contains the run procedure as well as explaination
    |
    +--sql_init.sql : This file contains the tables that are required for the database
    |
    +--sql_seed.sql : This file contains the seed vales that are inserted into the tables
    |
    +--sql_procedure : This files contain the procedures that are going to be used in the database
    |
    +--sql_trigger : This file contains the triggers required for running the database
    |
    +--view.sql : This file contains the views that are required for the get request for the user and are set to allow a certain level of security
    |
    +--recovery_sql.sql : This file contains a method to recover user accounts

# SQL database

sp_games
├── users
│   ├── userid (PK)
│   ├── username (UNIQUE)
│   ├── password
│   ├── email (UNIQUE)
│   ├── profile_pic_url
│   └── created_at
|       ├── users_after_delete_trigger ─────────────────────────┐
│           ├── users (Affected by users_after_delete_trigger) ─┘
│           └── temporary_users (Trigger inserts deleted user info)
│       └── users_view ← View Reference
|
├── games
│   ├── gameid (PK)
│   ├── title (UNIQUE)
│   ├── description
│   ├── price
│   ├── platformid
|             └── games (Affected by platforms_AFTER_DELETE_TRIGGER)
│   ├── categoryid 
|               └── category (Affected by category_after_delete_TRIGGER)
│   ├── released_year
│   └── created_at
│       ├── games_BEFORE_INSERT_TRIGGER ──────────────┐
│       ├── games_BEFORE_UPDATE_TRIGGER ──────────────┴────────┐
│       └── filter_values_PROCEDURE ───────────────────────────┐
│                                                              └── games (Affected by filter_values_PROCEDURE)
│
├── category
│   ├── catid (PK)
│   ├── catname (UNIQUE)
│   ├── cat_description
│   └── created_at
│       ├── category_after_delete_TRIGGER ─────────────┐
│                                                      
│
├── platform
│   ├── platformid (PK)
│   ├── platform_name (UNIQUE)
│   ├── platform_description
│   └── created_at
│       └── platforms_AFTER_DELETE_TRIGGER ──────────┐
│                                                    
│
├── reviews
│   ├── reviewid (PK)
│   ├── user_id ──────────────┐
│   ├── game_id ──────────────┴───────────────┐
│   ├── rating                                │
│   ├── review                                │
│   └── created_at                            │
│                                             ▼
│                                        Cascade Delete
│
├── temporary_users
│   ├── userid (PK)
│   ├── username
│   ├── email
│   ├── profile_pic_url
│   └── created_at
│
│
├── restore_user_data_PROCEDURE ───────────────────────────┐
│   ├── users (Affected by restore_user_data_PROCEDURE) ───┘
│   └── temporary_users (Restores deleted user info)
│
└── users_view_VIEW
    ├── userid
    ├── username
    ├── email
    ├── ProfilePic
    ├── profile_pic_url
    └── created_at

## Triggers & Procedures

There are 4 Triggers active in this database : 
  1. games_BEFORE_INSERT_TRIGGER : Before insert, the trigger is activated and it will call the proceudre filter_values_PROCEDURE
  2. games_BEFORE_UPDATE_TRIGGER : Before update, the trigger is activated and it it will the procedure filter_values_PROCEDURE
  3. category_after_delete_TRIGGER : After category deleted, any categoryid value stroed in the games table is removed/trimed
  4. platforms_AFTER_DELETE_TRIGGER : After platform deleted, any platformid value stroed in the games table is removed/trimed
  5. users_after_delete_trigger : After the user is deleted, the user account is added to temperory_users, which will delete everything after 15 days
There are 2 Procedures in this database : 
  1. filter_values_PROCEDURE : Checks if the values entered in the platformid and categoryid in games tables, if the number or value is not found, removed else it remains.
  2. restore_user_data_PROCEDURE : If called, the specific userid is restored back to the user table, if not called within 15 days of delete, user record is deleted