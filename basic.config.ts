export const schema = {
    project_id: 'dd6a46ba-4d1e-415a-8c5a-f3f3930d4567',
    version: 0,
    tables: {
      drugs: {
        type: 'collection',
        fields: {
          drugName: {
            type: 'string',
            indexed: true,
          }
        }
      }
    }
}