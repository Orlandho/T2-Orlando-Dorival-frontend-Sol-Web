import { Component } from '@angular/core';
import { AlumnoListComponent } from './components/alumno-list/alumno-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AlumnoListComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
