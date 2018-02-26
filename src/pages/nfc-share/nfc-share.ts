import { Component } from "@angular/core"
import { IonicPage, NavController, NavParams } from "ionic-angular"
import { NFC, Ndef } from "@ionic-native/nfc"

@IonicPage()
@Component({
  selector: "page-nfc-share",
  templateUrl: "nfc-share.html"
})
export class NfcSharePage {
  constructor(private nfc: NFC, private ndef: Ndef) {}

  listNfc() {
    this.nfc
      .addNdefListener(
        () => {
          console.log("successfully attached ndef listener")
        },
        err => {
          console.log("error attaching ndef listener", err)
        }
      )
      .subscribe(event => {
        console.log("received ndef message. the tag contains: ", event.tag)
        console.log("decoded tag id", this.nfc.bytesToHexString(event.tag.id))

        let message = this.ndef.textRecord("Hello world")
        this.nfc
          .share([message])
          .then(this.onSuccess)
          .catch(this.onError)
      })
  }

  onSuccess() {}

  onError() {}
}
