export function createReport() {
    return {
        inicio: new Date().toISOString(),

        resumo: {
            totalRecebido: 0,

            persistencia: {
                inseridos: 0,
                atualizados: 0
            },

            ignorados: {
                menorDeIdade: 0,
                semEmail: 0,
                erroTecnico: 0
            }
        },

        erros: [],

        registrarRecebido() {
            this.resumo.totalRecebido++;
        },

        registrarInserido() {
            this.resumo.persistencia.inseridos++;
        },

        registrarAtualizado() {
            this.resumo.persistencia.atualizados++;
        },

        ignoradoMenorDeIdade() {
            this.resumo.ignorados.menorDeIdade++;
        },

        ignoradoSemEmail() {
            this.resumo.ignorados.semEmail++;
        },

        erroTecnico(err, contexto = {}) {
            this.resumo.ignorados.erroTecnico++;
            this.erros.push({
                data: new Date().toISOString(),
                mensagem: err.message,
                contexto
            });
        },

        finalizar() {
            this.fim = new Date().toISOString();
        }
    };
}
