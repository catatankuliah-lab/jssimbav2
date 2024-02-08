document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
});
$.ajax({
  url: "http://localhost:8080/api/alokasi",
  method: "GET",
  dataType: "json",
  success: function (data) {
    const alokasi = $("#alokasi");
    $.each(data, function (index, datanya) {
      const listalokasi =
        "<option value='" +
        datanya.id_alokasi +
        "'>" +
        datanya.nama_alokasi +
        "</option>";
      alokasi.append(listalokasi);
    });
  },
});

$("#alokasi").on("change", function () {
  const alokasidipilih = $("#alokasi").val();
  if (alokasidipilih == "1") {
    prosestampilkandashboard(alokasidipilih);
  }
});

function prosestampilkandashboard(idalokasi) {
    Swal.fire({
        text: 'Memuat Data...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });
    $.ajax({
        url: "http://localhost:8080/api/lo/" + idalokasi + "/dashboard",
        method: "GET",
        dataType: "json",
        success: function (data) {
            setTimeout(function () {
                Swal.close();
            }, 200);
            var total = 0;
            var lengkap = 0;
            var tidak = 0;
            $.each(data, function (index, datanya) {
                total++;
                if (datanya.status_dokumen_muat == "LENGKAP") {
                    lengkap++;
                } else {
                    tidak++;
                }
            });
            $('#card1').text(total);
            $('#card2').text(lengkap);
            $('#card3').text(tidak);
        },
        error: function (error) {
            Swal.close();
            $('#card1').text(0);
            $('#card2').text(0);
            $('#card3').text(0);
            console.error("error tampilkan dashboard: ", error);
        },
    });
}
