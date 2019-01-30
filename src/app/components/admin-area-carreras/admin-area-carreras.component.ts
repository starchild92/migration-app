import { Component, OnInit } from '@angular/core';
import { MainService } from '@services/main.service';

@Component({
	selector: 'app-admin-area-carreras',
	templateUrl: './admin-area-carreras.component.html',
	styleUrls: ['./admin-area-carreras.component.scss']
})
export class AdminAreaCarrerasComponent implements OnInit {

	areas: Array<any> = []

	constructor(
		private _mainService: MainService
	) { }

	ngOnInit() {
		this._mainService.currentAreas.subscribe(ars => {
			console.log(ars)
			this.areas = ars
		});
	}

}
