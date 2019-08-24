module.exports = {
  preset: 'ts-jest',
  moduleDirectories: ['node_modules', 'src'],
  collectCoverage: true,
  // collectCoverageFrom: ['src/components/**/*.{ts,js}'],
  globals: {
    window: true,
  },
};
