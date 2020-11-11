import type {ExecutionContext} from '../api_types';
import type {FetchRequest} from '../api_types';
import type {GenericSyncFormula} from '../api';
import type {PackDefinition} from '../types';
import type {ParamDefs} from '../api_types';
import type {ParamValues} from '../api_types';
import type {SyncExecutionContext} from '../api_types';
import type {TypedStandardFormula} from '../api';
import {coerceParams} from './coercion';
import {newMockExecutionContext} from './mocks';
import {validateParams} from './validation';
import {validateResult} from './validation';

export interface ExecuteOptions {
  validateParams?: boolean;
  validateResult?: boolean;
}

// TODO(alan/jonathan): Write a comparable function that handles syncs.
export async function executeFormula(
  formula: TypedStandardFormula,
  params: ParamValues<ParamDefs>,
  context: ExecutionContext = newMockExecutionContext(),
  {validateParams: shouldValidateParams = true, validateResult: shouldValidateResult = true}: ExecuteOptions = {},
) {
  if (shouldValidateParams) {
    validateParams(formula, params);
  }
  const result = await formula.execute(params, context);
  if (shouldValidateResult) {
    validateResult(formula, result);
  }
  return result;
}

export async function executeFormulaFromPackDef(
  packDef: PackDefinition,
  formulaNameWithNamespace: string,
  params: ParamValues<ParamDefs>,
  context?: ExecutionContext,
  options?: ExecuteOptions,
) {
  const formula = findFormula(packDef, formulaNameWithNamespace);
  return executeFormula(formula, params, context, options);
}

export async function executeFormulaFromCLI(args: string[], module: any) {
  const formulaNameWithNamespace = args[0];
  if (!module.manifest) {
    // eslint-disable-next-line no-console
    console.log('Manifest file must export a variable called "manifest" that refers to a PackDefinition.');
    return process.exit(1);
  }

  try {
    const formula = findFormula(module.manifest, formulaNameWithNamespace);
    const params = coerceParams(formula, args.slice(1) as any);
    const result = await executeFormula(formula, params);
    // eslint-disable-next-line no-console
    console.log(result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    process.exit(1);
  }
}

export async function executeSyncFormula(
  formula: GenericSyncFormula,
  params: ParamValues<ParamDefs>,
  context: SyncExecutionContext = newSyncExecutionContext(),
  {validateParams: shouldValidateParams = true, validateResult: shouldValidateResult = true}: ExecuteOptions = {},
) {
  if (shouldValidateParams) {
    validateParams(formula, params);
  }
  const result = await formula.execute(params, context);
  if (shouldValidateResult) {
    validateResult(formula, result);
  }
  return result;
}

export async function executeSyncFormulaFromPackDef(
  packDef: PackDefinition,
  syncFormulaName: string,
  params: ParamValues<ParamDefs>,
  context?: SyncExecutionContext,
  options?: ExecuteOptions,
) {
  const formula = findSyncFormula(packDef, syncFormulaName);
  return executeSyncFormula(formula, params, context, options);
}

export function newExecutionContext(): ExecutionContext {
  // TODO(jonathan): Add a mock fetcher.
  return {
    invocationLocation: {
      protocolAndHost: 'https://coda.io',
    },
    timezone: 'America/Los_Angeles',
    invocationToken: v4(),
    fetcher: {
      fetch: (request: FetchRequest) => {
        throw new Error('Not yet implemented');
      },
    },
    temporaryBlobStorage: {
      storeUrl: (url: string, opts?: {expiryMs?: number}) => {
        throw new Error('Not yet implemented');
      },
      storeBlob: (blobData: Buffer, contentType: string, opts?: {expiryMs?: number}) => {
        throw new Error('Not yet implemented');
      },
    },
  };
}

export function newSyncExecutionContext(): SyncExecutionContext {
  return {...newExecutionContext(), sync: {}};
}

function findFormula(packDef: PackDefinition, formulaNameWithNamespace: string): TypedStandardFormula {
  if (!packDef.formulas) {
    throw new Error(`Pack definition for ${packDef.name} (id ${packDef.id}) has no formulas.`);
  }
  const [namespace, name] = formulaNameWithNamespace.split('::');
  if (!(namespace && name)) {
    throw new Error(
      `Formula names must be specified as FormulaNamespace::FormulaName, but got "${formulaNameWithNamespace}".`,
    );
  }
  const formulas = packDef.formulas[namespace];
  if (!formulas || !formulas.length) {
    throw new Error(
      `Pack definition for ${packDef.name} (id ${packDef.id}) has no formulas for namespace "${namespace}".`,
    );
  }
  for (const formula of formulas) {
    if (formula.name === name) {
      return formula;
    }
  }
  throw new Error(
    `Pack definition for ${packDef.name} (id ${packDef.id}) has no formula "${name}" in namespace "${namespace}".`,
  );
}

function findSyncFormula(packDef: PackDefinition, syncFormulaName: string): GenericSyncFormula {
  if (!packDef.syncTables) {
    throw new Error(`Pack definition for ${packDef.name} (id ${packDef.id}) has no sync tables.`);
  }

  for (const syncTable of packDef.syncTables) {
    const syncFormula = syncTable.getter;
    if (syncFormula.name === syncFormulaName) {
      return syncFormula;
    }
  }

  throw new Error(
    `Pack definition for ${packDef.name} (id ${packDef.id}) has no sync formula "${syncFormulaName}" in its sync tables.`,
  );
}
