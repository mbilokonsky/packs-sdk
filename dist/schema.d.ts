import type { $Values } from './type_utils';
/**
 * The set of primitive value types that can be used as return values for formulas
 * or in object schemas.
 */
export declare enum ValueType {
    /**
     * Indicates a JavaScript boolean (true/false) should be returned.
     */
    Boolean = "boolean",
    /**
     * Indicates a JavaScript number should be returned.
     */
    Number = "number",
    /**
     * Indicates a JavaScript string should be returned.
     */
    String = "string",
    /**
     * Indicates a JavaScript array should be returned. The schema of the array items must also be specified.
     */
    Array = "array",
    /**
     * Indicates a JavaScript object should be returned. The schema of each object property must also be specified.
     */
    Object = "object"
}
/**
 * Synthetic types that instruct Coda how to coerce values from primitives at ingestion time.
 */
export declare enum ValueHintType {
    /**
     * Indicates to interpret the value as a date (e.g. March 3, 2021).
     */
    Date = "date",
    /**
     * Indicates to interpret the value as a time (e.g. 5:24pm).
     */
    Time = "time",
    /**
     * Indicates to interpret the value as a datetime (e.g. March 3, 2021 at 5:24pm).
     */
    DateTime = "datetime",
    /**
     * Indicates to interpret the value as a duration (e.g. 3 hours).
     */
    Duration = "duration",
    /**
     * Indicates to interpret and render the value as a Coda person reference. The provided value should be
     * an object whose `id` property is an email address, which Coda will try to resolve to a user
     * and render an @-reference to the user.
     *
     * @example
     * ```
     * makeObjectSchema({
     *   type: ValueType.Object,
     *   codaType: ValueHintType.Person,
     *   id: 'email',
     *   primary: 'name',
     *   properties: {
     *     email: {type: ValueType.String, required: true},
     *     name: {type: ValueType.String, required: true},
     *   },
     * });
     * ```
     */
    Person = "person",
    /**
     * Indicates to interpret and render the value as a percentage.
     */
    Percent = "percent",
    /**
     * Indicates to interpret and render the value as a currency value.
     */
    Currency = "currency",
    /**
     * Indicates to interpret and render the value as an image. The provided value should be a URL that
     * points to an image. Coda will hotlink to the image when rendering it a doc.
     *
     * Using {@link ImageAttachment} is recommended instead, so that the image is always accessible
     * and won't appear as broken if the source image is later deleted.
     */
    ImageReference = "image",
    /**
     * Indicates to interpret and render the value as an image. The provided value should be a URL that
     * points to an image. Coda will ingest the image and host it from Coda infrastructure.
     */
    ImageAttachment = "imageAttachment",
    /**
     * Indicates to interpret and render the value as a URL link.
     */
    Url = "url",
    /**
     * Indicates to interpret a text value as Markdown, which will be converted and rendered as Coda rich text.
     */
    Markdown = "markdown",
    /**
     * Indicates to interpret a text value as HTML, which will be converted and rendered as Coda rich text.
     */
    Html = "html",
    /**
     * Indicates to interpret and render a value as an embed. The provided value should be a URL pointing
     * to an embeddable web page.
     */
    Embed = "embed",
    /**
     * Indicates to interpret and render the value as a Coda @-reference to a table row. The provided value should
     * be an object whose `id` value matches the id of some row in a sync table. The schema where this hint type is
     * used must specify an identity that specifies the desired sync table.
     *
     * Normally a reference schema is constructed from the schema object being referenced using the helper
     * {@link makeReferenceSchemaFromObjectSchema}.
     *
     * @example
     * ```
     * makeObjectSchema({
     *   type: ValueType.Object,
     *   codaType: ValueHintType.Reference,
     *   identity: {
     *     name: "SomeSyncTableIdentity"
     *   },
     *   id: 'identifier',
     *   primary: 'name',
     *   properties: {
     *     identifier: {type: ValueType.Number, required: true},
     *     name: {type: ValueType.String, required: true},
     *   },
     * });
     * ```
     */
    Reference = "reference",
    /**
     * Indicates to interpret and render a value as a file attachment. The provided value should be a URL
     * pointing to a file of a Coda-supported type. Coda will ingest the file and host it from Coda infrastructure.
     */
    Attachment = "attachment",
    /**
     * Indicates to render a numeric value as a slider UI component.
     */
    Slider = "slider",
    /**
     * Indicates to render a numeric value as a scale UI component (e.g. a star rating).
     */
    Scale = "scale"
}
export declare const StringHintValueTypes: readonly [ValueHintType.Attachment, ValueHintType.Date, ValueHintType.Time, ValueHintType.DateTime, ValueHintType.Duration, ValueHintType.Embed, ValueHintType.Html, ValueHintType.ImageReference, ValueHintType.ImageAttachment, ValueHintType.Markdown, ValueHintType.Url];
export declare const NumberHintValueTypes: readonly [ValueHintType.Date, ValueHintType.Time, ValueHintType.DateTime, ValueHintType.Percent, ValueHintType.Currency, ValueHintType.Slider, ValueHintType.Scale];
export declare const ObjectHintValueTypes: readonly [ValueHintType.Person, ValueHintType.Reference];
/**  The subset of {@link ValueHintType} that can be used with a string value. */
export declare type StringHintTypes = typeof StringHintValueTypes[number];
/**  The subset of {@link ValueHintType} that can be used with a number value. */
export declare type NumberHintTypes = typeof NumberHintValueTypes[number];
/**  The subset of {@link ValueHintType} that can be used with an object value. */
export declare type ObjectHintTypes = typeof ObjectHintValueTypes[number];
interface BaseSchema {
    /**
     * A explanation of this object schema property shown to the user in the UI.
     *
     * If your pack has an object schema with many properties, it may be useful to
     * explain the purpose or contents of any property that is not self-evident.
     */
    description?: string;
}
/**
 * A schema representing a return value or object property that is a boolean.
 */
