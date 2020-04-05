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

export const DELETE_TODO = gql`
  mutation DeleteTodoMutation($todoId: Int!) {
    deleteTodo(todoId: $todoId) {
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

export const RENAME_TODO_TITLE = gql`
  mutation RenameTodoTitle($todoId: Int! $newTitleText: String!) {
    renameTodoTitle(todoId: $todoId newTitleText: $newTitleText) {
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

export const useCreateTodoMutation = () => {
  const [createTodo, { data }] = useMutation(CREATE_TODO, {
    update: (cache, { data: { createTodo: newTodo } }) => {
      const { todos } = cache.readQuery({ query: TODOS_LOCAL_QUERY });
      cache.writeQuery({
        query: TODOS_LOCAL_QUERY,
        data: { todos: [...todos, newTodo.todo] }
      });
    }
  });

  const createNewTodo = useCallback((title) => createTodo({ variables: { title } }));
  return { createNewTodo, data };
};

export const useDeleteTodoMutation = () => {
  const [deleteTodoCallback, { data }] = useMutation(DELETE_TODO, {
    update: (cache, { data: { deleteTodo } }) => {
      const { todos } = cache.readQuery({ query: TODOS_LOCAL_QUERY });
      cache.writeQuery({
        query: TODOS_LOCAL_QUERY,
        data: { todos: todos.filter((todo) => todo.id !== deleteTodo.todo.id) }
      });
    }
  });

  const deleteTodo = useCallback((todoId) => deleteTodoCallback({ variables: { todoId } }));
  return { deleteTodo, data };
};

export const useSetTodoCompleteMutation = () => {
  const [setTodoComplete, { data }] = useMutation(SET_TODO_COMPLETE);
  const updateTodoComplete = useCallback((todoId) => setTodoComplete({ variables: { todoId } }));

  return { updateTodoComplete, data };
};

export const useSetTodoInCompleteMutation = () => {
  const [setTodoInComplete, { data }] = useMutation(SET_TODO_INCOMPLETE);
  const updateTodoInComplete = useCallback((todoId) => setTodoInComplete(
    { variables: { todoId } }
  ));

  return { updateTodoInComplete, data };
};

export const useRenameTodoTitleMutation = () => {
  const [renameTodoTitleCallback, { data }] = useMutation(RENAME_TODO_TITLE);
  const renameTodoTitle = useCallback((todoId, newTitleText) => renameTodoTitleCallback(
    { variables: { todoId, newTitleText } }
  ));

  return { renameTodoTitle, data };
};
