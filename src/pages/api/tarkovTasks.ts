// src/pages/api/tarkovTasks.ts
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GETメソッドのみ許可する
  if (req.method !== "GET") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const response = await fetch("https://tarkov.dev/api/graphql", {
      method: "POST", // GraphQL のリクエストは POST メソッドを使用
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `{
          tasks {
            id
            name
            trader {
              name
            }
            minPlayerLevel
            objectives {
              description
            }
            taskRequirements {
              taskIds
            }
          }
        }`,
      }),
    });

    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
} catch (error) {
    if (error instanceof Error) {
      console.error("API Error:", error.message);
      res.status(500).json({ error: "Failed to fetch tasks", details: error.message });
    } else {
      console.error("Unknown error:", error);
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
}