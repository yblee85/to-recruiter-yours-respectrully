const { ConversationListener } = require('./conversation_listener.js');
const { MessageResponder } = require('./message_responder.js');

/**
 * Execute
 **/

// search text "/voyager/api/voyagerMessagingGraphQL/graphql" in browser developer tool - network
// example: https://www.linkedin.com/voyager/api/voyagerMessagingGraphQL/graphql?queryId=messengerConversations.{RANDOM_STRING}&variables=(mailboxUrn:{hostIdentityUrn})

// message history
//https://www.linkedin.com/voyager/api/voyagerMessagingGraphQL/graphql?queryId=messengerMessages.{RANDOM_STRING}&variables=(conversationUrn:urn:li:msg_conversation:({conversationEntityUrn}))

const VoyagerMessengerConversationsQueryId = 'changeme-required';
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
