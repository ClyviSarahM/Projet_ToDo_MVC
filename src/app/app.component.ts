import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TodoService} from './todo.service';
import {TodoListData} from './dataTypes/TodoListData';
import {TodoItemData} from './dataTypes/TodoItemData';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private tdl : TodoListData;

  constructor(private todoService : TodoService){
    todoService.getTodoListDataObserver().subscribe(
      L => this.tdl = L
      // c'est cette affectation qui est responsable de donner la valeur qu'il faut au variable et permet de l'afficher
    );
  }

  getCurrentTodoList() : TodoListData{
    return this.tdl;
  }
}
