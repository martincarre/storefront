import { DecimalPipe, NgClass } from '@angular/common';
import { afterNextRender, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-file-input',
  standalone: true,
  imports: [MatIconModule, MatCardModule, MatDividerModule, MatButtonModule, NgClass, DecimalPipe],
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss'],
})
export class FileInputComponent implements OnInit {
  private sanitizer: DomSanitizer = inject<DomSanitizer>(DomSanitizer);
  fileTypes = input.required<string[]>();
  fileDropped = output<File | null>();
  initialFileUrl = input<string | null | undefined>(null);

  allowedFileTypes: string = '';

  isDragging = false;
  selectedFile: File | null = null;
  previewUrl = signal<SafeUrl | null>(null);
  fileType = signal<string | null>(null);

  constructor() {
    afterNextRender(() => {
      console.log('initialFileUrl:', this.initialFileUrl());
      if (this.initialFileUrl()) {
        this.selectedFile = null;
        this.previewUrl.set(this.sanitizeUrl(this.initialFileUrl()));
        this.fileType.set(this.determineFileTypeFromUrl(this.initialFileUrl()));
      }
    });
  }

  ngOnInit(): void {
    this.allowedFileTypes = this.fileTypes().join(', ');
    
  }
  
  // Sanitize the URL using Angular's DomSanitizer
  private sanitizeUrl(url: string | undefined | null): SafeUrl | null {
    return url ? this.sanitizer.bypassSecurityTrustUrl(url) : null;
  }

  // Determine file type based on the file extension in the URL
  private determineFileTypeFromUrl(fileUrl: string | null | undefined): string {
    if (!fileUrl) return 'other';
    console.log('fileUrl:', fileUrl);
    if (fileUrl.endsWith('.jpg') || fileUrl.endsWith('.jpeg') || fileUrl.endsWith('.png')) {
      return 'image';
    } else if (fileUrl.endsWith('.pdf')) {
      return 'pdf';
    } else if (fileUrl.endsWith('.mp4')) {
      return 'video';
    }
    return 'other';
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
      this.generatePreview(droppedFile);
      this.fileDropped.emit(this.selectedFile);
    }
  }

  // Handle file selection via input
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      this.generatePreview(this.selectedFile);
      this.fileDropped.emit(this.selectedFile);
    }
  }

  // Clear the selected file
  onClearFile(): void {
    this.selectedFile = null;
    this.previewUrl.set(null);
    this.fileType.set(null);
    this.fileDropped.emit(null);
  }

  // Generate a preview URL based on file type
  private generatePreview(file: File): void {
    const reader = new FileReader();

    // Handle images and PDFs
    if (file.type.startsWith('image')) {
      console.log('image detected!');
      reader.onload = (e) => {
        this.fileType.set('image');
        this.previewUrl.set(this.sanitizer.bypassSecurityTrustUrl(e.target?.result as string));
      };
      reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
      reader.onload = (e) => {
        this.fileType.set('pdf');
        this.previewUrl.set(this.sanitizer.bypassSecurityTrustUrl(e.target?.result as string));
      };
      reader.readAsDataURL(file);
    } else {
      this.fileType.set('other');
      this.previewUrl.set(null);
    }
  }
}