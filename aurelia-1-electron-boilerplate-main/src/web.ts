import { autoinject, useView } from "aurelia-framework";
import { Router, RouterConfiguration, NavModel } from "aurelia-router";
import { PLATFORM } from "aurelia-pal";
import { BaseApp } from "./base-app";

@autoinject()
@useView("./base-app.html")
export class Web extends BaseApp {

  constructor() {
    super();

    console.log("web only");
  }


}
