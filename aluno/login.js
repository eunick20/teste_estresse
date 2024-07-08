import http from 'k6/http';
import { check, sleep } from 'k6';

//gerar relatórop em HTML
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
    return {
      "summary.html": htmlReport(data),
    };
  }

// CPF fixo
const cpf = '22222222222'; // Substitua pelo CPF válido

export let options = {
    vus: 1500, // Número de usuários virtuais
    iterations: 1500,
    duration: '3m', // Duração do teste
    thresholds: {
        'http_req_duration': ['p(95)<3000'], // 95% dos pedidos devem ser completados em menos de 3000ms
        'checks': ['rate<0.1'], // Menos de 10% de falhas nas verificações
    }
};

export default function () {
    // Definir os dados de login
    const payload = JSON.stringify({
        cpf: cpf,
    });

    // Definir os headers
    const headers = {
        'Content-Type': 'application/json',
    };

    // Enviar a solicitação POST para o endpoint de login
    const res = http.get('https://testefront.novocfc.com.br/aluno/teste', payload, { headers: headers });

    // Verificar se a solicitação foi bem-sucedida
    check(res, {
        'login successful': (r) => r.status === 200,
    });

    // Esperar um curto período entre as solicitações
    sleep(1);
}
