import { Component, Input } from '@angular/core';

/**
 * Page provisoire affichant une section en cours de construction.
 * Le titre est fourni par les donnees de la route.
 */
@Component({
  selector: 'app-section-placeholder',
  templateUrl: './section-placeholder.html',
  styleUrl: './section-placeholder.scss',
})
export class SectionPlaceholder {
  @Input({ required: true }) title = '';

  @Input() description = 'Cette section est en cours de construction.';
}
