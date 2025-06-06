
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION, GEMINI_MODEL_NAME } from '../constants';

let ai: GoogleGenAI | null = null;
let chat: Chat | null = null;

const getApiKey = (): string => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable not set.");
  }
  return apiKey;
};

export const initializeChat = (): Chat => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: getApiKey() });
  }
  if (!chat) {
    chat = ai.chats.create({
      model: GEMINI_MODEL_NAME,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
       history: [ // Optional: Start with a greeting from the bot
        // {
        //   role: "user",
        //   parts: [{ text: "你好" }],
        // },
        // {
        //   role: "model",
        //   parts: [{ text: "你好呀！今天過得怎麼樣呢？有什麼想跟我分享的嗎？" }],
        // }
      ]
    });
  }
  return chat;
};

export const sendMessageToGemini = async (
  message: string,
  onStreamUpdate: (chunkText: string) => void,
  onStreamEnd: () => void
): Promise<void> => {
  try {
    const currentChat = initializeChat();
    const result = await currentChat.sendMessageStream({ message });

    let accumulatedText = "";
    for await (const chunk of result) { // chunk type is GenerateContentResponse
      const chunkText = chunk.text;
      if (chunkText) {
        accumulatedText += chunkText;
        onStreamUpdate(chunkText); // Send incremental chunk
      }
    }
    onStreamEnd(); // Signal that the stream has ended
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    if (error instanceof Error) {
        onStreamUpdate(`抱歉，我好像遇到了一些問題：${error.message}`);
    } else {
        onStreamUpdate("抱歉，我好像遇到了一些未知的問題。");
    }
    onStreamEnd();
  }
};
