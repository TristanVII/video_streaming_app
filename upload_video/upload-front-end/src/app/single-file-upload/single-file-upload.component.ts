import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReplaySubject, takeUntil, tap } from 'rxjs';

const UPLOAD_URL = 'http://127.0.0.1:8070/upload';
const DATABASE_URL = 'http://127.0.0.1:8000/save'

@Component({
  selector: 'app-single-file-upload',
  templateUrl: './single-file-upload.component.html',
  styleUrls: ['./single-file-upload.component.scss'],
})
export class SingleFileUploadComponent implements OnDestroy {
  status: 'initial' | 'uploading' | 'success' | 'fail' = 'initial'; // Variable to store file status
  file: File | null = null; // Variable to store file
  destroyed = new ReplaySubject(1);
  fileName: string = '';
  @ViewChild('fileUpload') fileUpload!: ElementRef;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  // On file Select
  onChange(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      if (file.type !== 'video/mp4') {
        alert('Can only upload mp4');
        this.file = null;
        this.status = 'initial';
        return;
      }
      this.status = 'initial';
      this.file = file;
    }
  }

  onUpload() {
    if (!this.file) {
      return;
    }
    if (!this.fileName) {
      alert('Please set a name to the file')
      return;
    }
    const fileName = this.fileName

    const blob = new Blob([this.file])

    const fileType = this.file.name.split('.')[1]

    const keyName = Date.now().toString() + '.' + fileType
    const header = new HttpHeaders({
      'Content-Type': 'application/octet-stream',
      'File-Name': keyName
    })

    // Uploading the file to File System Service

    this.http
      .post(UPLOAD_URL, blob, { headers : header, responseType: 'blob' })
      .pipe(
        tap(() => (this.status = 'uploading')),
        takeUntil(this.destroyed)
      )
      .subscribe({
        next: async (request) => {
          console.log(request)
        },
        error: (e) => {
          this.status = 'fail';
        },
        complete: () => {
          this.status = 'success'
        }
      });

    // Use the filePath to set file to Database

  }
  resetFileInput() {
    console.log(this.file)
    if (this.file) {
      this.file = null;
    }
  }

  ngOnDestroy(): void {
    this.destroyed.unsubscribe();
  }
}
