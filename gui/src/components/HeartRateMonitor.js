import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Grid,
  TextField,
  useTheme,
} from "@mui/material";
import {
  FileUpload as FileUploadIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import Api from "../services/api";

const HeartRateMonitor = () => {
  const [heartRateData, setHeartRateData] = useState(null);
  const [file, setFile] = useState(null);
  const [recordDateTime, setRecordDateTime] = useState("");
  const [uploading, setUploading] = useState(false);
  const theme = useTheme();

  const dateFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  const handleAnalyseFile = async (e) => {
    const formData = new FormData();
    formData.append("file", file);
    if (recordDateTime) formData.append("record_date_time", recordDateTime);

    await Api.analyseDelineationFile(formData)
      .then((resp) =>
        setHeartRateData({
          mean: resp.data.mean,
          min: resp.data.min_hr,
          max: resp.data.max_hr,
          minTime: resp.data.min_time,
          maxTime: resp.data.max_time,
        })
      )
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setUploading(true);
    if (file) setFile(file);
    setUploading(false);
  };

  const handleSetRecordDateTime = (event) => {
    setHeartRateData(null);
    setRecordDateTime(event.target.value);
  };

  return (
    <Box
      sx={{
        p: 3,
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
      }}
    >
      <Card
        sx={{
          p: 3,
          mx: "auto",
          maxWidth: 800,
          boxShadow: 2,
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <MonitorHeartIcon sx={{ fontSize: 40, color: "red", mr: 2 }} />
            <Typography variant="h4" component="h1">
              Heart Rate Monitor
            </Typography>
          </Box>
          <Box sx={{ alignItems: "center", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                variant="contained"
                component="label"
                startIcon={
                  uploading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <FileUploadIcon />
                  )
                }
                sx={{
                  bgcolor: theme.palette.primary.main,
                  "&:hover": {
                    bgcolor: theme.palette.primary.dark,
                  },
                }}
              >
                Upload Delineation File
                <input
                  type="file"
                  hidden
                  accept=".csv"
                  onChange={handleFileSelect}
                  disabled={uploading}
                />
              </Button>
              {file && (
                <Typography variant="body2" color="text.secondary">
                  {file.name}
                </Typography>
              )}
            </Box>
          </Box>
          <Grid container spacing={3} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                variant="standard"
                label="Recording Date & Time (Optional)"
                type="datetime-local"
                value={recordDateTime}
                onChange={handleSetRecordDateTime}
                InputLabelProps={{
                  shrink: true,
                  style: {
                    overflow: "visible",
                  },
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={10} alignItems="center">
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                component="label"
                onClick={handleAnalyseFile}
                disabled={!file}
                sx={{
                  width: "100%",
                  bgcolor: theme.palette.primary.main,
                  "&:hover": {
                    bgcolor: theme.palette.primary.dark,
                  },
                }}
              >
                Analyse
              </Button>
            </Grid>
          </Grid>

          {heartRateData && (
            <Paper elevation={1} sx={{ p: 3, mt: 5 }}>
              <Grid container spacing={10}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6" gutterBottom>
                    Mean Heart Rate
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {heartRateData.mean} bpm
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6" gutterBottom>
                    Minimum Heart Rate
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {heartRateData.min} bpm
                  </Typography>
                  <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
                    <TimeIcon
                      fontSize="small"
                      sx={{ mr: 0.5, verticalAlign: "middle" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {recordDateTime === ""
                        ? `${heartRateData.minTime}`
                        : new Date(heartRateData.minTime).toLocaleString(
                            "en-GB",
                            dateFormatOptions
                          )}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6" gutterBottom>
                    Maximum Heart Rate
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {heartRateData.max} bpm
                  </Typography>
                  <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
                    <TimeIcon
                      fontSize="small"
                      sx={{ mr: 0.5, verticalAlign: "middle" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {recordDateTime === ""
                        ? `${heartRateData.maxTime}`
                        : new Date(heartRateData.maxTime).toLocaleString(
                            "en-GB",
                            dateFormatOptions
                          )}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default HeartRateMonitor;
