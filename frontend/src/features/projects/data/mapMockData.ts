import { FeatureCollection } from 'geojson';

export const projectGeoJSON: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'DOS-2026-01',
      properties: {
        reference: 'DOS-2026-01',
        client: 'Ahmed Mansour',
        status: 'En cours',
        type_travail: 'Levé Topographique',
        date: '2026-05-01',
        description: 'Levé de détails pour projet de construction villa.'
      },
      geometry: {
        type: 'Point',
        coordinates: [-7.5898, 33.5731] // Casablanca center
      }
    },
    {
      type: 'Feature',
      id: 'DOS-2026-02',
      properties: {
        reference: 'DOS-2026-02',
        client: 'Société IMMO-AL',
        status: 'Livré',
        type_travail: 'Bornage',
        date: '2026-04-15',
        description: 'Bornage contradictoire de la parcelle TF 4567/C.'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-7.5950, 33.5750],
          [-7.5920, 33.5755],
          [-7.5910, 33.5730],
          [-7.5940, 33.5725],
          [-7.5950, 33.5750]
        ]]
      }
    },
    {
      type: 'Feature',
      id: 'DOS-2026-03',
      properties: {
        reference: 'DOS-2026-03',
        client: 'Commune de Dar Bouazza',
        status: 'Suspendu',
        type_travail: 'Cadrage',
        date: '2026-03-20',
        description: 'Cadrage pour extension voirie zone Nord.'
      },
      geometry: {
        type: 'Point',
        coordinates: [-7.6100, 33.5850]
      }
    },
    {
      type: 'Feature',
      id: 'DOS-2026-04',
      properties: {
        reference: 'DOS-2026-04',
        client: 'Karim Bennani',
        status: 'Facturé',
        type_travail: 'Copropriété',
        date: '2026-04-30',
        description: 'Mise en copropriété immeuble R+4.'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-7.5850, 33.5700],
          [-7.5830, 33.5705],
          [-7.5820, 33.5690],
          [-7.5840, 33.5685],
          [-7.5850, 33.5700]
        ]]
      }
    }
  ]
};

export const cadastreGeoJSON: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { id: 'P01' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[-7.590, 33.578], [-7.588, 33.578], [-7.588, 33.576], [-7.590, 33.576], [-7.590, 33.578]]]
      }
    },
    {
      type: 'Feature',
      properties: { id: 'P02' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[-7.588, 33.578], [-7.586, 33.578], [-7.586, 33.576], [-7.588, 33.576], [-7.588, 33.578]]]
      }
    },
    {
      type: 'Feature',
      properties: { id: 'P03' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[-7.586, 33.578], [-7.584, 33.578], [-7.584, 33.576], [-7.586, 33.576], [-7.586, 33.578]]]
      }
    },
    {
      type: 'Feature',
      properties: { id: 'P04' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[-7.590, 33.576], [-7.588, 33.576], [-7.588, 33.574], [-7.590, 33.574], [-7.590, 33.576]]]
      }
    }
  ]
};

export const planAmenagementGeoJSON: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { zone: 'Residentielle', color: '#fbbf24' }, // Yellow
      geometry: {
        type: 'Polygon',
        coordinates: [[[-7.600, 33.580], [-7.580, 33.580], [-7.580, 33.560], [-7.600, 33.560], [-7.600, 33.580]]]
      }
    },
    {
      type: 'Feature',
      properties: { zone: 'Espace Vert', color: '#10b981' }, // Green
      geometry: {
        type: 'Polygon',
        coordinates: [[[-7.580, 33.575], [-7.570, 33.575], [-7.570, 33.565], [-7.580, 33.565], [-7.580, 33.575]]]
      }
    }
  ]
};
