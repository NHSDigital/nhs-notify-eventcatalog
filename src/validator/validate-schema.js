import Ajv from 'ajv/dist/2020.js';
import fetch from 'node-fetch';
import jsf from 'json-schema-faker';
import $RefParser from '@apidevtools/json-schema-ref-parser';

const ajv = new Ajv({ strict: false });
const url = 'https://raw.githubusercontent.com/NHSDigital/nhs-notify-standards/refs/heads/main/cloudevents/example.json';

// Add cache-busting query param
const bustUrl = url + '?cacheBust=' + Date.now();

fetch(bustUrl, { cache: 'no-store' })
  .then(res => res.json())
  .then(schema => $RefParser.dereference(bustUrl, schema, { resolve: { http: { cache: false } } }))
  .then(dereferencedSchema => {
    const valid = ajv.validateSchema(dereferencedSchema);
    if (valid) {
      console.log('Schema is valid!');
      // Force the use of the 'data' property in the example
      const example = jsf.generate({
        ...dereferencedSchema,
        required: ['data'],
        properties: {
          ...dereferencedSchema.properties,
          data: dereferencedSchema.properties.data
        }
      });
      console.log('Example object:', JSON.stringify(example, null, 2));
    } else {
      console.error('Schema is invalid:', ajv.errors);
    }
  })
  .catch(err => {
    console.error('Failed to fetch or dereference schema:', err);
  });
