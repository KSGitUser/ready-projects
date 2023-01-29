import { makeExecutableSchema } from "@graphql-tools/schema";
import * as typeDefs from "./schema.graphql";
import {GraphQLContext} from './context';

// 1
type Link = {
    id: string;
    url: string;
    description: string;
}

const resolvers = {
    Query: {
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
    },
    Mutation: {
        post: (parent: unknown,
               args: { description: string, url: string},
               context: GraphQLContext
        ) => {

            const newLink = context.prisma.link.create({
                data: {
                    url: args.url,
                    description: args.description
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
