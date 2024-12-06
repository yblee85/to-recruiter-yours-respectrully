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

const fetchWithCsrfToken = async (targetUrl, method = 'GET', body) => {
  const csrfTkn = getCookie('JSESSIONID');
  const resp = await fetch(targetUrl, {
    method,
    headers: {
      'csrf-token': csrfTkn,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let liChunks = [];
  console.log(resp);
  for await (const chunk of resp.body) {
    liChunks = [...liChunks, ...chunk];
  }

  let liUnit8 = new Uint8Array(liChunks);
  const dec = new TextDecoder('utf-8');
  const strRespBody = dec.decode(liUnit8);

  try {
    return JSON.parse(strRespBody);
  } catch (_ex) {
    return strRespBody;
  }
};

class Client {
  VoyagerAPIRootUrl = 'https://www.linkedin.com/voyager/api';

  constructor(opts) {
    const { conversationsQueryId, messagesQueryId } = opts;
    this.conversationsQueryId = conversationsQueryId;
    this.messagesQueryId = messagesQueryId;
  }

  async fetchMe() {
    const meUrl = `${this.VoyagerAPIRootUrl}/me`;
    return fetchWithCsrfToken(meUrl);
  }

  async fetchConversations() {
    const conversationsUrl = `${this.VoyagerAPIRootUrl}/voyagerMessagingGraphQL/graphql?queryId=messengerConversations.${this.conversationsQueryId}&variables=(mailboxUrn:${encodeURIComponent(this.hostIdentityUrn)})`;
    return fetchWithCsrfToken(conversationsUrl);
  }

  async sendMessage(msgBody, conversationUrn, mailboxUrn) {
    const trackingId = this.generateTrackingId();
    const originToken = this.generateOriginToken();

    const resp = await fetchWithCsrfToken(
      `${this.VoyagerAPIRootUrl}/voyagerMessagingDashMessengerMessages?action=createMessage`,
      'POST',
      {
        message: {
          body: {
            attributes: [],
            text: msgBody,
          },
          renderContentUnions: [],
          conversationUrn,
          originToken,
        },
        trackingId,
        mailboxUrn,
        dedupeByClientGeneratedToken: false,
      },
    );

    return resp;
  }

  // https://github.com/tomquirk/linkedin-api/issues/168#issuecomment-868545454
  generateTrackingId() {
    let n = new Array(16);

    for (let e, t = 0; t < 16; t++) {
      0 == (3 & t) && (e = 4294967296 * Math.random());
      n[t] = (e >>> ((3 & t) << 3)) & 255;
    }

    let trackingId = '';
    for (let i = 0; i < n.length; i++) trackingId += String.fromCharCode(n[i]);

    return trackingId;
  }

  generateOriginToken() {
    return crypto.randomUUID();
  }
}

module.exports = { Client };
