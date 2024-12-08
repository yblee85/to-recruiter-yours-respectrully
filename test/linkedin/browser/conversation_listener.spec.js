const { Client } = require('../../../src/linkedin/browser/client.js');
const { ConversationListener } = require('../../../src/linkedin/browser/conversation_listener.js');
const { MeAPIResponseMock, ConversationsAPIResponseMock } = require('../../mock/linkedin.js');

describe('LinkedIn - ConversationListener', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('initialize', () => {
    it('should call fetchMe', async () => {
      const client = new Client({ conversationsQueryId: 'test-query-id' });

      const spy = jest.spyOn(client, 'fetchMe').mockReturnValue(MeAPIResponseMock);

      const listener = new ConversationListener(client, {});
      expect(listener.myInfo).toBeUndefined();

      await listener.initialize();

      expect(spy).toHaveBeenCalled();
      const { distance, firstName, lastName } = listener.myInfo;
      expect(distance).toBe(0);
      expect(firstName).toBe('Air');
      expect(lastName).toBe('Jordan');
    });
  });

  describe('registry', () => {
    it('should register', () => {
      const client = new Client({ conversationsQueryId: 'test-query-id' });

      const listener = new ConversationListener(client, {});

      const observer1 = jest.fn();
      const observer2 = jest.fn();

      listener.register(observer1);

      expect(listener.registry.has(observer1)).toBeTruthy();
      expect(listener.registry.has(observer2)).toBeFalsy();
    });

    it('should deregister', () => {
      const client = new Client({ conversationsQueryId: 'test-query-id' });

      const listener = new ConversationListener(client, {});

      const observer1 = jest.fn();

      listener.register(observer1);
      expect(listener.registry.has(observer1)).toBeTruthy();

      listener.deregister(observer1);
      expect(listener.registry.has(observer1)).toBeFalsy();
    });
  });

  describe('fetchMessagedUsers', () => {
    it('should return users with latest msg', async () => {
      const client = new Client({ conversationsQueryId: 'test-query-id' });

      jest.spyOn(client, 'fetchMe').mockReturnValue(MeAPIResponseMock);
      const spy = jest.spyOn(client, 'fetchConversations').mockReturnValue(ConversationsAPIResponseMock);

      const listener = new ConversationListener(client, {});
      await listener.initialize();
      const usersWithMsg = await listener.fetchMessagedUsers();

      expect(spy).toHaveBeenCalled();
      expect(usersWithMsg.length).toBe(2);

      const [whiteChocolate, jStock] = usersWithMsg;
      expect(whiteChocolate.firstName).toBe('White');

      expect(jStock.firstName).toBe('J');
    });
  });
});
