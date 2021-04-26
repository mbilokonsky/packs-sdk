/// <reference types="chai" />
/// <reference types="mocha" />
/// <reference types="node" />

/** Returns the codomain for a map-like type. */
export declare type $Values<S> = S[keyof S];
/** Omits properties over a union type, only if the union member has that property. */
export declare type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;
export declare enum ValueType {
	Boolean = "boolean",
	Number = "number",
	String = "string",
	Array = "array",
	Object = "object",
	Date = "date",
	Time = "time",
	DateTime = "datetime",
	Duration = "duration",
	Person = "person",
	Percent = "percent",
	Currency = "currency",
	Image = "image",
	Url = "url",
	Markdown = "markdown",
	Html = "html",
	Embed = "embed",
	Reference = "reference",
	ImageAttachment = "imageAttachment",
	Attachment = "attachment",
	Slider = "slider",
	Scale = "scale"
}
declare const StringHintValueTypes: readonly [
	ValueType.Attachment,
	ValueType.Date,
	ValueType.Time,
	ValueType.DateTime,
	ValueType.Duration,
	ValueType.Embed,
	ValueType.Html,
	ValueType.Image,
	ValueType.ImageAttachment,
	ValueType.Markdown,
	ValueType.Url
];
declare const NumberHintValueTypes: readonly [
	ValueType.Date,
	ValueType.Time,
	ValueType.DateTime,
	ValueType.Percent,
	ValueType.Currency,
	ValueType.Slider,
	ValueType.Scale
];
declare const ObjectHintValueTypes: readonly [
	ValueType.Person,
	ValueType.Reference
];
export declare type StringHintTypes = typeof StringHintValueTypes[number];
export declare type NumberHintTypes = typeof NumberHintValueTypes[number];
export declare type ObjectHintTypes = typeof ObjectHintValueTypes[number];
export interface BaseSchema {
	description?: string;
}
export interface BooleanSchema extends BaseSchema {
	type: ValueType.Boolean;
}
export interface NumberSchema extends BaseSchema {
	type: ValueType.Number;
	codaType?: NumberHintTypes;
}
export interface NumericSchema extends NumberSchema {
	codaType?: ValueType.Percent;
	precision?: number;
	useThousandsSeparator?: boolean;
}
export declare enum CurrencyFormat {
	Currency = "currency",
	Accounting = "accounting",
	Financial = "financial"
}
export interface CurrencySchema extends NumberSchema {
	codaType: ValueType.Currency;
	precision?: number;
	currencyCode?: string;
	format?: CurrencyFormat;
}
export interface SliderSchema extends NumberSchema {
	codaType: ValueType.Slider;
	minimum?: number | string;
	maximum?: number | string;
	step?: number | string;
}
export interface ScaleSchema extends NumberSchema {
	codaType: ValueType.Scale;
	maximum: number;
	icon: string;
}
export interface BaseDateSchema extends BaseSchema {
	type: ValueType.Number | ValueType.String;
}
export interface DateSchema extends BaseDateSchema {
	codaType: ValueType.Date;
	format?: string;
}
export interface TimeSchema extends BaseDateSchema {
	codaType: ValueType.Time;
	format?: string;
}
export interface DateTimeSchema extends BaseDateSchema {
	codaType: ValueType.DateTime;
	dateFormat?: string;
	timeFormat?: string;
}
export declare enum DurationUnit {
	Days = "days",
	Hours = "hours",
	Minutes = "minutes",
	Seconds = "seconds"
}
export interface DurationSchema extends StringSchema<ValueType.Duration> {
	precision?: number;
	maxUnit?: DurationUnit;
}
export interface StringSchema<T extends StringHintTypes = StringHintTypes> extends BaseSchema {
	type: ValueType.String;
	codaType?: T;
}
export interface ArraySchema<T extends Schema = Schema> extends BaseSchema {
	type: ValueType.Array;
	items: T;
}
export interface ObjectSchemaProperty {
	fromKey?: string;
	required?: boolean;
}
export declare type ObjectSchemaProperties<K extends string = never> = {
	[K2 in K | string]: Schema & ObjectSchemaProperty;
};
export declare type GenericObjectSchema = ObjectSchema<string, string>;
export interface Identity {
	packId: PackId;
	name: string;
	dynamicUrl?: string;
	attribution?: AttributionNode[];
}
export interface ObjectSchema<K extends string, L extends string> extends BaseSchema {
	type: ValueType.Object;
	properties: ObjectSchemaProperties<K | L>;
	id?: K;
	primary?: K;
	codaType?: ObjectHintTypes;
	featured?: L[];
	identity?: Identity;
}
declare enum AttributionNodeType {
	Text = 1,
	Link = 2,
	Image = 3
}
export interface TextAttributionNode {
	type: AttributionNodeType.Text;
	text: string;
}
export interface LinkAttributionNode {
	type: AttributionNodeType.Link;
	anchorUrl: string;
	anchorText: string;
}
export interface ImageAttributionNode {
	type: AttributionNodeType.Image;
	anchorUrl: string;
	imageUrl: string;
}
export declare type AttributionNode = TextAttributionNode | LinkAttributionNode | ImageAttributionNode;
export declare type Schema = BooleanSchema | NumberSchema | StringSchema | ArraySchema | GenericObjectSchema;
export declare type PickOptional<T, K extends keyof T> = Partial<T> & {
	[P in K]: T[P];
};
export interface StringHintTypeToSchemaTypeMap {
	[ValueType.Date]: Date;
}
export declare type StringHintTypeToSchemaType<T extends StringHintTypes | undefined> = T extends keyof StringHintTypeToSchemaTypeMap ? StringHintTypeToSchemaTypeMap[T] : string;
export declare type SchemaType<T extends Schema> = T extends BooleanSchema ? boolean : T extends NumberSchema ? number : T extends StringSchema ? StringHintTypeToSchemaType<T["codaType"]> : T extends ArraySchema ? Array<SchemaType<T["items"]>> : T extends GenericObjectSchema ? PickOptional<{
	[K in keyof T["properties"]]: SchemaType<T["properties"][K]>;
}, $Values<{
	[K in keyof T["properties"]]: T["properties"][K] extends {
		required: true;
	} ? K : never;
}>> : never;
export declare function makeSchema<T extends Schema>(schema: T): T;
export declare function makeObjectSchema<K extends string, L extends string, T extends ObjectSchema<K, L>>(schema: T): T;
export declare enum Type {
	string = 0,
	number = 1,
	object = 2,
	boolean = 3,
	date = 4,
	html = 5,
	image = 6
}
export interface ArrayType<T extends Type> {
	type: "array";
	items: T;
}
export declare function isArrayType(obj: any): obj is ArrayType<any>;
export declare type UnionType = ArrayType<Type> | Type;
export interface TypeMap {
	[Type.number]: number;
	[Type.string]: string;
	[Type.object]: object;
	[Type.boolean]: boolean;
	[Type.date]: Date;
	[Type.html]: string;
	[Type.image]: string;
}
export declare type PackFormulaValue = $Values<Omit<TypeMap, Type.object>> | PackFormulaValue[];
export declare type PackFormulaResult = $Values<TypeMap> | PackFormulaResult[];
export declare type TypeOf<T extends PackFormulaResult> = T extends number ? Type.number : T extends string ? Type.string : T extends boolean ? Type.boolean : T extends Date ? Type.date : T extends object ? Type.object : never;
export interface ParamDef<T extends UnionType> {
	name: string;
	type: T;
	description: string;
	optional?: boolean;
	hidden?: boolean;
	autocomplete?: MetadataFormula;
	defaultValue?: DefaultValueType<T>;
}
export declare type ParamArgs<T extends UnionType> = Omit<ParamDef<T>, "description" | "name" | "type">;
export declare type ParamDefs = [
	ParamDef<any>,
	...Array<ParamDef<any>>
] | [
];
export declare type ParamsList = Array<ParamDef<UnionType>>;
export declare type TypeOfMap<T extends UnionType> = T extends Type ? TypeMap[T] : T extends ArrayType<infer V> ? Array<TypeMap[V]> : never;
export declare type ParamValues<ParamDefsT extends ParamDefs> = {
	[K in keyof ParamDefsT]: ParamDefsT[K] extends ParamDef<infer T> ? TypeOfMap<T> : never;
} & any[];
export declare type DefaultValueType<T extends UnionType> = T extends ArrayType<Type.date> ? TypeOfMap<T> | PrecannedDateRange : TypeOfMap<T>;
export interface CommonPackFormulaDef<T extends ParamDefs> {
	readonly name: string;
	readonly description: string;
	readonly examples: Array<{
		params: PackFormulaValue[];
		result: PackFormulaResult;
	}>;
	readonly parameters: T;
	readonly varargParameters?: ParamDefs;
	readonly network?: Network;
	/**
	 * How long formulas running with the same values should cache their results for. By default, 1 second.
	 */
	readonly cacheTtlSecs?: number;
	readonly isExperimental?: boolean;
	/**
	 * Whether this is a formula that will be used by Coda internally and not exposed directly to users.
	 */
	readonly isSystem?: boolean;
}
export interface Network {
	readonly hasSideEffect?: boolean;
	readonly requiresConnection?: boolean;
}
declare const ValidFetchMethods: readonly [
	"GET",
	"PATCH",
	"POST",
	"PUT",
	"DELETE"
];
export declare type FetchMethodType = typeof ValidFetchMethods[number];
export interface FetchRequest {
	method: FetchMethodType;
	url: string;
	body?: string;
	form?: {
		[key: string]: string;
	};
	headers?: {
		[header: string]: string;
	};
	cacheTtlSecs?: number;
	isBinaryResponse?: boolean;
	disableAuthentication?: boolean;
}
export interface FetchResponse<T extends any = any> {
	status: number;
	body?: T;
	headers: {
		[header: string]: string | string[] | undefined;
	};
}
export interface Fetcher {
	fetch<T = any>(request: FetchRequest): Promise<FetchResponse<T>>;
}
export interface TemporaryBlobStorage {
	storeUrl(url: string, opts?: {
		expiryMs?: number;
	}): Promise<string>;
	storeBlob(blobData: Buffer, contentType: string, opts?: {
		expiryMs?: number;
	}): Promise<string>;
}
export interface Sync {
	continuation?: Continuation;
	schema?: ArraySchema;
	dynamicUrl?: string;
}
export declare type LoggerParamType = string | number | boolean | Record<any, any>;
export interface Logger {
	trace(message: string, ...args: LoggerParamType[]): void;
	debug(message: string, ...args: LoggerParamType[]): void;
	info(message: string, ...args: LoggerParamType[]): void;
	warn(message: string, ...args: LoggerParamType[]): void;
	error(message: string, ...args: LoggerParamType[]): void;
}
export interface ExecutionContext {
	readonly fetcher: Fetcher;
	readonly temporaryBlobStorage: TemporaryBlobStorage;
	readonly logger: Logger;
	readonly endpoint?: string;
	readonly invocationLocation: {
		protocolAndHost: string;
		docId?: string;
	};
	readonly timezone: string;
	readonly invocationToken: string;
	readonly sync?: Sync;
}
export interface SyncExecutionContext extends ExecutionContext {
	readonly sync: Sync;
}
export declare enum PrecannedDateRange {
	Yesterday = "yesterday",
	Last7Days = "last_7_days",
	Last30Days = "last_30_days",
	LastWeek = "last_week",
	LastMonth = "last_month",
	Last3Months = "last_3_months",
	Last6Months = "last_6_months",
	LastYear = "last_year",
	Today = "today",
	ThisWeek = "this_week",
	ThisWeekStart = "this_week_start",
	ThisMonth = "this_month",
	ThisMonthStart = "this_month_start",
	ThisYearStart = "this_year_start",
	YearToDate = "year_to_date",
	ThisYear = "this_year",
	Tomorrow = "tomorrow",
	Next7Days = "next_7_days",
	Next30Days = "next_30_days",
	NextWeek = "next_week",
	NextMonth = "next_month",
	Next3Months = "next_3_months",
	Next6Months = "next_6_months",
	NextYear = "next_year",
	Everything = "everything"
}
export declare type ParamMapper<T> = (val: T) => T;
export interface RequestHandlerTemplate {
	url: string;
	method: FetchMethodType;
	headers?: {
		[header: string]: string;
	};
	nameMapping?: {
		[functionParamName: string]: string;
	};
	transforms?: {
		[name: string]: ParamMapper<any>;
	};
	queryParams?: string[];
	bodyTemplate?: object;
	bodyParams?: string[];
}
export interface ResponseHandlerTemplate<T extends Schema> {
	schema?: T;
	projectKey?: string;
	onError?(error: Error): any;
}
/**
 * An error whose message will be shown to the end user in the UI when it occurs.
 * If an error is encountered in a formula and you want to describe the error
 * to the end user, throw a UserVisibleError with a user-friendly message
 * and the Coda UI will display the message.
 */
