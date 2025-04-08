from . import api_v1
from flask import request, jsonify
import pandas as pd
from datetime import datetime, timedelta


@api_v1.route("/delineation", methods=["POST"])
def process_delineation():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files.get("file")
    if not file.filename.lower().endswith(".csv"):
        return jsonify({"error": "File must be a CSV file"}), 400

    record_date_time = request.form.get("record_date_time")

    try:
        # 1st pass to get maximum columns the file can have
        file.stream.seek(0)
        max_columns = max(
            len(line.decode("utf-8").strip().split(",")) 
            for line in file.stream
        )
        column_names = ["wave_type", "wave_onset", "wave_offset"] + [f"wave_tag_{i}" for i in range(0, max_columns-1)]
        # 2nd pass to actually process the file content
        file.stream.seek(0)
        df = pd.read_csv(file, names=column_names, header=None)
    except Exception as e:
        return jsonify({"error": f"Failed to parse CSV file: {str(e)}"}), 400
    
    return jsonify(calculate_heart_rate(df, record_date_time))


def calculate_heart_rate(df, record_date_time):
    qrs_df = df[df["wave_type"] == "QRS"].copy()
    qrs_df.sort_values(by="wave_onset", inplace=True)

    # Convert onset from ms to seconds
    qrs_df["onset_s"] = qrs_df["wave_onset"] / 1000.0

    rr_intervals = qrs_df["onset_s"].diff().dropna()
    heart_rates = 60 / rr_intervals

    return {
        "mean": round(heart_rates.mean(), 2),
        "min_hr": round(heart_rates.min(), 2),
        "max_hr": round(heart_rates.max(), 2),
        "min_time": get_time_from_onset(qrs_df, heart_rates.idxmin(), record_date_time),
        "max_time": get_time_from_onset(qrs_df, heart_rates.idxmax(), record_date_time)
    }


def get_time_from_onset(qrs_df, row_idx, record_date_time):
    onset_time_s = qrs_df.loc[row_idx, "onset_s"]
    if record_date_time:
        record_dt = datetime.fromisoformat(record_date_time)
        return (record_dt + timedelta(seconds=onset_time_s)).isoformat()
    return f"{onset_time_s:.2f} seconds"