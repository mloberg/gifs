import "alpinejs";
import lunr from "lunr";
import { shuffle } from "lodash";

window.gifs = () => {
    return {
        query: "",
        images: [],
        index: null,
        results: [],
        toast: false,
        async init() {
            const resp = await fetch('/gifs.json');
            const data = await resp.json();
            const gifs = data.map(gif => {
                gif.file = new URL(gif.file, window.location.href).toString();
                return gif;
            });

            this.images = gifs;
            this.index = lunr(function() {
                this.b(0);
                this.pipeline.remove(lunr.stopWordFilter)

                this.ref("file");
                this.field("name", { boost: 10 });
                this.field("tags");
                this.field("category", { boost: 5 });

                gifs.forEach(img => this.add(img));
            });

            // load some random gifs
            this.results = shuffle(gifs).slice(0, 6);
        },
        search() {
            if (this.query.length < 3) {
                this.results = [];
                return;
            }

            this.results = this.index.search(this.query).map(result => {
                return this.images.filter(img => img.file === result.ref)[0];
            });
        },
        copy(event) {
            const input = event.target.querySelector("input") || event.target.parentNode.querySelector("input");
            input.select();
            if (document.execCommand('copy')) {
                this.toast = true;
                setTimeout(() => this.toast = false, 5000);
            }
        },
    };
};
