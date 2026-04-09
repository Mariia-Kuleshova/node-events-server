import { gql } from "apollo-server-express";
import { db } from "./config/db.js";

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    role: String!
  }

  type Participant {
    id: ID!
    name: String!
    email: String!
    eventId: Int!
  }

  type Event {
    id: ID!
    title: String!
    date: String!
    organizer: String!
    creatorId: Int
    participants: [Participant] # Nested field
  }

  type Query {
    # Додано фільтрацію за назвою (search) та пагінацію
    getEvents(limit: Int, skip: Int, search: String): [Event]
  }

  input EventInput {
    title: String!
    date: String!
    organizer: String!
  }

  type Mutation {
    addEvent(input: EventInput): Event
  }
`;

export const resolvers = {
  Query: {
    getEvents: async (_, { limit = 5, skip = 0, search }) => {
      let query = "SELECT * FROM events";
      let params = [];

      if (search) {
        query += " WHERE title LIKE ?";
        params.push(`%${search}%`);
      }

      query += " LIMIT ? OFFSET ?";
      params.push(limit, skip);

      const [rows] = await db.query(query, params);
      return rows;
    },
  },

  Mutation: {
    addEvent: async (_, { input }, { req }) => {
      if (!req.session.user) {
        throw new Error("Не авторизований. Будь ласка, увійдіть в систему.");
      }

      if (input.title.length < 3) {
        throw new Error("Назва події занадто коротка (мін. 3 символи)");
      }

      const userId = req.session.user.id;

      const [result] = await db.query(
        "INSERT INTO events (title, date, organizer, creatorId) VALUES (?, ?, ?, ?)",
        [input.title, input.date, input.organizer, userId],
      );

      return {
        id: result.insertId,
        ...input,
        creatorId: userId,
      };
    },
  },

  Event: {
    participants: async (parent) => {
      const [rows] = await db.query(
        "SELECT * FROM participants WHERE eventId = ?",
        [parent.id],
      );
      return rows;
    },
  },
};
