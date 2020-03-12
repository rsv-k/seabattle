import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { FieldComponent } from './components/field/field.component';
import { HistoryComponent } from './components/history/history.component';
import { CellDirective } from './directives/cell.directive';

@NgModule({
  declarations: [
    AppComponent,
    FieldComponent,
    HistoryComponent,
    CellDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
