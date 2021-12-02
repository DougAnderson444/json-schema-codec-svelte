const readonly = true;

export const schema = {
	$id: 'http://json-schema.org/draft-04/schema#',
	$schema: 'http://json-schema.org/draft-04/schema#',
	description: 'Core schema meta-schema',
	$defs: {
		schemaArray: {
			type: 'array',
			minItems: 1,
			items: { $ref: '#' }
		},
		positiveInteger: {
			type: 'integer',
			minimum: 0
		},
		positiveIntegerDefault0: {
			allOf: [{ $ref: '#/definitions/positiveInteger' }, { default: 0 }]
		},
		simpleTypes: {
			enum: ['array', 'boolean', 'integer', 'null', 'number', 'object', 'string']
		},
		stringArray: {
			type: 'array',
			items: { type: 'string' },
			minItems: 1,
			uniqueItems: true
		}
	},
	title: 'Schema Builder',
	type: 'object',
	required: ['context', '@context', '@id', 'class', '@type'],
	properties: {
		'@context': {
			type: 'string',
			template: 'https://schema.org',
			readonly
		},
		person: {
			type: 'array',
			items: {
				type: 'object',
				id: 'arr_item',
				properties: {
					first_name: {
						type: 'string'
					},
					last_name: {
						type: 'string'
					},
					full_name: {
						type: 'string',
						watch: {
							fname: 'arr_item.first_name',
							lname: 'arr_item.last_name'
						}
					}
				}
			}
		},
		context: {
			type: 'string',
			enum: ['@context'],
			readonly
		},
		'@type': {
			type: 'string'
		},
		name: {
			type: 'string'
		},
		'@id': {
			type: 'string',
			template: '{{type}}/{{name}}',
			watch: {
				type: 'type',
				name: 'name'
			},
			readonly
		},
		class: {
			type: 'string',
			enum: [
				'Action',
				'CreativeWork',
				'Event',
				'Intangible',
				'MedicalEntity',
				'Organization',
				'Person',
				'Place',
				'Product'
			],
			default: 'Intangible'
		}
		// contact: {
		//   '$ref': "https://json.schemastore.org/schema-org-action",
		// },
	}
};
