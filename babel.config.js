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
            "@DTOs": "./src/DTOs",
            "@components": "./src/components",
            "@storage": "./src/storage",
            "@utils": "./src/utils",
            "@screens": "./src/screens",
            "@assets": "./src/assets",
            "@hooks": "./src/hooks",
            "@contexts": "./src/contexts",
            "@routes": "./src/routes",
            "@services": "./src/services",
          },
        },
      ],
    ],
  };
};
