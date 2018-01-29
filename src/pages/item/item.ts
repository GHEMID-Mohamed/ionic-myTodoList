import { Component, Input } from "@angular/core"
import { IonicPage, NavController, NavParams } from "ionic-angular"

@Component({
  selector: "item-todo",
  templateUrl: "item.html"
})
export class Item {
  @Input("itemData") itemData

  title: string = ''
  description: string = ''
  state: boolean = false

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ngOnInit() {
    this.title = this.itemData.title
    this.description = this.itemData.description
    this.state = this.itemData.state
  }
}
