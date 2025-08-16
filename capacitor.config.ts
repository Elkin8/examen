import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'asistencia-puce',
  webDir: 'dist',

  server: {
    androidScheme: 'https',
    allowNavigation: [
      'puce.estudioika.com',
      'https://puce.estudioika.com'
    ],
    cleartext: false,
  },

  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};
 
export default config;