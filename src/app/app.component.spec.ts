import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing'; // Necesario para <router-outlet>

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent, // Dado que AppComponent es standalone
        RouterTestingModule // Para el <router-outlet>
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the title 'Santiago Beltran'`, () => { // Test para el nuevo título
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Santiago Beltran');
  });

  it('should render the name SANTIAGO BELTRAN in an h1 tag', () => { // Test para el h1 principal
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const h1Element = compiled.querySelector('.profile-card h1.name');
    expect(h1Element?.textContent).toContain('SANTIAGO BELTRAN');
  });
});
