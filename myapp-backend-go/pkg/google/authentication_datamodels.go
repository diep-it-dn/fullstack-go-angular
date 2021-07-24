package google

import "github.com/golang-jwt/jwt"

type JSONWebKeys struct {
	Keys []JSONWebKey `json:"keys"`
}

type JSONWebKey struct {
	Kty string `json:"kty"`
	Kid string `json:"kid"`
	E   string `json:"e"`
	Alg string `json:"alg"`
	Use string `json:"use"`
	N   string `json:"n"`
}

type GoogleTokenClaims struct {
	FirstName     string `json:"given_name"`
	LastName      string `json:"family_name"`
	PhotoUrl      string `json:"picture"`
	Name          string `json:"name"`
	Email         string `json:"email"`
	EmailVerified bool   `json:"email_verified"`
	jwt.StandardClaims
}
