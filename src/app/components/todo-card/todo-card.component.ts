import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { TodoSignalsService } from '../../services/todo-signals.service';
import { TodoKeyLocalStorage } from '../../models/enum/todoKeyLocalStorage';
import { Todo } from '../../models/model/todo.model';


@Component({
  selector: 'app-todo-card',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    NgTemplateOutlet,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule
  ],
  templateUrl: './todo-card.component.html',
  styleUrls: []
})
export class TodoCardComponent implements OnInit {
  private todoSignalService = inject(TodoSignalsService);
  private todosSignal = this.todoSignalService.todosState;
  public todosList = computed(() => this.todosSignal());

  public ngOnInit(): void {
    this.getTodosInLocalStorage();
  }

  private getTodosInLocalStorage() {
    const todosDatas = localStorage.getItem(TodoKeyLocalStorage.TODO_LIST) as string;
    todosDatas && this.todosSignal.set(JSON.parse(todosDatas));
  }

  private saveTodosInLocalStorage(): void{
    this.todoSignalService.saveTodosInLocalStorage();
  }

  public handleDoneTodo(todoId: number): void{
    if(todoId){
      this.todosSignal.update((todos) => {
        const todoSelected = todos.find((todo) => todo?.id === todoId) as Todo;

        if(todoSelected){
          return todos.map(todo =>
            todo.id === todoId ? { ...todo, done: true } : todo
          );
        }
        return todos;
      });
      this.saveTodosInLocalStorage();
    }
  }

  public handleDeleteTodo(todo: Todo): void{
    if(todo){
      const index = this.todosList().indexOf(todo);

      if(index !== -1){
        this.todosSignal.update((todos) => {
          todos.splice(index, 1);
          return todos;
        });
        this.saveTodosInLocalStorage();
      }
    }
  }
}
