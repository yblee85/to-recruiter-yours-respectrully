![Build Status](https://github.com/yblee85/to-recruiter-yours-respectfully/actions/workflows/test.yml/badge.svg?branch=main)
[![cov](https://yblee85.github.io/to-recruiter-yours-respectfully/badges/coverage.svg)](https://github.com/yblee85/to-recruiter-yours-respectfully/actions)

# To recruiter, Yours respectfully

Automatically reply to a job opportunity LinkedIn message that is vague and generic.

## Disclaimer

This is an unofficial repo designed solely for educational purposes and personal use.

By using this repo, you agree not to hold the author or contributors liable for any consequences arising from its use.

## Background Story

I often get LinkedIn messages from recruiters about exciting opportunities which I'm thrilled to explore.

However, a few recruiters send me messages with very vague and generic information.

There's no doubt that these recruiters have valid reasons for doing so; nonetheless, my interest in that opportunity dramatically drops.

I would prefer to receive job opportunity messages with more detailed information, such as responsibilites, tech stacks, location, and company size, etc.

It would be great if they could also share the salary range.

I want to automatically reply to those recruiters kindly that I'm not interested.

## Getting Started

### Prerequisite

1. Web browser (this runs on a browser, developer tool)
2. VoyagerMessengerConversationsQueryId [Wiki - How to find it?](https://github.com/yblee85/to-recruiter-yours-respectfully/wiki/Find-VoyagerMessengerConversationsQueryId)
3. VoyagerMessengerMessagesQueryId [Wiki - How to find it?](https://github.com/yblee85/to-recruiter-yours-respectfully/wiki/Find-VoyagerMessengerMessagesQueryId)

### Steps

1. Go to LinkedIn page and open developer tool.
2. Copy `conversation_listener.js` into developer tool except `module.exports..` line
3. Copy `message_responder.js` into developer tool except `require` and `module.exports` lines
4. Copy following into developer tool and change accordingly,

```js
const VoyagerMessengerConversationsQueryId = 'changeme-required';
const VoyagerMessengerMessagesQueryId = 'changeme-optional';

let responderOpts = {
  // required
  conversationsQueryId: VoyagerMessengerConversationsQueryId,

  // not being used at the moment (optional)
  messagesQueryId: VoyagerMessengerMessagesQueryId,

  // optional
  intervalInSec: 5,
  minDistanceToRespond: 1,
  minTextLength: 500,
};

const listener = new ConversationListener(responderOpts);
await listener.initialize();

const responder = new MessageResponder(listener.myInfo, responderOpts);
listener.register(responder);

listener.start();
```
