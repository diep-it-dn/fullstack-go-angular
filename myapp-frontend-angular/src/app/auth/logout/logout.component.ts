import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  loading = false;

  constructor(
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.authService.logout().
    pipe(
      finalize(() => {
        this.loading = false;
      })
    ).
    subscribe(res => {
      this.router.navigate(['auth', 'login']);
    });
  }

}