export declare class UserVisibleError extends Error {
	readonly isUserVisible = true;
	readonly internalError: Error | undefined;
	constructor(message?: string, internalError?: Error);
}
export declare class StatusCodeError extends Error {
	statusCode: number;
	constructor(statusCode: number);
}
/**
 * Type definition for a Sync Table. Should not be necessary to use directly,
 * instead, define sync tables using {@link makeSyncTable}.
 */
export interface SyncTableDef<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchema<K, L>> {
	name: string;
	schema: SchemaT;
	getter: SyncFormula<K, L, ParamDefsT, SchemaT>;
	getSchema?: MetadataFormula;
	entityName?: string;
}
/**
 * Type definition for a Dynamic Sync Table. Should not be necessary to use directly,
 * instead, define dynamic sync tables using {@link makeDynamicSyncTable}.
 */
export interface DynamicSyncTableDef<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchema<K, L>> extends SyncTableDef<K, L, ParamDefsT, SchemaT> {
	isDynamic: true;
	getSchema: MetadataFormula;
	getName: MetadataFormula;
	getDisplayUrl: MetadataFormula;
	listDynamicUrls?: MetadataFormula;
}
/**
 * Container for arbitrary data about which page of data to retrieve in this sync invocation.
 *
 * Sync formulas fetch one reasonable size "page" of data per invocation such that the formula
 * can be invoked quickly. The end result of a sync is the concatenation of the results from
 * each individual invocation.
 *
 * To instruct the syncer to fetch a subsequent result page, return a `Continuation` that
 * describes which page of results to fetch next. The continuation will be passed verbatim
 * as an input to the subsequent invocation of the sync formula.
 *
 * The contents of this object are entirely up to the pack author.
 *
 * Examples:
 *
 * ```
 * {nextPage: 3}
 * ```
 *
 * ```
 * {nextPageUrl: 'https://someapi.com/api/items?pageToken=asdf123'}
 * ```
 */
