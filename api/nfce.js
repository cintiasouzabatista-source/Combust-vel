module.exports = async (req, res) => {
  try {
    const url = (req.query.url || "").toString();

    if (!url) {
      return res.status(400).json({ error: "Informe ?url=LINK_DA_NFCE" });
    }

    // aceita apenas NFC-e SP (evita abuso)
    const allowed = ["nfce.fazenda.sp.gov.br", "www.nfce.fazenda.sp.gov.br"];
    let host = "";
    try { host = new URL(url).host; } catch (_) {}

    if (!allowed.includes(host)) {
      return res.status(400).json({ error: "URL não permitida (use NFC-e SP).", host });
    }

    const r = await fetch(url, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari"
      }
    });

    const html = await r.text();

    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const pick = (re) => {
      const m = text.match(re);
      return m ? m[1].trim() : null;
    };

    const valorRaw =
      pick(/valor\s*total[^0-9]*([0-9]{1,3}(?:\.[0-9]{3})*,[0-9]{2})/i) ||
      pick(/total[^0-9]*r?\$?\s*([0-9]{1,3}(?:\.[0-9]{3})*,[0-9]{2})/i);

    const litrosRaw =
      pick(/([0-9]{1,3},[0-9]{3,4})\s*l\b/i) ||
      pick(/\bqtde[^0-9]*([0-9]{1,3},[0-9]{3,4})\b/i);

    const tipoRaw = pick(/\b(gasolina[^ ]*|etanol|álcool)\b/i);

    const dataHoraRaw =
      pick(/\b(\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}(?::\d{2})?)\b/) ||
      pick(/\b(\d{2}\/\d{2}\/\d{4})\b/);

    const normalizeBR = (s) => (s ? Number(s.replace(/\./g, "").replace(",", ".")) : null);

    const tipo =
      tipoRaw
        ? (tipoRaw.toLowerCase().includes("etanol") || tipoRaw.toLowerCase().includes("álcool") ? "Etanol" : "Gasolina")
        : null;

    return res.status(200).json({
      ok: true,
      normalized: {
        valor: normalizeBR(valorRaw),
        litros: normalizeBR(litrosRaw),
        tipo,
        dataHora: dataHoraRaw || null
      },
      extracted: {
        valorRaw, litrosRaw, tipoRaw, dataHoraRaw
      }
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
};