export interface BooleanSchema extends BaseSchema {
    /** Identifies this schema as relating to a boolean value. */
    type: ValueType.Boolean;
}
/**
 * The union of all schemas that can represent number values.
 */
export declare type NumberSchema = CurrencySchema | SliderSchema | ScaleSchema | NumericSchema | NumericDateSchema | NumericTimeSchema | NumericDateTimeSchema;
export interface BaseNumberSchema<T extends NumberHintTypes = NumberHintTypes> extends BaseSchema {
    /** Identifies this schema as relating to a number value. */
    type: ValueType.Number;
    /** An optional type hint instructing Coda about how to interpret or render this value. */
    codaType?: T;
}
/**
 * A schema representing a return value or object property that is a numeric value,
 * i.e. a raw number with an optional decimal precision.
 */
export interface NumericSchema extends BaseNumberSchema {
    /** If specified, instructs Coda to render this value as a percentage. */
    codaType?: ValueHintType.Percent;
    /** The decimal precision. The number will be rounded to this precision when rendered. */
    precision?: number;
    /** If specified, will render thousands separators for large numbers, e.g. `1,234,567.89`. */
    useThousandsSeparator?: boolean;
}
/**
 * A schema representing a return value or object property that is provided as a number,
 * which Coda should interpret as a date. The given number should be in seconds since the Unix epoch.
 */
export interface NumericDateSchema extends BaseNumberSchema<ValueHintType.Date> {
    /** Instructs Coda to render this value as a date. */
    codaType: ValueHintType.Date;
    /**
     * A Moment date format string, such as 'MMM D, YYYY', that corresponds to a supported Coda date column format,
     * used when rendering the value.
     *
     * Only applies when this is used as a sync table property.
     */
    format?: string;
}
/**
 * A schema representing a return value or object property that is provided as a number,
 * which Coda should interpret as a time. The given number should be in seconds since the Unix epoch.
 * While this is a full datetime, only the time component will be rendered, so the date used is irrelevant.
 */
