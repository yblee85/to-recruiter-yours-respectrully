const getCookie = (key) => {
  const foundCookie = document.cookie
    .split(';')
    .find((str) => str.trim().startsWith(`${key}=`))
    ?.trim();
  if (!foundCookie) return;

  const [_, val] = foundCookie.split('=');

  try {
    return JSON.parse(val);
  } catch (_ex) {
    return val;
  }
};

class ConversationListener {
  VoyagerAPIRootUrl = 'https://www.linkedin.com/voyager/api';

  constructor(opts) {
    const { conversationsQueryId, messagesQueryId, ...rest } = opts;
    this.conversationsQueryId = conversationsQueryId;
    this.messagesQueryId = messagesQueryId;
    this.opts = rest;

    this.registry = new Set();
  }

  async initialize() {
    const meUrl = `${this.VoyagerAPIRootUrl}/me`;
    const { miniProfile } = await this.fetchWithCsrfToken(meUrl);

    this.myInfo = {
      firstName: miniProfile.firstName,
      lastName: miniProfile.lastName,
      headline: miniProfile.occupation,
      hostIdentityUrn: miniProfile.dashEntityUrn,
      distance: 0,
      profilePictureRootUrl: miniProfile.picture['com.linkedin.common.VectorImage'].rootUrl,
      conversationEntityUrn: undefined,
      messageElements: [],
    };
  }

  register(observer) {
    if (!this.registry.has(observer)) {
      this.registry.add(observer);
    }
  }

  deregister(observer) {
    this.registry.delete(observer);
  }

  listen() {
    if (this.cronJobId !== undefined) {
      console.log('a cronjob is already running');
      return;
    }

    let { intervalInSec = 60 } = this.opts;

    let tsStart = new Date().getTime();
    let cronJobId = setInterval(async () => {
      const messagedUsers = await this.fetchMessagedUsers();

      const before = tsStart;
      const now = new Date().getTime();
      tsStart = now;

      const newMessagedUsers = messagedUsers.filter((user) => {
        const { messageElements } = user;
        if (messageElements.length === 0) return false;

        let { deliveredAt } = messageElements[0];

        return before <= deliveredAt && deliveredAt <= now;
      });

      if (newMessagedUsers.length > 0 && this.registry.size > 0) {
        this.registry.values().forEach((observer) => {
          newMessagedUsers.forEach(async (newMsgUser) => {
            await observer.process(newMsgUser);
          });
        });
      }
    }, intervalInSec * 1000);

    this.cronJobId = cronJobId;
  }

  stop() {
    clearInterval(this.cronJobId);
    this.cronJobId = undefined;
  }

  async fetchConversations() {
    const conversationsUrl = `${this.VoyagerAPIRootUrl}/voyagerMessagingGraphQL/graphql?queryId=messengerConversations.${this.conversationsQueryId}&variables=(mailboxUrn:${encodeURIComponent(this.myInfo.hostIdentityUrn)})`;
    return this.fetchWithCsrfToken(conversationsUrl);
  }

  async fetchMessagedUsers() {
    const { data } = await this.fetchConversations();
    return data.messengerConversationsBySyncToken.elements
      .map((el) => this.getUserInfoFromConversatoinElement(el))
      .compact();
  }

  async fetchWithCsrfToken(targetUrl) {
    const csrfTkn = getCookie('JSESSIONID');
    const dataStream = await fetch(targetUrl, {
      headers: {
        'csrf-token': csrfTkn,
      },
    });

    return await dataStream.json();
  }

  getUserInfoFromConversatoinElement(element) {
    const { conversationParticipants, messages, entityUrn, contentMetadata, categories } = element;

    // Skip if it's not a 1-on-1 chat
    if (conversationParticipants.length !== 2) return;

    // You can't reply to sponsored/Ads message
    if (contentMetadata?.conversationAdContent) return;

    // Focused messages only
    if (!categories.includes('PRIMARY_INBOX')) return;

    const { hostIdentityUrn, participantType } = conversationParticipants.find(
      (user) => user.hostIdentityUrn !== this.myInfo.hostIdentityUrn,
    );
    const { member } = participantType;

    const messageElements = messages.elements.map((msgEl) => ({
      from: {
        hostIdentityUrn: msgEl.actor.hostIdentityUrn,
      },
      body: msgEl.body.text.replaceAll('\n', ' '),
      subject: msgEl.subject,
      deliveredAt: msgEl.deliveredAt,
    }));

    return {
      firstName: member.firstName.text,
      lastName: member.lastName.text,
      headline: member.headline.text,
      hostIdentityUrn: hostIdentityUrn,
      distance: parseInt(member.distance.replace('DISTANCE_', '')),
      profilePictureRootUrl: member.profilePicture.rootUrl,
      conversationEntityUrn: entityUrn,
      messageElements: messageElements,
    };
  }
}

module.exports = { ConversationListener };
