const model = require('../template');

const Guild = {
  CreateNewGuild : async(values) =>{
    try {
      console.log(values)
      return model.async_template('Insert into Guild (guild_name,description,banner,logo) values (?,?,?,?)',values);
    } catch (error) {
      throw error
    }
  },
  GetGuildInfo : async(id)=>{
    try {
      return model.async_template('SELECT * from guild where guild_id = ?',id)
    } catch (error) {
      throw error
    }
  },
  DeleteGuild : async(id)=>{
    try {
      return model.async_template('DELETE from guild where guild_id = ?',id)
    }
    catch(error){
      throw error
    }
  },
  UpdateGuild : async(values,guildID) =>{

    try {
      return model.async_template("update guild set ? where guild_id =?",[values,guildID])
    } catch (error) {
      throw error
    }
  },
  getGuildCount : async(id)=>{
    let sql_query = 'SELECT count(*) from guild where guild_id = ?'
    try {
      return model.async_template(sql_query,id)
    } catch (error) {
      throw error
    }
  },
  getAllGuilds : async()=>{
    try {
      return model.async_template('SELECT * from guild')
    } catch (error) {
      throw error      
    }
  },
  addGuildMember : async(values) =>{
    try {
      return model.async_template('INSERT into guild_membership (member_id,role_id,nickname,is_admin,guild_id) values (?,?,?,?,?) ',values)
    } catch (error) {
      throw error
    }
  },
  RemoveGuildMember : async(member_id,guild_id) =>{
    try {
      return model.async_template('Delete from guild_membership where member_id=? and guild_id=?',[member_id,guild_id])
    } catch (error) {
      throw error
    }
  },
  editMemberInfo : async(memberID,guildID,values)=>{ 
    try {
      return model.async_template('UPDATE guild_membership set ? where member_id=? and guild_id=? ',[values,memberID,guildID])
    } catch (error) {
      throw error
    }
  },
  getMyInfo : async(memberID, guildID)=>{
    try {
      return model.async_template('SELECT * from guild_membership where member_id =? and guild_id=?',[memberID,guildID])
    } catch (error) {
      
    }
  },
  ChangeMemberRoles_Admin : async(id,values)=>{ 
    try {
      return model.async_template('update guild_membership set ? where member_id=?',[values,id])
    } catch (error) {
      throw error
    }
  },
  createChannel : async(values) =>{
    try {
      return model.async_template('INSERT into channels (channel_type,channel_name,guild_id) values (?,?,?)',values)
    } catch (error) {
      throw error
    }
  },
  deleteChannel : async(id) =>{
    try {
      return model.async_template('DELETE from channels where channel_id=?',id)
    } catch (error) {
      throw error
    }
  },
  getChannelsByGuild : async(guildID) =>{
    try {
      return model.async_template('select c.channel_id, g.guild_name,c.channel_name,c.channel_type FROM channels C join guild g on g.guild_id = c.guild_id where c.guild_id = ?',guildID)
    } catch (error) {
      throw error
    }
  },
  EditChannelInfo : async(channelID,values) =>{
    try {
      return model.async_template('UPDATE channels set ? where channel_id=?',[values,channelID])
    } catch (error) {
      throw error
    }
  },
  addChannelMemberAsync : async(values) =>{
    try {
      return model.async_template("INSERT into channelmembership (member_id,guild_id,channel_id) values (?,?,?)",values)
    } catch (error) {
      throw error
    }
  },
  addChannelMember : async(values,callback)=>{
    try {
      return model.template("INSERT into channelmembership (member_id,guild_id,channel_id) values (?,?,?)",values,callback)
    } catch (error) {
      
    }
  },
  removeChannelMember : async(values) =>{
    try {
      return model.async_template('DELETE From channelmembership where channel_id=? and member_id=?',values)
    } catch (error) {
      throw error
    }
  },
  getGuildMembers : async(guildID) =>{
    try {
      return model.async_template('SELECT u.user_id, u.username, g.join_date, gr.role_name AS role, g.nickname, r.guild_name FROM guild_membership g JOIN user u ON g.member_id = u.user_id JOIN guild r ON r.guild_id = g.guild_id JOIN guild_roles gr ON g.role_id = gr.role_id WHERE g.guild_id = ?;',guildID)
    } catch (error) {
      throw error
    }
  },
  checkIFActiveMemberInGuild : async(memberID,guildID)=>{
    try {
      return model.async_template('select count(*) from guild_membership where guild_id=? and member_id=?',[guildID,memberID])
    } catch (error) {
      throw error
    }
  },
  getChannelMembers : async(guildID,channelID) =>{
    try {
      return model.async_template('SELECT * From channelmembership where channel_id=? and guild_id=?',[channelID,guildID])
    } catch (error) {
      throw error
    }
  },
  getGuildMemberProfile : async(guildID,memberID)=>{
    try {
      return model.async_template('SELECT u.user_id, u.username, g.join_date, gr.role_name AS role, g.nickname, r.guild_name FROM guild_membership g JOIN user u ON g.member_id = u.user_id JOIN guild r ON r.guild_id = g.guild_id JOIN guild_roles gr ON g.role_id = gr.role_id WHERE g.guild_id = ? and g.member_id = ?',[guildID,memberID])
    } catch (error) {
      
    }
  },
  getAllGuildOfMine : async(memberID)=>{
    try {
      return model.async_template('select  g.guild_id , g.guild_name from guild_membership gm join guild g on g.guild_id = gm.guild_id WHERE member_id=?',[memberID])
    } catch (error) {
      throw error
    }
  },
  ChangeMemberRole: async (member_id, guild_id, new_role_id) => {
    try {
      return model.async_template('UPDATE guild_membership SET role_id = ? WHERE member_id = ? AND guild_id = ?', [new_role_id, member_id, guild_id]);
    } catch (error) {
      throw error;
    }
  }
  
};

module.exports = Guild


