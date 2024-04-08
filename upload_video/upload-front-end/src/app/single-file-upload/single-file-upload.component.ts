import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReplaySubject, mergeMap, takeUntil, tap } from 'rxjs';
import { AuthService } from '../auth.service';

const UPLOAD_URL = 'http://34.173.158.20:8070/upload';
const DATABASE_URL = `http://35.188.122.233:8000/upload`;

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

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {}

  // On file Select
  onChange(event: any) {
    const file: File = event.target.files[0];
    const acceptedVideoTypes = [
        "video/mp4",
        "video/quicktime",
        "video/webm",
        "video/x-msvideo",
      ];
    if (file) {
      if (!acceptedVideoTypes.includes(file.type)) {
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
      alert('Please set a name to the file');
      return;
    }
    const fileName = this.fileName;

    const blob = new Blob([this.file]);

    const fileType = this.file.name.split('.')[1];

    const keyName = Date.now().toString() + '.' + fileType;
    const header = new HttpHeaders({
      'Content-Type': 'application/octet-stream',
      'File-Name': keyName,
    });

    // Uploading the file to File System Service
    this.status = 'uploading'

    const username = this.authService.user ? this.authService :  'test';
    this.http
      .post(UPLOAD_URL, blob, { headers: header, responseType: 'blob' })
      .pipe(
        mergeMap((_uploadResponse: any) => {
          return this.http.post(
            DATABASE_URL,
            { name: `${fileName}`, s3_key: `${keyName}`, user: username },
            { headers: { 'Content-Type': 'application/json' } }
          );
        }),
        tap(() => (this.status = 'uploading')),
        takeUntil(this.destroyed)
      )
      .subscribe({
        next: (databaseResponse: any) => {
          console.log(databaseResponse); // Log the response of the second request
          this.status = 'success';
          this.file = null;
          alert("Succesfully uploaded video")
        },
        error: (e) => {
          console.error(e); // Log any errors
          this.status = 'fail';
        },
      });

  }
  resetFileInput() {
    console.log(this.file);
    if (this.file) {
      this.file = null;
    }
  }

  ngOnDestroy(): void {
    this.destroyed.unsubscribe();
  }
}
