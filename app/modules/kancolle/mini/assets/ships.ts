const shipsConfig = [
  {
    id: 1000,
    name: 'まるゆ',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 5,
  },
  {
    id: 1001,
    name: '武蔵',
    resource: [3500, 4500, 4000, 2000],
    seceretary: null,
    weight: 50,
  },
  {
    id: 1002,
    name: '大和',
    resource: [3500, 4500, 4000, 2000],
    seceretary: null,
    weight: 50,
  },
  {
    id: 1003,
    name: 'Bismarck',
    resource: [3500, 4500, 4000, 2000],
    seceretary: [1003, 2000, 2001, 2002],
    weight: 60,
  },
  {
    id: 1004,
    name: '大鳳',
    resource: [3000, 3000, 3000, 4000],
    seceretary: null,
    weight: 65,
  },
  {
    id: 1005,
    name: 'Saratoga',
    resource: [3000, 3000, 3000, 4000],
    seceretary: [1005, 1010, 1033],
    weight: 65,
  },
  {
    id: 1006,
    name: 'Zara',
    resource: [3000, 4000, 4000, 2000],
    seceretary: [2003, 1007],
    weight: 40,
  },
  {
    id: 1007,
    name: 'あきつ丸',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 20,
  },
  {
    id: 1008,
    name: 'Pola',
    resource: [3000, 4000, 4000, 2000],
    seceretary: [2003, 1006],
    weight: 40,
  },
  {
    id: 1009,
    name: '瑞穂',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 25,
  },
  {
    id: 1010,
    name: '神威',
    resource: [3000, 2000, 5000, 3500],
    seceretary: null,
    weight: 20,
  },
  {
    id: 1011,
    name: '阿賀野',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 30,
  },
  {
    id: 1012,
    name: '能代',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 25,
  },
  {
    id: 1013,
    name: '矢矧',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 20,
  },
  {
    id: 1014,
    name: '伊401',
    resource: [2000, 2000, 2000, 1000],
    seceretary: null,
    weight: 10,
  },
  {
    id: 1015,
    name: '伊400',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 8,
  },
  {
    id: 1016,
    name: '三隈',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 25,
  },
  {
    id: 1017,
    name: '鈴谷',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 40,
  },
  {
    id: 1018,
    name: '熊野',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 40,
  },
  {
    id: 1019,
    name: '長門',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 35,
  },
  {
    id: 1020,
    name: '陸奥',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 35,
  },
  {
    id: 1021,
    name: '金剛',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 40,
  },
  {
    id: 1022,
    name: '比叡',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 40,
  },
  {
    id: 1023,
    name: '榛名',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 40,
  },
  {
    id: 1024,
    name: '霧島',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 40,
  },
  {
    id: 1025,
    name: '日向',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 40,
  },
  {
    id: 1026,
    name: '伊勢',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 40,
  },
  {
    id: 1027,
    name: '飛龍',
    resource: [1500, 1500, 2000, 3000],
    seceretary: null,
    weight: 20,
  },
  {
    id: 1028,
    name: '蒼龍',
    resource: [1500, 1500, 2000, 3000],
    seceretary: null,
    weight: 35,
  },
  {
    id: 1029,
    name: '赤城',
    resource: [1500, 1500, 2000, 3000],
    seceretary: null,
    weight: 35,
  },
  {
    id: 1030,
    name: '加賀',
    resource: [1500, 1500, 2000, 3000],
    seceretary: null,
    weight: 35,
  },
  {
    id: 1031,
    name: '扶桑',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 35,
  },
  {
    id: 1032,
    name: '山城',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 35,
  },
  {
    id: 1033,
    name: 'Iowa',
    resource: [3500, 4500, 4000, 2000],
    seceretary: [1033, 1005, 1010],
    weight: 10,
  },
  {
    id: 1034,
    name: '明石',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 25,
  },
  {
    id: 2000,
    name: 'Z1',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 0,
  },
  {
    id: 2001,
    name: 'Z3',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 0,
  },
  {
    id: 2002,
    name: 'Prinz Eugen',
    resource: [1500, 1500, 2000, 2500],
    seceretary: null,
    weight: 0,
  },
  {
    id: 2003,
    name: 'Maestrale',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 0,
  },
  {
    id: 2004,
    name: 'Libeccio',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 0,
  },
];

export default shipsConfig;
