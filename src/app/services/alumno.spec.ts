import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AlumnoService } from './alumno';

describe('AlumnoService', () => {
  let service: AlumnoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AlumnoService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AlumnoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch alumnos list', () => {
    const mockAlumnos = [
      { id: 1, nombres: 'Ana Torres', carrera: 'Sistemas', ciclo: 5, promedio: 16.5, estadoAcademico: 'REGULAR' }
    ];

    service.listar().subscribe((alumnos) => {
      expect(alumnos.length).toBe(1);
      expect(alumnos[0].nombres).toBe('Ana Torres');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/alumnos');
    expect(req.request.method).toBe('GET');
    req.flush(mockAlumnos);
  });

  it('should delete an alumno', () => {
    service.eliminar(1).subscribe((res) => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/alumnos/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });
});
