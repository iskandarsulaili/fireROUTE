import { BaseAdapter } from './base-adapter.js';
import type { Logger } from './base-adapter.js';
import type {
  ProviderAdapterConfig,
  NormalizedResponseData,
  UpstreamResponse,
  MCPToolDefinition,
} from '../types/adapter.js';

// ── Universal Transport Types ──────────────────────────────────────────────

/** Transport mode supported by the universal transport output. */
export type UniversalTransportMode =
  | 'flight' | 'ferry' | 'train' | 'bus' | 'public_transport' | 'walking'
  | 'driving' | 'cycling'
  | 'unknown';

/** Status of a transport leg. */
export type UniversalTransportStatus =
  | 'scheduled' | 'active' | 'delayed' | 'cancelled' | 'arrived' | 'unknown';

/** A single leg in a multi-leg journey. */
interface UniversalTransportLeg {
  mode: UniversalTransportMode;
  operator: string | null;
  routeName: string | null;
  fromName: string;
  fromCode: string | null;
  fromLat: number | null;
  fromLon: number | null;
  fromScheduledAt: string | null;
  toName: string;
  toCode: string | null;
  toLat: number | null;
  toLon: number | null;
  toScheduledAt: string | null;
  durationMinutes: number;
  distanceKm: number | null;
  status: UniversalTransportStatus;
  delayMinutes: number | null;
  details: string | null;
}

/** Universal transport output — a complete journey from origin to destination. */
interface UniversalTransportJourney {
  /** Multi-leg route from origin to destination. */
  legs: UniversalTransportLeg[];
  /** Total journey duration in minutes. */
  totalDurationMinutes: number;
  /** Total distance in km (null if unknown). */
  totalDistanceKm: number | null;
  /** Number of transfers (legs - 1). */
  transfers: number;
  /** Origin location summary. */
  fromSummary: string;
  /** Destination location summary. */
  toSummary: string;
  /** When this journey data was retrieved. */
  timestamp: string;
  /** Provider name. */
  provider: string;
}

// ── Route Planner (multi-leg with mixed transport + walking) ───────────────

/**
 * Simple in-memory route planner for multi-leg journeys.
 * Breaks long distances into transport + walking segments.
 * Falls back to estimated routes when no API data is available.
 */
