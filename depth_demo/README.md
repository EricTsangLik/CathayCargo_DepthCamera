2025-10-18:
- Added backend to serve the following
    - dimensions
    - capture image
    - capture video (streaming)

Split up the service:
- Start docker compose for Valkey:
    - go to depth_demo folder:
    - docker compose up -d

- Start depth camera processing:
    - go to src/depth folder:
    - enter command: poetry run py .\main.py

- Start backend command:
    - go to src folder:
    - enter command: poetry run py .\main.py