export interface NumericTimeSchema extends BaseNumberSchema<ValueHintType.Time> {
    /** Instructs Coda to render this value as a time. */
    codaType: ValueHintType.Time;
    /**
     * A Moment time format string, such as 'HH:mm:ss', that corresponds to a supported Coda time column format,
     * used when rendering the value.
     *
     * Only applies when this is used as a sync table property.
     */
    format?: string;
}
/**
 * A schema representing a return value or object property that is provided as a number,
 * which Coda should interpret as a datetime. The given number should be in seconds since the Unix epoch.
 */
export interface NumericDateTimeSchema extends BaseNumberSchema<ValueHintType.DateTime> {
    /** Instructs Coda to render this value as a datetime. */
    codaType: ValueHintType.DateTime;
    /**
     * A Moment date format string, such as 'MMM D, YYYY', that corresponds to a supported Coda date column format.
     *
     * Only applies when this is used as a sync table property.
     */
    dateFormat?: string;
    /**
     * A Moment time format string, such as 'HH:mm:ss', that corresponds to a supported Coda time column format,
     * used when rendering the value.
     *
     * Only applies when this is used as a sync table property.
     */
    timeFormat?: string;
}
/**
 * Enumeration of formats supported by schemas that use {@link ValueHintType.Currency}.
 *
 * These affect how a numeric value is rendered in docs.
 */
export declare enum CurrencyFormat {
    /**
     * Indicates the value should be rendered as a number with a currency symbol as a prefix, e.g. `$2.50`.
     */
    Currency = "currency",
    /**
     * Indicates the value should be rendered as a number with a currency symbol as a prefix, but padded
     * to allow the numeric values to line up vertically, e.g.
     *
     * ```
     * $       2.50
     * $      29.99
     * ```
     */
    Accounting = "accounting",
    /**
     * Indicates the value should be rendered as a number without a currency symbol, e.g. `2.50`.
     */
    Financial = "financial"
}
/**
 * A schema representing a return value or object property that is an amount of currency.
 */
export interface CurrencySchema extends BaseNumberSchema<ValueHintType.Currency> {
    /** Instructs Coda to render this value as a currency amount. */
    codaType: ValueHintType.Currency;
    /** The decimal precision. The value is rounded to this precision when rendered. */
    precision?: number;
    /**
     * A three-letter ISO 4217 currency code, e.g. USD or EUR.
     * If the currency code is not supported by Coda, the value will be rendered using USD.
     */
    currencyCode?: string;
    /** A render format for further refining how the value is rendered. */
    format?: CurrencyFormat;
}
/**
 * A schema representing a return value or object property that is a number that should
 * be rendered as a slider.
 */
export interface SliderSchema extends BaseNumberSchema<ValueHintType.Slider> {
    /** Instructs Coda to render this value as a slider. */
    codaType: ValueHintType.Slider;
    /** The minimum value selectable by this slider. */
    minimum?: number | string;
    /** The maximum value selectable by this slider. */
    maximum?: number | string;
    /** The minimum amount the slider can be moved when dragged. */
    step?: number | string;
}
/**
 * Icons that can be used with a {@link ScaleSchema}.
 *
 * For example, to render a star rating, use a {@link ScaleSchema} with `icon: coda.ScaleIconSet.Star`.
 */
export declare enum ScaleIconSet {
    Star = "star",
    Circle = "circle",
    Fire = "fire",
    Bug = "bug",
    Diamond = "diamond",
    Bell = "bell",
    ThumbsUp = "thumbsup",
    Heart = "heart",
    Chili = "chili",
    Smiley = "smiley",
    Lightning = "lightning",
    Currency = "currency",
    Coffee = "coffee",
    Person = "person",
    Battery = "battery",
    Cocktail = "cocktail",
    Cloud = "cloud",
    Sun = "sun",
    Checkmark = "checkmark",
    LightBulb = "lightbulb"
}
/**
 * A schema representing a return value or object property that is a number that should
 * be rendered as a scale.
 *
 * A scale is a widget with a repeated set of icons, where the number of shaded represents
 * a numeric value. The canonical example of a scale is a star rating, which might show
 * 5 star icons, with 3 of them shaded, indicating a value of 3.
 */
