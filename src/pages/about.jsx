import React, {
  createContext
} from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Link from 'next/link';

import { withApollo } from '../graphql/apollo';

import Nyukro from '../components/Nyukro';
import SebuahModule from '../components/SebuahModule';

export const ALL_LAUNCHES_QUERY = gql`
  query Jancuxes($pageSize: Int!) {
    launchuxes(pageSize: $pageSize) {
      cursor
      hasMore
      launchuxes {
        id
        site
        mission {
          name
          missionPatch
        }
      }
    }
  }
`;

const MyContext = createContext();

const Nyukrosss = () => (
  <MyContext.Consumer>
    {(launchuxes) => <Nyukro launchuxes={launchuxes} />}
  </MyContext.Consumer>
);

const Benyo = () => <Nyukrosss />;

function About() {
  const {
    loading,
    data,
    networkStatus
  } = useQuery(
    ALL_LAUNCHES_QUERY,
    {

      variables: { pageSize: 3 },
      notifyOnNetworkStatusChange: true
    }
  );

  if (loading) {
    return (
      <div>
        <div>
          About Us
        </div>
        <div>
          Network status:
          {networkStatus}
        </div>
        <div>Loading data...</div>
      </div>
    );
  }

  const { launchuxes: { launchuxes } } = data;

  return (
    <MyContext.Provider value={launchuxes}>
      <div>
        <div>About Usop ayam cuks</div>

        <div>
          Network status:
          {networkStatus}
        </div>

        <Benyo />
        <SebuahModule />

        <p>Result fetching: </p>

        <ul>
          {launchuxes.map((launch) => <li key={launch.id}>{launch.site}</li>)}
        </ul>

        <Link href="/todos">
          <button type="button">Click to go to Todos</button>
        </Link>

      </div>
    </MyContext.Provider>
  );
}

export default withApollo({ ssr: true })(About);
