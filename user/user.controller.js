const UserSchema = require('./user.module.js');

const save_user = async(req, res, next)=>{
  if(req.body == null) return (404, 'Usern not found in body request')
  const user = req.body;
  let response = {};
  response = await save_user_logic(user)
  return res.status(201).send(response)
}

const hello_user = async (req, res, next)=>{
  if(req.params == null) return (404, 'User not found in body request');
  const user = req.params.par1;
  let response = {};
  response = await hello_user_logic(user);
  return res.status(201).send(response);
}

module.exports = {
  save_user  : save_user,
  hello_user : hello_user
}

const hello_user_logic = async(user)=>{
  return new Promise(async(resolve, reject)=>{
    let result;
    if(user.length >= 5) result = user;
    if(user.length < 5) return reject('message under 5 character')
    return resolve(result);
  });
};

const save_user_logic = async(user)=>{
  return new Promise(async(resolve, reject)=>{
    const presave = new UserSchema(user);
    const result = await presave.save(function(err) {
      if (err) throw err;
      console.log('Salvataggio completato');
    });
    return resolve(result)
  });
};
