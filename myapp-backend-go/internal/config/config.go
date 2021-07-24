package config

import (
	"fmt"
	"log"
	"os"
	"path"
	"path/filepath"

	"github.com/jessevdk/go-flags"
	"github.com/spf13/viper"
)

// Option for configurations
type Option struct {
	Name     string `yaml:"name"`
	Debug    bool   `yaml:"debug"`
	BaseURL  string `yaml:"baseURL"`
	Database struct {
		DriverName  string `yaml:"driverName"`
		DatabaseURL string `yaml:"databaseURL"`
	} `yaml:"database"`
	TokenPair struct {
		Token        Token `yaml:"token"`
		RefreshToken Token `yaml:"refreshToken"`
	} `yaml:"tokenPair"`
	InitPermissionGroup InitPermissionGroup `yaml:"initPermissionGroup"`
	InitUser            InitUser            `yaml:"initUser"`
	MailServer          struct {
		SMTPServer string `yaml:"sMTPServer"`
		Port       string `yaml:"port"`
		Sender     struct {
			Email    string `yaml:"email"`
			Password string `yaml:"password"`
		} `yaml:"sender"`
	} `yaml:"mailServer"`
	Email struct {
		ForgotPassword struct {
			Token Token `yaml:"token"`
		} `yaml:"forgotPassword"`
		ResetPassword struct {
			Subject string `yaml:"subject"`
			Body    string `yaml:"body"`
		} `yaml:"resetPassword"`
	} `yaml:"email"`

	Environment string
}

// Token configure for secret key, expired time in minute (set 0 to never expire)
type Token struct {
	SecretKey        string `yaml:"secretKey"`
	ExpiredInMinutes int    `yaml:"expiredInMinutes"`
}

// InitUser create Init User in Init Group that has full User, PermissionGroup permissions
type InitUser struct {
	Email    string `yaml:"email"`
	Password string `yaml:"password"`
}

// InitPermissionGroup to init
type InitPermissionGroup struct {
	Name        string `yaml:"name"`
	Description string `yaml:"description"`
}

// AppConfig is the configs for the whole application
var AppConfig *Option

// Init initialize the configs
func Init() {
	var cli struct {
		Config      string `short:"c" long:"config" description:"Where's the config file place, default ./internal/config/config.yaml"`
		Environment string `short:"e" long:"environment" default:"development"`
	}
	p := flags.NewParser(&cli, flags.Default)
	if _, err := p.Parse(); err != nil {
		log.Panicln(err)
	}
	log.Printf("%#v", cli)
	if cli.Config == "" {
		dir, err := filepath.Abs(filepath.Dir(os.Args[0]))
		if err != nil {
			log.Panicln(err)
		}

		cli.Config = path.Join(dir, "internal/config/config.yaml")
	}

	viper.SetConfigFile(cli.Config)
	viper.AutomaticEnv()
	viper.SetConfigType("yml")

	var options map[string]Option

	if err := viper.ReadInConfig(); err != nil {
		fmt.Printf("Error reading config file, %s", err)
	}

	err := viper.Unmarshal(&options)
	if err != nil {
		fmt.Printf("Unable to decode into struct, %v", err)
	}

	opt := options[cli.Environment]
	opt.Environment = cli.Environment
	AppConfig = &opt
}
