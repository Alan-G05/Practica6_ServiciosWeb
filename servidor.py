import pickle

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

print("Servidor: Cargando modelo en memoria")
pkl_path = "../similarity.pkl"
with open(pkl_path, "rb") as archivo:
    datos = pickle.load(archivo)

df_g = datos["df"]
sim_g = datos["similares"]
print("Servidor: Modelo cargado")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def root():
    return {"Hello": "World"}

@app.get("/examples")
def nombres_ejemplo():
    prueba = df_g.sample(5)
    example_names = []
    for song, artist in zip(prueba["song"], prueba["artist"]):
        example_names.append({
            "title": song,
            "artist": artist
        })
    return example_names

@app.post("/recommendations")
async def get_recommendations(query: str):
    if not query or query.strip() == "":
        return {
            "message": "La búsqueda no puede estar vacía."
        }

    cancion = df_g[df_g["song"].str.lower() == query.lower().strip()]
    if cancion.empty:
        return {
            "message": "Esta canción aún no se encuentra en la biblioteca."
        }
    indice = cancion.index[0]

    distance = sorted(list(enumerate(sim_g[indice])), reverse = True, key = lambda x: x[1])
    recommendations = []

    for s_id in distance[1:6]:
        title = df_g.iloc[s_id[0]]['song']
        artist = df_g.iloc[s_id[0]]['artist']
        recommendations.append({
            "title": title,
            "artist": artist
        })
    
    return recommendations