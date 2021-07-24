package google

import (
	"crypto/rsa"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"math/big"
	"net/http"

	"github.com/golang-jwt/jwt"
)

var (
	ErrorPublicKeyUnavailable = errors.New("public key couldn't be retrieved")
	ErrorInvalidToken         = errors.New("token couldn't be parsed or validated")
	ErrorInvalidIssuer        = errors.New("incorrect issuer claim")
)

func retrievePublicKey() (JSONWebKeys, error) {
	resp, err := http.Get("https://www.googleapis.com/oauth2/v3/certs")
	if err != nil {
		return JSONWebKeys{}, err
	}
	defer resp.Body.Close()
	var jwks = JSONWebKeys{}
	err = json.NewDecoder(resp.Body).Decode(&jwks)
	if err != nil {
		return JSONWebKeys{}, err
	}
	return jwks, nil
}

func getPublicKey(jwks JSONWebKeys) func(token *jwt.Token) (interface{}, error) {
	return func(token *jwt.Token) (interface{}, error) {
		if token.Method.Alg() != jwt.SigningMethodRS256.Alg() {
			return nil, fmt.Errorf("unexpected JWT signing method=%v", token.Header["alg"])
		}
		for key := range jwks.Keys {
			if token.Header["kid"].(string) == jwks.Keys[key].Kid {
				n, err := base64.RawURLEncoding.DecodeString(jwks.Keys[key].N)
				if err != nil {
					return nil, err
				}
				e, err := base64.RawURLEncoding.DecodeString(jwks.Keys[key].E)
				if err != nil {
					return nil, err
				}
				ei := big.NewInt(0).SetBytes(e).Int64()
				if err != nil {
					return nil, err
				}
				return &rsa.PublicKey{
					N: big.NewInt(0).SetBytes(n),
					E: int(ei),
				}, nil
			}
		}
		return nil, nil
	}
}

func GetIdentityFromToken(token string) (*GoogleTokenClaims, error) {
	jwks, err := retrievePublicKey()
	if err != nil {
		return nil, ErrorPublicKeyUnavailable
	}
	parsedToken := new(jwt.Token)
	parsedToken, err = jwt.ParseWithClaims(token, &GoogleTokenClaims{}, getPublicKey(jwks))
	if err != nil {
		return nil, ErrorInvalidToken
	}
	claims := parsedToken.Claims.(*GoogleTokenClaims)
	isValidIssuer := claims.VerifyIssuer("accounts.google.com", true)
	if !isValidIssuer {
		return nil, ErrorInvalidIssuer
	}
	return claims, nil
}
