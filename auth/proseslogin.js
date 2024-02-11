$("#prosesLogin").click(function () {
  var username = $("#username").val();
  var password = $("#password").val();

  var dataLogin = {
    username: username,
    password: password,
  };

  $.ajax({
    url: "https://delapandelapanlogistics.com/api/auth/proseslogin",
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(dataLogin),
    success: function (data) {
      if (data.id_hak_akses == 2) {
        Swal.fire({
          icon: "success",
          title: "Kantor Pusat",
          text: data.nama_lengkap,
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "https://delapandelapanlogistics.com/kantorpusat";
        });
      } else if (data.id_hak_akses == 3) {
        Swal.fire({
          icon: "success",
          title: "Kantor Cabang",
          text: data.nama_lengkap,
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "https://delapandelapanlogistics.com/kantorcabang";
        });
      } else if (data.id_hak_akses == 4) {
        Swal.fire({
          icon: "success",
          title: "Gudang",
          text: data.nama_lengkap,
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "https://delapandelapanlogistics.com/gudang";
        });
      }
    },
    error: function (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Masuk",
        text: error.responseText,
        timer: 3000,
        showConfirmButton: false,
      });
    },
  });
});

function showPassword() {
  var x = document.getElementById("password");
  var y = document.getElementById("lihatPassword");
  if (x.type === "password") {
    x.type = "text";
    y.innerHTML = "Sembunyikan Password";
  } else {
    x.type = "password";
    y.innerHTML = "Tampilkan Password";
  }
}
