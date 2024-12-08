const getMockFetchFn = (resp) =>
  jest.fn(() =>
    Promise.resolve({
      // json: () => Promise.resolve(resp),
      body: [resp],
    }),
  );

const convertJsonToUnit8Arra = (input) => {
  let str = JSON.stringify(input, null, 0);
  let ret = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    ret[i] = str.charCodeAt(i);
  }
  return ret;
};

module.exports = { getMockFetchFn, convertJsonToUnit8Arra };
