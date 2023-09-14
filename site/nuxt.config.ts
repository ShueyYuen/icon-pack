// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // 调试插件过程中需要关闭devtools
  devtools: { enabled: false },
  css: [
    // 加载 Less 文件
    '@/assets/less/main.less',
  ],
  nitro: {
    plugins: ['~/server/plugins/database.ts', '~/server/plugins/mongo.ts'],
    storage: {
      redis: {
        driver: 'redis',
        port: 6379,
        host: 'redis',
        db: 0,
      },
    },
  },
  experimental: {
    crossOriginPrefetch: true,
  },
  modules: [
    // pinia plugin
    '@pinia/nuxt',
  ],
  imports: {
    dirs: ['./stores'],
  },
  pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate'],
  },
});
