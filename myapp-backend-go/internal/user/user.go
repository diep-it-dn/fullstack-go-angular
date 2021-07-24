package user

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"log"
	"strings"
	"text/template"

	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/ent"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/ent/predicate"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/ent/user"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/graph/model"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/internal/config"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/internal/email"
	"github.com/diep-it-dn/fullstack-go-angular/myapp-backend-go/pkg/google"
	"golang.org/x/crypto/bcrypt"
)

// Count return the count of all users
func Count(ctx context.Context, client *ent.Client) (int, error) {
	return client.User.Query().Count(ctx)
}

// CreateInitUser create un initial User for the application
func CreateInitUser(ctx context.Context, client *ent.Client, initUser *model.CreateUserIn) error {
	dbInitUser, err := client.User.Query().Where(user.EmailEQ(initUser.Email)).First(ctx)
	if dbInitUser != nil {
		return nil
	}
	if !ent.IsNotFound(err) {
		return err
	}
	_, err = Create(ctx, client, initUser)
	return err
}

// HasAnyPermission check if user has any expected permission
func HasAnyPermission(user *ent.User, permissions []model.Permission) bool {
	if user.Edges.PermissionGroups == nil || len(user.Edges.PermissionGroups) == 0 {
		return false
	}
	for _, pg := range user.Edges.PermissionGroups {
		for _, p := range pg.Permissions {
			for _, desiredP := range permissions {
				if p == desiredP.String() {
					return true
				}
			}
		}

	}
	return false
}

// RegisterUser new User
func RegisterUser(ctx context.Context, client *ent.Client, input *model.RegisterUserIn) (*ent.User, error) {
	hashedPassword, err := HashPassword(input.Password)
	if err != nil {
		return nil, err
	}

	u, err := client.User.
		Create().
		SetNillablePhoneNumber(input.PhoneNumber).
		SetEmail(input.Email).
		SetPassword(hashedPassword).
		SetNillableDisplayedName(input.DisplayedName).
		SetNillableFirstName(input.FirstName).
		SetNillableLastName(input.LastName).
		SetNillableGender(input.Gender).
		SetNillableBirthday(input.Birthday).
		SetNillableDescription(input.Description).
		SetNillableAddress(input.Address).
		SetNillableAvatarURL(input.AvatarURL).
		Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("Failed registering user: %v", err)
	}
	log.Println("User was registered: ", u)
	return u, nil
}

// Create new User
func Create(ctx context.Context, client *ent.Client, input *model.CreateUserIn) (*ent.User, error) {
	hashedPassword, err := HashPassword(input.Password)
	if err != nil {
		return nil, err
	}
	u, err := client.User.
		Create().
		SetNillablePhoneNumber(input.PhoneNumber).
		SetEmail(input.Email).
		SetPassword(hashedPassword).
		SetNillableDisplayedName(input.DisplayedName).
		SetNillableFirstName(input.FirstName).
		SetNillableLastName(input.LastName).
		SetNillableGender(input.Gender).
		SetNillableBirthday(input.Birthday).
		SetNillableDescription(input.Description).
		SetNillableAddress(input.Address).
		SetNillableAvatarURL(input.AvatarURL).
		AddPermissionGroupIDs(input.PermissionGroupIDs...).
		Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("Failed creating user: %v", err)
	}
	log.Println("User was created: ", u)
	return u, nil
}

