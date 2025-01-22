import eslintjs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslintjs.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    rules: {
        "@typescript-eslint/no-explicit-any": "off",
    },
    languageOptions: {
        parserOptions: {
          projectService: {
            allowDefaultProject: ['*.js', '*.mjs'],
          },
          tsconfigRootDir: import.meta.dirname,
        },
      },
  },
);