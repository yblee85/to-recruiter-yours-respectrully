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
    }),
  );

describe('LinkedIn - ConversationListener', () => {
  describe('initialize', () => {
    it('default', async () => {
      fetch.mockImplementationOnce(getMockFetchFn(MeAPIResponseMock));

      const ctrl = new ConversationListener({});
      expect(ctrl.myInfo).toBeUndefined();

      await ctrl.initialize();

      const { distance, firstName, lastName } = ctrl.myInfo;
      expect(distance).toBe(0);
      expect(firstName).toBe('Air');
      expect(lastName).toBe('Jordan');
    });
  });
});
