import { Component, Input, OnInit } from '@angular/core';
import { ImageService } from '../../../services/common/image.service';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnInit {

  @Input()
  file: File = null;

  @Input()
  url: string = null;

  renderUrl: any = null;

  constructor(private _imageService: ImageService) { }

  ngOnInit(): void {

    if (this.url) {
      this.renderUrl = this.url;
    } else {
      this._imageService.imageToBase64(this.file).subscribe(data => {
        this.renderUrl = data;
      });
    }
  }

}
