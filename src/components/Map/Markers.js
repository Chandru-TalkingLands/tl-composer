import React, { useState, useRef, useEffect } from "react";
import { Marker, useMap } from "react-leaflet";
import { Icon, map } from "leaflet";
import Plot from '../Assets/Plot.svg';

// export const icon = new Icon({
//   iconUrl: "./glowing-dot.png",
//   iconSize: [50, 50],
// });

export const icon = new Icon({
  iconUrl: Plot,
  iconSize: [50, 50],
});


const center = [12.971599, 77.594566];

const Markers = (props) => {
  const markerRef = useRef(null);
  const [markerhide, setmarkerhide] = useState(false);
  const [pos, setpos] = useState([]);
  const [northtEastbound,setnorthtEastbound] = useState()
  const [southwestbound,setsouthwestbound] = useState()

  let map = useMap();

    map.addEventListener("click", (e) => {
      let bounds = map.getBounds();
      if(!northtEastbound && !southwestbound){
        setnorthtEastbound([bounds?._northEast.lat,bounds?._northEast.lng])
        setsouthwestbound([bounds?._southWest.lat,bounds?._southWest.lng])
      }
      setpos(e.latlng);
      setmarkerhide(true);
    });


  useEffect(() => {
    
    props.getmap(markerhide, pos, map,northtEastbound,southwestbound);
  },[pos]);
  //
  return (
    <div>
      <Marker position={center} ref={markerRef} icon={icon}></Marker>
    </div>
  );
};

export default Markers;