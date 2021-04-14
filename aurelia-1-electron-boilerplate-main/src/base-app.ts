import { autoinject } from "aurelia-framework";
import { Router, RouterConfiguration, NavModel } from "aurelia-router";
import { PLATFORM } from "aurelia-pal";

@autoinject
export class BaseApp {

  routes: any[];
  router: Router;
  message: string;

  constructor() {
    this.message = 'how dooze!';
    this.routes = [
    {
      route: ["", "app-home"],
      name: "home-panel",
      moduleId: PLATFORM.moduleName("views/home-panel"),
      nav: true,
      title: "Home",
      settings: {
        requireAdmin: false,
        moduleAuthRequired: false,
        sortOrder: 1,
      }
    },
    {
      route: "app-loading",
      name: "panel-a",
      moduleId: PLATFORM.moduleName("views/panel-a"),
      nav: true,
      title: "Panel A",
      settings: {
        requireAdmin: false,
        moduleAuthRequired: false,
        sortOrder: 1,
      }
    }];
  }



  configureRouter(config: RouterConfiguration, router: Router) {
    console.log("configure router called...");
    this.router = router;
    config.options.root = "/";
    config.options.pushState = false;
    // this.router.baseUrl("/");
    const handleUnknownRoutes = () => {
      console.log("route not found...")
      return { route: "not-found", moduleId: "not-found" };
    };

    config.mapUnknownRoutes(handleUnknownRoutes);
    config.map(this.routes);
  }
}
