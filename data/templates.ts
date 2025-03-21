export type TemplateType = {
  id: string;
  color: string;
  imageCorner?: string;
  image?: string;
  occasions: string[];
  translations: {
    kk: {
      name: string;
      description: string;
    };
    ru: {
      name: string;
      description: string;
    };
    en: {
      name: string;
      description: string;
    };
  };
};

export const templates: TemplateType[] = [
  {
    id: "1",
    color: "from-blue-400 to-purple-600",
    occasions: ["birthday", "anniversary", "graduation"],
    translations: {
      kk: {
        name: "Қарапайым",
        description: "Қарапайым ашықхат",
      },
      ru: {
        name: "Простой",
        description: "Простая открытка",
      },
      en: {
        name: "Simple",
        description: "A simple card",
      },
    },
  },
  {
    id: "2",
    color: "from-pink-400 to-purple-600",
    occasions: ["birthday", "anniversary"],
    translations: {
      kk: {
        name: "Сәнді",
        description: "Сәнді ашықхат",
      },
      ru: {
        name: "Элегантный",
        description: "Элегантная открытка",
      },
      en: {
        name: "Elegant",
        description: "An elegant card",
      },
    },
  },
  {
    id: "3",
    color: "from-pink-400 to-purple-600",
    occasions: ["birthday", "anniversary", "graduation"],
    translations: {
      kk: {
        name: "Заманауи",
        description: "Заманауи ашықхат",
      },
      ru: {
        name: "Современный",
        description: "Современная открытка",
      },
      en: {
        name: "Modern",
        description: "A modern card",
      },
    },
  },
  {
    id: "4",
    color: "from-green-400 to-blue-600",
    occasions: ["nauryz"],
    imageCorner: "/template/ouyCornerWhite.png",
    translations: {
      kk: {
        name: "Наурыз",
        description: "Ою өрнек",
      },
      ru: {
        name: "Наурыз",
        description: "Наурыз открытка с орнаментом",
      },
      en: {
        name: "Nauryz",
        description: "A Nauryz card with ornaments",
      },
    },
  },
  {
    id: "5",
    color: "from-yellow-300 to-green-400",
    occasions: ["spring", "celebration"],
    imageCorner: "/template/flowerCorner.png",
    translations: {
      kk: {
        name: "Көктем",
        description: "Көктемгі ашықхат",
      },
      ru: {
        name: "Весна",
        description: "Весенняя открытка",
      },
      en: {
        name: "Spring",
        description: "A spring-themed card",
      },
    },
  },
  {
    id: "6",
    color: "from-red-400 to-orange-500",
    occasions: ["wedding", "engagement"],
    imageCorner: "/template/heartCorner.png",
    translations: {
      kk: {
        name: "Махаббат",
        description: "Махаббатқа арналған ашықхат",
      },
      ru: {
        name: "Любовь",
        description: "Открытка для любви",
      },
      en: {
        name: "Love",
        description: "A card for love and romance",
      },
    },
  },
  {
    id: "7",
    color: "from-blue-300 to-cyan-500",
    occasions: ["baby-shower", "newborn"],
    imageCorner: "/template/babyCorner.png",
    translations: {
      kk: {
        name: "Сәбидің қуанышы",
        description: "Сәбидің дүниеге келуіне арналған ашықхат",
      },
      ru: {
        name: "Рождение ребенка",
        description: "Открытка для рождения ребенка",
      },
      en: {
        name: "Baby Joy",
        description: "A card for celebrating a newborn",
      },
    },
  },
  {
    id: "8",
    color: "from-purple-500 to-indigo-600",
    occasions: ["graduation", "achievement"],
    imageCorner: "/template/graduationCorner.png",
    translations: {
      kk: {
        name: "Білім",
        description: "Білім мен жетістіктерге арналған ашықхат",
      },
      ru: {
        name: "Образование",
        description: "Открытка для образования и достижений",
      },
      en: {
        name: "Education",
        description: "A card for education and achievements",
      },
    },
  },
  {
    id: "9",
    color: "from-orange-300 to-yellow-500",
    occasions: ["thanksgiving", "gratitude"],
    imageCorner: "/template/thanksgivingCorner.png",
    translations: {
      kk: {
        name: "Рақмет",
        description: "Рақмет айтуға арналған ашықхат",
      },
      ru: {
        name: "Благодарность",
        description: "Открытка для благодарности",
      },
      en: {
        name: "Thank You",
        description: "A card for expressing gratitude",
      },
    },
  },
  {
    id: "10",
    color: "from-gray-400 to-gray-600",
    occasions: ["condolence", "sympathy"],
    imageCorner: "/template/sympathyCorner.png",
    translations: {
      kk: {
        name: "Қайғы",
        description: "Қайғы мен көңіл айтуға арналған ашықхат",
      },
      ru: {
        name: "Соболезнование",
        description: "Открытка для соболезнования",
      },
      en: {
        name: "Sympathy",
        description: "A card for condolences and sympathy",
      },
    },
  },
];

const templatesById = new Map(templates.map((t) => [t.id, t]));
export const getTemplateById = (id: string) => templatesById.get(id);
