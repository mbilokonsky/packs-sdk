import type {PackDefinition} from '../types';
import type {PackFormatMetadata} from '../compiled_types';
import type {PackFormulaMetadata} from '../api';
import type {PackMetadata} from '../compiled_types';
import type {PackSyncTable} from '../compiled_types';
import type {TypedStandardFormula} from '../api';

// Used to avoid needing promises when exporting fake `PackMetadata`s.
export interface FakePackDefinition extends Omit<PackDefinition, 'formulas'> {
  formulas?: TypedStandardFormula[];
}

export function fakeDefinitionToDefinition(def: FakePackDefinition): PackDefinition {
  return def;
}

export function fakeDefinitionToMetadata(def: FakePackDefinition): PackMetadata {
  const {
    formulas: originalFormulas,
    defaultAuthentication: originalDefaultAuthentication,
    formats: originalFormats,
    syncTables: originalSyncTables,
    ...packMetadata
  } = def;

  const formulas: PackFormulaMetadata[] = originalFormulas!.map(formula => {
    const {execute, ...formulaMetadata} = formula;
    return formulaMetadata;
  });

  const formats: PackFormatMetadata[] = [];
  for (const {matchers, ...format} of originalFormats || []) {
    formats.push({...format, matchers: (matchers || []).map(m => m.toString())});
  }

  let defaultAuthentication: PackMetadata['defaultAuthentication'] = originalDefaultAuthentication;
  if (
    originalDefaultAuthentication &&
    'getConnectionName' in originalDefaultAuthentication &&
    originalDefaultAuthentication.getConnectionName
  ) {
    const {execute, ...connNameFormula} = originalDefaultAuthentication.getConnectionName;
    defaultAuthentication = {
      ...originalDefaultAuthentication,
      getConnectionName: {...connNameFormula},
    };
  }
  const syncTables: PackSyncTable[] = [];
  for (const {getter, getSchema, ...others} of originalSyncTables || []) {
    const {execute, ...otherGetter} = getter;
    syncTables.push({getter: {...otherGetter}, hasDynamicSchema: Boolean(getSchema), ...others});
  }
  return {
    formulas,
    formats,
    syncTables,
    ...(defaultAuthentication && {defaultAuthentication}),
    ...packMetadata,
  };
}
