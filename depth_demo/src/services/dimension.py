import valkey

import stores.valkey

class DimensionService:
    @staticmethod  
    def get_dimension() -> dict[str, float]:
        valkey_client: valkey.Valkey = stores.valkey.ValkeyStore().get_valkey_client()
        
        height: float = float(valkey_client.get("height"))
        width: float = float(valkey_client.get("width"))
        length: float = float(valkey_client.get("length"))
        
        return {
            "height": height,
            "width": width,
            "length": length
        }
    