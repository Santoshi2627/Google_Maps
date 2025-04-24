import React from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import MapWithSearch from './mapwithsearch';

import { Typography } from '@mui/material';
const libraries = ['places'];

function App() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script', // use the same id everywhere
    googleMapsApiKey: 'AIzaSyBj0vmJ9-7dp1D6-rpZIIXfNF3vNr_BQJ8',
    libraries: libraries,
  });

  return (
    <div>
      <Typography
  variant="h3"
  component="h1"
  sx={{
    fontWeight: 'bold',
    color: '#1976d2',
    textAlign: 'center',
    mt: 3,
    mb: 4,
    fontFamily: '"Segoe UI", Roboto, sans-serif',
    textShadow: '1px 1px 4px rgba(0,0,0,0.2)',
  }}
>
  GoLocate
</Typography>
      {isLoaded ? <MapWithSearch /> : <div>Loading Map...</div>}
    </div>
  );
}

export default App;
