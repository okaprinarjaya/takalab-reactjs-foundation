/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import { MockedProvider } from '@apollo/react-testing';
import { renderHook, act } from '@testing-library/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { useCreateTodoMutation, CREATE_TODO, TODOS_LOCAL_QUERY } from '../mutations.remote';
import initialCache from './cache.json';

const cache = new InMemoryCache({ addTypename: false }).restore(initialCache);

const mocking = {
  request: {
    query: CREATE_TODO,
    variables: { title: 'Makan' }
  },
  result: {
    data: {
      createTodo: {
        success: true,
        message: 'New todo item successfuly created',
        todo: {
          id: 1,
          title: 'Online standup meeeting because of WFH',
          color: 'default',
          completed: false
        }
      }
    }
  }
};

const mocking2 = {
  request: {
    query: TODOS_LOCAL_QUERY
  },
  result: {
    data: {
      todos: []
    }
  }
};

function getHookWrapper(mocks = []) {
  const wrapper = ({ children }) => (
    <MockedProvider mocks={mocks} addTypename={false} cache={cache}>
      {children}
    </MockedProvider>
  );

  const { result, waitForNextUpdate } = renderHook(() => useCreateTodoMutation({ title: 'Makan' }), { wrapper });
  return { result, waitForNextUpdate };
}

it('Should test test hehehe test!', () => {
  const { result } = getHookWrapper([mocking]);

  expect(typeof result.current.createNewTodo).toBe('function');
  expect(result.current.data).toEqual(undefined);
});


it('Should tast test tost!', async () => {
  const { result, waitForNextUpdate } = getHookWrapper([mocking, mocking2]);

  act(() => {
    result.current.createNewTodo();
  });

  await waitForNextUpdate();

  expect(result.current.data).not.toEqual(undefined);
  expect(typeof result.current.data.createTodo).not.toEqual(undefined);
  expect(result.current.data.createTodo).toEqual(mocking.result.data.createTodo);
});
