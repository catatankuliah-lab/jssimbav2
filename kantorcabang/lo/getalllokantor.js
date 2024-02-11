var idkantor = $("#kantor").val();
const datalo = $("#datalo");
console.log(idkantor);

$.ajax({
  url: "https://delapandelapanlogistics.com/api/alokasi",
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

$("#filterLO").on("click", function () {
  if ($("#alokasi").val() === null) {
    Swal.fire({
      icon: "warning",
      title: "Peringatan!",
      text: "Anda harus memilih alokasi terlebih dahulu",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  } else {
    var gudang = $("#pilihgudang").val();
    var kabupaten = $("#pilihkabupatenkota").val();
    var kecamatan = $("#pilihkecamatan").val();
    var alokasi = $("#alokasi").val();
    document.getElementById("idAlokasi").value = alokasi;

    document.getElementById("formDownload").action =
      "https://delapandelapanlogistics.com/kantorcabang/lo/1/downloadexcel/" + alokasi;
    $.ajax({
      url:
        " https://delapandelapanlogistics.com/api/lo/" +
        $("#alokasi").val() +
        "/getbyidkantor/" +
        idkantor,

      method: "GET",
      dataType: "json",
      success: function (data) {
        console.log("Loading Order Ditemukan : ", data);
        $("#filterSearch").removeClass("d-none");
        $("#tabelhilangdulu").removeClass("d-none");
        $("#hilang").removeClass("d-none");
        var datanya = [];
        $.each(data, function (index, lo) {
          datanya.push({
            tanggal_muat: lo.tanggal_muat,
            gudang: lo.nama_gudang,
            nomor_lo: lo.nomor_lo,
            pengirim:
              lo.nomor_mobil +
              " / " +
              lo.nama_driver +
              "(" +
              lo.nomor_driver +
              ")",
            muatan: lo.jumlah_penyaluran_januari,
            status: lo.status_dokumen_muat,
            link:
              "https://delapandelapanlogistics.com/kantorcabang/lo/" +
              $("#alokasi").val() +
              "/detail/" +
              lo.nomor_lo,
          });
        });
        $("#tablelo").DataTable({
          paging: true,
          info: false,
          language: {
            paginate: {
              next: ">",
              previous: "<",
            },
          },
          data: datanya,
          columns: [
            { data: "tanggal_muat" },
            { data: "gudang" },
            { data: "nomor_lo" },
            { data: "pengirim" },
            { data: "muatan" },
            { data: "status" },
            {
              data: "link",
              render: function (data, type, row, meta) {
                return (
                  "<a href=" +
                  data +
                  " type='button' class='text-primary' style='border-radius: 5px;'>" +
                  "<i class='fas fa-search-plus'></i></a>"
                );
              },
              className: "text-center",
            },
          ],
        });
      },

      error: function (error) {
        console.error("Gagal mengambil data sesi:", error);
      },
    });
  }
});
