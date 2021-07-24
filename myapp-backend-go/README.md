## Development Notes

### Initial module
```bash
go mod init github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go
```

### Create the project skeleton with gqlgen
````bash
go get github.com/99designs/gqlgen
go run github.com/99designs/gqlgen init
````

````bash
go run github.com/99designs/gqlgen generate
````

    Note:
    - If error is occured, try to run this to fix: `go get github.com/vektah/gqlparser/v2@v2.1.0`, then rerun: `go run github.com/99designs/gqlgen generate`
    - We should add git ignore for generated code.

### Installation ent
````bash
go get entgo.io/ent/cmd/ent
````

### Create Schemas by ent
````bash
ent init User
ent init PermissionGroup
ent init ContentSetting
ent init Tag
ent init Post
````

### GraphQL Integration
Refer [GraphQL Integration](https://entgo.io/docs/graphql/)

### Run codegen for your ent project
````bash
go generate ./...
````

## Development server
At the first time, run `make before-dev` to prepare eveything. See the [make file](./Makefile) for more information. Rerun it when the code changed during the development.

Then in Visual Studio Code, press F5, choose `"Launch debugger for myapp-backend-go server"`.

(You can also run `make docker-compose-dev` to start the application inside the docker container)

Then browse to http://localhost:9999/playground to send/test queries.
