const { Client } = require('../../../src/linkedin/browser/client.js');
const { ConversationListener } = require('../../../src/linkedin/browser/conversation_listener.js');
const { MessageResponder } = require('../../../src/linkedin/browser/message_responder.js');
const { MeAPIResponseMock, ConversationsAPIResponseMock } = require('../../mock/linkedin.js');

describe('LinkedIn - MessageResponder', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('initialize', () => {
    it('should call fetchMe', async () => {
      const client = new Client({ conversationsQueryId: 'test-query-id' });

      const spy = jest.spyOn(client, 'fetchMe').mockReturnValue(MeAPIResponseMock);

      const responder = new MessageResponder(client, {});
      expect(responder.myInfo).toBeUndefined();

      await responder.initialize();

      expect(spy).toHaveBeenCalled();
      const { distance, firstName, lastName } = responder.myInfo;
      expect(distance).toBe(0);
      expect(firstName).toBe('Air');
      expect(lastName).toBe('Jordan');
    });
  });

  describe('isShouldRespond', () => {
    it('should call fetchMe', async () => {
      const client = new Client({ conversationsQueryId: 'test-query-id' });

      jest.spyOn(client, 'fetchMe').mockReturnValue(MeAPIResponseMock);
      jest.spyOn(client, 'fetchConversations').mockReturnValue(ConversationsAPIResponseMock);

      const responder = new MessageResponder(client, {});
      await responder.initialize();

      const listener = new ConversationListener(client, {});
      await listener.initialize();

      const [badMsg, goodMsg] = await listener.fetchMessagedUsers();

      expect(responder.isShouldRespond(badMsg)).toBeTruthy();
      expect(responder.isShouldRespond(goodMsg)).toBeFalsy();
    });
  });
});