export interface Continuation {
	[key: string]: string | number;
}
/**
 * Type definition for the formula that implements a sync table.
 * Should not be necessary to use directly, see {@link makeSyncTable}
 * for defining a sync table.
 */
export declare type GenericSyncFormula = SyncFormula<any, any, ParamDefs, any>;
/**
 * Type definition for the return value of a sync table.
 * Should not be necessary to use directly, see {@link makeSyncTable}
 * for defining a sync table.
 */
export declare type GenericSyncFormulaResult = SyncFormulaResult<any>;
/**
 * Type definition for a static (non-dynamic) sync table.
 * Should not be necessary to use directly, see {@link makeSyncTable}
 * for defining a sync table.
 */
export declare type GenericSyncTable = SyncTableDef<any, any, ParamDefs, any>;
/**
 * Type definition for a dynamic sync table.
 * Should not be necessary to use directly, see {@link makeDynamicSyncTable}
 * for defining a sync table.
 */
export declare type GenericDynamicSyncTable = DynamicSyncTableDef<any, any, ParamDefs, any>;
/**
 * Union of type definitions for sync tables..
 * Should not be necessary to use directly, see {@link makeSyncTable} or {@link makeDynamicSyncTable}
 * for defining a sync table.
 */
export declare type SyncTable = GenericSyncTable | GenericDynamicSyncTable;
/**
 * Helper to determine if an error is considered user-visible and can be shown in the UI.
 * See {@link UserVisibleError}.
 * @param error Any error object.
 */
