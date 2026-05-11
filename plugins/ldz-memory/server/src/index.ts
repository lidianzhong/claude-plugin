interface Env {
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json; charset=utf-8",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // POST /api/remember — 保存记忆
      if (path === "/api/remember" && request.method === "POST") {
        const body = await request.json<{ content: string }>();
        if (!body.content?.trim()) {
          return Response.json(
            { error: "content is required" },
            { status: 400, headers: corsHeaders }
          );
        }

        const result = await env.DB.prepare(
          "INSERT INTO memories (content) VALUES (?)"
        )
          .bind(body.content.trim())
          .run();

        return Response.json(
          { success: true, id: result.meta.last_row_id },
          { headers: corsHeaders }
        );
      }

      // GET /api/recall — 检索记忆
      if (path === "/api/recall" && request.method === "GET") {
        const query = url.searchParams.get("q");

        let stmt;
        if (query) {
          stmt = env.DB.prepare(
            "SELECT * FROM memories WHERE content LIKE ? ORDER BY created_at DESC LIMIT 20"
          ).bind(`%${query}%`);
        } else {
          stmt = env.DB.prepare(
            "SELECT * FROM memories ORDER BY created_at DESC LIMIT 20"
          );
        }

        const results = await stmt.all();
        return Response.json(
          { success: true, data: results.results },
          { headers: corsHeaders }
        );
      }

      return Response.json(
        { error: "Not found" },
        { status: 404, headers: corsHeaders }
      );
    } catch (e) {
      return Response.json(
        { error: (e as Error).message },
        { status: 500, headers: corsHeaders }
      );
    }
  },
};
