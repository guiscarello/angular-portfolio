import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { NgxCaptchaModule } from 'ngx-captcha';
import { NgxEchartsModule } from 'ngx-echarts';


import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { NavSocialComponent } from './components/header/nav/nav-social/nav-social.component';
import { BannerComponent } from './components/banner/banner.component';
import { NavBrandComponent } from './components/header/nav/nav-brand/nav-brand.component';
import { CarouselComponent } from './components/banner/carousel/carousel/carousel.component';
import { CarouselItemComponent } from './components/banner/carousel/carousel-item/carousel-item.component';
import { WorkExperiencesComponent } from './components/work-experiences/work-experiences.component';
import { WorkExperienceComponent } from './components/work-experiences/work-experience/work-experience.component';
import { EducationComponent } from './components/education/education.component';
import { SectionTitleComponent } from './components/section-title/section-title.component';
import { EducationItemComponent } from './components/education/education-item/education-item.component';
import { LoginComponent } from './components/pages/login/login.component';
import { MainComponent } from './components/pages/main/main.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { WorkFormComponent } from './components/work-experiences/work-form/work-form.component';
import { AlertComponent } from './components/alert/alert.component';
import { EditComponent } from './components/edit/edit.component';
import { SkillsComponent } from './components/skills/skills.component';
import { SkillItemComponent } from './components/skills/skill-item/skill-item.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { EducationFormComponent } from './components/education/education-form/education-form.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContactComponent } from './components/contact/contact.component';

import * as echarts from 'echarts';

import { RequestInterceptorService } from './services/interceptor/request.interceptor.service';
import { ResponseInterceptorService } from './services/interceptor/response.interceptor.service';

import { SkillFormComponent } from './components/skills/skill-form/skill-form.component';
import { ProjectFormComponent } from './components/projects/project-form/project-form.component';
import { ProjectItemComponent } from './components/projects/project-item/project-item.component';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { ImageDisplayComponent } from './components/projects/image-display/image-display.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ConfigComponent } from './components/pages/config/config.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { ConfigDirective} from './directives/config.directive';
import { UsersComponent } from './components/config-items/users/users.component';
import { SocialsComponent } from './components/config-items/socials/socials.component';
import { StartPageComponent } from './components/config-items/start-page/start-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavSocialComponent,
    BannerComponent,
    NavBrandComponent,
    CarouselComponent,
    CarouselItemComponent,
    WorkExperiencesComponent,
    WorkExperienceComponent,
    EducationComponent,
    SectionTitleComponent,
    EducationItemComponent,
    LoginComponent,
    MainComponent,
    DialogComponent,
    WorkFormComponent,
    AlertComponent,
    EditComponent,
    SkillsComponent,
    SkillItemComponent,
    ProjectsComponent,
    TimelineComponent,
    EducationFormComponent,
    FooterComponent,
    ContactComponent,
    SkillFormComponent,
    ProjectFormComponent,
    ProjectItemComponent,
    ImageDisplayComponent,
    LoadingComponent,
    ConfigComponent,
    SideMenuComponent,
    ConfigDirective,
    UsersComponent,
    SocialsComponent,
    StartPageComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxCaptchaModule,
    NgxEchartsModule.forRoot({
      echarts
    }),
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass:RequestInterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass:ResponseInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
