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

function confirmPressed(order_id) {
    var answer = confirm("Are you sure you want to mark this order as delivered?");
    if (answer) {
        $.ajax({
            type: "POST",
            url: "/order/" + order_id + "/confirm",
            success: function (msg) {
                location.reload();
                alert(msg);
            }
        });
    }
}

$(document).ready(function () {

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        $.fn.dataTable.tables({
            visible: true,
            api: true
        }).columns.adjust();
        $.fn.dataTable.moment("mm/dd/yyyy, HH:mm:ss");
    });

    $('table.table').DataTable({
        "scrollY": "70vh",
        "scrollCollapse": true,
        "searching": false,
        "pageLength": 50,
        "aaSorting": [[ 0, "desc" ]]
    });

    $('.dataTables_length').addClass('bs-select');
});