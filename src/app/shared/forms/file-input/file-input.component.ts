import { DecimalPipe, NgClass } from '@angular/common';
import { Component, input, OnInit, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-file-input',
  standalone: true,
  imports: [MatIconModule, MatCardModule, MatDividerModule, MatButtonModule, NgClass, DecimalPipe],
  templateUrl: './file-input.component.html',
  styleUrl: './file-input.component.scss'
})
export class FileInputComponent implements OnInit {
  fileTypes = input.required<string[]>();
  fileDropped = output<File>();
  isDragging = false;
  selectedFile: File | null = null;
  allowedFileTypes: string | null = null; 

  ngOnInit(): void {
    this.allowedFileTypes = this.fileTypes().join(', ');
  }

  // Handle drag over event
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  // Handle drag leave event
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  // Handle file drop
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    const droppedFile = event.dataTransfer?.files[0];
    if (!droppedFile) { 
      alert('No file was dropped');
      return;
    }
    if (!this.fileTypes().includes(droppedFile.type)) {
      alert(`File type not supported. Supported file types: ${this.allowedFileTypes}`);
      return;
    }
    if (event.dataTransfer?.files.length) {
      this.selectedFile = droppedFile;
      this.fileDropped.emit(this.selectedFile);
    }
  }

  // Handle file selection via input
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      this.fileDropped.emit(this.selectedFile);
    }
  }

  // Clear the selected file
  clearFile(): void {
    this.selectedFile = null;
  }
}
