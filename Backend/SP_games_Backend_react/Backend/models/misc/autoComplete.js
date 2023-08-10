const model = require('../configurations/template');
const searc_auto ={
  getName : async (tableName,columName,Subst) =>{
    let id = tableName=='category' ? 'catid' : tableName=='platform' ? 'platformid' : '';
    return await model.async_template(
      `SELECT ??,${id} from ?? where ?? like concat('%', ? ,'%') limit 4`,
       [columName,tableName, columName, Subst]  )
    }
}
module.exports = searc_auto