export interface ScaleSchema extends BaseNumberSchema<ValueHintType.Scale> {
    /** Instructs Coda to render this value as a scale. */
    codaType: ValueHintType.Scale;
    /** The number of icons to render. */
    maximum?: number;
    /** The icon to render. */
    icon?: ScaleIconSet;
}
/**
 * A schema representing a return value or object property that is provided as a string,
 * which Coda should interpret as a date. Coda is able to flexibly a parse number of formal
 * and informal string representations of dates. For maximum accuracy, consider using an
 * ISO 8601 date string (e.g. 2021-10-29): https://en.wikipedia.org/wiki/ISO_8601.
 */
export interface StringDateSchema extends BaseStringSchema<ValueHintType.Date> {
    /** Instructs Coda to render this value as a date. */
    codaType: ValueHintType.Date;
    /**
     * A Moment date format string, such as 'MMM D, YYYY', that corresponds to a supported Coda date column format,
     * used when rendering the value.
     *
     * Only applies when this is used as a sync table property.
     */
    format?: string;
}
/**
 * A schema representing a return value or object property that is provided as a string,
 * which Coda should interpret as a time.
 */
export interface StringTimeSchema extends BaseStringSchema<ValueHintType.Time> {
    /** Instructs Coda to render this value as a date. */
    codaType: ValueHintType.Time;
    /**
     * A Moment time format string, such as 'HH:mm:ss', that corresponds to a supported Coda time column format,
     * used when rendering the value.
     *
     * Only applies when this is used as a sync table property.
     */
    format?: string;
}
/**
 * A schema representing a return value or object property that is provided as a string,
 * which Coda should interpret as a datetime. Coda is able to flexibly a parse number of formal
 * and informal string representations of dates. For maximum accuracy, consider using an
 * ISO 8601 datetime string (e.g. 2021-11-03T19:43:58): https://en.wikipedia.org/wiki/ISO_8601.
 */
export interface StringDateTimeSchema extends BaseStringSchema<ValueHintType.DateTime> {
    /** Instructs Coda to render this value as a date. */
    codaType: ValueHintType.DateTime;
    /**
     * A Moment date format string, such as 'MMM D, YYYY', that corresponds to a supported Coda date column format,
     * used when rendering the value.
     *
     * Only applies when this is used as a sync table property.
     */
    dateFormat?: string;
    /**
     * A Moment time format string, such as 'HH:mm:ss', that corresponds to a supported Coda time column format,
     * used when rendering the value.
     *
     * Only applies when this is used as a sync table property.
     */
    timeFormat?: string;
}
/**
 * Enumeration of units supported by duration schemas. See {@link maxUnit}.
 */
export declare enum DurationUnit {
    /**
     * Indications a duration as a number of days.
     */
    Days = "days",
    /**
     * Indications a duration as a number of hours.
     */
    Hours = "hours",
    /**
     * Indications a duration as a number of minutes.
     */
    Minutes = "minutes",
    /**
     * Indications a duration as a number of seconds.
     */
    Seconds = "seconds"
}
/**
 * A schema representing a return value or object property that represents a duration. The value
 * should be provided as a string like "3 days" or "40 minutes 30 seconds".
 */
export interface DurationSchema extends BaseStringSchema<ValueHintType.Duration> {
    /**
     * A refinement of {@link maxUnit} to use for rounding the duration when rendering.
     * Currently only `1` is supported, which is the same as omitting a value.
     */
    precision?: number;
    /**
     * The unit to use for rounding the duration when rendering. For example, if using `DurationUnit.Days`,
     * and a value of "3 days 4 hours" is provided, it will be rendered as "3 days".
     */
    maxUnit?: DurationUnit;
}
export interface BaseStringSchema<T extends StringHintTypes = StringHintTypes> extends BaseSchema {
    /** Identifies this schema as a string. */
    type: ValueType.String;
    /** An optional type hint instructing Coda about how to interpret or render this value. */
    codaType?: T;
}
/**
 * The subset of StringHintTypes that don't have specific schema attributes.
 */
