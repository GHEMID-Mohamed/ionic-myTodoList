import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NfcSharePage } from './nfc-share';

@NgModule({
  declarations: [
    NfcSharePage,
  ],
  imports: [
    IonicPageModule.forChild(NfcSharePage),
  ],
})
export class NfcSharePageModule {}
