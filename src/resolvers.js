import { GraphQLJSONObject } from "graphql-type-json";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Visage, User } from "./models/index.js";

const resolvers = {
	JSONObject: GraphQLJSONObject,
	Query: {
		users: async (parent, { filter }) => {
			return await User.find(filter);
		},
		user: async (parent, { id }) => {
			return await User.findById(id);
		},
		visages: async (parent, { filter }) => {
			return await Visage.find(filter);
		},
		visage: async (parent, { id }) => {
			return await Visage.findById(id);
		},
		viewer: async (parent, args, { user }) => {
			return await User.findById(user.sub);
		},
	},
	Mutation: {
		addUser: async (parent, { username, password }) => {
			try {
				if ((await User.find({ username })).length) {
					throw "Username already exists";
				}
				const hPassword = await bcrypt.hash(password, 10);
				const user = new User({ username, password: hPassword });
				return await user.save();
			} catch (err) {
				return null;
			}
		},
		updateUser: async (parent, { id, update }) => {
			return await User.findByIdAndUpdate(id, update);
		},
		deleteUser: async (parent, { id }) => {
			return await User.findByIdAndDelete(id);
		},
		addVisage: async (parent, { visage: visageFields }) => {
			try {
				const visage = new Visage(visageFields);
				return await visage.save();
			} catch (err) {
				console.log(err);
				return null;
			}
		},
		updateVisage: async (parent, { id, update }) => {
			return await Visage.findByIdAndUpdate(id, update);
		},
		deleteVisage: async (parent, { id }) => {
			return await Visage.findByIdAndDelete(id);
		},
		login: async (parent, { username, password }) => {
			const [user] = await User.find({ username });
			try {
				if (!user) throw `Could not find username ${username}`;

				if (await bcrypt.compare(password, user.password)) {
					return {
						user,
						token: jwt.sign(
							{ payload: { roles: "user" } },
							process.env.SECRET,
							{
								subject: user._id.toString(),
								algorithm: "HS256",
								expiresIn: "15m",
							}
						),
					};
				} else {
					throw "Incorrect password";
				}
			} catch (err) {
				return { error: err.toString() };
			}
		},
	},
	User: {
		visage: async (parent) => {
			return await Visage.findOne({ ownerId: parent._id });
		},
	},
	Visage: {
		owner: async (parent) => {
			return await User.findById(parent.ownerId);
		},
	},
};

export default resolvers;
