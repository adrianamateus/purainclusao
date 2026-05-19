const form = document.getElementById("formulario");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const nomePCD = document.getElementById("nome").value.trim();
  const idade = document.getElementById("idade").value.trim();
  const condicao = document.getElementById("condicao").value.trim();
  const sanguineo = document.getElementById("sanguineo").value.trim();
  const alergia = document.getElementById("alergia").value.trim();
  const nomeContato = document.getElementById("nomeContato").value.trim();
  const telContato = document.getElementById("telContato").value.trim();
  const obs = document.getElementById("obs").value.trim();

  const texto = `BEGIN:VCARD
VERSION:3.0
FN:${nomeContato}
TEL:${telContato}
NOTE:${nomePCD}\\nIdade: ${idade}\\nCondição: ${condicao}\\nTipo Sanguíneo: ${sanguineo}\\nAlergias: ${alergia}\\nObservações: ${obs}
END:VCARD`;

  // QR Code principal
  const qrDiv = document.getElementById("qrcode");
  qrDiv.innerHTML = "";
  QRCode.toCanvas(texto, { width: 300 }, function (error, canvas) {
    if (error) console.error(error);
    qrDiv.appendChild(canvas);
  });

  // QR Code do cartão de impressão
  const qrImprimir = document.getElementById("qrcode-imprimir");
  if (qrImprimir) {
    qrImprimir.innerHTML = "";
    QRCode.toCanvas(texto, { width: 150 }, function (error, canvas) {
      if (error) console.error(error);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      qrImprimir.appendChild(canvas);
    });
  }

  // Atualiza nome e condição no cartão QR
  const cardNome = document.getElementById("card-nome");
  const cardCondicao = document.getElementById("card-condicao");
  if (cardNome) cardNome.textContent = nomePCD;
  if (cardCondicao) cardCondicao.textContent = condicao;

  // Atualiza cartão de dados
  const campos = {
    "d-nome": nomePCD,
    "d-idade": idade,
    "d-condicao": condicao,
    "d-sanguineo": sanguineo,
    "d-alergia": alergia,
    "d-contato": nomeContato,
    "d-tel": telContato,
    "d-obs": obs,
  };

  for (const [id, valor] of Object.entries(campos)) {
    const el = document.getElementById(id);
    if (el) el.textContent = valor || "—";
  }
});

function imprimirDados() {
  const conteudo = document.getElementById("card-dados").outerHTML;
  const janela = window.open("", "_blank");
  janela.document.write(`
    <html><head><title>Cartão de Emergência</title>
    <style>
      @page { margin: 10mm; size: auto; }
      body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: flex-start; padding: 20px; margin: 0; }
      .card-dados { width: 200px; border: 2px dashed #e07b2c; border-radius: 12px; padding: 10px; font-size: 11px; color: #333; line-height: 1.6; display: inline-block; }
      .card-dados-titulo { font-size: 9px; font-weight: 700; color: #e07b2c; text-transform: uppercase; text-align: center; margin-bottom: 6px; }
      .card-dados-linha { margin-bottom: 2px; word-break: break-word; }
      .card-dados-linha strong { color: #123d8f; }
    </style></head><body>${conteudo}</body></html>
  `);
  janela.document.close();
  janela.print();
}
