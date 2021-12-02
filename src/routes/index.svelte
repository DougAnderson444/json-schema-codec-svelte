<script>
	import { onMount } from 'svelte';

	import { schema } from '$lib/schemas';

	let element, jsoneditor, validateTextarea, schemaFromObject;

	onMount(async () => {
		const Buffer = await import('buffer');
		global.Buffer = Buffer.Buffer;

		const Process = await import('process');
		global.process = Process.default;

		const {
			quicktype,
			InputData,
			jsonInputForTargetLanguage,
			JSONSchemaInput,
			FetchingJSONSchemaStore
		} = await import('quicktype-core');

		async function quicktypeJSON(targetLanguage, typeName, jsonString) {
			const jsonInput = jsonInputForTargetLanguage(targetLanguage);

			// We could add multiple samples for the same desired
			// type, or many sources for other types. Here we're
			// just making one type from one piece of sample JSON.
			await jsonInput.addSource({
				name: typeName,
				samples: [jsonString]
			});

			const inputData = new InputData();
			inputData.addInput(jsonInput);

			return await quicktype({
				inputData,
				allPropertiesOptional: true,
				lang: targetLanguage
			});
		}

		const { JSONEditor } = await import('@json-editor/json-editor');
		// Set an option during instantiation
		jsoneditor = new JSONEditor(element, {
			schema,
			theme: 'html',
			disable_edit_json: true,
			disable_properties: true
		});

		// listen for changes
		jsoneditor.on('change', async function () {
			// output
			json = jsoneditor.getValue();
			console.log({ jsoneditor });

			// validate
			var validationErrors = jsoneditor.validate();
			if (validationErrors.length) {
				validateTextarea = JSON.stringify(validationErrors, null, 2);
			} else {
				validateTextarea = 'valid';
			}

			// schema from json object
			const resp = await quicktypeJSON('schema', 'Contact', JSON.stringify(json));
			console.log({ resp });
			schemaFromObject = JSON.parse(resp.lines.join('\n'));
			console.log({ schemaFromObject });
		});
	});
	let json;

	$: if (jsoneditor && jsoneditor.getValue()) {
		json = jsoneditor.getValue();
	}
</script>

<svelte:head>
	<script>
		global = globalThis; // for solana web3 repo
	</script>
</svelte:head>
<h1>Schema Codec - Code and Decode JSON Schema from Forms to Components</h1>
<p>
	Visit <a href="https://json-schema.org/">https://json-schema.org/</a> to read the documentation
</p>

<div class="container">
	<div bind:this={element} />
</div>
<h2>JSON</h2>
{#if json}
	<div class="code">
		<pre>
            <code>
                {JSON.stringify(json, null, 2)}
            </code>
        </pre>
	</div>
{/if}
{#if json}
	<h2>schemaFromObject</h2>
	<div class="code">
		<pre>
            <code>
{JSON.stringify(schemaFromObject, null, 2)}
            </code>
        </pre>
	</div>
{/if}

<h2>Validate</h2>
<textarea bind:value={validateTextarea} />

<h2>Schema</h2>

{#if jsoneditor}
	<div class="code">
		<pre>
            <code>
                {JSON.stringify(jsoneditor.schema, null, 2)}
            </code>
        </pre>
	</div>
{/if}
