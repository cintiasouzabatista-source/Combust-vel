export default async function handler(req, res) {
  try {
    const url = (req.query.url || "").toString();

    if (!url) {
      return res.status(400).json({ error: "Informe ?url=LINK_DA_NFCE" });
    }

    // Segurança básica: só aceitar URL da consulta NFC-e/SP (ajuste se precisar)
    const allowed = [
      "nfce.fazenda.sp.gov.br",
      "www.nfce.fazenda.sp.gov.br"
    ];
    let host = "";
    try { host = new URL(url).host; } catch { /* ignore */ }

    if (!allowed.includes(host)) {
      return res.status(400).json({
        error: "URL não permitida. Use um link de consulta da NFC-e (SP).",
        host
      });
    }

    // Buscar a página (server-side na Vercel)
    const resp = await fetch(url, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari"
      }
    });

    const html = await resp.text();
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // Helpers
    const pick = (re) => {
      const m = text.match(re);
      return m ? m[1].trim() : null;
    };

    // Tentativas de extração (varia conforme layout da página)
    const valor =
      pick(/valor\s*total[^0-9]*([0-9]{1,3}(?:\.[0-9]{3})*,[0-9]{2})/i) ||
      pick(/total[^0-9]*r?\$?\s*([0-9]{1,3}(?:\.[0-9]{3})*,[0-9]{2})/i);

    const litros =
      pick(/([0-9]{1,3},[0-9]{3,4})\s*l\b/i) || // ex: 8,8180 L
      pick(/\bqtde[^0-9]*([0-9]{1,3},[0-9]{3,4})\b/i);

    const tipo =
      pick(/\b(gasolina[^ ]*|etanol|álcool)\b/i);

    const dataHora =
      pick(/\b(\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}(?::\d{2})?)\b/) ||
      pick(/\b(\d{2}\/\d{2}\/\d{4})\b/);

    // Normalização (BR -> padrão numérico)
    const normalizeBR = (s) =>
      s ? Number(s.replace(/\./g, "").replace(",", ".")) : null;

    return res.status(200).json({
      ok: true,
      extracted: {
        valor_raw: valor,
        litros_raw: litros,
        tipo_raw: tipo,
        dataHora_raw: dataHora
      },
      normalized: {
        valor: normalizeBR(valor),
        litros: normalizeBR(litros),
        tipo: tipo ? (tipo.toLowerCase().includes("etanol") || tipo.toLowerCase().includes("álcool") ? "Etanol" : "Gasolina") : null,
        dataHora: dataHora || null
      }
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: "Falha ao consultar NFC-e",
      detail: String(err?.message || err)
    });
  }
}
