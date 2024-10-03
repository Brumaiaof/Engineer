import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Calculation from '../models/Calculation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalculationsService {
  calculationApiUrl = "http://localhost:4000/api";

  constructor(private http: HttpClient) { }

  get(): Observable<Calculation[]> { 
    return this.http.get<Calculation[]>(`${this.calculationApiUrl}/allCalculations`);

  }

  create(calculation: Calculation): Observable<Calculation> {
    return this.http.post<Calculation>(`${this.calculationApiUrl}/create/calculation`, {
      number1: calculation.number1,
      number2: calculation.number2
    });

  }

  update(calculation: Calculation): Observable<Calculation> {
    return this.http.put<Calculation>(`${this.calculationApiUrl}/update/calculation/${calculation._id}`, calculation);

  }

  delete(id: string): Observable<void>{
    return this.http.delete<void>(`${this.calculationApiUrl}/delete/calculation/${id}`);

  }

}
