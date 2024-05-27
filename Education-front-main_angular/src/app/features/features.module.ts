import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeaturesRoutingModule } from './features-routing.module';
import { UserComponent } from './user/user.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';


@NgModule({
  declarations: [
    UserComponent
  ],
  imports: [
    CommonModule,
    FeaturesRoutingModule,
    MaterialModule,
    FormsModule

  ]
})
export class FeaturesModule { }
