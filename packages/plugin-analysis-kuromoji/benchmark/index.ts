import cluster from 'node:cluster';
import { readFileSync, writeFileSync } from 'node:fs';
import { availableParallelism } from 'node:os';
import DynamoSearch from 'dynamosearch';
import KuromojiAnalyzer from '../dist/analyzers/KuromojiAnalyzer.js';
import { asyncBufferFromFile, parquetReadObjects } from 'hyparquet';

const main = async () => {
  if (cluster.isPrimary) {
    // const file = await asyncBufferFromFile('./shopping_queries_dataset_examples.parquet');
    const file = await asyncBufferFromFile('./shopping_queries_dataset_products.parquet');
    // const file = await asyncBufferFromUrl({ url: 'https://github.com/amazon-science/esci-data/raw/refs/heads/main/shopping_queries_dataset/shopping_queries_dataset_products.parquet' });
    const data = await parquetReadObjects({ file });

    const analyzer = await KuromojiAnalyzer.getInstance();
    const dynamosearch = new DynamoSearch({
      indexTableName: 'dynamosearch-test',
      attributes: [
        { name: 'product_title', analyzer },
        { name: 'product_description', analyzer },
      ],
      keys: [
        { name: 'product_id', type: 'HASH' },
      ],
    });
    await dynamosearch.deleteIndexTable();
    await dynamosearch.createIndexTable();

    const products = data.filter(({ product_locale }) => product_locale === 'jp');

    const numCPUs = availableParallelism();
    const progress: number[] = new Array(numCPUs).fill(0);
    cluster.on('message', (worker, message) => {
      progress[worker.id - 1] = message.processed;
      const processed = progress.reduce((a, b) => a + b, 0);
      process.stdout.write(`${processed} / ${products.length}\r`);
    });

    for (let i = 0; i < numCPUs; i++) {
      let lines = '';
      for (let j = Math.floor(products.length * (i / numCPUs)); j < Math.floor(products.length * ((i + 1) / numCPUs)); j++) {
        lines += JSON.stringify(products[j]) + '\n';
      }
      writeFileSync(`./${i + 1}.jsonl`, lines);
      cluster.fork();
    }
  } else {
    const lines = readFileSync(`./${cluster.worker?.id}.jsonl`, 'utf8').split('\n').filter(Boolean);
    const products = lines.map(line => JSON.parse(line));

    const analyzer = await KuromojiAnalyzer.getInstance();
    for (let i = 0; i < products.length; i += 100) {
      const dynamosearch = new DynamoSearch({
        indexTableName: 'dynamosearch-test',
        attributes: [
          { name: 'product_title', analyzer },
          { name: 'product_description', analyzer },
        ],
        keys: [
          { name: 'product_id', type: 'HASH' },
        ],
      });
      await dynamosearch.processRecords(products.slice(i, i + 100).map((product) => ({
        eventName: 'INSERT',
        dynamodb: {
          Keys: {
            product_id: { S: product.product_id },
          },
          NewImage: {
            product_id: { S: product.product_id },
            product_title: { S: product.product_title },
            product_description: { S: product.product_description },
          },
        },
      })));
      process.send?.({ total: products.length, processed: i + 100 });
    }
  }
};

main();
