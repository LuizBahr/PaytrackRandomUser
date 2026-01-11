export class RandomUserClient {
    constructor({ baseUrl, timeout = 5000 }) {
        this.baseUrl = baseUrl;
        this.timeout = timeout;
    }

    async fetchUsers({ results = 100, nationality } = {}) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeout);

        try {
            const params = new URLSearchParams({
                results
            });

            if (nationality) {
                params.append("nat", nationality);
            }

            const response = await fetch(
                `${this.baseUrl}?${params.toString()}`,
                { signal: controller.signal }
            );

            if (!response.ok) {
                throw new Error(
                    `RandomUser API error: ${response.status}`
                );
            }

            const data = await response.json();

            return data.results;

        } catch (err) {
            throw new Error(
                `Erro ao consumir RandomUser API: ${err.message}`
            );
        } finally {
            clearTimeout(timer);
        }
    }
}
