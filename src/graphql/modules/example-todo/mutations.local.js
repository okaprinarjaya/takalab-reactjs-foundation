/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { useCallback } from 'react';

export const LOCAL_RENAME_TODO_TITLE = gql`
  mutation RenameTodoTitleLocalMutation($todoId: Int!, $newTitleText: String!) {
    renameTodoTitleLocalMutation(todoId: $todoId, newTitleText: $newTitleText) @client
  }
`;

export const useRenameTodoTitleLocalMutation = () => {
  const [renameTodoTitleCallback] = useMutation(LOCAL_RENAME_TODO_TITLE);
  const renameTodoTitleLocal = useCallback((todoId, newTitleText) => renameTodoTitleCallback(
    { variables: { todoId, newTitleText } }
  ));

  return [renameTodoTitleLocal];
};

export const renameTodoTitleLocalMutation = (_root, variables, { cache, getCacheKey }) => {
  const id = getCacheKey({ __typename: 'Todo', id: variables.todoId });
  const fragment = gql`
    fragment Foos on Todo {
      title
    }
  `;

  const todo = cache.readFragment({ fragment, id });
  const todoNEW = { ...todo, title: variables.newTitleText };

  cache.writeFragment({ fragment, id, data: todoNEW });
  return null;
};
