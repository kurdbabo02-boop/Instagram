
import { GoogleGenAI, Chat } from "@google/genai";

export class GeminiChatService {
  private ai: GoogleGenAI;
  private chat!: Chat;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    this.updateSystemInstruction("You are a friendly friend chatting on Instagram. Keep your responses short, informal, and engaging. Use emojis occasionally.");
  }

  public updateSystemInstruction(instruction: string) {
    this.chat = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: instruction,
      },
    });
  }

  async sendMessage(message: string): Promise<string> {
    try {
      const response = await this.chat.sendMessage({ message });
      return response.text || "Sorry, I couldn't think of a response.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Something went wrong. Let's try again later!";
    }
  }

  async *sendMessageStream(message: string) {
    try {
      const stream = await this.chat.sendMessageStream({ message });
      for await (const chunk of stream) {
        yield chunk.text;
      }
    } catch (error) {
      console.error("Gemini Streaming Error:", error);
      yield "Oops, I hit a snag while typing.";
    }
  }
}

export const geminiService = new GeminiChatService();
