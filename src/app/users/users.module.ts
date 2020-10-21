import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatetimepickerModule, MatNativeDatetimeModule } from "@mat-datetimepicker/core";

import { UsersRoutingModule } from './users-routing.module';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        UsersRoutingModule,
        MatInputModule,
        MatDialogModule,
        MatDatepickerModule,
        MatNativeDatetimeModule,
        MatDatetimepickerModule, 
        MatRadioModule,
        MatButtonModule,
    ],
    declarations: [
        LayoutComponent,
        ListComponent,
        AddEditComponent
    ],
    bootstrap: []
})
export class UsersModule { }