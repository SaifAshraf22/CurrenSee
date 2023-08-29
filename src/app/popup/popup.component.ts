import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Currency } from 'src/app/Currency';
import { CurrencyServiceComponent } from 'src/app/currency-service/currency-service.component';
import { SelectedCountryService } from 'src/app/selected-country.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  @ViewChild('myInput') myInput: any;
  @Output() selectedCurrenciesChanged = new EventEmitter<Currency[]>();
  @Input() currencyList: Currency[] = [];

  constructor(
    private currencyService: CurrencyServiceComponent,
    private selectedCountryService: SelectedCountryService,
    private cdr: ChangeDetectorRef
  ) {}

  selectCountry(currency: Currency) {
    this.selectedCountryService.setSelectedCountry(currency);
  }

  ngOnInit(): void {
    this.getCurrencyList();
    this.loadSelectedCurrencies();
    this.populateCurrencyList();
  }

  loadSelectedCurrencies() {
    const selectedCurrencies = this.getSelectedCurrencies();
    this.selectedCountryService.setSelectedCurrencies(selectedCurrencies);
    this.selectedCurrenciesChanged.emit(selectedCurrencies);
  }

  populateCurrencyList() {
    this.currencyService.getCurrenciesPromise().then((currencies: Currency[]) => {
      this.currencyList = currencies;
    }).catch((error) => {
      console.error('Error fetching currencies:', error);
    });
  }

  isCurrencySelected(currency: Currency): boolean {
    const selectedCurrencies = this.getSelectedCurrencies();
    return selectedCurrencies.some((c: Currency) => c.name === currency.name);
  }

  onCheckboxChange(selectedCurrency: Currency) {
    const selectedCurrencies = this.getSelectedCurrencies();
    
    const currencyExists = selectedCurrencies.some((c: Currency) => c.name === selectedCurrency.name);
    
    let updatedCurrencies: Currency[];
    
    if (currencyExists) {
      updatedCurrencies = selectedCurrencies.filter((c: Currency) => c.name !== selectedCurrency.name);
    } else {
      updatedCurrencies = [...selectedCurrencies, selectedCurrency];
    }
    
    localStorage.setItem('selectedCurrencies', JSON.stringify(updatedCurrencies));
    
    this.updateSelectedCurrencies(updatedCurrencies);
  }

  updateSelectedCurrencies(selectedCurrencies: Currency[]) {
    this.selectedCountryService.setSelectedCurrencies(selectedCurrencies);
    this.cdr.detectChanges();
    this.selectedCurrenciesChanged.emit(selectedCurrencies);
  }
  

  getSelectedCurrencies(): Currency[] {
    const storedValue = localStorage.getItem('selectedCurrencies');
    return storedValue ? JSON.parse(storedValue) : [];
  }

  getCurrencyList() {
    this.currencyService.getCurrenciesPromise()
      .then((currencies) => {
        this.currencyList = currencies;
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
