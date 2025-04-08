import pytest
import pandas as pd
from io import BytesIO
from app import app
from api.delineation import calculate_heart_rate

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_calculate_heart_rate_normal():
    test_data = {
        "wave_type": ["QRS", "QRS", "QRS", "QRS", "QRS", "QRS", "QRS"],
        "wave_onset": [1000, 2000, 3000, 4000, 5000, 6500, 7250],
        "wave_offset": [1500, 2500, 3500, 4500, 5500, 7000, 7750]
    }
    df = pd.DataFrame(test_data)
    record_date_time = "2025-04-07T21:44:37"
    
    result = calculate_heart_rate(df, record_date_time)
    
    assert result["mean"] == 60.0
    assert result["min_hr"] == 40.0
    assert result["max_hr"] == 80.0
    assert result["min_time"] == "2025-04-07T21:44:43.500000" # 6500 ms from 21:44:37
    assert result["max_time"] == "2025-04-07T21:44:44.250000" # 7250 ms from 21:44:37

def test_calculate_heart_rate_short_rr_intervals():
    test_data = {
        "wave_type": ["QRS", "QRS", "QRS"],
        "wave_onset": [1000, 1050, 1100],
        "wave_offset": [1500, 1600, 1700]
    }
    df = pd.DataFrame(test_data)
    record_date_time = "2025-04-07T21:44:37"
    
    result = calculate_heart_rate(df, record_date_time)
    
    assert result["mean"] > 300  # Should be around 333.33
    assert result["max_hr"] > 300
    assert result["min_hr"] > 300

def test_process_delineation_endpoint(client):
    csv_data = "QRS,1000,1500\nQRS,2000,2500\nQRS,3000,3500\nQRS,4000,4500"

    data = {
        "file": (BytesIO(csv_data.encode()), "test.csv"),
        "record_date_time": "2025-04-07T21:44:37"
    }
    
    response = client.post('/api/v1/delineation', data=data)
    
    assert response.status_code == 200
    result = response.json
    assert result["mean"] == 60.0
    assert result["min_hr"] == 60.0
    assert result["max_hr"] == 60.0

def test_process_delineation_missing_file(client):
    data = {
        "record_date_time": "2025-04-07 21:44:37"
    }
    
    response = client.post("/api/v1/delineation", data=data)
    
    assert response.status_code == 400
    assert "error" in response.json
