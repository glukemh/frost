const { gql } = require("apollo-server");

const typeDefs = gql`
	scalar JSONObject

	type Query {
		users(filter: UserFields): [User]
		user(id: ID!): User
		visages(filter: VisageFields): [Visage]
		visage(id: ID!): Visage
	}

	type Mutation {
		addUser(name: String, username: String!, password: String!): User!
		updateUser(id: ID!, update: UserFields!): User!
		deleteUser(id: ID!): User
		addVisage(ownerId: ID!): Visage!
		updateVisage(id: ID!, update: VisageFields!): Visage!
		deleteVisage(id: ID!): Visage
	}

	type User {
		_id: ID!
		name: String
		username: String!
		password: String!
		email: String
		visage: Visage
	}

	type Visage {
		_id: ID!
		name: String!
		owner: User
		content: JSONObject
	}

	input UserFields {
		name: String
		username: String
		password: String
		email: String
		visageId: String
	}

	input VisageFields {
		name: String
		ownerId: String
		content: JSONObject
	}
`;

module.exports = typeDefs;