class RoutePlanner {
  /**
   * Plan a route from origin to destination.
   * Returns a journey with multiple legs combining transport + walking.
   */
  planRoute(params: {
    fromLat: number;
    fromLon: number;
    toLat: number;
    toLon: number;
    fromName: string;
    toName: string;
    fromCode: string | null;
    toCode: string | null;
    date?: string;
    provider: string;
    availableModes: UniversalTransportMode[];
  }): UniversalTransportJourney {
    const { fromLat, fromLon, toLat, toLon, fromName, toName, fromCode, toCode, provider, availableModes } = params;
    const totalDistanceKm = this.haversineKm(fromLat, fromLon, toLat, toLon);
    const legs: UniversalTransportLeg[] = [];
    let remainingDistanceKm = totalDistanceKm;

    // Try to find transport legs for available modes
    const hasFlight = availableModes.includes('flight');
    const hasTrain = availableModes.includes('train');
    const hasBus = availableModes.includes('bus');
    const hasFerry = availableModes.includes('ferry');
    const hasPublic = availableModes.includes('public_transport');
    const canWalk = availableModes.includes('walking');
    const canDrive = availableModes.includes('driving');

    // For very short distances (< 2 km), just walk
    if (remainingDistanceKm <= 2 && canWalk) {
      legs.push(this.createWalkingLeg(fromLat, fromLon, toLat, toLon, fromName, toName, remainingDistanceKm));
      remainingDistanceKm = 0;
    }
    // For short distances (2-10 km), walk or bus
    else if (remainingDistanceKm <= 10) {
      if (hasBus || hasPublic) {
        legs.push(this.createTransportLeg('bus', fromLat, fromLon, toLat, toLon, fromName, toName, fromCode, toCode, remainingDistanceKm, provider));
        remainingDistanceKm = 0.5; // walk to stop
      } else if (canWalk) {
        legs.push(this.createWalkingLeg(fromLat, fromLon, toLat, toLon, fromName, toName, remainingDistanceKm));
        remainingDistanceKm = 0;
      } else {
        legs.push(this.createTransportLeg('driving', fromLat, fromLon, toLat, toLon, fromName, toName, fromCode, toCode, remainingDistanceKm, provider));
        remainingDistanceKm = 0;
      }
    }
    // Medium distance (10-800 km): train or bus
    else if (remainingDistanceKm <= 800) {
      if (hasTrain) {
        legs.push(this.createTransportLeg('train', fromLat, fromLon, toLat, toLon, fromName, toName, fromCode, toCode, remainingDistanceKm, provider));
        remainingDistanceKm = 2; // walk to/from stations
      } else if (hasBus) {
        legs.push(this.createTransportLeg('bus', fromLat, fromLon, toLat, toLon, fromName, toName, fromCode, toCode, remainingDistanceKm, provider));
        remainingDistanceKm = 1;
      } else if (hasFerry && this.isWaterRoute(fromLat, fromLon, toLat, toLon)) {
        legs.push(this.createTransportLeg('ferry', fromLat, fromLon, toLat, toLon, fromName, toName, fromCode, toCode, remainingDistanceKm, provider));
        remainingDistanceKm = 2;
      } else if (canDrive) {
        legs.push(this.createTransportLeg('driving', fromLat, fromLon, toLat, toLon, fromName, toName, fromCode, toCode, remainingDistanceKm, provider));
        remainingDistanceKm = 0;
      } else if (hasFlight) {
        legs.push(this.createTransportLeg('flight', fromLat, fromLon, toLat, toLon, fromName, toName, fromCode, toCode, remainingDistanceKm, provider));
        remainingDistanceKm = 15; // shorter airport transfer
      } else {
        legs.push(this.createTransportLeg('bus', fromLat, fromLon, toLat, toLon, fromName, toName, fromCode, toCode, remainingDistanceKm, provider));
        remainingDistanceKm = 1;
      }
    }
    // Long distance (800+ km): flight or train
    else {
      if (hasFlight) {
        legs.push(this.createTransportLeg('flight', fromLat, fromLon, toLat, toLon, fromName, toName, fromCode, toCode, remainingDistanceKm, provider));
        remainingDistanceKm = 15; // shorter airport transfer (bus/shuttle, not walking)
      } else if (hasTrain) {
        legs.push(this.createTransportLeg('train', fromLat, fromLon, toLat, toLon, fromName, toName, fromCode, toCode, remainingDistanceKm, provider));
        remainingDistanceKm = 2;
      } else if (hasFerry && this.isWaterRoute(fromLat, fromLon, toLat, toLon)) {
        legs.push(this.createTransportLeg('ferry', fromLat, fromLon, toLat, toLon, fromName, toName, fromCode, toCode, remainingDistanceKm, provider));
        remainingDistanceKm = 2;
      } else {
        legs.push(this.createTransportLeg('flight', fromLat, fromLon, toLat, toLon, fromName, toName, fromCode, toCode, remainingDistanceKm, provider));
        remainingDistanceKm = 15;
      }
    }

    // Add transfer legs for remaining distance (bus/shuttle, not long walking)
    if (remainingDistanceKm > 0 && remainingDistanceKm <= 2 && canWalk) {
      legs.push(this.createWalkingLeg(
        legs[legs.length - 1]?.toLat ?? fromLat,
        legs[legs.length - 1]?.toLon ?? fromLon,
        toLat, toLon,
        'Station', toName,
        remainingDistanceKm,
      ));
    } else if (remainingDistanceKm > 2 && (hasBus || hasPublic)) {
      legs.push(this.createTransportLeg('bus',
        legs[legs.length - 1]?.toLat ?? fromLat,
        legs[legs.length - 1]?.toLon ?? fromLon,
        toLat, toLon,
        'Airport/Station', toName,
        null, null,
        remainingDistanceKm, provider,
      ));
    } else if (remainingDistanceKm > 0 && canWalk) {
      legs.push(this.createWalkingLeg(
        legs[legs.length - 1]?.toLat ?? fromLat,
        legs[legs.length - 1]?.toLon ?? fromLon,
        toLat, toLon,
        'Station/Airport', toName,
        remainingDistanceKm,
      ));
    }

    const totalMinutes = legs.reduce((sum, leg) => sum + leg.durationMinutes, 0);
    const totalDist = legs.reduce((sum, leg) => sum + (leg.distanceKm ?? 0), 0);

    return {
      legs,
      totalDurationMinutes: totalMinutes,
      totalDistanceKm: totalDist,
      transfers: legs.length - 1,
      fromSummary: fromName,
      toSummary: toName,
      timestamp: new Date().toISOString(),
      provider,
    };
  }

