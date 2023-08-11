import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Todo, TodoService} from "../todo.service";
import { EMPTY, Subject, switchMap, takeUntil} from "rxjs";

@Component({
  selector: 'app-todo-setings',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss']
})
export class TodoFormComponent implements OnInit, OnDestroy {
  todoForm: FormGroup;
  editMode: boolean = false;
  todoId: number | string;

  destroy$: Subject<boolean> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService
  ) {
    this.todoForm = new FormGroup({
      'id': new FormControl(null),
      'title': new FormControl(null, Validators.required),
      'description': new FormControl(null),
      'status': new FormControl(false)
    });
    this.todoId = '';
  }

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$),
      switchMap(params => {
        if (params['id'] === 'new') {
          this.editMode = false;
          return EMPTY;
        } else {
          this.editMode = true;
          this.todoId = +params['id'];
          return this.todoService.getTodoById(this.todoId)
        }
      })
    ).subscribe((todos: Todo[]): void => {
      todos.map((todo: Todo) => this.formSetValueEdit(todo));
    });
  }

  formSetValueEdit(todo: Todo): void {
    this.todoForm.setValue({
      id: todo.id,
      title: todo.title,
      description: todo.description,
      status: todo.status
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  onSubmit(): void {
    if (this.todoForm.invalid) {
      return;
    }
    if (this.editMode) {
      this.todoService.updateTodo(this.todoForm.value);
    } else {
      this.todoService.addTodo({
        ...this.todoForm.value,
        id: Date.now(),
        // title: this.todoForm.value.title,
        // description: this.todoForm.value.description,
        // status: this.todoForm.value.status
      });
    }

    this.router.navigate(['/']);
  }


}