export declare function isUserVisibleError(error: Error): error is UserVisibleError;
export declare function isDynamicSyncTable(syncTable: SyncTable): syncTable is GenericDynamicSyncTable;
export declare function makeStringParameter(name: string, description: string, args?: ParamArgs<Type.string>): ParamDef<Type.string>;
export declare function makeStringArrayParameter(name: string, description: string, args?: ParamArgs<ArrayType<Type.string>>): ParamDef<ArrayType<Type.string>>;
export declare function makeNumericParameter(name: string, description: string, args?: ParamArgs<Type.number>): ParamDef<Type.number>;
export declare function makeNumericArrayParameter(name: string, description: string, args?: ParamArgs<ArrayType<Type.number>>): ParamDef<ArrayType<Type.number>>;
export declare function makeBooleanParameter(name: string, description: string, args?: ParamArgs<Type.boolean>): ParamDef<Type.boolean>;
export declare function makeBooleanArrayParameter(name: string, description: string, args?: ParamArgs<ArrayType<Type.boolean>>): ParamDef<ArrayType<Type.boolean>>;
export declare function makeDateParameter(name: string, description: string, args?: ParamArgs<Type.date>): ParamDef<Type.date>;
export declare function makeDateArrayParameter(name: string, description: string, args?: ParamArgs<ArrayType<Type.date>>): ParamDef<ArrayType<Type.date>>;
export declare function makeHtmlParameter(name: string, description: string, args?: ParamArgs<Type.html>): ParamDef<Type.html>;
export declare function makeHtmlArrayParameter(name: string, description: string, args?: ParamArgs<ArrayType<Type.html>>): ParamDef<ArrayType<Type.html>>;
export declare function makeImageParameter(name: string, description: string, args?: ParamArgs<Type.image>): ParamDef<Type.image>;
export declare function makeImageArrayParameter(name: string, description: string, args?: ParamArgs<ArrayType<Type.image>>): ParamDef<ArrayType<Type.image>>;
export declare function makeUserVisibleError(msg: string): UserVisibleError;
export interface PackFormulas {
	readonly [namespace: string]: TypedStandardFormula[];
}
export interface PackFormulaDef<ParamsT extends ParamDefs, ResultT extends PackFormulaResult> extends CommonPackFormulaDef<ParamsT> {
	execute(params: ParamValues<ParamsT>, context: ExecutionContext): Promise<ResultT> | ResultT;
}
export interface StringFormulaDef<ParamsT extends ParamDefs> extends CommonPackFormulaDef<ParamsT> {
	execute(params: ParamValues<ParamsT>, context: ExecutionContext): Promise<string> | string;
	response?: {
		schema: StringSchema;
	};
}
export interface ObjectResultFormulaDef<ParamsT extends ParamDefs, SchemaT extends Schema> extends PackFormulaDef<ParamsT, object | object[]> {
	execute(params: ParamValues<ParamsT>, context: ExecutionContext): Promise<object> | object;
	response?: ResponseHandlerTemplate<SchemaT>;
}
export interface ObjectArrayFormulaDef<ParamsT extends ParamDefs, SchemaT extends Schema> extends Omit<PackFormulaDef<ParamsT, SchemaType<SchemaT>>, "execute"> {
	request: RequestHandlerTemplate;
	response: ResponseHandlerTemplate<SchemaT>;
}
export interface EmptyFormulaDef<ParamsT extends ParamDefs> extends Omit<PackFormulaDef<ParamsT, string>, "execute"> {
	request: RequestHandlerTemplate;
}
export declare type Formula<ParamDefsT extends ParamDefs, ResultT extends PackFormulaResult> = PackFormulaDef<ParamDefsT, ResultT> & {
	resultType: TypeOf<ResultT>;
};
export declare type NumericPackFormula<ParamDefsT extends ParamDefs> = Formula<ParamDefsT, number> & {
	schema?: NumberSchema;
};
export declare type StringPackFormula<ParamDefsT extends ParamDefs, ResultT extends StringHintTypes = StringHintTypes> = Formula<ParamDefsT, SchemaType<StringSchema<ResultT>>> & {
	schema?: StringSchema<ResultT>;
};
export declare type ObjectPackFormula<ParamDefsT extends ParamDefs, SchemaT extends Schema> = Formula<ParamDefsT, SchemaType<SchemaT>> & {
	schema?: SchemaT;
};
export declare type TypedStandardFormula = NumericPackFormula<ParamDefs> | StringPackFormula<ParamDefs, any> | ObjectPackFormula<ParamDefs, Schema>;
export declare type TypedPackFormula = TypedStandardFormula | GenericSyncFormula;
export declare type TypedObjectPackFormula = ObjectPackFormula<ParamDefs, Schema>;
export declare type PackFormulaMetadata = Omit<TypedPackFormula, "execute">;
export declare type ObjectPackFormulaMetadata = Omit<TypedObjectPackFormula, "execute">;
export declare function isObjectPackFormula(fn: PackFormulaMetadata): fn is ObjectPackFormulaMetadata;
export declare function isStringPackFormula(fn: Formula<ParamDefs, any>): fn is StringPackFormula<ParamDefs>;
export declare function isSyncPackFormula(fn: Formula<ParamDefs, any>): fn is GenericSyncFormula;
export interface SyncFormulaResult<ResultT extends object> {
	result: ResultT[];
	continuation?: Continuation;
}
export interface SyncFormulaDef<ParamsT extends ParamDefs> extends CommonPackFormulaDef<ParamsT> {
	execute(params: ParamValues<ParamsT>, context: SyncExecutionContext): Promise<SyncFormulaResult<object>>;
}
export declare type SyncFormula<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchema<K, L>> = Omit<SyncFormulaDef<ParamDefsT>, "execute"> & {
	execute(params: ParamValues<ParamDefsT>, context: SyncExecutionContext): Promise<SyncFormulaResult<SchemaType<SchemaT>>>;
	resultType: TypeOf<SchemaType<SchemaT>>;
	isSyncFormula: true;
	schema?: ArraySchema;
};
/**
 * Helper for returning the definition of a formula that returns a number. Adds result type information
 * to a generic formula definition.
 *
 * @param definition The definition of a formula that returns a number.
 */
