const express = require('express');
const graphqlHTTP = require('express-graphql');
const { ApolloServer } = require('apollo-server-express');
const { port, environment } = require("./utils/config");
const mongoose = require('mongoose');

// connect to mongoose
require("./utils/dbCon");

const schema = require('./schema/schema');

const app = express();

// apollo server setup
const apolloServer = new ApolloServer({
    schema,
    cors: true,
    playground: (environment === 'development'),
    introspection: true,
    tracing: true,
    path: '/'
});

apolloServer.applyMiddleware({
    app,
    path: '/',
    cors: true,
    onHealthCheck: () =>
        new Promise((resolve, reject) => {
            if (mongoose.connection.readyState > 0) {
                resolve();
            } else {
                reject();
            }
        })
});

//fire graphql http - middleware
// app.use('/', graphqlHTTP({
//     schema: schema,
//     graphiql: true

app.listen({ port }, () => {
    console.log(`Server Listening on port ${port}`);
    console.log(`Health Check available at ----`);
});
