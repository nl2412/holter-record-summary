# Backend service

- Built using Flask 3.0
- Used Pandas for CSV parsing.
- Main logic in `/api/delineation.py`.
- Host/Port of the API can be changed in `configuration.py`

## HOW TO RUN

### Install required dependencies

```
pip3 install -r requirements.txt
```

### Run the server

```
python3 app.py
```

### To run test

```
python3 -m pytest api/tests/test_delineation.py -v
```
