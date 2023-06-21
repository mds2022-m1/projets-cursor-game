import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'game.cursor.app',
  appName: 'CursorGame',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
