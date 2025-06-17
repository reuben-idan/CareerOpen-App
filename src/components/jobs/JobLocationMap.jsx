import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MapPinIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { analytics } from "../../services/analytics";

const JobLocationMap = ({ jobs }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Load Google Maps script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => setMapLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !jobs) return;

    const map = new window.google.maps.Map(document.getElementById("map"), {
      zoom: 4,
      center: { lat: 37.0902, lng: -95.7129 }, // Center of US
      styles: [
        {
          featureType: "all",
          elementType: "labels.text.fill",
          stylers: [{ color: "#7c93a3" }, { lightness: "-10" }],
        },
        {
          featureType: "administrative",
          elementType: "labels.text.fill",
          stylers: [{ color: "#444444" }],
        },
        {
          featureType: "landscape",
          elementType: "all",
          stylers: [{ color: "#f2f2f2" }],
        },
        {
          featureType: "poi",
          elementType: "all",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "road",
          elementType: "all",
          stylers: [{ saturation: "-100" }, { lightness: "45" }],
        },
        {
          featureType: "road.highway",
          elementType: "all",
          stylers: [{ visibility: "simplified" }],
        },
        {
          featureType: "road.arterial",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "all",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "water",
          elementType: "all",
          stylers: [{ color: "#46bcec" }, { visibility: "on" }],
        },
      ],
    });

    const markers = jobs.map((job) => {
      const marker = new window.google.maps.Marker({
        position: { lat: job.latitude, lng: job.longitude },
        map,
        title: job.title,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#4F46E5",
          fillOpacity: 0.7,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });

      marker.addListener("click", () => {
        setSelectedLocation(job);
        analytics.track("view_job_location", {
          jobId: job.id,
          location: job.location,
        });
      });

      return marker;
    });

    return () => {
      markers.forEach((marker) => marker.setMap(null));
    };
  }, [mapLoaded, jobs]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Job Locations
        </h2>

        <div className="relative h-[500px] rounded-lg overflow-hidden">
          <div id="map" className="w-full h-full" />

          {selectedLocation && (
            <div className="absolute top-4 right-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">
                    {selectedLocation.title}
                  </h3>
                  <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <BuildingOfficeIcon className="flex-shrink-0 mr-1.5 h-5 w-5" />
                    {selectedLocation.company}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5" />
                  {selectedLocation.location}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <BriefcaseIcon className="flex-shrink-0 mr-1.5 h-5 w-5" />
                  {selectedLocation.type}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <CurrencyDollarIcon className="flex-shrink-0 mr-1.5 h-5 w-5" />
                  {selectedLocation.salary}
                </div>
              </div>

              <div className="mt-4">
                <Link
                  to={`/jobs/${selectedLocation.id}`}
                  className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  View Job Details
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          <p>
            Click on a marker to view job details. {jobs.length} jobs available
            across {new Set(jobs.map((job) => job.location)).size} locations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobLocationMap;
