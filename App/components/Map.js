import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import MapView, {Marker} from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc'
import { selectDestination, selectOrigin, setTravelTimeInformation } from '../slices/navSlice';
import MapViewDirections from 'react-native-maps-directions';
import {GOOGLE_MAPS_APIKEY} from "@env"

const Map = () => {
    const origin = useSelector(selectOrigin);
    const destination = useSelector(selectDestination);
    const mapRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(()=>{
        if(!origin || !destination) return;

        const getTravelTime = async() =>{
            fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.description}&destinations=${destination.description}&key=${GOOGLE_MAPS_APIKEY}`
            ).then((res) => res.json()).then(data=>{
                dispatch(setTravelTimeInformation(data.rows[0].elements[0]))
            })
        };

        getTravelTime();
    }, [origin, destination, GOOGLE_MAPS_APIKEY])

  return (
    <MapView
        ref = {mapRef}
        style={tw`flex-1`}
        mapType='Standard'
        initialRegion={{
            latitude: origin.location.lat,
            longitude: origin.location.lng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
        }}
        onLayout={()=>{
            mapRef.current.fitToSuppliedMarkers(['origin', 'destination'],{
                edgePadding: {top:100,left:100,right:100, bottom:100}
            })
        }}
    >
        {origin && destination && (
            <MapViewDirections
                origin = {origin.description}
                destination = {destination.description}
                apikey = { GOOGLE_MAPS_APIKEY }
                strokeWidth = {3}
                strokeColor= "black"

                onLayout={()=>{
                    mapRef.current.fitToSuppliedMarkers(['origin', 'destination'],{
                        edgePadding: {top:100,left:100,right:100, bottom:100}
                    })
                }}
            />
        )}

        {origin?.location && (
            <Marker
                coordinate={{
                    latitude: origin.location.lat,
                    longitude: origin.location.lng,
                }}
                title = "Origin"
                description={origin.description}
                identifier = "origin"
            />
        )}

        {destination?.location && (
            <Marker
                coordinate={{
                    latitude: destination.location.lat,
                    longitude: destination.location.lng,
                }}
                title = "Destination"
                description={destination.description}
                identifier = "destination"
            />
        )}
    </MapView>
  );
};

export default Map

const styles = StyleSheet.create({})