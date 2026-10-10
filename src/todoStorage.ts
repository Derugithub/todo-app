import AsyncStorage from '@react-native-async-storage/async-storage';
import { todosFromStorage } from './todos';
import type { InsertEdge, Todo } from './types';

export const TODO_STORAGE_KEY = 'noir-list.todos.v1';
export const INSERT_EDGE_STORAGE_KEY = 'noir-list.insert-edge.v1';

let writeQueue: Promise<void> = Promise.resolve();

export async function loadTodos(): Promise<Todo[]> {
  try {
    const raw = await AsyncStorage.getItem(TODO_STORAGE_KEY);
    return todosFromStorage(raw);
  } catch {
    return todosFromStorage(null);
  }
}

export async function loadInsertEdge(): Promise<InsertEdge> {
  try {
    const raw = await AsyncStorage.getItem(INSERT_EDGE_STORAGE_KEY);
    return raw === 'bottom' ? 'bottom' : 'top';
  } catch {
    return 'top';
  }
}

export function saveInsertEdge(edge: InsertEdge): Promise<void> {
  const write = writeQueue.then(() => AsyncStorage.setItem(INSERT_EDGE_STORAGE_KEY, edge));
  writeQueue = write.then(
    () => undefined,
    () => undefined,
  );
  return write.catch(() => undefined);
}

export function saveTodos(todos: readonly Todo[]): Promise<void> {
  const payload = JSON.stringify(todos);
  const write = writeQueue.then(() => AsyncStorage.setItem(TODO_STORAGE_KEY, payload));
  writeQueue = write.then(
    () => undefined,
    () => undefined,
  );
  return write.catch(() => undefined);
}
