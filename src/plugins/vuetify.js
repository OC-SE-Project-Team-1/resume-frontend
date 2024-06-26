// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Vuetify
import { createVuetify } from "vuetify";

const LightTheme = {
  dark: false,
  colors: {
    background: '#f2f5f8',
    primary: '#5E8BB4',
    secondary: '#92bce3',
    accent: '#bea3df',
    success: '#47121D',
    error: '#EE5044',
    teal: '#63BAC0',
    blue: '#196CA2',
    yellow: '#F8C545',
    darkblue: '#032F45',
  },
};

const DarkTheme = {
  dark: true,
  colors: {
    background: '#0b0f13',
    primary: '#295a87',
    secondary: '#1c466d',
    accent: '#4b247a',
    success: '#47121D',
    error: '#EE5044',
    teal: '#63BAC0',
    blue: '#196CA2',
    yellow: '#F8C545',
    darkblue: '#032F45',
  },
};


export default createVuetify({
  theme: {
    defaultTheme: "LightTheme",
    themes: {
      LightTheme,
      DarkTheme
    },
  },
});
