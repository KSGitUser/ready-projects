import { makeExecutableSchema } from "@graphql-tools/schema";
import * as typeDefs from "./schema.graphql";

const resolvers = {
    Query: {
        info: () => 'Test',
    }
}

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});
