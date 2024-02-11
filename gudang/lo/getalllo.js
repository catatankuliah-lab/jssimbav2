const datalo = $("#datalo");

function loadingswal() {
  Swal.fire({
    text: 'Memuat Data...',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
}

$(function () {
  $('input[name="datatanggal"]').daterangepicker(
    {
      opens: "left",
    },
    function (start, end, label) {
    }
  );
});

// GET DETAIL DATA GUDANG
$.ajax({
  url: "http://localhost:8080/api/gudang/" + $('#gudang').val(),
  type: "GET",
  dataType: "json",
  success: function (data) {
    $('#containergudang').removeClass('d-none');
    $("#gudang").val(data.nama_gudang);
    getWilayahKerja(data.id_kantor_cabang);
  },
  error: function (error) {
  },
});

// GET WILAYAH KERJA
function getWilayahKerja(idkantor) {
  datalo.empty();
  $.ajax({
    url: "http://localhost:8080/api/wilayahkerja/" + idkantor,
    type: "GET",
    dataType: "json",
    success: function (data) {
      const kabupatenkota = $("#pilihkabupatenkota");
      $.each(data, function (index, listkabupatenkota) {
        const listoptionkabupatenkota =
          "<option value='" +
          listkabupatenkota.nama_kabupaten_kota +
          "'>" +
          listkabupatenkota.nama_kabupaten_kota +
          "</option>";
        kabupatenkota.append(listoptionkabupatenkota);
      });
    },
    error: function (error) {
    },
  });
}

// GET SEMUA KECAMATAN SESUAI DENGAN NAMA KABUPATEN KOTA
function showKecamatan() {
  const kabupatenkotadipilih = $("#pilihkabupatenkota").find(":selected").val();
  datalo.empty();
  const kecamatan = $("#pilihkecamatan");
  if (kabupatenkotadipilih == 0) {
    kecamatan.empty();
    var listoptionkecamatan =
      "<option value='0'>Pilih Kecamatan</option>";
    kecamatan.append(listoptionkecamatan);
  }
  $.ajax({
    url: "http://localhost:8080/api/pbp/" + $('#alokasi').val() + "/kecamatanbykabupaten/" + kabupatenkotadipilih,
    type: "GET",
    dataType: "json",
    success: function (data) {
      kecamatan.empty();
      var listoptionkecamatan =
        "<option value='0'>Pilih Kecamatan</option>";
      kecamatan.append(listoptionkecamatan);
      $.each(data.datakecamatan, function (index, listkecamatan) {
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
    },
  });
}

// SET FORMAT DATA
$("#tamilkanlo").click(function () {
  if ($('#alokasi').val() == null) {
    Swal.fire({
      icon: "error",
      title: "Loading Order (LO)",
      text: "Pilih alokasi terlebih dahulu",
      showConfirmButton: false,
      timer: 3000,
    });
  } else {
    var bahantanggal = $('#datatanggal').val();
    var tanggal = bahantanggal.substring(3, 5);
    var bulan = bahantanggal.substring(0, 2);
    var tahun = bahantanggal.substring(6, 10);
    var mulai = tahun + "-" + bulan + "-" + tanggal;
    tanggal = bahantanggal.substring(16, 18);
    bulan = bahantanggal.substring(13, 15);
    tahun = bahantanggal.substring(19, 23);
    var akhir = tahun + "-" + bulan + "-" + tanggal;
    $.ajax({
      url: "http://localhost:8080/api/lo/" + $('#alokasi').val() + "/filter/" + mulai + "/" + akhir,
      type: "GET",
      dataType: "json",
      success: function (data) {
        if (data.status == "200") {
          $('#filterdatatable').removeClass('d-none');
          $('#tablelo').removeClass('d-none');
          var datanya = [];
          var nomorwo = "";
          $.each(data.data, function (index, lo) {
            if (lo.nomor_wo == "") {
              nomorwo = "BELUM DIISI";
            } else {
              nomorwo = lo.nomor_wo;
            }
            datanya.push({
              tanggal_muat: lo.tanggal_muat,
              nomor_wo: nomorwo,
              nomor_lo: lo.nomor_lo,
              pengirim:
                lo.nomor_mobil +
                " / " +
                lo.nama_driver +
                " (" +
                lo.nomor_driver +
                ")",
              muatan: lo.total,
              status: lo.status_dokumen_muat,
              link: {
                link1: "http://localhost:8080/gudang/lo/detail/" + lo.nomor_lo,
                link2: "lo/downloadPDFLO/" + $('#alokasi').val() + "/" + lo.nomor_lo,
              }
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
              { data: "nomor_wo" },
              { data: "nomor_lo" },
              { data: "pengirim" },
              {
                data: "muatan",
                className: "text-center",
              },
              { data: "status" },
              {
                data: "link",
                render: function (data, type, row, meta) {
                  return (
                    "<a href=" +
                    data.link1 +
                    " type='button' class='text-primary' style='border-radius: 5px;'>" +
                    "<i class='fas fa-search-plus'></i></a>" +
                    "<a href=" +
                    data.link2 +
                    " type='button' class='text-danger ml-3' style='border-radius: 5px;'>" +
                    "<i class='fas fa-download'></i></a>"
                  );
                },
                className: "text-center",
              },
            ],
          });
        } else {
          $('#filterdatatable').addClass('d-none');
          $('#tablelo').addClass('d-none');
          $('#tablelo_paginate').addClass('d-none');
          Swal.fire({
            icon: "error",
            title: "Loading Order (LO)",
            text: "Data Loading Order (LO) tidak ditemukan.",
            showConfirmButton: false,
            timer: 3000,
          });
        }
      },
      error: function (error) {
        console.log("ERROR DATA LO : ", error);
      },
    });
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
