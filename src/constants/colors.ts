export const colors = {
  // Primary colors
  primary: {
    DEFAULT: '#B17457',
    hover: '#B17457/90',
  },
  
  // Background colors
  background: {
    light: '#FAF7F0',
    dark: '#4A4947',
    secondary: {
      light: '#D8D2C2',
      dark: '#3A3937'
    }
  },
  
  // Text colors
  text: {
    light: '#4A4947',
    dark: '#FAF7F0',
    muted: {
      light: '#4A4947/80',
      dark: '#FAF7F0/80'
    }
  },
  
  // Border colors
  border: {
    light: '#D8D2C2',
    dark: '#B17457'
  },
  
  // Overlay colors
  overlay: {
    DEFAULT: 'black/50',
    dark: 'black/80'
  },
  
  // Status colors
  white: {
    DEFAULT: 'white',
    muted: 'white/90',
    hover: 'white/20'
  }
} as const; 