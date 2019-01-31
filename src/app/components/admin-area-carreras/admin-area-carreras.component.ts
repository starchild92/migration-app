import { Component, OnInit } from '@angular/core';
import { MainService } from '@services/main.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { find } from 'lodash';

@Component({
	selector: 'app-admin-area-carreras',
	templateUrl: './admin-area-carreras.component.html',
	styleUrls: ['./admin-area-carreras.component.scss']
})
export class AdminAreaCarrerasComponent implements OnInit {

	areas: Array<any> = []
	carreras: Array<any> = []

	areaForm: FormGroup;
	carreraForm: FormGroup;

	selectedArea: any;

	constructor(
		private _mainService: MainService,
		private _fb: FormBuilder,
		private _db: AngularFireDatabase
	) { }

	ngOnInit() {
		this._mainService.getAreas().then(ars => {
			this.areas = ars;
			if (this.areas.length > 0) { this.carreras = this.areas[0]['carreras']; }
		});

		this.areaForm = this._fb.group({
			'colorCard': ["", [Validators.required]],
			'name': ["", Validators.required],
			'url': ["", [Validators.required]],
		});

		this.carreraForm = this._fb.group({
			'name': ["", Validators.required],
		});
	}

	displayCarreras(a) {
		this.selectedArea = a
		this.carreras = (a['carreras']) ? a['carreras'] : []
	}

	addArea() {
		if (this.areaForm.valid) {
			const vals = this.areaForm.value
			this._db.database.ref('/areas').once('value', snap => {
				this.areas.length = 0
				Object.keys(snap.val()).forEach(key => { this.areas.push(snap.val()[key]) });
				const obj = {
					id: `a${this.areas.length + 1}`,
					colorCard: vals['colorCard'],
					name: vals['name'],
					url: vals['url']
				};

				this._db.database.ref(`/areas/${obj.id}`).update(obj).then(() => {
					this.areas.push(obj)

					window.location.reload()
				});

			}, (error) => {
				window.alert('Parece que no existen areas en el proyecto!')
			});
		}
	}

	addCarrera() {
		if (this.carreraForm.valid) {
			const vals = this.carreraForm.value
			this._db.database.ref('/carreras').once('value', snap => {
				this.carreras.length = 0
				Object.keys(snap.val()).forEach(key => { this.carreras.push(snap.val()[key]) });
				const obj = {
					id: `cr${this.carreras.length + 1}`,
					name: vals['name'],
					area: this.selectedArea['id']
				};

				this._db.database.ref(`/carreras/${obj.id}`).update(obj).then(() => {
					let area = find(this.areas, (a) => { return a['id'] == this.selectedArea['id'] });
					if (area['carreras']) {
						area['carreras'].push(obj)
					} else {
						area['carreras'] = []
						area['carreras'].push(obj)
					}

					window.location.reload()
				});

			}, (error) => {
				window.alert('Parece que no existen areas en el proyecto!')
			});
		}
	}

}
