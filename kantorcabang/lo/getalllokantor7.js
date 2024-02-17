var idkantor = $("#kantor").val();
const datalo = $("#datalo");
// console.log(idkantor);

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

$.ajax({
  url: "https://delapandelapanlogistics.com/api/gudang/kantor/" + idkantor,
  method: "GET",
  dataType: "json",
  success: function (data) {
    const pilihgudang = $("#pilihgudang");
    $.each(data, function (index, datagudang) {
      const listgudang =
        "<option data-nama_gudang='" +
        datagudang.nama_gudang +
        "' value='" +
        datagudang.id_gudang +
        "'>" +
        datagudang.nama_gudang +
        "</option>";
      pilihgudang.append(listgudang);
    });
  },
  error: function (error) {
    console.error("Gagal mengambil data sesi:", error);
  },
});

$.ajax({
  url: "https://delapandelapanlogistics.com/api/wilayahkerja/" + idkantor,
  type: "GET",
  dataType: "json",
  success: function (data) {
    const kabupatenkota = $("#pilihkabupatenkota");
    $.each(data, function (index, listkabupatenkota) {
      const listoptionkabupatenkota =
        "<option data-nama_kabupaten='" +
        listkabupatenkota.nama_kabupaten_kota +
        "' value='" +
        listkabupatenkota.kode_kabupaten_kota +
        "'>" +
        listkabupatenkota.nama_kabupaten_kota +
        "</option>";
      kabupatenkota.append(listoptionkabupatenkota);
    });
  },
  error: function (error) {
    console.error("Error:", error);
  },
});

$.ajax({
  url: "https://delapandelapanlogistics.com/api/wilayahkerja/" + idkantor,
  method: "GET",
  dataType: "json",
  success: function (data) {
    // console.log("Data Kabupaten Berdasarkan Wilayah Kerja Ditemukan :", data);
    var kabupatenkota = $("#pilihkabupatenkota");
    kabupatenkota.empty();
    kabupatenkota.append('<option value="">Pilih Kabupaten/Kota</option>');
    $.each(data, function (index, wilayah) {
      const listKabupatenKota =
        "<option data-nama_kabupaten='" +
        wilayah.nama_kabupaten_kota +
        "' value='" +
        wilayah.kode_kabupaten_kota +
        "'>" +
        wilayah.nama_kabupaten_kota +
        "</option>";
      kabupatenkota.append(listKabupatenKota);
    });
  },
  error: function (error) {
    console.error("Gagal mengambil data Wilayah Kerja:", error);
  },
});

