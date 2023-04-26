import axios from "axios";
import { createWriteStream } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import ffmpeg from "fluent-ffmpeg";
import installer from "@ffmpeg-installer/ffmpeg";
import { removeFile } from "./utils.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

class OggConverter {
  constructor() {
    ffmpeg.setFfmpegPath(installer.path);
  }

  toMp3(input, output) {
    try {
      const outputPath = resolve(dirname(input), `${output}.mp3`);
      return new Promise((res, rej) => {
        ffmpeg(input)
          .inputOption("-t 30")
          .output(outputPath)
          .on("end", async () => {
            await removeFile(input);
            res(outputPath);
          })
          .on("error", (e) => rej(e.message))
          .run();
      });
    } catch (error) {
      console.log("error:", error);
    }
  }

  async create(url, filename) {
    try {
      const oggPath = resolve(__dirname, "../voices", `${filename}.ogg`);
      const response = await axios({
        method: "get",
        url,
        responseType: "stream",
      });

      return new Promise((res) => {
        const stream = createWriteStream(oggPath);
        response.data.pipe(stream);

        stream.on("finish", () => res(oggPath));
      });
    } catch (error) {
      console.log("Creating error ", error);
    }
  }
}

export const ogg = new OggConverter();
