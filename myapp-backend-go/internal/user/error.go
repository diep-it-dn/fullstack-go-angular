package user

// WrongEmailOrPasswordError error in the case log in with wrong email or password
type WrongEmailOrPasswordError struct{}

func (m *WrongEmailOrPasswordError) Error() string {
	return "Wrong email or password"
}

// EmailExists error in the case create a new user with an email that exists
type EmailExists struct{}

func (u *EmailExists) Error() string {
	return "Email exists"
}
