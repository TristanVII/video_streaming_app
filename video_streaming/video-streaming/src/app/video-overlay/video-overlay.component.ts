import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-video-overlay',
  templateUrl: './video-overlay.component.html',
  styleUrls: ['./video-overlay.component.scss']
})
export class VideoOverlayComponent implements OnInit {
  @Input() videoUrl!: string;

    constructor(
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
   console.log(this.videoUrl) 
  }

}
