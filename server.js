const express = require("express");
const youtubedl = require("youtube-dl-exec");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.post("/convert", express.json(), (req, res) => {
  const { videoUrl } = req.body;

  if (!videoUrl) {
    return res.status(400).json({ error: "URL no proporcionada" });
  }

  const outputFileName = `audio-${Date.now()}.mp3`; // Nombre único para el archivo
  const outputPath = path.join(__dirname, "downloads", outputFileName);

  youtubedl(videoUrl, {
    extractAudio: true,
    audioFormat: "mp3",
    output: outputPath
  })
    .then(() => {
      console.log("Conversión completada:", outputFileName);
      res.json({ downloadPath: `/${outputFileName}` });
    })
    .catch((err) => {
      console.error("Error al convertir el video:", err);
      res.status(500).json({ error: "Error al convertir el video" });
    });
});

app.get("/:file", (req, res) => {
  const file = req.params.file;
  const filePath = path.join(__dirname, "downloads", file);

  if (fs.existsSync(filePath)) {
    res.download(filePath, (err) => {
      if (err) {
        console.error("Error al enviar el archivo:", err);
      }
      // Eliminar el archivo después de enviarlo
      fs.unlinkSync(filePath);
    });
  } else {
    res.status(404).send("Archivo no encontrado");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
