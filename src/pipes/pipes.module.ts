import { NgModule } from '@angular/core';
import { CompletedTodosPipe } from './completed-todos/completed-todos';
@NgModule({
	declarations: [CompletedTodosPipe],
	imports: [],
	exports: [CompletedTodosPipe]
})
export class PipesModule {}
