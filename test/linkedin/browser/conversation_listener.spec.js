const { MessageController } = require("../../../src/linkedin/browser/conversation_listener.js");
const { MeAPIResponseMock } = require("../../mock/linkedin.js");

global.fetch = jest.fn();

global.document = {
  cookie: "JSESSIONID=cookie"
}

const getMockFetchFn = (resp) => (jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(resp),
  })
));

describe('LinkedIn - MessageController', () => {
  describe('initialize', () => {
    it('default', async () => {
      fetch.mockImplementationOnce(getMockFetchFn(MeAPIResponseMock));

      const ctrl = new MessageController({});
      expect(ctrl.myInfo).toBeUndefined();

      await ctrl.initialize();

      const { distance, firstName, lastName } = ctrl.myInfo;
      expect(distance).toBe(0);
      expect(firstName).toBe('michael');
      expect(lastName).toBe('jordan');
    });
  });
});
