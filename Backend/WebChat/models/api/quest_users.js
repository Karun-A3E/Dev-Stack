const model = require('../template')



const quest = {
    // Create a new quest
    CreateNewQuest: async (values) => {
      try {
        return model.async_template('INSERT INTO Quest (title, description, reward_points, start_date, end_date,quest_master_id,guild_id) VALUES (?, ?, ?, ?, ?,?,?)', values);
      } catch (error) {
        throw error;
      }
    },
  
    // Get all quests
    GetAllQuests: async () => {
      try {
        return model.async_template('SELECT * FROM Quest');
      } catch (error) {
        throw error;
      }
    },
  
    // Get a specific quest by ID
    GetQuestInfo: async (questID) => {
      try {
        return model.async_template('SELECT * FROM Quest WHERE quest_id = ?', questID);
      } catch (error) {
        throw error;
      }
    },
  
    // Delete a quest
    DeleteQuest: async (questID) => {
      try {
        return model.async_template('DELETE FROM Quest WHERE quest_id = ?', questID);
      } catch (error) {
        throw error;
      }
    },
  
    // Edit quest information
    UpdateQuest: async (values, questID) => {
      try {
        const query = 'UPDATE Quest SET ? WHERE quest_id=?';
        return model.async_template(query, [values,questID]);
      } catch (error) {
        throw error;
      }
    },

    AddQuestContent: async (values) => {
      try {
        const query = 'INSERT INTO QuestContentDetails (quest_id, level, part, content_type, content_description, pathway) VALUES (?, ?, ?, ?, ?, ?)';
        return model.async_template(query, values);
      } catch (error) {
        throw error;
      }
    },
  
    // Get all content for a specific quest
    GetQuestContent: async (questID) => {
      try {
        const query = 'SELECT * FROM QuestContentDetails WHERE quest_id = ?';
        return model.async_template(query, questID);
      } catch (error) {
        throw error;
      }
    },
  
    // Get content by level and part for a specific quest
    GetQuestContentByLevelAndPart: async (questID, level, part) => {
      try {
        const query = 'SELECT * FROM QuestContentDetails WHERE quest_id = ? AND level = ?';
        return model.async_template(query, [questID, level, part]);
      } catch (error) {
        throw error;
      }
    },
  
    // Remove content by content ID
    RemoveQuestContent: async (contentID) => {
      try {
        const query = 'DELETE FROM QuestContentDetails WHERE content_id = ?';
        return model.async_template(query, contentID);
      } catch (error) {
        throw error;
      }
    },
  
    // Edit content by content ID
    EditQuestContent: async (values, contentID) => {
      try {

        return model.async_template('update QuestContentDetails set ? where quest_id=?', [values,contentID]);
      } catch (error) {
        throw error;
      }
    },
    AddUserQuestParticipation: async (values) => {
      try {
        const query = 'INSERT INTO UserQuestParticipation (user_id, quest_id) VALUES (?, ?)';
        return model.async_template(query, values);
      } catch (error) {
        throw error;
      }
    },
  
    // Remove user participation in a quest
    RemoveUserQuestParticipation: async (userID, questID) => {
      try {
        const query = 'DELETE FROM UserQuestParticipation WHERE user_id = ? AND quest_id = ?';
        return model.async_template(query, [userID, questID]);
      } catch (error) {
        throw error;
      }
    },
  
    // Set completion status of a user for a quest
    SetUserQuestCompletionStatus: async (userID, questID, completionDate) => {
      try {
        const query = 'UPDATE UserQuestParticipation SET completion_date = ? WHERE user_id = ? AND quest_id = ?';
        return model.async_template(query, [completionDate, userID, questID]);
      } catch (error) {
        throw error;
      }
    },
    GetUserQuests: async (userID) => {
      try {
        const query = 'SELECT * FROM UserQuestParticipation WHERE user_id = ?';
        return model.async_template(query, userID);
      } catch (error) {
        throw error;
      }
    },
};

module.exports = quest