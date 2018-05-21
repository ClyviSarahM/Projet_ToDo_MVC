import {ChangeDetectionStrategy, Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import {TodoItemData} from "../dataTypes/TodoItemData";
import {TodoService} from "../todo.service";

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent implements OnInit {
  @Input() private data : TodoItemData;
  // pour importer on fait alt entree

  @ViewChild("newTextInput") newTextInput : ElementRef;
  // en haut dans import {.. from @angular.., il faut rajouter ElementRef
  // car on a besoin de ca pour utiliser des elements de notre vue ici

  //isEditing = false;
  // ceci est pour la partie edit de la page.
  // //On va le modifier quand on click sur le label

  private _isEditing = false;
  constructor(private todoService : TodoService) { }

  ngOnInit() {
  }


  // on définit des méthodes pour les utiliser dans to do-list.component.html
  getLabel(): string{
    return this.data.label;
  }

  setLabel(label:string){
    this.todoService.setItemsLabel(label, this.data);
  }

  getIsDone(): boolean{
    return this.data.isDone;
  }

  setIsDone(isDone : boolean){
    this.todoService.setItemsDone(isDone, this.data);
  }

  // Dans le code on a l'attribut isEditing qui est un boolean False
  // pour y accéder, c'est difficile,
  //donc on défnit un autre, et isEditing devient :
  // _isEditing = false.
  // on veut faire ca car maintenant on veut encapsuler l'acces à cet variable
  // cest à dire, quand on y accède, on veut qu'un bout de code soit également éxécuter
  //sachant que le underscore est une syntaxe à respecter
  // on définit ensuite les accesseurs (get / set)
  // Donc :
  get isEditing():boolean{
    return this._isEditing;
  }

  // pour utiliser cela, on ecrit le TextInput plus haut
  // c'est aussi le nom qu'on a donné dans le to do-item.component.html
  // et focus veut dire se focaliser sur l'element quand tu doucle clic la dessus
  set isEditing(value:boolean){
    this._isEditing = value;
    if(value){
      requestAnimationFrame(
        () => this.newTextInput.nativeElement.focus()
      );
    }
  }

  // ce bout de code est pour la partie de la petite croix qui s'affiche à coté de chaque
  // item et qui permet de le supprimer.
  deleteTask () {
    this.todoService.removeItems(this.data);
  }


}