export declare function makeNumericFormula<ParamDefsT extends ParamDefs>(definition: PackFormulaDef<ParamDefsT, number>): NumericPackFormula<ParamDefsT>;
/**
 * Helper for returning the definition of a formula that returns a string. Adds result type information
 * to a generic formula definition.
 *
 * @param definition The definition of a formula that returns a string.
 */
export declare function makeStringFormula<ParamDefsT extends ParamDefs>(definition: StringFormulaDef<ParamDefsT>): StringPackFormula<ParamDefsT>;
/**
 * The return type for a metadata formula that should return a different display to the user
 * than is used internally.
 */
export interface MetadataFormulaObjectResultType {
	display: string;
	value: string | number;
	hasChildren?: boolean;
}
/**
 * A context object that is provided to a metadata formula at execution time.
 * For example, an autocomplete metadata formula for a parameter value may need
 * to know the value of parameters that have already been selected. Those parameter
 * values are provided in this context object.
 */
export declare type MetadataContext = Record<string, any>;
export declare type MetadataFormulaResultType = string | number | MetadataFormulaObjectResultType;
export declare type MetadataFormula = ObjectPackFormula<[
	ParamDef<Type.string>,
	ParamDef<Type.string>
], any>;
export declare type MetadataFormulaMetadata = Omit<MetadataFormula, "execute">;
export declare function makeMetadataFormula(execute: (context: ExecutionContext, search: string, formulaContext?: MetadataContext) => Promise<MetadataFormulaResultType | MetadataFormulaResultType[] | ArraySchema>): MetadataFormula;
export interface SimpleAutocompleteOption {
	display: string;
	value: string | number;
}
export declare function simpleAutocomplete(search: string | undefined, options: Array<string | SimpleAutocompleteOption>): Promise<MetadataFormulaObjectResultType[]>;
export declare function autocompleteSearchObjects<T>(search: string, objs: T[], displayKey: keyof T, valueKey: keyof T): Promise<MetadataFormulaObjectResultType[]>;
export declare function makeSimpleAutocompleteMetadataFormula(options: Array<string | SimpleAutocompleteOption>): MetadataFormula;
export declare function makeObjectFormula<ParamDefsT extends ParamDefs, SchemaT extends Schema>({ response, ...definition }: ObjectResultFormulaDef<ParamDefsT, SchemaT>): ObjectPackFormula<ParamDefsT, SchemaT>;
/**
 * Wrapper to produce a sync table definition. All (non-dynamic) sync tables should be created
 * using this wrapper rather than declaring a sync table definition object directly.
 *
 * This wrapper does a variety of helpful things, including
 * * Doing basic validation of the provided definition.
 * * Normalizing the schema definition to conform to Coda-recommended syntax.
 * * Wrapping the execute formula to normalize return values to match the normalized schema.
 *
 * See [Normalization](/index.html#normalization) for more information about schema normalization.
 *
 * @param name The name of the sync table. This should describe the entities being synced. For example,
 * a sync table that syncs products from an e-commerce platform should be called 'Products'. This name
 * must not contain spaces.
 * @param schema The definition of the schema that describes a single response object. For example, the
 * schema for a single product. The sync formula will return an array of objects that fit this schema.
 * @param formula The definition of the formula that implements this sync. This is a Coda packs formula
 * that returns an array of objects fitting the given schema and optionally a {@link Continuation}.
 * (The {@link SyncFormulaDef.name} is redundant and should be the same as the `name` parameter here.
 * These will eventually be consolidated.)
 * @param getSchema Only used internally by {@link makeDynamicSyncTable}, see there for more details.
 * @param entityName Only used internally by {@link makeDynamicSyncTable}, see there for more details.
 */
