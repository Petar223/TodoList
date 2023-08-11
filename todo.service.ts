import {Injectable} from '@angular/core';
import {filter, map, Observable, of, shareReplay} from "rxjs";


export interface Todo {
  id: number,
  title: string,
  description: string,
  status: boolean
}

@Injectable(
//   {
//   providedIn: 'root'
// }
)
export class TodoService {
  todos: Todo[] = JSON.parse(localStorage.getItem("todos") || '[]');

  constructor() {
    this.setTodosInLocalStorage();
  }

  setTodosInLocalStorage(): void {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  getTodos(): Observable<Todo[]> {
    return of(this.todos);
  }

  addTodo(todoItem: Todo): void {
   this.todos = [todoItem, ...this.todos];
    this.setTodosInLocalStorage();
  }

  updateTodo(updatedTodo: Todo): void {
    const index: number = this.todos.findIndex((todoItem: Todo): boolean => todoItem.id === updatedTodo.id);
    this.todos[index] = updatedTodo;
    this.setTodosInLocalStorage();
  }

  deleteTodo(id: number): void {
    this.todos = this.todos.filter((todoItem: Todo): boolean => todoItem.id !== id);
    this.setTodosInLocalStorage();
  }

  toggleStatus(id: number): void {
    const index: number = this.todos.findIndex((todoItem: Todo): boolean => todoItem.id === id);
    const todoItem: Todo = this.todos[index];
    todoItem.status = !todoItem.status;
    this.setTodosInLocalStorage();
  }

  getTodoById(id: number): Observable<Todo[]> {
    return this.getTodos().pipe(
      map((todos: Todo[]) => todos.filter((todoItem: Todo): boolean => todoItem.id === id)),
      shareReplay()
    )
  }

}
