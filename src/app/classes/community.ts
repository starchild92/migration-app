import * as moment from 'moment';

export class Community {
	private area: string;
	private carrera: string;
	private created: string;
	private key: string;
	private name: string;
	private publicado: boolean;
	private resume: string;
	private type: number;
	private uid: string;

	private positionCommunity: boolean;
	private urlPhoto: string;
	private urlVideo: string;

	/* Additional obtain from xml files */
	public shortname: string;
	/**********/

	public set $area(v: string) { this.area = v; }
	public set $carrera(v: string) { this.carrera = v; }
	public set $created(v: string) { this.created = v; }
	public set $key(v: string) { this.key = v; }
	public set $name(v: string) { this.name = v; }
	public set $publicado(v: boolean) { this.publicado = v; }
	public set $resume(v: string) { this.resume = v; }
	public set $type(v: number) { this.type = v; }
	public set $uid(v: string) { this.uid = v; }

	public set $positionCommunity(v: boolean) { this.positionCommunity = v; }
	public set $urlPhoto(v: string) { this.urlPhoto = v; }
	public set $urlVideo(v: string) { this.urlVideo = v; }

	// additional
	public set $shortname(v: string) { this.shortname = v; }

	public get _area(): string { return this.area; }
	public get _carrera(): string { return this.carrera; }
	public get _created(): string { return this.created; }
	public get _key(): string { return this.key; }
	public get _name(): string { return this.name; }
	public get _publicado(): boolean { return this.publicado; }
	public get _resume(): string { return this.resume; }
	public get _type(): number { return this.type; }
	public get _uid(): string { return this.uid; }

	public get _positionCommunity(): boolean { return  this.positionCommunity; }
	public get _urlPhoto(): string { return  this.urlPhoto; }
	public get _urlVideo(): string { return  this.urlVideo; }

	// additional
	public get _shortname(): string { return this.shortname; }

	constructor(object?: CommunityInterface) {
		this.created = moment().format('d/MM/Y h:m:s A');
		this.publicado = false;
		this.positionCommunity = false;

		if (object) {
			this.createWithInfo(object);
		}
	}

	createWithInfo(info: CommunityInterface) {
		this.area = this.loadData(info.area);
		this.carrera = this.loadData(info.carrera);
		this.created = this.loadData(info.created);
		this.key = this.loadData(info.key);
		this.name = this.loadData(info.name);
		this.publicado = this.loadData(info.publicado);
		this.resume = this.loadData(info.resume);
		this.type = this.loadData(info.type);
		this.uid = this.loadData(info.uid);

		this.positionCommunity = this.loadData(info.positionCommunity);
		this.urlPhoto = this.loadData(info.urlPhoto);
		this.urlVideo = this.loadData(info.urlVideo);

		// additional
		this.shortname = this.loadData(info.shortname);
	}

	private loadData<T>(data: T, defaul?: T) {
		return data === undefined ?
			defaul !== undefined ? defaul : null
			: data;
	}

	/**
	 * Tiene los datos que se necesita en la estructura de Griky
	 */
	public serialize(): any {
		let obj = {
			area: this.area,
			carrera: this.carrera,
			created: this.created,
			key: this.key,
			name: this.name,
			publicado: this.publicado,
			resume: this.resume,
			type: this.type,
			uid: this.uid,

			positionCommunity: this.positionCommunity,
			urlPhoto: this.urlPhoto,
			urlVideo: this.urlVideo,

			// additional
			shortname: this.shortname
		}
		Object.keys(obj).forEach(key => obj[key] === undefined ? delete obj[key] : '');
		return obj;
	}
}

export interface CommunityInterface {
	area: string,
	carrera: string,
	created: string,
	key: string,
	name: string,
	publicado: boolean,
	resume: string,
	type: number,
	uid: string,

	positionCommunity: boolean,
	urlPhoto: string,
	urlVideo: string,

	// additional
	shortname: string
}
