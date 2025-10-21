import base64
import io
import time
import asyncio

import fastapi
import valkey

import stores.valkey


class CaptureService:
    @staticmethod
    def get_capture_image() -> str:
        valkey_client: valkey.Valkey = stores.valkey.ValkeyStore().get_valkey_client()
        
        stream_image_base64_string: str = valkey_client.get("stream_image")

        return stream_image_base64_string

    @staticmethod
    async def get_capture_streaming(request: fastapi.Request):
        while True:
            try:
                if await request.is_disconnected():
                    break

                base64_string = CaptureService.get_capture_image()
                stream = io.BytesIO(base64.b64decode(base64_string)).getvalue()
                
                yield (
                    b'--frame\r\n'
                    b'Content-Type: image/jpeg\r\n\r\n' + stream + b'\r\n'
                )

                await asyncio.sleep(0.01)

            except ConnectionResetError as e:
                print("ConnectionResetError")