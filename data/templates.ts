export type TemplateTranslationsType = {
	kk: {
		name: string;
		description: string;
		middleText?: string;
		occasions: string[];
	};
	ru: {
		name: string;
		description: string;
		middleText?: string;
		occasions: string[];
	};
	en: {
		name: string;
		description: string;
		middleText?: string;
		occasions: string[];
	};
};
export type TemplateType = {
	id: string;
	color: string;
	imageCorner?: string;
	cornerRitarion?: boolean;
	image?: string;
	occasions: string[];
	tags?: ("timer" | "middleText" | "cornerIMage")[];
	translations: TemplateTranslationsType;
};
export const styles = [
	"nauryz",
	"zord",
	"aurora",
	"mayday",
	"spring",
	"simple",
	"almaty",
	"oceanic",
	"sunset",
	"forest",
	"nebula",
	"minty",
	"royal",
	"fiery",
	"frost",
	"earthy",
];
// export const templates: TemplateType[] = [
//   {
//     id: "1",
//     color: "from-blue-400 to-purple-600",
//     occasions: ["birthday", "anniversary", "graduation"],
//     translations: {
//       kk: {
//         name: "Қарапайым",
//         description: "Қарапайым ашықхат",
//         middleText: "Құттықтаймыз!",
//       },
//       ru: {
//         name: "Простой",
//         description: "Простая открытка",
//         middleText: "Поздравляем!",
//       },
//       en: {
//         name: "Simple",
//         description: "A simple card",
//         middleText: "Congratulations!",
//       },
//     },
//     tags: ["middleText", "timer"],
//   },
//   {
//     id: "2",
//     color: "from-pink-400 to-purple-600",
//     occasions: ["birthday", "anniversary"],
//     translations: {
//       kk: {
//         name: "Сәнді",
//         description: "Сәнді ашықхат",
//       },
//       ru: {
//         name: "Элегантный",
//         description: "Элегантная открытка",
//       },
//       en: {
//         name: "Elegant",
//         description: "An elegant card",
//       },
//     },
//   },
//   {
//     id: "3",
//     color: "from-pink-400 to-purple-600",
//     occasions: ["birthday", "anniversary", "graduation"],
//     translations: {
//       kk: {
//         name: "Заманауи",
//         description: "Заманауи ашықхат",
//       },
//       ru: {
//         name: "Современный",
//         description: "Современная открытка",
//       },
//       en: {
//         name: "Modern",
//         description: "A modern card",
//       },
//     },
//     tags: ["timer"],
//   },
//   {
//     id: "4",
//     color: "from-green-400 to-blue-600",
//     occasions: ["nauryz"],
//     imageCorner: "/template/ouyCornerWhite.png",
//     translations: {
//       kk: {
//         name: "Наурыз",
//         description: "Ою өрнек",
//       },
//       ru: {
//         name: "Наурыз",
//         description: "Наурыз открытка с орнаментом",
//       },
//       en: {
//         name: "Nauryz",
//         description: "A Nauryz card with ornaments",
//       },
//     },
//   },
//   {
//     id: "5",
//     color: "from-yellow-300 to-green-400",
//     occasions: ["spring", "celebration"],
//     imageCorner: "/template/flowerCorner.png",
//     translations: {
//       kk: {
//         name: "Көктем",
//         description: "Көктемгі ашықхат",
//         middleText: "Көктем келді!",
//       },
//       ru: {
//         name: "Весна",
//         description: "Весенняя открытка",
//         middleText: "Весна пришла!",
//       },
//       en: {
//         name: "Spring",
//         description: "A spring-themed card",
//         middleText: "Spring is here!",
//       },
//     },
//     tags: ["middleText"],
//   },
//   {
//     id: "6",
//     color: "from-black to-red-600",
//     occasions: ["Pank", "🤘"],
//     imageCorner:'/template/zord.png',
//     cornerRitarion:false,

//     translations: {
//       kk: {
//         name: "Zord",
//         description: "",
//         middleText:'Щлещ',
//       },
//       ru: {
//         name: "Zord",
//         description: "",
//         middleText:'Шлеш',
//       },
//       en: {
//         name: "Zord",
//         description: "",
//         middleText:'Slash',
//       },
//     },
//     tags: ["timer",'middleText'],
//   },
// ];

// const templatesById = new Map(templates.map((t) => [t.id, t]));
// export const getTemplateById = (id: string) => templatesById.get(id);
