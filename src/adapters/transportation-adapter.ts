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
  private readonly responseCache = new Map<string, { data: NormalizedResponseData; timestamp: number }>();
  private readonly CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours for AviationStack (500 req/mo budget ≈ 360 req/mo at 2h cache)

  constructor(logger: Logger = defaultLogger) {
    super(logger);
  }

  async transformResponse(
    _provider: ProviderAdapterConfig,
    response: UpstreamResponse,
  ): Promise<NormalizedResponseData> {
    const rawData = response.body as Record<string, unknown> ?? {};
    
    // Route based on which provider handled the request
    const providerName = _provider.name.toLowerCase();
    
    if (providerName.includes('aviationstack')) {
      const cacheKey = `aviationstack:flights`;
      const cached = this.responseCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL_MS) {
        return cached.data;
      }
      const result = await this.transformAviationStack(_provider, rawData);
      this.responseCache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    }
    if (providerName.includes('opensky')) {
      return this.transformOpenSky(_provider, rawData);
    }
    if (providerName.includes('tfl')) {
      return this.transformTfL(_provider, rawData);
    }
    if (providerName.includes('osrm')) {
      return this.transformOSRM(_provider, rawData);
    }
    if (providerName.includes('aviationstack')) {
      // AviationStack fell through to RoutePlanner - cache the fallback too
      const result = await this.transformLocalRoutePlanner(_provider, rawData);
      return result;
    }
    
    // Default: RoutePlanner (local) - extract params from echo response
    try {
      return await this.transformLocalRoutePlanner(_provider, rawData);
    } catch (e) {
      return {
        data: { legs: [], totalDurationMinutes: 0, totalDistanceKm: null, transfers: 0, fromSummary: 'Error', toSummary: 'Error', timestamp: new Date().toISOString(), provider: _provider.name },
        providerName: _provider.name,
      };
    }
  }

  private async transformOpenSky(
    _provider: ProviderAdapterConfig,
    rawData: Record<string, unknown>,
  ): Promise<NormalizedResponseData> {
    const states = rawData.states as unknown[][] ?? [];
    const flights: UniversalTransportLeg[] = [];
    
    for (const state of states.slice(0, 50)) {
      // OpenSky state format: [icao24, callsign, origin_country, time_position, last_contact,
      //                        longitude, latitude, baro_altitude, on_ground, velocity, heading, ...]
      const callsign = (state[1] as string ?? '').trim();
      const originCountry = state[2] as string ?? '';
      const longitude = state[5] as number ?? 0;
      const latitude = state[4] as number ?? 0;
      const altitude = state[7] as number ?? 0;
      const velocity = state[9] as number ?? 0;
      const heading = state[10] as number ?? 0;
      const onGround = state[8] as boolean ?? false;
      
      if (!callsign) continue;
      
      flights.push({
        mode: 'flight',
        operator: originCountry || null,
        routeName: callsign,
        fromName: 'Live position', fromCode: null,
        fromLat: latitude, fromLon: longitude,
        fromScheduledAt: null,
        toName: 'In flight', toCode: null,
        toLat: null, toLon: null,
        toScheduledAt: null,
        durationMinutes: 0,
        distanceKm: null,
        status: onGround ? 'active' : 'active',
        delayMinutes: null,
        details: `${callsign} at ${altitude.toFixed(0)}m ${velocity.toFixed(0)}m/s heading ${heading.toFixed(0)}°`,
      });
    }
    
    const journey: UniversalTransportJourney = {
      legs: flights,
      totalDurationMinutes: 0,
      totalDistanceKm: null,
      transfers: 0,
      fromSummary: 'Live airspace',
      toSummary: 'Live airspace',
      timestamp: new Date().toISOString(),
      provider: _provider.name,
    };
    
    return { data: journey, providerName: _provider.name };
  }

  private async transformTfL(
    _provider: ProviderAdapterConfig,
    rawData: Record<string, unknown>,
  ): Promise<NormalizedResponseData> {
    // TfL journey planner response
    const journeys = (rawData.journeys ?? [rawData]) as Record<string, unknown>[];
    const legs: UniversalTransportLeg[] = [];
    
    for (const journey of journeys.slice(0, 5)) {
      const legs_arr = (journey.legs ?? []) as Record<string, unknown>[];
      for (const leg of legs_arr) {
        const mode = (leg.mode as Record<string, unknown> ?? {}).name as string ?? 'unknown';
        const departure = leg.departureTime as string ?? null;
        const arrival = leg.arrivalTime as string ?? null;
        const duration = leg.duration as number ?? 0;
        const origin = (leg.origin as Record<string, unknown> ?? {}).commonName as string ?? 'Unknown';
        const destination = (leg.destination as Record<string, unknown> ?? {}).commonName as string ?? 'Unknown';
        const originLat = (leg.origin as Record<string, unknown> ?? {}).lat as number ?? null;
        const originLon = (leg.origin as Record<string, unknown> ?? {}).lon as number ?? null;
        const destLat = (leg.destination as Record<string, unknown> ?? {}).lat as number ?? null;
        const destLon = (leg.destination as Record<string, unknown> ?? {}).lon as number ?? null;
        
        const transportMode: UniversalTransportMode = 
          (mode === 'tube' || mode === 'train' || mode === 'overground' || mode === 'dlr' || mode === 'tflrail') ? 'train'
          : mode === 'bus' ? 'bus'
          : mode === 'river-bus' || mode === 'river-tour' ? 'ferry'
          : mode === 'walking' ? 'walking'
          : 'public_transport';
        
        legs.push({
          mode: transportMode,
          operator: 'TfL',
          routeName: (leg.line as Record<string, unknown> ?? {}).name as string ?? null,
          fromName: origin, fromCode: null, fromLat: originLat, fromLon: originLon, fromScheduledAt: departure,
          toName: destination, toCode: null, toLat: destLat, toLon: destLon, toScheduledAt: arrival,
          durationMinutes: Math.ceil(duration / 60),
          distanceKm: null,
          status: 'scheduled',
          delayMinutes: null,
          details: `${mode} from ${origin} to ${destination}`,
        });
      }
    }
    
    const journey: UniversalTransportJourney = {
      legs: legs.length > 0 ? legs : [{
        mode: 'public_transport', operator: 'TfL',
        routeName: null,
        fromName: 'London', fromCode: null, fromLat: null, fromLon: null, fromScheduledAt: null,
        toName: 'London', toCode: null, toLat: null, toLon: null, toScheduledAt: null,
        durationMinutes: 0, distanceKm: null, status: 'unknown', delayMinutes: null,
        details: 'TfL journey data',
      }],
      totalDurationMinutes: legs.reduce((s, l) => s + l.durationMinutes, 0),
      totalDistanceKm: null,
      transfers: Math.max(0, legs.length - 1),
      fromSummary: 'London',
      toSummary: 'London',
      timestamp: new Date().toISOString(),
      provider: _provider.name,
    };
    
    return { data: journey, providerName: _provider.name };
  }

  private async transformOSRM(
    _provider: ProviderAdapterConfig,
    rawData: Record<string, unknown>,
  ): Promise<NormalizedResponseData> {
    const routes = rawData.routes as Record<string, unknown>[] ?? [];
    const legs: UniversalTransportLeg[] = [];
    
    for (const route of routes) {
      const distanceKm = (route.distance as number ?? 0) / 1000;
      const durationMin = (route.duration as number ?? 0) / 60;
      
      legs.push({
        mode: 'driving',
        operator: 'OSRM',
        routeName: null,
        fromName: 'Origin', fromCode: null, fromLat: null, fromLon: null, fromScheduledAt: null,
        toName: 'Destination', toCode: null, toLat: null, toLon: null, toScheduledAt: null,
        durationMinutes: Math.ceil(durationMin),
        distanceKm: Math.round(distanceKm * 10) / 10,
        status: 'scheduled',
        delayMinutes: null,
        details: `OSRM route: ${distanceKm.toFixed(1)} km, ${Math.ceil(durationMin)} min`,
      });
    }
    
    const journey: UniversalTransportJourney = {
      legs: legs.length > 0 ? legs : [{
        mode: 'driving', operator: 'OSRM',
        routeName: null,
        fromName: 'Origin', fromCode: null, fromLat: null, fromLon: null, fromScheduledAt: null,
        toName: 'Destination', toCode: null, toLat: null, toLon: null, toScheduledAt: null,
        durationMinutes: 0, distanceKm: 0, status: 'unknown', delayMinutes: null,
        details: 'No route found',
      }],
      totalDurationMinutes: legs.reduce((s, l) => s + l.durationMinutes, 0),
      totalDistanceKm: legs.reduce((s, l) => s + (l.distanceKm ?? 0), 0),
      transfers: 0,
      fromSummary: 'Origin',
      toSummary: 'Destination',
      timestamp: new Date().toISOString(),
      provider: _provider.name,
    };
    
    return { data: journey, providerName: _provider.name };
  }

  private async transformAviationStack(
    _provider: ProviderAdapterConfig,
    rawData: Record<string, unknown>,
  ): Promise<NormalizedResponseData> {
    const flightData = rawData.data as Record<string, unknown>[] ?? [];
    const legs: UniversalTransportLeg[] = [];
    
    for (const flight of flightData.slice(0, 50)) {
      const dep = flight.departure as Record<string, unknown> ?? {};
      const arr = flight.arrival as Record<string, unknown> ?? {};
      const airline = flight.airline as Record<string, unknown> ?? {};
      const flightInfo = flight.flight as Record<string, unknown> ?? {};
      
      const depIata = dep.iata as string ?? '';
      const arrIata = arr.iata as string ?? '';
      const depTime = dep.scheduled as string ?? null;
      const arrTime = arr.scheduled as string ?? null;
      const depDelay = dep.delay as number ?? null;
      const arrDelay = arr.delay as number ?? null;
      const flightStatus = flight.flight_status as string ?? 'unknown';
      const depLat = dep.latitude as number ?? null;
      const depLon = dep.longitude as number ?? null;
      const arrLat = arr.latitude as number ?? null;
      const arrLon = arr.longitude as number ?? null;
      
      if (!depIata || !arrIata) continue;
      
      const flightNum = `${airline.iata ?? ''}${flightInfo.number ?? ''}`;
      
      let status: UniversalTransportStatus = 'scheduled';
      if (flightStatus === 'active') status = 'active';
      else if (flightStatus === 'landed') status = 'arrived';
      else if (flightStatus === 'cancelled') status = 'cancelled';
      else if (flightStatus === 'delayed') status = 'delayed';
      
      legs.push({
        mode: 'flight',
        operator: airline.name as string ?? null,
        routeName: flightNum || null,
        fromName: depIata, fromCode: depIata, fromLat: depLat, fromLon: depLon, fromScheduledAt: depTime,
        toName: arrIata, toCode: arrIata, toLat: arrLat, toLon: arrLon, toScheduledAt: arrTime,
        durationMinutes: 0,
        distanceKm: null,
        status,
        delayMinutes: (depDelay ?? arrDelay) as number | null,
        details: `${flightNum} ${depIata}→${arrIata} (${flightStatus})`,
      });
    }
    
    const journey: UniversalTransportJourney = {
      legs: legs.length > 0 ? legs : [{
        mode: 'flight', operator: 'AviationStack',
        routeName: null,
        fromName: 'Unknown', fromCode: null, fromLat: null, fromLon: null, fromScheduledAt: null,
        toName: 'Unknown', toCode: null, toLat: null, toLon: null, toScheduledAt: null,
        durationMinutes: 0, distanceKm: null, status: 'unknown', delayMinutes: null,
        details: 'No flight data available',
      }],
      totalDurationMinutes: 0,
      totalDistanceKm: null,
      transfers: 0,
      fromSummary: 'AviationStack',
      toSummary: 'AviationStack',
      timestamp: new Date().toISOString(),
      provider: _provider.name,
    };
    
    return { data: journey, providerName: _provider.name };
  }

  private async transformLocalRoutePlanner(
    _provider: ProviderAdapterConfig,
    rawData: Record<string, unknown>,
  ): Promise<NormalizedResponseData> {
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

    const availableModes = this.parseAvailableModes(_provider, echoParams);
    const journey = this.planner.planRoute({
      fromLat, fromLon, toLat, toLon,
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
