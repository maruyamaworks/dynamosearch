import DynamoSearch from 'dynamosearch';
import KuromojiAnalyzer from '@dynamosearch/plugin-analysis-kuromoji/analyzers/KuromojiAnalyzer.js';
import { asyncBufferFromFile, parquetReadObjects } from 'hyparquet';

if (!process.argv[2]) {
  throw new Error('Please provide a search query as the first argument.');
}
console.log('loading parquet file...');
const file = await asyncBufferFromFile('./shopping_queries_dataset_products.parquet');
const products = await parquetReadObjects({ file });
console.log(`${products.length} products loaded`);

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
console.time('Query Time');
const { items, consumedCapacity } = await dynamosearch.search(process.argv[2], {
  attributes: ['product_title', 'product_description'],
  maxItems: 10,
});
console.log('\n======== RESULTS ========');
console.timeEnd('Query Time');
console.log('Consumed Capacity:', consumedCapacity.capacityUnits);
console.log('Search Results:', items.map(({ keys, score }) => {
  const product = products.find((item) => item.product_id === keys.product_id.S)
  return { score, title: product?.product_title };
}));
