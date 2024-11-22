const { MessageController } = require('./message_controller.js');

/**
 * Execute
 **/

// search text "/voyager/api/voyagerMessagingGraphQL/graphql" in browser developer tool - network
// example: https://www.linkedin.com/voyager/api/voyagerMessagingGraphQL/graphql?queryId=messengerConversations.{RANDOM_STRING1}&variables=(mailboxUrn:{hostIdentityUrn})

// message history
//https://www.linkedin.com/voyager/api/voyagerMessagingGraphQL/graphql?queryId=messengerMessages.0c1bd47e37c67578e99250a711f0c18e&variables=(conversationUrn:urn:li:msg_conversation:(urn:li:fsd_profile:ACoAAAr2_UEBSOXtOcmGYsxIxANKTjZNr8dG4NE,2-NTc2OTRjNWQtZjRhNS00MzM2LWI2NzUtNzg2NzY1NWFjNjgxXzAxMA==))
const VoyagerMessengerConversationsId = 'changeme-required';
const VoyagerMessengerMessagesId = 'changeme-optional';

let responderOpts = {
  conversationsId: VoyagerMessengerConversationsId,
  messagesId: VoyagerMessengerMessagesId,
  intervalInSec: 5,

  minDistanceToRespond: 2,

  delayBetweenUIActionsInMs: 500,
};

const delay = ms => new Promise((resolve, _) => {
  setTimeout(_ => resolve(), ms);
});

