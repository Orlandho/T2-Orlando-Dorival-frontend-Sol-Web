import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { AlumnoListComponent } from './alumno-list';
import { AlumnoService } from '../../services/alumno';
import { Alumno } from '../../models/alumno';

describe('AlumnoListComponent', () => {
  let component: AlumnoListComponent;
  let fixture: ComponentFixture<AlumnoListComponent>;
  let alumnoServiceSpy: any;

  const mockAlumnos: Alumno[] = [
    { id: 2, nombres: 'Ana Torres', carrera: 'Ingeniería de Sistemas', ciclo: 5, promedio: 16.5, estadoAcademico: 'REGULAR' },
    { id: 3, nombres: 'Luis Pérez', carrera: 'Ingeniería Industrial', ciclo: 4, promedio: 11.8, estadoAcademico: 'EN RIESGO' }
  ];

  beforeEach(async () => {
    alumnoServiceSpy = {
      listar: vi.fn().mockReturnValue(of(mockAlumnos)),
      eliminar: vi.fn().mockReturnValue(of(undefined))
    };

    await TestBed.configureTestingModule({
      imports: [AlumnoListComponent],
      providers: [
        { provide: AlumnoService, useValue: alumnoServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AlumnoListComponent);
    component = fixture.componentInstance;
  });

  it('should create and load alumnos on init', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.alumnos.length).toBe(2);
    expect(component.alumnos[0].nombres).toBe('Ana Torres');
  });

  it('should handle error when backend is unavailable', () => {
    alumnoServiceSpy.listar.mockReturnValue(throwError(() => new Error('Server down')));
    component.cargarAlumnos();
    expect(component.errorMessage).toContain('No se pudo conectar con el servidor backend');
    expect(component.loading).toBe(false);
  });

  it('should remove alumno on delete confirm', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    component.alumnos = [...mockAlumnos];
    component.eliminar(2);

    expect(alumnoServiceSpy.eliminar).toHaveBeenCalledWith(2);
    expect(component.alumnos.length).toBe(1);
    expect(component.alumnos[0].id).toBe(3);
  });

  it('should not delete if confirm is cancelled', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    component.alumnos = [...mockAlumnos];
    component.eliminar(2);

    expect(alumnoServiceSpy.eliminar).not.toHaveBeenCalled();
    expect(component.alumnos.length).toBe(2);
  });

  it('should set error message if delete fails', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    alumnoServiceSpy.eliminar.mockReturnValue(throwError(() => new Error('Delete failed')));

    component.alumnos = [...mockAlumnos];
    component.eliminar(2);

    expect(component.errorMessage).toContain('Ocurrió un error al intentar eliminar el alumno en el backend.');
    expect(component.alumnos.length).toBe(2);
  });
});
