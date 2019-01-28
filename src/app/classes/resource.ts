export class Resource {
	private index: number;
	private key: string;
	private keyCommunity: string;
	private keyTopic: string;
	private keyUnit: string;
	private keyUser: string;
	private name: string;
	private previewImage: string;
	private typeFile: string;
	private urlFile: string;

	private localPath: string;

	public set $index(v: number) { this.index = v; }
	public set $key(v: string) { this.key = v; }
	public set $keyCommunity(v: string) { this.keyCommunity = v; }
	public set $keyTopic(v: string) { this.keyTopic = v; }
	public set $keyUnit(v: string) { this.keyUnit = v; }
	public set $keyUser(v: string) { this.keyUser = v; }
	public set $name(v: string) { this.name = v; }
	public set $previewImage(v: string) { this.previewImage = v; }
	public set $typeFile(v: string) { this.typeFile = v; }
	public set $urlFile(v: string) { this.urlFile = v; }

	public set $localPath(v: string) { this.localPath = v; }

	public get _index() { return this.index; }
	public get _key() { return this.key; }
	public get _keyCommunity() { return this.keyCommunity; }
	public get _keyTopic() { return this.keyTopic; }
	public get _keyUnit() { return this.keyUnit; }
	public get _keyUser() { return this.keyUser; }
	public get _name() { return this.name; }
	public get _previewImage() { return this.previewImage; }
	public get _typeFile() { return this.typeFile; }
	public get _urlFile() { return this.urlFile; }

	public get _localPath() { return this.localPath; }

	constructor(object?: any) {
		if (object) {
			this.createWithInfo(object);
		}
	}

	private loadData<T>(data: T, defaul?: T) {
		return data === undefined ? defaul !== undefined ? defaul : null : data;
	}

	createWithInfo(info: ResourceInterface) {
		this.index = this.loadData(info.index);
		this.key = this.loadData(info.key);
		this.keyCommunity = this.loadData(info.keyCommunity);
		this.keyTopic = this.loadData(info.keyTopic);
		this.keyUnit = this.loadData(info.keyUnit);
		this.keyUser = this.loadData(info.keyUser);
		this.name = this.loadData(info.name);
		this.previewImage = this.loadData(info.previewImage);
		this.typeFile = this.loadData(info.typeFile);
		this.urlFile = this.loadData(info.urlFile);

		this.localPath = this.loadData(info.localPath);
	}
}

export class ResourceInterface {
	index: number;
	key: string;
	keyCommunity: string;
	keyTopic: string;
	keyUnit: string;
	keyUser: string;
	name: string;
	previewImage: string;
	typeFile: string;
	urlFile: string;

	localPath: string;
}
