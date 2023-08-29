import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CurrencyCompareComponent } from './currency-compare/currency-compare.component';
import { CurrenciesComponent } from './currency-selector/currencies/currencies.component';
import { CurrencySelectorComponent } from './currency-selector/currency-selector.component';
import { CurrencyServiceComponent } from './currency-service/currency-service.component';
import { LiveExecComponent } from './live-exec/live-exec.component';
import { PopupComponent } from './popup/popup.component';


@NgModule({
  declarations: [AppComponent, CurrenciesComponent, CurrencySelectorComponent, CurrencyCompareComponent, PopupComponent, LiveExecComponent,],
  imports: [MatDialogModule, BrowserModule, AppRoutingModule, FormsModule, NgbModule, HttpClientModule, BrowserAnimationsModule],
  providers: [CurrencyServiceComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
