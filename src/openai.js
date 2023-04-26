import { Configuration, OpenAIApi } from "openai";
import config from "config";
import { createReadStream } from "fs";

class OpenAi {
  roles = {
    ASSISTANT: "assistant",
    USER: "user",
    SYSTEM: "system",
  };

  constructor(apiKey) {
    this.configuration = new Configuration({
      apiKey,
    });

    this.openai = new OpenAIApi(this.configuration);
  }

  async chat(messages) {
    try {
      const response = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages,
      });

      return response.data.choices[0].message;
    } catch (error) {
      console.log("error while gpt response:", error);
    }
  }

  async transcription(filepath) {
    try {
      const response = await this.openai.createTranscription(
        createReadStream(filepath),
        "whisper-1"
      );
      return response.data.text;
    } catch (error) {
      console.log("error while transcription:", error);
    }
  }
}

export const openai = new OpenAi(config.get("OPENAI_KEY"));
