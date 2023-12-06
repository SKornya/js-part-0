// Test utils
const testBlock = (name: string): void => {
  console.groupEnd();
  console.group(`# ${name}\n`);
};

const areEqual = (a: unknown, b: unknown): boolean => {
  if (typeof a === 'object' && typeof b === 'object' && a !== null && b !== null) {
      if (Array.isArray(a) && Array.isArray(b)) {
          const sortedA = [...a];
          sortedA.sort();

          const sortedB = [...b];
          sortedB.sort();

          return sortedA.every((value, index) => areEqual(value, sortedB[index]));
      }

      interface newObj {
          [key: string]: unknown;
      }

      const newA: newObj = { ...a };
      const newB: newObj = { ...b };

      return Object.keys(newA).every((value) => areEqual(newA[value], newB[value]));
  }

  return a === b;
  // Compare arrays of primitives
  // Remember: [] !== []
};

const test = (whatWeTest: string, actualResult: unknown, expectedResult: unknown): void => {
  if (areEqual(actualResult, expectedResult)) {
      console.log(`[OK] ${whatWeTest}\n`);
  } else {
      console.error(`[FAIL] ${whatWeTest}`);
      console.debug('Expected:');
      console.debug(expectedResult);
      console.debug('Actual:');
      console.debug(actualResult);
      console.log('');
  }
};

// Functions

const getType = (value: unknown): string => {
  return typeof value;
  // Return string with a native JS type of value
};

const getTypesOfItems = (arr: unknown[]): string[] => {
  return arr.map((value) => getType(value));
  // Return array with types of items of given array
};

const allItemsHaveTheSameType = (arr: unknown[]): boolean => {
  const typesArr = getTypesOfItems(arr);
  return !typesArr.filter((type) => type !== typesArr[0]).length;
  // Return true if all items of array have the same type
};

const getRealType = (value: unknown): string => {
  if (typeof value === 'number') {
      if (Number.isNaN(value)) {
          return 'NaN';
      } else if (!Number.isFinite(value)) {
          return 'Infinity';
      }
      return 'number';
  } else if (typeof value === 'object') {
      if (Array.isArray(value)) {
          return 'array';
      } else if (value === null) {
          return 'null';
      } else if (value instanceof Date) {
          return 'date';
      } else if (value instanceof Map) {
          return 'map';
      } else if (value instanceof Set) {
          return 'set';
      } else if (value instanceof Promise) {
          return 'promise';
      } else if (value instanceof RegExp) {
          return 'regexp';
      }
  }

  return typeof value;
  // Return string with a “real” type of value.
  // For example:
  //     typeof new Date()       // 'object'
  //     getRealType(new Date()) // 'date'
  //     typeof NaN              // 'number'
  //     getRealType(NaN)        // 'NaN'
  // Use typeof, instanceof and some magic. It's enough to have
  // 12-13 unique types but you can find out in JS even more :)
};

const getRealTypesOfItems = (arr: unknown[]): string[] => {
  // console.log(arr.map((value) => getRealType(value)));
  return arr.map((value) => getRealType(value));
  // Return array with real types of items of given array
};

const everyItemHasAUniqueRealType = (arr: unknown[]): boolean => {
  const typesArr = getRealTypesOfItems(arr);
  return typesArr.length === new Set(typesArr).size;
  // Return true if there are no items in array
  // with the same real type
};

const countRealTypes = (arr: unknown[]): [string, number][] | null => {
  if (arr.length === 0) {
      return null;
  }

  interface countObj {
      [ket: string]: number;
  }

  const types: countObj = {};
  const typesArr: string[] = getRealTypesOfItems(arr);

  typesArr.forEach((type) => {
      types[type] = (types[type] ?? 0) + 1;
  });

  return Object.entries(types);
  // Return an array of arrays with a type and count of items
  // with this type in the input array, sorted by type.
  // Like an Object.entries() result: [['boolean', 3], ['string', 5]]
};

// Tests

testBlock('getType');

test('Boolean', getType(true), 'boolean');
test('Number', getType(123), 'number');
test('String', getType('whoo'), 'string');
test('Array', getType([]), 'object');
test('Object', getType({}), 'object');
test(
  'Function',
  getType(() => {}),
  'function'
);
test('Undefined', getType(undefined), 'undefined');
test('Null', getType(null), 'object');

testBlock('allItemsHaveTheSameType');

test('All values are numbers', allItemsHaveTheSameType([11, 12, 13]), true);

test('All values are strings', allItemsHaveTheSameType(['11', '12', '13']), true);

test(
  'All values are strings but wait',
  allItemsHaveTheSameType(['11', new String('12'), '13']),
  false
  // What the result?
);

test(
  'Values like a number',
  allItemsHaveTheSameType([123, 123 / ('a' as any), 1 / 0]),
  true
  // What the result?
);

test('Values like an object', allItemsHaveTheSameType([{}]), true);

testBlock('getTypesOfItems VS getRealTypesOfItems');

const knownTypes = [
  42,
  1 / ('a' as any),
  1 / 0,
  'string',
  false,
  12n,
  Symbol('a'),
  undefined,
  null,
  /[a-zA-Z]/g,
  { 1: 'a', 2: 'b' },
  [1, 2, 3],
  () => 1,
  new Date(),
  new Map(),
  new Set([1, 1, 1, 2, 3]),
  new Promise((resolve) => {
      resolve(1);
  }),
  // Add values of different types like boolean, object, date, NaN and so on
];

test('Check basic types', getTypesOfItems(knownTypes), [
  'number',
  'number',
  'number',
  'string',
  'boolean',
  'bigint',
  'symbol',
  'undefined',
  'object', // в случае с проверкой null есть противоречие с 'Null' тестом, там ожидается object
  'object',
  'object',
  'object',
  'function',
  'object',
  'object',
  'object',
  'object',
  // What the types?
]);

test('Check real types', getRealTypesOfItems(knownTypes), [
  'number',
  'NaN',
  'Infinity',
  'string',
  'boolean',
  'bigint',
  'symbol',
  'undefined',
  'null',
  'regexp',
  'object',
  'array',
  'function',
  'date',
  'map',
  'set',
  'promise',
  // What else?
]);

testBlock('everyItemHasAUniqueRealType');

test('All value types in the array are unique', everyItemHasAUniqueRealType([true, 123, '123']), true);

test('Two values have the same type', everyItemHasAUniqueRealType([true, 123, '123' === (123 as any)]), false);

test('There are no repeated types in knownTypes', everyItemHasAUniqueRealType(knownTypes), true);

testBlock('countRealTypes');

test('Count unique types of array items', countRealTypes([true, null, !null, !!null, {}]), [
  ['boolean', 3],
  ['null', 1],
  ['object', 1],
]);

test('Counted unique types are sorted', countRealTypes([{}, null, true, !null, !!null]), [
  ['boolean', 3],
  ['null', 1],
  ['object', 1],
]);

// Add several positive and negative tests
testBlock('Additional test for real type');

test('RegExp', getRealType(/a/g), 'regexp');

test('Array', getRealType([]), 'array');

testBlock('Additional test for countRealTypes');

test('Empty array of values', countRealTypes([]), null);