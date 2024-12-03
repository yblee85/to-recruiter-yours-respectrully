const { fetchWithCsrfToken } = require('./conversation_listener');

class MessageResponder {
  JobQualifierSubjectTokens = ['opportunity'];
  JobQualifierBodyTokens = [
    'exciting opportunity',
    'job opportunity',
    ' cv ',
    ' resume ',
    'join our team',
    'join their team',
    'recruit',
    'talent acquistion',
    "if you're interested",
  ];
  //TODO
  CompanyQualifierTokens = [];
  //TODO
  RoleQualifierTokens = [];
  LocationQualifierTokens = [
    'full remote',
    'fully remote',
    'fully-remote',
    'hybrid',
    'onsite',
    'on-site',
    'days a week',
  ];
  SalaryQualifierTokens = ['compensation', 'salary', 'benefits'];

  constructor(myInfo, opts) {
    this.myInfo = myInfo;

    const { minDistanceToRespond = 1, minTextLength = 700, ...rest } = opts;
    this.minDistanceToRespond = minDistanceToRespond;
    this.minTextLength = minTextLength;
    this.opts = rest;
  }

  /*
  {
    firstName,
    lastName,
    headline,
    hostIdentityUrn,
    distance,
    profilePictureRootUrl,
    conversationEntityUrn,
    messageElements: [
      {
        from: { hostIdentityUrn },
        body,
        subject,
        deliveredAt,
      }
    ],
  }
  */
  async process(userWithMessage) {
    if (this.isShouldRespond(userWithMessage)) {
      console.log('it should respond');
      const responseMsgPayload = this.getResponseMessagePayload(userWithMessage);
      console.log('responseMsgPayload', responseMsgPayload);
      await this.respondInLinkedIn(responseMsgPayload);
    } else {
      console.log('it should not respond');
    }
  }

  async respondInLinkedIn(responseMsgPayload) {
    const { body, conversationEntityUrn: conversationUrn } = responseMsgPayload;
    const trackingId = this.generateTrackingId();
    const originToken = this.generateOriginToken();

    const resp = await fetchWithCsrfToken(
      'https://www.linkedin.com/voyager/api/voyagerMessagingDashMessengerMessages?action=createMessage',
      'POST',
      {
        message: {
          body: {
            attributes: [],
            text: body,
          },
          renderContentUnions: [],
          conversationUrn,
          originToken,
        },
        trackingId,
        mailboxUrn: this.myInfo.hostIdentityUrn,
        dedupeByClientGeneratedToken: false,
      },
    );

    return resp;
  }

  // analyze message and return response message object if applicable
  isShouldRespond(userWithMessage) {
    const { distance, messageElements } = userWithMessage;

    // is smaller than minimum distance? return;
    if (distance < this.minDistanceToRespond) return false;

    // it only has one element
    const [lastMsg] = messageElements;
    // last message is from myself? return;
    if (lastMsg.from.hostIdentityUrn === this.myInfo.hostIdentityUrn) return false;

    const { body, subject } = lastMsg;
    // is job message?
    if (
      !this.isFoundMatches(subject, this.JobQualifierSubjectTokens) &&
      !this.isFoundMatches(body, this.JobQualifierBodyTokens)
    ) {
      return false;
    }

    const isHasLocationInfo = this.isFoundMatches(body, this.LocationQualifierTokens);
    const isHasSalaryInfo = this.isFoundMatches(body, this.SalaryQualifierTokens);

    // reasonably assume it has all info
    if (isHasLocationInfo && isHasSalaryInfo && body.length >= this.minTextLength) {
      return false;
    }

    return true;
  }

  getResponseMessagePayload(userWithMessage) {
    const { firstName, lastName, hostIdentityUrn, profilePictureRootUrl, conversationEntityUrn, messageElements } =
      userWithMessage;

    const [lastMsg] = messageElements;
    const textBodyToRespond = this.generateResponseText(this.myInfo.firstName, firstName);

    return {
      firstName,
      lastName,
      hostIdentityUrn,
      profilePictureRootUrl,
      conversationEntityUrn,
      body: textBodyToRespond,
      originToken: lastMsg.originToken,
    };
  }

  isFoundMatches(inputString, tokens, minMatches = 1) {
    const foundPatterns = getMatchedPatterns(inputString, tokens);
    return foundPatterns.length >= minMatches;
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

  generateResponseText(fromName, toName) {
    return `[This is an automated response]

Hi ${toName},

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
Feel free to checkout my github repo [To Recruiter, Yours respectfully]( https://github.com/yblee85/to-recruiter-yours-respectfully ) for more information.

Yours respectfully,
${fromName}
`;
  }
}

const getMatchedPatterns = (inputString, patterns) => {
  return patterns.filter((p) => new RegExp(p, 'i').test(inputString));
};

module.exports = { MessageResponder };
