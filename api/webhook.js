export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const webhookData = req.body;
            const queryData = req.query; // Padrão MP envia por URL Params as vezes (topic=payment&id=123)
            console.log('Webhook Mercado Pago (IPN) Recebido:', webhookData, queryData);

            // Aqui entraremos com a conexão ao Banco de Dados (Firebase, Postgres, etc)
            // MP geralmente manda: webhookData.action === 'payment.created' ou webhookData.type === 'payment'
            // e depois usamos webhookData.data.id para buscar e aprovar no nosso sistema backend.

            // Responde rapidamente STATUS 200 (Sucesso) para o MP não ficar re-enviando (Timeout limits)
            res.status(200).json({ received: true });
        } catch (err) {
            console.error('Erro ao processar Webhook MP:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        // Apenas requisições POST
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}
