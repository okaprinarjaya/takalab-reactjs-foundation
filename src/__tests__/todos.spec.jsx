import React from 'react';
import {
  render, cleanup, waitFor, fireEvent
} from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';

import { TODOS } from '../graphql/modules/example-todo/queries.remote';
import {
  CREATE_TODO,
  SET_TODO_COMPLETE,
  SET_TODO_INCOMPLETE
} from '../graphql/modules/example-todo/mutations.remote';

import { TodosApp } from '../pages/todos';

afterEach(cleanup);

it('Should render data loading indicator', async () => {
  const { getByText } = render(
    <MockedProvider mocks={[]} addTypename>
      <TodosApp />
    </MockedProvider>
  );

  const loadingText = await waitFor(() => getByText('Loading todos...'));

  expect(loadingText).toBeDefined();
});

it('Should fetch initial todos data and render page with 3 todo items', async () => {
  const mocking = {
    request: {
      query: TODOS
    },
    result: {
      data: {
        todos: [
          {
            id: 1,
            title: 'Todo 1 title',
            completed: false,
            color: 'default',
            __typename: 'Todo'
          },
          {
            id: 2,
            title: 'Todo 2 title',
            completed: true,
            color: 'default',
            __typename: 'Todo'
          },
          {
            id: 3,
            title: 'Todo 3 title',
            completed: false,
            color: 'default',
            __typename: 'Todo'
          }
        ]
      }
    }
  };

  const { getByDisplayValue } = render(
    <MockedProvider mocks={[mocking]} addTypename>
      <TodosApp />
    </MockedProvider>
  );

  const todo1 = await waitFor(() => getByDisplayValue('Todo 1 title'));
  const todo2 = await waitFor(() => getByDisplayValue('Todo 2 title'));
  const todo3 = await waitFor(() => getByDisplayValue('Todo 3 title'));

  expect(todo1.value).toEqual('Todo 1 title');
  expect(todo2.value).toEqual('Todo 2 title');
  expect(todo3.value).toEqual('Todo 3 title');
});

it('Should successfuly create a new todo', async () => {
  const mocking = {
    request: {
      query: TODOS
    },
    result: {
      data: {
        todos: [
          {
            id: 1,
            title: 'Todo 1 title',
            completed: false,
            color: 'default',
            __typename: 'Todo'
          },
          {
            id: 2,
            title: 'Todo 2 title',
            completed: true,
            color: 'default',
            __typename: 'Todo'
          },
          {
            id: 3,
            title: 'Todo 3 title',
            completed: false,
            color: 'default',
            __typename: 'Todo'
          }
        ]
      }
    }
  };

  const todoNewText = 'This is a new todo ma brroooo';
  const mocking2 = {
    request: {
      query: CREATE_TODO,
      variables: { title: todoNewText }
    },
    result: {
      data: {
        createTodo: {
          success: true,
          message: 'New todo item successfuly created',
          __typename: 'TodoMutationResponse',
          todo: {
            id: 4,
            title: todoNewText,
            color: 'default',
            completed: false,
            __typename: 'Todo'
          }
        }
      }
    }
  };

  const { getByLabelText, getByDisplayValue } = render(
    <MockedProvider mocks={[mocking, mocking2]} addTypename>
      <TodosApp />
    </MockedProvider>
  );

  // Assert async DOM change when todos data successfuly loaded and rendered as new elements
  const todo1 = await waitFor(() => getByDisplayValue('Todo 1 title'));
  expect(todo1.value).toEqual('Todo 1 title');

  // Assert successfuly filling new todo input text
  const inputDOM = getByLabelText('add-new-todo-input');
  fireEvent.change(inputDOM, { target: { value: todoNewText } });

  expect(inputDOM.value).toBe(todoNewText);

  // Assert successfuly new todo created by clicking 'Add' button
  const buttonAddNewTodoDOM = getByLabelText('add-new-todo-button');
  fireEvent.click(buttonAddNewTodoDOM);

  const todoNew = await waitFor(() => getByDisplayValue(todoNewText));
  expect(todoNew.value).toEqual(todoNewText);
});

it('Should change \'completed\' status of an todo item ', async () => {
  const mocking = {
    request: {
      query: TODOS
    },
    result: {
      data: {
        todos: [
          {
            id: 1,
            title: 'Todo 1 title',
            completed: false,
            color: 'default',
            __typename: 'Todo'
          },
          {
            id: 2,
            title: 'Todo 2 title',
            completed: true,
            color: 'default',
            __typename: 'Todo'
          },
          {
            id: 3,
            title: 'Todo 3 title',
            completed: false,
            color: 'default',
            __typename: 'Todo'
          }
        ]
      }
    }
  };

  const mocking2 = {
    request: {
      query: SET_TODO_COMPLETE,
      variables: { todoId: 1 }
    },
    result: {
      data: {
        setTodoComplete: {
          success: true,
          message: 'Todo Id: 1 success updated',
          __typename: 'TodoMutationResponse',
          todo: {
            id: 1,
            title: 'Todo 1 title',
            color: 'default',
            completed: true,
            __typename: 'Todo'
          }
        }
      }
    }
  };

  const mocking3 = {
    request: {
      query: SET_TODO_INCOMPLETE,
      variables: { todoId: 2 }
    },
    result: {
      data: {
        setTodoInComplete: {
          success: true,
          message: 'Todo Id: 2 success updated',
          __typename: 'TodoMutationResponse',
          todo: {
            id: 2,
            title: 'Todo 2 title',
            color: 'default',
            completed: false,
            __typename: 'Todo'
          }
        }
      }
    }
  };

  const { getByTestId } = render(
    <MockedProvider mocks={[mocking, mocking2, mocking3]} addTypename>
      <TodosApp />
    </MockedProvider>
  );

  // Assert async DOM change when todos data successfuly loaded and rendered as new elements
  const todo1 = await waitFor(() => getByTestId('todo-item-1'));
  const todo2 = await waitFor(() => getByTestId('todo-item-2'));
  const todo3 = await waitFor(() => getByTestId('todo-item-3'));

  expect(todo1.checked).toBe(false);
  expect(todo2.checked).toBe(true);
  expect(todo3.checked).toBe(false);

  // Assert changing completed status of todo item ID: 1, from false to true
  fireEvent.click(todo1);

  const todo1NewState = await waitFor(() => getByTestId('todo-item-1'));
  expect(todo1NewState.checked).toBe(true);

  fireEvent.click(todo2);

  const todo2NewState = await waitFor(() => getByTestId('todo-item-2'));
  expect(todo2NewState.checked).toBe(false);

  const todo3NewState = getByTestId('todo-item-3');
  expect(todo3NewState.checked).toBe(false);
});
