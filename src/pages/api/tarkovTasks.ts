import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // JSONファイルのパス
    const filePath = path.join(process.cwd(), "src/data/tarkovTasks.json");

    // JSONファイルを読み込む
    const jsonData = fs.readFileSync(filePath, "utf8");
    const tasks = JSON.parse(jsonData);

    res.status(200).json(tasks);
  } catch (error) {
    console.error("タスクデータの読み込みに失敗:", error);
    res.status(500).json({ error: "Failed to load tasks" });
  }
}
