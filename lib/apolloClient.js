import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-unfetch';
import gql from 'graphql-tag';

export default function createApolloClient(initialState, ctx) {
  // The `ctx` (NextPageContext) will only be present on the server.
  // use it to extract auth headers (ctx.req) or similar.
  return new ApolloClient({
    ssrMode: Boolean(ctx),
    link: new HttpLink({
      uri: 'http://localhost:4000', // Server URL (must be absolute)
      credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
      fetch
    }),
    cache: new InMemoryCache().restore(initialState),
    resolvers: {
      Mutation: {
        renameAjah: (_root, variables, { cache, getCacheKey }) => {
          const id = getCacheKey({ __typename: 'Launch', id: variables.id });
          const fragment = gql`
            fragment Njinxs on Launch {
              site
            }
          `;

          const launch = cache.readFragment({ fragment, id });
          const data = { ...launch, site: variables.text };

          cache.writeFragment({ fragment, id, data });

          return null;
        }
      }
    }
  });
}
