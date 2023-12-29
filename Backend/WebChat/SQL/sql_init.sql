DROP DATABASE `SP_Task`;
    CREATE DATABASE `SP_Task`;
    USE `SP_Task`;
  CREATE TABLE `User` (
    `user_id` INT PRIMARY KEY AUTO_INCREMENT,
    `username` TEXT,
    `email` varchar(255) unique,
    `password` TEXT NOT NULL,
    `role` ENUM('admin', 'member') DEFAULT 'member',
    `creation_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE `Task` (
    `task_id` INT PRIMARY KEY AUTO_INCREMENT,
    `title` TEXT,
    `description` TEXT,
    `points` INT
  );
CREATE TABLE `TaskProgress` (
  `progress_id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `task_id` INT NOT NULL,
  `completion_date` TIMESTAMP,
  `notes` TEXT,
  UNIQUE KEY `unique_user_task` (`user_id`, `task_id`),
  FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE, 
  FOREIGN KEY (`task_id`) REFERENCES `Task`(`task_id`) ON DELETE CASCADE 
);




CREATE TABLE `Guild_Roles` (
    `role_id` INT PRIMARY KEY AUTO_INCREMENT,
    `role_name` VARCHAR(50) NOT NULL UNIQUE,
    `default_role` BOOLEAN DEFAULT FALSE,
    `guild_id` INT,
    FOREIGN KEY (`guild_id`) REFERENCES `Guild`(`guild_id`) ON DELETE CASCADE
);

  CREATE TABLE `Channels` (
    `channel_id` INT PRIMARY KEY AUTO_INCREMENT,
    `channel_type` VARCHAR(10) NOT NULL,
    `channel_name` VARCHAR(32) NOT NULL,
    `guild_id` INT NOT NULL,
    UNIQUE KEY `unique_channel_guild` (`channel_id`, `guild_id`),
    FOREIGN KEY (`guild_id`) REFERENCES `Guild`(`guild_id`) ON DELETE CASCADE
  );

CREATE TABLE `Guild_membership` (
  `member_id` INT NOT NULL,
  `join_date` TIMESTAMP NOT NULL DEFAULT NOW(),
  `leave_date` TIMESTAMP,
  `role_id` INT DEFAULT 5, -- Set default value to 5
  `nickname` VARCHAR(32),
  `is_admin` BOOLEAN DEFAULT FALSE,
  `guild_id` INT NOT NULL,
  PRIMARY KEY (`member_id`, `guild_id`),
  FOREIGN KEY (`member_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`role_id`) REFERENCES `Guild_Roles`(`role_id`) ON DELETE SET DEFAULT 5, -- Set default value to 5 on delete
  FOREIGN KEY (`guild_id`) REFERENCES `Guild`(`guild_id`) ON DELETE CASCADE
);c
  CREATE TABLE `ChannelMembership` (
    `member_id` INT NOT NULL,
    `guild_id` INT NOT NULL,
    `channel_id` INT NOT NULL,
    `join_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `leave_date` TIMESTAMP,
    PRIMARY KEY (`member_id`, `guild_id`, `channel_id`),
    FOREIGN KEY (`member_id`, `guild_id`) REFERENCES `Guild_membership`(`member_id`, `guild_id`) ON DELETE CASCADE,
    FOREIGN KEY (`channel_id`, `guild_id`) REFERENCES `Channels`(`channel_id`, `guild_id`) ON DELETE CASCADE
  );

  CREATE TABLE `Guild_Roles` (
    `role_id` INT PRIMARY KEY AUTO_INCREMENT,
    `role_name` VARCHAR(50) NOT NULL UNIQUE,
    `default_role` BOOLEAN DEFAULT FALSE
  );

  CREATE TABLE `Permissions_Guild` (
    `permission_id` INT PRIMARY KEY AUTO_INCREMENT,
    `permission_name` VARCHAR(50) NOT NULL UNIQUE
  );

  CREATE TABLE `GuildRolesPermissions` (
    `role_id` INT NOT NULL,
    `permission_id` INT NOT NULL,
    PRIMARY KEY (`role_id`, `permission_id`),
    FOREIGN KEY (`role_id`) REFERENCES `Guild_Roles`(`role_id`) ON DELETE CASCADE,
    FOREIGN KEY (`permission_id`) REFERENCES `Permissions_Guild`(`permission_id`) ON DELETE CASCADE
  );





CREATE TABLE `Quest` (
  `quest_id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` TEXT,
  `description` TEXT,
  `reward_points` INT,
  `status` VARCHAR(20) DEFAULT 'active',
  `start_date` DATE,
  `end_date` DATE,
  `quest_master_id` INT NOT NULL,
  `guild_id` INT NOT NULL,
  FOREIGN KEY (`quest_master_id`) REFERENCES `User`(`user_id`),
  FOREIGN KEY (`guild_id`) REFERENCES `Guild`(`guild_id`)
);

  CREATE TABLE `UserQuestParticipation` (
    `user_id` INT NOT NULL,
    `quest_id` INT NOT NULL,
    `start_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `completion_date` TIMESTAMP,
    PRIMARY KEY (`user_id`, `quest_id`),
    FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`quest_id`) REFERENCES `Quest`(`quest_id`) ON DELETE CASCADE
  );

  CREATE TABLE `QuestContentDetails` (
      `content_id` INT PRIMARY KEY AUTO_INCREMENT,
      `quest_id` INT NOT NULL,
      `level` INT NOT NULL,
      `part` INT NOT NULL,
      `content_type` VARCHAR(20) NOT NULL,
      `content_description` TEXT,
      `pathway` VARCHAR(255), 
      UNIQUE KEY (`quest_id`, `level`, `part`),
      FOREIGN KEY (`quest_id`) REFERENCES `Quest`(`quest_id`) on DELETE CASCADE
  );

  CREATE TABLE `UserQuestProgress` (
    `user_id` INT NOT NULL,
    `quest_id` INT NOT NULL,
    `level` INT NOT NULL,
    `progress_percentage` INT,
    UNIQUE KEY (`user_id`, `quest_id`, `level`),
    FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`quest_id`, `level`) REFERENCES `QuestContentDetails`(`quest_id`, `level`) ON DELETE CASCADE
  );

