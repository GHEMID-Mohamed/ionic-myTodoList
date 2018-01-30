import { Component, Input } from "@angular/core"
import { IonicPage, NavController, NavParams } from "ionic-angular"

@Component({
  selector: "item-todo",
  templateUrl: "item.html"
})
export class Item {
  @Input("itemData") itemData

  uuid: string
  name: string
  complete: boolean

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ngOnInit() {
    this.uuid = this.itemData.uuid
    this.name = this.itemData.name
    this.complete = this.itemData.complete
  }
}
