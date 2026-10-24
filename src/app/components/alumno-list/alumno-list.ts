import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Alumno } from '../../models/alumno';
import { AlumnoService } from '../../services/alumno';

@Component({
  selector: 'app-alumno-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alumno-list.html',
  styleUrl: './alumno-list.scss'
})
export class AlumnoListComponent implements OnInit {

  alumnos: Alumno[] = [];
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private alumnoService: AlumnoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarAlumnos();
  }

  cargarAlumnos(): void {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();
    this.alumnoService.listar().subscribe({
      next: (data) => {
        this.alumnos = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'No se pudo conectar con el servidor backend. Verifique que el servicio Spring Boot esté en ejecución en el puerto 8080.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  eliminar(id: number | undefined): void {
    if (id === undefined || id === null) return;
    if (confirm(`¿Está seguro de eliminar al alumno con ID ${id}?`)) {
      this.errorMessage = '';
      this.alumnoService.eliminar(id).subscribe({
        next: () => {
          this.alumnos = this.alumnos.filter(a => a.id !== id);
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMessage = 'Ocurrió un error al intentar eliminar el alumno en el backend.';
          this.cdr.detectChanges();
        }
      });
    }
  }
}
