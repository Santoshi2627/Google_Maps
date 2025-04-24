import React from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import MapWithSearch from './mapwithsearch';


const libraries = ['places'];

function App() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script', // use the same id everywhere
    googleMapsApiKey: 'AIzaSyBj0vmJ9-7dp1D6-rpZIIXfNF3vNr_BQJ8',
    libraries: libraries,
  });

  return (
    <div>
      {isLoaded ? <MapWithSearch /> : <div>Loading Map...</div>}
    </div>
  );
}

export default App;
