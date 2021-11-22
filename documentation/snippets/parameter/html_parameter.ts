import * as coda from "@codahq/packs-sdk";

let parameters = [
  // BEGIN
  coda.makeParameter({
    type: coda.ParameterType.Html,
    name: "<User-visible name of parameter>",
    description: "<Help text for the parameter>",
  }),
  // END
];
