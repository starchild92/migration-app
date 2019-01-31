import { Component, OnInit, Input } from '@angular/core';
import { Resource } from '@classes/resource';

@Component({
	selector: 'app-file-type-display',
	templateUrl: './file-type-display.component.html',
	styleUrls: ['./file-type-display.component.scss']
})
export class FileTypeDisplayComponent implements OnInit {

	@Input() resource: Resource

	constructor() { }

	ngOnInit() {
	}

}
