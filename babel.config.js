module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          alias: {
            "@dtos": "./src/dtos",
            "@components": "./src/components",
            "@storage": "./src/storage",
            "@utils": "./src/utils",
            "@screens": "./src/screens",
            "@assets": "./src/assets",
            "@hooks": "./src/hooks",
            "@context": "./src/context",
            "@routes": "./src/routes",
            "@services": "./src/services",
          },
        },
      ],
    ],
  };
};