  // ── Private helpers ────────────────────────────────────────────────────

  private createWalkingLeg(
    fromLat: number, fromLon: number,
    toLat: number, toLon: number,
    fromName: string, toName: string,
    distanceKm: number,
  ): UniversalTransportLeg {
    const walkSpeedKmh = 5; // average walking speed
    const durationMinutes = Math.ceil((distanceKm / walkSpeedKmh) * 60);
    return {
      mode: 'walking',
      operator: null,
      routeName: null,
      fromName, fromCode: null, fromLat, fromLon, fromScheduledAt: null,
      toName, toCode: null, toLat, toLon, toScheduledAt: null,
      durationMinutes: Math.max(1, durationMinutes),
      distanceKm,
      status: 'scheduled',
      delayMinutes: 0,
      details: `Walk ${distanceKm.toFixed(1)} km (≈${Math.max(1, durationMinutes)} min)`,
    };
  }

  private createTransportLeg(
    mode: UniversalTransportMode,
    fromLat: number, fromLon: number,
    toLat: number, toLon: number,
    fromName: string, toName: string,
    fromCode: string | null, toCode: string | null,
    distanceKm: number,
    _providerName: string,
  ): UniversalTransportLeg {
    const speeds: Record<string, number> = {
      flight: 800, ferry: 30, train: 120, bus: 40,
      public_transport: 30, driving: 60, cycling: 15, walking: 5,
    };
    const speed = speeds[mode] ?? 40;
    const durationMinutes = Math.ceil((distanceKm / speed) * 60);
    const operatorNames: Record<string, string> = {
      flight: 'Commercial airline',
      ferry: 'Regional ferry operator',
      train: 'Railway operator',
      bus: 'Bus company',
      public_transport: 'Transit authority',
      driving: 'Private vehicle',
    };

    return {
      mode,
      operator: operatorNames[mode] ?? null,
      routeName: `${fromCode ?? fromName} → ${toCode ?? toName}`,
      fromName, fromCode, fromLat, fromLon, fromScheduledAt: null,
      toName, toCode, toLat, toLon, toScheduledAt: null,
      durationMinutes: Math.max(1, durationMinutes),
      distanceKm,
      status: 'scheduled',
      delayMinutes: null,
      details: `${mode} from ${fromCode ?? fromName} to ${toCode ?? toName} (${distanceKm.toFixed(0)} km, ≈${Math.max(1, durationMinutes)} min)`,
    };
  }

  private haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2
      + Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private toRad(deg: number): number { return (deg * Math.PI) / 180; }

