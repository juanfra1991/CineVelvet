import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cinevelvet',
  appName: 'CinemaVelvet',
  webDir: 'dist',
    plugins: {
        CapacitorHttp: {
            enabled: true
        }
    }
};

export default config;