export declare const SimpleStringHintValueTypes: readonly [ValueHintType.Attachment, ValueHintType.Embed, ValueHintType.Html, ValueHintType.ImageReference, ValueHintType.ImageAttachment, ValueHintType.Markdown, ValueHintType.Url];
export declare type SimpleStringHintTypes = typeof SimpleStringHintValueTypes[number];
/**
 * A schema whose underlying value is a string, along with an optional hint about how Coda
 * should interpret that string.
 */
export interface SimpleStringSchema<T extends SimpleStringHintTypes = SimpleStringHintTypes> extends BaseStringSchema<T> {
}
/**
 * The union of schema definition types whose underlying value is a string.
 */
export declare type StringSchema = StringDateSchema | StringTimeSchema | StringDateTimeSchema | DurationSchema | SimpleStringSchema;
/**
 * A schema representing a return value or object property that is an array (list) of items.
 * The items are themselves schema definitions, which may refer to scalars or other objects.
 */
export interface ArraySchema<T extends Schema = Schema> extends BaseSchema {
    /** Identifies this schema as an array. */
    type: ValueType.Array;
    /** A schema for the items of this array. */
    items: T;
}
/**
 * Fields that may be set on a schema property in the {@link properties} definition
 * of an object schema.
 */
export interface ObjectSchemaProperty {
    /**
     * The name of a field in a return value object that should be re-mapped to this property.
     * This provides a way to rename fields from API responses without writing code.
     *
     * Suppose that you're fetching an object from an API that has a property called "duration".
     * But in your pack, you'd like the value to be called "durationSeconds" to be more precise.
     * You could write code in your `execute` function to relabel the field, but you could
     * also use `fromKey` and Coda will do it for you.
     *
     * Suppose your `execute` function looked like this:
     * ```
     * execute: async function(context) {
     *   const response = await context.fetcher.fetch({method: "GET", url: "/api/some-entity"});
     *   // Suppose the body of the response looks like {duration: 123, name: "foo"}.
     *   return response.body;
     * }
     * ```
     *
     * You can define your schema like this:
     * ```
     * coda.makeObjectSchema({
     *   properties: {
     *     name: {type: coda.ValueType.String},
     *     durationSeconds: {type: coda.ValueType.Number, fromKey: "duration"},
     *   },
     * });
     * ```
     *
     * This tells Coda to transform your formula's return value, creating a field "durationSeconds"
     * whose value comes another field called "duration".
     */
    fromKey?: string;
    /**
     * When true, indicates that an object return value for a formula that has this schema must
     * include a non-empty value for this property.
     */
    required?: boolean;
}
/**
 * The type of the {@link properties} in the definition of an object schema.
 * This is essentially a dictionary mapping the name of a property to a schema
 * definition for that property.
 */
export declare type ObjectSchemaProperties<K extends string = never> = {
    [K2 in K | string]: Schema & ObjectSchemaProperty;
};
/** @hidden */
export declare type GenericObjectSchema = ObjectSchema<string, string>;
/**
 * An identifier for a schema, allowing other schemas to reference it.
 *
 * You may optionally specify an {@link ObjectSchemaDefinition.identity} when defining an object schema.
 * This signals that this schema represents an important named entity in the context of your pack.
 * Schemas with identities may be referenced by other schemas, in which case Coda
 * will render such values as @-references in the doc, allowing you to create relationships
 * between entities.
 *
 * Every sync table's top-level schema is required to have an identity. However, an identity
 * will be created on your behalf using the {@link SyncTableOptions.identityName} that you provide in the sync
 * table definition, so you needn't explicitly create on unless desired.
 */