export declare function makeSyncTable<K extends string, L extends string, ParamDefsT extends ParamDefs, SchemaT extends ObjectSchema<K, L>>(name: string, schema: SchemaT, formula: SyncFormulaDef<ParamDefsT>, getSchema?: MetadataFormula, entityName?: string): SyncTableDef<K, L, ParamDefsT, SchemaT>;
export declare function makeDynamicSyncTable<K extends string, L extends string, ParamDefsT extends ParamDefs>({ packId, name, getName, getSchema, getDisplayUrl, formula, listDynamicUrls, entityName, }: {
	packId: number;
	name: string;
	getName: MetadataFormula;
	getSchema: MetadataFormula;
	formula: SyncFormulaDef<ParamDefsT>;
	getDisplayUrl: MetadataFormula;
	listDynamicUrls?: MetadataFormula;
	entityName?: string;
}): DynamicSyncTableDef<K, L, ParamDefsT, any>;
export declare function makeTranslateObjectFormula<ParamDefsT extends ParamDefs, ResultT extends Schema>({ response, ...definition }: ObjectArrayFormulaDef<ParamDefsT, ResultT>): {
	request: RequestHandlerTemplate;
	description: string;
	name: string;
	examples: {
		params: PackFormulaValue[];
		result: PackFormulaResult;
	}[];
	parameters: ParamDefsT;
	varargParameters?: ParamDefs | undefined;
	network?: Network | undefined;
	cacheTtlSecs?: number | undefined;
	isExperimental?: boolean | undefined;
	isSystem?: boolean | undefined;
} & {
	execute: (params: ParamValues<ParamDefsT>, context: ExecutionContext) => Promise<SchemaType<ResultT>>;
	resultType: Type.object;
	schema: ResultT | undefined;
};
export declare function makeEmptyFormula<ParamDefsT extends ParamDefs>(definition: EmptyFormulaDef<ParamDefsT>): EmptyFormulaDef<ParamDefsT> & {
	execute: (params: ParamValues<ParamDefsT>, context: ExecutionContext) => Promise<string>;
	resultType: Type.string;
};
export declare type PackId = number;
export declare type ProviderId = number;
export declare enum PackCategory {
	CRM = "CRM",
	Calendar = "Calendar",
	Communication = "Communication",
	DataStorage = "DataStorage",
	Design = "Design",
	Financial = "Financial",
	Fun = "Fun",
	Geo = "Geo",
	IT = "IT",
	Mathematics = "Mathematics",
	Organization = "Organization",
	Recruiting = "Recruiting",
	Shopping = "Shopping",
	Social = "Social",
	Sports = "Sports",
	Travel = "Travel",
	Weather = "Weather"
}
export declare enum AuthenticationType {
	None = "None",
	HeaderBearerToken = "HeaderBearerToken",
	CustomHeaderToken = "CustomHeaderToken",
	QueryParamToken = "QueryParamToken",
	MultiQueryParamToken = "MultiQueryParamToken",
	OAuth2 = "OAuth2",
	WebBasic = "WebBasic",
	AWSSignature4 = "AWSSignature4",
	CodaApiHeaderBearerToken = "CodaApiHeaderBearerToken"
}
export declare enum DefaultConnectionType {
	SharedDataOnly = 1,
	Shared = 2,
	ProxyActionsOnly = 3
}
/**
 * A pack or formula which uses no authentication mechanism
 */
