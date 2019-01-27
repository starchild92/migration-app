import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';

@Component({
	selector: 'app-unit-display',
	templateUrl: './unit-display.component.html',
	styleUrls: ['./unit-display.component.scss']
})
export class UnitDisplayComponent implements OnChanges, OnInit {

	@Input() unit;

	constructor() { }

	ngOnChanges(changes: SimpleChanges) {
		const unit: SimpleChange = changes.unit;
		this.unit = unit.currentValue
	}

	ngOnInit() {
	}

}
