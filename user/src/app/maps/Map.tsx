"use client";
import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import envConfig from "@/config";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useMapStore } from "@/stores/useMapStore";

const MapComponent = () => {
  const center: [number, number] = [105.8423624, 20.9991199];
  const zoom = 15;
  const initialZoom = 13;
  const mapKey = envConfig.NEXT_PUBLIC_MAP_KEY;
  const mapUrl = envConfig.NEXT_PUBLIC_MAP_URL;
  const route = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { sidebarOpen, coordinateVenues } = useMapStore();
  const venueIdSelected = useMapStore((state) => state.venueIdSelected);
  const [perVenueIdSelected, setPerVenueIdSelected] = useState<string | null>();

  const mapRef = useRef<maplibregl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const venueIdSelectedRef = useRef<string | null>(venueIdSelected);
  const typeSportIdRef = useRef<string | null>(null);

  useEffect(() => {
    const venueSelected = coordinateVenues?.find(
      (coord) => coord.id === perVenueIdSelected
    );
    if (venueIdSelectedRef.current) {
      const container = document.getElementById(venueIdSelectedRef.current);
      container
        ?.querySelector("div")
        ?.style.setProperty(
          "background-image",
          `url('/marker/marker_${typeSportIdRef.current}.png')`
        );
    }
    venueIdSelectedRef.current = venueSelected?.id ?? null;
    typeSportIdRef.current = venueSelected?.type ?? null;
  }, [perVenueIdSelected]);

  useEffect(() => {
    setPerVenueIdSelected(venueIdSelected);
    console.log("🚀 ~ useEffect ~ venueIdSelected:", venueIdSelected);

    if (venueIdSelected !== null && coordinateVenues) {
      const venueSelected = coordinateVenues.find(
        (coord) => coord.id === venueIdSelected
      );
      const container = document.getElementById(venueIdSelected);
      container
        ?.querySelector("div")
        ?.style.setProperty("background-image", `url('/marker/local-red.png')`);
      setTimeout(() => {
        mapRef.current?.flyTo({
          center: { lat: venueSelected!.lat, lng: venueSelected!.lng },
          zoom,
        });
      }, 500);
    }
  }, [venueIdSelected]);

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ coordinateVenues:", coordinateVenues);
    if (coordinateVenues !== null) {
      setIsLoading(true);

      // Remove all existing markers
      const markers = document.querySelectorAll(".maplibregl-marker");
      markers.forEach((marker) => marker.remove());

      if (mapRef.current) {
        addMarkers(coordinateVenues ?? [], mapRef.current);
      }
    }
  }, [coordinateVenues]);

  const createButtonControl = (
    textContent: string,
    handleClick: () => void
  ): maplibregl.IControl => {
    const customButton = document.createElement("button");
    Object.assign(customButton.style, {
      backgroundColor: "#3498ff",
      color: "white",
      padding: "10px",
      borderRadius: "100%",
      cursor: "pointer",
      width: "50px",
      height: "50px",
      fontSize: "24px",
      textAlign: "center",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    });
    customButton.textContent = textContent;
    customButton.addEventListener("click", handleClick);

    return {
      onAdd: () => {
        const container = document.createElement("div");
        container.className = "maplibregl-ctrl";
        container.appendChild(customButton);
        return container;
      },
      onRemove: () => {
        customButton.parentNode?.removeChild(customButton);
      },
    } as maplibregl.IControl;
  };

  const createCustomMarker = (
    coord: CoordinateVenue,
    map: maplibregl.Map
  ): HTMLDivElement => {
    const container = document.createElement("div");
    container.id = coord.id;
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.alignItems = "center";

    const el = document.createElement("div");
    Object.assign(el.style, {
      backgroundImage: `url('/marker/marker_${coord.type}.png')`,
      width: "40px",
      height: "40px",
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      cursor: "pointer",
    });

    const label = document.createElement("span");
    Object.assign(label.style, {
      width: "120px",
      marginTop: "5px",
      fontSize: "12px",
      lineHeight: "1.2",
      textAlign: "center",
      display: "none",
      cursor: "pointer",
      color: "#3498ff",
      textShadow: `
        0 0 4px white,
        -2px -2px 0 white,
         2px -2px 0 white,
        -2px  2px 0 white,
         2px  2px 0 white,
        -3px 0 0 white,
         3px 0 0 white,
         0 -3px 0 white,
         0  3px 0 white
      `,
    });
    label.textContent = coord.name;

    map.on("zoom", () => {
      label.style.display = map.getZoom() >= zoom - 1 ? "block" : "none";
    });

    const handleClick = () => {
      if (venueIdSelectedRef.current) {
        const container = document.getElementById(venueIdSelectedRef.current);
        container
          ?.querySelector("div")
          ?.style.setProperty(
            "background-image",
            `url('/marker/marker_${typeSportIdRef.current}.png')`
          );
      }
      route.push(`/maps?id=${coord.id}`);
      setPerVenueIdSelected(coord.id);
      el.style.backgroundImage = `url('/marker/local-red.png')`;
      setTimeout(() => {
        map.flyTo({ center: { lat: coord.lat, lng: coord.lng }, zoom });
      }, 500);
    };

    el.addEventListener("click", handleClick);
    label.addEventListener("click", handleClick);

    container.appendChild(label);
    container.appendChild(el);
    return container;
  };

  const addMarkers = (coords: CoordinateVenue[], map: maplibregl.Map): void => {
    coords.forEach((coord) => {
      new maplibregl.Marker({
        element: createCustomMarker(coord, map),
      })
        .setLngLat([coord.lng, coord.lat])
        .addTo(map);
    });
  };

  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      const currentCenter = coordinateVenues?.find(
        (coord) => coord.id === venueIdSelected
      );
      mapRef.current = new maplibregl.Map({
        container: mapContainerRef.current,
        style: `${mapUrl}/goong_map_web.json?api_key=${mapKey}`,
        center: currentCenter ? [currentCenter.lng, currentCenter.lat] : center,
        zoom: initialZoom,
      });

      mapRef.current.on("styledata", () => {
        const layers = mapRef.current!.getStyle().layers;
        if (layers) {
          const filteredLayers = layers.filter(
            (layer) => !layer.id.includes("poi")
          );
          const style = mapRef.current!.getStyle();
          style.layers = filteredLayers;
          mapRef.current!.setStyle(style);
        }
      });

      mapRef.current.on("load", () => {
        addMarkers(coordinateVenues ?? [], mapRef.current!);
        if (venueIdSelected) {
          const container = document.getElementById(venueIdSelected);
          container
            ?.querySelector("div")
            ?.style.setProperty(
              "background-image",
              `url('/marker/local-red.png')`
            );
          setPerVenueIdSelected(venueIdSelected);
        }
      });

      mapRef.current.addControl(
        createButtonControl("-", () => mapRef.current!.zoomOut()),
        "bottom-right"
      );

      mapRef.current.addControl(
        createButtonControl("+", () => mapRef.current!.zoomIn()),
        "bottom-right"
      );
      mapRef.current.addControl(
        createButtonControl("📍", () => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                mapRef.current!.flyTo({
                  center: [longitude, latitude],
                  zoom,
                });

                // Add a marker for the current location
                const currentLocationMarker = new maplibregl.Marker({
                  color: "red",
                })
                  .setLngLat([longitude, latitude])
                  .addTo(mapRef.current!);
              },
              (error) => {
                console.error("Error getting location:", error);
                alert("Unable to retrieve your location.");
              }
            );
          } else {
            alert("Geolocation is not supported by your browser.");
          }
        }),
        "bottom-right"
      );
    }
  }, [center, zoom, mapKey, mapUrl]);

  return (
    <div
      className={cn(
        "h-full w-full bg-gray-100",
        sidebarOpen && "w-[calc(100%-600px)] right-0 absolute"
      )}
    >
      {isLoading && (
        <div ref={mapContainerRef} className="relative h-full w-full"></div>
      )}
    </div>
  );
};

export default MapComponent;
