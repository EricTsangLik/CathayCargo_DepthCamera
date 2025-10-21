import base64

import cv2
import numpy as np
import valkey


def main():
    valkey_client = valkey.Valkey()
    stream_image_byte_string = valkey_client.get("stream_image")
    # byte string to image
    stream_image = cv2.imdecode(np.frombuffer(stream_image_byte_string, np.uint8), cv2.IMREAD_COLOR)
    cv2.imwrite("stream_image.png", stream_image)

if __name__ == "__main__":
    main()