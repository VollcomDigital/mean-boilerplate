module.exports = {
  '*.{js,ts,mjs,cjs,json,md,scss,html,yml,yaml}': ['prettier --write'],
  'backend/**/*.{ts,js}': ['npm exec --prefix backend eslint --fix --max-warnings=0'],
  'frontend/**/*.{ts,js}': ['npm exec --prefix frontend eslint --fix --max-warnings=0'],
};
