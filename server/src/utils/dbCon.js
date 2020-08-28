const mongoose = require('mongoose');
const { mongoURI } = require("./config");

mongoose.Promise = global.Promise;
const options = {
    autoIndex: true,
    poolSize: 50,
    bufferMaxEntries: 0,
    keepAlive: 120,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
}
const atlasConnection = mongoose.connect(mongoURI, options);

atlasConnection
    .then(async (db) => {
        const { version } = await mongoose.connection.db.admin().serverInfo();
        console.log(`connection open : ${mongoURI} , MongoDB version ${version}`);
        return db;
    })
    .catch(err => {
        console.log(err);
    });

module.exports = atlasConnection;
