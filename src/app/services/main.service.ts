import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
	providedIn: 'root'
})
export class MainService {

	main_file: any

	private mainFileSource = new BehaviorSubject<any>(this.main_file);
	public currentFile = this.mainFileSource.asObservable();

	constructor() {
		console.log('Main Service Constructor')
		this.mainFileSource.next({
			contructor: true
		})
	}

	update(source: any) {
		this.mainFileSource.next(source);
	}
}
