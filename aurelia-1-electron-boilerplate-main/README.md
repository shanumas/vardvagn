# `aurelia-electron-builder-boilerplate`

A boilerplate scaffolding for using Aurelia 1 (2 isn't stable enough to use in anger yet) and Electron.

## Why I built this.
Largely out of frustration in there are little to no other stable templates/boilerplates out there to do this. At least not ones that allow for using `typescript` and `sass`.

Others I found would either barf when using `sass` for styling, or were limited to compiling native `.js` files.

As this boilerplate builds the app in a `dev` environment to use [`webpack-dev-server`](https://github.com/webpack/webpack-dev-server#readme) it also means that as well as using `Jest` to do unit tests, there is a friendly entry point for `Cypress.io` should you want to use that.

>**TODO**. Add a separate fork of this in time to show an example of cypress running

The Aurelia app this builds has a basic example UI with some simple routing in place

### Using
Clone the repos in the normal way so you have a locl version of this in place

```console
yarn install // or npm if your prefer
```

will install all the dependencies.

#### local dev environment  

```
yarn electron-dev
```
Once  compiled if you want browser access to the same app run-time open your browser to `http://localhost:8080`

### package build

```
yarn electron-pack
```

Will build out the packaged electron app too the `dist` folder

>**TODO** expand on the configs/build settings



#### credits
Core portions of the electron build side expand on Soulehshaikh99 work (here)[https://github.com/soulehshaikh99/create-aurelia-electron-app] 
