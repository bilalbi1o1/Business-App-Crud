export const printUser = (user) => {
    const printWindow = window.open('', '_blank');

    printWindow.document.write(`
  <!DOCTYPE html>
<html>
<head>
<title>Tech Buy</title>
<style>
    body {
        font-family: 'Arial', sans-serif;
        margin: 0;
        padding: 5px;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 12px;
    }

    .container-wrapper {
        width: 100%;
        max-width: 900px;
        padding: 5px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .container {
        width: 100%;
        padding: 10px;
    }

    h2 {
        text-align: center;
        color: #003366;
        font-size: 16px;
        margin-bottom: 5px;
    }

    .contact-info {
        text-align: center;
        margin-bottom: 5px;
        font-size: 11px;
    }

    .contact-info p {
        margin: 3px 0;
    }

    .print-container {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
    }

    .column {
        width: 48%;
    }

    .column p {
        margin: 3px 0;
        padding: 3px 0;
        border-bottom: 1px solid #ddd;
    }

    .column strong {
        color: #003366;
    }

    img {
        display: block;
        margin: 0 auto 5px;
        max-width: 100px;
    }

    .separator {
        border-bottom: 1px dotted black;
        width: 25%;
        margin-top: 60px;
        margin-bottom: 20px;
    }

    @media print {
    body {
        transform: scale(0.95);
        transform-origin: top;
        width: 100%;
    }
    .container-wrapper {
        box-shadow: none;
        border: none;
    }
    .container {
        padding: 5px;
    }
    .print-container {
        font-size: 10px;
    }
    .column p {
        display: block !important; /* Ensure paragraphs are always visible */
        visibility: visible !important;
        color: black !important;
    }
}

</style>
</head>
<body>
<div class="container-wrapper">
    <div class="container">
        <img src="https://techbuy.ca/image/cache/catalog/Banners/Logo/765x133n-765x133.png" />
        <div class="contact-info">
            <p>17310 Yonge St., Unit 12 A, Newmarket, Ontario, L3Y 7S1</p>
            <p>Ph: 905-830-4343 | Email: sales@techbuy.ca</p>
            <p>www.Techbuy.ca</p>
            <h2>Service Order</h2>
        </div>
        <p><strong>For TechBuy</strong></p>
        <div class="print-container">
            <div class="column">
                <p><strong>Ref #:</strong> ${user.ref}</p>
                <p><strong>Date:</strong> ${user.date}</p>
                <p><strong>First Name:</strong> ${user.firstName}</p>
                <p><strong>Last Name:</strong> ${user.lastName}</p>
                <p><strong>Product:</strong> ${user.product}</p>
                <p><strong>IMEI S/N:</strong> ${user.imei}</p>
                <p><strong>Technician Notes:</strong> ${user.notes || "N/A"}</p>
                <p><strong>Price:</strong> ${user.price}</p>
            </div>
            <div class="column">
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Phone Cell:</strong> ${user.cellNumber}</p>
                <p><strong>Phone Home:</strong> ${user.phoneNumber}</p>
                <p><strong>Employee Name:</strong> ${user.employeeName}</p>
                <p><strong>Pickup Time:</strong> ${user.pickupTime}</p>
                <p><strong>Date & Time:</strong> ${user.dateTime}</p>
                <p><strong>Customer Remarks:</strong> ${user.remarks || "N/A"}</p>
                <p><strong>Issue:</strong> ${user.issue}</p>
            </div>
        </div>
    </div>

    <div class="separator"></div>

    <div class="container">
        <img src="https://techbuy.ca/image/cache/catalog/Banners/Logo/765x133n-765x133.png" />
        <div class="contact-info">
            <p>17310 Yonge St., Unit 12 A, Newmarket, Ontario, L3Y 7S1</p>
            <p>Ph: 905-830-4343 | Email: sales@techbuy.ca</p>
            <p>www.Techbuy.ca</p>
            <h2>Service Order</h2>
        </div>
        <div class="print-container">
            <div class="column">
                <p><strong>Ref #:</strong> ${user.ref}</p>
                <p><strong>Date:</strong> ${user.date}</p>
                <p><strong>First Name:</strong> ${user.firstName}</p>
                <p><strong>Last Name:</strong> ${user.lastName}</p>
                <p><strong>Product:</strong> ${user.product}</p>
                <p><strong>IMEI S/N:</strong> ${user.imei}</p>
                <p><strong>Price:</strong> ${user.price}</p>
            </div>
            <div class="column">
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Phone Cell:</strong> ${user.cellNumber}</p>
                <p><strong>Phone Home:</strong> ${user.phoneNumber}</p>
                <p><strong>Pickup Time:</strong> ${user.pickupTime}</p>
                <p><strong>Date & Time:</strong> ${user.dateTime}</p>
                <p><strong>Issue:</strong> ${user.issue}</p>
            </div>
        </div>
    </div>
</div>

<script>
    window.onload = function() {
        window.print();
        window.close();
    };
</script>
</body>
</html>
`);

    printWindow.document.close();
};