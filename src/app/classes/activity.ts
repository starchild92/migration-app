export class Activity {
	private sectionid: string;
	private path: string;
	private id: string;
	private type: string;
	private title: string;

	public set $sectionid(v: string) { this.sectionid = v; }
	public set $path(v: string) { this.path = v; }
	public set $id(v: string) { this.id = v; }
	public set $type(v: string) { this.type = v; }
	public set $title(v: string) { this.title = v; }

	public get _sectionid(): string { return this.sectionid; }
	public get _path(): string { return this.path; }
	public get _id(): string { return this.id; }
	public get _type(): string { return this.type; }
	public get _title(): string { return this.title; }

	constructor(object?: ActivityInterface) {
		if(object) {
			this.createWithInfo(object);
		}
	}

	private loadData<T>(data: T, defaul?: T) {
		return data === undefined ?
			defaul !== undefined ? defaul : null
			: data;
	}

	createWithInfo(info: ActivityInterface) {
		this.sectionid = this.loadData(info.sectionid);
		this.path = this.loadData(info.path);
		this.id = this.loadData(info.id);
		this.type = this.loadData(info.type);
		this.title = this.loadData(info.title);
	}

}

export class ActivityInterface {
	sectionid: string;
	path: string;
	id: string;
	type: string;
	title: string;
}
