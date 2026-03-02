import type { UserType } from "@/app/(auth)/auth";
import type { ChatModel } from "./models";

type Entitlements = {
  maxMessagesPerDay: number;
  maxTTSPerDay: number;
  maxCallsPerDay: number;
  availableChatModelIds: ChatModel["id"][];
};
 
export const entitlementsByUserType: Record<UserType, Entitlements> = {
  /*
   * For users without an account
   */
  guest: {
    maxMessagesPerDay: 10,
    maxTTSPerDay: 5,
    maxCallsPerDay: 1,
    availableChatModelIds: ["chat-model", "chat-model-reasoning"],
  },
 
  /*
   * For users with an account
   */
  regular: {
    maxMessagesPerDay: 50,
    maxTTSPerDay: 20,
    maxCallsPerDay: 5,
    availableChatModelIds: ["chat-model", "chat-model-reasoning"],
  },
 
  /*
   * TODO: For users with an account and a paid membership
   */
};

