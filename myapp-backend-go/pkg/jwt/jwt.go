package jwt

import (
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/graph/model"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/internal/config"
	"github.com/golang-jwt/jwt"
)

// Claims data we save in each token
type Claims struct {
	email string
	jwt.StandardClaims
}

//GenerateTokenPair generates a jwt token pair, assign a email to it's claims and return it
func GenerateTokenPair(email string) (*model.TokenPair, error) {
	// Create token
	token := jwt.New(jwt.SigningMethodHS256)

	// Set claims
	// This is the information which frontend can use
	// The backend can also decode the token and get admin etc.
	claims := token.Claims.(jwt.MapClaims)
	claims["email"] = email
	claims["exp"] = time.Now().Add(time.Minute * time.Duration(config.AppConfig.TokenPair.Token.ExpiredInMinutes)).Unix()

	// Generate encoded token and send it as response.
	// The signing string should be secret (a generated UUID works too)
	t, err := token.SignedString([]byte(config.AppConfig.TokenPair.Token.SecretKey))
	if err != nil {
		return nil, err
	}

	refreshToken := jwt.New(jwt.SigningMethodHS256)
	rtClaims := refreshToken.Claims.(jwt.MapClaims)
	rtClaims["email"] = email
	rtClaims["exp"] = time.Now().Add(time.Duration(config.AppConfig.TokenPair.RefreshToken.ExpiredInMinutes)).Unix()

	rt, err := refreshToken.SignedString([]byte(config.AppConfig.TokenPair.RefreshToken.SecretKey))
	if err != nil {
		return nil, err
	}

	return &model.TokenPair{Token: t, RefreshToken: rt}, nil
}

//ParseToken parses a jwt token and returns the email in it's claims
func ParseToken(tokenStr string) (string, error) {
	if !strings.HasPrefix(tokenStr, "Bearer ") {
		return "", errors.New("Invalid token")
	}
	tokenStr = strings.TrimPrefix(tokenStr, "Bearer ")
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		return []byte(config.AppConfig.TokenPair.Token.SecretKey), nil
	})
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		email := claims["email"].(string)
		return email, nil
	} else {
		return "", err
	}
}

// RefreshToken generate the new token pair
func RefreshToken(refreshToken string) (*model.TokenPair, error) {
	token, err := jwt.Parse(refreshToken, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return []byte(config.AppConfig.TokenPair.RefreshToken.SecretKey), nil
	})

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// Get the user record from database or
		// run through your business logic to verify if the user can log in

		email := claims["email"].(string)
		newTokenPair, err := GenerateTokenPair(email)
		if err != nil {
			return nil, err
		}

		return newTokenPair, nil
	}

	return nil, err
}
