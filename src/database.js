const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');

let database = null;


async function startDatabase() {
	const mongo =  new MongoMemoryServer();
	const mongoDBURL = await mongo.getConnectionString();
	console.log(mongoDBURL)
	const connection = await MongoClient.connect(mongoDBURL,{
		useUnifiedTopology: true 
	})


	if(!database){
		database = connection.db();
		await database.collection('events').insertMany([
			{
				id: 1,
				title: "GraphQL Introduction Night",
				description: "Introductionary night to GraphQL",
				data : "2019-11-06T17:34:25+00:00",
				attendants: [
					{
						id: 1,
						name: "Peter",
						age: 34
					},
					{
						id: 2,
						name: "kassandra",
						age: 24
					},
					{
						id:3,
						name: "yassine",
						age: 27,
					}
				]
			},
			{
				id: 2,
				title: "GraphQL Introduction Night #2",
				description: "Introductionary night to GraphQL",
				data : "2019-11-06T17:34:25+00:00",
				attendants: [
					{
						id:3,
						name: "yassine",
						age: 27,
					}
				]
			}
		])
	}

	return database;
}

module.exports = startDatabase;
