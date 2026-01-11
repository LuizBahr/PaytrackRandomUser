import express from "express";
import fs from "fs";
import { RandomUserClient } from "./src/clients/randomuser.client.js";
import { integrationsConfig } from "./config/integrations.js";
import { createReport } from "./relatorios/reports.processor.js";
import { flattenObject } from "./utils/flatten.js";
import { mergeFlattenedSchemas } from "./utils/schema.js";
import {
    createTableFromObject,
    upsertFromObject,
    existsByEmail
} from "./src/db/database.js";

const app = express();
const PORT = integrationsConfig.server.port;

const randomUserClient = new RandomUserClient({
    baseUrl: integrationsConfig.randomUser.baseUrl,
    timeout: integrationsConfig.randomUser.timeout
});

app.get('/', async (req, res) => {
    const report = createReport();

    try {
        let users = await randomUserClient.fetchUsers({
        results: integrationsConfig.randomUser.defaultResults,
        seed: "desafio-paytrack"
        });

        users = Array.from(new Map(users.map(u => [u.email, u])).values());
        const mergedSchema = mergeFlattenedSchemas(users);
        await createTableFromObject("usuarios", mergedSchema);

        for (const user of users) {
            
            report.registrarRecebido();

            try {
                const userFlatten = flattenObject(user);

                if (!userFlatten.email) {
                    report.ignoradoSemEmail();
                    continue;
                }

                if (user.dob?.age < 18) {
                    report.ignoradoMenorDeIdade();
                    continue;
                }
                
                const exists = await existsByEmail("usuarios", userFlatten.email);
                await upsertFromObject("usuarios", userFlatten);

                if (exists) {
                    report.registrarAtualizado();
                } else {
                    report.registrarInserido();
                }

            } catch (err) {
                report.erroTecnico(err, {
                    email: user?.email ?? null
                });
            }
        }

        report.finalizar();

        if (!fs.existsSync("./reports")) {
            fs.mkdirSync("./reports");
        }

        const now = new Date();
        const formattedDate = now.toISOString()
            .replace(/:/g, '-')   
            .replace(/\..+/, ''); 

        const fileName = `./reports/relatorio-${formattedDate}.json`;
        fs.writeFileSync(fileName, JSON.stringify(report, null, 2));

        return res.json({
            status: "OK",
            operacao: "UPSERT por email",
            chaveUnica: "email",
            relatorio: fileName,
            resumo: report.resumo
        });

    } catch (error) {
        return res.status(500).json({
            erro: "Erro no processamento",
            detalhes: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor está rodando na porta ${PORT}`);
});