const { MessageController } = require("../../../src/linkedin/browser/message_controller.js");

const MeMock = {
  "plainId": 12345,
  "miniProfile": {
    "memorialized": false,
    "firstName": "michael",
    "lastName": "jordan",
    "dashEntityUrn": "urn:li:fsd_profile:AbCDEfG",
    "occupation": "Software Engineer",
    "objectUrn": "urn:li:member:12345",
    "entityUrn": "urn:li:fs_miniProfile:AbCDEfG",
    "backgroundImage": {
      "com.linkedin.common.VectorImage": {
        "rootUrl": "https://media.licdn.com/dms/image/v2/ABBCDSFJLSD/profile-displaybackgroundimage-shrink_"
      }
    },
    "publicIdentifier": "michael-jordan",
    "picture": {
      "com.linkedin.common.VectorImage": {
        "artifacts": [],
        "rootUrl": "https://media.licdn.com/dms/image/v2/BCDSLKJLKJDSF/profile-displayphoto-shrink_"
      }
    },
    "trackingId": "klajlskdjBDKHs=="
  },
  "publicContactInfo": {},
  "premiumSubscriber": false
};

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
      fetch.mockImplementationOnce(getMockFetchFn(MeMock));

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
