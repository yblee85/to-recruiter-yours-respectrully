const { Client } = require('../../../src/linkedin/browser/client.js');
const { ConversationListener } = require('../../../src/linkedin/browser/conversation_listener.js');
const { MeAPIResponseMock } = require('../../mock/linkedin.js');

global.fetch = jest.fn();

global.document = {
  cookie: 'JSESSIONID=cookie',
};

const getMockFetchFn = (resp) =>
  jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(resp),
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

describe('LinkedIn - ConversationListener', () => {
  describe('initialize', () => {
    it('default', async () => {
      fetch.mockImplementationOnce(getMockFetchFn(convertJsonToUnit8Arra(MeAPIResponseMock)));

      const client = new Client({});

      const ctrl = new ConversationListener(client, {});
      expect(ctrl.myInfo).toBeUndefined();

      await ctrl.initialize();

      const { distance, firstName, lastName } = ctrl.myInfo;
      expect(distance).toBe(0);
      expect(firstName).toBe('Air');
      expect(lastName).toBe('Jordan');
    });
  });
});
