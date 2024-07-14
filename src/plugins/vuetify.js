// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Vuetify
import { createVuetify } from "vuetify";

const LightTheme = {
  dark: false,
  colors: {
    background: '#faf5fa',
    primary: '#f0d1f0',
    secondary: '#d39cb3',
    accent: '#c6808f',
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
    background: '#180c18',
    primary: '#4b2331',
    secondary: '#632c43',
    accent: '#7f3948',
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
