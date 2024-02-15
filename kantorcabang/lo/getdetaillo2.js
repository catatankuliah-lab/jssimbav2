$.ajax({
  url: "https://delapandelapanlogistics.com/api/lo/1/detail/" + $("#nomorlo").val(),
  type: "GET",
  dataType: "json",
  success: function (data) {
    console.log("Detail LO Ditemukan", data);
    $("#tanggalpembuatan").val(data[0].tanggal_muat);
    $("#nopoldriver").val(
      data[0].nomor_mobil +
        " / " +
        data[0].nama_driver +
        " (" +
        data[0].nomor_driver +
        ")"
    );
    const datalo = $("#datalo");

    var total = 0;
    $.each(data, function (index, spm) {
      total = total + parseInt(spm.total);

      var listspm =
        "<tr>" +
        "<td>" +
        parseInt(index + 1) +
        "</td>" +
        "<td>" +
        spm.nama_kabupaten_kota +
        "</td>" +
        "<td>" +
        spm.nama_kecamatan +
        "</td>" +
        "<td>" +
        spm.nama_desa_kelurahan +
        "</td>" +
        "<td>" +
        spm.total +
        "</td>" +
        "<td class='text-center'>" +
        "<a href='https://delapandelapanlogistics.com/kantorcabang/lo/1/detail/suratjalan/" +
        spm.id_sj +
        "' type='button' class='text-primary' style='border-radius: 5px;'>" +
        "<i class='fas fa-search-plus'></i>" +
        "</a>" +
        "</td>" +
        "</tr >";
      datalo.append(listspm);
    });
    listspm =
      "<tr><td colspan='4' style='text-align: center; font-weight:bold'>Total</td><td style='font-weight:bold'>" +
      total +
      "</td><td></td></tr>";
    datalo.append(listspm);
  },
  error: function (error) {
    console.error("Error:", error);
  },
});
