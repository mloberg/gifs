import Alpine from 'alpinejs';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import copy from 'copy-to-clipboard';
import instantsearch from 'instantsearch.js';
import { hits, searchBox } from 'instantsearch.js/es/widgets';

window.searchGifs = (host, apiKey) => {
  const search = instantsearch({
    indexName: 'gifs',
    searchClient: instantMeiliSearch(host, apiKey),
  });

  search.addWidgets([
    searchBox({
      container: '#searchbox',
      autofocus: true,
      showSubmit: false,
      placeholder: 'Search for a gif',
      cssClasses: {
        form: 'mt-1 w-1/2 mx-auto flex',
        input: 'border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500',
        reset: '-ml-6',
      },
    }),
    hits({
      container: '#hits',
      transformItems(items) {
        const { query } = search.renderState.gifs.searchBox;
        if (!query) {
          return [];
        }

        return items.map((item) => {
          if (item.file.startsWith(window.location.origin)) {
            return item;
          }

          return {
            ...item,
            file: window.location.origin + item.file,
            frame: window.location.origin + item.frame,
          };
        });
      },
      cssClasses: {
        list: 'grid lg:grid-cols-3 md:grid-cols-2 gap-4 justify-items-center mx-auto',
      },
      templates: {
        empty(results) {
          return results.query
            ? `<p class="text-center">No results found matching <strong>${results.query}</strong>.</p>`
            : '';
        },
        item: `
          <div class="mx-auto text-center">
            <div class="relative">
              <div class="loading absolute w-full h-full flex items-stretch cursor-pointer">
                <div class="absolute w-full h-full bg-gray-900 opacity-50 z-10"></div>
                <div class="lds-dual-ring self-center mx-auto text-black z-30"></div>
              </div>
              <div class="overlay" @click="copySource('{{file}}', $dispatch)">
                <div class="overlay-backdrop"></div>
                <div class="overlay-actions text-black">
                  <p class="py-2 px-4 bg-white rounded hover:bg-gray-300">Copy</p>
                  <input value="{{file}}" class="border-2 border-gray-200 rounded w-full p-2 text-gray-700 leading-tight block mt-2 z-50" aria-label="read-only gif link" disabled>
                </div>
              </div>
              <img class="object-none object-center" src="{{frame}}" alt="{{name}}" onload="loadGif('{{file}}', event)">
            </div>
            <span>{{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}</span>
          </div>
        `,
      },
    }),
  ]);

  return search;
};

window.copySource = (src, dispatch) => {
  copy(src, {
    format: 'text/plain',
    onCopy() {
      dispatch('copied');
    },
  });
};

window.loadGif = (gif, event) => {
  const { target } = event;
  if (target.src.endsWith('gif')) {
    return;
  }

  const img = new Image();
  img.onload = function () { // eslint-disable-line func-names
    target.src = this.src;
    target.parentNode.querySelector('.loading').remove();
  };
  img.src = gif;
};

window.Alpine = Alpine;

Alpine.start();