export interface IdentityDefinition {
    /**
     * The name of this entity. This is an arbitrary name but should be unique within your pack.
     * For example, if you are defining a schema that represents a user object, "User" would be a good identity name.
     */
    name: string;
    /**
     * The dynamic URL, if this is a schema for a dynamic sync table. When returning a schema from the
     * {@link DynamicSyncTableOptions.getSchema} formula of a dynamic sync table, you must include
     * the dynamic URL of that table, so that rows
     * in this table may be distinguished from rows in another dynamic instance of the same table.
     *
     * When creating a reference to a dynamic sync table, you must include the dynamic URL of the table
     * you wish to reference, again to distinguish which table instance you are trying to reference.
     */
    dynamicUrl?: string;
    /**
     * Attribution text, images, and/or links that should be rendered along with this value.
     *
     * See {@link makeAttributionNode}.
     */
    attribution?: AttributionNode[];
    /** The ID of another pack, if you are trying to reference a value from different pack. */
    packId?: number;
}
/** The runtime version of IdentityDefinition with a pack ID injected. */
export interface Identity extends IdentityDefinition {
    packId: number;
}
/**
 * A schema definition for an object value (a value with key-value pairs).
 */
export interface ObjectSchemaDefinition<K extends string, L extends string> extends BaseSchema {
    /** Identifies this schema as an object schema. */
    type: ValueType.Object;
    /** Definintion of the key-value pairs in this object. */
    properties: ObjectSchemaProperties<K | L>;
    /**
     * The name of a property within {@link properties} that represents a unique id for this object.
     * Sync table schemas must specify an id property, which uniquely identify each synced row.
     */
    id?: K;
    /**
     * The name of a property within {@link properties} that be used to label this object in the UI.
     * Object values can contain many properties and the Coda UI will display them as a "chip"
     * with only the value of the "primary" property used as the chip's label. The other properties
     * can be seen when hovering over the chip.
     */
    primary?: K;
    /**
     * A hint for how Coda should interpret and render this object value.
     *
     * For example, an object can represent a person (user) in a Coda doc, with properties for the
     * email address of the person and their name. Using `ValueHintType.Person` tells Coda to
     * render such a value as an @-reference to that person, rather than a basic object schip.
     */
    codaType?: ObjectHintTypes;
    /**
     * A list of property names from within {@link properties} for the "featured" properties
     * of this object, used in sync tables. When a sync table is first added to a document,
     * columns are created for each of the featured properties. The user can easily add additional
     * columns for any other properties, as desired.
     *
     * This distinction exists for cases where a sync table may include dozens of properties,
     * which would create a very wide table that is difficult to use. Featuring properties
     * allows a sync table to be created with the most useful columns created by default,
     * and the user can add additional columns as they find them useful.
     *
     * Non-featured properties can always be referenced in formulas regardless of whether column
     * projections have been created for them.
     */
    featured?: L[];
    /**
     * An identity for this schema, if this schema is important enough to be named and referenced.
     * See {@link IdentityDefinition}.
     */
    identity?: IdentityDefinition;
}
export declare type ObjectSchemaDefinitionType<K extends string, L extends string, T extends ObjectSchemaDefinition<K, L>> = ObjectSchemaType<T>;
/** @hidden */
export interface ObjectSchema<K extends string, L extends string> extends ObjectSchemaDefinition<K, L> {
    identity?: Identity;
}
/**
 * The type of content in this attribution node.
 *
 * Multiple attribution nodes can be rendered all together, for example to have
 * attribution that contains both text and a logo image.
 */
export declare enum AttributionNodeType {
    /**
     * Text attribution content.
     */
    Text = 1,
    /**
     * A hyperlink pointing to the data source.
     */
    Link = 2,
    /**
     * An image, often a logo of the data source.
     */
    Image = 3
}
/**
 * An attribution node that simply renders some text.
 *
 * This might be used to attribute the data source.
 *
 * @example
 * ```
 * coda.makeAttributionNode({
 *   type: coda.AttributionNodeType.Text,
 *   text: "Data provided by ExampleCorp.",
 * });
 * ```
 */
