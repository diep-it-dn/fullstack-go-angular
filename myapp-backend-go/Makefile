go-get-ent:
	go get entgo.io/ent/cmd/ent
go-get-gqlgen:
	go get github.com/99designs/gqlgen@master
go-get-gqlgenc:
	go get -u github.com/Yamashou/gqlgenc

go-get-modules:
	make go-get-ent
	make go-get-gqlgen
	make go-get-gqlgenc

###########################################################
entgo:
	go generate ./...
gqlgenc:
	go run github.com/Yamashou/gqlgenc
gqlgen:
	go run github.com/99designs/gqlgen generate

generate-go-code:
	make entgo
	make gqlgenc
	make gqlgen


###########################################################
go-test:
	go test -v ./test/**

###########################################################
before-dev:
	make go-get-modules
	make generate-go-code

###########################################################
docker-compose-dev:
	docker-compose -f docker-compose-dev.yml up

###########################################################
before-build:
	make go-get-modules
	make generate-go-code
	go mod tidy

go-build-debug-inside-docker:
	make before-build
	go build -o ./tmp/app .

go-build:
	make before-build
	go build server.go