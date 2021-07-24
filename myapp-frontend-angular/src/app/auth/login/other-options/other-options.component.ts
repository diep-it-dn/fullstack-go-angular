import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-other-options',
  templateUrl: './other-options.component.html',
  styleUrls: ['./other-options.component.scss']
})
export class OtherOptionsComponent implements OnInit {
  returnUrl!: string;
  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  loginByGoogle(): void {
    this.authService.loginByGoogle().then(() => {
      this.router.navigateByUrl(this.returnUrl);
    });
  }

}
