$.ajax({
  url: "https://delapandelapanlogistics.com/api/lo/suratjalan/" + $("#nomor_lo").val(),
  type: "GET",
  dataType: "json",
  success: function (data) {
    console.log(data);
    $("#tanggalpembuatan").val(data[0].tanggal_muat);
    $("#nopoldriver").val(
      data[0].nomor_mobil +
        " / " +
        data[0].nama_driver +
        " (" +
        data[0].nomor_driver +
        ")"
    );
    $("#kabupaten").val(data[0].nama_kabupaten_kota);
    $("#kecamatan").val(data[0].nama_kecamatan);
    $("#desakelurahan").val(data[0].nama_desa_kelurahan);
    $("#totalpenyerahan").val(data[0].total + " Kg");
    if (data[0].file_surat_jalan != null) {
      $("#formsj").addClass("d-none");
    }
    if (data.file_penyerahan != null) {
      $("#formdriver").addClass("d-none");
    }
  },
  error: function (error) {
    console.error("Error:", error);
  },
});

$("#filebuktisj").on("change", function () {
  $.ajax({
    url: "https://delapandelapanlogistics.com/api/v1/lo/suratjalan/" + $("#idspmbast").val(),
    type: "GET",
    dataType: "json",
    success: function (data) {
      var formData = new FormData($("#uploadForm")[0]);
      var additionalData = {
        nomor_spm: $("#nomorlo").val(),
        id_spmbast: $("#idspmbast").val(),
        nama_alokasi: data[0].nama_alokasi,
        nama_provinsi: data[0].nama_provinsi,
        nama_kantor: data[0].nama_kantor,
        nama_gudang: data[0].nama_gudang,
      };
      formData.append("additionalData", JSON.stringify(additionalData));
      $.ajax({
        url: "https://delapandelapanlogistics.com/api/v1/lo/uploadsj",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
          console.log(response);
          if (response.status == "200") {
            Swal.fire({
              icon: "success",
              title: "Surat Jalan",
              text: response.message,
              timer: 3000,
              showConfirmButton: false,
            });
            $("#formsj").addClass("d-none");
          } else {
            Swal.fire({
              icon: "error",
              title: "Surat Jalan",
              text: "Berkas Surat Jalan gagal diupload (File harus berupa .jpg .jpeg atau .png)",
              timer: 3000,
              showConfirmButton: false,
            });
          }
        },
        error: function (error) {
          Swal.fire({
            icon: "error",
            title: "Surat Jalan",
            text: "Berkas Surat Jalan gagal diupload (File harus berupa .jpg .jpeg atau .png)",
            timer: 3000,
            showConfirmButton: false,
          });
        },
      });
    },
    error: function (error) {
      console.log("ERROR : ", error);
    },
  });
});

$("#filebuktidriver").on("change", function () {
  $.ajax({
    url: "https://delapandelapanlogistics.com/api/v1/lo/suratjalan/" + $("#idspmbast").val(),
    type: "GET",
    dataType: "json",
    success: function (data) {
      var formData = new FormData($("#uploadForm2")[0]);
      var additionalData = {
        nomor_spm: $("#nomorlo").val(),
        id_spmbast: $("#idspmbast").val(),
        nama_alokasi: data[0].nama_alokasi,
        nama_provinsi: data[0].nama_provinsi,
        nama_kantor: data[0].nama_kantor,
        nama_gudang: data[0].nama_gudang,
      };
      formData.append("additionalData", JSON.stringify(additionalData));
      $.ajax({
        url: "https://delapandelapanlogistics.com/api/v1/lo/uploadsjdriver",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
          console.log(response);
          if (response.status == "200") {
            Swal.fire({
              icon: "success",
              title: "Surat Jalan",
              text: response.message,
              timer: 3000,
              showConfirmButton: false,
            });
            $("#formdriver").addClass("d-none");
          } else {
            Swal.fire({
              icon: "error",
              title: "Surat Jalan",
              text: "Berkas Surat Jalan gagal diupload (File harus berupa .jpg .jpeg atau .png)",
              timer: 3000,
              showConfirmButton: false,
            });
          }
        },
        error: function (error) {
          Swal.fire({
            icon: "error",
            title: "Surat Jalan",
            text: "Berkas Surat Jalan gagal diupload (File harus berupa .jpg .jpeg atau .png)",
            timer: 3000,
            showConfirmButton: false,
          });
        },
      });
    },
    error: function (error) {
      console.log("ERROR : ", error);
    },
  });
});
