interface Env {
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
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

      // GET /api/recall — 模糊检索记忆
      if (path === "/api/recall" && request.method === "GET") {
        const query = url.searchParams.get("q");

        let stmt;
        if (query) {
          // 将查询拆分为多个 token，支持中英文混合模糊搜索
          // 英文按空格/标点分词，中文按单字拆分
          const tokens: string[] = [];
          const parts = query.split(/[\s,，。.!！?？、]+/).filter(Boolean);
          for (const part of parts) {
            if (/[一-鿿]/.test(part)) {
              // 中文部分：逐字拆分 + 保留整体
              for (const ch of part) {
                tokens.push(ch);
              }
            }
            // 非中文部分（英文/数字）：作为整体 token
            const alpha = part.replace(/[一-鿿]/g, "").trim();
            if (alpha) {
              tokens.push(alpha);
            }
          }

          // 用 AND 连接所有 token，确保越具体匹配越精确
          const conditions = tokens.map(() => "content LIKE ?").join(" AND ");
          const bindings = tokens.map((t) => `%${t}%`);

          stmt = env.DB.prepare(
            `SELECT * FROM memories WHERE ${conditions} ORDER BY created_at DESC LIMIT 20`
          ).bind(...bindings);
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

      // DELETE /api/forget — 删除记忆
      if (path === "/api/forget" && request.method === "DELETE") {
        const id = url.searchParams.get("id");

        if (id) {
          await env.DB.prepare("DELETE FROM memories WHERE id = ?")
            .bind(parseInt(id))
            .run();
          return Response.json({ success: true, deleted: id }, { headers: corsHeaders });
        }

        const query = url.searchParams.get("q");
        if (query) {
          const result = await env.DB.prepare(
            "DELETE FROM memories WHERE content LIKE ?"
          )
            .bind(`%${query}%`)
            .run();
          return Response.json(
            { success: true, deleted_count: result.meta.changes },
            { headers: corsHeaders }
          );
        }

        return Response.json(
          { error: "id or q parameter is required" },
          { status: 400, headers: corsHeaders }
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
