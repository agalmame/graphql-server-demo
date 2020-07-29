const express = require("express");
const graphqlHTTP  = require("express-graphql");
const schema = require("./schema.js");
const startDatabase = require('./database.js');
const expressPlayground = require('graphql-playground-middleware-express').default;
const isTokenValid = require("./validate.js");

// Provide resolver functions for your schema fields

const context = async req => {
	const db = await startDatabase();
	const { authorization: token } = req.headers;

	return { db, token};
}

const resolvers = {
	events: async(_, context) => {
		const { db, token } = await context();
		const { error } = await isTokenValid(token);
		const events = db.collection('events').find();

		return !error ? events.toArray() : events.project({ attendants: null }).toArray();

	},
	event: async ({ id }, context) => {
		const { db, token } = await context();
		const { error } = await isTokenValid(token);
		const event = await db.collection('events').findOne({ id });

		return !error ? event : {...event, attendants:null};


	},
	editEvent: async ({id,title,description}, context) => {
		const { db, token } = await context();
		const { error } = await isTokenValid(token);
		
		if(error){
			throw new Error(error)
		}

		return db
		.collection('events')
		.findOneAndUpdate(
			{ id },
			{ $set: {title, description }},
			{ returnOriginal: false },
		)
		.then(resp => resp.value);
	},
};

const app = express();
app.use(
  "/graphql",
  graphqlHTTP(async(req)=>({
    schema,
    rootValue: resolvers,
    context:() => context(req),
  }))
);
app.get('/playground', expressPlayground({endpoint: "/graphql"}))
app.listen(4000);

console.log(`🚀 Server ready at http://localhost:4000/graphql`);
