import { Component, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef, OnDestroy, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importar CommonModule

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule], // Añadir CommonModule a imports
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @Output() requestScrollToContact = new EventEmitter<string>();

  @ViewChild('typewriterTarget', { static: false }) typewriterTargetRef!: ElementRef<HTMLSpanElement>;
  // Para hacer referencia al span en el HTML, necesitamos añadir #typewriterTarget
  // <span class="typewriter-target" #typewriterTarget></span>

  private textToType = "Software Developer"; // El texto que quieres que se escriba
  private typingSpeed = 120; // Milisegundos por caracter
  private erasingSpeed = 70; // Milisegundos por caracter al borrar
  private delayBeforeErase = 2000; // Tiempo antes de empezar a borrar (ms)
  private delayBeforeTypingNew = 500; // Tiempo antes de escribir un nuevo texto (si tuvieras un array)

  private charIndex = 0;
  private isDeleting = false;
  private loopTimeout: any; // Para manejar el timeout del loop

  private ngZone = inject(NgZone); // Inyectar NgZone

  constructor() {}

  // En home.component.ts
  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.typewriterTargetRef && this.typewriterTargetRef.nativeElement) { // VERIFICACIÓN MÁS ROBUSTA
        console.log("Typewriter target found:", this.typewriterTargetRef.nativeElement); // Log
        this.startTypingLoop();
      } else {
        console.error("Typewriter target element NOT found or nativeElement is null, even after delay.");
      }
    }, 100); // Puedes probar un timeout un poco más largo, ej. 200 o 500, solo para depurar
    }

private startTypingLoop(): void {
  const typeWriter = () => {
    if (!this.typewriterTargetRef || !this.typewriterTargetRef.nativeElement) { // Guarda por si la referencia se pierde
      console.error("Target element lost during typing loop.");
      clearTimeout(this.loopTimeout); // Detener el bucle
      return;
    }

    const currentFullText = this.textToType;
    const targetSpan = this.typewriterTargetRef.nativeElement;
    let currentDisplayedText = targetSpan.textContent || "";

    // console.log(`isDeleting: ${this.isDeleting}, charIndex: ${this.charIndex}, currentDisplayed: "${currentDisplayedText}"`); // Log detallado

    if (this.isDeleting) {
      targetSpan.textContent = currentFullText.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      targetSpan.textContent = currentFullText.substring(0, this.charIndex + 1);
      this.charIndex++;
    }

    let speed = this.isDeleting ? this.erasingSpeed : this.typingSpeed;

    if (!this.isDeleting && this.charIndex === currentFullText.length) {
      speed = this.delayBeforeErase;
      this.isDeleting = true;
      // console.log("Finished typing, will erase."); // Log
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      speed = this.delayBeforeTypingNew;
      // console.log("Finished erasing, will type again."); // Log
    }

    this.loopTimeout = setTimeout(typeWriter, speed);
  };
  typeWriter(); // Iniciar
}

  scrollToContact(event: MouseEvent): void {
    event.preventDefault();
    this.requestScrollToContact.emit('contact-section');
  }

  ngOnDestroy(): void {
    // Limpiar el timeout cuando el componente se destruye para evitar fugas de memoria
    if (this.loopTimeout) {
      clearTimeout(this.loopTimeout);
    }
  }
}