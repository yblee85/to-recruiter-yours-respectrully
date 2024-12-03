const { ConversationListener } = require('./conversation_listener.js');
const { MessageResponder } = require('./message_responder.js');

// https://github.com/yblee85/to-recruiter-yours-respectfully/wiki/Find-VoyagerMessengerConversationsQueryId
const VoyagerMessengerConversationsQueryId = 'changeme-required';

// https://github.com/yblee85/to-recruiter-yours-respectfully/wiki/Find-VoyagerMessengerMessagesQueryId
const VoyagerMessengerMessagesQueryId = 'changeme-optional';

let responderOpts = {
  conversationsQueryId: VoyagerMessengerConversationsQueryId,
  messagesQueryId: VoyagerMessengerMessagesQueryId,
  intervalInSec: 5,

  minDistanceToRespond: 1,
  minTextLength: 500,
};

const listener = new ConversationListener(responderOpts);
await listener.initialize();

const responder = new MessageResponder(listener.myInfo, responderOpts);
listener.register(responder);

listener.start();
listener.stop();
