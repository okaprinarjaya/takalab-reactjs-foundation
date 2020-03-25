import {
  createContext, useReducer, useContext, useEffect
} from 'react';
import PropTypes from 'prop-types';

function appReducer(state, action) {
  switch (action.type) {
    case 'reset': {
      return action.payload;
    }
    case 'add': {
      return [
        ...state,
        {
          id: Date.now(),
          task: '',
          completed: false
        }
      ];
    }
    case 'delete': {
      return state.filter((item) => item.id !== action.payload);
    }
    case 'completed': {
      return state.map((item) => {
        if (item.id === action.payload) {
          return { ...item, completed: !item.completed };
        }
        return item;
      });
    }
    default: {
      return state;
    }
  }
}

const MyContext = createContext();

export default function TodosApp() {
  const [state, dispatch] = useReducer(appReducer, []);

  useEffect(() => {
    const todosRaw = localStorage.getItem('todos');
    dispatch({ type: 'reset', payload: JSON.parse(todosRaw) || [] });
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(state));
  }, [state]);

  return (
    <MyContext.Provider value={dispatch}>
      <div>
        <h1>Todos App</h1>
        <button type="button" onClick={() => dispatch({ type: 'add' })}>Add todo</button>
        {
          state !== null
            ? <TodosList items={state} />
            : null
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
      <input type="text" defaultChecked={todo.text} />

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
