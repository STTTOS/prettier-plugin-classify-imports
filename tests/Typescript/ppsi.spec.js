run_spec(__dirname, ["typescript"], {
    importOrder: ['^[./]|(@\/)'],
    importOrderParserPlugins: ['typescript', 'decorators-legacy', 'classProperties']
});
