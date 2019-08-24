module.exports = {
  "env": {
    node: true,
    browser: true,
    es6: true,
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  parser: "babel-eslint",
  "globals": {
    window: true,
    document: true,
    confirmDialog: true,
    __DEVELOPMENT__: true,
  },
  "parserOptions": {
    "ecmaFeatures": {
    "jsx": true
  },
  "ecmaVersion": 2018,
  "sourceType": "module"
  },
  "plugins": [
    "react",
    "babel",
  ],
  "rules": {
    "indent": [ //  табы
      "error",
      2,
      {
        SwitchCase: 1,
      },
    ],
    "no-multiple-empty-lines": [
      "error",
      { "max": 1, "maxEOF": 1 }
    ],
    "linebreak-style": [  // LF
      "error",
      "unix"
    ],
    "object-property-newline": [
      1,
      { "allowAllPropertiesOnSameLine": true }
    ], // деструктуризация в строки
    "quotes": [ //  кавычки
      "error",
      "single"
    ],
    "operator-linebreak": ["error", "before"],
    "semi": [ // ; в конце каждой строки
      "error",
      "always"
    ],
    "arrow-parens": [ // аргументы анонимной всегда в скобки
      "error",
      "always",
    ],
    "no-console": [
      "error",
      { allow: ["warn", "info", "error"] },
    ],
    "no-tabs": "error",
    "no-continue": "error",
    "no-mixed-spaces-and-tabs": "error",
    "no-confusing-arrow": [ // return или () в анонимной функции
      1,
      { "allowParens": false },
    ],
    "quote-props": [ // одинаковый формат имён у свойств объекта
      "error",
      "consistent-as-needed",
    ],
    "no-underscore-dangle": [ // обращение к "_скрытым" свойствам
      "error",
      { "allowAfterThis": true },
    ],
    "class-methods-use-this": 0,  // если у функции нет обращения к контексту, то такая функция должна быть статичной
    "max-len": [
      1,
      130,
    ],
    "camelcase": [
      0,
    ],
    "no-param-reassign": [ // скажем нет мутации
      "error",
      { "props": false },
    ],
    "no-unused-expressions": [
      "error",
      { "allowShortCircuit": true },
    ],
    "no-unused-vars": [
      "error",
      { "ignoreRestSiblings": true },
    ],
    "no-plusplus": [ // против a++
      "error",
      { "allowForLoopAfterthoughts": true },
    ],
    "object-curly-spacing": [
      "error",
      "always",
    ],
    "no-unexpected-multiline": [
      1,
    ],
    "react/prop-types": [1],
    "react/forbid-prop-types": [0],
    "react/display-name": [0],
    "react/destructuring-assignment": [0],
    "react/jsx-no-bind": [1],
    "babel/new-cap": 1,
    "babel/camelcase": 0,
    "babel/no-invalid-this": 1,
    "babel/object-curly-spacing": 0,
    "babel/quotes": 0,
    "babel/semi": 1,
    "babel/no-unused-expressions": 1,
    "babel/valid-typeof": 1
  },
};