export interface NoAuthentication {
	type: AuthenticationType.None;
}
export interface SetEndpoint {
	type: PostSetupType.SetEndpoint;
	name: string;
	description: string;
	getOptionsFormula: MetadataFormula;
}
export declare enum PostSetupType {
	SetEndpoint = "SetEndPoint"
}
export declare type PostSetup = SetEndpoint;
export interface BaseAuthentication {
	getConnectionName?: MetadataFormula;
	getConnectionUserId?: MetadataFormula;
	defaultConnectionType?: DefaultConnectionType;
	instructionsUrl?: string;
	requiresEndpointUrl?: boolean;
	endpointDomain?: string;
	postSetup?: PostSetup[];
}
/**
 * A pack or formula which uses standard bearer token header authentication:
 * {"Authorization": "Bearer <token here>"}
 */
export interface HeaderBearerTokenAuthentication extends BaseAuthentication {
	type: AuthenticationType.HeaderBearerToken;
}
/**
 * A pack or formula that uses the Coda API bearer token. We will
 * use this to provide a better authentication experience.
 * {"Authorization": "Bearer <token here>"}
 */
export interface CodaApiBearerTokenAuthentication extends BaseAuthentication {
	type: AuthenticationType.CodaApiHeaderBearerToken;
	deferConnectionSetup?: boolean;
	shouldAutoAuthSetup?: boolean;
}
/**
 * A pack or formula which uses standard bearer token header authentication:
 * {"HeaderNameHere": "OptionalTokenPrefixHere <token here>"}
 */
export interface CustomHeaderTokenAuthentication extends BaseAuthentication {
	type: AuthenticationType.CustomHeaderToken;
	headerName: string;
	tokenPrefix?: string;
}
/**
 * A pack or formula which includes a token in a query parameter (bad for security).
 * https://foo.com/apis/dosomething?token=<token here>
 */
export interface QueryParamTokenAuthentication extends BaseAuthentication {
	type: AuthenticationType.QueryParamToken;
	paramName: string;
}
/**
 * A pack or formula which includes multiple tokens in a query parameter (bad for security).
 * https://foo.com/apis/dosomething?param1=<param1 value>&param2=<param2 value>
 */
