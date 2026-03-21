import 'dotenv/config';

export default {
  expo: {
    android: {
      package: 'com.baseuirn.playground',
    },
    extra: {
      eas: {
        projectId: '6c8eaf15-b9bf-47b1-bde1-59509c6d9ff7',
      },
    },
    ios: {
      bundleIdentifier: 'com.baseuirn.playground',
    },
    name: 'base-ui-rn Playground',
    plugins: ['expo-dev-client'],
    slug: 'base-ui-rn-playground',
    updates: {
      url: `https://u.expo.dev/${process.env.EAS_PROJECT_ID}`,
    },
    version: '1.0.0',
  },
};
