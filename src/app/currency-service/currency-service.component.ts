import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Currency } from 'src/app/Currency';

@Injectable({
  providedIn: 'root',
})
export class CurrencyServiceComponent {
  private currenciess: Currency[] = [];
  private lastUpdate;

  constructor(private http: HttpClient) {}

  public getCurrencies() {
    return this.currenciess;
  }

  public getLastUpdate() {
    return this.lastUpdate;
  }

  public getCurrenciesPromise() {
    return new Promise<any>((resolve, reject) => {
      if (this.currenciess.length === 0) {
        this.http.get<any>('https://bmgraduationproject-production.up.railway.app/api/v1/currencies-info/currencies')
          .subscribe(
            (data) => {
              if (data && data.data) {
                this.currenciess = data.data.map((item: { currencyCode: any; flagUrl: any; }) => {
                  return {
                    rate: 0,
                    full_name: item.currencyCode,
                    name: item.currencyCode,
                    flagUrl: item.flagUrl,
                  };
                });
                this.lastUpdate = new Date();
                this.fetchExchangeRates(resolve, reject);
              } else {
                reject('Error fetching currency data');
              }
            },
            (error) => {
              reject(error);
            }
          );
      } else {
        resolve(this.currenciess);
      }
    });
  }

  private fetchExchangeRates(resolve: any, reject: any) {
    this.http.get<any>('https://bmgraduationproject-production.up.railway.app/api/v1/exchange-rate/currency-exchangeRate/USD')
      .subscribe(
        (data) => {
          if (data && data.data) {
            const conversionRates = data.data;
            this.currenciess.forEach(currency => {
              const rateInfo = conversionRates.find((rate: any) => rate.code === currency.name);
              if (rateInfo) {
                currency.rate = rateInfo.rate;
              }
            });
            resolve(this.currenciess);
          } else {
            reject('Error fetching exchange rates');
          }
        },
        () => {
          reject();
        }
      );
  }
}