import { Component, OnInit, ViewChild } from '@angular/core';
import Calculation, { CalculationModel } from '../../models/Calculation';
import { CalculationDialogComponent } from '../../shared/calculation-dialog/calculation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CalculationsService } from '../../services/calculations.service';
import { MatTable } from '@angular/material/table';
import { take } from 'rxjs';

@Component({
  selector: 'app-calculations',
  templateUrl: './calculations.component.html',
  styleUrls: ['./calculations.component.scss'],
  providers: [CalculationsService]
})
export class CalculationsComponent implements OnInit {

  saving: boolean = false;

  @ViewChild(MatTable, { static: false })
  table!: MatTable<any>;
  calculations: Calculation[] = [];
  displayedColumns: string[] = ["number1", "number2", "result", "status", "actions"];

  constructor(
    public dialog: MatDialog,
    public calculationService: CalculationsService
  ) {
    this.calculationService.get()
      .subscribe(data => {
        this.calculations = data.map(item => new CalculationModel(
          item._id,
          item.number1,
          item.number2,
          item.result,
          item.status
        ));
      });
  }

  ngOnInit(): void {}

  createCalculation(): void {
    const dialogRef = this.dialog.open(CalculationDialogComponent, {
      width: '250px',
      data: { number1: 0, number2: 0, status: 'pending' } // Inicializa para criação
    });
  
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result) {
        this.saving = true;
  
        // Chamando diretamente a lógica de criação
        this.calculationService.create(result).subscribe({
          next: data => {
            const newCalculation = new CalculationModel(
              data._id,
              data.number1,
              data.number2,
              data.result,
              data.status
            );
            this.calculations.push(newCalculation);
            this.table.renderRows();
            this.saving = false;
          },
          error: error => {
            console.error('Erro ao criar o cálculo:', error);
            this.saving = false;
          }
        });
      }
    });
  }
  
  updateCalculation(calculation: Calculation): void {

    if (!calculation._id) {
      console.error('Erro: Tentativa de atualizar um cálculo sem ID.');
      return;
    }



    const dialogRef = this.dialog.open(CalculationDialogComponent, {
      width: '250px',
      data: { ...calculation } // Abre o diálogo com os dados existentes para atualização
    });
  
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result) {
        this.saving = true;
  
        // Chamando diretamente a lógica de atualização
        this.calculationService.update(result).subscribe({
          next: data => {
            const updatedCalculation = new CalculationModel(
              data._id,
              data.number1,
              data.number2,
              data.result,
              data.status
            );
            const index = this.calculations.findIndex(p => p._id === updatedCalculation._id);
            if (index > -1) {
              this.calculations[index] = updatedCalculation;
              this.table.renderRows();
            }
            this.saving = false;
          },
          error: error => {
            console.error('Erro ao atualizar o cálculo:', error);
            this.saving = false;
          }
        });
      }
    });
  }
  

  

  deleteCalculation(id: string): void {
    if (!id) {
      console.error('ID não fornecido para deleção');
      return;
    }

    if (confirm('Tem certeza que deseja deletar este cálculo?')) {
      this.calculationService.delete(id).subscribe({
        next: () => {
          this.calculations = this.calculations.filter(p => p._id !== id);
          this.table.renderRows();
        },
        error: error => console.error('Erro ao deletar o cálculo:', error)
      });
    }
  }
}