function showKecamatan() {
  const kabupatenkotadipilih = $("#pilihkabupatenkota").find(":selected").val();
  const kecamatan = $("#pilihkecamatan");
  if (kabupatenkotadipilih == 0) {
    kecamatan.empty();
    var listoptionkecamatan = "<option value='0'>Pilih Kecamatan</option>";
    kecamatan.append(listoptionkecamatan);
  }
  $.ajax({
    url:
      "https://delapandelapanlogistics.com/api/kecamatan/kabupatenkota/" +
      kabupatenkotadipilih,
    type: "GET",
    dataType: "json",
    success: function (data) {
      kecamatan.empty();
      var listoptionkecamatan = "<option value='0'>Pilih Kecamatan</option>";
      kecamatan.append(listoptionkecamatan);
      $.each(data, function (index, listkecamatan) {
        listoptionkecamatan =
          "<option value='" +
          listkecamatan.nama_kecamatan +
          "'>" +
          listkecamatan.nama_kecamatan +
          "</option>";
        kecamatan.append(listoptionkecamatan);
      });
    },
    error: function (error) {
      console.error("Error:", error);
    },
  });
}

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
    // DOWNLOAD EXCEL
    document.getElementById("formDownload").action =
      "https://delapandelapanlogistics.com/itkantorcabang/lo/"+$('#alokasi').val()+"/downloadexcel/" +
      $("#alokasi").val();
    var gudang = $("#pilihgudang").val();
    var kabupaten = $("#pilihkabupatenkota").val();
    var kecamatan = $("#pilihkecamatan").val();
    var alokasi = $("#alokasi").val();

    if ((alokasi != 0, gudang != 0 && kabupaten == 0 && kecamatan == 0)) {
      $.ajax({
        url:
          "https://delapandelapanlogistics.com/api/lo/" +
          alokasi +
          "/gudangbykantor/" +
          gudang,

        method: "GET",
        dataType: "json",
        success: function (data) {
          console.log("Data Gudang Ada", data);
          $("#filterSearch").removeClass("d-none");
          $("#tabelhilangdulu").removeClass("d-none");
          $("#tombolDownload").removeClass("d-none");
          if ($.fn.DataTable.isDataTable("#tablelo")) {
            $("#tablelo").DataTable().destroy();
          }

          var datanya = [];
          $.each(data, function (index, lo) {
            datanya.push({
              tanggal_muat: lo.tanggal_muat,
              gudang: lo.nama_gudang,
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
                "https://delapandelapanlogistics.com/itkantorcabang/lo/" +
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
          console.log("Data Gudang Kosong : ", error);
          datalo.empty();
          console.log(error);
          Swal.fire({
            icon: "warning",
            title: "Peringatan!",
            text:
              "Data Alokasi Bulan " +
              $("#alokasi option:selected").text() +
              " Tidak Ditemukan",
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
          });

          $("#filterSearch").addClass("d-none");
          $("#tabelhilangdulu").addClass("d-none");
          $("#tombolDownload").addClass("d-none");
        },
      });
    } else if (
      (alokasi != 0, gudang == 0 && kabupaten != 0 && kecamatan == 0)
    ) {
      $.ajax({
        url:
          "https://delapandelapanlogistics.com/api/lo/" +
          alokasi +
          "/kabupatenbykantor/" +
          kabupaten,
        method: "GET",
        dataType: "json",
        success: function (data) {
          console.log("Data Kabupaten Ada", data);
          $("#filterSearch").removeClass("d-none");
          $("#tabelhilangdulu").removeClass("d-none");
          $("#tombolDownload").removeClass("d-none");
          if ($.fn.DataTable.isDataTable("#tablelo")) {
            $("#tablelo").DataTable().destroy();
          }

          var datanya = [];
          $.each(data, function (index, lo) {
            datanya.push({
              tanggal_muat: lo.tanggal_muat,
              gudang: lo.nama_gudang,
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
                "https://delapandelapanlogistics.com/itkantorcabang/lo/" +
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
          console.log("Data Kabupaten Kosong : ", error);
          datalo.empty();
          console.log(error);
          Swal.fire({
            icon: "warning",
            title: "Peringatan!",
            text:
              "Data Alokasi Bulan " +
              $("#alokasi option:selected").text() +
              " Tidak Ditemukan",
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
          });

          $("#filterSearch").addClass("d-none");
          $("#tabelhilangdulu").addClass("d-none");
          $("#tombolDownload").addClass("d-none");
        },
      });
    } else if (
      (alokasi != 0, gudang != 0 && kabupaten != 0 && kecamatan == 0)
    ) {
      $.ajax({
        url:
          "https://delapandelapanlogistics.com/api/lo/" +
          alokasi +
          "/gudangdankabupaten/" +
          gudang +
          "/" +
          kabupaten,
        method: "GET",
        dataType: "json",
        success: function (data) {
          console.log("Data Gudang Kabupaten Ada", data);
          $("#filterSearch").removeClass("d-none");
          $("#tabelhilangdulu").removeClass("d-none");
          $("#tombolDownload").removeClass("d-none");
          if ($.fn.DataTable.isDataTable("#tablelo")) {
            $("#tablelo").DataTable().destroy();
          }

          var datanya = [];
          $.each(data, function (index, lo) {
            datanya.push({
              tanggal_muat: lo.tanggal_muat,
              gudang: lo.nama_gudang,
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
                "https://delapandelapanlogistics.com/itkantorcabang/lo/" +
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
          console.log("Data Gudang Kabupaten Kosong : ", error);
          datalo.empty();
          console.log(error);
          Swal.fire({
            icon: "warning",
            title: "Peringatan!",
            text:
              "Data Alokasi Bulan " +
              $("#alokasi option:selected").text() +
              " Tidak Ditemukan",
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
          });

          $("#filterSearch").addClass("d-none");
          $("#tabelhilangdulu").addClass("d-none");
          $("#tombolDownload").addClass("d-none");
        },
      });
    } else if (
      (alokasi != 0, gudang == 0 && kabupaten != 0 && kecamatan != 0)
    ) {
      $.ajax({
        url:
          "https://delapandelapanlogistics.com/api/lo/" +
          alokasi +
          "/kecamatanbykabupaten/" +
          kabupaten +
          "/" +
          kecamatan,
        method: "GET",
        dataType: "json",
        success: function (data) {
          console.log("Data Kabupaten Kecamatan Ada", data);
          $("#filterSearch").removeClass("d-none");
          $("#tabelhilangdulu").removeClass("d-none");
          $("#tombolDownload").removeClass("d-none");
          if ($.fn.DataTable.isDataTable("#tablelo")) {
            $("#tablelo").DataTable().destroy();
          }

          var datanya = [];
          $.each(data, function (index, lo) {
            datanya.push({
              tanggal_muat: lo.tanggal_muat,
              gudang: lo.nama_gudang,
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
                "https://delapandelapanlogistics.com/itkantorcabang/lo/" +
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
          console.log("Data Kabupaten Kecamatan Kosong : ", error);
          datalo.empty();
          console.log(error);
          Swal.fire({
            icon: "warning",
            title: "Peringatan!",
            text:
              "Data Alokasi Bulan " +
              $("#alokasi option:selected").text() +
              " Tidak Ditemukan",
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
          });

          $("#filterSearch").addClass("d-none");
          $("#tabelhilangdulu").addClass("d-none");
          $("#tombolDownload").addClass("d-none");
        },
      });
    } else if (
      (alokasi != 0, gudang != 0 && kabupaten != 0 && kecamatan != 0)
    ) {
      $.ajax({
        url:
          "https://delapandelapanlogistics.com/api/lo/" +
          alokasi +
          "/gudangkabupatenkecamatan/" +
          gudang +
          "/" +
          kabupaten +
          "/" +
          kecamatan,
        method: "GET",
        dataType: "json",
        success: function (data) {
          console.log("Data Gudang Kabupaten Kecamatan Ada", data);
          $("#filterSearch").removeClass("d-none");
          $("#tabelhilangdulu").removeClass("d-none");
          $("#tombolDownload").removeClass("d-none");
          if ($.fn.DataTable.isDataTable("#tablelo")) {
            $("#tablelo").DataTable().destroy();
          }

          var datanya = [];
          $.each(data, function (index, lo) {
            datanya.push({
              tanggal_muat: lo.tanggal_muat,
              gudang: lo.nama_gudang,
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
                "https://delapandelapanlogistics.com/itkantorcabang/lo/" +
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
          console.log("Data Gudang Kabupaten Kecamatan Kosong : ", error);
          datalo.empty();
          console.log(error);
          Swal.fire({
            icon: "warning",
            title: "Peringatan!",
            text:
              "Data Alokasi Bulan " +
              $("#alokasi option:selected").text() +
              " Tidak Ditemukan",
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
          });

          $("#filterSearch").addClass("d-none");
          $("#tabelhilangdulu").addClass("d-none");
          $("#tombolDownload").addClass("d-none");
        },
      });
    } else {
      // DATA LOADING ORDER BY ID_KANTOR
      $.ajax({
        url:
          " https://delapandelapanlogistics.com/api/lo/" +
          $("#alokasi").val() +
          "/getbyidkantor/" +
          idkantor,

        method: "GET",
        dataType: "json",
        success: function (data) {
          // console.log("Loading Order Ditemukan : ", data);
          $("#filterSearch").removeClass("d-none");
          $("#tabelhilangdulu").removeClass("d-none");
          $("#hilang").removeClass("d-none");

          if ($.fn.DataTable.isDataTable("#tablelo")) {
            $("#tablelo").DataTable().destroy();
          }

          var datanya = [];
          $.each(data, function (index, lo) {
            datanya.push({
              tanggal_muat: lo.tanggal_muat,
              gudang: lo.nama_gudang,
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
                "https://delapandelapanlogistics.com/itkantorcabang/lo/" +
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
          console.log("Error Semua LO : ", error);
          datalo.empty();
          console.log(error);
          Swal.fire({
            icon: "warning",
            title: "Peringatan!",
            text:
              "Data Alokasi Bulan " +
              $("#alokasi option:selected").text() +
              " Tidak Ditemukan",
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
          });

          $("#filterSearch").addClass("d-none");
          $("#tabelhilangdulu").addClass("d-none");
          $("#tombolDownload").addClass("d-none");
        },
      });
    }
  }
});

function cari() {
  var keyword = $("#keyword").val();
  $("#tablelo").DataTable().search(keyword).draw();
}

function banyaknya() {
  var selectedLength = $("#banyaknya").val();
  $("#tablelo").DataTable().page.len(selectedLength).draw();
}
