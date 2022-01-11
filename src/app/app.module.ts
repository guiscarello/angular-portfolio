import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

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
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/pages/main/main.component';
import { AddWorkComponent } from './components/work-experiences/add-work/add-work.component';
import { EditComponent } from './components/work-experiences/edit/edit.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { WorkFormComponent } from './components/work-experiences/work-form/work-form.component';
import { EditWorkComponent } from './components/work-experiences/edit-work/edit-work.component';

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
    AddWorkComponent,
    EditComponent,
    DialogComponent,
    WorkFormComponent,
    EditWorkComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
