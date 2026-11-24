export async function onRequestPost(context) {
  try {
    const secretKey = context.env.INTASEND_SECRET_KEY;
    if (!secretKey) {
      return Response.json(
        { error: 'INTASEND_SECRET_KEY is not set in Cloudflare Variables and Secrets.' },
        { status: 500 }
      );
    }

    const { amount, phone_number, api_ref } = await context.request.json();
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount < 1 || !phone_number) {
      return Response.json(
        { error: 'Please provide a valid amount and M-Pesa phone number.' },
        { status: 400 }
      );
    }

    const res = await fetch('https://api.intasend.com/api/v1/payment/mpesa-stk-push/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: numericAmount,
        phone_number: String(phone_number),
        api_ref: String(api_ref || 'BWS-' + Date.now())
      })
    });

    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function onRequestGet(context) {
  try {
    const secretKey = context.env.INTASEND_SECRET_KEY;
    const invoiceId = new URL(context.request.url).searchParams.get('invoice_id');

    if (!secretKey || !invoiceId) {
      return Response.json({ error: 'Missing invoice_id or server key.' }, { status: 400 });
    }

    const res = await fetch('https://api.intasend.com/api/v1/payment/status/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ invoice_id: invoiceId })
    });

    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
