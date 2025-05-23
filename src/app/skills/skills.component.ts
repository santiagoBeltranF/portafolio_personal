import { Component, ElementRef, QueryList, ViewChildren, AfterViewInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.css'
})
export class SkillsComponent implements AfterViewInit, OnDestroy {
  // Usaremos una referencia para cada tarjeta para el IntersectionObserver
  @ViewChildren(ElementRef) skillCardElements!: QueryList<ElementRef<HTMLDivElement>>;
  // O más específicamente si todas las tarjetas tienen una clase común, ej .skill-card
  // @ViewChildren('.skill-card') skillCards!: QueryList<ElementRef<HTMLDivElement>>;


  private observers: IntersectionObserver[] = []; // Un observer por tarjeta
  private hasAnimated = new Set<HTMLElement>();

  private hostElementRef = inject(ElementRef); // Para observar toda la sección
  private cdr = inject(ChangeDetectorRef);

  // Se usará el ElementRef de cada .skill-card individualmente
  constructor(private el: ElementRef) {}


  ngAfterViewInit(): void {
    // Dar tiempo para que los elementos estén en el DOM y se rendericen
    setTimeout(() => {
        // Usaremos el el.nativeElement como root para observar items dentro de la sección
        const sectionElement = this.el.nativeElement.querySelector('.skills-section-container');
        if (sectionElement) {
            this.initIntersectionObserverForSection(sectionElement);
        } else {
            // Fallback si el contenedor de sección no se encuentra, observar el host
            this.initIntersectionObserverForSection(this.el.nativeElement);
        }
    }, 150);
  }

  private initIntersectionObserverForSection(sectionElement: HTMLElement): void {
    const skillCards = sectionElement.querySelectorAll('.skill-card');

    const cardOptions = {
      root: null, // Viewport
      rootMargin: '0px 0px -10% 0px', // Activar cuando el 10% inferior de la tarjeta entra en vista
      threshold: 0.1 // Activar cuando el 10% de la tarjeta es visible
    };

    skillCards.forEach(card => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.hasAnimated.has(entry.target as HTMLElement)) {
            const chartValuePath = entry.target.querySelector('.chart-value') as SVGPathElement | null;
            if (chartValuePath) {
              this.animateChart(chartValuePath);
              this.hasAnimated.add(entry.target as HTMLElement);
              observer.unobserve(entry.target); // Dejar de observar esta tarjeta
            }
          }
        });
      }, cardOptions);
      observer.observe(card);
      this.observers.push(observer); // Guardar para limpiar en ngOnDestroy
    });
  }


  private animateChart(pathElement: SVGPathElement): void {
    const level = parseInt(pathElement.getAttribute('data-level') || '0', 10);
    const radius = 15.9155; // Mismo radio que en el atributo 'd' del path
    const circumference = 2 * Math.PI * radius;

    const offset = circumference - (level / 100) * circumference;

    // Forzar reflow antes de aplicar la transición para asegurar que se anime desde 0
    pathElement.style.strokeDasharray = `${circumference} ${circumference}`;
    pathElement.style.strokeDashoffset = `${circumference}`; // Inicia "vacío"

    requestAnimationFrame(() => {
      pathElement.style.strokeDashoffset = `${offset}`;
    });
  }

  ngOnDestroy(): void {
    this.observers.forEach(observer => observer.disconnect());
  }
}