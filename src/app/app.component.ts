import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importa tus componentes de sección
import { HomeComponent } from './home/home.component';
import { SkillsComponent } from './skills/skills.component';
import { CurriculumComponent } from './curriculum/curriculum.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { ContactComponent } from './contact/contact.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HomeComponent,
    SkillsComponent,
    CurriculumComponent,
    PortfolioComponent,
    ContactComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  title = 'Santiago Beltran';
  isNavOpen = false; // <<--- AÑADIDA ESTA PROPIEDAD

  @ViewChildren("navLink") navLinks!: QueryList<ElementRef<HTMLAnchorElement>>;
  @ViewChildren(".page-section") pageSections!: QueryList<ElementRef<HTMLElement>>;

  private observer!: IntersectionObserver;
  private currentSectionId: string | null = 'home-section';

  constructor() {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setupIntersectionObserver();
      this.updateActiveLinkOnLoad();
    }, 0);
  }

  scrollTo(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      this.currentSectionId = sectionId;
      this.updateActiveLink();
      element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
  }

  // --- MÉTODOS AÑADIDOS PARA EL MENÚ HAMBURGUESA ---
  toggleNav(): void {
    this.isNavOpen = !this.isNavOpen;
  }

  closeNav(): void {
    this.isNavOpen = false;
  }
  // --- FIN DE MÉTODOS AÑADIDOS ---

  private setupIntersectionObserver(): void {
    const options = {
      root: null,
      rootMargin: "-40% 0px -60% 0px",
      threshold: 0
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if(this.currentSectionId !== entry.target.id){
            this.currentSectionId = entry.target.id;
            this.updateActiveLink();
          }
        }
      });
    }, options);

    if (this.pageSections) { // Añadir verificación
        this.pageSections.forEach(section => {
          if (section.nativeElement) { // Añadir verificación
            this.observer.observe(section.nativeElement);
          }
        });
    }
  }

  private updateActiveLink(): void {
    if (!this.navLinks) return;
    this.navLinks.forEach(linkRef => {
      const link = linkRef.nativeElement;
      const targetSection = link.getAttribute('data-target');
      if (targetSection === this.currentSectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  private updateActiveLinkOnLoad(): void {
    if (!window.location.hash) {
        this.currentSectionId = 'home-section';
        this.updateActiveLink();
    } else {
        const hashId = window.location.hash.substring(1);
        this.scrollTo(hashId); // Esto también llamará a updateActiveLink
    }
  }

  // HostListener opcional
  // @HostListener('window:scroll', ['$event'])
  // onWindowScroll() {
  //   const header = document.querySelector('.app-header') as HTMLElement;
  //   if (header) {
  //     if (window.pageYOffset > 50) {
  //       header.classList.add('scrolled');
  //     } else {
  //       header.classList.remove('scrolled');
  //     }
  //   }
  // }
}