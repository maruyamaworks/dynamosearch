import cluster from 'node:cluster';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { availableParallelism } from 'node:os';
import DynamoSearch from 'dynamosearch';
import KuromojiAnalyzer from '@dynamosearch/plugin-analysis-kuromoji/analyzers/KuromojiAnalyzer.js';
import { asyncBufferFromFile, parquetReadObjects } from 'hyparquet';

if (cluster.isPrimary) {
  console.log('loading parquet file...');
  const file = await asyncBufferFromFile('./shopping_queries_dataset_products.parquet');
  const products = (await parquetReadObjects({ file })).filter(item => item.product_locale === 'jp');
  console.log(`${products.length} products loaded`);

  const numCPUs = availableParallelism();
  const progress: number[] = new Array(numCPUs).fill(0);
  const inserted: number[] = new Array(numCPUs).fill(null);
  const resultMap = new Map<string, number>();

  cluster.on('message', async (worker, message) => {
    if (message.status === 'PROCESSING') {
      progress[worker.id - 1] = message.processed;
      const processed = progress.reduce((a, b) => a + b, 0);
      process.stdout.write(`[${(processed / products.length * 100).toFixed(1).toString().padStart(5)}%] ${processed} of ${products.length} products analyzed\r`);
    }
    if (message.status === 'FINISHED') {
      inserted[worker.id - 1] = message.inserted;
      Object.keys(message.resultMap).forEach((attributeName) => {
        resultMap.set(attributeName, (resultMap.get(attributeName) ?? 0) + message.resultMap[attributeName]);
      });
      if (inserted.every(value => typeof value === 'number')) {
        const metadata = {
          [DynamoSearch.ATTR_PK]: { S: '_' },
          [DynamoSearch.ATTR_SK]: { B: Buffer.alloc(1).toString('base64') },
          [DynamoSearch.ATTR_META_DOCUMENT_COUNT]: { N: inserted.reduce((a, b) => a + b, 0).toString() },
          [`${DynamoSearch.ATTR_META_TOKEN_COUNT}:t`]: { N: (resultMap.get('product_title') ?? 0).toString() },
          [`${DynamoSearch.ATTR_META_TOKEN_COUNT}:d`]: { N: (resultMap.get('product_description') ?? 0).toString() },
          [`${DynamoSearch.ATTR_META_TOKEN_COUNT}:p`]: { N: (resultMap.get('product_bullet_point') ?? 0).toString() },
          [`${DynamoSearch.ATTR_META_TOKEN_COUNT}:b`]: { N: (resultMap.get('product_brand') ?? 0).toString() },
          [`${DynamoSearch.ATTR_META_TOKEN_COUNT}:c`]: { N: (resultMap.get('product_color') ?? 0).toString() },
        };
        await writeFile('./outputs/metadata.jsonl', JSON.stringify({ Item: metadata }) + '\n');
        process.exit(0);
      }
    }
  });
  await mkdir('./inputs', { recursive: true });
  await mkdir('./outputs', { recursive: true });

  for (let i = 0; i < numCPUs; i++) {
    let lines = '';
    for (let j = Math.floor(products.length * (i / numCPUs)); j < Math.floor(products.length * ((i + 1) / numCPUs)); j++) {
      lines += JSON.stringify(products[j]) + '\n';
    }
    await writeFile(`./inputs/input${i + 1}.jsonl`, lines);

    cluster.fork();
  }
}

if (cluster.isWorker) {
  const lines = await readFile(`./inputs/input${cluster.worker?.id}.jsonl`, 'utf8');
  const products = lines.split('\n').filter(Boolean).map(line => JSON.parse(line));

  let count = 0;
  const resultMap = new Map<string, number>();

  const analyzer = await KuromojiAnalyzer.getInstance();
  const dynamosearch = new DynamoSearch({
    indexTableName: 'dynamosearch-demo-products-jp-index',
    attributes: [
      { name: 'product_title', shortName: 't', analyzer },
      { name: 'product_description', shortName: 'd', analyzer },
      { name: 'product_bullet_point', shortName: 'p', analyzer },
      { name: 'product_brand', shortName: 'b', analyzer },
      { name: 'product_color', shortName: 'c', analyzer },
    ],
    keys: [
      { name: 'product_id', type: 'HASH' },
    ],
  });

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const { inserted } = await dynamosearch.exportTokensAsFile(`./outputs/output${cluster.worker?.id}.jsonl`, {
      product_id: { S: product.product_id },
      product_title: { S: product.product_title },
      product_description: { S: product.product_description },
      product_bullet_point: { S: product.product_bullet_point },
      product_brand: { S: product.product_brand },
      product_color: { S: product.product_color },
    }, resultMap, false);
    if (inserted > 0) count++;

    process.send?.({
      status: 'PROCESSING',
      processed: i,
      inserted: count,
    });
  }
  process.send?.({
    status: 'FINISHED',
    processed: products.length,
    inserted: count,
    resultMap: Object.fromEntries(resultMap),
  });
}
