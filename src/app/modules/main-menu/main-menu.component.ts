import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
  styles: ['.router-link-active { background-color: #00bdcc; }']
})
export class MainMenuComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
