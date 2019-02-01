// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
	production: false
};

export const CORONA = {
	apiKey: "AIzaSyD29ObJK8T73t3WFchFXDDZiWIVlg58294",
	authDomain: "corona-platform.firebaseapp.com",
	databaseURL: "https://corona-platform.firebaseio.com",
	projectId: "corona-platform",
	storageBucket: "corona-platform.appspot.com",
	messagingSenderId: "122254049499"
}

export const firebaseConfig = {
	apiKey: "AIzaSyAyZqegPQjvxm9fLyQ8w7nKI0D29VxtRSI",
	authDomain: "eleven-1-1.firebaseapp.com",
	databaseURL: "https://eleven-1-1.firebaseio.com",
	projectId: "eleven-1-1",
	storageBucket: "eleven-1-1.appspot.com",
	messagingSenderId: "589431464804"
};

// UID de Usuario en Corona
export const GRIKY_UID = '4L1kAJx1DuRa5kP9MS6DNwiBDK13';
export const BACKUP_SOURCE = 'assets/backup_folder';

export const HARD_CODED = {
	File: 'https://firebasestorage.googleapis.com/v0/b/corona-platform.appspot.com/o/default_images%2Fdocument_preview_image.jpg?alt=media&token=0cd6e046-6819-45c1-a0f2-09bf66a93164',
	Video: 'https://firebasestorage.googleapis.com/v0/b/corona-platform.appspot.com/o/default_images%2Fvideo_placeholder.jpg?alt=media&token=cd8b08c0-5ce4-466a-b9a8-c326ba9b1f06',
	Community: 'https://firebasestorage.googleapis.com/v0/b/corona-platform.appspot.com/o/default_images%2Fcommunity_placeholder.jpeg?alt=media&token=b7b3f357-44bd-4db8-a7e1-6deb7069b1c3'
}

export enum PATHS {
	Community = '/comunidades',
	Units = '/unit',
	Topics = '/topic',
	Resources = '/resources'
}

/**
 * /topic/[folder:key]/file[img]
 * /resources/[folder:key]/file[img]
 */
export enum STORE {
	Topics = '/topic',
	Resources = '/resources'
}

export const AREAS_CONOCIMIENTO = [
	{ name: 'Programas Transversales', value: 'a1' },
	{ name: 'Programas Centro Corona 2018', value: 'a2' },
	{ name: 'Gestión Efectiva GO TO MARKET', value: 'a3' },
	{ name: 'Gestión de adquisiciones e integración de negocios a nivel internacional', value: 'a4' }
];

export const CARRERAS = [
	{ name: 'Escuela de Liderazgo de la Fase 1', value: 'cr1', area: 'a1' },
	{ name: 'Escuela de Liderazgo de la Fase 2', value: 'cr2', area: 'a1' },
	{ name: 'Escuela Fase 1 2018', value: 'cr3', area: 'a1' },
	{ name: 'Programas Complementarios 2018', value: 'cr4', area: 'a2' },
	{ name: 'Comercial Corona', value: 'cr5', area: 'a3' },
	{ name: 'Gestión de adquisiciones e integración de negocios a nivel internacional', value: 'cr6', area: 'a4' },
]
