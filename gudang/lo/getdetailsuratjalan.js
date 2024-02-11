$('#alokasi').val();

// get data sj by id sj
$.ajax({
  url: "https://delapandelapanlogistics.com/api/sj/detailitemsj/" + $('#bahanalokasi').val() + "/" + $('#idsj').val(),
  type: "GET",
  dataType: "json",
  success: function (data) {
    var output1 = $("#outsj");
    output1.attr("src", "https://delapandelapanlogistics.com/" + data.data.path_surat_jalan + data.data.file_surat_jalan);
    var output2 = $("#outbukti");
    output2.attr("src", "https://delapandelapanlogistics.com/" + data.data.path_bukti_surat_jalan + data.data.file_bukti_surat_jalan);
    $('#tanggal_pembuatan').val(data.data.tanggal_muat);
    $('#alokasi').val($('#bahanalokasi').val());
    $('#nomor_lo').val(data.data.nomor_lo);
    $('#kabupatenkota').val(data.data.nama_kabupaten_kota);
    $('#kecamatan').val(data.data.nama_kecamatan);
    $('#desakelurahan').val(data.data.nama_desa_kelurahan);
    $('#nopolmobil').val(data.data.nomor_mobil);
    $('#namadriver').val(data.data.nama_driver);
    $('#nomordriver').val(data.data.nomor_driver);
    $('#totalpengiriman').val(data.data.jumlah_penyaluran_januari + " Kg");
  },
  error: function (error) {
    console.log("ERROR DATA SJ : ", error);
  },
});

$('#filesj').change(function (e) {
  ceknomor();
  var output = document.getElementById('outsj');
  output.src = URL.createObjectURL(event.target.files[0]);
});
$('#filebukti').change(function (e) {
  ceknomor();
  var output = document.getElementById('outbukti');
  output.src = URL.createObjectURL(event.target.files[0]);
});

// PERSIAPAN UPLOAD DAN UPDATE
function ceknomor() {
  var nopolmobil = $('#nopolmobil').val();
  var namadriver = $('#namadriver').val();
  var nomordriver = $('#nomordriver').val();
  var lengkap = false;
  if (nopolmobil == "" || namadriver == "" || nomordriver == "") {
    lengkap = false;
  } else {
    lengkap = true;
  }
  return lengkap;
}

// PROSES UPLOAD DAN UPDATE
$('#prosesupdate').click(function (e) {
  if (ceknomor() == false) {
    Swal.fire({
      icon: "error",
      title: "Surat Jalan",
      text: "Mohon Lengkapi Data Surat Jalan Terlebih Dahulu.",
      timer: 3000,
      showConfirmButton: false,
    });
  } else {

  }
  var formData = new FormData($('#uploadForm')[0]);
  var additionalData = {
    'nomor_mobil': $('#nopolmobil').val(),
    'nama_driver': $('#namadriver').val(),
    'nomor_driver': $('#nomordriver').val(),
    'id_sj': $('#idsj').val()
  };
  console.log(additionalData);
  formData.append('additionalData', JSON.stringify(additionalData));
  $.ajax({
    url: "https://delapandelapanlogistics.com/api/sj/" + $('#alokasi').val() + "/uploadfile/" + $('#idsj').val(),
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      Swal.fire({
        icon: "success",
        title: "Surat Jalan",
        text: "Berkas Surat Jalan berhasil diupload.",
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
});
