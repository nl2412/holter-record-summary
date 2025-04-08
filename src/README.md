# Backend service
- Built using Flask 3.0
- Using Pandas for CSV parsing.
- Main logic in `/api/delineation.py` file.
  
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
