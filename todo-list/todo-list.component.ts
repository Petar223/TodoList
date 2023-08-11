import {Component, OnInit} from '@angular/core';
import {Todo, TodoService} from "../todo.service";
import {map, Observable} from "rxjs";

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent{

  todos$: Observable<Todo[]> | undefined;
  filterOptions: string[] = ['All', 'Done', 'Undone'];
  selectedFilter: string = 'All';

  constructor(public todoService: TodoService) {
    this.getTodos();
  }

  getTodos(): void {
    this.todos$ = this.todoService.getTodos().pipe(
      map((todo: Todo[]) => todo)
    );
  }

  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id);
    this.getTodos();
  }

  toggleStatus(id: number): void {
    this.todoService.toggleStatus(id);
    this.getTodos();
  }

  setFilter(option: string): void {
    this.selectedFilter = option;
  }
}
