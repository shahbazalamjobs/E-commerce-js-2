document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById("delivery-form");
    var deliveryStatus = document.getElementById("delivery-status");

    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent default form submission

        // Get form input values
        var name = document.getElementById("name").value;
        var address = document.getElementById("address").value;
        var contact = document.getElementById("contact").value;

        // Display confirmation message
        deliveryStatus.innerHTML = "Submission confirmed, " + name + ". Your order is scheduled for delivery within 7 days.<br>";
        deliveryStatus.innerHTML += "Contact details:<br>";
        deliveryStatus.innerHTML += "Phone: " + contact + "<br>";
        deliveryStatus.innerHTML += "Address: " + address;

        // Show the delivery status
        deliveryStatus.style.display = "block";

        // Hide the form
        form.style.display = "none";
    });
});
