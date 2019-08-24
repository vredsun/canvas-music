type ColorData = {
  primaryColorRed: string;
  primaryColorYellow: string;
  primaryColorBlue: string;
  primaryColorGreen: string;
};

type ColorByType = Record<string | number, ColorData>;

const color_by_type: ColorByType = {
  1: {
    primaryColorRed: "#F9848F",
    primaryColorYellow: "#FFE687",
    primaryColorBlue: "#8176C7",
    primaryColorGreen: "#89E177",
  },
  2: {
    primaryColorRed: "#F25968",
    primaryColorYellow: "#FAD95C",
    primaryColorBlue: "#5B4EAD",
    primaryColorGreen: "#64D14D",
  },
  main: {
    primaryColorRed: "#DD3343",
    primaryColorYellow: "#E5C035",
    primaryColorBlue: "#43349E",
    primaryColorGreen: "#46BF2C",
  },
  4: {
    primaryColorRed: "#BB1424",
    primaryColorYellow: "#C29E15",
    primaryColorBlue: "#2C1E86",
    primaryColorGreen: "#2BA212",
  },
  5: {
    primaryColorRed: "#950311",
    primaryColorYellow: "#9A7B03",
    primaryColorBlue: "#1C106B",
    primaryColorGreen: "#1981",
  },
};

export default color_by_type;
