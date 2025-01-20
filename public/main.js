document.getElementById("convertBtn").addEventListener("click", async () => {
  const videoUrl = document.getElementById("videoUrl").value;
  const status = document.getElementById("status");
  const downloadLink = document.getElementById("downloadLink");

  if (!videoUrl) {
    alert("Por favor, ingresa una URL de YouTube.");
    return;
  }

  status.textContent = "Convirtiendo el video, por favor espera...";
  downloadLink.style.display = "none";

  try {
    const response = await fetch("/convert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoUrl })
    });

    if (!response.ok) {
      throw new Error("Error al convertir el video.");
    }

    const data = await response.json();
    status.textContent = "Conversión completada. ¡Listo para descargar!";
    downloadLink.href = data.downloadPath;
    downloadLink.textContent = "Descargar Audio";
    downloadLink.style.display = "block";
  } catch (error) {
    console.error(error);
    status.textContent = "Hubo un error al convertir el video.";
  }
});
