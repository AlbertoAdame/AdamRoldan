import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isLoggedIn!: boolean;

  constructor(private authService: AuthService, private translate: TranslateService) {
    this.translate.addLangs(['es', 'en']);
  }

  ngOnInit(): void {
    this.authService.isAuthenticated();
  }
}
