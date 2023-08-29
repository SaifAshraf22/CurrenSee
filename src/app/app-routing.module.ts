import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CurrencyCompareComponent } from './currency-compare/currency-compare.component';
const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'currency-compare', component: CurrencyCompareComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
