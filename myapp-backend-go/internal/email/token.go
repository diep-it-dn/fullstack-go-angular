package email

import (
	"log"
	"time"

	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/internal/config"
	"github.com/golang-jwt/jwt"
)

// Claims data we save in each token
type Claims struct {
	email string
	jwt.StandardClaims
}

// GenerateToken generates a jwt token and assign a email to it's claims and return it
func GenerateToken(email string) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	/* Create a map to store our claims */
	claims := token.Claims.(jwt.MapClaims)
	/* Set token claims */
	claims["email"] = email
	claims["exp"] = time.Now().Add(time.Minute * time.Duration(config.AppConfig.Email.ForgotPassword.Token.ExpiredInMinutes)).Unix()
	tokenString, err := token.SignedString([]byte(config.AppConfig.Email.ForgotPassword.Token.SecretKey))
	if err != nil {
		log.Fatal("Error in Generating key")
		return "", err
	}
	return tokenString, nil
}

// ParseToken parses a jwt token and returns the email in it's claims
func ParseToken(tokenStr string) (string, error) {
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		return []byte(config.AppConfig.Email.ForgotPassword.Token.SecretKey), nil
	})
	if err != nil {
		return "", err
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		email := claims["email"].(string)
		return email, nil
	} else {
		return "", err
	}
}
