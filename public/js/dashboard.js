function deletePressed(order_id) {
    var answer = confirm("Are you sure you want to delete this order?");
    if (answer) {
        $.ajax({
            type: "DELETE",
            url: "/order/" + order_id,
            success: function (msg) {
                location.reload();
                alert(msg);
            }
        });
    }
}