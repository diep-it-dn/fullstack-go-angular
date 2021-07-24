package main

import (
	"log"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"strings"

	"entgo.io/contrib/entgql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	_ "github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/ent/runtime"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/graph/resolver"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/internal/auth"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/internal/config"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/internal/initdb"
	"github.com/go-chi/chi"
	_ "github.com/jackc/pgx/v4/stdlib"
	_ "github.com/mattn/go-sqlite3"
)

func init() {
	config.Init()
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		panic("PORT env is not set")
	}

	client := initdb.ConnectDBAndInitData()
	defer client.Close()
	srv := handler.NewDefaultServer(resolver.NewSchema(client))

	srv.Use(entgql.Transactioner{TxOpener: client})

	router := chi.NewRouter()

	router.Use(auth.Middleware(client))

	router.Handle("/playground", playground.Handler("GraphQL playground", "/query"))
	router.Handle("/query", srv)

	isIncludeWebsite := os.Getenv("IS_INCLUDE_MYAPP_FRONTEND_ANGULAR")
	if isIncludeWebsite == "true" {
		fileServer(router, "/", "./myapp-frontend-angular/dist/myapp-frontend-angular/")
		log.Printf("connect to http://localhost:%s/ for Website", port)
	}

	log.Printf("connect to http://localhost:%s/playground for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}

// fileServer is serving static files
func fileServer(r chi.Router, public string, static string) {

	if strings.ContainsAny(public, "{}*") {
		panic("FileServer does not permit URL parameters.")
	}

	root, _ := filepath.Abs(static)
	if _, err := os.Stat(root); os.IsNotExist(err) {
		panic("Website bundle not found. Please run: `cd ../myapp-frontend-angular && npm run build`")
	}

	fs := http.StripPrefix(public, http.FileServer(http.Dir(root)))

	if public != "/" && public[len(public)-1] != '/' {
		r.Get(public, http.RedirectHandler(public+"/", 301).ServeHTTP)
		public += "/"
	}

	r.Get(public+"*", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		file := strings.Replace(r.RequestURI, public, "/", 1)
		if _, err := os.Stat(root + file); os.IsNotExist(err) {
			http.ServeFile(w, r, path.Join(root, "index.html"))
			return
		}
		fs.ServeHTTP(w, r)
	}))
}