// Update update an User
func Update(ctx context.Context, client *ent.Client, id int, input *model.UpdateUserIn) (*ent.User, error) {

	u := client.User.UpdateOneID(id)

	if input.EmailIn != nil && input.EmailIn.IsUpdate {
		idByEmail, err := GetUserIDByEmail(client, input.EmailIn.Value)
		if err != nil {
			return nil, err
		}
		if idByEmail > 0 && idByEmail == id {
			return nil, &EmailExists{}
		}
		u.SetEmail(input.EmailIn.Value)
	}
	if input.PasswordIn != nil && input.PasswordIn.IsUpdate {
		hashedPassword, err := HashPassword(input.PasswordIn.Value)
		if err != nil {
			return nil, err
		}
		u.SetPassword(hashedPassword)
	}
	if input.PermissionGroupIDsIn != nil && input.PermissionGroupIDsIn.IsUpdate {
		u.ClearPermissionGroups().AddPermissionGroupIDs(input.PermissionGroupIDsIn.Value...)
	}
	if input.StatusIn != nil && input.StatusIn.IsUpdate {
		u.SetStatus(input.StatusIn.Value)
	}
	if input.DisplayedNameIn != nil && input.DisplayedNameIn.IsUpdate {
		if input.DisplayedNameIn.Value == nil {
			u.ClearDisplayedName()
		} else {
			u.SetDisplayedName(*input.DisplayedNameIn.Value)
		}
	}
	if input.FirstNameIn != nil && input.FirstNameIn.IsUpdate {
		if input.FirstNameIn.Value == nil {
			u.ClearFirstName()
		} else {
			u.SetFirstName(*input.FirstNameIn.Value)
		}
	}
	if input.LastNameIn != nil && input.LastNameIn.IsUpdate {
		if input.LastNameIn.Value == nil {
			u.ClearLastName()
		} else {
			u.SetLastName(*input.LastNameIn.Value)
		}
	}
	if input.GenderIn != nil && input.GenderIn.IsUpdate {
		if input.GenderIn.Value == nil {
			u.ClearGender()
		} else {
			u.SetGender(*input.GenderIn.Value)
		}
	}
	if input.BirthdayIn != nil && input.BirthdayIn.IsUpdate {
		if input.BirthdayIn.Value == nil {
			u.ClearBirthday()
		} else {
			u.SetBirthday(*input.BirthdayIn.Value)
		}
	}
	if input.PhoneNumberIn != nil && input.PhoneNumberIn.IsUpdate {
		if input.GenderIn.Value == nil {
			u.ClearPhoneNumber()
		} else {
			u.SetPhoneNumber(*input.PhoneNumberIn.Value)
		}
	}
	if input.AddressIn != nil && input.AddressIn.IsUpdate {
		if input.GenderIn.Value == nil {
			u.ClearAddress()
		} else {
			u.SetAddress(*input.AddressIn.Value)
		}
	}
	if input.DescriptionIn != nil && input.DescriptionIn.IsUpdate {
		if input.DescriptionIn.Value == nil {
			u.ClearAddress()
		} else {
			u.SetDescription(*input.DescriptionIn.Value)
		}
	}
	if input.AvatarURLIn != nil && input.AvatarURLIn.IsUpdate {
		if input.AvatarURLIn.Value == nil {
			u.ClearAvatarURL()
		} else {
			u.SetAvatarURL(*input.AvatarURLIn.Value)
		}
	}

	user, err := u.Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("Failed updating user: %v", err)
	}
	log.Println("User was updated: ", u)
	return user, nil
}

// HashPassword hashes given password
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

// CheckPasswordHash compares raw password with it's hashed values
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// Authenticate for login
func Authenticate(ctx context.Context, client *ent.Client, input *model.LoginIn) (*ent.User, bool) {

	user, err := client.User.Query().Where(user.EmailEQ(input.Email)).
		WithPermissionGroups().
		First(ctx)
	if err != nil {
		if ent.IsNotFound(err) {
			return nil, false
		}
		log.Panicf("Failed login user: %v", err)
		return nil, false
	}

	ok := CheckPasswordHash(input.Password, user.Password)
	if ok {
		return user, true
	}
	return nil, false
}

