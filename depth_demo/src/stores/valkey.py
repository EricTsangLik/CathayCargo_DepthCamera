import threading

import valkey

class ValkeyStore:
    _instance: "valkey.Valkey | None" = None
    _lock: threading.Lock = threading.Lock()

    @classmethod
    def get_valkey_client(cls) -> "valkey.Valkey":
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = valkey.Valkey()
        
        return cls._instance