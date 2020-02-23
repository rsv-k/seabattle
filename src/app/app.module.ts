import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { FieldComponent } from './components/field/field.component';
import { CellComponent } from './components/field/cell/cell.component';

@NgModule({
  declarations: [
    AppComponent,
    FieldComponent,
    CellComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
