import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import {
  TextField,
  Box,
//   Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  IconButton,
  InputAdornment,
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
      <Box display="flex" gap={2} mb={4} justifyContent="center" flexWrap="wrap">
        {/* Search Input */}
        <TextField
          inputRef={inputRef}
          label="Search places"
          variant="outlined"
          fullWidth
          onChange={(e) => setQuery(e.target.value)}
          sx={{
            width: { xs: '100%', sm: '300px' },
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            '& .MuiInputBase-root': {
              paddingRight: '12px',
            },
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: '#1976d2',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
              },
            },
          }}
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

        {/* Rating Dropdown */}
        <FormControl sx={{ width: { xs: '100%', sm: '160px' }, borderRadius: '12px' }}>
          <InputLabel>Rating</InputLabel>
          <Select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            label="Rating"
            sx={{
              '& .MuiSelect-root': {
                borderRadius: '12px',
                backgroundColor: '#f5f5f5',
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                },
                '&.Mui-focused': {
                  backgroundColor: '#fff',
                },
              },
            }}
          >
            {[0, 1, 2, 3, 4, 5].map((r) => (
              <MenuItem key={r} value={r}>
                {r} & above
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Distance Dropdown */}
        <FormControl sx={{ width: { xs: '100%', sm: '160px' }, borderRadius: '12px' }}>
          <InputLabel>Distance</InputLabel>
          <Select
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            label="Distance"
            sx={{
              '& .MuiSelect-root': {
                borderRadius: '12px',
                backgroundColor: '#f5f5f5',
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                },
                '&.Mui-focused': {
                  backgroundColor: '#fff',
                },
              },
            }}
          >
            {[1000, 2000, 5000, 10000].map((d) => (
              <MenuItem key={d} value={d}>
                {d / 1000} km
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Type Dropdown */}
        <FormControl sx={{ width: { xs: '100%', sm: '160px' }, borderRadius: '12px' }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            label="Type"
            sx={{
              '& .MuiSelect-root': {
                borderRadius: '12px',
                backgroundColor: '#f5f5f5',
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                },
                '&.Mui-focused': {
                  backgroundColor: '#fff',
                },
              },
            }}
          >
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

      {/* Tailwind Modal for selected place */}
      {selectedPlace && openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">{selectedPlace.name}</h2>
            <p className="mb-2">
              📍 <strong>Address:</strong> {selectedPlace.vicinity}
            </p>
            <p className="mb-2">
              ⭐ <strong>Rating:</strong> {selectedPlace.rating}
            </p>
            <p className="mb-2">
              🏷️ <strong>Types:</strong> {selectedPlace.types.join(', ')}
            </p>
            <div className="mt-4 text-right">
              <button
                onClick={handleCloseModal}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