export interface TextAttributionNode {
    /** Identifies this as a text attribution node. */
    type: AttributionNodeType.Text;
    /** The text to render with the pack value. */
    text: string;
}
/**
 * An attribution node that renders a hyperlink.
 *
 * This might be used to attribute the data source and link back to the home page
 * of the data source or directly to the source data.
 *
 * @example
 * ```
 * coda.makeAttributionNode({
 *   type: coda.AttributionNodeType.Link,
 *   anchorUrl: "https://example.com",
 *   anchorText: "Data provided by ExampleCorp.",
 * });
 * ```
 */
export interface LinkAttributionNode {
    /** Identifies this as a link attribution node. */
    type: AttributionNodeType.Link;
    /** The URL to link to. */
    anchorUrl: string;
    /** The text of the hyperlink. */
    anchorText: string;
}
/**
 * An attribution node that renders as a hyperlinked image.
 *
 * This is often the logo of the data source along with a link back to the home page
 * of the data source or directly to the source data.
 *
 * @example
 * ```
 * coda.makeAttributionNode({
 *   type: coda.AttributionNodeType.Image,
 *   anchorUrl: "https://example.com",
 *   imageUrl: "https://example.com/assets/logo.png",
 * });
 * ```
 */
export interface ImageAttributionNode {
    /** Identifies this as an image attribution node. */
    type: AttributionNodeType.Image;
    /** The URL to link to. */
    anchorUrl: string;
    /** The URL of the image to render. */
    imageUrl: string;
}
/**
 * Union of attribution node types for rendering attribution for a pack value. See {@link makeAttributionNode}.
 */
export declare type AttributionNode = TextAttributionNode | LinkAttributionNode | ImageAttributionNode;
/**
 * A helper for constructing attribution text, links, or images that render along with a Pack value.
 *
 * Many APIs have licensing requirements that ask for specific attribution to be included
 * when using their data. For example, a stock photo API may require attribution text
 * and a logo.
 *
 * Any {@link IdentityDefinition} can include one or more attribution nodes that will be
 * rendered any time a value with that identity is rendered in a doc.
 */
export declare function makeAttributionNode<T extends AttributionNode>(node: T): T;
/**
 * The union of all of the schema types supported for return values and object properties.
 */
export declare type Schema = BooleanSchema | NumberSchema | StringSchema | ArraySchema | GenericObjectSchema;
export declare function isObject(val?: Schema): val is GenericObjectSchema;
export declare function isArray(val?: Schema): val is ArraySchema;
declare type PickOptional<T, K extends keyof T> = Partial<T> & {
    [P in K]: T[P];
};
interface StringHintTypeToSchemaTypeMap {
    [ValueHintType.Date]: Date | string | number;
}
declare type StringHintTypeToSchemaType<T extends StringHintTypes | undefined> = T extends keyof StringHintTypeToSchemaTypeMap ? StringHintTypeToSchemaTypeMap[T] : string;
declare type SchemaWithNoFromKey<T extends ObjectSchemaDefinition<any, any>> = {
    [K in keyof T['properties'] as T['properties'][K] extends {
        fromKey: string;
    } ? never : K]: T['properties'][K];
};
declare type SchemaFromKeyWildCard<T extends ObjectSchemaDefinition<any, any>> = {
    [K in keyof T['properties'] as T['properties'][K] extends {
        fromKey: string;
    } ? string : never]: any;
};
declare type ObjectSchemaNoFromKeyType<T extends ObjectSchemaDefinition<any, any>, P extends SchemaWithNoFromKey<T> = SchemaWithNoFromKey<T>> = PickOptional<{
    [K in keyof P]: SchemaType<P[K]>;
}, $Values<{
    [K in keyof P]: P[K] extends {
        required: true;
    } ? K : never;
}>>;
declare type ObjectSchemaType<T extends ObjectSchemaDefinition<any, any>> = ObjectSchemaNoFromKeyType<T> & SchemaFromKeyWildCard<T>;
/**
 * A TypeScript helper that parses the expected `execute` function return type from a given schema.
 * That is, given a schema, this utility will produce the type that an `execute` function should return
 * in order to fulfill the schema.
 *
 * For example, `SchemaType<NumberSchema>` produces the type `number`.
 *
 * For an object schema, this will for the most part return an object matching the schema
 * but if the schema uses {@link fromKey} then this utility will be unable to infer
 * that the return value type should use the property names given in the `fromKey`
 * attribute, and will simply relax any property name type-checking in such a case.
 *
 * This utility is very optional and only useful for advanced cases of strong typing.
 * It can be helpful for adding type-checking for the return value of an `execute` function
 * to ensure that it matches the schema you have declared for that formula.
 */
