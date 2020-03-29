import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { useCallback } from 'react';

export const CREATE_TODO = gql`
  mutation CreateTodoMutation($title: String!) {
    createTodo(title: $title) {
      success
      message
      todo {
        title
        color
        completed
      }
    }
  }
`;

export const useCreateTodoMutation = ({ title }) => {
  const [createTodo, { data }] = useMutation(CREATE_TODO);
  const createNewTodo = useCallback(() => createTodo({ variables: { title } }));

  return { createNewTodo, data };
};
