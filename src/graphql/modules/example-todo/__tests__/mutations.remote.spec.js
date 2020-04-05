/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import { MockedProvider } from '@apollo/react-testing';
import { renderHook, act } from '@testing-library/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';

import {
  useCreateTodoMutation,
  useDeleteTodoMutation,
  CREATE_TODO,
  DELETE_TODO
} from '../mutations.remote';
import initialCacheEmpty from './cache-empty.json';
import initialCachePopulated from './cache-populated.json';

function getHookWrapper(hooksCallback, mocks = [], cache) {
  const wrapper = ({ children }) => (
    <MockedProvider mocks={mocks} addTypename cache={cache}>
      {children}
    </MockedProvider>
  );

  const { result, waitForNextUpdate } = renderHook(() => hooksCallback(), { wrapper });
  return { result, waitForNextUpdate };
}

it('Should make sure our useCreateTodoMutation() custom hooks is arranged correctly', () => {
  const cache = new InMemoryCache({ addTypename: true }).restore(initialCacheEmpty);
  const { result } = getHookWrapper(useCreateTodoMutation, [], cache);

  expect(typeof result.current.createNewTodo).toBe('function');
  expect(result.current.data).toEqual(undefined);

  const localCache = cache.extract();
  expect(localCache.ROOT_QUERY.todos.length).toEqual(0);
});

it('Should successfuly create two todo item, with correct schema response and the cache cooperate correctly', async () => {
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
          __typename: 'TodoMutationResponse',
          todo: {
            id: 1,
            title: 'Makan',
            color: 'default',
            completed: false,
            __typename: 'Todo'
          }
        }
      }
    }
  };

  const mocking2 = {
    request: {
      query: CREATE_TODO,
      variables: { title: 'Minum' }
    },
    result: {
      data: {
        createTodo: {
          success: true,
          message: 'New todo item successfuly created',
          __typename: 'TodoMutationResponse',
          todo: {
            id: 2,
            title: 'Minum',
            color: 'default',
            completed: false,
            __typename: 'Todo'
          }
        }
      }
    }
  };

  const cache = new InMemoryCache({ addTypename: true }).restore(initialCacheEmpty);
  const { result, waitForNextUpdate } = getHookWrapper(
    useCreateTodoMutation, [mocking, mocking2], cache
  );

  act(() => {
    result.current.createNewTodo('Makan');
  });

  act(() => {
    result.current.createNewTodo('Minum');
  });

  await waitForNextUpdate();

  expect(result.current.data).not.toEqual(undefined);
  expect(typeof result.current.data.createTodo).not.toEqual(undefined);
  expect(result.current.data.createTodo).toEqual(mocking2.result.data.createTodo);

  const localCache = cache.extract();
  expect(localCache.ROOT_QUERY.todos.length).toEqual(2);

  const todoCacheKey1 = localCache.ROOT_QUERY.todos[0].id;
  expect(typeof localCache[todoCacheKey1]).not.toEqual('undefined');
  expect(localCache[todoCacheKey1].title).toEqual('Makan');

  const todoCacheKey2 = localCache.ROOT_QUERY.todos[1].id;
  expect(typeof localCache[todoCacheKey2]).not.toEqual('undefined');
  expect(localCache[todoCacheKey2].title).toEqual('Minum');
});

it('Should successfuly delete one todo item from 3 available todo items', async () => {
  const mocking = {
    request: {
      query: DELETE_TODO,
      variables: { todoId: 1 }
    },
    result: {
      data: {
        deleteTodo: {
          success: true,
          message: 'Deleting todo successfuly',
          __typename: 'TodoMutationResponse',
          todo: {
            id: 1,
            title: 'Makan',
            color: 'default',
            completed: false,
            __typename: 'Todo'
          }
        }
      }
    }
  };

  const cache = new InMemoryCache({ addTypename: true }).restore(initialCachePopulated);
  const { result, waitForNextUpdate } = getHookWrapper(useDeleteTodoMutation, [mocking], cache);

  expect(typeof result.current.deleteTodo).toBe('function');
  expect(result.current.data).toEqual(undefined);

  const localCache = cache.extract();
  expect(localCache.ROOT_QUERY.todos.length).toEqual(3);
  expect(localCache.ROOT_QUERY.todos).toContainObject({ id: 'Todo:1' });

  // Delete todo item with todoId = 1
  act(() => {
    result.current.deleteTodo(1);
  });

  await waitForNextUpdate();

  // Assert we get correct schema response
  expect(result.current.data).not.toEqual(undefined);
  expect(typeof result.current.data.deleteTodo).not.toEqual(undefined);
  expect(result.current.data.deleteTodo).toEqual(mocking.result.data.deleteTodo);

  // Assert our cache cooperate correctly
  const localCache2 = cache.extract();
  expect(localCache2.ROOT_QUERY.todos.length).toEqual(2);
  expect(localCache2.ROOT_QUERY.todos).not.toContainObject({ id: 'Todo:1' });
});
