import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { LatLngExpression, LeafletMouseEvent, Marker as LeafletMarker } from 'leaflet';

type MapPickerDialogProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (coords: { lat: number; lng: number }) => void;
  initialPosition?: { lat: number; lng: number };
  title?: string;
};

// Click handler component to update position on map click
function ClickCapture({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function MapPickerDialog({ open, onClose, onSelect, initialPosition, title = 'Choose on map' }: MapPickerDialogProps) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (open) {
      // Default center if none provided: somewhere central Europe
      const fallback = { lat: 54.6872, lng: 25.2797 };
      setPosition(initialPosition && isFinite(initialPosition.lat) && isFinite(initialPosition.lng) ? initialPosition : fallback);
    }
  }, [open, initialPosition]);

  // Use a DivIcon so we don't depend on image assets
  const markerIcon = useMemo(() => L.divIcon({
    className: 'map-picker-marker',
    html: `
      <div style="
        width: 26px; height: 26px;
        border-radius: 50%;
        background: #0d6efd;
        border: 3px solid white;
        box-shadow: 0 0 0 4px rgba(13,110,253,0.3);
      "></div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  }), []);

  const handleConfirm = () => {
    if (position) onSelect(position);
  };

  const center: LatLngExpression = position ? [position.lat, position.lng] : [54.6872, 25.2797];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{ sx: { borderRadius: '12px' } }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>{title}</DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ height: { xs: '60vh', md: '70vh' }, width: '100%' }}>
          {position && (
            <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ClickCapture onPick={(lat, lng) => setPosition({ lat, lng })} />
              <Marker
                position={[position.lat, position.lng]}
                draggable
                icon={markerIcon}
                eventHandlers={{
                  dragend: (e) => {
                    const marker = e.target as LeafletMarker;
                    const latlng = marker.getLatLng();
                    setPosition({ lat: latlng.lat, lng: latlng.lng });
                  },
                }}
              />
            </MapContainer>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button variant="contained" onClick={onClose} 
        sx={{ 
            borderRadius: '8px', 
            backgroundColor: '#DFDFDF', 
            color:"black", 
            transition: 'none',
            boxShadow: 'none',
             '&:hover': {
          boxShadow: 'none',
        },
        '&:active': {
          boxShadow: 'none',
        },
        }}>Cancel</Button>
        <Button variant="contained" onClick={handleConfirm} sx={{ borderRadius: '8px', backgroundColor: '#034C53', '&:hover': { backgroundColor: '#023a40' } }}>Choose</Button>
      </DialogActions>
    </Dialog>
  );
}

export default MapPickerDialog;
