import { ipcRenderer } from "electron";
import { autoinject, useView } from "aurelia-framework";
import { Router, RouterConfiguration, NavModel } from "aurelia-router";
import { PLATFORM } from "aurelia-pal";
import { BaseApp } from "./base-app";

@autoinject()
@useView("./base-app.html")
export class App extends BaseApp {

  constructor() {
    super()
    //
    ipcRenderer.on(
      "onLoadingWindowLoaded",
      (event: any, ...args) => this.onLoadingWindowLoaded(args)
    );
  }

  onLoadingWindowLoaded(args: {route: string}[]) {
    console.log("this", this, this.router);
    /** event gets an array of arguments which detail the */
    /** route the app should navigate to */
    this.router.navigate(args[0].route);
  }
}
