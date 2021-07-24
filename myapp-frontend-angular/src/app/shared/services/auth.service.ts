import { Injectable } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChangePasswordGQL, ChangePasswordIn, CurrentUserGQL, ForgotPasswordGQL, LoginByGoogleGQL, LoginGQL, LoginIn, LoginOut, RefreshTokenGQL, RegisterUserGQL, RegisterUserIn, RegisterUserOut, ResetPasswordGQL, ResetPasswordIn, TokenPair, UpdateCurrentUserGQL, UpdateCurrentUserIn, User } from 'src/generated/graphql';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$: Observable<User | null>;
  isAuthenticated$: Observable<boolean>;
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  constructor(
    private registerUserGQL: RegisterUserGQL,
    private loginGQL: LoginGQL,
    private loginByGoogleGQL: LoginByGoogleGQL,
    private currentUserGQL: CurrentUserGQL,
    private changePasswordGQL: ChangePasswordGQL,
    private forgotPasswordGQL: ForgotPasswordGQL,
    private resetPasswordGQL: ResetPasswordGQL,
    private updateCurrentUserGQL: UpdateCurrentUserGQL,
    private refreshTokenGQL: RefreshTokenGQL,
    private socialAuthService: SocialAuthService,
  ) {
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isAuthenticated$ = this.currentUserSubject.pipe(map(res => !!res));
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  register(input: RegisterUserIn): Observable<RegisterUserOut> {
    return this.registerUserGQL.mutate({ input }).pipe(map(res => {
      const registerUserOut = res.data!.registerUser;
      this.setUserContext(registerUserOut.user);
      this.setTokenPair(registerUserOut.tokenPair);
      return registerUserOut;
    }));
  }

  login(input: LoginIn): Observable<LoginOut> {
    return this.loginGQL.mutate({ input }).pipe(map((res) => {
      const loginOut = res.data!.login;
      this.setUserContext(loginOut.user);
      this.setTokenPair(loginOut.tokenPair);

      return loginOut as LoginOut;
    }));
  }

  populate(): void {
    if (!this.authToken) {
      this.purgeAuth();
      return;
    }
    this.currentUserGQL.fetch().subscribe(res => {
      this.setUserContext(res.data.currentUser);
    });
  }

  get accountInfo(): string {
    const fullName = (this.getString(this.getCurrentUser()?.firstName!) + ' ' + this.getString(this.getCurrentUser()?.lastName!)).trim();
    return fullName.length > 0 ? (fullName + ' | ' + this.getCurrentUser()?.email!) : this.getCurrentUser()?.email!;
  }

  purgeAuth(): void {
    this.removeTokenPair();
    this.currentUserSubject.next(null);
  }
  logout(): Observable<boolean> {
    this.purgeAuth();
    return of(true);
  }

  changePassword(input: ChangePasswordIn): Observable<boolean> {
    return this.changePasswordGQL.mutate({ input }).pipe(map((res) => {
      return res.data!.changePassword;
    }));
  }

  forgotPassword(email: string): Observable<boolean> {
    return this.forgotPasswordGQL.mutate({ email }).pipe(map((res) => {
      return res.data!.forgotPassword;
    }));
  }

  resetPassword(input: ResetPasswordIn): Observable<boolean> {
    return this.resetPasswordGQL.mutate({ input }).pipe(map((res) => {
      return res.data!.resetPassword;
    }));
  }

  setUserContext(user: any): void {
    this.currentUserSubject.next(user);
  }

  updateCurrentUser(input: UpdateCurrentUserIn): Observable<User> {
    return this.updateCurrentUserGQL.mutate({ input }).pipe(map(res => {
      this.setUserContext(res.data!.updateCurrentUser);
      return res.data!.updateCurrentUser as User;
    }));
  }

  refreshToken(): Observable<any> {
    const refreshTokenIn = this.authRefreshToken;
    this.removeTokenPair();
    return this.refreshTokenGQL.mutate({ refreshTokenIn: refreshTokenIn! }).
      pipe(map((res: any) => {
        this.setTokenPair(res.data.refreshToken);
        this.populate();

        return res.data.refreshToken;
      }));
  }

  get authToken(): string | null {
    return localStorage.getItem('token');
  }

  get authRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  async loginByGoogle(): Promise<LoginOut> {
    const socialuser = await this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    console.log(socialuser);
    return await this.loginByGoogleGQL.mutate({ input: { idToken: socialuser.idToken, authToken: socialuser.authToken } }).pipe(map((res) => {
      const loginOut = res.data!.loginByGoogle;
      this.setUserContext(loginOut.user);
      this.setTokenPair(loginOut.tokenPair);

      return loginOut as LoginOut;
    })).toPromise();
  }

  facebookAuth(): void {
    alert('Not implemented');
  }

  private setTokenPair(tokenPair: TokenPair): void {
    localStorage.setItem('token', tokenPair.token);
    localStorage.setItem('refreshToken', tokenPair.refreshToken);
  }

  private removeTokenPair(): void {
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('token');
  }

  private getString(input: string): string {
    if (input) {
      return input;
    }
    return '';
  }
}
