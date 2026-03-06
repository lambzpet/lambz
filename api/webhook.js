export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const webhookData = req.body;
            console.log('Webhook LiraPay Recebido:', webhookData);

            // Aqui entraremos com a lógica do banco de dados para marcar
            // o `external_id` ou `transaction_id` como "PAGO"
            // Exemplo LiraPay: webhookData.status === 'APPROVED'

            // Responde com sucesso rápido para a LiraPay não reenviar (Timeout)
            res.status(200).json({ received: true });
        } catch (err) {
            console.error('Erro ao processar Webhook:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        // Apenas POST é permitido no webhook
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}
