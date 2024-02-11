var url_string = window.location.href;
var url = new URL(url_string);
var pathname = url.pathname;
var segments = pathname.split('/');
var nomor_Lo = segments[4];
var arraylo = nomor_Lo.split('');
var alokasi = arraylo[15];
var kode_wo = "";
var kode_do = "";
var kode_so = "";
var nomor_wo = "";
var nomor_do = "";
var nomor_so = "";

// get data lo by nomor lo
$.ajax({
  url: "https://delapandelapanlogistics.com/api/lo/detail/" + alokasi + "/" + nomor_Lo,
  type: "GET",
  dataType: "json",
  success: function (data) {
    var output1 = $("#outwo");
    var output2 = $("#outlo");
    var output3 = $("#outpenyerahan");
    var output4 = $("#outdo");
    var output5 = $("#outsjbulog");
    var output6 = $("#outbast");
    output1.attr("src", "https://delapandelapanlogistics.com/" + data.data.path_upload_wo + data.data.file_upload_wo);
    output2.attr("src", "https://delapandelapanlogistics.com/" + data.data.path_upload_wo + data.data.file_uplaod_lo);
    output3.attr("src", "https://delapandelapanlogistics.com/" + data.data.path_upload_wo + data.data.file_upload_salur_bulog);
    output4.attr("src", "https://delapandelapanlogistics.com/" + data.data.path_upload_wo + data.data.file_upload_do);
    output5.attr("src", "https://delapandelapanlogistics.com/" + data.data.path_upload_wo + data.data.file_upload_sj_bulog);
    output6.attr("src", "https://delapandelapanlogistics.com/" + data.data.path_upload_wo + data.data.file_upload_bast_bulog);
    $('#tanggal_pembuatan').val(data.data.tanggal_muat);
    $('#alokasi').val(alokasi);
    $('#idlo').val(data.data.id_lo);
    $('#nomor_lo').val(data.data.nomor_lo);
    $('#nomor_so').val(data.data.nomor_so);
    $('#nomor_wo').val(data.data.nomor_wo);
    $('#nomor_do').val(data.data.nomor_do);
    $('#totalpengiriman').val(data.data.total + " Kg");
    getallsj(data.data.nomor_lo);
  },
  error: function (error) {
    console.log("ERROR DATA LO : ", error);
  },
});

var kode_wo = "";
var kode_do = "";
var kode_so = "";

// AMBIL DATA SJ DARI NOMOR LO
function getallsj(nomorlo) {
  $.ajax({
    url: "https://delapandelapanlogistics.com/api/suratjalan/" + $('#alokasi').val() + "/datasj/" + $('#nomor_lo').val(),
    type: "GET",
    dataType: "json",
    success: function (data) {
      const datasj = $('#datasj');
      if (data.status == "200") {
        var total = 0;
        var listdo = "";
        $.each(data.data, function (index, sj) {
          listdo =
            "<tr>" +
            "<td>" + sj.nama_kabupaten_kota + "</td>" +
            "<td>" + sj.nama_kecamatan + "</td>" +
            "<td>" + sj.nama_desa_kelurahan + "</td>" +
            "<td>" +
            "<input readonly value='" + sj.jumlah_penyaluran_januari + " Kg'type='text' style='border:none; background-color:transparent !important; width:75px'>" +
            "</td>" +
            "<td class='text-center'>" +
            "<a href='https://delapandelapanlogistics.com/gudang/sj/detailsuratjalan/" + $('#alokasi').val() + "/" + sj.id_sj + "' type='button' class='text-primary' style='border-radius: 5px;'>" +
            "<i class='fas fa-search-plus'></i>" +
            "</a>" +
            "</td>" +
            "</tr >";
          datasj.append(listdo);
        });
      }
    },
    error: function (error) {
    },
  });
}

$('#filewo').change(function (e) {
  ceknomor();
  var output = document.getElementById('outwo');
  output.src = URL.createObjectURL(event.target.files[0]);
});
$('#filelo').change(function (e) {
  ceknomor();
  var output = document.getElementById('outlo');
  output.src = URL.createObjectURL(event.target.files[0]);
});
$('#filepenyerahan').change(function (e) {
  ceknomor();
  var output = document.getElementById('outpenyerahan');
  output.src = URL.createObjectURL(event.target.files[0]);
});
$('#filedo').change(function (e) {
  ceknomor();
  var output = document.getElementById('outdo');
  output.src = URL.createObjectURL(event.target.files[0]);
});
$('#filesjbulog').change(function (e) {
  ceknomor();
  var output = document.getElementById('outsjbulog');
  output.src = URL.createObjectURL(event.target.files[0]);
});
$('#filebast').change(function (e) {
  ceknomor();
  var output = document.getElementById('outbast');
  output.src = URL.createObjectURL(event.target.files[0]);
});

// PERSIAPAN UPLOAD DAN UPDATE
function ceknomor() {
  nomor_wo = $("#nomor_wo").val();
  nomor_do = $("#nomor_do").val();
  nomor_so = $("#nomor_so").val();
  kode_wo = nomor_wo.replace(/[\/.]/g, '');
  kode_do = nomor_do.replace(/[\/.]/g, '');
  kode_so = nomor_so.replace(/[\/.]/g, '');
  var lengkap = false;
  if (nomor_wo == "" || nomor_do == "" || nomor_so == "") {
    lengkap = false;
  } else {
    lengkap = true;
  }
  return lengkap;
}

// PROSES UPLOAD DAN UPDATE
$('#prosesupdate').click(function (e) {
  ceknomor();
  if (ceknomor() == false) {
    Swal.fire({
      icon: "error",
      title: "Loading Order (LO)",
      text: "Mohon Lengkapi Data Loading Order (LO) Terlebih Dahulu.",
      timer: 3000,
      showConfirmButton: false,
    });
  } else {
    var formData = new FormData($('#uploadForm')[0]);
    var additionalData = {
      'kode_wo': kode_wo,
      'kode_do': kode_do,
      'kode_so': kode_so,
      'nomor_wo': nomor_wo,
      'nomor_do': nomor_do,
      'nomor_so': nomor_so,
      'idlo': $('#idlo').val()
    };
    console.log(additionalData);
    formData.append('additionalData', JSON.stringify(additionalData));
    $.ajax({
      url: "https://delapandelapanlogistics.com/api/lo/" + $('#alokasi').val() + "/uploadfile/" + $('#idlo').val(),
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        Swal.fire({
          icon: "success",
          title: "Loading Order (LO)",
          text: "Berkas Loading Order (LO) berhasil diupload.",
          showConfirmButton: false,
          timer: 3000,
        }).then(() => {
          window.history.back();
        });
      },
      error: function (error) {
        console.log(error);
      }
    });
  }
});
