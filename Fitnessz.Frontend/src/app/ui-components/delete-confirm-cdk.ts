import { Component, inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  standalone: true,
  template: `
    <div class="custom-dialog-container">
      <h2>Törlés megerősítése</h2>
      <p>Biztosan véglegesen törölni akarod?</p>

      <div class="actions">
        <button (click)="ref.close(false)">Mégse</button>
        <button class="danger" (click)="ref.close(true)">Törlés</button>
      </div>
    </div>
  `,
  styles: [`
    .custom-dialog-container {
      background: #1a1a1a;
      border: 1px solid #333;
      padding: 2rem;
      border-radius: 12px;
      color: white;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    }
    .actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem; }
    button { padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; border: none; }
    .danger { background: #ff4444; color: white; }
  `]
})
export class DeleteConfirmCdk {
  ref = inject(DialogRef<boolean>);
}