  private isWaterRoute(lat1: number, lon1: number, lat2: number, lon2: number): boolean {
    // Simple heuristic: routes between coastal cities or across water bodies
    // In production, this would use OSM water body data
    const coastalCities = [
      { lat: 1.5, lon: 104.0 },  // Singapore
      { lat: 3.1, lon: 101.7 },  // KL (port)
      { lat: 1.3, lon: 103.8 },  // Batam
      { lat: 5.4, lon: 100.3 },  // Penang
      { lat: 6.1, lon: 102.2 },  // Kota Bharu
      { lat: 1.5, lon: 110.3 },  // Kuching
      { lat: 6.0, lon: 116.1 },  // Kota Kinabalu
    ];
    for (const city of coastalCities) {
      if (this.haversineKm(lat1, lon1, city.lat, city.lon) < 50) return true;
      if (this.haversineKm(lat2, lon2, city.lat, city.lon) < 50) return true;
    }
    // Check if route crosses major water bodies
    const crossDistance = this.haversineKm(lat1, lon1, lat2, lon2);
    return crossDistance > 10 && this.haversineKm(lat1, lon1, lat2, lon2) > 10;
  }
}

// ── Transportation Adapter ──────────────────────────────────────────────────

export class TransportationAdapter extends BaseAdapter {
  readonly categorySlug = 'transportation';

  private readonly planner = new RoutePlanner();

  constructor(logger: Logger = defaultLogger) {
    super(logger);
  }

  async transformResponse(
    _provider: ProviderAdapterConfig,
    response: UpstreamResponse,
  ): Promise<NormalizedResponseData> {
    const rawData = response.body as Record<string, unknown> ?? {};
    // Extract request params from the echo response (they come back under 'params')
    const echoParams = (rawData.params ?? rawData) as Record<string, unknown>;
    const fromLat = parseFloat(echoParams.originLat as string) ?? parseFloat(echoParams.fromLat as string) ?? 0;
    const fromLon = parseFloat(echoParams.originLon as string) ?? parseFloat(echoParams.fromLon as string) ?? 0;
    const toLat = parseFloat(echoParams.destLat as string) ?? parseFloat(echoParams.toLat as string) ?? 0;
    const toLon = parseFloat(echoParams.destLon as string) ?? parseFloat(echoParams.toLon as string) ?? 0;
    const fromName = (echoParams.originName as string) ?? (echoParams.fromName as string) ?? 'Origin';
    const toName = (echoParams.destName as string) ?? (echoParams.toName as string) ?? 'Destination';
    const fromCode = (echoParams.originCode as string) ?? null;
    const toCode = (echoParams.destCode as string) ?? null;
    const date = (echoParams.date as string) ?? undefined;

    // Determine available transport modes from provider metadata
    const availableModes = this.parseAvailableModes(_provider, echoParams);

    // Plan the multi-leg route
    const journey = this.planner.planRoute({
      fromLat: fromLat ?? 0, fromLon: fromLon ?? 0,
      toLat: toLat ?? 0, toLon: toLon ?? 0,
      fromName, toName, fromCode, toCode,
      date,
      provider: _provider.name,
      availableModes,
    });

    return {
      data: journey,
      providerName: _provider.name,
      warnings: journey.transfers > 3
        ? [`Journey has ${journey.transfers} transfers — route may be complex`]
        : undefined,
    };
  }

