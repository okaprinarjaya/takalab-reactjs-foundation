/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const renameAjah = (_root, variables, { cache, getCacheKey }) => {
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
};
