const { Client } = require('../../../src/linkedin/browser/client');
const { getMockFetchFn, convertJsonToUnit8Arra } = require('../../helper');
const { MeAPIResponseMock, ConversationsAPIResponseMock } = require('../../mock/linkedin');

global.document = {
  cookie: 'JSESSIONID=cookie',
};

describe('LinkedIn - Client', () => {
  const unmockedFetch = global.fetch;

  afterEach(() => {
    global.fetch = unmockedFetch;
    jest.restoreAllMocks();
  });

  describe('fetchMe', () => {
    it('should call /me api', async () => {
      global.fetch = jest.fn().mockImplementation(getMockFetchFn(convertJsonToUnit8Arra(MeAPIResponseMock)));
      const client = new Client({ conversationsQueryId: 'test-query-id' });

      await client.fetchMe();

      expect(fetch).toHaveBeenCalledWith(
        'https://www.linkedin.com/voyager/api/me',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'csrf-token': 'cookie',
          }),
        }),
      );
    });
  });

  describe('fetchConversations', () => {
    it('should fetch conversations', async () => {
      const client = new Client({ conversationsQueryId: 'test-query-id' });

      global.fetch = jest.fn().mockImplementation(getMockFetchFn(convertJsonToUnit8Arra(ConversationsAPIResponseMock)));
      const fakeHostIdentityUrn = 'urn:li:fsd_profile:test';
      await client.fetchConversations(fakeHostIdentityUrn);

      expect(fetch).toHaveBeenCalledWith(
        `https://www.linkedin.com/voyager/api/voyagerMessagingGraphQL/graphql?queryId=messengerConversations.test-query-id&variables=(mailboxUrn:${encodeURIComponent(fakeHostIdentityUrn)})`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'csrf-token': 'cookie',
          }),
        }),
      );
    });
  });

  describe('sendMessage', () => {
    it('should send a message', async () => {
      const client = new Client({ conversationsQueryId: 'test-query-id' });

      global.fetch = jest.fn().mockImplementation(getMockFetchFn(convertJsonToUnit8Arra({})));
      const mailboxUrn = 'urn:li:fsd_profile:test';
      const conversationUrn = crypto.randomUUID();
      const msg = 'Hi there, this is a message.';
      await client.sendMessage(msg, conversationUrn, mailboxUrn);

      expect(fetch).toHaveBeenCalledWith(
        'https://www.linkedin.com/voyager/api/voyagerMessagingDashMessengerMessages?action=createMessage',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'csrf-token': 'cookie',
          }),
          body: expect.stringContaining(msg),
        }),
      );
    });
  });
});