func AuthenticateByGoogle(ctx context.Context, client *ent.Client, input *model.LoginByGoogleIn) (*ent.User, error) {
	googleTokenClaims, err := google.GetIdentityFromToken(*input.IDToken)
	if err != nil {
		return nil, err
	}

	user, err := client.User.Query().Where(user.EmailEQ(googleTokenClaims.Email)).
		WithPermissionGroups().
		First(ctx)
	if err != nil {
		if ent.IsNotFound(err) {
			newUser := &model.CreateUserIn{
				Email:     googleTokenClaims.Email,
				FirstName: &googleTokenClaims.FirstName,
				LastName:  &googleTokenClaims.LastName,
				AvatarURL: &googleTokenClaims.PhotoUrl,
			}
			return Create(ctx, client, newUser)
		}
		log.Panicf("Failed login user: %v", err)
		return nil, err
	}

	return user, nil
}

// CheckValidStatus check if current user is in DEACTIVE status
func CheckValidStatus(currentUser *ent.User) error {
	if currentUser.Status == user.StatusDISABLED {
		return errors.New("User is disabled")
	}
	return nil
}

// GetUserIDByEmail check if a user exists in database by given email
func GetUserIDByEmail(client *ent.Client, email string) (int, error) {
	user, err := client.User.Query().Where(user.EmailEQ(email)).First(context.Background())
	if err != nil {
		if !ent.IsNotFound(err) {
			return 0, err
		}
		return 0, nil
	}

	return user.ID, nil
}

// GetUserContext of the current User
func GetUserContext(client *ent.Client, email string) (*ent.User, error) {
	user, err := client.User.Query().Where(user.EmailEQ(email)).
		WithPermissionGroups().First(context.Background())
	if err != nil {
		if !ent.IsNotFound(err) {
			return nil, err
		}
		return nil, nil
	}

	return user, nil
}

// UpdateCurrentUser update all fields except password, permisions and status
func UpdateCurrentUser(ctx context.Context, client *ent.Client, id int, input *model.UpdateCurrentUserIn) (*ent.User, error) {
	u := client.User.UpdateOneID(id)

	if input.DisplayedNameIn != nil && input.DisplayedNameIn.IsUpdate {
		if input.DisplayedNameIn.Value == nil {
			u.ClearDisplayedName()
		} else {
			u.SetDisplayedName(*input.DisplayedNameIn.Value)
		}
	}
	if input.FirstNameIn != nil && input.FirstNameIn.IsUpdate {
		if input.FirstNameIn.Value == nil {
			u.ClearFirstName()
		} else {
			u.SetFirstName(*input.FirstNameIn.Value)
		}
	}
	if input.LastNameIn != nil && input.LastNameIn.IsUpdate {
		if input.LastNameIn.Value == nil {
			u.ClearLastName()
		} else {
			u.SetLastName(*input.LastNameIn.Value)
		}
	}
	if input.GenderIn != nil && input.GenderIn.IsUpdate {
		if input.GenderIn.Value == nil {
			u.ClearGender()
		} else {
			u.SetGender(*input.GenderIn.Value)
		}
	}
	if input.BirthdayIn != nil && input.BirthdayIn.IsUpdate {
		if input.BirthdayIn.Value == nil {
			u.ClearBirthday()
		} else {
			u.SetBirthday(*input.BirthdayIn.Value)
		}
	}
	if input.PhoneNumberIn != nil && input.PhoneNumberIn.IsUpdate {
		if input.GenderIn.Value == nil {
			u.ClearPhoneNumber()
		} else {
			u.SetPhoneNumber(*input.PhoneNumberIn.Value)
		}
	}
	if input.AddressIn != nil && input.AddressIn.IsUpdate {
		if input.GenderIn.Value == nil {
			u.ClearAddress()
		} else {
			u.SetAddress(*input.AddressIn.Value)
		}
	}
	if input.DescriptionIn != nil && input.DescriptionIn.IsUpdate {
		if input.DescriptionIn.Value == nil {
			u.ClearAddress()
		} else {
			u.SetDescription(*input.DescriptionIn.Value)
		}
	}
	if input.AvatarURLIn != nil && input.AvatarURLIn.IsUpdate {
		if input.AvatarURLIn.Value == nil {
			u.ClearAvatarURL()
		} else {
			u.SetAvatarURL(*input.AvatarURLIn.Value)
		}
	}

	user, err := u.Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("Failed updating current User: %v", err)
	}
	log.Println("Current User was updated: ", u)
	return user, nil
}

