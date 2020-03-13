import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { FieldComponent } from './components/field/field.component';
import { HistoryComponent } from './components/history/history.component';
import { CellDirective } from './directives/cell.directive';
import { InterfaceComponent } from './components/interface/interface.component';
import { AlertComponent } from './components/alert/alert.component';

@NgModule({
  declarations: [
    AppComponent,
    FieldComponent,
    HistoryComponent,
    CellDirective,
    InterfaceComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
