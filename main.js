const API_URL = "http://127.0.0.1:5001";

async function cargarEjemplos() {
    const examplesContainer = document.getElementById("examples-container");
    try {
        const res = await fetch(`${API_URL}/examples`);
        const data = await res.json();

        examplesContainer.innerHTML = "<p><strong>Canciones de ejemplo:</strong></p>";
        const ul = document.createElement("ul");
        
        data.forEach(item => {
            const li = document.createElement("li");
            li.textContent = `${item.title} - ${item.artist}`;
            li.addEventListener("click", () => {
                document.getElementById("query").value = item.title;
                obtenerRecomendaciones(item.title);
            });
            ul.appendChild(li);
        });
        
        examplesContainer.appendChild(ul);
    } catch (error) {
        console.error("Error al obtener ejemplos:", error);
        examplesContainer.innerHTML = "<p>Error al cargar ejemplos del servidor.</p>";
    }
}

async function obtenerRecomendaciones(cancion) {
    const resultsContainer = document.getElementById("results-container");
    resultsContainer.innerHTML = "<p class='mensaje'>Buscando recomendaciones...</p>";

    try {
        const res = await fetch(`${API_URL}/recommendations?query=${cancion}`, {
            method: 'POST'
        });
        const data = await res.json();

        resultsContainer.innerHTML = "";

        if (data.message) {
            resultsContainer.innerHTML = `<p class='mensaje'>${data.message}</p>`;
            return;
        }

        const titulo = document.createElement("h2");
        titulo.textContent = `Recomendaciones para "${cancion}":`;
        resultsContainer.appendChild(titulo);

        const ul = document.createElement("ul");
        data.forEach(rec => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${rec.title}</strong> <span>(${rec.artist})</span>`;
            ul.appendChild(li);
        });

        resultsContainer.appendChild(ul);

    } catch (error) {
        console.error("Error al obtener recomendaciones:", error);
        resultsContainer.innerHTML = "<p class='mensaje'>Ocurrió un error al conectar con el servidor web.</p>";
    }
}

document.getElementById("query").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const busqueda = event.target.value.trim();
        if (busqueda !== "") {
            obtenerRecomendaciones(busqueda);
        }
    }
});

document.addEventListener("DOMContentLoaded", cargarEjemplos);