import {
  createContext,
  useContext,
  useState
} from 'react';
import PropTypes from 'prop-types';

import { withApollo } from '../graphql/apollo';

import { useTodosQuery } from '../graphql/modules/example-todo/queries.remote';
import { useRenameTodoTitleLocalMutation } from '../graphql/modules/example-todo/mutations.local';
import {
  useCreateTodoMutation,
  useDeleteTodoMutation,
  useRenameTodoTitleMutation,
  useSetTodoCompleteMutation,
  useSetTodoInCompleteMutation
} from '../graphql/modules/example-todo/mutations.remote';

const MyContext = createContext();

export function TodosApp() {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const { data: graphqlData, loading } = useTodosQuery();
  const { createNewTodo } = useCreateTodoMutation();

  return (
    <MyContext.Provider value={(_) => _}>
      <div>
        <h1>Todos App</h1>

        <input
          type="text"
          aria-label="add-new-todo-input"
          defaultValue={newTodoTitle}
          style={{ width: '375px' }}
          onChange={(evt) => setNewTodoTitle(evt.target.value)}
        />
        <button
          aria-label="add-new-todo-button"
          type="button"
          onClick={() => createNewTodo(newTodoTitle)}
        >
          Add todo
        </button>

        {
          !loading && graphqlData && graphqlData.todos.length > 0
            ? <TodosList items={graphqlData.todos} />
            : <p>Loading todos...</p>
        }
      </div>
    </MyContext.Provider>
  );
}

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
  // const [title, setTitle] = useState(todo.title);
  const { deleteTodo } = useDeleteTodoMutation();
  const { renameTodoTitle } = useRenameTodoTitleMutation();
  const { updateTodoComplete } = useSetTodoCompleteMutation();
  const { updateTodoInComplete } = useSetTodoInCompleteMutation();
  const [renameTodoTitleLocal] = useRenameTodoTitleLocalMutation();

  return (
    <div
      className="todo-item"
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-betweeen',
        marginBottom: '5px'
      }}
    >
      <input
        data-testid={`todo-item-${todo.id}`}
        type="checkbox"
        checked={todo.completed}
        onChange={(evt) => {
          dispatch();
          if (evt.target.checked) {
            updateTodoComplete(parseInt(todo.id, 10));
          } else {
            updateTodoInComplete(parseInt(todo.id, 10));
          }
        }}
      />
      <input
        type="text"
        defaultValue={todo.title}
        onChange={(evt) => renameTodoTitleLocal(todo.id, evt.target.value)}
        style={{ width: '375px' }}
      />

      <button
        type="button"
        onClick={() => renameTodoTitle(parseInt(todo.id, 10), todo.title)}
      >
        Update
      </button>

      <button
        type="button"
        onClick={() => deleteTodo(parseInt(todo.id, 10))}
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
