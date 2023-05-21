import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { BeatsModule } from './beats/beats.module';
import { SharedModule } from './shared/shared.module';
import { LoginModule } from './login/login.module';
import { FaqModule } from './faq/faq.module';
import { UserService } from './services/user.service';
import { BeatService } from './services/beat.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './auth-interceptor.service';
import { AuthService } from './services/auth.service';
import { RolGuardGuard } from './rol-guard.guard';
import { EditUserModule } from './edit-user/edit-user.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    BeatsModule,
    SharedModule,
    LoginModule,
    FaqModule,
    HttpClientModule,
    EditUserModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    FormsModule,


  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    UserService,
    BeatService,
    AuthService,
    RolGuardGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
