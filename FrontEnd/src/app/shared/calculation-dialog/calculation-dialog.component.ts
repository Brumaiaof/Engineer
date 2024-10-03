import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Calculation from '../../models/Calculation';
import { CalculationsService } from '../../services/calculations.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-calculation-dialog',
  templateUrl: './calculation-dialog.component.html',
  styleUrls: ['./calculation-dialog.component.scss']
})
export class CalculationDialogComponent implements OnInit {

  saving: boolean = false;
  isSubmitting: boolean = false;




  constructor(
    public dialogRef: MatDialogRef<CalculationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Calculation,
    private calculationsService: CalculationsService
  ) { }

  ngOnInit(): void {
    
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

  

  ///tentativa de evitar duplicar registro

  onSubmit(): void {
    if (this.isSubmitting) {
      console.log('Tentativa de submissão enquanto já estava enviando.');
      return;
    }

    this.isSubmitting = true; // Marca o início da submissão

    this.calculationsService.create(this.data).subscribe({
      next: (response) => {
        console.log('Cálculo submetido com sucesso:', response);
        this.isSubmitting = false; // Libera o estado de submissão
        this.dialogRef.close(response); // Fecha o diálogo com a resposta
      },
      error: (error) => {
        console.error('Erro ao submeter o cálculo:', error);
        this.isSubmitting = false; // Libera o estado de submissão em caso de erro
      }
    });
  }
}

