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
            const resp = await fetch("/gifs.json");
            const data = await resp.json();
            const gifs = data.map(gif => {
                gif.file = new URL(gif.file, window.location.href).toString();
                gif.frame = new URL(gif.frame, window.location.href).toString();
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
            this.results = shuffle(gifs).slice(0, 3);
        },
        loadGif(event) {
            const target = event.target;
            if (target.src.endsWith("gif")) {
                return;
            }

            const src = target.getAttribute("data-src");
            const img = new Image();
            img.onload = function() {
                target.src = this.src;
            };
            img.src = src;
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
            if (document.execCommand("copy")) {
                this.toast = true;
                setTimeout(() => this.toast = false, 5000);
            }
        },
    };
};
