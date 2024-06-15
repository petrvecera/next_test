// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  data: any
};


const fetchWithReader = async (url: string) => {
  const response = await fetch(url);
  const reader = response.body?.getReader();
  const decoder = new TextDecoder("utf-8");

  let buffer = "";
  let lines: string[] = [];

  while (lines.length < 10 && reader) {
    const { value, done } = await reader.read();
    if (done) break;

    // Decode and append to buffer
    buffer += decoder.decode(value || new Uint8Array(), { stream: true });

    // Split the buffer into lines
    const splitBuffer = buffer.split("},");

    // Save the last part of the current buffer for the next iteration
    buffer = splitBuffer.pop() || "";

    // Add the complete lines to our lines array
    lines.push(...splitBuffer);

    // If we have more than 10 lines, truncate the array
    if (lines.length >= 10) {
      lines = lines.slice(0, 10);
      break;
    }
  }


  return lines
};



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {


 const url = "https://microsoftedge.github.io/Demos/json-dummy-data/5MB.json";

  const data = await fetchWithReader(url);


  res.status(200).json({ data: data });
}
