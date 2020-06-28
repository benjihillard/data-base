const  connection  = require('./database.js')
const schema = { username : String, password: String};
mongo = new connection('pistil','user', 'usernames', schema);
mongo.addGridFS();
