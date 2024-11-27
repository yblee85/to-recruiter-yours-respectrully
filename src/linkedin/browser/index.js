// TODO
// const { ConversationListener } = require('./conversation_listener.js');

/**
 * Execute
 **/

// search text "/voyager/api/voyagerMessagingGraphQL/graphql" in browser developer tool - network
// example: https://www.linkedin.com/voyager/api/voyagerMessagingGraphQL/graphql?queryId=messengerConversations.{RANDOM_STRING}&variables=(mailboxUrn:{hostIdentityUrn})

// message history
//https://www.linkedin.com/voyager/api/voyagerMessagingGraphQL/graphql?queryId=messengerMessages.{RANDOM_STRING}&variables=(conversationUrn:urn:li:msg_conversation:({conversationEntityUrn}))

// const VoyagerMessengerConversationsQueryId = 'changeme-required';
// const VoyagerMessengerMessagesQueryId = 'changeme-optional';

// let responderOpts = {
//   conversationsQueryId: VoyagerMessengerConversationsQueryId,
//   messagesQueryId: VoyagerMessengerMessagesQueryId,
//   intervalInSec: 5,

//   minDistanceToRespond: 2,

//   delayBetweenUIActionsInMs: 500,
// };

// const delay = ms => new Promise((resolve, _) => {
//   setTimeout(_ => resolve(), ms);
// });
