import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewListPage } from './new-list';

@NgModule({
  declarations: [
    NewListPage,
  ],
  imports: [
    IonicPageModule.forChild(NewListPage),
  ],
})
export class NewListPageModule {}