// ChangePassword of current User
func ChangePassword(ctx context.Context, client *ent.Client, id int, input *model.ChangePasswordIn) error {
	user, err := client.User.Query().Where(user.ID(id)).First(ctx)

	if !CheckPasswordHash(input.CurrentPassword, user.Password) {
		return errors.New("Current password not correct")
	}

	newHashedPassword, err := HashPassword(input.NewPassword)
	if err != nil {
		return err
	}

	user, err = user.Update().SetPassword(newHashedPassword).Save(ctx)

	return err
}

// ForgotPassword of the User
func ForgotPassword(ctx context.Context, client *ent.Client, userEmail *string) error {
	_, err := client.User.Query().Where(user.EmailEQ(*userEmail)).First(ctx)
	if err != nil {
		if ent.IsNotFound(err) {
			return errors.New("Email not exists")
		}
		return err
	}

	if len(config.AppConfig.MailServer.Sender.Email) == 0 || len(config.AppConfig.MailServer.Sender.Password) == 0 {
		return errors.New("Oops, outgoing mail server setting is not configured yet")
	}

	sender := email.NewSender(config.AppConfig.MailServer.Sender.Email, config.AppConfig.MailServer.Sender.Password)

	Receiver := []string{*userEmail}
	token, err := email.GenerateToken(*userEmail)
	if err != nil {
		return err
	}

	t, err := template.New("message").Parse(config.AppConfig.Email.ResetPassword.Body)
	if err != nil {
		panic(err)
	}
	var message bytes.Buffer

	err = t.Execute(&message, struct {
		BaseURL string
		Token   string
	}{
		BaseURL: config.AppConfig.BaseURL,
		Token:   token,
	})

	if err != nil {
		panic(err)
	}

	bodyMessage := sender.WriteHTMLEmail(Receiver, config.AppConfig.Email.ResetPassword.Subject, message.String())

	return sender.SendMail(Receiver, config.AppConfig.Email.ResetPassword.Subject, bodyMessage)
}

// ResetPassword of the User
func ResetPassword(ctx context.Context, client *ent.Client, input *model.ResetPasswordIn) error {
	userEmail, err := email.ParseToken(input.Token)
	if err != nil {
		return errors.New("Invalid token")
	}

	user, err := client.User.Query().Where(user.EmailEQ(userEmail)).First(ctx)

	if err != nil {
		if ent.IsNotFound(err) {
			return errors.New("Email not exists")
		}
		return err
	}
	newHashedPassword, err := HashPassword(input.NewPassword)
	if err != nil {
		return err
	}

	user, err = user.Update().SetPassword(newHashedPassword).Save(ctx)

	return err
}

// Users filter users
func Users(ctx context.Context, client *ent.Client, input *model.UsersIn) (*ent.UserConnection, error) {
	defaultFirst := 10
	if input == nil {
		return client.User.Query().Paginate(ctx, nil, &defaultFirst, nil, nil, ent.WithUserOrder(nil))
	}

	if input.PageIn == nil {
		input.PageIn = &model.PageIn{
			First: &defaultFirst,
		}
	}

	andConditions := []predicate.User{}

	if input.Email != nil && len(strings.TrimSpace(*input.Email)) > 0 {
		andConditions = append(andConditions, user.EmailContainsFold(*input.Email))
	}

	return client.User.Query().
		Where(
			user.And(andConditions...),
		).
		Paginate(ctx, input.PageIn.After, input.PageIn.First, input.PageIn.Before, input.PageIn.Last,
			ent.WithUserOrder(input.OrderBy),
		)
}

// Delete a User
func Delete(ctx context.Context, client *ent.Client, id int) error {
	return client.User.DeleteOneID(id).Exec(ctx)
}
