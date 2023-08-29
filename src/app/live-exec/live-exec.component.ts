// live-exec.component.ts
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CurrencyServiceComponent } from '../currency-service/currency-service.component';
import { Currency } from '../Currency';
import { BehaviorSubject } from 'rxjs';
import { SharedServiceService } from '../shared-service.service';
import { SelectedCountryService } from '../selected-country.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-live-exec',
  templateUrl: './live-exec.component.html',
  styleUrls: ['./live-exec.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiveExecComponent implements OnInit {
  savedCountries: Currency[] = [];
  public currencyList: Currency[] = [];
  public selectedFromCurrency: Currency | undefined;

  private _fromExchangeRate: number | undefined;
  private _fromExchangeRateSubject: BehaviorSubject<number | undefined> = new BehaviorSubject<number | undefined>(undefined);

  constructor(
    private currencyService: CurrencyServiceComponent,
    private cdr: ChangeDetectorRef,
    private SharedServiceService: SharedServiceService,
    private selectedCountryService: SelectedCountryService,
    private dialogRef: MatDialog
  ) {}

  onDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = { top: '3rem', right: '3rem' };
    dialogConfig.width = '400px';
    dialogConfig.height = '600px';
    const dialogRef = this.dialogRef.open(PopupComponent, dialogConfig);
    dialogRef.componentInstance.selectedCurrenciesChanged.subscribe((selectedCurrencies: Currency[]) => {
      this.updateSelectedCurrencies(selectedCurrencies);
    });
  }

  updateSelectedCurrencies(selectedCurrencies: Currency[]) {
    this.savedCountries = selectedCurrencies;
    this.selectedCountryService.setSelectedCurrencies(selectedCurrencies);
    this.calculateExchangeRates();
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.loadSelectedCurrencies();
    this.populateCurrencyList();

    this.SharedServiceService.fromExchangeRate$.subscribe((rate) => {
      this.fromExchangeRate = rate;
      this.calculateExchangeRates();
      this.cdr.detectChanges();
    });
    


    this.selectedCountryService.getSelectedCurrencies().subscribe((selectedCurrencies: Currency[]) => {
      this.savedCountries = selectedCurrencies;
      this.calculateExchangeRates();
      this.cdr.detectChanges();
    });
  }

  loadSelectedCurrencies() {
    this.savedCountries = this.selectedCountryService.getSelectedCurrenciesFromLocalStorage();
    this.selectedCountryService.setSelectedCurrencies(this.savedCountries);
  }

  populateCurrencyList() {
    this.currencyService.getCurrenciesPromise().then((currencies: Currency[]) => {
      this.currencyList = currencies;

      this.currencyList = this.currencyList.filter((currency) =>
        this.savedCountries.some((savedCurrency) => savedCurrency.name === currency.name)
      );

      this.calculateExchangeRates();
      this.cdr.detectChanges();
    }).catch((error) => {
      console.error('Error fetching currencies:', error);
    });
  }

  calculateExchangeRates() {
    if (this.selectedFromCurrency && this._fromExchangeRate !== undefined) {
      this.savedCountries.forEach((currency: Currency) => {
        currency.calculatedRate = this._fromExchangeRate! / currency.rate;
      });
      this.cdr.markForCheck();
    }
  }

  get fromExchangeRate() {
    return this._fromExchangeRateSubject.value;
  }

  set fromExchangeRate(value: number | undefined) {
    if (value !== this._fromExchangeRate) {
      this._fromExchangeRate = value;
      this._fromExchangeRateSubject.next(value);
      if (value !== undefined) {
        localStorage.setItem('fromExchangeRate', value.toString());
        this.calculateExchangeRates();
        this.cdr.detectChanges();
      }
    }
  }

  fetchExchangeRate(fromCurrency: Currency) {
    if (!fromCurrency) return;

    // Fetch exchange rates and populate the list
    this.currencyService.getCurrenciesPromise().then(
      (data) => {
        const selectedCurrency = data.find((currency) => currency.name === fromCurrency.name);
        if (selectedCurrency) {
          this.fromExchangeRate = selectedCurrency.rate;
          localStorage.setItem('fromExchangeRate', this.fromExchangeRate!.toString());
          this.calculateExchangeRates();
          this.currencyList = data.filter((currency) =>
            this.savedCountries.some((savedCurrency) => savedCurrency.name === currency.name)
          );
          this.cdr.detectChanges();
        }
      },
      () => {}
    );
  }
}
function updateSelectedCurrencies(selectedCurrencies: any, arg1: any) {
  throw new Error('Function not implemented.');
}

