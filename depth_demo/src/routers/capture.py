import fastapi

import services.capture

router = fastapi.APIRouter()

@router.get("/capture")
async def capture() -> str:
    return services.capture.CaptureService.get_capture_image()

@router.get("/capture/streaming")
async def capture_streaming(request: fastapi.Request) -> str:
    return fastapi.responses.StreamingResponse(
        services.capture.CaptureService.get_capture_streaming(request),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )
