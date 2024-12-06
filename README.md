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
2. Copy `client.js` into developer tool except `module.exports..` line
3. Copy `conversation_listener.js` into developer tool except `module.exports..` line
4. Copy `message_responder.js` into developer tool except `require` and `module.exports` lines
5. Copy following into developer tool and change accordingly,

```js
const VoyagerMessengerConversationsQueryId = 'changeme-required';
const VoyagerMessengerMessagesQueryId = 'changeme-optional';

const clientOpts = {
  conversationsQueryId: VoyagerMessengerConversationsQueryId, // required
  messagesQueryId: VoyagerMessengerMessagesQueryId,           // not being used at the moment (optional)
};
const linkedinClient = new Client(clientOpts);

const listenerOpts = {
  intervalInSec: 5,
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
```

### Example response message 

```
[This is an automated response]

Hi [Recruiter Name],

It seems you sent me a message about an exciting job opportunity!
First of all, I really appreciate you for considering me as a potential candidate for the role.

However there seems to be some missing info that I'd like to know more about in your message and just wanted to give you a headsup.

Could you double check if the job description has following info?

1. Company (doesn't have to mention name but what they do and size (how many developers?))

2. Detailed role description and tech stack

3. Location (on-site, hybrid, fully remote)

4. Salary, compensation, benefits

Did you already mention all of these above, or even worse, did message you sent have nothing to do with a job opportunity?
If so, my apologies :( my text parser is very simple and I need to improve. I'm gonna check it out.
Feel free to checkout my github repo [To Recruiter, Yours respectfully](https://github.com/yblee85/to-recruiter-yours-respectfully) for more information.

Yours respectfully,
```
