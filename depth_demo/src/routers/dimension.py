import fastapi

import services.dimension

router = fastapi.APIRouter()

@router.get("/dimension")
async def get_dimension():
    return services.dimension.DimensionService.get_dimension()