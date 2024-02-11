var idgudang = "";
var idkantor = "";
var idakun = "";
var idalokasi = "";
var idspm = "";
var kodekabupatenkota = "";
var kodekecamatan = "";
var kodealokasi = "";
var alokasitahap = "";
const datalo = $("#datalo");
const datamuat = $("#datamuat");

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

// GET DETAIL DATA GUDANG
$.ajax({
    url: "https://delapandelapanlogistics.com/api/gudang/" + $('#gudang').val(),
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
        url: "https://delapandelapanlogistics.com/api/wilayahkerja/" + idkantor,
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

// KELOMPOKAN BERDASARKAN ALOKASI
$("#alokasi").on("change", function () {
    cekNomorLO($('#alokasi').val());
});

// MENGECEK NOMOR LO YANG SEDANG AKTIF
function cekNomorLO(idalokasi) {
    $.ajax({
        url: "https://delapandelapanlogistics.com/api/lo/" + idalokasi + "/ceknomorlo",
        type: "GET",
        dataType: "json",
        success: function (data) {
            if (data.status == "200") {
                $('#tanggal_pembuatan').val(data.data.tanggal_pembuatan);
                $('#nomor_so').val(data.data.nomor_so);
                $('#nomor_do').val(data.data.nomor_do);
                $('#nomor_lo').val(data.data.nomor_lo);
                $('#nomor_wo').val(data.data.nomor_wo);
                $('#nopolmobil').val(data.data.nomor_mobil);
                $('#namadriver').val(data.data.nama_driver);
                $('#nomordriver').val(data.data.nomor_driver);
                $('#alokasi').prop('disabled', true);
            } else {
                generateNomorLo(idalokasi, data.id_gudang, data.id_kantor_cabang);
                $('#alokasi').prop('disabled', true);
            }
            tampilkanDataMuat();
        },
        error: function (error) {
            generateNomorLo(idalokasi, data.id_gudang, data.id_kantor_cabang);
            $('#alokasi').prop('disabled', true);
        },
    });
}

// MEMBUAT NOMOR LO JIKA TIDAK ADA NOMOR LO YANG AKTIF
function generateNomorLo(idalokasi, id_gudang, id_kantor_cabang) {
    var kodealokasijadi = idalokasi;
    var idkantorjadi = id_kantor_cabang;
    var idgudangjadi = id_gudang;
    if (kodealokasijadi < 10) {
        kodealokasijadi = "0" + kodealokasijadi;
    }
    if (idkantorjadi < 10) {
        idkantorjadi = "0" + idkantorjadi;
    }
    if (idgudangjadi < 10) {
        idgudangjadi = "0" + idgudangjadi;
    }
    console.log({
        'idkantorjadi': idkantorjadi,
        'idgudangjadi': idgudangjadi,
        'idkantorjadi': idkantorjadi
    });

    $.ajax({
        url: "https://delapandelapanlogistics.com/api/lo/" + idalokasi + "/bahannomorlo",
        type: "GET",
        dataType: "json",
        success: function (data) {
            var no = parseInt(data.data.jumlahnya);
            no = no + 1;
            var nomorlo = "LO-88LOGISTICS" + kodealokasijadi + idkantorjadi + idgudangjadi + "-" + no;
            $("#nomor_lo").val(nomorlo);
        },
        error: function (error) {
            console.log("ERROR BARU : ", error);
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
        url: "https://delapandelapanlogistics.com/api/pbp/" + $('#alokasi').val() + "/kecamatanbykabupaten/" + kabupatenkotadipilih,
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

// GET SEMUA DESA KELURAHAN SESUAI DENGAN NAMA KECAMATAN
function showDesaKelurahan() {
    loadingswal();
    const kecamatandipilih = $("#pilihkecamatan").find(":selected").val();
    $.ajax({
        url: "https://delapandelapanlogistics.com/api/pbp/" + $('#alokasi').val() + "/desabykecamatan/" + kecamatandipilih,
        type: "GET",
        dataType: "json",
        success: function (data) {
            datalo.empty();
            $.each(data.datadesakelurahan, function (index, lo) {
                var dnone = "";
                var listlo = "";
                if (lo.jumlah_alokasi == 0) {
                    dnone = "d-none";
                }
                listlo = listlo + "<tr class='" + dnone + "'>" +
                    "<td>" + lo.nama_kabupaten_kota + "</td>" +
                    "<td>" + lo.nama_kecamatan + "</td>" +
                    "<td>" + lo.nama_desa_kelurahan + "</td>" +
                    "<td>" +
                    "<input hidden id='alokasifix" + index + "' type='text' readonly style='border:none; background-color:transparent !important; width:75px' placeholder='0' value='" + lo.jumlah_alokasi + "' >" +
                    "<input id='alokasi" + index + "' type='text' readonly style='border:none; background-color:transparent !important; width:75px' placeholder='0' value='" + lo.jumlah_alokasi + "' ></td>" +
                    "<td>" +
                    "<input id='input" + index + "' type='number' style='border:none; background-color:transparent !important; width:75px' placeholder='0' oninput='cek(" + index + ")'></td>" +
                    "<td class='text-center'>" +
                    "<a type='button' class='text-primary' style='border-radius: 5px;' onclick='proses(" + lo.id_pbp + "," + index + ")'>" +
                    "<i class='fas fa-plus'></i>" +
                    "</a>" +
                    "</td>" +
                    "</tr >";
                datalo.append(listlo);
            });
            Swal.close();
        },
        error: function (error) {
            Swal.close();
            console.error("Error:", error);
        },
    });
}

function cek(index) {
    var alokasi = parseInt($("#alokasi" + index).val());
    if ($("#input" + index).val() === "") {
        $("#input" + index).val("");
    } else {
        var inputpenyaluran = parseInt($("#input" + index).val());
    }
    if (inputpenyaluran > alokasi) {
        $("#input" + index).val(alokasi);
    }
}

function proses(idpbp, index) {
    Swal.fire({
        title: "Loading Order (LO)",
        text: "Apakah anda yakin ? Data Loading Order (LO) akan diproses ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Proses!',
        cancelButtonText: 'Batalkan!',
        confirmButtonColor: '#526AE5',
        cancelButtonColor: '#FF4F70'
    }).then((result) => {
        if (result.isConfirmed) {
            loadingswal();
            var nomor_surat_jalan = $('#nomor_lo').val();
            nomor_surat_jalan = "SJ" + nomor_surat_jalan.slice(2) + "-" + idpbp;
            $.ajax({
                url: "https://delapandelapanlogistics.com/api/suratjalan/" + $('#alokasi').val() + "/ceknomorsj/" + nomor_surat_jalan,
                type: "GET",
                dataType: "json",
                success: function (data) {
                    console.log("SURAT JALAN CEK NOMOR SJ : ", data);
                    if ($("#namadriver").val() == "" || $("#nomordriver").val() == "" || $("#nopolmobil").val() == "") {
                        Swal.close();
                        Swal.fire({
                            icon: "error",
                            title: "Loading Order (LO)",
                            text: "Data Loading Order (LO) gagal ditambahkan, mohon pastikan semua data sudah diiput dengan benar.",
                            showConfirmButton: false,
                            timer: 3000,
                        });
                    } else {
                        if (data.status == "200") {
                            Swal.close();
                            Swal.fire({
                                icon: "error",
                                title: "Loading Order (LO)",
                                text: "Data Loading Order (LO) gagal ditambahkan, untuk mengupdate muatan, mohon hapus terlebih dahulu pada data muat.",
                                showConfirmButton: false,
                                timer: 3000,
                            });
                        } else {
                            $.ajax({
                                url: "https://delapandelapanlogistics.com/api/lo/" + $('#alokasi').val() + "/ceknomorlo/" + $('#nomor_lo').val(),
                                type: "GET",
                                dataType: "json",
                                success: function (data) {
                                    if (data.status == "200") {
                                        var datapostlo = {
                                            'id_gudang': data.id_gudang,
                                            'id_kantor': data.id_kantor_cabang,
                                            'id_akun': data.id_akun,
                                            'nomor_lo': $('#nomor_lo').val(),
                                            'tanggal_muat': $("#tanggal_pembuatan").val(),
                                            'nama_driver': $("#namadriver").val(),
                                            'nomor_driver': $("#nomordriver").val(),
                                            'nomor_mobil': $("#nopolmobil").val(),
                                            'id_pbp': idpbp,
                                            'jumlah_penyaluran_januari': $('#input' + index).val(),
                                            'alokasifix': $('#alokasifix' + index).val(),
                                            'nomor_do': $('#nomor_do').val(),
                                            'nomor_so': $('#nomor_so').val(),
                                            'nomor_wo': $('#nomor_wo').val(),
                                            'nomor_surat_jalan': nomor_surat_jalan,
                                        };
                                        $.ajax({
                                            url: "https://delapandelapanlogistics.com/api/suratjalan/" + $('#alokasi').val() + "/create",
                                            type: "POST",
                                            dataType: "json",
                                            contentType: "application/json",
                                            data: JSON.stringify(datapostlo),
                                            success: function (data) {
                                                Swal.fire({
                                                    icon: "success",
                                                    title: "Loading Order (LO)",
                                                    text: "Data Loading Order (LO) berhasil ditambahkan.",
                                                    showConfirmButton: false,
                                                    timer: 3000,
                                                }).then(() => {
                                                    tampilkanDataMuat();
                                                });
                                            },
                                            error: function (error) {
                                                console.log("ERROR BUAT LO : ", error);
                                                Swal.close();
                                            },
                                        });
                                    } else {
                                        var datapostlo = {
                                            'id_gudang': data.id_gudang,
                                            'id_kantor': data.id_kantor_cabang,
                                            'id_akun': data.id_akun,
                                            'nomor_lo': $('#nomor_lo').val(),
                                            'tanggal_muat': $("#tanggal_pembuatan").val(),
                                            'nama_driver': $("#namadriver").val(),
                                            'nomor_driver': $("#nomordriver").val(),
                                            'nomor_mobil': $("#nopolmobil").val(),
                                            'id_pbp': idpbp,
                                            'jumlah_penyaluran_januari': $('#input' + index).val(),
                                            'alokasifix': $('#alokasifix' + index).val(),
                                            'nomor_do': $('#nomor_do').val(),
                                            'nomor_so': $('#nomor_so').val(),
                                            'nomor_wo': $('#nomor_wo').val(),
                                            'nomor_surat_jalan': nomor_surat_jalan,
                                        };
                                        $.ajax({
                                            url: "https://delapandelapanlogistics.com/api/lo/" + $('#alokasi').val() + "/create",
                                            type: "POST",
                                            dataType: "json",
                                            contentType: "application/json",
                                            data: JSON.stringify(datapostlo),
                                            success: function (data) {
                                                Swal.close();
                                                Swal.fire({
                                                    icon: "success",
                                                    title: "Loading Order (LO)",
                                                    text: "Data Loading Order (LO) berhasil ditambahkan.",
                                                    showConfirmButton: false,
                                                    timer: 3000,
                                                }).then(() => {
                                                    tampilkanDataMuat();
                                                });
                                            },
                                            error: function (error) {
                                                console.log("ERROR BUAT LO : ", error);
                                                Swal.close();
                                            },
                                        });
                                    }
                                },
                                error: function (error) {
                                    console.log("ERROR BUAT LO : ", error);
                                    Swal.close();
                                },
                            });
                        }
                    }
                },
                error: function (error) {
                    Swal.close();
                },
            });
        }
    });
}

function tampilkanDataMuat() {
    loadingswal();
    $("#simpanspm").removeClass("d-none");
    $.ajax({
        url: "https://delapandelapanlogistics.com/api/suratjalan/" + $('#alokasi').val() + "/datasj/" + $('#nomor_lo').val(),
        type: "GET",
        dataType: "json",
        success: function (data) {
            if (data.status == "200") {
                datamuat.empty();
                var total = 0;
                var listdo = "";
                $.each(data.data, function (index, sj) {
                    showDesaKelurahan();
                    total = total + parseInt(sj.jumlah_penyaluran_januari);
                    listdo =
                        "<tr>" +
                        "<td>" + sj.nama_kabupaten_kota + "</td>" +
                        "<td>" + sj.nama_kecamatan + "</td>" +
                        "<td>" + sj.nama_desa_kelurahan + "</td>" +
                        "<td><input id='alokasidata" + index + "' type='text' readonly style='border:none; background-color:transparent !important; width:75px' placeholder='0' value='" + sj.jumlah_pbp * 10 + "' ></td>" +
                        "<td>" +
                        "<input readonly value='" + sj.jumlah_penyaluran_januari + "' id='inputdata" + index + "' type='number' style='border:none; background-color:transparent !important; width:75px'>" +
                        "</td>" +
                        "<td class='text-center'>" +
                        "<a type='button' class='text-danger' style='border-radius: 5px;' onclick='hapusLo(" + sj.id_sj + "," + index + ")'>" +
                        "<i class='fas fa-edit'></i>" +
                        "</a>" +
                        "</td>" +
                        "</tr >";
                    datamuat.append(listdo);
                });
                listdo = "";
                listdo = "<tr><td colspan='4' style='text-align: center; font-weight:bold'>Total</td><td style='font-weight:bold'>" + total + "</td><td></td></tr>"
                datamuat.append(listdo);
                $('#totalpengiriman').val(total);
                Swal.close();
            } else {
                datamuat.empty();
                Swal.close();
            }
        },
        error: function (error) {
            datamuat.empty();
            Swal.close();
        },
    });
}

function hapusLo(idsj, index) {
    Swal.fire({
        title: "Loading Order (LO)",
        text: "Data Loading Order (LO) akan dihapus ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batalkan!',
        confirmButtonColor: '#526AE5',
        cancelButtonColor: '#FF4F70'
    }).then((result) => {
        if (result.isConfirmed) {
            loadingswal();
            var datahapus = {
                'alokasi_hapus': $("#inputdata" + index).val(),
                'id_sj': idsj
            };
            $.ajax({
                url: "https://delapandelapanlogistics.com/api/suratjalan/" + $('#alokasi').val() + "/delete",
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(datahapus),
                success: function (data) {
                    $.ajax({
                        url: "https://delapandelapanlogistics.com/api/suratjalan/" + $('#alokasi').val() + "/ceknomorlo/" + $('#nomor_lo').val(),
                        type: "GET",
                        dataType: "json",
                        success: function (data) {
                            Swal.close();
                            if (data.status == "404") {
                                $.ajax({
                                    url: "https://delapandelapanlogistics.com/api/lo/" + $('#alokasi').val() + "/deletelo/" + ('#nomor_lo').val(),
                                    type: "DELETE",
                                    dataType: "json",
                                    success: function (data) {
                                    },
                                    error: function (error) {
                                    },
                                });
                            }
                        },
                        error: function (error) {
                            $.ajax({
                                url: "https://delapandelapanlogistics.com/api/lo/" + $('#alokasi').val() + "/deletelo/" + $('#nomor_lo').val(),
                                type: "DELETE",
                                dataType: "json",
                                success: function (data) {
                                    console.log("CEK HAPUS LO : ", data);
                                },
                                error: function (error) {
                                    console.log("ERROR HAPUS LO : ", error);
                                },
                            });
                            console.log("ERROR CEK NOMOR LO DI SJ : ", error);
                        },
                    });
                    Swal.fire({
                        icon: "success",
                        title: "Loading Order (LO)",
                        text: "Data Loading Order (LO) berhasil dihapus.",
                        showConfirmButton: false,
                        timer: 3000,
                    }).then(() => {
                        tampilkanDataMuat();
                    });
                },
                error: function (error) {
                },
            });
        }
    });
}

$("#simpanspm").on("click", function () {
    Swal.fire({
        title: "Loading Order (LO)",
        text: "Apakah anda yakin ? Data Loading Order (LO) akan diproses ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Proses!',
        cancelButtonText: 'Batalkan!',
        confirmButtonColor: '#526AE5',
        cancelButtonColor: '#FF4F70'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: "https://delapandelapanlogistics.com/api/lo/" + $('#alokasi').val() + "/ceknomorlosubmit",
                type: "GET",
                dataType: "json",
                success: function (data) {
                    Swal.close();
                    Swal.fire({
                        icon: "success",
                        title: "Loading Order (LO)",
                        text: "Data Loading Order (LO) berhasil ditambahkan.",
                        showConfirmButton: false,
                        timer: 3000,
                    }).then(() => {
                        window.location.reload();
                    });
                },
                error: function (error) {
                },
            });
        }
    });
});

