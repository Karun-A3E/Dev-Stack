const model =require('../template');

const guildRole = {
  checkOwnerAccess : (guildId,userid)=>{
    try {
      console.log(guildId,userid)
      return model.async_template('SELECT count(member_id) as count from guild_membership where guild_id =? and is_admin=1 and member_id=?',[guildId,userid])
    } catch (error) {
      throw error
    }
  },
  checkIfuserIsPartOfGuild : (guildId,userid) =>{
    try {
      return model.async_template('SELECT count(member_id) as count from guild_membership where guild_id =? and member_id=?',[guildId,userid])
    } catch (error) {
      throw error
    }
  },
  checkUserPerm : (userid,guildId,permID)=>{
    try {
      return model.async_template('SELECT count(gm.member_id) as member FROM Guild_membership gm JOIN Guild_Roles gr ON gm.role_id = gr.role_id JOIN GuildRolesPermissions grp on grp.role_id = gr.role_id where gm.member_id =? and gm.guild_id =? and grp.permission_id=?',[userid,guildId,permID])
    } catch (error) {
      throw error
    }
  },
  postNewRole : (values)=>{
    try {
      return model.async_template('INSERT into guild_roles (role_name,default_role,guild_id) values (?,?,?)',values)
    } catch (error) {
      throw error
    }
  },
  postNewPerm : (values)=>{
    try {
      return model.async_template('Insert into guildrolespermissions (role_id,permission_id) values (?,?)',values)
    } catch (error) {
      throw error
    }
  },
  CheckCustomGuildRole: async (role_id, guild_id) => {
    try {
      const result = await model.async_template('SELECT COUNT(*) AS count FROM Guild_Roles WHERE role_id = ? AND default_role = 0 AND guild_id = ?', [role_id, guild_id]);
      return result[0].count > 0;
    } catch (error) {
      throw error;
    }
  },
  AddGuildRolePermission: async (role_id, permission_id) => {
    try {
      return model.async_template('INSERT INTO GuildRolesPermissions (role_id, permission_id) VALUES (?, ?)', [role_id, permission_id]);
    } catch (error) {
      throw error;
    }
  },
  
  // Model Method to Remove Permission from Guild Role
  RemoveGuildRolePermission: async (role_id, permission_id) => {
    try {
      return model.async_template('DELETE FROM GuildRolesPermissions WHERE role_id = ? AND permission_id = ?', [role_id, permission_id]);
    } catch (error) {
      throw error;
    }
  },
  DeleteCustomGuildRole: async (role_id, guild_id) => {
    try {
      return model.async_template('DELETE FROM Guild_Roles WHERE role_id = ? AND default_role = 0 AND guild_id = ?', [role_id, guild_id]);
    } catch (error) {
      throw error;
    }
  },
  checkChannelAccess : async(channel_id,guild_id,member_id)=>{
    try {
      return model.async_template('select count(member_id) as count from channelmembership where channel_id=? and guild_id=? and member_id=?',[channel_id,guild_id,member_id])
    } catch (error) {
      throw error
    }
  }
};


module.exports = guildRole

