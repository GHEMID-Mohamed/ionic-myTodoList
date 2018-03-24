import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedListsPage } from './shared-lists';

@NgModule({
  declarations: [
    SharedListsPage,
  ],
  imports: [
    IonicPageModule.forChild(SharedListsPage),
  ],
})
export class SharedListsPageModule {}
