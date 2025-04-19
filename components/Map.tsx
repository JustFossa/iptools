import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef } from "react";

const icon = L.icon({
	iconUrl: "/images/marker-icon.png",
	shadowUrl: "/images/marker-shadow.png",
	iconSize: [40, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [60, 41],
});

export default ({
	lat,
	lon,
	city,
	country,
}: {
	lat: number;
	lon: number;
	city: string;
	country: string;
}) => {
	const mapRef = useRef<L.Map | null>(null);
	const mapContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (typeof window !== "undefined") {
			L.Marker.prototype.options.icon = icon;

			if (!mapRef.current) {
				mapRef.current = L.map(mapContainerRef.current!).setView(
					[lat, lon],
					13
				);
				L.tileLayer(
					`
                    https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
                `,
					{
						maxZoom: 19,
						attribution: "© OpenStreetMap",
					}
				).addTo(mapRef.current);

				L.marker([lat, lon])
					.addTo(mapRef.current)
					.bindPopup(`<b>${city}</b>, ${country}`)
					.openPopup();
			} else if (mapRef.current) {
				mapRef.current.setView([lat, lon], 13);

				mapRef.current.eachLayer((layer) => {
					if (layer instanceof L.Marker) {
						mapRef.current?.removeLayer(layer);
					}
				});
			}
			L.marker([lat, lon])
				.addTo(mapRef.current!)
				.bindPopup(`<b>${city}</b>, ${country}`)
				.openPopup();
		}
		return () => {
			if (mapRef.current) {
				mapRef.current.remove();
				mapRef.current = null;
			}
		};
	}, [lat, lon, city, country]);

	return <div ref={mapContainerRef} className="h-full w-full" />;
};
