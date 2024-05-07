let customers = [];

function addCustomer() {
    let tableNo = prompt("Enter Table No:");
    let customerId = prompt("Enter Customer ID:");
    let name = prompt("Enter Name:");
    let email = prompt("Enter Email:");
    let number = prompt("Enter Number:");
    let payment = prompt("Enter Payment:");
    let dateTime = prompt("Enter Date/Time:");

    customers.push({
        tableNo: tableNo,
        customerId: customerId,
        name: name,
        email: email,
        number: number,
        payment: payment,
        dateTime: dateTime
    });

    renderTable();
}

function deleteCustomer(index) {
    customers.splice(index, 1);
    renderTable();
}

function renderTable() {
    let tableBody = document.querySelector("#customerTable tbody");
    tableBody.innerHTML = "";

    customers.forEach((customer, index) => {
        let row = tableBody.insertRow();
        row.innerHTML = `
            <td>${customer.tableNo}</td>
            <td>${customer.customerId}</td>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.number}</td>
            <td>${customer.payment}</td>
            <td>${customer.dateTime}</td>
            <td>
                <button onclick="addCustomer()">Add</button>
                <button onclick="deleteCustomer(${index})">Delete</button>
            </td>
        `;
    });
}
