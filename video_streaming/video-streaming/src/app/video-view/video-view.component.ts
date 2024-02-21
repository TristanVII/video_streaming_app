import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, firstValueFrom } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VideoOverlayComponent } from '../video-overlay/video-overlay.component';

interface Video {
  name: string;
  s3_key: string;
  user: string;
  url: string;
}

const DATABASE_URL = `http://localhost:8000/videos`;
const S3_URL = 'http://127.0.0.1:8070/url';

@Component({
  selector: 'app-video-view',
  templateUrl: './video-view.component.html',
  styleUrls: ['./video-view.component.scss'],
})
export class VideoViewComponent implements OnInit {
  destroyed = new ReplaySubject(1);
  videos: Video[] = [];
  loading = true;

  constructor(private http: HttpClient, private modalService: NgbModal) {}

  async ngOnInit(): Promise<void> {
    this.videos = await firstValueFrom(this.http.get<Video[]>(DATABASE_URL));

    await Promise.all([this.videos.forEach(async (video) => {
      video.url = await firstValueFrom(
        this.http.post(
          S3_URL,
          { s3_key: `${video.s3_key}` },
          {
            headers: { 'Content-Type': 'application/json' },
            responseType: 'text',
          }
        )
      );
    })]);

    this.loading = false;
  }

  async watchVideo(url: string): Promise<void> {
    if (!url) {
      alert('There was an error getting the video');
      return;
    }
    console.log(url);
    const modalRef = this.modalService.open(VideoOverlayComponent);

    modalRef.componentInstance.videoUrl = url;
  }
}
