const { Client } = require('./client.js');
const { ConversationListener } = require('./conversation_listener.js');
const { MessageResponder } = require('./message_responder.js');

// https://github.com/yblee85/to-recruiter-yours-respectfully/wiki/Find-VoyagerMessengerConversationsQueryId
const VoyagerMessengerConversationsQueryId = 'changeme-required';

// https://github.com/yblee85/to-recruiter-yours-respectfully/wiki/Find-VoyagerMessengerMessagesQueryId
const VoyagerMessengerMessagesQueryId = 'changeme-optional';

const clientOpts = {
  conversationsQueryId: VoyagerMessengerConversationsQueryId,
  messagesQueryId: VoyagerMessengerMessagesQueryId,
};
const linkedinClient = new Client(clientOpts);

const listenerOpts = {
  intervalInSec: 60,
};
const listener = new ConversationListener(linkedinClient, listenerOpts);
await listener.initialize();

const responderOpts = {
  minDistanceToRespond: 1,
  minTextLength: 500,
};
const responder = new MessageResponder(linkedinClient, responderOpts);
await responder.initialize();
listener.register(responder);

listener.start();
listener.stop();
