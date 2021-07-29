# Full-Stack Go, Angular

**Demo at: https://fullstack-go-angular.herokuapp.com/**

## Setup things for development environment:
1. [Git](https://git-scm.com/downloads)
2. [Golang](https://golang.org/dl/)
   * We use Go with SQLite. With Windows, refer this [article](https://medium.com/@yaravind/go-sqlite-on-windows-f91ef2dacfe) to install GCC. Or we can go directly to this link to download and install https://github.com/jmeubank/tdm-gcc/releases/download/v10.3.0-tdm64-2/tdm64-gcc-10.3.0-2.exe
3. [NodeJS](https://nodejs.org/en/download/)
4. [Postgresql](https://www.postgresql.org/download/)
5. [make](http://gnuwin32.sourceforge.net/packages/make.htm). (For Linux, MacOS, verify by command `make --version` to install make if missing)
6. [Visual Studio Code](https://code.visualstudio.com/download)
   * Install these extensions: Go for Visual Studio Code, Debugger for Chrome, GitLens — Git supercharged, Angular Snippets (Version 12)
7. [Docker](https://docs.docker.com/desktop/)

## Getting Started
Take a look and set/update environment variables at this [config](./myapp-backend-go/internal/config/config.yaml).

The application need an initial user to login that have full permissions (CRUD Permission Groups, Users, Contents settings, Posts). Set it at this path: `[env].initUser` (`[env]` can be default, development, test, dockerlocal, production).

Function `Forgot Password` need to send an email to help user reset the password. Configure the mail server at this path: `[env].mailServer` to make the send mail function works properly.

### Quickly see the application up and running:
```bash
git clone git@github.com:diep-it-dn/fullstack-go-angular.git
cd fullstack-go-angular
docker compose up
```
   Then browse to http://localhost:9999, login with the initial user. Feel free to discover :)

### For development, we should open seperated VSCode app for `myapp-backend-go`, `myapp-frontend-angular`. Read the README.md on them for more information.

## About the author:
I'm Diep <diep.it.dn@gmail.com> from Da Nang, Viet Nam.

I've been working for this repo since 2020. Today, 2021-07-24, I would like to start sharing it.
If you like this repo, please give me a :star:. And I'm very happy if you [can buy me a coffee](https://www.buymeacoffee.com/diep.it.dn) to motivate me take time to contribute more for the software development communitity!

**_:heart: Please like the facebook page [Full-Stack Dev](https://www.facebook.com/groups/1308256889537119) for more updates :heart:_**