export interface MultiQueryParamTokenAuthentication extends BaseAuthentication {
	type: AuthenticationType.MultiQueryParamToken;
	params: Array<{
		name: string;
		description: string;
	}>;
}
export interface OAuth2Authentication extends BaseAuthentication {
	type: AuthenticationType.OAuth2;
	authorizationUrl: string;
	tokenUrl: string;
	scopes?: string[];
	tokenPrefix?: string;
	additionalParams?: {
		[key: string]: any;
	};
	clientIdEnvVarName: string;
	clientSecretEnvVarName: string;
	endpointKey?: string;
	tokenQueryParam?: string;
}
export interface WebBasicAuthentication extends BaseAuthentication {
	type: AuthenticationType.WebBasic;
	uxConfig?: {
		placeholderUsername?: string;
		placeholderPassword?: string;
		usernameOnly?: boolean;
	};
}
export interface AWSSignature4Authentication extends BaseAuthentication {
	type: AuthenticationType.AWSSignature4;
	service: string;
}
export declare type Authentication = NoAuthentication | HeaderBearerTokenAuthentication | CodaApiBearerTokenAuthentication | CustomHeaderTokenAuthentication | QueryParamTokenAuthentication | MultiQueryParamTokenAuthentication | OAuth2Authentication | WebBasicAuthentication | AWSSignature4Authentication;
export declare type SystemAuthentication = HeaderBearerTokenAuthentication | CustomHeaderTokenAuthentication | QueryParamTokenAuthentication | MultiQueryParamTokenAuthentication | WebBasicAuthentication | AWSSignature4Authentication;
export interface Format {
	name: string;
	formulaNamespace: string;
	formulaName: string;
	hasNoConnection?: boolean;
	instructions?: string;
	logoPath?: string;
	matchers?: RegExp[];
	placeholder?: string;
}
export declare enum FeatureSet {
	Basic = "Basic",
	Pro = "Pro",
	Team = "Team",
	Enterprise = "Enterprise"
}
export declare enum QuotaLimitType {
	Action = "Action",
	Getter = "Getter",
	Sync = "Sync",
	Metadata = "Metadata"
}
export declare enum SyncInterval {
	Manual = "Manual",
	Daily = "Daily",
	Hourly = "Hourly",
	EveryTenMinutes = "EveryTenMinutes"
}
export interface SyncQuota {
	maximumInterval?: SyncInterval;
	maximumRowCount?: number;
}
export interface Quota {
	monthlyLimits?: Partial<{
		[quotaLimitType in QuotaLimitType]: number;
	}>;
	maximumSyncInterval?: SyncInterval;
	sync?: SyncQuota;
}
export interface RateLimit {
	operationsPerInterval: number;
	intervalSeconds: number;
}
export interface RateLimits {
	overall?: RateLimit;
	perConnection?: RateLimit;
}
export interface PackDefinition {
	id: PackId;
	name: string;
	shortDescription: string;
	description: string;
	permissionsDescription?: string;
	version: string;
	providerId: ProviderId;
	category: PackCategory;
	logoPath: string;
	enabledConfigName?: string;
	defaultAuthentication?: Authentication;
	networkDomains?: string[];
	exampleImages?: string[];
	exampleVideoIds?: string[];
	minimumFeatureSet?: FeatureSet;
	quotas?: Partial<{
		[featureSet in FeatureSet]: Quota;
	}>;
	rateLimits?: RateLimits;
	formulaNamespace?: string;
	/**
	 * If specified, this pack requires system credentials to be set up via Coda's admin console in order to work when no
	 * explicit connection is specified by the user.
	 */
	systemConnectionAuthentication?: SystemAuthentication;
	formulas?: PackFormulas | TypedStandardFormula[];
	formats?: Format[];
	syncTables?: SyncTable[];
	/**
	 * Whether this is a pack that will be used by Coda internally and not exposed directly to users.
	 */
	isSystem?: boolean;
}
export interface ProviderDefinition {
	id: ProviderId;
	name: string;
	logoPath: string;
}
export declare type PackSyncTable = Omit<SyncTable, "getter" | "getName" | "getSchema" | "listDynamicUrls" | "getDisplayUrl"> & {
	getter: PackFormulaMetadata;
	isDynamic?: boolean;
	hasDynamicSchema?: boolean;
	getSchema?: MetadataFormulaMetadata;
	getName?: MetadataFormulaMetadata;
	getDisplayUrl?: MetadataFormulaMetadata;
	listDynamicUrls?: MetadataFormulaMetadata;
};
export interface PackFormatMetadata extends Omit<Format, "matchers"> {
	matchers: string[];
}
export interface PackFormulasMetadata {
	[namespace: string]: PackFormulaMetadata[];
}
export declare type PostSetupMetadata = Omit<PostSetup, "getOptionsFormula"> & {
	getOptionsFormula: MetadataFormulaMetadata;
};
export declare type AuthenticationMetadata = DistributiveOmit<Authentication, "getConnectionName" | "getConnectionUserId" | "postSetup"> & {
	getConnectionName?: MetadataFormulaMetadata;
	getConnectionUserId?: MetadataFormulaMetadata;
	postSetup?: PostSetupMetadata[];
};
/** Stripped-down version of `PackDefinition` that doesn't contain formula definitions. */
export declare type PackMetadata = Omit<PackDefinition, "formulas" | "formats" | "defaultAuthentication" | "syncTables"> & {
	formulas: PackFormulasMetadata | PackFormulaMetadata[];
	formats: PackFormatMetadata[];
	syncTables: PackSyncTable[];
	defaultAuthentication?: AuthenticationMetadata;
};
export declare type ExternalPackAuthenticationType = AuthenticationType;
export declare type ExternalPackFormulas = PackFormulasMetadata | PackFormulaMetadata[];
export declare type ExternalObjectPackFormula = ObjectPackFormulaMetadata;
export declare type ExternalPackFormula = PackFormulaMetadata;
export declare type ExternalPackFormat = Format;
export declare type ExternalPackFormatMetadata = PackFormatMetadata;
export declare type ExternalSyncTable = PackSyncTable;
export declare type BasePackMetadata = Omit<PackMetadata, "enabledConfigName" | "defaultAuthentication" | "systemConnectionAuthentication" | "formulas" | "formats" | "syncTables">;
/** Further stripped-down version of `PackMetadata` that contains only what the browser needs. */
export interface ExternalPackMetadata extends BasePackMetadata {
	authentication: {
		type: ExternalPackAuthenticationType;
		params?: Array<{
			name: string;
			description: string;
		}>;
		requiresEndpointUrl: boolean;
		endpointDomain?: string;
		postSetup?: PostSetupMetadata[];
		deferConnectionSetup?: boolean;
		shouldAutoAuthSetup?: boolean;
	};
	instructionsUrl?: string;
	formulas?: ExternalPackFormulas;
	formats?: ExternalPackFormat[];
	syncTables?: ExternalSyncTable[];
}
export declare function withQueryParams(url: string, params?: {
	[key: string]: any;
}): string;
export declare function getQueryParams(url: string): {
	[key: string]: any;
};
declare function join(...tokens: string[]): string;
export declare function ensureUnreachable(value: never, message?: string): never;
export declare function ensureNonEmptyString(value: string | null | undefined, message?: string): string;
export declare function ensureExists<T>(value: T | null | undefined, message?: string): T;
export declare function assertCondition(condition: any, message?: string): asserts condition;

export {
	join as joinUrl,
};

export {};