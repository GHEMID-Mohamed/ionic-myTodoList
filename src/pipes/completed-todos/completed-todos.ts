import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "completedTodosPipe"
})
export class CompletedTodosPipe implements PipeTransform {
  transform(todoItems: any, filterIteratee: any) {
    if (filterIteratee !== undefined) {
      return todoItems.filter(item => item.complete === filterIteratee);
    } else {
      return todoItems;
    }
  }
}
