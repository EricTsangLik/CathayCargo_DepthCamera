import fastapi
import uvicorn

import routers.dimension
import routers.capture

app = fastapi.FastAPI()
app.include_router(routers.dimension.router)
app.include_router(routers.capture.router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)