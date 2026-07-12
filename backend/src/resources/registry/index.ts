// Combined resource registry and path lookup.
import { ResourceDef } from '../resource.types';
import { factoryAccess } from './factory-access';
import { factoryPeople } from './factory-people';
import { factoryOperations } from './factory-operations';
import { factoryLogistics } from './factory-logistics';
import { manufacturing } from './manufacturing';
import { wages } from './wages';
import { wagesMwms } from './wages-mwms';

export const registry: ResourceDef[] = [
  ...factoryAccess,
  ...factoryPeople,
  ...factoryOperations,
  ...factoryLogistics,
  ...manufacturing,
  ...wages,
  ...wagesMwms,
];

export const registryByPath = new Map<string, ResourceDef>(
  registry.map((def) => [def.path, def]),
);
