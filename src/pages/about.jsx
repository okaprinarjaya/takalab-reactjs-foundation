import React, {
  createContext, useState
} from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Link from 'next/link';

import { withApollo } from '../graphql/apollo';
import { useCreateTodoMutation, useSetTodoCompleteMutation } from '../graphql/modules/example-todo/mutations.remote';

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

const LOCAL_RENAME = gql`
  mutation RenameInDaHouse($id: String!, $text: String!) {
    renameAjah(id: $id, text: $text) @client
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

  const [state, setState] = useState({ id: '', renameText: '' });
  const [newTodo, setNewTodo] = useState('');
  const [todoId, setTodoId] = useState('');
  const opts = { variables: { id: state.id, text: state.renameText } };
  const [faakkk] = useMutation(LOCAL_RENAME, opts);
  const { createNewTodo } = useCreateTodoMutation({ title: newTodo });
  const { updateTodoComplete } = useSetTodoCompleteMutation(parseInt(todoId, 10));

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

        <div>
          <p>ADD TODO</p>
          <input type="text" defaultValue={newTodo} onChange={(evt) => setNewTodo(evt.target.value)} />
          <br />
          <button type="button" onClick={createNewTodo}>Add Todo</button>
        </div>

        <div>
          <p>SET TODO COMPLETE / INCOMPLETE</p>
          <input type="text" defaultValue={todoId} onChange={(evt) => setTodoId(evt.target.value)} />
          <br />
          <button type="button" onClick={updateTodoComplete}>Todo Complete!</button>
        </div>

        <p>Result fetching: </p>

        <ul>
          {launchuxes.map((launch) => <li key={launch.id}>{launch.site}</li>)}
        </ul>

        <input
          type="text"
          value={state.id}
          onChange={(evt) => setState({ ...state, id: evt.target.value })}
        />
        <p>
          ID:
          {state.id}
        </p>

        <input
          type="text"
          value={state.renameText}
          onChange={(evt) => setState({ ...state, renameText: evt.target.value })}
        />
        <p>
          Rename Text:
          {state.renameText}
        </p>

        <button type="button" onClick={faakkk}>Click me!</button>

        <br />
        <br />

        <Link href="/todos">
          <button type="button">Click to go to Todos</button>
        </Link>

      </div>
    </MyContext.Provider>
  );
}

export default withApollo({ ssr: true })(About);
