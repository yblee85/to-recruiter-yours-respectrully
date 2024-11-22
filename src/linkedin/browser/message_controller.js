const getCookie = (key) => {
  const foundCookie = document.cookie.split(";").find(str => str.trim().startsWith(`${key}=`))?.trim();
  if(!foundCookie) return;

  const [_, val] = foundCookie.split("=");

  try {
    return JSON.parse(val);
  } catch(_) {
    return val;
  }
};

class MessageController {
  VoyagerAPIRootUrl = "https://www.linkedin.com/voyager/api";

  constructor(opts) {
    const { conversationsId, messagesId, ...rest } = opts;
    this.conversationsId = conversationsId;
    this.messagesId = messagesId;
    this.opts = rest;
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
      profilePictureRootUrl: miniProfile.picture["com.linkedin.common.VectorImage"].rootUrl,
      conversationEntityUrn: undefined,
      messageElements: [],
    };
  }

  async fetchMessengerConversations() {
    const conversationsUrl = `${this.VoyagerAPIRootUrl}/voyagerMessagingGraphQL/graphql?queryId=messengerConversations.${this.conversationsId}&variables=(mailboxUrn:${encodeURIComponent(this.myInfo.hostIdentityUrn)})`;
    return this.fetchWithCsrfToken(conversationsUrl);
  }

  async fetchMessagedUsers() {
    const { data } = await this.fetchMessengerConversations();
    return data.messengerConversationsBySyncToken.elements.map(el => this.getUserInfoFromConversatoinElement(el)).compact();
  }

  async fetchWithCsrfToken(targetUrl) {
    const csrfTkn = getCookie("JSESSIONID");
    const dataStream = await fetch(targetUrl, {
        headers: {
            "csrf-token": csrfTkn
        }
    });

    return await dataStream.json();
  }

  getUserInfoFromConversatoinElement(element) {
    const { conversationParticipants, messages, entityUrn, contentMetadata, categories } = element;

    // Skip if it's a group chat
    if(conversationParticipants.length !== 2) return;

    // You can't reply to sponsored/Ads message
    if(contentMetadata?.conversationAdContent) return;

    // Focused messages only
    if(!categories.includes("PRIMARY_INBOX")) return;

    const { hostIdentityUrn, participantType } = conversationParticipants.find(user => user.hostIdentityUrn !== this.myInfo.hostIdentityUrn);
    const { member } = participantType;

    const messageElements = messages.elements.map(msgEl => (
      {
        from: {
          hostIdentityUrn: msgEl.actor.hostIdentityUrn
        },
        text: msgEl.body.text.replaceAll("\n", " "),
        deliveredAt: msgEl.deliveredAt,
      }
    ));

    return {
      firstName: member.firstName.text,
      lastName: member.lastName.text,
      headline: member.headline.text,
      hostIdentityUrn: hostIdentityUrn,
      distance: parseInt(member.distance.replace("DISTANCE_", "")),
      profilePictureRootUrl: member.profilePicture.rootUrl,
      conversationEntityUrn: entityUrn,
      messageElements: messageElements,
    };
  }
}

module.exports = { MessageController };
