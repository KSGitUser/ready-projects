import { makeExecutableSchema } from "@graphql-tools/schema";
import * as typeDefs from "./schema.graphql";
import {GraphQLContext} from './context';
import {compare, hash} from 'bcryptjs';
import {sign} from 'jsonwebtoken';
import {APP_SECRET} from './auth';
import {Link, User} from "@prisma/client";

// 1
// type Link = {
//     id: string;
//     url: string;
//     description: string;
//     postedById: string;
// }

const resolvers = {
    Query: {
        me: (parent: unknown, args: {}, context: GraphQLContext) => {
            if (context.currentUser === null) {
                throw new Error("Unauthenticated!");
            }

            return context.currentUser;
        },
        info: () => `This is the API of a Hackernews Clone`,
        // 3
        feed: (parent: unknown, args: {}, context: GraphQLContext) => {
            return context.prisma.link.findMany();
        },
    },
    // 4
    Link: {
        id: (parent: Link) => parent.id,
        description: (parent: Link) => parent.description,
        url: (parent: Link) => parent.url,
        postedBy: async (parent: Link, args: {}, context: GraphQLContext) => {
            if (!parent.postedById) {
                return null;
            }

            return context.prisma.link
                .findUnique({ where: { id: parent.id } })
                .postedBy();
        },
    },
    User: {
        links: (parent: User, args: {}, context: GraphQLContext) =>
            context.prisma.user.findUnique({ where: { id: parent.id } }).links(),
    },
    Mutation: {
        signup: async (
            parent: unknown,
            args: { email: string; password: string; name: string },
            context: GraphQLContext) => {
            const password = await hash(args.password, 10);

            const user = await context.prisma.user.create({
                data: { ...args, password },
            });

            const token = sign({ userId: user.id }, APP_SECRET);

            return {
                token,
                user,
            }
        },
        login: async (
            parent: unknown,
            args: { email: string; password: string },
            context: GraphQLContext
        ) => {
            const user = await context.prisma.user.findUnique({
                where: { email: args.email },
            });
            if (!user) {
                throw new Error("No such user found");
            }

            const valid = await compare(args.password, user.password);
            if (!valid) {
                throw new Error("Invalid password");
            }

            const token = sign({ userId: user.id }, APP_SECRET);

            return {
                token,
                user,
            };
        },
        post: async (parent: unknown, args: { url: string; description: string }, context: GraphQLContext) => {
            if (context.currentUser === null) {
                throw new Error("Unauthenticated!");
            }

            const newLink = context.prisma.link.create({
                data: {
                    url: args.url,
                    description: args.description,
                    postedBy: { connect: { id: context.currentUser.id } },
                },
            });

            return newLink;
        }
    }
}

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});
