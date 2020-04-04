import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { useCallback } from 'react';

export const CREATE_TODO = gql`
  mutation CreateTodoMutation($title: String!) {
    createTodo(title: $title) {
      success
      message
      todo {
        id
        title
        color
        completed
      }
    }
  }
`;

export const SET_TODO_COMPLETE = gql`
  mutation SetTodoCompleteMutation($todoId: Int!) {
    setTodoComplete(todoId: $todoId) {
      success
      message
      todo {
        id
        title
        color
        completed
      }
    }
  }
`;

export const SET_TODO_INCOMPLETE = gql`
  mutation SetTodoInCompleteMutation($todoId: Int!) {
    setTodoInComplete(todoId: $todoId) {
      success
      message
      todo {
        id
        title
        color
        completed
      }
    }
  }
`;

export const TODOS_LOCAL_QUERY = gql`
  query Todos {
    todos {
      id
      title
      color
      completed
    }
  }
`;

export const useCreateTodoMutation = ({ title }) => {
  const [createTodo, { data }] = useMutation(CREATE_TODO, {
    update: (cache, { data: { createTodo: newTodo } }) => {
      const { todos } = cache.readQuery({ query: TODOS_LOCAL_QUERY });
      cache.writeQuery({
        query: TODOS_LOCAL_QUERY,
        data: { todos: [...todos, newTodo.todo] }
      });
    }
  });

  const createNewTodo = useCallback(() => createTodo({ variables: { title } }));
  return { createNewTodo, data };
};

export const useSetTodoCompleteMutation = (todoId) => {
  const [setTodoComplete, { data }] = useMutation(SET_TODO_COMPLETE);
  const updateTodoComplete = useCallback(() => setTodoComplete({ variables: { todoId } }));

  return { updateTodoComplete, data };
};

export const useSetTodoInCompleteMutation = (todoId) => {
  const [setTodoInComplete, { data }] = useMutation(SET_TODO_INCOMPLETE);
  const updateTodoInComplete = useCallback(() => setTodoInComplete({ variables: { todoId } }));

  return { updateTodoInComplete, data };
};
