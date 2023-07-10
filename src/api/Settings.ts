class Settings {
    private cache: { [key: string]: any } = {};
    fs: FilerFS;
    private constructor(fs: FilerFS, inital: { [key: string]: any }) {
        this.fs = fs;
        this.cache = inital;

        navigator.serviceWorker.addEventListener("message", (event) => {
            console.log("ajskdhshdkas " + event);
            if (event.data.anura_target == "anura.settings.set") {
                event.source?.postMessage({
                    anura_target: event.data.anura_target,
                    id: event.data.id,
                    value: this.cache[event.data.prop],
                });
            }
        });
    }

    static defaultSettings() {
        return {
            applist: [],
        };
    }
    static async new(fs: FilerFS) {
        const initial = this.defaultSettings();
        try {
            console.log(fs);
            const text = await fs.readFileSync("/anura_settings.json");
            Object.assign(initial, JSON.parse(text));
        } catch (e) {
            console.error(e);
            fs.writeFile("/anura_settings.json", JSON.stringify(initial));
        }

        return new Settings(fs, initial);
    }

    get(prop: string): any {
        return this.cache[prop];
    }
    has(prop: string): boolean {
        return prop in this.cache;
    }
    async set(prop: string, val: any) {
        this.cache[prop] = val;
        return new Promise((r) =>
            this.fs.writeFile(
                "/anura_settings.json",
                JSON.stringify(this.cache),
                r,
            ),
        );
    }
}