const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require('crypto');

class connection {
  // User is the username associated database access under security
  // Database is  the database inside a cluster
  // Collection is the collection inside a database
  /* Schema is the what the objects in the Collection look like
    Ex: const schema =  {
                         username : String,
                         password: String
                       }
   */
  constructor(user, database, collection, schema) {
    //Set up default mongoose connection
    this.uri = "mongodb+srv://" + user + ":cVJpGNvyGynM80dG@users-sltb1.mongodb.net/" + database + "?retryWrites=true&w=majority";
    mongoose.createConnection(this.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    //Get the default connection
    this.connection = mongoose.connection;
    this.collection = mongoose.model(collection, new Schema(schema), collection);

    // set up Grid File System for big files (photo, txt ect..)
    this.gfs;
    console.log('built');
  }

  addGridFS() {
    this.connection.once('open', () => {
      // Init stream
      this.gfs = Grid(this.connection.db, mongoose.mongo);
      this.gfs.collection(collection);
    });
    const storage = new GridFsStorage({
      url: this.uri,
      file: (req, file) => {
        return new Promise((resolve, reject) => {
          crypto.randomBytes(16, (err, buf) => {
            if (err) {
              return reject(err);
            }
            const filename = buf.toString('hex') + path.extname(file.originalname);
            const fileInfo = {
              filename: filename,
              bucketName: 'articles'
            };
            resolve(fileInfo);
          });
        });
      }
    });
    console.log('success');
  }




}

module.exports = connection;
