import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {TodoListData} from '../dataTypes/TodoListData';
import {TodoItemData} from '../dataTypes/TodoItemData';
import {TodoService} from '../todo.service';
import {tryCatch} from "rxjs/util/tryCatch";
type FCT_FILTER_ITEMS = (item: TodoItemData) => boolean;

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit {
  pageName;
  @Input() private data: TodoListData;
  tableauIntermediaire;

  filterAll: FCT_FILTER_ITEMS = () => true;
  filterDone: FCT_FILTER_ITEMS = item => item.isDone;
  filterUnDone: FCT_FILTER_ITEMS = item => !item.isDone;

  currentFilter = this.filterAll;
  // ceci est une variable qui est utilisé plus bas

  constructor(private todoService: TodoService) { }

  ngOnInit() {
    this.pageName = 'Todos';
    this.tableauIntermediaire = [];
  }

  getLabel(): string {
    return this.data ? this.data.label : '';
  }

  getItems(): TodoItemData[] {
    return this.data ? this.data.items : [];
  }


  appendItem(itemLabel:string){
    this.todoService.appendItems({
      label : itemLabel,
      isDone:false

      // Pour débuger: Dans console > sources > network > webpack > dossier vide > src > et on va dans la page correspondante
    })
  }





  // toutes les fonctions de this.quelque chose est defini dans le to do service

  removeItem(item: TodoItemData){
    this.todoService.removeItems(item)
    // permet de remove un item
    // elle est utilisée dans le html et le removeItems est elle défini dans le to do.service.ts
  }

  setItemDone(item: TodoItemData, isDone: boolean){
    this.todoService.setItemsDone(isDone, item);
  }

  NbItemsUnchecked():number{
    return this.data.items.reduce(
      (acc, item) => acc + (item.isDone ? 0 : 1), 0
    );
  }

  // #######################################################
  // tous ce qui suit sont des choses qu'on appel en heut.
  // juste après le @ input

  getFilteredItems():TodoItemData[]{
    return this.getItems().filter(this.currentFilter);
  }

  isAllDone():boolean{
    return this.getItems().reduce(
      (acc, item) => acc && item.isDone, true
    );
  }

  toggleAllDone(){
    const done = !this.isAllDone();
    this.todoService.setItemsDone(done, ...this.getItems());
  }


  removeDone() {
    for (const item of this.getItems()) {
      if (item.isDone) {
        this.removeItem(item);
      }
    }
  }


  undo(){
    let x = this.getItems();
    let i = x.length;
    this.tableauIntermediaire.push(x[i-1]);
    return this.getItems().splice(i-1, i);
  }



  redo(){
    if (this.tableauIntermediaire.length != 0){
      //console.log(this.tableauIntermediaire[this.tableauIntermediaire.length -1]);
      try{
        const dernierElementTableau = this.tableauIntermediaire[this.tableauIntermediaire.length-1];
        const {label : label}=dernierElementTableau;
        console.log(this.tableauIntermediaire)
        this.tableauIntermediaire.splice(-1, 1);
        //console.log(label);
        return this.appendItem(label);
      } catch(err){

      }finally {
        return this.getItems();
      }
    }
  }



  files: FileList;
  getFiles(event){
    this.files = event.target.files;
    let name = this.files[0].name;

    // si c'est une image
    if (name.substring(name.length - 3)=='jpg' || name.substring(name.length - 3)=='png'){
      return this.appendItem('Une image : ' + name.substring(0, name.length - 4));

    }else{
      // si c'est un audio
      if (name.substring(name.length - 3)=='flac'
        || name.substring(name.length - 3)=='mp3'
        || name.substring(name.length - 3)=='msv'
        || name.substring(name.length - 3)=='wav'
        || name.substring(name.length - 3)=='wma'){

        return this.appendItem('Une audio : ' + name.substring(0, name.length - 4));
      } else {
        // si c'est une vidéo
        if (name.substring(name.length - 3)=='mp4'
          || name.substring(name.length - 3)=='mov'
          || name.substring(name.length - 3)=='avi'
          || name.substring(name.length - 3)=='flv'
          || name.substring(name.length - 3)=='wmv'){

          return this.appendItem('Une vidéo : ' + name.substring(0, name.length - 4));
        } else{
          // dans les autres cas
          return this.getItems();
        }
      }
    }
  }

}

