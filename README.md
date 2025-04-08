# holter-record-summary

Holter Record Summary

A normal heartbeat produces three entities on the ECG — a P wave, a QRS complex, a T wave.
https://en.wikipedia.org/wiki/Electrocardiography#Theory
Identifying those entities in a signal is called delineation.

Here are CSV of an algorithm output for a 24h ECG: https://cardiologs-
public.s3.amazonaws.com/python-interview/record.csv

Rows have the following fields:
 Wave type: P, QRS, T, or INV (invalid)
 Wave onset: Start of the wave in ms
 Wave offset: End of the wave in ms
 Optionally, a list of wave tags
Write a simple application, including a web interface and an HTTP server with the following
functionalities:

1. Providing the following measurements to a physician when a delineation file is uploaded on the app
   with a POST /delineation request:
    The mean heart rate of the recording (Frequency at which QRS complexes appear).
    The minimum and maximum heart rate, each with the time at which they happened.
2. [BONUS QUESTION] Providing a possibility to set up the date and the time of the recording, as they
   are not included in the file. This should impact the date and the time seen in the measurements.


# NAIVE ASSUMPTIONS
- Users will upload file directly from their local storage (not from urls, etc.).
- Output of the algorithm for a 24h ECG will always be in a CSV type file.


# OUT-OF-SCOPE
- Deployment of backend and frontend service.
- Usage for list of wave tags.


# HOW TO RUN

This project was built using:

- Python: 3.9.6
- Node: v23.11.0
- Npm: 10.9.2
- Flask for backend. React for frontend.

## Backend

- Will run on port 8081.

- From parent directory:

```
cd src
pip3 install -r requirements.txt
python3 app.py
```

## Frontend

- Will run on port 3000.

- From parent directory:

```
cd gui
npm install
npm start
```

# HOW TO USE

- Upload file using UPLOAD DELINEATION FILE from the interface.
- Setup the recording date (optional).
- Press ANALYSE.
- Required infomations will be displayed.
