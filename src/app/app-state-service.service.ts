import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  private activeModeSubject = new BehaviorSubject<'Convert' | 'Compare'>(
    'Convert'
  );
  activeMode$ = this.activeModeSubject.asObservable();

  setActiveMode(mode: 'Convert' | 'Compare') {
    this.activeModeSubject.next(mode);
  }
}
