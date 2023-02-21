import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { BeatsModule } from './beats/beats.module';
import { SharedModule } from './shared/shared.module';
import { LoginModule } from './login/login.module';
import { FaqModule } from './faq/faq.module';
import { RegisterModule } from './register/register.module';
import { UserService } from './services/user.service';
import { BeatService } from './services/beat.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './auth-interceptor.service';
import { AuthService } from './services/auth.service';
import { RolGuardGuard } from './rol-guard.guard';



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
    RegisterModule,
    HttpClientModule

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
