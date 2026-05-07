const createMMKV = () => ({
  set: jest.fn(),
  getString: jest.fn(() => undefined),
  getNumber: jest.fn(() => undefined),
  getBoolean: jest.fn(() => undefined),
  contains: jest.fn(() => false),
  remove: jest.fn(),
  clearAll: jest.fn(),
  getAllKeys: jest.fn(() => []),
});

module.exports = { createMMKV };
