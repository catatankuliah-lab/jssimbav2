console.log($("#kodewo").val());
console.log($("#alokasi").val());

$.ajax({
  url:
    "https://delapandelapanlogistics.com/api/lo/" +
    $("#alokasi").val() +
    "/laporan/detail/" +
    $("#kodewo").val(),

  type: "GET",
  dataType: "json",
  success: function (data) {
    console.log("Data Detail WO : ", data);

    $("#tanggalpembuatan").val(data.data[0].tanggal_muat);
    $("#nomorwo").val(data.data[0].nomor_wo);
    const datalo = $("#datalo");
    var total = 0;

    $.each(data.data, function (index, wo) {
      total += parseInt(wo.jumlah_penyaluran_januari);

      if (wo.status_pbp !== "DIBUAT") {
        DIBUAT = false;
      }

      var listwo =
        "<tr>" +
        "<td>" +
        (parseInt(index) + 1) +
        "</td>" +
        "<td>" +
        wo.nama_kabupaten_kota +
        "</td>" +
        "<td>" +
        wo.nama_kecamatan +
        "</td>" +
        "<td>" +
        wo.nama_desa_kelurahan +
        "</td>" +
        "<td>" +
        wo.jumlah_penyaluran_januari +
        "</td>" +
        "<td>" +
        wo.status_dokumen_muat +
        "</td>" +
        "</tr >";
      datalo.append(listwo);
    });
    var totalRow =
      "<tr><td colspan='4' style='text-align: center; font-weight:bold'>Total</td><td style='font-weight:bold'>" +
      total +
      "</td><td></td></tr>";

    datalo.append(totalRow);
  },
  error: function (error) {
    console.error("Data Detail WO Error :", error);
  },
});

$("#downloadwo").on("click", function () {
  window.location.href =
    "https://delapandelapanlogistics.com/itkantorcabang/lo/1/generatelaporanwo/" +
    $("#kodewo").val();
});
