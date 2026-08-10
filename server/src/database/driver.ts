import neo4j, { Driver, Session, QueryResult, Record as Neo4jRecord, Integer } from 'neo4j-driver';
import { env } from '../config/env';

let driverInstance: Driver | null = null;

/**
 * Initialize or retrieve the singleton Neo4j Driver instance for CognoDB.
 */
export function getDriver(): Driver {
  if (!driverInstance) {
    const auth = neo4j.auth.basic(env.COGNODB_USERNAME, env.COGNODB_PASSWORD);
    
    driverInstance = neo4j.driver(env.COGNODB_URI, auth, {
      maxConnectionLifetime: 3 * 60 * 60 * 1000, // 3 hours
      maxConnectionPoolSize: 50,
      connectionAcquisitionTimeout: 20000, // 20s
      disableLosslessIntegers: true, // Auto-convert Neo4j integers to JS numbers
    });

    console.log(`🔌 Initialized CognoDB driver for URI: ${env.COGNODB_URI}`);
  }
  return driverInstance;
}

/**
 * Verify database connectivity.
 */
export async function verifyConnection(): Promise<{ connected: boolean; message: string; latencyMs?: number }> {
  const startTime = Date.now();
  try {
    const driver = getDriver();
    const serverInfo = await driver.getServerInfo();
    const latencyMs = Date.now() - startTime;
    return {
      connected: true,
      message: `Connected to CognoDB (${serverInfo.agent || 'Bolt Server'}) in ${latencyMs}ms`,
      latencyMs,
    };
  } catch (error: any) {
    return {
      connected: false,
      message: error?.message || 'Failed to connect to CognoDB',
    };
  }
}

/**
 * Gracefully close the driver instance.
 */
export async function closeDriver(): Promise<void> {
  if (driverInstance) {
    await driverInstance.close();
    driverInstance = null;
    console.log('🔌 Closed CognoDB driver connection.');
  }
}

/**
 * Helper to safely execute a parameterized openCypher query.
 */
export async function executeQuery<T = any>(
  cypher: string,
  params: Record<string, any> = {},
  transformRecord?: (record: Neo4jRecord) => T
): Promise<T[]> {
  const driver = getDriver();
  const session: Session = driver.session();

  try {
    const result: QueryResult = await session.run(cypher, params);
    if (transformRecord) {
      return result.records.map(transformRecord);
    }
    return result.records.map((r) => r.toObject() as unknown as T);
  } finally {
    await session.close();
  }
}

/**
 * Utility to unwrap Neo4j Node/Relationship properties and integer values.
 */
export function sanitizeGraphData(val: any): any {
  if (val === null || val === undefined) return val;
  if (typeof val === 'object' && val.toNumber && typeof val.toNumber === 'function') {
    return val.toNumber();
  }
  if (typeof val === 'object' && 'properties' in val) {
    return sanitizeGraphData(val.properties);
  }
  if (Array.isArray(val)) {
    return val.map(sanitizeGraphData);
  }
  if (typeof val === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      cleaned[k] = sanitizeGraphData(v);
    }
    return cleaned;
  }
  return val;
}
