import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })

  export class SharedServiceService {
    private _fromExchangeRateSubject: BehaviorSubject<number | undefined> = new BehaviorSubject<number | undefined>(undefined);
    
    get fromExchangeRate$() {
      return this._fromExchangeRateSubject.asObservable();
    }
  
    setFromExchangeRate(value: number | undefined) {
      this._fromExchangeRateSubject.next(value);
    }

}
