import {Component, OnInit} from '@angular/core';
import {ElectronService} from '../../providers/electron.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  version: string;

  constructor(private electron: ElectronService) {
    this.version = electron.remote.app.getVersion();
  }

  ngOnInit() {
  }

}
