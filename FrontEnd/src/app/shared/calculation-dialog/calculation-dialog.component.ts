import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Calculation from '../../models/Calculation';
import { CalculationsService } from '../../services/calculations.service';

@Component({
  selector: 'app-calculation-dialog',
  templateUrl: './calculation-dialog.component.html',
  styleUrls: ['./calculation-dialog.component.scss']
})
export class CalculationDialogComponent implements OnInit {

  saving: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CalculationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Calculation,
    private calculationsService: CalculationsService
  ) {}

  ngOnInit(): void {
    // Inicializa os campos com valores padrão se for um novo cálculo
    if (!this.data._id) {
      this.data.number1 = 0;
      this.data.number2 = 0;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    if (this.saving) {
      console.log('Tentativa de criar enquanto já estava salvando.');
      return;
    }
  
    if (this.data.number1 == null || this.data.number2 == null) {
      console.error('Parâmetros faltando: number1 ou number2 não foram fornecidos.');
      return;
    }
  
    console.log('Iniciando criação...');
    this.saving = true;
  
    this.calculationsService.create(this.data).subscribe({
      next: (newCalculation) => {
        console.log('Cálculo criado com sucesso:', newCalculation);
        this.saving = false;
        this.dialogRef.close(newCalculation);
      },
      error: (error) => {
        console.error('Erro ao criar o cálculo:', error);
        this.saving = false;
      }
    });
  }
  
  onUpdate(): void {
    if (this.saving) {
      console.log('Tentativa de atualizar enquanto já estava salvando.');
      return;
    }
  
    if (!this.data._id) {
      console.error('Erro: ID não encontrado para atualização.');
      return;
    }
  
    console.log('Iniciando atualização...');
    this.saving = true;
  
    this.calculationsService.update(this.data).subscribe({
      next: (updatedCalculation) => {
        console.log('Cálculo atualizado com sucesso:', updatedCalculation);
        this.saving = false;
        this.dialogRef.close(updatedCalculation);
      },
      error: (error) => {
        console.error('Erro ao atualizar o cálculo:', error);
        this.saving = false;
      }
    });
  }
}  