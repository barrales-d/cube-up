import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Players: a.model({
      username: a.string().required(),
      highscore: a.float().required(),
      achievedAt: a.date().default(new Date().toISOString())
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});