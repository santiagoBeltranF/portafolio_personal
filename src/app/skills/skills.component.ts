import { Component, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Skill {
  title: string;
  levelText: string;
  chartClass: string;
  dataLevel: number;
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.css'
})
export class SkillsComponent implements AfterViewInit, OnDestroy {
  private observers: IntersectionObserver[] = [];
  private hasAnimated = new Set<HTMLElement>();
  private el = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);

  frontendSkills: Skill[] = [
    {
      title: 'ANGULAR',
      levelText: 'Intermedio',
      chartClass: 'angular-value',
      dataLevel: 70
    },
    {
      title: 'REACT',
      levelText: 'Intermedio',
      chartClass: 'react-value',
      dataLevel: 65
    },
    {
      title: 'HTML & CSS',
      levelText: 'Experto',
      chartClass: 'html-css-value',
      dataLevel: 90
    },
  ];

  backendSkills: Skill[] = [
    {
      title: 'SPRING (Java)',
      levelText: 'Intermedio',
      chartClass: 'java-value',
      dataLevel: 65
    },
    {
      title: 'PYTHON',
      levelText: 'Competente',
      chartClass: 'python-value',
      dataLevel: 85
    },
    {
      title: 'NODE.JS (JavaScript)',
      levelText: 'Intermedio',
      chartClass: 'nodejs-value',
      dataLevel: 70
    },
    {
      title: 'SQL',
      levelText: 'Competente',
      chartClass: 'sql-value',
      dataLevel: 80
    },
    {
      title: 'DOCKER',
      levelText: 'Uso Regular',
      chartClass: 'docker-value',
      dataLevel: 60
    },
    {
      title: 'GIT',
      levelText: 'Uso Diario',
      chartClass: 'git-value',
      dataLevel: 90
    }
  ];

  currentFrontendSkillIndex = 0;
  currentBackendSkillIndex = 0;

  ngAfterViewInit(): void {
    setTimeout(() => {
        const sectionElement = this.el.nativeElement.querySelector('.skills-section-container');
        if (sectionElement) {
            this.initIntersectionObserverForSection(sectionElement);
        } else {
            this.initIntersectionObserverForSection(this.el.nativeElement);
        }
        this.cdr.detectChanges();
        this.triggerAnimationForVisibleFrontendSlide();
        this.triggerAnimationForVisibleBackendSlide();
    }, 150);
  }

  private initIntersectionObserverForSection(sectionElement: HTMLElement): void {
    const skillCards = sectionElement.querySelectorAll('.skill-card');
    const cardOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1
    };

    skillCards.forEach(card => {
      if (this.observers.some(obsEntry => obsEntry.takeRecords().some(record => record.target === card))) {
        return;
      }
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.hasAnimated.has(entry.target as HTMLElement)) {
            const chartValuePath = entry.target.querySelector('.chart-value') as SVGPathElement | null;
            if (chartValuePath) {
              this.animateChart(chartValuePath);
              this.hasAnimated.add(entry.target as HTMLElement);
            }
          }
        });
      }, cardOptions);
      observer.observe(card);
      this.observers.push(observer);
    });
  }

  private animateChart(pathElement: SVGPathElement): void {
    const level = parseInt(pathElement.getAttribute('data-level') || '0', 10);
    const radius = 15.9155;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (level / 100) * circumference;

    pathElement.style.strokeDasharray = `${circumference} ${circumference}`;
    pathElement.style.strokeDashoffset = `${circumference}`;

    requestAnimationFrame(() => {
      pathElement.style.strokeDashoffset = `${offset}`;
    });
  }

  nextFrontendSkill(): void {
    if (this.currentFrontendSkillIndex < this.frontendSkills.length - 1) {
      this.currentFrontendSkillIndex++;
    } else {
      this.currentFrontendSkillIndex = 0;
    }
    this.triggerAnimationForVisibleFrontendSlide();
  }

  prevFrontendSkill(): void {
    if (this.currentFrontendSkillIndex > 0) {
      this.currentFrontendSkillIndex--;
    } else {
      this.currentFrontendSkillIndex = this.frontendSkills.length - 1;
    }
    this.triggerAnimationForVisibleFrontendSlide();
  }

  goToFrontendSkill(index: number): void {
    this.currentFrontendSkillIndex = index;
    this.triggerAnimationForVisibleFrontendSlide();
  }

  getFrontendCarouselTransform(): string {
    return `translateX(-${this.currentFrontendSkillIndex * 100}%)`;
  }

  private triggerAnimationForVisibleFrontendSlide(): void {
    setTimeout(() => {
      const trackElement = this.el.nativeElement.querySelector('.frontend-carousel-track');
      if (trackElement && this.frontendSkills.length > 0 && trackElement.children[this.currentFrontendSkillIndex]) {
        const visibleSlideCard = trackElement.children[this.currentFrontendSkillIndex].querySelector('.skill-card');
        if (visibleSlideCard && !this.hasAnimated.has(visibleSlideCard as HTMLElement)) {
          const chartValuePath = visibleSlideCard.querySelector('.chart-value') as SVGPathElement | null;
          if (chartValuePath) {
            this.animateChart(chartValuePath);
            this.hasAnimated.add(visibleSlideCard as HTMLElement);
          }
        }
      }
    }, 50);
  }

  nextBackendSkill(): void {
    if (this.currentBackendSkillIndex < this.backendSkills.length - 1) {
      this.currentBackendSkillIndex++;
    } else {
      this.currentBackendSkillIndex = 0;
    }
    this.triggerAnimationForVisibleBackendSlide();
  }

  prevBackendSkill(): void {
    if (this.currentBackendSkillIndex > 0) {
      this.currentBackendSkillIndex--;
    } else {
      this.currentBackendSkillIndex = this.backendSkills.length - 1;
    }
    this.triggerAnimationForVisibleBackendSlide();
  }

  goToBackendSkill(index: number): void {
    this.currentBackendSkillIndex = index;
    this.triggerAnimationForVisibleBackendSlide();
  }

  getBackendCarouselTransform(): string {
    return `translateX(-${this.currentBackendSkillIndex * 100}%)`;
  }

  private triggerAnimationForVisibleBackendSlide(): void {
    setTimeout(() => {
      const trackElement = this.el.nativeElement.querySelector('.backend-carousel-track');
      if (trackElement && this.backendSkills.length > 0 && trackElement.children[this.currentBackendSkillIndex]) {
        const visibleSlideCard = trackElement.children[this.currentBackendSkillIndex].querySelector('.skill-card');
        if (visibleSlideCard && !this.hasAnimated.has(visibleSlideCard as HTMLElement)) {
          const chartValuePath = visibleSlideCard.querySelector('.chart-value') as SVGPathElement | null;
          if (chartValuePath) {
            this.animateChart(chartValuePath);
            this.hasAnimated.add(visibleSlideCard as HTMLElement);
          }
        }
      }
    }, 50);
  }

  ngOnDestroy(): void {
    this.observers.forEach(observer => observer.disconnect());
  }
}