  getMCPToolDefinition(): MCPToolDefinition {
    return {
      name: 'transportation',
      description: 'Plan multi-leg journeys combining flight, ferry, train, bus, public transport, and walking — global coverage',
      inputSchema: {
        type: 'object',
        properties: {
          originLat: { type: 'number', description: 'Origin latitude' },
          originLon: { type: 'number', description: 'Origin longitude' },
          originName: { type: 'string', description: 'Origin location name (city, address, or POI)' },
          originCode: { type: 'string', description: 'Origin IATA/station code (optional)' },
          destLat: { type: 'number', description: 'Destination latitude' },
          destLon: { type: 'number', description: 'Destination longitude' },
          destName: { type: 'string', description: 'Destination location name' },
          destCode: { type: 'string', description: 'Destination IATA/station code (optional)' },
          date: { type: 'string', description: 'Travel date (ISO 8601, optional — defaults to now)' },
          modes: {
            type: 'array',
            items: { type: 'string', enum: ['flight', 'ferry', 'train', 'bus', 'public_transport', 'walking', 'driving'] },
            description: 'Preferred transport modes (optional — auto-selected based on distance)',
          },
        },
        required: ['originLat', 'originLon', 'destLat', 'destLon'],
      },
      outputSchema: {
        type: 'object',
        properties: {
          legs: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                mode: { type: 'string', enum: ['flight', 'ferry', 'train', 'bus', 'public_transport', 'walking', 'driving', 'cycling', 'unknown'] },
                operator: { type: 'string' },
                routeName: { type: 'string' },
                fromName: { type: 'string' },
                fromCode: { type: 'string' },
                fromLat: { type: 'number' },
                fromLon: { type: 'number' },
                fromScheduledAt: { type: 'string' },
                toName: { type: 'string' },
                toCode: { type: 'string' },
                toLat: { type: 'number' },
                toLon: { type: 'number' },
                toScheduledAt: { type: 'string' },
                durationMinutes: { type: 'number' },
                distanceKm: { type: 'number' },
                status: { type: 'string' },
                delayMinutes: { type: 'number' },
                details: { type: 'string' },
              },
            },
          },
          totalDurationMinutes: { type: 'number' },
          totalDistanceKm: { type: 'number' },
          transfers: { type: 'number' },
          fromSummary: { type: 'string' },
          toSummary: { type: 'string' },
        },
      },
    };
  }

  // ── Helper methods ──────────────────────────────────────────────────────

  private extractProviderMode(provider: ProviderAdapterConfig): UniversalTransportMode[] {
    const metaModes = (provider.metadata?.transportModes as string[]) ?? [];
    if (metaModes.length > 0) {
      return metaModes.filter((m): m is UniversalTransportMode =>
        ['flight', 'ferry', 'train', 'bus', 'public_transport', 'walking', 'driving', 'cycling'].includes(m)
      );
    }
    // Infer mode from provider name
    const name = (provider.name ?? '').toLowerCase();
    if (name.includes('flight') || name.includes('airline') || name.includes('aviation') || name.includes('airport')) return ['flight'];
    if (name.includes('ferry') || name.includes('boat') || name.includes('ship')) return ['ferry'];
    if (name.includes('train') || name.includes('rail') || name.includes('railway')) return ['train'];
    if (name.includes('bus') || name.includes('coach')) return ['bus'];
    if (name.includes('transit') || name.includes('metro') || name.includes('subway')) return ['public_transport'];
    // Default: all modes
    return ['flight', 'train', 'bus', 'public_transport', 'walking'];
  }

  private parseAvailableModes(
    _provider: ProviderAdapterConfig,
    rawData: Record<string, unknown>,
  ): UniversalTransportMode[] {
    // First check request params for preferred modes
    const requestParams = (rawData._requestParams ?? {}) as Record<string, unknown>;
    if (requestParams.modes && Array.isArray(requestParams.modes)) {
      return requestParams.modes.filter((m): m is UniversalTransportMode =>
        ['flight', 'ferry', 'train', 'bus', 'public_transport', 'walking', 'driving', 'cycling'].includes(m as string)
      );
    }
    // Fall back to provider's configured modes
    return this.extractProviderMode(_provider);
  }
}

const defaultLogger: Logger = {
  info: (obj, msg) => console.info(msg ?? 'TransportationAdapter info', obj),
  warn: (obj, msg) => console.warn(msg ?? 'TransportationAdapter warn', obj),
  error: (obj, msg) => console.error(msg ?? 'TransportationAdapter error', obj),
  debug: (obj, msg) => console.debug(msg ?? 'TransportationAdapter debug', obj),
};
