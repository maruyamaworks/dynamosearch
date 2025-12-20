---
aside: false
---
# Live Demo

This page demonstrates ultra-fast search powered by DynamoSearch on [Amazon's publicly available product dataset](https://github.com/amazon-science/esci-data) containing over 1 million items. Enter a search query below to see results.

<div class="demo-container">
  <div class="locale-toggle-container">
    <fieldset class="locale-toggle">
      <label
        v-for="item in locales"
        :class="['locale-button', { active: locale === item.value }]"
        :key="item.value"
      >
        <button
          @click="locale = item.value; query = ''"
          :disabled="loading"
        >
          <div class="radio"></div>
          <div class="locale-label">
            <div>{{ item.label }}</div>
            <div class="total-count">
              {{ item.total.toLocaleString() }} products
            </div>
          </div>
        </button>
      </label>
    </fieldset>
  </div>

  <div class="search-box">
    <input
      v-model="query"
      @keypress.prevent.enter="allowSubmit"
      @keyup.prevent.enter="performSearch"
      type="text"
      :disabled="loading"
      :placeholder="`Search products (e.g., ${locale === 'us' ? 'wireless headphones, coffee maker...' : locale === 'es' ? 'auriculares inalámbricos, cafetera...' : 'ワイヤレスヘッドフォン、コーヒーメーカー...'})`"
      class="search-input"
    />
    <button @click="onClickSubmit" class="search-button" :disabled="loading">
      {{ loading ? 'Searching...' : 'Search' }}
    </button>
  </div>

  <div v-if="error" class="results-info error">
    <div class="results-info-title">ERROR</div>
    <div class="results-info-content">{{ error }}</div>
  </div>

  <div v-if="results" class="results-info">
    <div class="results-info-title">SUCCESS</div>
    <div class="results-info-content">
      <div>Found <strong>{{ results.items.length }}</strong> results in <strong>{{ results.queryTime }} ms</strong></div>
      <div>RCUs consumed: <strong>{{ results.consumedCapacity.toFixed(1) }}</strong> ({{ (results.consumedCapacity * 0.125 / 1000000).toFixed(7) }} USD)</div>
    </div>
  </div>

  <div v-if="results && results.items.length > 0" class="results-list">
    <div v-for="(item, index) in results.items" :key="index" class="result-item">
      <div :class="['result-content', { expanded: expandedItems.has(index), overflowing: overflowingItems.has(index) }]">
        <div class="result-header">
          <span class="result-score">Score: {{ item.score.toFixed(2) }}</span>
          <span class="result-id">{{ item.data.product_id }}</span>
        </div>
        <h3 class="result-title">{{ item.data.product_title }}</h3>
        <p v-if="item.data.product_description" class="result-description" v-html="escape(item.data.product_description)"></p>
        <ul v-if="item.data.product_bullet_point" class="result-bullet">
          <li v-for="line in item.data.product_bullet_point.split(/\r?\n/)" v-html="escape(line)"></li>
        </ul>
        <div v-if="item.data.product_brand || item.data.product_color" class="result-meta">
          <span v-if="item.data.product_brand">Brand: {{ item.data.product_brand }}</span>
          <span v-if="item.data.product_color">Color: {{ item.data.product_color }}</span>
        </div>
      </div>
      <a v-if="overflowingItems.has(index) && !expandedItems.has(index)" @click.prevent="expand(index)" class="show-more-link">
        Show more
      </a>
    </div>
  </div>

  <div v-if="results && results.items.length === 0" class="no-results">
    No results found. Try a different search term.
  </div>
</div>

<script setup>
import { ref } from 'vue';

const query = ref('');
const results = ref(null);

const submitAllowed = ref(false);
const loading = ref(false);
const error = ref(null);
const locale = ref('us');
const expandedItems = ref(new Set());
const overflowingItems = ref(new Set());

const locales = [
  { value: 'us', label: 'English', total: 1215854 },
  { value: 'es', label: 'Spanish', total: 260011 },
  { value: 'jp', label: 'Japanese', total: 339059 },
];

const allowSubmit = () => {
  submitAllowed.value = true;
};

const performSearch = async () => {
  if (!submitAllowed.value) return;
  submitAllowed.value = false;
  if (!query.value.trim()) {
    error.value = 'Please enter a search query';
    results.value = null;
    return;
  }
  loading.value = true;
  error.value = null;
  results.value = null;
  expandedItems.value.clear();
  overflowingItems.value.clear();
  try {
    const response = await fetch(`https://dynamosearch.maruyama.works/api/search?q=${encodeURIComponent(query.value)}&locale=${locale.value}`);
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message);
    }
    const data = await response.json();
    results.value = data;
    setTimeout(checkOverflow, 0);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const checkOverflow = () => {
  const items = document.querySelectorAll('.result-content');
  items.forEach((item, index) => {
    if (item.scrollHeight > 300) {
      overflowingItems.value.add(index);
    }
  });
};

const onClickSubmit = () => {
  submitAllowed.value = true;
  performSearch();
};

const expand = (index) => {
  expandedItems.value.add(index);
};

const escape = (str) => {
  return str
    .replace(/[&<>"']/g, (match) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[match]))
    .replace(/&lt;(\/?)b&gt;/gi, '<$1b>')
    .replace(/&lt;(\/?)strong&gt;/gi, '<$1strong>')
    .replace(/&lt;(\/?)p&gt;/gi, '<$1p>')
    .replace(/&lt;(\/?)ol&gt;/gi, '<$1ol>')
    .replace(/&lt;(\/?)ul&gt;/gi, '<$1ul>')
    .replace(/&lt;(\/?)li&gt;/gi, '<$1li>')
    .replace(/&lt;br\s*\/?&gt;/gi, '<br>');
};
</script>

<style scoped>
.demo-container {
  margin: 2rem 0;
}

.locale-toggle-container {
  display: flex;
  align-items: center;
  margin-bottom: 1rem; gap: 1rem;
}

.locale-toggle {
  border: none;
  display: flex;
  width: 100%;
}

.locale-button {
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  cursor: pointer;
  flex-grow: 1;
  margin-left: -1px;
  padding: 0.5rem 1rem;
}

.locale-button button {
  display: flex;
  gap: 0.6rem;
}

.locale-button:first-child {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  margin-left: 0;
}

.locale-button:last-child {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}

.locale-button.active {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
  z-index: 1;
}

.locale-button .radio {
  border: solid 1px var(--vp-c-divider);
  border-radius: 100%;
  margin-top: 0.25rem;
  width: 1rem;
  height: 1rem;
}

.locale-button.active .radio {
  background-color: var(--vp-c-brand-1);
  position: relative;
}

.locale-button.active .radio::after {
  background-color: var(--vp-c-bg);
  border-radius: 100%;
  content: '';
  margin: auto;
  position: absolute;
  inset: 0;
  width: 0.375rem;
  height: 0.375rem;
}

.locale-label {
  display: flex;
  align-items: start;
  flex-direction: column;
  font-size: 0.9rem;
  font-weight: 500;
}

.total-count {
  font-size: 0.75rem;
  margin-top: -0.25rem;
  opacity: 0.75;
}

@media (max-width: 640px) {
  .locale-toggle-container {
    flex-direction: column;
  }
  .locale-toggle {
    flex-direction: column;
  }
  .locale-button {
    margin-left: 0;
    margin-top: -1px;
  }
  .locale-button:first-child {
    border-top-right-radius: 8px;
    border-bottom-left-radius: 0;
    margin-top: 0;
  }
  .locale-button:last-child {
    border-top-right-radius: 0;
    border-bottom-left-radius: 8px;
  }
  .locale-label {
    flex-direction: row;
    gap: 1rem;
  }
  .total-count {
    margin-top: 1px;
  }
}

.search-box {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.search-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.search-button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: var(--vp-c-bg);
  background: var(--vp-c-brand-1);
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.search-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.results-info {
  padding: 16px;
  background: var(--vp-c-success-soft);
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 14px;
  color: var(--vp-c-text-1);
}

.results-info.error {
  background: var(--vp-custom-block-danger-bg);
}

.results-info-title {
  font-weight: 600;
  margin-bottom: 8px;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.result-item {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  display: flex;
  flex-direction: column;
  position: relative;
}

.result-content {
  max-height: 300px;
  overflow: hidden;
  padding: 1rem 1.5rem 0.85rem;
  position: relative;
}

.result-content.expanded {
  max-height: none;
}

.result-content.overflowing:not(.expanded)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 75px;
  background: linear-gradient(to bottom, transparent, var(--vp-c-bg-soft) 60%);
  pointer-events: none;
}

.show-more-link {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0.75rem 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  cursor: pointer;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.result-score {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.result-title {
  margin: 0 0 0.75rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.result-description {
  margin: 0 0 0.75rem 0;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  font-size: 0.95rem;
}

.result-bullet {
  margin: 0 0 0.75rem 0;
  color: var(--vp-c-text-3);
  line-height: 1.6;
  font-size: 0.9rem;
  padding-left: 1rem;
  white-space: pre-wrap;
}

.result-bullet li {
  margin: 0.25rem 0;
}

.result-meta {
  display: flex;
  gap: 1rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.result-id {
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
  margin-left: auto;
}

.no-results {
  padding: 2rem;
  text-align: center;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
}

@media (max-width: 768px) {
  .search-box {
    flex-direction: column;
  }

  .result-meta {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>
