package auth

// AccessDenied error in the case user don't have permission
type AccessDenied struct{}

func (m *AccessDenied) Error() string {
	return "Access denied"
}