export declare type SchemaType<T extends Schema> = T extends BooleanSchema ? boolean : T extends NumberSchema ? number : T extends StringSchema ? StringHintTypeToSchemaType<T['codaType']> : T extends ArraySchema ? Array<SchemaType<T['items']>> : T extends GenericObjectSchema ? ObjectSchemaType<T> : never;
/** Primitive types for which {@link generateSchema} can infer a schema. */
export declare type InferrableTypes = boolean | number | string | object | boolean[] | number[] | string[] | object[];
/**
 * Utility that examines a JavaScript value and attempts to infer a schema definition
 * that describes it.
 *
 * It is vastly preferable to define a schema manually. A clear and accurate schema is one of the
 * fundamentals of a good pack. However, for data that is truly dynamic for which a schema can't
 * be known in advance nor can a function be written to generate a dynamic schema from other
 * inputs, it may be useful to us this helper to sniff the return value and generate a basic
 * inferred schema from it.
 *
 * This utility does NOT attempt to determine {@link id} or {@link primary} attributes for
 * an object schema, those are left undefined.
 */
export declare function generateSchema(obj: InferrableTypes): Schema;
/**
 * A wrapper for creating any schema definition.
 *
 * If you are creating a schema for an object (as opposed to a scalar or array),
 * use the more specific {@link makeObjectSchema}.
 *
 * It is always recommended to use wrapper functions for creating top-level schema
 * objects rather than specifying object literals. Wrappers validate your schemas
 * at creation time, provide better TypeScript type inference, and can reduce
 * boilerplate.
 *
 * At this time, this wrapper provides only better TypeScript type inference,
 * but it may do validation in a future SDK version.
 *
 * @example
 * ```
 * coda.makeSchema({
 *   type: coda.ValueType.Array,
 *   items: {type: coda.ValueType.String},
 * });
 * ```
 */
export declare function makeSchema<T extends Schema>(schema: T): T;
export declare const PlaceholderIdentityPackId = -1;
/**
 * A wrapper for creating a schema definition for an object value.
 *
 * It is always recommended to use wrapper functions for creating top-level schema
 * objects rather than specifying object literals. Wrappers validate your schemas
 * at creation time, provide better TypeScript type inference, and can reduce
 * boilerplate.
 *
 * @example
 * ```
 * coda.makeObjectSchema({
 *   id: "email",
 *   primary: "name",
 *   properties: {
 *     email: {type: coda.ValueType.String, required: true},
 *     name: {type: coda.ValueType.String, required: true},
 *   },
 * });
 * ```
 */
export declare function makeObjectSchema<K extends string, L extends string, T extends Omit<ObjectSchemaDefinition<K, L>, 'type'>>(schemaDef: T & {
    type?: ValueType.Object;
}): Omit<T, 'identity'> & {
    identity?: Identity;
    type: ValueType.Object;
};
export declare function normalizeSchemaKey(key: string): string;
export declare function normalizeSchema<T extends Schema>(schema: T): T;
/**
 * Convenience for creating a reference object schema from an existing schema for the
 * object. Copies over the identity, id, and primary from the schema, and the subset of
 * properties indicated by the id and primary.
 * A reference schema can always be defined directly, but if you already have an object
 * schema it provides better code reuse to derive a reference schema instead.
 */
export declare function makeReferenceSchemaFromObjectSchema(schema: GenericObjectSchema, identityName?: string): GenericObjectSchema;
export {};
