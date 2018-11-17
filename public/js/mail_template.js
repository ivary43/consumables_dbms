function confirmOrder(order_id) {
    var answer = confirm("Are you sure you want to mark this order as delivered?");
    if (answer) {
        $.ajax({
            type: "POST",
            url: "https://consumables.herokuapp.com/order/" + order_id + "/confirm",
            success: function (msg) {}
        });
    }
}