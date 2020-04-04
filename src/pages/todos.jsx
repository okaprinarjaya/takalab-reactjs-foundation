import {
  createContext,
  useContext,
  useState
} from 'react';
import PropTypes from 'prop-types';

import { withApollo } from '../graphql/apollo';

import { useTodosQuery } from '../graphql/modules/example-todo/queries.remote';
import { useCreateTodoMutation } from '../graphql/modules/example-todo/mutations.remote';

// function appReducer(state, action) {
//   switch (action.type) {
//     case 'reset': {
//       return action.payload;
//     }
//     case 'add': {
//       return [
//         ...state,
//         {
//           id: Date.now(),
//           title: '',
//           completed: false
//         }
//       ];
//     }
//     case 'delete': {
//       return state.filter((item) => item.id !== action.payload);
//     }
//     case 'completed': {
//       return state.map((item) => {
//         if (item.id === action.payload) {
//           return { ...item, completed: !item.completed };
//         }
//         return item;
//       });
//     }
//     default: {
//       return state;
//     }
//   }
// }

const MyContext = createContext();

function TodosApp() {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const { data: graphqlData, loading } = useTodosQuery();
  const { createNewTodo } = useCreateTodoMutation({ title: newTodoTitle });

  return (
    <MyContext.Provider value={(_) => _}>
      <div>
        <h1>Todos App</h1>

        <input
          type="text"
          defaultValue={newTodoTitle}
          style={{ width: '375px' }}
          onChange={(evt) => setNewTodoTitle(evt.target.value)}
        />
        <button type="button" onClick={createNewTodo}>Add todo</button>

        {
          !loading && graphqlData && graphqlData.todos.length > 0
            ? <TodosList items={graphqlData.todos} />
            : null
        }
      </div>
    </MyContext.Provider>
  );
}

// TodosApp.propTypes = {
//   data: PropTypes.arrayOf(PropTypes.object).isRequired
// };

function TodosList({ items }) {
  return (
    <div style={{ marginTop: '25px' }}>
      {items.map((todo) => <TodoItem key={todo.id} todo={todo} />)}
    </div>
  );
}

TodosList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired
};

function TodoItem({ todo }) {
  const dispatch = useContext(MyContext);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-betweeen',
      marginBottom: '5px'
    }}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => dispatch({ type: 'completed', payload: todo.id })}
      />
      <input type="text" defaultValue={todo.title} style={{ width: '375px' }} />

      <button
        type="button"
        onClick={() => dispatch({ type: 'delete', payload: todo.id })}
      >
        Delete
      </button>
    </div>
  );
}

TodoItem.propTypes = {
  todo: PropTypes.object.isRequired
};

export default withApollo({ ssr: true })(TodosApp);
