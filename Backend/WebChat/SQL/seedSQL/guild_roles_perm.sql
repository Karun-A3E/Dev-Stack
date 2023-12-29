INSERT INTO `Guild_Roles` (`role_name`, `default_role`) VALUES
  ('Guild Master', true),
  ('Vice Guild Master', true),
  ('S-Class Wizards', true),
  ('A-Class', true);

-- Insert default permissions
INSERT INTO `Permissions_Guild` (`permission_name`) VALUES
  ('Hosting Quests'),
  ('Adding Members'),
  ('Removing Members'),
  ('Access to all Channels'),
  ('Creating Channels'),
  ('Editing Channels'),
  ('Removing Channels'),
  ('Adding members to Channels'),
  ('Removing Members from Channels'),
  ('Defining new roles and assigning Members'),
  ('Changing Roles of Users'),
  ('Deleting the server');

-- Assign permissions to default roles
INSERT INTO `GuildRolesPermissions` (`role_id`, `permission_id`) VALUES
  (1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9), (1, 10), (1, 11), (1, 12),
  (2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6), (2, 7), (2, 8), (2, 9), (2, 10), (2, 11),
  (3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 7), (3, 8),
  (4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6), (4, 7), (4, 8);