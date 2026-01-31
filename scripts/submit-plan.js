function redirectToQuote(service, price) {
    // Encode parameters to handle spaces/special characters
    const params = new URLSearchParams({
        service: encodeURIComponent(service),
        price: encodeURIComponent(price)
    });
    // Redirect to the new quote page
    window.location.href = `quote.html?${params.toString()}`;
}