package validator

import (
	"fmt"

	validator "github.com/go-playground/validator/v10"
)

// use a single instance of Validate, it caches struct info
var validate *validator.Validate = validator.New()

func ValidateEmail(v string) error {
	err := validate.Var(v, "email")
	if err != nil {
		return fmt.Errorf("invalid email")
	}

	return nil
}

func ValidatePassword(v string) error {
	if len(v) < 6 || len(v) > 20 {
		return fmt.Errorf("invalid password. Length should be between 6 and 20")
	}

	return nil
}
