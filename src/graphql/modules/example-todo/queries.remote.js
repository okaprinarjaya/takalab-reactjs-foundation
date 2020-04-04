import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

export const TODOS = gql`
  query Todos {
    todos {
      id
      title
      completed
      color
    }
  }
`;

export const useTodosQuery = () => {
  const { data, loading } = useQuery(TODOS);
  return { data, loading };
};
