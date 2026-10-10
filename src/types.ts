export type Todo = {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
};

export type Filter = 'all' | 'active' | 'done';

/** Where the next task is inserted. T is top, B is bottom. */
export type InsertEdge = 'top' | 'bottom';
