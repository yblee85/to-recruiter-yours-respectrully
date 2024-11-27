const MeAPIResponseMock = {
  "plainId": 12345,
  "miniProfile": {
    "firstName": "Air",
    "lastName": "Jordan",
    "dashEntityUrn": "urn:li:fsd_profile:AbCDEfG",
    "occupation": "Software Engineer",
    "objectUrn": "urn:li:member:12345",
    "entityUrn": "urn:li:fs_miniProfile:AbCDEfG",
    "backgroundImage": {
      "com.linkedin.common.VectorImage": {
        "rootUrl": "https://media.licdn.com/dms/image/v2/ABBCDSFJLSD/profile-displaybackgroundimage-shrink_"
      }
    },
    "publicIdentifier": "air-jordan",
    "picture": {
      "com.linkedin.common.VectorImage": {
        "artifacts": [],
        "rootUrl": "https://media.licdn.com/dms/image/v2/BCDSLKJLKJDSF/profile-displayphoto-shrink_"
      }
    },
  },
};

const generateConverationParticipant = (firstName, lastName, headline, distance) => {
  const rand = crypto.randomUUID();
  const hostIdentityUrn = `urn:li:fsd_profile:${rand}`;
  const entityUrn = `urn:li:msg_messagingParticipant:${rand}`

  return {
    hostIdentityUrn,
    entityUrn,
    "participantType": {
      "member": {
        "profileUrl": `https://www.linkedin.com/in/${crypto.randomUUID()}`,
        "firstName": {
          "text": firstName,
        },
        "lastName": {
          "text": lastName,
        },
        "profilePicture": {
          "rootUrl": `https://media.licdn.com/dms/image/v2/${crypto.randomUUID()}/profile-displayphoto-shrink_`
        },
        "distance": distance,
        "headline": {
          "text": headline,
        }
      },
    },
  };
};

let participantMySelf = generateConverationParticipant("Air", "Jordan", "Software Engineer", "SELF");
participantMySelf.hostIdentityUrn = MeAPIResponseMock.miniProfile.dashEntityUrn;

let participantWC = generateConverationParticipant("White", "Chocolate", "Technical Recruiter", "DISTANCE_3");
let participantVin = generateConverationParticipant("Vin", "Sanity", "Technical Recruiter", "DISTANCE_3");
let participantKJ = generateConverationParticipant("King", "James", "Talent Acquisition", "DISTANCE_2");
let participantStock = generateConverationParticipant("J", "Stock", "Talent Acquisition", "DISTANCE_1");

let badMessage = `Hi,

Any chance you're open to a new job opportunity?

We are looking for a senior software engineer for their Payments team. I was impressed with your profile and thought you'd be a great fit! They're onsite 2-3 days a week in downtown. 

If you're keen, please share a word version of your resume & select a time here for a brief call.

Looking forward to hearing from you!`.replace(/\n/g, "\\n");

let goodMessage = `Hi,

I wanted to reach out to you for a role as a Senior Full Stack Developer with one of our healthtech clients in downtown, offering a SaaS platform that integrates seamlessly with third-party healthcare centers. I was impressed with your profile and thought you'd be a great fit!

In this role, you’ll work closely with a dedicated product manager, designers, and developers in an agile environment, focusing 70% on frontend and 30% on backend. The ideal candidate has a strong foundation in the MERN stack (React, Node.js, Express, MongoDB) and thrives in an independent, self-sufficient role.

This is a remote-first role with occasional in-office meetups and events, offering a base salary up to $190k, 3 weeks PTO, and benefits.

If you’re interested, please send me your updated resume and let me know what is the best email and times to reach you at this week!

Cheers`.replace(/\n/g, "\\n");

const mockConversation = (
  myself = participantMySelf,
  other = participantWC,
  subject = "✊🏼 Opportunity Knocking",
  bodyTxt = badMessage,
  messageFrom = other
) => {
  const conversationId = crypto.randomUUID();

  return {
    "notificationStatus": "ACTIVE",
    "conversationParticipants": [myself, other],
    "lastActivityAt": 1732222382884,
    "createdAt": 1732222382004,
    "lastReadAt": 1732222405727,
    "hostConversationActions": [],
    "entityUrn": `urn:li:msg_conversation:(${myself.hostIdentityUrn},${conversationId})`,
    "categories": ["INBOX", "PRIMARY_INBOX"],
    "state": "PENDING",
    "messages": {
      "elements": [
        {
          "subject": subject,
          "body": {
            "text": bodyTxt,
          },
          "backendUrn": `urn:li:messagingMessage:${conversationId}`,
          "deliveredAt": 1732222382835,
          "actor": {
            "hostIdentityUrn": messageFrom.hostIdentityUrn,
          },
          "entityUrn": `urn:li:msg_message:(${myself.hostIdentityUrn},${conversationId})`,
          "conversation": {
            "entityUrn": `urn:li:msg_conversation:(${myself.hostIdentityUrn},${conversationId})`
          }
        }
      ]
    },
  };
};

const ConversationBadMessageMock = mockConversation();

const ConversationGoodMessageMock = mockConversation(participantMySelf, participantStock, "", bodyTxt = goodMessage,);

const ConversationSponsoredMock = { ...mockConversation(participantMySelf, participantVin), ...{contentMetadata: {conversationAdContent: "something"}} };

const ConversationArchivedMock = { ...mockConversation(participantMySelf, participantKJ), ...{categories: ["ARCHIVED"]} };

const ConversationsAPIResponseMock = {
  data: {
    messengerConversationsBySyncToken: {
      elements: [
        ConversationBadMessageMock,
        ConversationGoodMessageMock,
        ConversationSponsoredMock,
        ConversationArchivedMock,
      ]
    }
  }
};

module.exports = { MeAPIResponseMock, ConversationsAPIResponseMock };
