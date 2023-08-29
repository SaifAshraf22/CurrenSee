// selected-country.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Currency } from './Currency';

@Injectable({
  providedIn: 'root'
})
export class SelectedCountryService {
  private selectedCountrySubject: BehaviorSubject<Currency | undefined> = new BehaviorSubject<Currency | undefined>(undefined);
  private selectedCurrenciesSubject: BehaviorSubject<Currency[]> = new BehaviorSubject<Currency[]>([]);

  getSelectedCurrenciesFromLocalStorage(): Currency[] {
    const storedValue = localStorage.getItem('selectedCurrencies');
    return storedValue ? JSON.parse(storedValue) : [];
  }

  setSelectedCountry(country: Currency) {
    this.selectedCountrySubject.next(country);
  }

  setSelectedCurrencies(currencies: Currency[]) {
    this.selectedCurrenciesSubject.next(currencies);
  }

  getSelectedCurrencies() {
    return this.selectedCurrenciesSubject.asObservable();
  }
}

