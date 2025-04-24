import React, { useState, useCallback, useRef } from 'react';
import {
  GoogleMap,
  Marker,
} from '@react-google-maps/api';
import {
  TextField,
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Snackbar,
  IconButton,
  InputAdornment,
  Modal,
  Fade,
  Backdrop,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: 37.7749,
  lng: -122.4194,
};

function MapWithSearch() {
  const [map, setMap] = useState(null);
  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [distance, setDistance] = useState(5000);
  const [type, setType] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const inputRef = useRef();

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleSearch = () => {
    if (!query) {
      setSnackbarMessage('Please enter a search query.');
      setOpenSnackbar(true);
      return;
    }
    if (!type) {
      setSnackbarMessage('Please select a place type.');
      setOpenSnackbar(true);
      return;
    }
    if (!map) return;

    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      query,
      fields: ['name', 'geometry', 'rating', 'types', 'vicinity'],
      location: map.getCenter(),
      radius: distance,
      type: type || undefined,
    };

    service.textSearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const filteredPlaces = results.filter((place) => place.rating >= rating);
        setPlaces(filteredPlaces);
        if (filteredPlaces[0]?.geometry?.location) {
          map.panTo(filteredPlaces[0].geometry.location);
        }
      }
    });
  };

  const handleMarkerClick = (place) => {
    setSelectedPlace(place);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box p={3}>
      {/* Search and Filter Section */}
      <Box display="flex" gap={2} mb={2} justifyContent="center">
        <TextField
          inputRef={inputRef}
          label="Search places"
          variant="outlined"
          fullWidth
          onChange={(e) => setQuery(e.target.value)}
          sx={{ width: '300px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={handleSearch} edge="start">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ width: '160px' }}>
          <InputLabel>Rating</InputLabel>
          <Select value={rating} onChange={(e) => setRating(e.target.value)} label="Rating">
            {[0, 1, 2, 3, 4, 5].map((r) => (
              <MenuItem key={r} value={r}>
                {r} & above
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ width: '160px' }}>
          <InputLabel>Distance</InputLabel>
          <Select value={distance} onChange={(e) => setDistance(e.target.value)} label="Distance">
            {[1000, 2000, 5000, 10000].map((d) => (
              <MenuItem key={d} value={d}>
                {d / 1000} km
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ width: '180px' }}>
          <InputLabel>Type</InputLabel>
          <Select value={type} onChange={(e) => setType(e.target.value)} label="Type">
            <MenuItem value="">Select</MenuItem>
            <MenuItem value="restaurant">Restaurant</MenuItem>
            <MenuItem value="cafe">Cafe</MenuItem>
            <MenuItem value="bar">Bar</MenuItem>
            <MenuItem value="supermarket">Supermarket</MenuItem>
            <MenuItem value="tourist_attraction">Famous Place</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Map Display */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {places.map((place, idx) => (
          <Marker
            key={idx}
            position={place.geometry.location}
            title={place.name}
            onClick={() => handleMarkerClick(place)}
          />
        ))}
      </GoogleMap>

      {/* Modal for selected place */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={openModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #1976d2',
              boxShadow: 24,
              borderRadius: 4,
              p: 4,
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                color: '#1976d2',
                textShadow: '1px 1px 2px #00000033',
                fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
              }}
            >
              {selectedPlace?.name}
            </Typography>
            {/* <Typography variant="body1" sx={{ mb: 1 }}>
              📍 <strong>Address:</strong> {selectedPlace?.vicinity}
            </Typography> */}
            <Typography variant="body1" sx={{ mb: 1 }}>
              ⭐ <strong>Rating:</strong> {selectedPlace?.rating}
            </Typography>
            <Typography variant="body1">
              🏷️ <strong>Types:</strong> {selectedPlace?.types.join(', ')}
            </Typography>
            <Box mt={3} textAlign="right">
              <Button
                variant="contained"
                onClick={handleCloseModal}
                sx={{ borderRadius: 2, backgroundColor: '#1976d2' }}
              >
                Close
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* Snackbar for alerts */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
}

export default MapWithSearch;
