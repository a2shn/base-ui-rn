import 'dotenv/config';

export default {
  expo: {
    name: 'base-ui-rn Playground',
    slug: 'base-ui-rn-playground',
    version: '1.0.0',
    ios: {
      bundleIdentifier: 'com.baseuirn.playground',
    },
    android: {
      package: 'com.baseuirn.playground',
    },
    extra: {
      eas: {
        projectId: process.env.EAS_PROJECT_ID,
      },
    },
    updates: {
      url: `https://u.expo.dev/${process.env.EAS_PROJECT_ID}`,
    },
    plugins: ['expo-dev-client'],
  },
};
